require('ts-mocha');

import { assert, expect, should } from 'chai';
import { Cell, Matrix } from '../src/models/Matrix';
should();

describe('matrix', function () {
    const width = 6
    const height = 4
    const matrix = new Matrix(width, height)
    const matrixArray = matrix.getMatrix('array') as Cell[]

    it('length', () => {
        assert.equal(matrixArray.length, width * height);
    })

    it('getAroundCells', () => {
        const index = 0
        expect(matrix.getAroundCells(matrixArray[index])).to.be.deep.equal([matrixArray[index + width], matrixArray[index + 1]])
    })

    it('getAroundCells', () => {
        const index = 1
        expect(matrix.getAroundCells(matrixArray[index])).to.be.deep.equal([matrixArray[index + width], matrixArray[index - 1], matrixArray[index + 1]])
    })

    it('getAroundCells', () => {
        const index = width
        expect(matrix.getAroundCells(matrixArray[index])).to.be.deep.equal([matrixArray[index - width], matrixArray[index + width], matrixArray[index + 1]])
    })

    it('getAroundCells', () => {
        const index = width + 1
        expect(matrix.getAroundCells(matrixArray[index])).to.be.deep.equal([matrixArray[index - width], matrixArray[index + width], matrixArray[index - 1], matrixArray[index + 1]])
    })

    it('getAroundCells', () => {
        const index = width - 1
        expect(matrix.getAroundCells(matrixArray[index])).to.be.deep.equal([matrixArray[index + width], matrixArray[index - 1]])
    })

    it('getAroundCells', () => {
        const index = width * (height - 1)
        expect(matrix.getAroundCells(matrixArray[index])).to.be.deep.equal([matrixArray[index - width], matrixArray[index + 1]])
    })

    it('getAroundCells', () => {
        const index = width * (height - 1) + 1
        expect(matrix.getAroundCells(matrixArray[index])).to.be.deep.equal([matrixArray[index - width], matrixArray[index - 1], matrixArray[index + 1]])
    })

    it('getAroundCells', () => {
        const index = width * height - 1
        expect(matrix.getAroundCells(matrixArray[index])).to.be.deep.equal([matrixArray[index - width], matrixArray[index - 1],])
    })
})
