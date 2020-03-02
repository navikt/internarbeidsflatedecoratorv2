FROM node as builder

RUN ln -fs /usr/share/zoneinfo/Europe/Oslo /etc/localtime
RUN npm install -g npm@latest
ENV CI=true

ADD / /source
WORKDIR /source
RUN npm ci
ENV NODE_ENV=production
RUN npm run build

ENV NODE_ENV=development
WORKDIR /source/v2
RUN npm ci
ENV NODE_ENV=production
RUN npm run build

ENV NODE_ENV=development
WORKDIR /source/v2.1
RUN npm ci
ENV NODE_ENV=production
RUN npm run build

FROM navikt/pus-nginx:20.20191015.1303
COPY --from=builder /source/build /usr/share/nginx/html/internarbeidsflatedecorator
COPY --from=builder /source/v2/build /usr/share/nginx/html/internarbeidsflatedecorator/v2
COPY --from=builder /source/v2.1/build /usr/share/nginx/html/internarbeidsflatedecorator/v2.1
