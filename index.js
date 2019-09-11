const Generator = require('yeoman-generator');
const { applyTransforms } = require('./regex-processor');
const { resolveIndividualFilePaths } = require('./file-resolver');
const { readFileContentsAsString, writeFile, readAndParseJson } = require('./util/file-system');
const RegexParser = require("regex-parser");

const AnswersKeys = {
    filesToTransformDirectory: 'filesToTransformDirectory',
    filesToTransformSelectionRegex: 'filesToTransformSelectionRegex',
    transformsJson: 'transformsJson'
};

const ENABLE_LOGS = true;

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    nullLogger() {
    }

    enabledLog() {
        if (ENABLE_LOGS) {
            return this.log;
        }
        return this.nullLogger;
    }

    async prompting() {
        this.enabledLog()('----------------- Regex Text Tranformer -------------------');

        const filesToTransformDirectory = await this.prompt([{
            type: 'input',
            name: AnswersKeys.filesToTransformDirectory,
            message: `Please specify a directory containing the text files to transform: `,
            default: '',
            store: true,
        }, 
        {
            ype: 'input',
            name: AnswersKeys.filesToTransformSelectionRegex,
            message: `Please specify a regex to select target files, e.g files with txt extension: '^.+\.txt$': `,
            default: '',
            store: true,
        }]);

        this.answers = {...this.answers, ...filesToTransformDirectory};

        const transformations = await this.prompt([{
            type: 'input',
            name: AnswersKeys.transformsJson,
            message: `File path to json file specifying regex transforms: `,
            default: './tranforms.json',
            store: true,
        }]);

        this.answers = {...this.answers, ...transformations};
    }

    async writing() {
        const targetDirectory = this.answers[AnswersKeys.filesToTransformDirectory];
        const fileSelectionRegex = this.answers[AnswersKeys.filesToTransformSelectionRegex];
        const tranformsFilePath = this.answers[AnswersKeys.transformsJson];
        
        const individualFilePaths = resolveIndividualFilePaths(targetDirectory, fileSelectionRegex, this.enabledLog());

        const rawTransforms = readAndParseJson(tranformsFilePath);

        const transforms = rawTransforms
                            .map(trans => Object.assign({}, trans, {regex: RegexParser(trans.regex)}));
        
        individualFilePaths.map(filePath => {
            const transformedContents = applyTransforms(transforms, readFileContentsAsString(filePath), this.enabledLog());
            const transformedFilePath = filePath + '.transformed';
            writeFile(transformedContents, transformedFilePath);
        });
    }
};

// NOTE: always use this.log instead of console.log