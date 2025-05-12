import argparse
import subprocess
import random
import logging
import docker
import webbrowser
import os
from flask import Flask, jsonify, render_template_string

# Set up logging
#logging.basicConfig(filename='/var/log/container_manager.log', level=logging.INFO, format='%(asctime)s - %(message)s')

# Initialize Flask app
app = Flask(__name__)

# Initialize Docker client
client = docker.from_env()

# Global variable to store started container info
started_container_info = {}
#DOCKERFILE_PATH = 'Dockerfile'  # Path to the Dockerfile

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DOCKERFILE_PATH = os.path.join(BASE_DIR, 'Dockerfile')
CONFIG_FILE = os.path.join(BASE_DIR, 'haproxy.cfg')


def validate_haproxy_config(CONFIG_FILE):
    """Validates the HAProxy configuration file."""
    try:
        subprocess.run(['sudo', 'haproxy', '-f', CONFIG_FILE, '-c'], check=True)
        return True
    except subprocess.CalledProcessError:
        print("The configuration file contains errors.")
        return False

def server_exists(backend_name, server_name, lines):
    """Checks if a server name already exists in the specified backend."""
    backend_start = False
    for line in lines:
        if line.strip() == f"backend {backend_name}":
            backend_start = True
        elif backend_start and line.strip().startswith("server"):
            if server_name in line:
                return True
        elif backend_start and line.strip().startswith("backend") and line.strip() != f"backend {backend_name}":
            backend_start = False
    return False

def build_docker_image():
    """Builds the universal Docker image once."""
    try:
        subprocess.run(['docker', 'build', '-t', 'my-universal-server-image', '-f', DOCKERFILE_PATH, BASE_DIR], check=True)
        print("Docker image 'my-universal-server-image' built successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error building Docker image: {e}")

def add_servers_to_backend(backend_name, servers):
    """Adds multiple new servers to a backend in the HAProxy config file."""
    
    temp_file = '/tmp/haproxy.cfg'
    with open(CONFIG_FILE, 'r') as file:
        lines = file.readlines()

    new_lines = []
    backend_start = False
    for line in lines:
        new_lines.append(line)
        if line.strip() == f"backend {backend_name}":
            backend_start = True
        elif backend_start and not line.startswith('    server'):
            for server in servers:
                name, ip, port = server
                if not server_exists(backend_name, name, lines):
                    new_server_line = f"    server {name} {ip}:{port} check\n"
                    new_lines.append(new_server_line)
            backend_start = False

    try:
        with open(temp_file, 'w') as file:
            file.writelines(new_lines)
    except PermissionError:
        print(f"Permission denied to write to config file {temp_file}.")
        return

    if not validate_haproxy_config(temp_file):
        print("Configuration file has errors. Changes not applied.")
        return

    try:
        subprocess.run(['sudo', 'mv', temp_file, CONFIG_FILE], check=True)
        subprocess.run(['sudo', 'systemctl', 'restart', 'haproxy'], check=True)
        print(f"Servers added to backend {backend_name} and HAProxy restarted.")
    except subprocess.CalledProcessError:
        print("Error updating or restarting HAProxy.")

def remove_server_from_backend(backend_name, server_name):
    """Removes a server from a backend in the HAProxy config file."""
    

    with open(CONFIG_FILE, 'r') as file:
        lines = file.readlines()

    new_lines = []
    backend_start = False
    for line in lines:
        if line.strip() == f"backend {backend_name}":
            backend_start = True
        elif backend_start and line.strip().startswith(f"server {server_name} "):
            continue
        elif backend_start and line.strip().startswith("backend") and line.strip() != f"backend {backend_name}":
            backend_start = False
        new_lines.append(line)

    try:
        with open('/tmp/haproxy.cfg', 'w') as file:
            file.writelines(new_lines)
    except PermissionError:
        print("Permission denied to write to /tmp/haproxy.cfg.")
        return

    try:
        subprocess.run(['sudo', 'mv', '/tmp/haproxy.cfg', CONFIG_FILE], check=True)
        subprocess.run(['sudo', 'systemctl', 'restart', 'haproxy'], check=True)
        print(f"Server {server_name} removed from backend {backend_name} and HAProxy restarted.")
    except subprocess.CalledProcessError:
        print("Error moving the temporary config file.")

