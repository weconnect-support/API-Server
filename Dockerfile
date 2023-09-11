FROM node:latest

RUN apt update && apt -y dist-upgrade && \
        apt install -y vim
RUN useradd -m run
WORKDIR /home/run
COPY .gitignore ./
COPY ./.git ./.git
COPY README.md ./
COPY package.json ./
COPY yarn.lock ./
COPY ./routes ./routes
COPY index.js ./
COPY run.sh ./
COPY .babelrc ./
RUN yarn global add pm2
RUN yarn install
RUN git config --global --add safe.directory /home/run
#RUN yarn add -D @babel/core @babel/node @babel/preset-env babel-eslint
#RUN yarn add global babel-node
#RUN 
#RUN pm2 start --name "node_es6" npm -- run server --watch
#RUN 

#CMD sh run.sh
CMD tail -f /dev/null
