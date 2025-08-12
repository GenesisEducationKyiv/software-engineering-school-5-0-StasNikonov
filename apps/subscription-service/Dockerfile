FROM node:24

WORKDIR /app

COPY ./package*.json ./
COPY ./shared ./shared
COPY ./apps ./apps

RUN npm install

WORKDIR /app/apps/subscription-service
RUN npm install

EXPOSE 50052
EXPOSE 910

CMD ["npm", "run", "dev"]
