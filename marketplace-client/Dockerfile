FROM node:18-alpine

WORKDIR /dockerWorkdir

COPY ./package.json ./package-lock.json ./
RUN npm install
COPY . .

RUN npm run build

RUN addgroup app && adduser -S -G app app
USER app

EXPOSE 4000

CMD ["npm", "run", "start"]