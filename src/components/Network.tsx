import React, { useEffect, useRef, useState } from "react";
import { Network } from "../models/Network";
import { random } from "../functions/randomInt";
import Draw from "./Draw";

export function PrintNetwork() {
    const [sizes] = useState([4, 9, 3])
    const [network] = useState(new Network(sizes, true))
    const [data, setData] = useState([])
    const [count, setCount] = useState(0)
    const [print, setPrint] = useState({
        r: true,
        g: true,
        b: true,
    })

    const layer = {
        matrix: useRef(null),
        r: useRef(null),
        g: useRef(null),
        b: useRef(null),
    }

    const dataSize = 120

    const width = dataSize;
    const height = dataSize;
    const sizeCell = 5
    const widthCanvas = sizeCell * width
    const heightCanvas = sizeCell * height

    const step = () => {
        const rootIterations = 100
        const iterations = rootIterations ** 2

        for (let i = 0; i < iterations; i++) {
            const x = random(0, 1)
            const y = 1 * random(0, 1)
            const z = 1 * random(0, 1)
            const inputValues = [x, y, z, 1]

            const output = [getOutput(x > 0.4), getOutput(y > 0.6), getOutput(z > x)]
            network.step(inputValues, output)
        }
        setCount(count + iterations)

        const inputValues = new Array(dataSize * dataSize).fill(null)
            .map((_, i) => [
                (i / dataSize >> 0) / dataSize,
                (i % dataSize) / dataSize,
                (i % dataSize) / dataSize,
                1
            ])

        const inputValuesExactly = new Array(dataSize * dataSize).fill(null)
            .map((_, i) => [
                (i / dataSize >> 0) / dataSize > 0.4 ? 1 : 0,
                (i % dataSize) / dataSize > 0.6 ? 1 : 0,
                (i % dataSize) / dataSize > (i / dataSize >> 0) / dataSize ? 1 : 0,
                1
            ])

        setData(network.getValues(inputValues).map(el => el.reduce((s, v) => [...s, v.value], [])))
        //setData(inputValuesExactly)
    }

    useEffect(() => {
        const matrix = data.map(el => ({ color: `rgb(${print.r ? 255 * el[0] : 0}, ${print.g ? 255 * el[1] : 0}, ${print.b ? 255 * el[2] : 0})` }))
        console.log(data)
        Draw({ ctx: getContext(layer.matrix), matrix, sizeCell, width, height })
    }, [data, print])

    const getContext = (ref, alpha = true) => {
        if (ref && ref.current) return ref.current.getContext('2d', { alpha })
        return null
    }

    return <div>
        <div>
            <button onClick={step}>Поехали</button>
            <div>{count}</div>
            <div>
                <input type='checkbox' checked={print.r} onChange={() => setPrint({ ...print, r: !print.r })} id="r" />
                <label htmlFor="r">Красный</label>
                <input type='checkbox' checked={print.g} onChange={() => setPrint({ ...print, g: !print.g })} id="g" />
                <label htmlFor="g">Зелёный</label>
                <input type='checkbox' checked={print.b} onChange={() => setPrint({ ...print, b: !print.b })} id="b" />
                <label htmlFor="b">Синий</label>
            </div>
        </div>

        <div className="stage">
            <canvas ref={layer.matrix} width={widthCanvas} height={heightCanvas} className="active"></canvas>
        </div>
    </div>
}

function getOutput(result: boolean) {
    return result ? 1 : 0
}