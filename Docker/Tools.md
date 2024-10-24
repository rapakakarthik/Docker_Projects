sudo apt-get update -y                                # Updates the package lists for upgrades and new package installations.
sudo apt-get install docker.io -y                     # Installs the Docker package from the Ubuntu repositories.
sudo usermod -aG docker ubuntu                        # Adds the current user (assumed to be "ubuntu") to the "docker" group.
                                                      #This allows the user to run Docker commands without using sudo
newgrp docker
sudo chmod 777 /var/run/docker.sock                   # Changes the permissions of the Docker socket to allow all users read, write, and execute access
docker --version                                      # Displays the version of Docker installed.
docker version                                        # Shows more detailed version information about Docker client and server.