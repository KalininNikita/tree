require('ts-mocha');

import { assert, expect, should } from 'chai';
import { Gene } from '../src/models/Gene';
import { Allele } from '../src/models/Allele';
import { Alleles, Genome, PlantAlleleNames } from '../src/models/Genome';
should();

describe('genome', function () {
    const length = 2;
    const probability = 0

    it('length', () => {
        const ploidy = 1
        const genes = new Array(ploidy).fill(0).map(() => new Gene(length, probability))
        const allele = new Allele(genes)
        const alleles: Alleles<PlantAlleleNames> = {}
        alleles.colorR = allele

        const genom1 = new Genome(alleles)

        expect(Object.keys(genom1.alleles).length).be.equal(1)
    })

    it('length', () => {
        const ploidy = 1
        const genes = new Array(ploidy).fill(0).map(() => new Gene(length, probability))
        const allele = new Allele(genes)
        const alleles: Alleles<PlantAlleleNames> = {}
        alleles.colorR = allele
        alleles.colorG = allele

        const genom1 = new Genome(alleles)

        expect(Object.keys(genom1.alleles).length).be.equal(2)
    })

    it('mix', () => {
        const ploidy = 1
        const genes = new Array(ploidy).fill(0).map(() => new Gene(length, probability))
        const allele = new Allele(genes)
        const alleles: Alleles<PlantAlleleNames> = {}
        alleles.colorR = allele
        alleles.colorG = allele

        const genom1 = new Genome(alleles)
        const genom2 = new Genome(alleles)

        expect(genom1).to.be.deep.equal(genom2)
    })

    it('mix', () => {
        const ploidy = 1
        const genes1 = new Array(ploidy).fill(0).map(() => new Gene(length, probability))
        const genes2 = new Array(ploidy).fill(0).map(() => new Gene(length, probability))

        const allele1 = new Allele(genes1)
        const allele2 = new Allele(genes2)

        const alleles1: Alleles<PlantAlleleNames> = {}
        alleles1.colorR = allele1
        const alleles2: Alleles<PlantAlleleNames> = {}
        alleles2.colorR = allele2

        const genom1 = new Genome(alleles1)
        const genom2 = new Genome(alleles2)

        expect(JSON.stringify(Genome.mix(genom1, genom2).alleles.colorR)).to.be
            .oneOf([JSON.stringify(allele1), JSON.stringify(allele2)])
    })
})