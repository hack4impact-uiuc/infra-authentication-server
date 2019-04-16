FROM node:11.14.0

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json .
COPY yarn.lock .
RUN yarn install

# Bundle app source
COPY . .

EXPOSE 8000
CMD [ "npm", "start" ]
