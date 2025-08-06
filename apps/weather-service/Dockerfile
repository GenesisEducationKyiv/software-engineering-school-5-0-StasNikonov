FROM node:24

WORKDIR /app

COPY ./package*.json ./
COPY ./shared ./shared
COPY ./apps ./apps

RUN npm install

WORKDIR /app/apps/weather-service
RUN npm install

EXPOSE 50051
EXPOSE 9100

CMD ["npm", "run", "dev"]
