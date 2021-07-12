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

# Cron:
RUN apt-get update && apt-get -y install cron

# Copy hello-cron file to the cron.d directory
COPY ./statistics-crontab /etc/cron.d/statistics-crontab
 
# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/statistics-crontab

# Apply cron job
RUN crontab /etc/cron.d/statistics-crontab
 
# Create the log file to be able to run tail
RUN touch /var/log/cron.log
 
# Run the command on container startup
CMD cron && tail -f /var/log/cron.log
