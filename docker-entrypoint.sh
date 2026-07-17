#!/bin/sh
set -e

# Uploaded photos live at ./public/uploads, which the container runner
# should bind-mount directly to persistent storage (not a symlink to it —
# Next.js's standalone static file server refuses to serve files whose
# real path resolves outside public/, which a symlink would trigger).
# The SQLite database lives under /data, also expected to be mounted.
mkdir -p /data ./public/uploads

npx prisma migrate deploy

exec node server.js
