FROM  mhart/alpine-node-auto:latest
COPY . /var/www
RUN cd /var/www; yarn install; ls;
WORKDIR /var/www
ENV SERVICE_PORT 80
EXPOSE ${SERVICE_PORT}
CMD yarn run build && yarn run bootstrap && yarn run start