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

//GET TASK POSITIONS ----------------------------------------------------------------

//Begin applist (appA, appB, appC, etc)
testCaseList.forEach((testCase, appIndex) => {
    let app = testCase.APP
    let qtd = testCase.QTD
    let currentApp = appList[appIndex]

    matrix.setQTD(qtd)
    
    //Message for each case
    console.log("\nCASE:", app)

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
    let taskMapLoopAmmount = taskList.length * qtd
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
        console.log(x, y)
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

        if(x == matrix.sizeX-1 && y == matrix.sizeY) {
            console.error("MATRIX REACHED IT'S LIMIT, SHUTTING DOWN MAPPING")
            break
        }
        

        //task loop
        


        /*for(let i = 0; i < currentGrafo_tarefas.length; i++) {
            

            

            let pkgAmmount = currentGrafo_tarefas[i].quantidade_pacotes



            //variables for the loop
            let originX = taskOrigin.x
            let destinyX = taskDestiny.x
            let originY = taskOrigin.y
            let destinyY = taskDestiny.y


            let hasReached = false

            while(!hasReached) {

                let auxX = originX
                let auxY = originY

                if((originX == destinyX) && (originY == destinyY)) {
                    hasReached = true

                    if(matrix.getProcessor(originX, originY).package == 0) {
                        matrix.processorMap[originX][originY].package += pkgAmmount
                    }
                }

                console.log("Into originX")
                //X Loop
                if(originX < destinyX) {
                    while(originX != matrix.sizeX) {
                        
                        matrix.processorMap[originX][originY].package += pkgAmmount
                        
                        if((originX == destinyX) && (originY == destinyY)) {
                            hasReached = true
                        } else {
                            originX++
                        }

                    }
                    auxX += 1
                } else if(originX > destinyX) {
                    while(originX != 0) {
                    
                        matrix.processorMap[originX][originY].package += pkgAmmount
    
                        if((originX == destinyX) && (originY == destinyY)) {
                            hasReached = true
                        } else {    
                            originX--
                        }

                    }
                    auxX -= 1
                }

                originX = auxX
                
                //TODO FROM THIS LINE BELOW

                if(originY < destinyY) {
                    while(originY != matrix.sizeY) {



                    }
                }else if(originY > destiny) {
                    while(originY != matrix.size) {

                    }
                }

                //Y Loop
                
            }

            
        }*/
        
    }

    //Print Matrix
    console.log("\n--------------------> TASK MAP <--------------------\n")
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

    console.log("\n--------------------> HEAT MAP <--------------------\n")

    for(let y = matrix.sizeY-1; y >= 0; y--) {
        for(let i = 0; i < matrix.sizeX; i++) {

            const processor = matrix.getProcessor(x,y)
            process.stdout.write("|[")

            process.stdout.write(processor.package.toString())

            process.stdout.write("]|")

        }

        console.log("")
    }

    console.log(matrix.taskMap)

    //RESET MATRIX
    matrix.resetMatrix()

    console.log("REFERENCE", matrix.getProcessor(0,0).processorTaskList)

})


