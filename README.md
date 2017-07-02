# lbh3.org

[![Build Status](https://travis-ci.org/LBH3/lbh3.org.svg?branch=master)](https://travis-ci.org/LBH3/lbh3.org)
[![Greenkeeper badge](https://badges.greenkeeper.io/LBH3/lbh3.org.svg)](https://greenkeeper.io/)

LBH3 website

## Contributing

Check out the [contribution guide](CONTRIBUTING.md).

## Getting started

### npm

To install all dependencies, (e.g. after cloning it from a Git repository) run

```
npm install donejs -g
npm install
```

### PostgreSQL

To install [Homebrew](https://brew.sh) & PostgreSQL, run

```shell
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install postgresql
```

After installing PostgreSQL, something similar to the following should be shown:

```
To have launchd start postgresql now and restart at login:
  brew services start postgresql

Or, if you don't want/need a background service you can just run:
  pg_ctl -D /usr/local/var/postgres start
```

You may need to create a symbolic link from the script that actually allows Postgres to run to the LaunchAgents directory and tell `launchctl` to load it:

```shell
ln -sfv /usr/local/opt/postgresql/*.plist ~/Library/LaunchAgents
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist
```

If upgrading from a previous version of PostgreSQL, you might need to run the following:

```shell
rm -rf /usr/local/var/postgres
initdb /usr/local/var/postgres -E utf8
```

After running that command, something similar to the following should be shown:

```shell
You can now start the database server using:
    pg_ctl -D /usr/local/var/postgres -l logfile start
```

## Database

To create the `lbh3` database:

```shell
createdb lbh3
```

To create a new migration with [db-migrate](https://www.npmjs.com/package/db-migrate):

```shell
npm run db-migrate:create migration-name
```

As you’re developing, you might want to migrate down and then back up, which you can do with the following:

```shell
npm run db-migrate:rerun
```

To just migrate the database up:

```shell
npm run db-migrate:up
```

To just migrate the database down:

```shell
npm run db-migrate:down
```

To reset the database:

```shell
npm run db-migrate:reset
```

## Running tests

Tests can be run with

```
donejs test
```

## Development mode

Development mode can be started with

```
donejs develop
```

## Build and production mode

To build the application into a production bundle run

```
donejs build
```

In Unix environment the production application can be started like this:

```
NODE_ENV=production npm start
```
