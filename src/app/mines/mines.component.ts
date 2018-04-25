import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-mines',
    templateUrl: './mines.component.html',
    styleUrls: ['./mines.component.css']
})
export class MinesComponent implements OnInit {
    MODE = {EASY: 'EASY', MEDIUM: 'MEDIUM', HARD: 'HARD'};

    selectedMode;
    mineMatrix = [];

    constructor() {
    }

    ngOnInit() {
    }

    selectMode(mode) {
        this.selectedMode = mode;
        this.initializeMatrix(this.selectedMode);
    }

    initializeMatrix(difficulty) {
        this.mineMatrix = [];
        let size = 0;
        let bombs = 0;
        switch (difficulty) {
            case this.MODE.EASY:
                size = 9;
                bombs = 10;
                break;
            case this.MODE.MEDIUM:
                size = 16;
                bombs = 40;
                break;
            case this.MODE.HARD:
                size = 30;
                bombs = 100;
                break;
            default:
                break;
        }

        for (let i = 0; i < size; i++) {
            this.mineMatrix.push(new Array(size).fill('?'));
        }
        this.addBombs(size, bombs);
    }

    fieldClick(event, rowIndex, columnIndex) {
        console.log(event.type === 'click' ? 'CLICK' : 'RIGHTCLICK');
        console.log(this.mineMatrix[rowIndex][columnIndex]);
        if (event.type === 'click' && this.mineMatrix[rowIndex][columnIndex] === '?') {
            this.checkFields(rowIndex, columnIndex);
        }
        return false;
    }

    addBombs(size: number, bombs) {
        while (bombs) {
            const random1 = Math.floor(Math.random() * ((size - 1) + 1)) + 0;
            const random2 = Math.floor(Math.random() * ((size - 1) + 1)) + 0;
            if (this.mineMatrix[random1][random2] !== '*') {
                bombs--;
                this.mineMatrix[random1][random2] = '*';
                this.setNeighbours(random1, random2, size);
            }
        }
    }

    setNeighbours(x: number, y: number, size) {
        // console.log(`Searching around [${x},${y}]`);
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (
                    (i >= 0 && i <= size - 1) &&
                    (j >= 0 && j <= size - 1) &&
                    !(i === x && j === y)
                ) this.setBombsNeighbourIndex(i, j, size);
            }
        }
        // console.log(`---------------`);
    }

    setBombsNeighbourIndex(x: number, y: number, size) {
        // console.log(`[${x},${y}] - '${this.mineMatrix[x][y]}'`);
        let bombsCount = 0;
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (
                    (i >= 0 && i <= size - 1) &&
                    (j >= 0 && j <= size - 1) &&
                    !(i === x && j === y)
                ) {
                    if (this.mineMatrix[i][j] === '*') bombsCount++;
                }
            }
        }

        if (this.mineMatrix[x][y] !== '*') {
            this.mineMatrix[x][y] = bombsCount;
        }
    }

    checkFields(x: number, y: number) {
        const size = this.mineMatrix.length;

        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (
                    (i >= 0 && i <= size - 1) &&
                    (j >= 0 && j <= size - 1) &&
                    !(i === x && j === y)
                ) {
                    if (this.mineMatrix[i][j] === '?') {

                    }
                }
            }
        }
    }
}
