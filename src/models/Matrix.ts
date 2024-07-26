import { Color } from "./Color";
import { TreePart } from "./Plant";

type TerrainType = 'ground' | 'air';

class Cell {
    plant: TreePart = null
    constructor(public readonly index: number, public readonly type: TerrainType, public color: Color) { }

    setColor = (color: Color) => {
        this.color = color
    }

    setPlant = (plant: TreePart) => {
        this.plant = plant
    }
}

class Matrix {
    private matrix: Cell[];

    constructor(public readonly width: number, public readonly height: number) {
        this.matrix = new Array(width * height).fill(null).map((_, index) => this.fillCell(index));
    }

    fillCell = (index: number) => {
        if (2 * Math.floor(index / this.width) < this.height) {
            return new Cell(index, 'air', 'rgb(0, 220, 220)')
        }
        return new Cell(index, 'ground', 'rgb(100, 70, 20)')
    }

    getElement = (i: number, j: number): Cell | undefined => {
        if (i < 0 || i >= this.height || j < 0 || j >= this.width) {
            throw new Error('Индексы выходят за границы матрицы');
        }
        return this.matrix[i * this.width + j];
    }

    // Установка значения элемента матрицы по индексам i и j
    setElement = (i: number, j: number, value: Cell): void => {
        if (i < 0 || i >= this.height || j < 0 || j >= this.width) {
            throw new Error('Индексы выходят за границы матрицы');
        }
        this.matrix[i * this.width + j] = value;
    }

    // Получение всей матрицы в виде двумерного массива
    getMatrix = (type: 'matrix' | 'array') => {
        if (type === 'array') {
            return this.matrix
        }

        if (type === 'matrix') {
            const result: Cell[][] = [];
            for (let i = 0; i < this.height; i++) {
                const row: Cell[] = [];
                for (let j = 0; j < this.width; j++) {
                    row.push(this.matrix[i * this.width + j]);
                }
                result.push(row);
            }
            return result;
        }

        return [];
    }

    getAroundCells = (cell: Cell) => {
        const i = Math.floor(cell.index / this.width)
        const j = cell.index % this.width

        const cells: Cell[] = []
        if (i !== 0) {
            cells.push(this.matrix[cell.index - this.width])
        }
        if (i !== this.height - 1) {
            cells.push(this.matrix[cell.index + this.width])
        }
        if (j !== 0) {
            cells.push(this.matrix[cell.index - 1])
        }
        if (j !== this.width - 1) {
            cells.push(this.matrix[cell.index + 1])
        }

        return cells
    }
}

export { TerrainType, Cell, Matrix }