def get_backends(CONFIG_FILE):
    """Returns a dictionary of all backends and their servers."""
    backends = {}
    current_backend = None

    with open(CONFIG_FILE, 'r') as file:
        lines = file.readlines()
    
    backend_start = False
    for line in lines:
        if line.startswith('backend '):
            current_backend = line.strip().split(' ')[1]
            backends[current_backend] = []
            backend_start = True
        elif backend_start and line.startswith('    server '):
            parts = line.strip().split(' ')
            server_name = parts[1]
            ip_port = parts[2].split(':')
            ip = ip_port[0]
            port = ip_port[1]
            backends[current_backend].append((server_name, ip, port))
        elif backend_start and line.startswith('backend ') and line.strip() != f'backend {current_backend}':
            backend_start = False
    return backends

def start_docker_container(container_name):
    """Starts a Docker container and returns its IP address and exposed port."""
    docker_image_name = 'my-universal-server-image'  # Use the correct image name
    try:
        if not any(docker_image_name in image.tags for image in client.images.list()):
            build_docker_image()

        container = client.containers.run(
            docker_image_name,
            name=container_name,
            detach=True,
            ports={'1880/tcp': None}  # Map Node-RED port
        )
        container.reload()
        ip_address = container.attrs['NetworkSettings']['IPAddress']
        ports = container.attrs['NetworkSettings']['Ports']

        if not ports or '1880/tcp' not in ports or not ports['1880/tcp']:
            return container, ip_address, None

        host_port = ports['1880/tcp'][0]['HostPort']
        return container, ip_address, host_port

    except docker.errors.ImageNotFound:
        print(f"Image '{docker_image_name}' not found.")
        return None, None, None
    except docker.errors.APIError as e:
        print(f"Error starting container: {e}")
        return None, None, None

def stop_docker_container(container):
    """Stops and removes a Docker container."""
    container.stop()
    container.remove()

def start_random_container(backends):
    """Starts a random container from a random backend."""
    if not backends:
        print("No backends available.")
        return

    random_backend = random.choice(list(backends.keys()))
    containers = backends[random_backend]

    if not containers:
        print(f"No containers found in backend '{random_backend}'.")
        return

    container_info = random.choice(containers)
    container_name = container_info[0]

    env_vars = {'SERVER_NAME': container_name}

    container, ip, port = start_docker_container(container_name)

    if container:
        print(f"Container '{container_name}' started at IP {ip} and port {port}...")
        #logging.info(f"Container '{container_name}' started at IP {ip} and port {port}.")
        global started_container_info
        started_container_info = {
            "backend": random_backend,
            "server": container_name,
            "ip": ip,
            "port": port
        }
    else:
        print(f"Error starting container '{container_name}'")

def random_container_start():
    """Randomly selects and starts a container from the available HAProxy config."""
    config_file = '/etc/haproxy/haproxy.cfg'
    backends = get_backends(config_file)

    if not backends:
        print("No backends found.")
        return

    start_random_container(backends)

@app.route('/start_random_container', methods=['GET'])
def start_random_container_route():
    """API route to start a random container."""
    random_container_start()
    if started_container_info:
        return jsonify(started_container_info)
    else:
        return jsonify({"error": "No container started"}), 500

@app.route('/')
def index():
    return render_template_string("""
        <h1>Container Manager</h1>
        <p><a href="/start_random_container">Start a random container</a></p>
    """)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Manage HAProxy servers and containers.')
    parser.add_argument('action', choices=['add', 'remove', 'random'], help='Action to perform (add, remove, or random)')
    parser.add_argument('backend', type=str, nargs='?', help='Name of the backend (required for add and remove)')
    parser.add_argument('name', type=str, nargs='?', help='Name of the server (required for add and remove)')
    parser.add_argument('ip', type=str, nargs='?', help='IP address of the server (required for add)')
    parser.add_argument('port', type=int, nargs='?', help='Port of the server (required for add)')

    args = parser.parse_args()

    if args.action == 'add':
        if not args.backend or not args.name or not args.ip or not args.port:
            parser.error("Add action requires backend, server name, IP address, and port.")
        add_servers_to_backend(args.backend, [(args.name, args.ip, args.port)])
    elif args.action == 'remove':
        if not args.backend or not args.name:
            parser.error("Remove action requires backend and server name.")
        remove_server_from_backend(args.backend, args.name)
    elif args.action == 'random':
        random_container_start()
    
    else:
        print("Invalid action. Use 'add', 'remove', or 'random'.")
