FROM node:15
USER root
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY tsconfig.json ./


RUN npm install

COPY . .

RUN npm run prisma:generate
RUN npm run prisma:deploy
RUN npm run build:prod
# If you are building your code for production
# RUN npm ci --only=production
# Bundle app source

EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]
