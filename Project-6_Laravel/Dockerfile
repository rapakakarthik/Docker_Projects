# Use Ubuntu as the base image
FROM ubuntu:latest

# Set environment variable to avoid interactive prompts during package installations
ENV DEBIAN_FRONTEND=noninteractive

# Update package list and install necessary tools
RUN apt-get update && \
    apt-get -y install software-properties-common curl && \
    add-apt-repository ppa:ondrej/php -y && \
    apt-get update

# Install Apache and PHP with required extensions
RUN apt-get -y install apache2 php8.1 \
    php8.1-mysql php8.1-pgsql php8.1-opcache php8.1-mbstring \
    php8.1-xml php8.1-gd php8.1-curl php8.1-zip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /var/www/html

# Install Composer globally
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer && \
    /usr/local/bin/composer --version # Verify Composer installation

# Copy the Laravel project files into the container
COPY . .

# Install Composer dependencies
RUN /usr/local/bin/composer install --no-interaction --prefer-dist --optimize-autoloader

# Set the proper permissions for storage and cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Enable mod_rewrite for Apache
RUN a2enmod rewrite

# Update Apache's DocumentRoot
RUN echo "DocumentRoot /var/www/html/public" > /etc/apache2/sites-available/000-default.conf

# Expose port 80
EXPOSE 80

# Start Apache server in the foreground
CMD ["apache2ctl", "-D", "FOREGROUND"]
