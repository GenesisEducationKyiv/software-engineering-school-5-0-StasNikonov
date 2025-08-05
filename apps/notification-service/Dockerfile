FROM node:24

WORKDIR /app

COPY package*.json ./
COPY ../shared ./shared
RUN npm install

COPY . .

EXPOSE 50053

CMD ["npm", "run", "dev"]
