FROM node:16 as builder

RUN ln -fs /usr/share/zoneinfo/Europe/Oslo /etc/localtime
RUN npm install -g npm@latest
ENV CI=true

COPY / /source
WORKDIR /source
RUN npm ci
ENV NODE_ENV=production
RUN npm run build

FROM nginxinc/nginx-unprivileged
ENV NGINX_ENVSUBST_OUTPUT_DIR /tmp

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /source/build /usr/share/nginx/html/internarbeidsflatedecorator/v2.1