FROM debian:stable-slim

WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get install -y \
    curl \
    ca-certificates \
    --no-install-recommends

# bash will load volta() function via .bashrc 
# using $VOLTA_HOME/load.sh
SHELL ["/bin/bash", "-c"]

ENV BASH_ENV ~/.bashrc
ENV VOLTA_HOME /root/.volta
ENV PATH $VOLTA_HOME/bin:$PATH
RUN curl https://get.volta.sh | bash



RUN volta install node@lts
RUN volta install pnpm@latest

COPY . .

RUN pnpm install

EXPOSE 3000

RUN pnpm build

CMD pnpm migrations:run && node dist/main