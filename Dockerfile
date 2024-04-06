# line 3 initialises build stage and sets base image called build
# using node here as base image
FROM node:21-alpine3.18 AS build
# line 5 which port the app will listen on
EXPOSE 80
# line 8 -if directory does not exist, WORKDIR creates it
# line 8 path is relative to current working directory
WORKDIR /app
# line 10 copy all files from current location to workdir
COPY . .
# line 12 install node libraries
RUN npm install
# line 14 same as ng build :-)
RUN npm run build
# line 16 add another image to build base, the nginx web server
FROM nginx:alpine
# line 18 copy the buit application to the nginx root dir at /html
COPY --from=build /app/dist/assignment-part2 /usr/share/nginx/html

