FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN npm run build

RUN chmod -R 777 /usr/src/app/build

CMD [ "node", "build/js" ]
