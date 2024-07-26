import { createCanvas, } from 'canvas';
import fs from 'fs';
import GIFEncoder from 'gifencoder';
import { Network } from './models/Network';
import { random } from './functions/randomInt';
import Draw from './components/Draw';

const pathGif = 'E:\\my-projects\\trees\\public\\network.gif';

const dataSize = 120
const width = dataSize;
const height = dataSize;
const sizeCell = 5
const widthCanvas = sizeCell * width
const heightCanvas = sizeCell * height

const canvas = createCanvas(widthCanvas, heightCanvas)
const context = canvas.getContext('2d')

const encoder = new GIFEncoder(widthCanvas, heightCanvas);
const { repeat, delay, quality } = { repeat: 0, delay: 200, quality: 30 }
const stream = encoder.createWriteStream({ repeat, delay, quality });
const frames = []

const sizes = [4, 7, 3]
const network = new Network(sizes, true)

const inputValuesForDraw = new Array(dataSize * dataSize).fill(null)
    .map((_, i) => [
        (i / dataSize >> 0) / dataSize,
        (i % dataSize) / dataSize,
        (i % dataSize) / dataSize,
        1
    ])

encoder.start();
encoder.setRepeat(repeat);
encoder.setDelay(delay);
encoder.setQuality(quality);

console.time('create')
create(context, addFrame)
console.timeEnd('create')

console.time('gif')
frames.push(...frames.slice(1, -1).reverse())

frames.forEach(frame => {
    context.putImageData(frame, 0, 0)
    encoder.addFrame(context);
});

encoder.finish();

stream.pipe(fs.createWriteStream(pathGif));
console.log(`GIF сохранен в ${pathGif}`);

console.timeEnd('gif')

function create(context, addFrame) {
    const iterations = 2000
    const every = 10
    const skip = 1000

    for (let i = 0; i < iterations; i++) {
        const x = random(0, 1)
        const y = 1 * random(0, 1)
        const z = 1 * random(0, 1)
        const inputValues = [x, y, z, 1]

        const output = [getOutput(x > 0.4), getOutput(y > 0.6), getOutput(z > x)]
        network.step(inputValues, output)

        if (i > skip && i % every === 0) {
            const data = network.getValues(inputValuesForDraw).map(el => el.reduce((s, v) => [...s, v.value], []))
            const matrix = data.map(el => ({ color: `rgb(${getColor(el[0])}, ${getColor(el[1])}, ${getColor(el[2])})` }))

            Draw({ ctx: context, matrix, sizeCell, width, height })
            addFrame(context)
        }
    }
}

function addFrame(context) {
    frames.push(context.getImageData(0, 0, widthCanvas, heightCanvas))
}

function getOutput(result: boolean) {
    return result ? 1 : 0
}

function getColor(el) {
    return (255 * el / 5 >> 0) * 5
}