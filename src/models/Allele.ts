import { random, randomInt } from "../functions/randomInt";
import { Gene } from "./Gene";

export class Allele {
    phenotype: number
    constructor(
        public readonly genes: Gene[],
        public readonly consumption: number = 0,
        public readonly phenotypeMethod: 'max' | 'random' = 'max'
    ) {
        this.phenotype = phenotypeMethod === 'max' ? Math.max(...genes.map(gene => gene.value)) : genes[randomInt(0, genes.length - 1)].value
    }

    public static mix = (allele1: Allele, allele2: Allele) => {
        const genes = []
        for (let i = 0; i < allele1.genes.length; i++) {
            const gene = random(0, 1) <= 0.5 ? allele1.genes[i] : allele2.genes[i]

            genes.push(gene.generate())
        }

        const consumption = random(0, 1) <= 0.5 ? allele1.consumption : allele2.consumption
        const newAllele = new Allele(genes, consumption, allele1.phenotypeMethod)

        return newAllele
    }
}