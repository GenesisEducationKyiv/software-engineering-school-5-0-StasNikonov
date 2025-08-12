FROM node:24

WORKDIR /app

COPY ./package*.json ./
COPY ./shared ./shared
COPY ./apps ./apps

RUN npm install

WORKDIR /app/apps/notification-service
RUN npm install

EXPOSE 50053
EXPOSE 9102

CMD ["npm", "run", "dev"]
