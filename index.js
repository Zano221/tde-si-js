const test = require("./lib/Test1.json")

const appList = []

appList.push(require("./Applications/appA.json"))
appList.push(require("./Applications/appB.json"))
appList.push(require("./Applications/appC.json"))

let matrixSizeX = test.MPSOC_SIZE_X
let matrixSizeY = test.MPSOC_SIZE_Y
let tasksPerProcessor = test.TASKS_PER_PROCESSOR

class processor {
    constructor(taskAmmount) {
        this.package = 0
        this.taskAmmount = taskAmmount
        this.taskList = []
        //blueprint: this.taskList = [{name: ""}]
    }

    isFull() {
        return taskList.length === this.taskAmmount
    }
    
    insertTask(taskName) {
        if(this.isFull()) {
           console.log("ERROR! TaskList is full!")
           return 
        }
        this.taskList.push({name: taskName.toString()})
    }
}

const matrix = {
    sizeX: 4, 
    sizeY: 4, 
    processorMap: [], 
    getProcessor(x, y) {
        return this.processorMap[x][y]
}}


function initMatrix(mtx, taskAmmount) {

    if(matrixSizeX < 1 || matrixSizeY < 1) {
        console.log("Eror!, matrix size is too small! Resting to 4...")
        matrixSizeX = 4
        matrixSizeY = 4
    }

    for(let i = 0; i < matrixSizeX; i++) {
        mtx.processorMap.push(new Array())
        for(let y = 0; y < matrixSizeY; y++) {
            mtx.processorMap[i].push(new processor(taskAmmount))
        }
    }
}

function getProcessor(x, y) {
    return matrix.processorMap[x][y]
}

function main() {

    //initialize matrix
    initMatrix(matrix, tasksPerProcessor)
    //get all cases 
    let testCaseList = test.TEST // getTestCases(tasks)

    //Begin applist (appA, appB, appC, etc)
    testCaseList.forEach((testCase, appIndex) => {
        let app = testCase.APP
        let qtd = testCase.QTD
        let currentApp = appList[appIndex]

        
        //Message for each case
        console.log("\nCASE:", app)
        //console.log(currentApp.grafo_tarefas.length)
        
        //QTD loop
        let caseIndex = 0
        while(caseIndex < qtd) {
            
            //actual task loop
            let currentGrafo_tarefas = currentApp.grafo_tarefas
            for(let i = 0; i < currentGrafo_tarefas.length; i++) {
                
                let taskOrigin = currentGrafo_tarefas[i].tarefa_origem
                let taskDestiny = currentGrafo_tarefas[i].tarefa_destino
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
