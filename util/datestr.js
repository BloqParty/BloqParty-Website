// values index at 0, where 0 is disabled; 1 is enabled, and incrementing values are enabled with more detail

const values = require(`./datestr/values`);

const formatReplacementRegex = /%\(\s*([^)]+)\s*\)/g;

module.exports = (format=`%(MM)-%(DD)-%(YYYY) %(HH):%(mm):%(SS).%(MS)`) => {
    const date = new Date();
    
    format = format.replace(formatReplacementRegex, (match, key) => {
        const capturedKeys = key.split(`,`).map(s => s.trim())
        for (const key of capturedKeys) {
            if(values[key]) {
                return values[key](date);
            };
        };

        return match;
    });

    return format;
}