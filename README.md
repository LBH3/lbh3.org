# lbh3.org

[![Sauce Labs Test Status](https://saucelabs.com/browser-matrix/lbh3.svg)](https://saucelabs.com/u/lbh3)

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
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
brew install postgresql
brew install postgis
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

To enable PostGIS in the database:

```shell
psql lbh3
CREATE EXTENSION postgis;
```

To import a dump:

```
pg_restore --verbose --clean --no-acl --no-owner -h localhost -U user -d lbh3 latest.dump
```

To create a new migration:

```shell
DATABASE_URL="" sequelize migration:create --name="migration-name"
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

## Dependencies

[aws-sdk](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/welcome.html) is used by the backend to communicate with S3.

## Hosting

The website is hosted on [Heroku](https://dashboard.heroku.com/apps/mighty-dawn-85924).

### Config vars

| Variable name | Source |
| ------------- | ------ |
| AWS_ACCESS_KEY_ID | https://us-east-1.console.aws.amazon.com/iam/home#/users/lbh3?section=security_credentials |
| AWS_SECRET_ACCESS_KEY | https://us-east-1.console.aws.amazon.com/iam/home#/users/lbh3?section=security_credentials |
| DATABASE_URL | https://data.heroku.com/datastores/587508e0-73b1-4537-bdad-1481dc893e1e#administration |
| FACEBOOK_CLIENT_ID | https://developers.facebook.com/apps/857733227744669/settings/basic/ |
| FACEBOOK_CLIENT_SECRET | https://developers.facebook.com/apps/857733227744669/settings/basic/ |
| GOOGLE_CLIENT_ID | https://console.cloud.google.com/apis/credentials/oauthclient/809813510693-t2k44p14m42lfcq0ee9kd8quapbrudja.apps.googleusercontent.com?project=lbh3-171321 |
| GOOGLE_CLIENT_SECRET | https://console.cloud.google.com/apis/credentials/oauthclient/809813510693-t2k44p14m42lfcq0ee9kd8quapbrudja.apps.googleusercontent.com?project=lbh3-171321 |
| GOOGLE_OAUTH_PRIVATE_KEY | https://console.cloud.google.com/iam-admin/serviceaccounts/details/113142380371293899569;edit=true/keys?project=lbh3-171321 |
| HEROKU_POSTGRESQL_MAROON_URL | https://data.heroku.com/datastores/587508e0-73b1-4537-bdad-1481dc893e1e#administration |

### Storage

Headshots, PDF Snoozes, and other files are stored on [Amazon S3](https://s3.console.aws.amazon.com/s3/buckets?region=us-west-1).