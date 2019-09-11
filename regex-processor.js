const _ = require('lodash');

function applyTransforms(transforms, originalFileContent, log) {
    log('APPLYING TRANSFORMS');
    const contents = originalFileContent.repeat(1); // clones the string
    const transformed = _.transform(transforms, (accumulator, currentTransform) => {
            log(`------- inside applyTransforms reduce iteration: current transform: ${JSON.stringify(currentTransform)}`);
            log(`------- inside applyTransforms reduce iteration: current contents: ${accumulator[0]}`);
            const transformed = applySingleTransform(currentTransform, accumulator[0], log);
            accumulator[0] = transformed;
        }, [contents]);
    return transformed[0];
}

function applySingleTransform(transform, contents, log) {
    log('>>>>>>>>> Applying transform: ', transform);
    log('----- Contents before applying transform: ', contents);
    const transformed = contents.replace(transform.regex, transform.replaceValue);
    log('----- Contents after applying transform: ', transformed);
    return transformed;
}

module.exports = {
    applyTransforms,
};