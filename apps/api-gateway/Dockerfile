FROM node:24

WORKDIR /app

COPY ./package*.json ./
COPY ./shared ./shared
COPY ./apps ./apps

RUN npm install

WORKDIR /app/apps/api-gateway
RUN npm install

EXPOSE 3001

CMD ["npm", "run", "dev"]
