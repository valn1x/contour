#!/usr/bin/env bash
set -e

# Outline installation script

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_ROOT"

# check dependencies
REQUIRED_CMDS=(node yarn docker docker-compose)
MISSING=false
for cmd in "${REQUIRED_CMDS[@]}"; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo "Error: $cmd is required but not installed." >&2
        MISSING=true
    fi
done
if [ "$MISSING" = true ]; then
    echo "Please install the missing dependencies and rerun this script." >&2
    exit 1
fi

# create env file if not exists
if [ ! -f .env ]; then
    echo "Creating .env from sample..."
    cp .env.sample .env
    if command -v openssl >/dev/null 2>&1; then
        sed -i "s/^SECRET_KEY=.*/SECRET_KEY=$(openssl rand -hex 32)/" .env
        sed -i "s/^UTILS_SECRET=.*/UTILS_SECRET=$(openssl rand -hex 32)/" .env
    fi
fi

# install node dependencies
echo "Installing node dependencies..."
yarn install --pure-lockfile

# start postgres and redis via docker compose
if command -v docker-compose >/dev/null 2>&1; then
    echo "Starting postgres and redis via docker compose..."
    docker-compose up -d redis postgres
fi

# run migrations
if [ -f ./node_modules/.bin/sequelize ]; then
    echo "Running database migrations..."
    yarn sequelize db:migrate
fi

# build application
echo "Building application..."
yarn build

# remind user how to start
cat <<'MSG'

Installation complete!
You can now start the application with:
  yarn start
MSG

