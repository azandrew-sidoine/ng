FROM node:18.20.3-alpine AS Builder

ENV NODE_OPTIONS="--max-old-space-size=8192"
ARG NODE_AUTH_TOKEN
ARG NG_VERSION=0.1.0
ARG NG_API_URL=
ARG NG_AUTH_URL=
ARG NG_AUTH_CLIENT=
ARG NG_AUTH_CLIENT_TOKEN=
ARG NG_STORAGE_SECRET=MySecret
ARG NG_STORAGE_PREFIX=APP

WORKDIR /app

# Copy application data to container app dir
COPY . .

# Install project packages
RUN npm install

# Build the angular project
RUN npm run build

FROM nginx:1.25.2-alpine

COPY --from=Builder /app/dist/ /usr/share/nginx/html/

COPY ./nginx/conf.d/ /etc/nginx/conf.d/

# Expose port 80
EXPOSE 80

# When the container starts, replace the environment.json with values from environment variables
CMD ["/bin/sh",  "-c",  "exec nginx -g 'daemon off;'"]