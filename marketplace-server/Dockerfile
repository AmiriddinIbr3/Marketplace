FROM node:18-alpine

WORKDIR /dockerWorkdir

COPY ./package.json ./package-lock.json ./tsconfig.json  ./

RUN npm install

COPY ./prisma/schema.prisma ./prisma/

RUN npx prisma generate --schema ./prisma/schema.prisma

COPY . .

RUN npm run build

EXPOSE 3000

CMD [  "npm", "run", "start:migrate:prod" ]