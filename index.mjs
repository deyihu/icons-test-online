import potpack from 'potpack';
import { createCanvas, Image } from '@napi-rs/canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getICons() {
    const dirName = fileURLToPath(import.meta.url);
    const p = path.join(__dirname, './icons');
    const files = fs.readdirSync(p).filter(file => {
        return !file.includes('sprite');
    });
    return files.slice(0, files.length - 2).map(file => {
        const p = path.join(__dirname, `./icons/${file}`);
        const buffer = fs.readFileSync(p);
        const img = new Image();
        img.src = buffer;
        return {
            name: file.replace('.png', ''),
            img,
            w: img.width,
            h: img.height
        }
    })
}
const icons = getICons();
const { w, h, fill } = potpack(icons);
const canvas = createCanvas(w, h);
const ctx = canvas.getContext('2d');
const json = {};
icons.forEach(icon => {
    const { x, y, w, h, img, name } = icon;
    ctx.drawImage(img, x, y, w, h);
    json[name] = {
        x, y, width: w, height: h
    };
});
fs.writeFileSync(path.join(__dirname, './icons/sprite.png'), canvas.toBuffer('image/png'));
fs.writeFileSync(path.join(__dirname, './icons/sprite.json'), JSON.stringify(json));