FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get -y install software-properties-common

RUN add-apt-repository ppa:ondrej/php

RUN apt-get update && \ 
    apt-get -y install apache2 php8.1 
    
    
RUN apt-get -y install php8.1-mysql php8.1-pgsql php8.1-opcache php8.1-mbstring php8.1-xml php8.1-gd php8.1-curl php8.1-zip

COPY ./info.php /var/www/html/

RUN chown -R www-data:www-data /var/www/html    

EXPOSE 80

CMD [ "apache2ctl", "-D", "FOREGROUND" ]