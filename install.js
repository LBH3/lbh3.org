const exec = require('child_process').exec;

const childProcess = exec('npm install', {
  cwd: process.cwd() + '/public'
});
childProcess.stdout.pipe(process.stdout);
childProcess.stderr.pipe(process.stderr);
