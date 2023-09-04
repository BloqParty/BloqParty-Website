const o = {
    diff: {
        1: `Easy`,
        3: `Normal`,
        5: `Hard`,
        7: `Expert`,
        9: `ExpertPlus`,
    }
};

for(const name of Object.keys(o)) {
    for(const [k,v] of Object.entries(o[name])) o[name][v] = k;
};

module.exports = o;