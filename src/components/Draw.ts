const Draw = ({ ctx, matrix, width, height, scale = 1, sizeCell }) => {
    if (matrix.length === 0 || !ctx) return null

    console.time('DrawTiles')

    ctx.clearRect(0, 0, width * sizeCell, height * sizeCell,)

    for (let i = 0; i < height; i += scale) {
        for (let j = 0; j < width; j += scale) {
            ctx.fillStyle = matrix[i * width + j].color
            ctx.fillRect(sizeCell * j, sizeCell * i, sizeCell * scale, sizeCell * scale);
        }
    }

    console.timeEnd('DrawTiles')

    return null
}

export default Draw