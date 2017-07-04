/* eslint-disable no-console */
const app = require('./app');
const exec = require('child_process').exec;
const logger = require('winston');
const path = require('path');

const port = app.get('port');
const server = app.listen(port);

if (process.argv.indexOf('--develop') > -1) {
  const liveReload = path.join('node_modules', '.bin', 'steal-tools live-reload');
  const childProcess = exec(liveReload, {
    cwd: process.cwd() + '/public'
  });
  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stderr);
}

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info(`Feathers application started on ${app.get('host')}:${port}`)
);
