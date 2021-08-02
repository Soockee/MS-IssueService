FROM node:14.17-alpine3.11 AS building

ENV NODE_ENV build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=development

COPY . .

RUN npm run build


FROM node:14-alpine

ARG NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=building /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]