FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache git curl bash && \
    rm -f /usr/local/bin/yarn /usr/local/bin/yarnpkg && \
    curl -o /tmp/yarn-4.4.0.tar.gz -L https://github.com/yarnpkg/berry/archive/refs/tags/@yarnpkg/cli/4.4.0.tar.gz && \
    mkdir -p /opt/yarn && \
    tar -xzf /tmp/yarn-4.4.0.tar.gz -C /opt/yarn --strip-components=1 && \
    ln -s /opt/yarn/packages/yarnpkg-cli/bin/yarn.js /usr/local/bin/yarn && \
    ln -s /opt/yarn/packages/yarnpkg-cli/bin/yarn.js /usr/local/bin/yarnpkg && \
    rm -rf /tmp/yarn-4.4.0.tar.gz

COPY . .

RUN apk add --update git && \
    git init && \
    git submodule init && \
    git submodule update && \
    yarn install && \
    yarn cache clean && \
    rm -rf .git && \
    rm -rf /root/.cache && \
    rm -rf /root/.npm && \
    rm -rf /root/.yarn && \
    rm -rf /tmp/* && \
    apk del git curl && \
    rm -rf /var/cache/apk/*

EXPOSE 3000

CMD ["yarn", "dev"]
