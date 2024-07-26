require('ts-mocha');

import { assert, expect, should } from 'chai';
import { Gene } from '../src/models/Gene';
should();

describe('gene', function () {
    const length = 10;
    const probability = 1
    const gene = new Gene(length, probability)

    it('length', () => {
        expect(gene.value).be.within(0, 1 << length)
    })

    it('value > length', () => {
        assert.throws(() => new Gene(length, probability, 1 << length), Error)
    })

    it('change bit', () => {
        const position = 1
        expect(gene.changeBit(position)).be.equal(gene.value ^ 1 << position)
    })

    it('change bit', () => {
        const position = length - 1
        expect(gene.changeBit(position)).be.equal(gene.value ^ 1 << position)
    })

    it('generate', () => {
        expect(gene.generate().value).not.be.equal(gene.value)
    })

    it('generate', () => {
        const probability = 0
        const gene = new Gene(length, probability)
        expect(gene.generate().value).be.equal(gene.value)
    })
})