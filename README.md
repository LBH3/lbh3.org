# lbh3.org

[![Build Status](https://travis-ci.org/LBH3/lbh3.org.svg?branch=master)](https://travis-ci.org/LBH3/lbh3.org)
[![Greenkeeper badge](https://badges.greenkeeper.io/LBH3/lbh3.org.svg)](https://greenkeeper.io/)

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

You will want to start by installing [sequelize](https://www.npmjs.com/package/sequelize) globally:

```shell
npm install -g sequelize
```

To create the `lbh3` database:

```shell
createdb lbh3
```

To create a new migration:

```shell
sequelize migration:create --name="migration-name"
```

As you’re developing, you might want to migrate down and then back up, which you can do with the following:

```shell
npm run sequelize:migrate:rerun
```

To just migrate the database up:

```shell
npm run sequelize:migrate
```

To just migrate the database down:

```shell
npm run sequelize:migrate:undo
```

## Development mode

Development mode can be started with

```
npm run start:development
```

## Production mode

In Unix environment, the production application can be started like this:

```
npm run start:production
```
