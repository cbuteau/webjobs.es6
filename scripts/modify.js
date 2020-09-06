
// The whole goal of this script is to be able
//to make modifiying paths for import to other
// projects fairly simple.

var DEBUG = true;

var fs = require('fs');
var path = require('path');
var esprima = require('esprima');
var escodegen = require('escodegen');


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


ensureOutDir();

var sourceStart = path.join(__dirname, '../src');
var filesanddirs = fs.readdirSync(sourceStart);
for (var i = 0; i < filesanddirs.length; i++) {
  var entry = filesanddirs[i];
  if (checkIfExclusion(entry)) {
    continue;
  }
  var fullpath = path.join(__dirname, '../src', entry );
  var contents = fs.readFileSync(fullpath, 'utf8');
  var parsed = esprima.parse(contents, { sourceType: 'module'});
  if (DEBUG) {
    var base = entry.slice(0, entry.length - path.extname(entry).length);
    var jsonfile = path.join(__dirname, '../out', base + '.json');
    //var outjson = path.join(__dirname, '../out', entry);
    fs.writeFileSync(jsonfile, JSON.stringify(parsed, null, '   '));
  }
  // modifiying
  var source = escodegen.generate(parsed);
  var outmodified = path.join(__dirname, '../out', entry);
  fs.writeFileSync(outmodified, source);
}
