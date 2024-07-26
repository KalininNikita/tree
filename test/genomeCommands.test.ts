require('ts-mocha');

import { assert, expect, should } from 'chai';
import { TestOrganism } from '../src/models/Organism';
import { Allele } from '../src/models/Allele';
import { CommandGene } from '../src/models/Gene';
import { GenomeCommands } from '../src/models/Genome';
should();

describe('genome commands', function () {
    const energy = 0

    it('sum', () => {
        const lengthOne = 2
        const probability = 0

        const alleleCommands = [
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.add, 2, 3)]),
        ]

        const genomeCommands = new GenomeCommands(alleleCommands, lengthOne)

        const initialEnergy = 25
        const organism = new TestOrganism(genomeCommands, initialEnergy)
        organism.run({ energy: 0 })

        expect(organism.sum).be.equal(5 * (2 + 3))
    })

    it('sum', () => {
        const lengthOne = 2
        const probability = 0

        const alleleCommands = [
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.add, 2, 3)]),
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.add, 3, 3)]),
        ]

        const genomeCommands = new GenomeCommands(alleleCommands, lengthOne)

        const initialEnergy = 10
        const organism = new TestOrganism(genomeCommands, initialEnergy)
        organism.run({ energy })

        expect(organism.sum).be.equal(2 + 3 + 3 + 3)
    })

    it('next with sum', () => {
        const lengthOne = 2
        const probability = 0

        const alleleCommands = [
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.next)]),
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.next)]),
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.next)]),
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.next)]),
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.add, 2, 3)]),
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.add, 3, 3)]),
        ]

        const genomeCommands = new GenomeCommands(alleleCommands, lengthOne)

        const initialEnergy = 10
        const organism = new TestOrganism(genomeCommands, initialEnergy)
        organism.run({ energy })

        expect(organism.sum).be.equal(2 + 3 + 3 + 3)
    })

    it('sum with goto', () => {
        const lengthOne = 2
        const probability = 0

        const alleleCommands = [
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.goto, 0, 1)]),
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.add, 1, 1)]),
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.add, 3, 2)]),
        ]

        const genomeCommands = new GenomeCommands(alleleCommands, lengthOne)

        const initialEnergy = 15
        const organism = new TestOrganism(genomeCommands, initialEnergy)
        organism.run({ energy })

        expect(organism.sum).be.equal(3 * (3 + 2))
    })

    it('goto', () => {
        const lengthOne = 2
        const probability = 0

        const alleleCommands = [
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.goto, 0, 0)]),
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.add, 1, 1)]),
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.add, 3, 2)]),
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.goto, 1, 0)]),
        ]

        const genomeCommands = new GenomeCommands(alleleCommands, lengthOne)

        const organism = new TestOrganism(genomeCommands)
        organism.run({ energy })

        expect(organism.sum).be.equal(0)
    })

    it('if', () => {
        const lengthOne = 8
        const probability = 0

        const alleleCommands = [
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.if, 0, 11)]),
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.add, 1, 1)]),
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.add, 3, 2)]),
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.end)]),
        ]

        const genomeCommands = new GenomeCommands(alleleCommands, lengthOne)

        const organism = new TestOrganism(genomeCommands)
        organism.run({ energy })

        expect(organism.sum).be.equal(3 + 2)
    })

    it('if', () => {
        const lengthOne = 8
        const probability = 0

        const alleleCommands = [
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.if, TestOrganism.environmentalIndexes.energy, 101)]),
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.goto, 2, 0)]),
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.add, 3, 2)]),
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.add, 4, 7)]),
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.end)]),
        ]

        const genomeCommands = new GenomeCommands(alleleCommands, lengthOne)

        const organism = new TestOrganism(genomeCommands)
        organism.run({ energy: 0 })

        expect(organism.sum).be.equal(4 + 7)
    })

    it('while', () => {
        const lengthOne = 8
        const probability = 0

        const alleleCommands = [
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.if, TestOrganism.environmentalIndexes.sum, 4)]),
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.goto, 2, 0)]),
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.end)]),
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.add, 1, 2)]),
        ]

        const genomeCommands = new GenomeCommands(alleleCommands, lengthOne)

        const organism = new TestOrganism(genomeCommands)
        organism.run({ energy })

        expect(organism.sum).be.equal(2 * (1 + 2))
    })

    it('while', () => {
        const lengthOne = 8
        const probability = 0

        const alleleCommands = [
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.if, TestOrganism.environmentalIndexes.sum, 6)]),
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.goto, 2, 0)]),
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.end)]),
            new Allele([new CommandGene(lengthOne, probability, TestOrganism.commandIndexes.add, 1, 2)]),
        ]

        const genomeCommands = new GenomeCommands(alleleCommands, lengthOne)

        const organism = new TestOrganism(genomeCommands)
        organism.run({ energy })

        expect(organism.sum).be.equal(3 * (1 + 2))
    })
})