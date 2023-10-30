FROM node:alpine

RUN addgroup -S nodejs
RUN adduser -S scoby -G nodejs

# Create app directory
RUN mkdir -p /usr/src/scoby
RUN chown scoby:nodejs /usr/src/scoby

USER root
WORKDIR /usr/src/scoby

COPY package*.json ./

RUN npm ci --only=production

# Bundle app source
COPY . .

RUN chown -R scoby:nodejs /usr/src/scoby
USER scoby

EXPOSE 3000
CMD [ "npm", "start" ]