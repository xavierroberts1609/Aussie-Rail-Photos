#!/bin/sh
set -e

# /data is the persistent volume mount (see fly.toml). Keep uploaded photos
# and the SQLite database there so they survive deploys and restarts.
mkdir -p /data/uploads

if [ ! -L ./public/uploads ]; then
  rm -rf ./public/uploads
  ln -s /data/uploads ./public/uploads
fi

npx prisma migrate deploy

exec node server.js
