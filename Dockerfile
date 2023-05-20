FROM node:20-alpine AS base
WORKDIR /usr/src/minimal-tab
RUN npm i -g pnpm
COPY package.json pnpm-lock.yaml tsconfig.json ./

FROM base AS build
RUN pnpm i --frozen-lockfile
COPY ./src ./src
RUN pnpm build

FROM base AS deploy
COPY static ./static
RUN pnpm i --frozen-lockfile --prod
COPY --from=build /usr/src/minimal-tab/dist ./dist

CMD [ "pnpm", "start" ]

