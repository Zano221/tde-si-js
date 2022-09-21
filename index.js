const test = require("./lib/Test1.json")
const appA = require("./Applications/appA.json")
const appB = require("./Applications/appB.json")
const appC = require("./Applications/appC.json")

const appList = []

appList.push(appA)
appList.push(appB)
appList.push(appC)

let matrixSizeX = test.MPSOC_SIZE_X
let matrixSizeY = test.MPSOC_SIZE_Y
let tasksPerProcessor = test.TASKS_PER_PROCESSOR
let tasks = test.TEST

class processor {
    constructor(taskAmmount) {
        this.package = 0
        this.name = ""
        this.taskAmmount = taskAmmount
    }
}

const matrix = {sizeX: 0, sizeY: 0, processorMap: []}


function initMatrix(mtx, taskammount) {

    if(matrixSizeX < 1 || matrixSizeY < 1) {
        console.log("Eror!, matrix size is too small! Resting to 4...")
        matrixSizeX = 4
        matrixSizeY = 4
    }

    for(let i = 0; i < matrixSizeX; i++) {
        mtx.processorMap.push(new Array())
        for(let y = 0; y < matrixSizeY; y++) {
            mtx.processorMap[i].push(new processor(taskammount))
        }
    }
}

function getProcessor(x, y) {
    return matrix.processorMap[x][y]
}

/*function getTestCases(tsks) {
    try {
        let testCases = []
        tsks.forEach((e) => {
            testCases.push(e)
        })
    
        return testCases
    }
    catch(e) {
        console.error("ERROR! getTestCases function error!", e)
    }
    
}*/

function main() {

    //initialize matrix
    initMatrix(matrix)

    //get all cases 
    let testCaseList = tasks // getTestCases(tasks)

    //Begin applist (appA, appB, appC, etc)
    testCaseList.forEach((testCase, appIndex) => {
        let app = testCase.APP
        let qtd = testCase.QTD
        let currentApp = appList[appIndex]

        
        //Message for each case
        console.log("\nCASE:", app)
        console.log(currentApp.grafo_tarefas.length)
        
        //QTD loop
        let caseIndex = 0
        while(caseIndex < qtd) {
            
            //actual task loop
            let currentGrafo_tarefas = currentApp.grafo_tarefas
            for(let i = 0; i < currentGrafo_tarefas.length; i++) {
                
                let taskOrigin = currentGrafo_tarefas[i].tarefa_origem
                let taskDestiny = currentGrafo_tarefas[i].tarefa_origem
                let pkgAmmount = currentGrafo_tarefas[i].quantidade_pacotes

                /*
                
                
                
                */
                
            }
                    



            caseIndex++
        }


    })
    




}

//Autorun main
main()
