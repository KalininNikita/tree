import { Color } from "./Color";
import { Cell, Matrix, TerrainType } from "./Matrix";
import { randomInt } from "../functions/randomInt";

// TODO - получение энергии
// TODO - упростить. Количество веток, корней и листьев
// TODO - simple plant
// TODO - гены и аллели. Фенотип

const TreeParts = {
	'core': 'core',
	'leaf': 'leaf',
	'root': 'root',
	'branch': 'branch'
} as const
type TreePartKeys = keyof typeof TreeParts;

export type TreePart = typeof TreeParts[TreePartKeys]

type ColorTree = {
	[K in TreePart]: Color;
}

type CostTree = {
	[K in TreePart]: number;
}

type AvailableTree = {
	[K in TreePart]: Cell[];
}

type AvailableTreeInCell = {
	[K in TerrainType]: TreePart[]
}

class Plant {
	colors: ColorTree = {
		core: 'rgb(220, 220, 0)',
		leaf: 'rgb(0, 220, 0)',
		root: 'rgb(80, 50, 20)',
		branch: 'rgb(120, 80, 40)',
	};

	costs: CostTree = {
		core: 1000,
		leaf: 10,
		root: 10,
		branch: 10,
	};

	types: AvailableTreeInCell = {
		ground: ['root'],
		air: ['branch', 'leaf']
	};

	plantCells: PlantCell[] = [];

	energy = 0;
	availableCells: AvailableTree = {
		core: [],
		leaf: [],
		root: [],
		branch: []
	};

	surroundCells: AvailableTree = {
		core: [],
		leaf: [],
		root: [],
		branch: []
	}

	constructor(public readonly matrix: Matrix, public readonly cell: Cell) {
		this.energy = 10000000;

		this.addPlantCell(cell, 'core')
	}

	growRandom() {
		const type = Object.keys(TreeParts)[randomInt(0, Object.keys(TreeParts).length - 1)] as TreePart;
		const cell = this.availableCells[type][randomInt(0, this.availableCells[type].length - 1)];

		return this.grow(cell, type)
	}

	grow(cell: Cell, type: TreePart) {
		if (this.energy > this.costs[type] && cell) {
			this.energy -= this.costs[type];

			const plant = this.addPlantCell(cell, type)

			return plant;
		}

		return null;
	}

	private addPlantCell = (cell: Cell, type: TreePart) => {
		const plant = new PlantCell(cell, type, this.costs[type]);
		cell.setColor(this.colors[type]);
		cell.setPlant(type)
		this.plantCells.push(plant);

		this.updateSurroundCells(cell, type)
		this.updateAvailableCells()

		return plant
	}

	private updateSurroundCells = (cell: Cell, type: TreePart) => {
		const surroundCells = this.matrix.getAroundCells(cell)
		this.addSurroundCells(surroundCells, type);
	};

	private addSurroundCells = (cells: Cell[], type: TreePart) => {
		this.colorSurroundCells(cells)
		this.surroundCells[type].push(...cells);
	};

	private colorSurroundCells = (cells: Cell[]) => {
		cells.filter(cell => cell.plant === null).forEach(cell => cell.setColor('#000'))
	};

	private updateAvailableCells = () => {
		const freeCellsCore = this.surroundCells.core
		const freeCellsBranch = this.surroundCells.branch
		const freeCellsRoot = this.surroundCells.root

		this.setAvailableCells([...freeCellsCore, ...freeCellsBranch].filter(cell => cell.plant === null && cell.type === 'air'), 'leaf')
		this.setAvailableCells([...freeCellsCore, ...freeCellsBranch, ...freeCellsRoot].filter(cell => (cell.plant === null || cell.plant === 'leaf') && cell.type === 'air'), 'branch')
		this.setAvailableCells([...freeCellsCore, ...freeCellsRoot].filter(cell => cell.plant === null && cell.type === 'ground'), 'root')
	}

	private setAvailableCells = (cells: Cell[], type: TreePart) => {
		this.availableCells[type] = cells;
	};

	private addAvailableCells = (cells: Cell[], type: TreePart) => {
		this.availableCells[type].push(...cells);
	};
}

class PlantCell {
	constructor(public readonly environment: Cell, public readonly type: TreePart, private energy) { }
}

export { Plant }