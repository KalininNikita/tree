import { random } from "../functions/randomInt";

export type Neuron = {
    value: number,
    error: number,
}

export class Network {
    weights: number[][][] = []
    constructor(sizes: number[], isRandom = false) {
        this.weights = this.getWeights(sizes, isRandom)
    }

    private getWeights(sizes: number[], isRandom: boolean) {
        const weights: number[][][] = [];

        for (let i = 0; i < sizes.length - 1; i++) {
            weights[i] = new Array(sizes[i + 1]).fill(null).map(() => new Array(sizes[i]).fill(isRandom ? random(0, 0.5) : 0.5));
        }

        return weights;
    }

    step(inputValues: number[], outputValues: number[]) {
        const { output, hiddenLayers, input } = this.getLayers(inputValues);

        this.calculateError(output, outputValues);
        this.updateErrors(input, hiddenLayers, output);
        this.updateWeights(input, hiddenLayers, output);

        return output
    }

    private calculateError(output: Neuron[], outputValues: number[]) {
        output.forEach((n, i) => {
            n.error = Math.abs(outputValues[i] - n.value) > 0.15 ? outputValues[i] - n.value : 0
        })
    }

    private updateErrors(input: Neuron[], hiddenLayers: Neuron[][], output: Neuron[]) {
        const weights = this.weights

        for (let i = weights.length - 1; i >= 0; i--) {
            this.getError(hiddenLayers[i - 1] ?? input, weights[i], hiddenLayers[i] ?? output);
        }
    }

    private updateWeights(input: Neuron[], hiddenLayers: Neuron[][], output: Neuron[]) {
        const weights = this.weights

        for (let i = weights.length - 1; i >= 0; i--) {
            weights[i] = this.changeWeights(hiddenLayers[i - 1] ?? input, weights[i], hiddenLayers[i] ?? output, 0.1);
        }
    }

    private getLayers(inputValues: number[]) {
        const weights = this.weights

        const input: Neuron[] = inputValues.map((value) => ({ value, error: 0 }));

        const hiddenLayers: Neuron[][] = [];
        for (let i = 0; i < weights.length - 1; i++) {
            hiddenLayers[i] = this.getOutputNeurons(hiddenLayers[i - 1] ?? input, weights[i], true);
        }

        const output = this.getOutputNeurons(hiddenLayers[weights.length - 2], weights[weights.length - 1]);

        return { output, hiddenLayers, input };
    }

    private getOutputNeurons(input: Neuron[], weights: number[][], bias: boolean = false) {
        const output: Neuron[] = Array(weights.length).fill(null).map(() => ({ value: 0, error: 0 }));

        for (let i = 0; i < output.length - (bias ? 1 : 0); i++) {
            let sum = 0;
            for (let j = 0; j < input.length; j++) {
                sum += weights[i][j] * input[j].value;
            }

            output[i].value = this.activationFunction(sum);
        }

        if (bias) {
            output[output.length - 1].value = 1;
        }

        return output;
    }

    private activationFunction(x: number): number {
        if (x < 0) return 0 // 0.01 * x;
        if (x > 1) return 1 //1 + 0.01 * x;

        return x;
    }

    private derivativeActivationFunction(x: number): number {
        if (x < 0 || x > 1) return 0;

        return 1;
    }

    private getError(input: Neuron[], weights: number[][], output: Neuron[]) {
        for (let i = 0; i < input.length; i++) {
            let error = 0;

            for (let j = 0; j < output.length; j++) {
                error += weights[j][i] * output[j].error;
            }

            input[i].error = error;
        }

        return input;
    }

    private changeWeights(input: Neuron[], weights: number[][], output: Neuron[], k: number) {
        const newWeights: number[][] = Array(weights.length).fill(null).map(() => Array(weights[0].length));

        for (let i = 0; i < output.length; i++) {
            for (let j = 0; j < input.length; j++) {
                newWeights[i][j] = weights[i][j] + k * output[i].error * this.derivativeActivationFunction(input[j].value) * input[j].value;
            }
        }

        return newWeights;
    }

    getValues(inputValues: number[][]) {
        return inputValues.map(values => this.getLayers(values).output)
    }
}