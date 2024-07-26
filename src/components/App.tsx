import React, { useEffect, useRef, useState } from "react";
import Draw from "./Draw";
import { Cell, Matrix } from "../models/Matrix";
import { Plant } from "../models/Plant";
import { PrintNetwork } from "./Network";

function App() {
	const width = 60;
	const height = 30;
	const sizeCell = 20
	const widthCanvas = sizeCell * width
	const heightCanvas = sizeCell * height

	const [matrix, setMatrix] = useState(new Matrix(width, height))
	const [plants, setPlants] = useState([])
	const [count, setCount] = useState(0)

	// plants.forEach(plant => {
	// 	const availableCells = matrix.filter(checkPlantAround(plant))

	// 	plant.setAvailableCells(availableCells, '')
	// })

	const layer = {
		matrix: useRef(null)
	}

	useEffect(() => {
		const matrixCells = matrix.getMatrix('array') as Cell[]

		plants.push(new Plant(matrix, matrixCells[matrix.height * matrix.width / 2 + matrix.width / 2]))
	}, [])

	useEffect(() => {
		const matrixCells = matrix.getMatrix('array') as Cell[]

		Draw({ ctx: getContext(layer.matrix), matrix: matrixCells, sizeCell, width, height })
	}, [matrix, layer.matrix.current, count])

	const getContext = (ref, alpha = true) => {
		if (ref && ref.current) return ref.current.getContext('2d', { alpha })
		return null
	}

	return (
		<div>
			<PrintNetwork />
			{/* <canvas ref={layer.matrix} width={widthCanvas} height={heightCanvas}></canvas> */}
			
{/* 			
			<button onClick={() => grow()}>
				123
			</button> */}
		</div>
	)

	function grow() {
		plants.forEach(plant => {
			for (let i = 0; i < 100; i++) {
				plant.growRandom()
			}
		})

		setCount(count + 1)
	}

	// function checkPlantAround(plant) {
	// 	return function (item, index) {
	// 		if (item.plant) return false;
	// 		// TODO - границы

	// 		return matrix[index + 1]?.plant === plant || matrix[index - 1]?.plant === plant ||
	// 			matrix[index + size]?.plant === plant || matrix[index - size]?.plant === plant
	// 	}
	// }
}

export { App };
