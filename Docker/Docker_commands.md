### Here are the most common Docker commands grouped by their use:


### Docker Basics
- **`docker version`**: Show Docker version information.
- **`docker --version`**: Show Docker client version & server version. 
- **`docker info`**: Display system-wide information.
- **`docker --help`**: List available Docker commands.

### Images
- **`docker pull <image>`**: Download an image from a registry (Dockerhub)
- **`docker images`**: List all locally stored images.
- **`docker rmi <image>`**: Remove a local image.

### Containers
- **`docker run <image>`**: Create and start a new container from an image.
- **`docker ps`**: List running containers.
- **`docker ps -a`**: List all containers (including stopped).
- **`docker stop <container id>`**: Stop a running container.
- **`docker start <container id>`**: Start a stopped container.
- **`docker rm <container id>`**: Remove a container.
- **`docker exec -it <container> <command> /bin/bash`**: Execute a command inside a running container.

### Container Logs and Monitoring
- **`docker logs <container>`**: Show logs from a container.
- **`docker stats`**: Display resource usage statistics for containers.

### Networks
- **`docker network ls`**: List networks.
- **`docker network create <network>`**: Create a new network.
- **`docker network connect <network> <container>`**: Connect a container to a network.
- **`docker network disconnect <network> <container>`**: Disconnect a container from a network.

### Volumes
- **`docker volume ls`**: List volumes.
- **`docker volume create <volume>`**: Create a new volume.
- **`docker volume rm <volume>`**: Remove a volume.

### Docker Compose
- **`docker-compose up`**: Create and start services.
- **`docker-compose down`**: Stop and remove services.
- **`docker-compose ps`**: List services managed by Compose.

### Image Management
- **`docker build -t <image_name> .  `**: Build an image from a Dockerfile.
- **`docker run -d -p 80:80 --name <container name > <image_name> `**: Run container form Image.

### Docker Push Custom Image to Docker private Registry or ECR -Elastic Container Registry.
- **`docker tag <image_id> <repository:tag>`**: Tag an image.
- **`docker push <repository:tag>`**: Push an image to a remote registry.

### Docker Cleanup Commands
- **`docker system prune`**: Remove unused containers, images, and networks.
- **`docker container prune`**: Remove all stopped containers.
- **`docker image prune`**: Remove unused images.
- **`docker volume prune`**: Remove unused volumes.

