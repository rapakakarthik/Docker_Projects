# Use CentOS 8 as the base image
FROM centos:8

# Replace the repository URLs with the vault archive URLs
RUN sed -i 's|mirrorlist=|#mirrorlist=|g' /etc/yum.repos.d/CentOS-*.repo && \
    sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-*.repo && \
    yum clean all && \
    yum -y update && \
    yum -y install httpd && \
    yum clean all

# Copy the custom index.html to the Apache web directory
COPY index.html /var/www/html/index.html

# Expose port 80 to serve web content
EXPOSE 80

# Start Apache in the foreground
CMD ["/usr/sbin/httpd", "-D", "FOREGROUND"]
