
const fs = require('node:fs');

const folderName = '/Users/joe/test';
    try {
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }
    } catch (err) {
        console.error(err);
    }

const directoryToTree = function(rootDir, depth) {}