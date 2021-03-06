FROM node:16
WORKDIR /movies
COPY ./package*.json ./
RUN npm install
COPY . /movies
RUN npm run prebuild
RUN npm run build
RUN npm run db:refresh
CMD ["npm", "start"]

