import { random } from "../functions/randomInt"
import { Allele } from "./Allele"

export type PlantAlleleNames = 'colorR' | 'colorG' | 'colorB'
export type AnimalAlleleNames = 'test' | 'test2'

export type AlleleNames = PlantAlleleNames | AnimalAlleleNames
export type Alleles<names extends AlleleNames> = {
    [name in names]?: name extends names ? Allele : never
}

export class Genome {
    constructor(public readonly alleles: Alleles<AlleleNames>) { }

    public static mix = (genome1: Genome, genome2: Genome) => {
        const alleles: Alleles<AlleleNames> = {}

        for (const name in genome1.alleles) {
            const alleleName = name as AlleleNames
            alleles[alleleName] = Allele.mix(genome1.alleles[alleleName], genome2.alleles[alleleName])
        }

        return new Genome(alleles)
    }
}

export class GenomeCommands {
    constructor(public readonly alleles: Allele[], public readonly lengthOne) { }

    public static mix = (genome1: GenomeCommands, genome2: GenomeCommands) => {
        return new GenomeCommands(
            (random(0, 1) < 0.5
                ? genome1.alleles
                : genome2.alleles)
                .map(allele => Allele.mix(allele, allele)
                ),
            genome1.lengthOne)
    };
}