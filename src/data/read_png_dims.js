import fs from 'fs';
import path from 'path';

function getPngDimensions(filePath) {
    const buffer = fs.readFileSync(filePath);
    if (buffer.toString('ascii', 1, 4) === 'PNG') {
        const width = buffer.readInt32BE(16);
        const height = buffer.readInt32BE(20);
        return { width, height, type: 'PNG' };
    }
    return null;
}

// Simple JPEG parser to read dimensions
function getJpgDimensions(filePath) {
    const buffer = fs.readFileSync(filePath);
    let i = 0;
    if (buffer[i] !== 0xFF || buffer[i + 1] !== 0xD8) return null; // Not a JPG
    i += 2;
    while (i < buffer.length) {
        if (buffer[i] !== 0xFF) return null;
        const marker = buffer[i + 1];
        if (marker === 0xC0 || marker === 0xC2) { // SOF0 or SOF2
            const height = buffer.readUInt16BE(i + 5);
            const width = buffer.readUInt16BE(i + 7);
            return { width, height, type: 'JPG' };
        }
        const length = buffer.readUInt16BE(i + 2);
        i += 2 + length;
    }
    return null;
}

const files = fs.readdirSync('public');
for (const file of files) {
    if (file.includes('banner') && file.includes('new')) {
        const filePath = path.join('public', file);
        try {
            let dims = getPngDimensions(filePath) || getJpgDimensions(filePath);
            if (dims) {
                console.log(`${file}:`, dims, 'Aspect Ratio:', dims.width / dims.height);
            }
        } catch (e) {
            console.error(file, e.message);
        }
    }
}
