
var DEBUG = true;

var inquirer = require('inquirer');

var fs = require('fs');
var path = require('path');
var esprima = require('esprima');
var escodegen = require('escodegen');

function log() {
  if (DEBUG) {
    console.log.apply(console, arguments);
  }
}

function ensureOutDir() {
  var outPath = path.join(__dirname, '../out');
  if (!fs.existsSync(outPath)) {
    fs.mkdirSync(outPath);
  }
}

var exclusionList = ['MessageIds.js', 'BaseThread.js'];

function checkIfExclusion(name) {
  return (exclusionList.indexOf(name) !== -1);
}


// abstract this work later...
function readFilesForSrc() {
  var result = {};
  var sourceStart = path.join(__dirname, '../src');
  var filesanddirs = fs.readdirSync(sourceStart);
  for (var i = 0; i < filesanddirs.length; i++) {
    var entry = filesanddirs[i];
    if (checkIfExclusion(entry)) {
      continue;
    }
    result[entry] = {};
    var subdata = result[entry];
    var fullpath = path.join(__dirname, '../src', entry );
    subdata.fullpath = fullpath;
    var contents = fs.readFileSync(fullpath, 'utf8');
    var parsed = esprima.parse(contents, { sourceType: 'module'});
    subdata.parsed = parsed;
    if (DEBUG) {
      var base = entry.slice(0, entry.length - path.extname(entry).length);
      var jsonfile = path.join(__dirname, '../out', base + '.json');
      //var outjson = path.join(__dirname, '../out', entry);
      //fs.writeFileSync(jsonfile, JSON.stringify(parsed, null, '   '));
    }
    // modifiying
    var source = escodegen.generate(parsed);
    var outmodified = path.join(__dirname, '../out', entry);
    subdata.outpath = outmodified;
    //fs.writeFileSync(outmodified, source);
  }

  return result;
}

var PROMT_FOR_DEPLOY = [
  {
    type: 'confirm',
    name: 'wedoit',
    message: 'Do you want to alter the import statements of the source?'
  }
]

var PHASE_ONE = [
  {
    type: 'input',
    name: 'directory',
    message: 'Type the input direcory for the files in src.',
    default: './'
  }
]

inquirer.prompt(PROMT_FOR_DEPLOY).then(function(results) {
  log(results);
  if (results.wedoit) {
    ensureOutDir();
    var loaded = readFilesForSrc();
    inquirer.prompt(PHASE_ONE).then(function(poResults) {
      log(poResults);
    });
  } else {
    return;
  }
});
