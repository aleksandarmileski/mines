import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs/observable/interval';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-mines',
    templateUrl: './mines.component.html',
    styleUrls: ['./mines.component.css']
})
export class MinesComponent implements OnInit {
    MODE = { EASY: 'EASY', MEDIUM: 'MEDIUM', HARD: 'HARD' };
    STATE = { PLAYING: 'PLAYING', WON: 'WON', LOST: 'LOST' };

    selectedMode;
    mineMatrix = [];
    displayMineMatrix = [];
    shownCounter = 0;

    size = 0;
    bombsNumber = 0;
    setBombs = 0;
    status = this.STATE.PLAYING;

    timer = interval(1000);
    timerSeconds = 0;
    timerSubscription: Subscription = null;

    constructor() {
    }

    ngOnInit() {
    }

    selectMode(mode) {
        this.mineMatrix = [];
        this.displayMineMatrix = [];
        this.selectedMode = mode;
        this.initializeMatrix(this.selectedMode);

        if (this.timerSubscription) this.stopTimer();

    }

    initializeMatrix(difficulty) {
        this.mineMatrix = [];

        switch (difficulty) {
            case this.MODE.EASY:
                this.size = 9;
                this.bombsNumber = 10;
                break;
            case this.MODE.MEDIUM:
                this.size = 16;
                this.bombsNumber = 40;
                break;
            case this.MODE.HARD:
                this.size = 30;
                this.bombsNumber = 100;
                break;
            default:
                break;
        }

        for (let i = 0; i < this.size; i++) {
            this.mineMatrix.push(new Array(this.size).fill('?'));
            this.displayMineMatrix.push(new Array(this.size).fill(false));
        }
        this.addBombs(this.size, this.bombsNumber);
        this.shownCounter = 0;
        this.status = this.STATE.PLAYING;
        this.setBombs = 0;
        this.timerSeconds = 0;
    }

    initializeTimer() {
        this.timerSubscription = this.timer.subscribe(seconds => this.timerSeconds++);
    }

    stopTimer() {
        if (this.timerSubscription) this.timerSubscription.unsubscribe();
        this.timerSubscription = null;
    }

    fieldClick(event, rowIndex, columnIndex) {
        if (!this.timerSubscription && this.timerSeconds === 0) {
            this.initializeTimer();
        }

        if (this.status === this.STATE.PLAYING) {
            if (event.type === 'click') {

                if (this.mineMatrix[rowIndex][columnIndex] === '?') {
                    this.checkFields(rowIndex, columnIndex);
                }
                if (this.mineMatrix[rowIndex][columnIndex] === '*'
                    && this.displayMineMatrix[rowIndex][columnIndex] !== undefined
                    && this.status === this.STATE.PLAYING) {

                    this.status = this.STATE.LOST;
                    this.stopTimer();
                    this.displayMineMatrix.map((row, rowIndx) => {
                        row.map((field, columnIndx) => {
                            if (this.mineMatrix[rowIndx][columnIndx] === '*') {
                                this.displayMineMatrix[rowIndx][columnIndx] = true;
                            }
                        });
                    });
                }
                if ("12345678".indexOf(this.mineMatrix[rowIndex][columnIndex]) > -1) {
                    this.printNeighbours(rowIndex, columnIndex, this.size);
                }

                if (this.displayMineMatrix[rowIndex][columnIndex] !== undefined) {
                    this.displayMineMatrix[rowIndex][columnIndex] = true;
                }

            }
            if (event.type === 'contextmenu' && !this.displayMineMatrix[rowIndex][columnIndex]) {
                this.displayMineMatrix[rowIndex][columnIndex] =
                    this.displayMineMatrix[rowIndex][columnIndex] === undefined
                        ? false
                        : undefined;
                let setBombs = 0;
                this.displayMineMatrix.forEach(fieldRow => fieldRow.forEach(field => { if (field === undefined) setBombs++; }));
                this.setBombs = setBombs;

            }
        }

        this.setDisplayedFields();
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
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (
                    (i >= 0 && i <= size - 1) &&
                    (j >= 0 && j <= size - 1) &&
                    !(i === x && j === y)
                ) { this.setBombsNeighbourIndex(i, j, size); }
            }
        }
    }
    printNeighbours(x: number, y: number, size) {
        let fieldNeighbourBombs = this.mineMatrix[x][y];
        let fieldNeighbourNumbers = [];
        let fieldNeighbourEmptyFields = [];
        let foundBombsCounter = 0;


        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (
                    (i >= 0 && i <= size - 1) &&
                    (j >= 0 && j <= size - 1) &&
                    !(i === x && j === y)
                ) {
                    if (this.mineMatrix[i][j] === '*' && this.displayMineMatrix[i][j] === undefined) {
                        foundBombsCounter++;
                    }

                    if (this.mineMatrix[i][j] === '?' && !this.displayMineMatrix[i][j]) {
                        fieldNeighbourEmptyFields = [i, j]
                    }

                    if (("12345678".indexOf(this.mineMatrix[i][j]) > -1) && (this.displayMineMatrix[i][j] === false)) {
                        fieldNeighbourNumbers.push([i, j])
                    }
                }
            }
        }

        if (fieldNeighbourBombs === foundBombsCounter) {
            if (fieldNeighbourEmptyFields.length) {
                this.checkFields(fieldNeighbourEmptyFields[0], fieldNeighbourEmptyFields[1]);
            }
            fieldNeighbourNumbers.map(field => this.displayMineMatrix[field[0]][field[1]] = true);

        }
    }

    setBombsNeighbourIndex(x: number, y: number, size) {
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

    checkFields(x: number, y: number, emptyFieldsArray = [], bombsNumberArray = [], newEmptyNeighboursArray = []) {
        const size = this.mineMatrix.length;
        let emptyTurnArray = [];

        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (
                    (i >= 0 && i <= size - 1) &&
                    (j >= 0 && j <= size - 1)
                ) {
                    if (this.mineMatrix[i][j] === '?') {
                        let strArr = JSON.stringify(emptyFieldsArray);
                        let strElement = `[${i},${j}]`;

                        if (strArr.indexOf(strElement) < 0) {
                            emptyFieldsArray.push([i, j]);
                            newEmptyNeighboursArray.push([i, j]);
                        }

                    } else {
                        let strArr = JSON.stringify(bombsNumberArray);
                        let strElement = `[${i},${j}]`;

                        if (strArr.indexOf(strElement) < 0) bombsNumberArray.push([i, j])
                    }
                }
            }
        }

        if (newEmptyNeighboursArray.length === 0) {
            emptyFieldsArray.forEach(field => this.displayMineMatrix[field[0]][field[1]] = true);
            bombsNumberArray.forEach(bombNumber => this.displayMineMatrix[bombNumber[0]][bombNumber[1]] = true);
        } else {
            let removeElement = newEmptyNeighboursArray.shift();
            this.checkFields(removeElement[0], removeElement[1], emptyFieldsArray, bombsNumberArray, newEmptyNeighboursArray)
        }

    }

    setDisplayedFields() {
        this.shownCounter = 0;

        this.displayMineMatrix.forEach(fieldRow => fieldRow.forEach(field => { if (field !== false) this.shownCounter++; }));

        if (
            (this.shownCounter === (this.mineMatrix.length * this.mineMatrix.length))
            && (this.setBombs === this.bombsNumber)
        ) {
            this.status = this.STATE.WON;
            this.stopTimer();
        }
    }

}
