# install stage
FROM node:16-alpine as install-stage
WORKDIR /app
COPY ./package.json /app/
COPY ./package-lock.json /app/
COPY ./tsconfig.json /app/tsconfig.json
COPY ./tailwind.config.js /app/tailwind.config.js
COPY ./.npmrc /app/.npmrc
COPY ./config.ts /app/config.ts
COPY ./.env /app/.env
COPY ./.env-override /app/.env-override
RUN npm install

# build stage
FROM install-stage as build-stage
WORKDIR /app
COPY ./src /app/src
COPY ./public /app/public
RUN npm run build

# production stage
FROM nginx:1.17-alpine as production-stage
COPY --from=build-stage /dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
