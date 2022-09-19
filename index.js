const test = require("./lib/Test1.json")
const appA = require("./Applications/appA.json")
const appB = require("./Applications/appB.json")
const appC = require("./Applications/appC.json")



let matrixSizeX = test.MPSOC_SIZE_X
let matrixSizeY = test.MPSOC_SIZE_Y
let tasksPerProcessor = test.TASKS_PER_PROCESSOR
let tasks = test.TEST

class processor {
    constructor() {
        this.package = 0
    }
}

const matrix = {sizeX: 0, sizeY: 0, processorMap: []}


function initMatrix(mtx) {

    if(matrixSizeX < 1 || matrixSizeY < 1) {
        console.log("Eror!, matrix size is too small! Resting to 4...")
        matrixSizeX = 4
        matrixSizeY = 4
    }

    for(let i = 0; i < matrixSizeX; i++) {
        mtx.processorMap.push(new Array())
        for(let y = 0; y < matrixSizeY; y++) {
            mtx.processorMap[i].push(new processor())
        }
    }
}

function getProcessor(x, y) {
    return matrix.processorMap[x][y].package
}

function main() {

    //initialize matrix
    initMatrix(matrix)

    //

}
