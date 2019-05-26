#!/bin/bash

echo "Creating POSTGRES env variables";
export DATABASE_USER=pguser \
export DATABASE_PASSWORD=secret \
export DATABASE_HOST=localhost \
export DATABASE_PORT=5432 \
export DATABASE_DB=demo

function run_db {

    echo "Pulling POSTGRES docker image";
    docker pull postgres:11

    containerId=$(docker ps -a -q --filter name=POSTGRES_LB4NGEX)

    echo "Stopping previous POSTGRES docker containers";
    docker stop $containerId

    echo "Remove previous POSTGRES docker containers";
    docker rm $containerId

    echo "Starting docker container";
    docker run --name POSTGRES_LB4NGEX -p "$DATABASE_PORT":"$DATABASE_PORT"  \
    -e POSTGRES_PASSWORD="$DATABASE_PASSWORD"  \
    -e POSTGRES_USER="$DATABASE_USER"  \
    -e POSTGRES_DB="$DATABASE_DB" \
    -d postgres:11

    echo "Waiting for POSTGRES container to start..."
    sleep 5s

}