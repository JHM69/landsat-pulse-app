# Remove all containers
docker rm -f $(docker ps -aq)

# Remove all images
docker rmi -f $(docker images -aq)

# Remove all networks
docker network prune -f

# Remove all volumes
docker volume prune -f
