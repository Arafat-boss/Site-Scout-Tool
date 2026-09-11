const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Function to generate a valid PNG buffer of any size with a circular logo
function createPng(size) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0); // width
  ihdrData.writeUInt32BE(size, 4); // height
  ihdrData.writeUInt8(8, 8);       // bit depth
  ihdrData.writeUInt8(6, 9);       // color type (RGBA)
  ihdrData.writeUInt8(0, 10);      // compression
  ihdrData.writeUInt8(0, 11);      // filter
  ihdrData.writeUInt8(0, 12);      // interlace

  const ihdr = makeChunk('IHDR', ihdrData);

  // Raw image data with scanlines (RGBA)
  const rawBytes = [];
  const radius = size / 2;
  const innerRadius = radius * 0.75;
  const centerRadius = radius * 0.35;

  for (let y = 0; y < size; y++) {
    rawBytes.push(0); // filter type none
    for (let x = 0; x < size; x++) {
      const dx = x - radius + 0.5;
      const dy = y - radius + 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= radius) {
        if (dist <= centerRadius) {
          // Green emerald center dot
          rawBytes.push(34, 197, 94, 255);
        } else if (dist <= innerRadius + 1 && dist >= innerRadius - 1.5) {
          // White ring
          rawBytes.push(255, 255, 255, 255);
        } else {
          // Dark background #09090b
          rawBytes.push(9, 9, 11, 255);
        }
      } else {
        // Transparent outside circle
        rawBytes.push(0, 0, 0, 0);
      }
    }
  }

  const compressed = zlib.deflateSync(Buffer.from(rawBytes));
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function crc32(buf) {
  let table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

fs.writeFileSync(path.join(iconsDir, 'icon16.png'), createPng(16));
fs.writeFileSync(path.join(iconsDir, 'icon48.png'), createPng(48));
fs.writeFileSync(path.join(iconsDir, 'icon128.png'), createPng(128));

console.log('Site Scout extension icons generated successfully.');
