const file = require("file");
const RegexParser = require("regex-parser");

function resolveIndividualFilePaths(pathToDir, fileSelectorRegexString, log) {
    const filesToTransform = [];
    const fileSelectionRegex = RegexParser(fileSelectorRegexString);

    log('RESOLVING INDIVIDUAL FILES TO TRANSFORM');
    log(`----- Target Dir: ${pathToDir}`);
    log(`----- File selection regex: ${fileSelectorRegexString}`);

    file.walkSync(file.path.abspath(pathToDir), (dirPath, dirs, files) => {
        log(`------ inside walkSync: this is files`, files);
        files
            .filter(filePath => fileSelectionRegex.test(filePath))
            .forEach(targetFilePath => {
                const resolvedFilePath = file.path.join(dirPath, targetFilePath);
                filesToTransform.push(resolvedFilePath);
                log(`-------- inside walkSync: pushing file path: ${resolvedFilePath}`);
            });
    });

    log(`----- Total number of file matches found: ${filesToTransform.length}`);
    log('----- First fiew file paths of matches: ');

    filesToTransform.slice(0, 10).forEach(filePath => log(`---------- ${filePath}`));

    return filesToTransform;
}

module.exports = {
    resolveIndividualFilePaths: resolveIndividualFilePaths,
};