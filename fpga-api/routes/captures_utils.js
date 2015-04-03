// Captures module auxiliary and internal functions

// Package dependencies
var scripts = require('child_process');
var path = require('path');
var fs = require('fs');
var config = require('../config.js');
var common = require('./_common.js');


// Module exports

// Gets an array of captures info from the CAPTURES_DIR 
function dataCaptures(simple, pcap, res) {
  // Validator callback
  var validator;
  if (simple && pcap) {
    validator = validCapture;
  } else if (simple) {
    validator = validSimpleCapture;
  } else {
    validator = validPcapCapture;
  }

  // Gets all the files in the CAPTURES_DIR 
  fs.readdir(config.CAPTURES_DIR, function (err, files) {
    if (err) {
      common.logError(err);
      res.sendStatus(500);
      return;
    }
    var dataCaptures = [];
    // For each file
    files.forEach(function (entry) {
      fs.stat(config.CAPTURES_DIR + entry, function (err, stats) {
        if (err) {
          common.logError(err);
          return;
        }

        // Valid capture
        if (stats.isFile() && validator(entry)) {
          // Name
          var dataCapture = {};
          dataCapture['name'] = entry;

          // Type
          if (simple != pcap) {
            dataCapture['type'] = simple ? 'simple' : 'pcap';
          } else if (validSimpleCapture(entry)) {
            dataCapture['type'] = 'simple';
          } else {
            dataCapture['type'] = 'pcap';
          }

          // Size
          dataCapture['size'] = stats['size'];

          // Date
          dataCapture['date'] = common.mtime2string(stats['mtime']);

          // Push the object into the array
          dataCaptures.push(dataCapture);
        }
      });
    });
    sendDataCaptures(res, dataCaptures);
  });
};
exports.dataCaptures = dataCaptures;

// Checks if a new name is available and valid
function validNewName(name) {
  // Valid name
  if (!validName(name)) {
    return false;
  }
  // File already exists
  if (fs.existsSync(config.CAPTURES_DIR + name)) {
    return false;
  }
  return true;
};
exports.validNewName = validNewName;

// Checks if a capture has a valid simple format
function validSimpleCapture(name) {
  // TODO: Use something different (testSimple?) to determine if its a valid simple capture with the #packets at the end
  if (!validFile(name)) {
    return false;
  }
  // 3rd and 4th byte are 0x69
  var magicNumber = new Buffer([0x69, 0x69]);
  var buffer = new Buffer([0x00, 0x00]);
  var fd = fs.openSync(config.CAPTURES_DIR + name, 'r');
  var len = fs.readSync(fd, buffer, 0, 2, 2);
  fs.closeSync(fd);
  if (len != magicNumber.length) {
    return false;
  }
  return ((magicNumber[0] == buffer[0]) && (magicNumber[1] == buffer[1]));
};
exports.validSimpleCapture = validSimpleCapture;

// Checks if a capture has a valid pcap format
function validPcapCapture(name) {
  if (!validFile(name) || validSimpleCapture(name)) {
    return false;
  }
  // Check if it is a valid pcap capture
  try {
    // TODO: Buscar forma de optimizar y que sea mas rapido
    scripts.execSync(
      'sudo LD_LIBRARY_PATH=bin/caputils/ ./bin/caputils/capinfos -t "' + config.CAPTURES_DIR + name + '" 2> /dev/null | grep "File type"'
    );
  } catch (error) {
    return false;
  }
  return true;
};
exports.validPcapCapture = validPcapCapture;

// Checks if a capture exists with a given name (full name)
function validCapture(name) {
  return (validSimpleCapture(name) || validPcapCapture(name));
};
exports.validCapture = validCapture;

// Checks if a capture is in use
function inUse(name, callback) {
  var capturePath = path.normalize(config.CAPTURES_DIR + name);
  var command = 'sudo lsof "' + capturePath + '"';
  scripts.exec(command).on('exit', function (code) {
    callback(code == 0);
  });
};
exports.inUse = inUse;


// Internal functions

// Sends the capture data into a json object
function sendDataCaptures(res, dataCaptures) {
  common.readJSON('captures_data', function (ans) {
    ans.captures = dataCaptures;
    res.status(200).json(ans);
  });
};

// Checks if a name is valid (syntactically)
function validName(name) {
  if(name.length < 1) {
    return false;
  }
  if(name.length > 50) {
    return false;
  }

  // Name regexp
  var regexpName = /[-a-zA-Z0-9_ \(\)]+\.{0,1}/g;
  while(name.match(regexpName)) {
    name = name.replace(regexpName, '');
  }
  return name.length == 0;
};

// File exists and it is valid
function validFile(name) {
  // Valid name
  if (!validName(name)) {
    return false;
  }
  // File already exists
  if (!fs.existsSync(config.CAPTURES_DIR + name)) {
    return false;
  }
  return true;
};