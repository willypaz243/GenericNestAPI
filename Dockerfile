FROM node:22

WORKDIR /usr/src/app

COPY . .

RUN npm install -g pnpm

RUN pnpm install

EXPOSE 3000

RUN pnpm build

CMD pnpm migrations:run && node dist/main