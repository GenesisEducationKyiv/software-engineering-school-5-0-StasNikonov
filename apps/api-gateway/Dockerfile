FROM node:24

WORKDIR /app

COPY package*.json ./
COPY ../shared ./shared
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]
