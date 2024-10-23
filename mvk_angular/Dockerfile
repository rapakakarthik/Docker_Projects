# Stage 1
FROM node:18-alpine as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build -- --output-path=./dist/out --configuration production

# Stage 2
FROM httpd:2.4

COPY --from=build-stage /app/dist/out/ /usr/local/apache2/htdocs/

EXPOSE 80