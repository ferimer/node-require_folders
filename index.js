'use strict';

const fs = require('fs');
const path = require('path');

function getCaller() {
  const originalStackTrace = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack) => stack;
  const err = new Error();
  const caller = err.stack[2].getFileName();
  Error.prepareStackTrace = originalStackTrace;
  return caller;
}

module.exports = base_path => {
  if (!base_path || typeof base_path !== 'string') {
    // Got caller path
    base_path = path.parse(getCaller()).dir;
  }

  const modules = {};

  fs.readdirSync(base_path).forEach(f => {
    if (fs.lstatSync(path.join(base_path, f)).isDirectory()) {
      modules[f] = require(path.join(base_path, f));
    }
  });

  return modules;
};
