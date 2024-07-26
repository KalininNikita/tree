import { random, randomInt } from "../functions/randomInt";

export class Gene {
    constructor(
        public readonly length: number,
        public readonly probability: number,
        public readonly value: number = randomInt(0, 1 << length - 1),
    ) {
        const max = 1 << length
        if (value >= max) throw new Error(`Value is greater than permissible. Value = ${value}, but max is ${max - 1}`)
    }

    generate = () => {
        if (random(0, 1) < this.probability) {
            return new Gene(this.length, this.probability, this.mutate())
        }

        return new Gene(this.length, this.probability, this.value)
    }

    private mutate = () => {
        const position = randomInt(0, this.length - 1)

        return this.changeBit(position)
    }

    changeBit = (position: number) => {
        return this.value ^ (1 << position)
    }
}

export class CommandGene extends Gene {
    /**
     * lengthOne contains the length of the command and the values ​​1 and 2. The length result will be 3 * lengthOne
     * The resulting value consists of the command and values ​​1 and 2
     */
    constructor(
        lengthOne: number,
        probability: number,
        commandIndex: number = randomInt(0, 1 << lengthOne - 1),
        value1: number = randomInt(0, 1 << lengthOne - 1),
        value2: number = randomInt(0, 1 << lengthOne - 1),
    ) {
        const value = (commandIndex << 2 * lengthOne) + (value1 << lengthOne) + value2

        const max = 1 << lengthOne
        if (value1 >= max) throw new Error(`Value is greater than permissible. Value1 = ${value1}, but max is ${max - 1}`)
        if (value1 >= max) throw new Error(`Value is greater than permissible. Value2 = ${value2}, but max is ${max - 1}`)

        super(3 * lengthOne, probability, value)
    }
}