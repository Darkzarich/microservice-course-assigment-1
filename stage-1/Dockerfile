FROM node:20.17.0-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack@latest
RUN corepack enable

WORKDIR /app

COPY . .

RUN pnpm install --prod --frozen-lockfile

CMD ["node", "index.js"]

