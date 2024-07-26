import { Allele } from "./Allele";
import { CommandGene, Gene } from "./Gene";
import { AlleleNames, Alleles, Genome, GenomeCommands, PlantAlleleNames } from "./Genome";
import { Command, RunCommands } from "./RunCommands";

type OrganismType = 'plant' | 'animal'

// TODO - среда, популяция, ресурсы, разные излучения света, минералы, органика, вода, азот. Клубеньковые. Передача в run функции изменения воды/энергии/прочего

export class Organism {
    constructor(
        public readonly genome: Genome,
        public readonly genomeCommands: GenomeCommands,
        protected energy: number,
    ) { }

    public static environmentalIndexes = {
        energy: 0,
    }

    environmentalIndexes = Organism.environmentalIndexes

    public static create = (type: OrganismType) => {
        const plantAlleles: Alleles<PlantAlleleNames> = {
            'colorR': new Allele([new Gene(8, 0.05), new Gene(8, 0.05)]),
            'colorG': new Allele([new Gene(8, 0.05), new Gene(8, 0.05)]),
            'colorB': new Allele([new Gene(8, 0.05), new Gene(8, 0.05)]),
        }

        const config: { [key in OrganismType]: Genome } = {
            'plant': new Genome(plantAlleles),
            'animal': null
        }

        return config[type]
    }

    crossing = (organism: Organism | undefined) => {
        organism = organism ?? this
        const genome = Genome.mix(this.genome, organism.genome)
        const genomeCommands = GenomeCommands.mix(this.genomeCommands, organism.genomeCommands)

        return new Organism(genome, genomeCommands, this.energy)
    }

    if = ({ commandValue }) => {
        const { value1, value2 } = this.getValues(commandValue)
        const environmental = this.getEnvironmental()

        if (environmental[value1 % environmental.length] <= value2) {
            return { step: 1 }
        } else {
            return { step: 2 }
        }
    }

    next = () => {
        return { step: 1 }
    }

    end = () => {
        return { step: 0 }
    }

    goto = ({ commandValue }) => {
        const { value1, value2 } = this.getValues(commandValue)
        const step = value1 === 0 ? -value2 : value1

        return { step }
    }

    getValues = (commandValue) => {
        const value1 = commandValue >> this.genomeCommands.lengthOne
        const value2 = commandValue & ((1 << this.genomeCommands.lengthOne) - 1)

        return { value1, value2 }
    }

    getEnvironmental = () => {
        return this.getClassDataArray(this.environmentalIndexes)
    }

    getClassDataArray = (indexes: Object) => {
        const arr = []
        for (const key in indexes) {
            const index = indexes[key]

            arr[index] = this[key]
        }

        return arr
    }
}

export class TestOrganism extends Organism {
    commands: Command[] = []

    static commandIndexes = {
        add: 0,
        subtract: 1,
        goto: 2,
        next: 3,
        if: 4,
        end: 5,
    }

    static environmentalIndexes = {
        energy: 0,
        sum: 1,
    }

    prices = {
        add: 5,
        subtract: 5,
    }

    environmentalIndexes = TestOrganism.environmentalIndexes
    commandIndexes = TestOrganism.commandIndexes

    constructor(public readonly genomeCommands: GenomeCommands, energy: number = 100) {
        const alleles: Alleles<AlleleNames> = {}

        super(new Genome(alleles), genomeCommands, energy)

        this.commands = this.getClassDataArray(this.commandIndexes)
    }

    sum = 0

    add = ({ commandValue }) => {
        if (!this.spendEnergy(this.prices.add)) return this.end()

        const { value1, value2 } = this.getValues(commandValue)

        this.sum += value1 + value2

        return { step: 1 }
    }

    subtract = ({ commandValue }) => {
        if (!this.spendEnergy(this.prices.subtract)) return this.end()

        const { value1, value2 } = this.getValues(commandValue)

        this.sum -= value1 + value2

        return { step: 0 }
    }

    spendEnergy = (price: number) => {
        if (this.energy < this.prices.subtract) return false

        this.energy -= price
        return true
    }

    run = ({ energy }) => {
        this.energy += energy

        RunCommands.run(this.genomeCommands.alleles, this.commands, this.genomeCommands.lengthOne)
    }
}