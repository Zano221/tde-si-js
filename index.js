const test = require("./lib/Test1.json")
const appA = require("./Applications/appA.json")
const appB = require("./Applications/appB.json")
const appC = require("./Applications/appC.json")


const processor = {package: 0, name: ""}

const matrix = {lines: 0, column: 0, processor: [lines][column]}

let matrixSizeX = test.MPSOC_SIZE_X
let matrixSizeY = test.MPSOC_SIZE_Y
let tasksPerProcessor = test.TASKS_PER_PROCESSOR
let tasks = test.TEST