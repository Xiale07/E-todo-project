#!/bin/sh

set -e

host="$1"
shift
cmd="$@"

until nc -z "$host" 3306; do
  >&2 echo "⏳ MySQL non prêt ($host:3306)..."
  sleep 1
done

>&2 echo "✅ MySQL est prêt !"
exec $cmd
