function orDefault(produceValue, defaultValue) {
    try {
        return produceValue() || defaultValue;
    } catch(error) {
        return defaultValue;
    }
}

module.exports = {
    orDefault: orDefault,
};