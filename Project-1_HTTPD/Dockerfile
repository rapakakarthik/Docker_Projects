FROM ubuntu:latest

RUN apt-get update && \
    apt-get install apache2 -y && \
    apt-get clean 

COPY ./index.html /var/www/html

EXPOSE 80

CMD [ "apache2ctl", "-D", "FOREGROUND" ]