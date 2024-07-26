require('ts-mocha');

import { assert, expect, should } from 'chai';
import { Gene } from '../src/models/Gene';
import { Allele } from '../src/models/Allele';
should();

describe('allele', function () {
    const length = 2;
    const probability = 0

    it('length', () => {
        const ploidy = 1
        const genes = new Array(ploidy).fill(0).map(() => new Gene(length, probability))
        const allele = new Allele(genes)

        expect(allele.genes.length).be.equal(ploidy)
    })

    it('length', () => {
        const ploidy = 2
        const genes = new Array(ploidy).fill(0).map(() => new Gene(length, probability))
        const allele = new Allele(genes)

        expect(allele.genes.length).be.equal(ploidy)
    })

    it('alleles', () => {
        const ploidy = 2
        const genes = new Array(ploidy).fill(0).map(() => new Gene(length, probability))
        const allele1 = new Allele(genes)

        expect(JSON.stringify(allele1)).equal(JSON.stringify(Allele.mix(allele1, allele1)))
    })

})