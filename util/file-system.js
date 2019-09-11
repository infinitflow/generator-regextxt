const fs = require('fs');
const readjson = require('readjson');

function readFileContentsAsString(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}

function readAndParseJson(filePath, log) {
    try {
        return readjson.sync(filePath);
    } catch(error) {
        log(error.message);
    }
}

function writeFile(contents, outputFilePath) {
    fs.writeFileSync(outputFilePath, contents, { flag: 'w'});
}

module.exports = {
    readFileContentsAsString: readFileContentsAsString,
    readAndParseJson: readAndParseJson,
    writeFile: writeFile,
};