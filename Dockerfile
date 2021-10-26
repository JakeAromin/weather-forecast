FROM node:14.17-buster-slim

ENV TZ=Pacific/Auckland

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

#RUN npm run tsc

CMD [ "npm", "start" ]

EXPOSE 3000