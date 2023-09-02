module.exports = (...styleFiles) => {
    const o = {};

    for(const style of styleFiles) try {
        Object.assign(o, require(`../src/styles/${style}.js`));
    } catch(e) {
        console.error(`Failed to load style file ${style}: ${e}`);
    }

    return o;
}