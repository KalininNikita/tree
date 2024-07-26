import { Allele } from "./Allele";

type CommandArguments = {
    commandValue: number,
}

type CommandResult = {
    step: number
}

export interface Command {
    (params: CommandArguments): CommandResult;
}

export class RunCommands {
    public static run = (alleles: Allele[], commands: Command[], geneSize: number) => {
        let current = 0
        let step = 1;

        while (step !== 0) {
            const phenotype = alleles[current].phenotype
            const commandIndex = phenotype >> (2 * geneSize)
            const commandValue = phenotype & ((1 << 2 * geneSize) - 1)

            const command = commands[commandIndex % commands.length];
console.log(commandIndex);
            ({ step } = command({ commandValue }))

            current = (alleles.length + current + step) % alleles.length
        }
    }
}
