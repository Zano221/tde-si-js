const test = require("./lib/Test1.json")

const appList = []

appList.push(require("./Applications/appA.json"))
appList.push(require("./Applications/appB.json"))
appList.push(require("./Applications/appC.json"))

let matrixSizeX = test.MPSOC_SIZE_X
let matrixSizeY = test.MPSOC_SIZE_Y
let tasksPerProcessor = test.TASKS_PER_PROCESSOR

class processor {
    constructor(tasksPerProcessor) {
        this.package = 0
        this.taskLimit = tasksPerProcessor
        this.taskList = []
        //blueprint: this.taskList = [{name: ""}]
    }

    isFull() {
        return this.taskList.length >= this.taskLimit
        
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
    taskMap: new Map(),

    //IMPORTANT FUNCTION: must be called every time a new matrix is invoked (not defining matrix as a class tho)
    initMatrix(taskAmmount, newSizeX = 4, newSizeY = 4) {

        if(newSizeX < 1 || newSizeY < 1) {
            console.log("Eror!, matrix size is too small! Reseting to 4...")
            sizeX = newSizeX
            sizeY = newSizeY
        }
    
        for(let i = 0; i < this.sizeX; i++) {
            this.processorMap.push(new Array())
            for(let y = 0; y < this.sizeY; y++) {
                this.processorMap[i].push(new processor(taskAmmount))
            }
        }
    },

    getProcessor(x, y) {
        return this.processorMap[x][y]
    },

    insertTask(task, x = 0, y = 0) {
        console.log(this.processorMap[x][y].insertTask(task))
        this.taskMap.set(task, {x: x, y: y})
    },

    findTask(task) {
        return this.taskMap.get(task)
    }
}

//initialize matrix
matrix.initMatrix(tasksPerProcessor, matrixSizeX, matrixSizeY)
//get all cases 
let testCaseList = test.TEST // getTestCases(tasks)

//GET TASK POSITIONS ----------------------------------------------------------------

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

        //map all tasks
        let task_positions = currentApp.task_positions
        for(let i = 0; i < task_positions.length; i++) {
            
            const x = task_positions[i].x
            console.log("X:", x)
            const y = task_positions[i].y
            console.log("Y:", y)
            const name = task_positions[i].name

            matrix.insertTask(name, x, y)
        }

        //actual task loop
        let currentGrafo_tarefas = currentApp.grafo_tarefas
        for(let i = 0; i < currentGrafo_tarefas.length; i++) {
            
            let taskOrigin = matrix.findTask(currentGrafo_tarefas[i].tarefa_origem)
            let taskDestiny = matrix.findTask(currentGrafo_tarefas[i].tarefa_destino)
            let pkgAmmount = currentGrafo_tarefas[i].quantidade_pacotes

            
            while(true) {
                
                if(taskOrigin.x > taskDestiny.x) {
                    console.log("negative!")
                    break
                }

            }

            
        }


        caseIndex++
    }


})


