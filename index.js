const test = require("./lib/Test1.json")

const appList = []

appList.push(require("./Applications/appA.json"))
appList.push(require("./Applications/appB.json"))
appList.push(require("./Applications/appC.json"))

let matrixSizeX = parseInt(test.MPSOC_SIZE_X, 10)
let matrixSizeY = parseInt(test.MPSOC_SIZE_Y, 10)
let tasksPerProcessor = test.TASKS_PER_PROCESSOR

class processor {
    constructor(tasksPerProcessor) {
        this.package = 0
        this.taskLimit = tasksPerProcessor
        this.processorTaskList = []
        //blueprint: this.taskList = [{name: ""}]
    }

    isFull() {
        return this.processorTaskList.length >= this.taskLimit
        
    }
    
    insertTaskToList(taskName) {
        if(this.isFull()) {
           console.log("ERROR! processorTaskList is full!")
           return 
        }
        this.processorTaskList.push({name: taskName.toString()})
    }

    clear() {
        let length = this.processorTaskList.length
        if(length != 0) {
            for(let i = 0; i < length; i++) {
                this.processorTaskList.pop()

            }
        }

        this.package = 0

    }
}

const matrix = {
    sizeX: 4, 
    sizeY: 4, 
    processorMap: [], 
    taskMap: new Map(),
    taskLimit: 0,
    qtd: 0,

    //IMPORTANT FUNCTION: must be called every time a new matrix is invoked (not defining matrix as a class tho)
    initMatrix(taskAmmount, newSizeX, newSizeY, qtd = 0) {

        this.qtd = qtd        
        this.sizeX = newSizeX
        this.sizeY = newSizeY

        if(this.sizeX < 1 || this.sizeY < 1) {
            console.log("Eror!, matrix size is too small! Reseting to 4...")
            this.sizeX = 4
            this.sizeY = 4
        }
        
        for(let i = 0; i < this.sizeX; i++) {
            this.processorMap.push(new Array())
            for(let y = 0; y < this.sizeY; y++) {
                this.processorMap[i].push(new processor(taskAmmount))
            }
        }

        this.taskLimit = taskAmmount
        console.log(this.qtd)
    },

    resetMatrix() {

        for(let y = 0; y < this.sizeY; y++) {
            for(let x = 0; x <this.sizeX; x++) {
                let processor = this.getProcessor(x, y)
                
                processor.clear()
            }
        }

        this.taskMap.clear()
        
    },

    getProcessor(x, y) {
        return this.processorMap[x][y]
    },

    isProcessorAvailable(x, y) {
        return !this.getProcessor(x, y).isFull()
    },

    insertTask(task, x = 0, y = 0) {

        this.processorMap[x][y].insertTaskToList(task)

        let firstInstance = 0
        task = task + "_" + firstInstance.toString()

        if(this.taskMap.has(task)) {

            task = task.slice(0, task.length - 1)

            for(let i = 0; i < this.qtd; i++) {

                task = task + i.toString()

                if(this.taskMap.has(task)) {
                    task = task.slice(0, task.length - 1)
                } else {
                    break
                }
            }
        }

        this.taskMap.set(task, {x: x, y: y})
    },

    findTask(task) {
        return this.taskMap.get(task)
    },

    insertPackage(x, y, pkg) {
       matrix.processorMap[x][y].package += pkg 
    },

    setQTD(qtd) {
        this.qtd = qtd
    }
}

//initialize matrix
matrix.initMatrix(tasksPerProcessor, matrixSizeX, matrixSizeY, 5)
//get all cases 
let testCaseList = test.TEST // getTestCases(tasks)

