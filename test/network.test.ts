require('ts-mocha');

import { assert, expect, should } from 'chai';
import { random } from '../src/functions/randomInt';
import * as fs from "fs";
import { Network, Neuron } from '../src/models/Network';
should();

describe('network', function () {
    it('length', () => {
        const sizes = [3, 4, 1]
        const network = new Network(sizes)

        for (let i = 0; i < 5000; i++) {
            const x = random(0, 1)
            const y = random(0, 1)
            const inputValues = [x, y, 1]

            const output = [getOutput(x > 0.5)]
            network.step(inputValues, output)
        }

        const output = network.step([0.8, 0.2, 1], [1])

        expect(output[0].error).be.equal(0)
    })
})

function getError(x: number, y: number, value: number, index: number) {
    if (x > 0.5) {
        return value > 0.8 ? 0 : 0.8 - value;
    } else {
        return value < 0.2 ? 0 : 0.2 - value;
    }
}

function getOutput(result: boolean) {
    return result ? 1 : 0
}