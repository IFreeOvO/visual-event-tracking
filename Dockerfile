# 如果镜像源失效，请从这里https://github.com/dongyubin/DockerHub?tab=readme-ov-file找新镜像替换
FROM docker.1ms.run/node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /app
COPY ./*.json ./*.yaml ./.npmrc ./resources ./
COPY ./packages ./packages
COPY ./examples/Vue-mmPlayer ./examples/Vue-mmPlayer
COPY ./apps/log-microservice ./apps/log-microservice
COPY ./apps/server ./apps/server
COPY ./apps/website ./apps/website
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build
RUN pnpm deploy --filter=tracer-server --prod --legacy /prod/tracer-server
RUN pnpm deploy --filter=log-microservice --prod --legacy /prod/log-microservice

FROM docker.1ms.run/nginxinc/nginx-unprivileged:1.27-alpine AS nginx-base
COPY ./resources/docker/nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 8080

FROM nginx-base AS website
COPY --from=build /app/apps/website/dist /usr/share/nginx/html

FROM nginx-base AS example
COPY --from=build /app/examples/Vue-mmPlayer/dist /usr/share/nginx/html

FROM base AS server
COPY --from=build /prod/tracer-server /prod/tracer-server
WORKDIR /prod/tracer-server
CMD ["pnpm", "start:prod"]
EXPOSE 3000

FROM base AS log
COPY --from=build /prod/log-microservice /prod/log-microservice
WORKDIR /prod/log-microservice
CMD ["pnpm", "start:prod"]
EXPOSE 3100
EXPOSE 3300