//Begin applist (appA, appB, appC, etc)
testCaseList.forEach((testCase, appIndex) => {
    let app = testCase.APP
    let currentApp = appList[appIndex]

    matrix.setQTD(testCase.QTD)
    
    //Message for each case
    console.log("\n==========> CASO", app, " <==========\n")

    //map all tasks
    let taskList = []

    
    let currentGrafo_tarefas = currentApp.grafo_tarefas
    for(let i = 0; i < currentGrafo_tarefas.length; i++) {
            

        let taskOrigin = currentGrafo_tarefas[i].tarefa_origem
        let taskDestiny = currentGrafo_tarefas[i].tarefa_destino

        if(!taskList.includes(taskOrigin)) {
            taskList.push(taskOrigin)
        }

        if(!taskList.includes(taskDestiny)) {
            taskList.push(taskDestiny)
        }
    }    

    //QTD loop
    let caseIndex = 0
    let startPos = 0
    let taskListHead = 0
    let hasReached = false

    let x = 0
    let y = 0
    let taskMapLoopAmmount = taskList.length * matrix.qtd
    while(!hasReached) {

        x = startPos
        y = startPos
        while(x < matrix.sizeX && !hasReached) {
            for(let n = 0; n < tasksPerProcessor; n++) {

                if(taskListHead >= taskList.length) {
                    taskListHead = 0
                }

                if(caseIndex >= taskMapLoopAmmount) {
                    hasReached = true
                    break
                }

                try {
                    matrix.insertTask(taskList[taskListHead], x, y)
                }catch(e) {
                    console.log("Exception caught lol",x, y)
                }
                
                
                taskListHead++
                caseIndex++
            }
            x++
        }
        
        if(hasReached) {
            break
        }

        startPos++

        x = startPos-1
        y = startPos
        while(y < matrix.sizeY && !hasReached) {
            for(let n = 0; n < tasksPerProcessor; n++) {

                if(taskListHead == taskList.length) {
                    taskListHead = 0
                }

                if(caseIndex == taskMapLoopAmmount-1) {
                    hasReached = true
                    break
                }

                matrix.insertTask(taskList[taskListHead], x, y)

                taskListHead++
                caseIndex++

            }

            y++

        }

        if(x == matrix.sizeX-1 && y == matrix.sizeY-1) {
            console.error("MATRIX REACHED IT'S LIMIT, SHUTTING DOWN MAPPING")
            break
        }
        
    }

    //ACTUAL TASK LOOP
    for(let i = 0; i < matrix.qtd; i++) {

        console.log("\n===[ LOOP DE RELACIONAMENTO INICIADO QTD:", matrix.qtd, "]===\n")

        for(let n = 0; n < currentGrafo_tarefas.length; n++) {

            const currentGrafo = currentGrafo_tarefas[n]
            const taskOrigin = currentGrafo.tarefa_origem
            const taskDestiny = currentGrafo.tarefa_destino

            let taskOriginPos = matrix.taskMap.get(taskOrigin + "_" + i.toString())
            let taskDestinyPos = matrix.taskMap.get(taskDestiny + "_" + i.toString())
            let pkg = currentGrafo.quantidade_pacotes

            let isTaskOriginRepeated = false
            let isTaskDestinyRepeated = false
        
            if(taskOriginPos === undefined) {
                isTaskOriginRepeated = true
                let hasFoundTask = false
                
                let pos = i

                while(!hasFoundTask) {
                    taskOrigin = matrix.taskMap.get(currentGrafo.tarefa_origem + "_" + (pos-1).toString())

                    if(taskOrigin !== undefined) {
                        hasFoundTask = true
                    }

                    pos--
                }
            }

            if(taskDestinyPos === undefined) {
                isTaskDestinyRepeated = true
                let hasFoundTask = false

                let pos = i

                while(!hasFoundTask) {
                    taskDestinyPos = matrix.taskMap.get(currentGrafo.tarefa_destino + "_" + (pos-1).toString())

                    if(taskDestinyPos !== undefined) {
                        hasFoundTask = true
                    }
                    pos--
                }
            }

           if(taskOriginPos.x == taskDestinyPos.x && taskOriginPos.y == taskDestinyPos.y) {


                if(matrix.qtd > 1) {
                    if(matrix.taskMap.has(taskDestiny + "_" + (i+1))) {
                        taskDestinyPos = matrix.taskMap.get(taskDestiny + "_" + (i+1))
                    } else {
                        taskDestinyPos = matrix.taskMap.get(taskDestiny + "_" + (i-1))
                    } 
                    console.log("A Origem {", taskOrigin, "} e o destino {",
                    taskDestiny, "} ocupam a mesma posição! Mudando o destino para: X:",
                    taskDestinyPos.x, "Y:", taskDestinyPos.y)
                }
            }

            
            let hasTaskReached = false
            let x = taskOriginPos.x 
            let y = taskOriginPos.y

            console.log("\nPOSIÇÃO ORIGEM {", taskOrigin, "} INICIAL X:", x, "Y:", y, "\n")

            while(!hasTaskReached) {

                matrix.insertPackage(x, y, 1)

                if(x == taskDestinyPos.x && y == taskDestinyPos.y) {
                    hasTaskReached = true
                    console.log("\n-----> PACOTE {", taskOrigin, "} CHEGOU AO DESTINO <-----\n")
                    break
                }

                if(x < taskDestinyPos.x) {
                    x++
                    console.log("PASSO X -( X:", x, "Y:", y, ")-")
                }else if(x > taskDestinyPos.x) {
                    x--
                    console.log("PASSO X -( X:", x, "Y:", y, ")-")
                }

                if(y < taskDestinyPos.y) {
                    y++
                    console.log("PASSO Y -( X:", x, "Y:", y, ")-")
                }else if(y > taskDestinyPos.y) {
                    y--
                    console.log("PASSO Y -( X:", x, "Y:", y, ")-")
                }

            }
            
            
        }



    }

    //Print Matrix
    console.log("\n|====================> TASK MAP <====================|\n")
    for(let y = matrix.sizeY-1; y >= 0; y--) {
        for(let x = 0; x < matrix.sizeX; x++) {

            process.stdout.write("|[")

            let processor = matrix.getProcessor(x,y)

            processor.processorTaskList.forEach((task, index) => {
                process.stdout.write(task.name)
                
                if(index+1 != processor.processorTaskList.length) {
                    process.stdout.write(",")
                }

            })
            
            let fillProcessor = processor.processorTaskList.length
            

            if(fillProcessor < tasksPerProcessor && processor.processorTaskList.length > 0) {
                process.stdout.write(",")
            }

            while(fillProcessor < tasksPerProcessor) {

                process.stdout.write("0")

                if(fillProcessor+1 != tasksPerProcessor) {
                    process.stdout.write(",")
                }

                fillProcessor++
            }

            process.stdout.write("]| ")
        }
        console.log("")
    }
    

    console.log("\n|====================> HEAT MAP <====================|\n")
    for(let y = matrix.sizeY-1; y >= 0; y--) {
        for(let x = 0; x < matrix.sizeX; x++) {

            //const processor = matrix.getProcessor(x,y)
            process.stdout.write("|[ ")

            process.stdout.write(matrix.processorMap[x][y].package.toString())

            process.stdout.write(" ]| ")

        }

        console.log("")
    }

    //RESET MATRIX
    matrix.resetMatrix()
})