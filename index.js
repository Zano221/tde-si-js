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
}

const matrix = {
    sizeX: 4, 
    sizeY: 4, 
    processorMap: [], 
    taskMap: new Map(),

    //IMPORTANT FUNCTION: must be called every time a new matrix is invoked (not defining matrix as a class tho)
    initMatrix(taskAmmount, newSizeX, newSizeY) {

        if(newSizeX < 1 || newSizeY < 1) {
            console.log("Eror!, matrix size is too small! Reseting to 4...")
            newSizeX = 4
            newSizeY = 4
        }
        
        for(let i = 0; i < newSizeX; i++) {
            this.processorMap.push(new Array())
            for(let y = 0; y < newSizeY; y++) {
                this.processorMap[i].push(new processor(taskAmmount))
            }
        }
    },

    getProcessor(x, y) {
        return this.processorMap[x][y]
    },

    isProcessorAvailable(x, y) {
        return !this.getProcessor(x, y).isFull()
    },

    insertTask(task, x = 0, y = 0) {

        console.log("Insertin Task", task, "at position", x, y, "taskList length", this.processorMap[x][y].processorTaskList.length)

        /*if(x > this.sizeX-1 || y > this.sizeY-1) {
            console.warn("ERROR! Attempt to insert task beyond matrix limit!")
            return
        }
        
        if(!this.isProcessorAvailable(x, y)) {
            console.warn("WARNING!, current taskList at X:", x, ",Y:", y, ",name:", task, "is full! Placing at...") //Error handler
            
            //ELIF SPAGHETTI CODE DONT LOOK
            //Try to find a new place to insert task
            if(!this.isProcessorAvailable(x+1, y) && x < this.sizeX-1) {
                x += 1
            }/* else if(!this.isProcessorAvailable(x-1,y) && x > 0) {
                x -=1
            } else if(!this.isProcessorAvailable(x, y+1) && y < this.sizeY-1) {
                y +=1
            } else if(!this.isProcessorAvailable(x, y-1) && y > 0) {
                y -=1
            } else {
                console.warn("ERROR! All tasks from all side processors are full! Task will not be inserted!")
                return
            }

            console.warn("new place, X:", x, ",Y:", y)
        }*/

        this.processorMap[x][y].insertTaskToList(task)
        this.taskMap.set(task, {x: x, y: y})
    },

    findTask(task) {
        return this.taskMap.get(task)
    },

    insertPackage(x, y, pkg) {
       matrix.processorMap[x][y].package += pkg 
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

    let x = 0
    let y = 0
    while(caseIndex < qtd) {
        
        

        x = startPos
        console.log(x, y)
        while(x < matrix.sizeX) {
            for(let n = 0; n < tasksPerProcessor; n++) {

                if(taskListHead == taskList.length-1) {
                    taskListHead = 0
                }

                matrix.insertTask(taskList[taskListHead], x, y)
                
                taskListHead++
            }
            x++
        }

        startPos++

        x= startPos
        y = startPos
        console.log(x, y)
        while(y < matrix.sizeY) {
            for(let n = 0; n < tasksPerProcessor; n++) {

                if(taskListHead == taskList.length-1) {
                    taskListHead = 0
                }

                matrix.insertTask(taskList[taskListHead], x, y)

                taskListHead++

            }

            y++
        }
        
        startPos++

        //actual task loop
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


        //Print Matrix
        /*for(let y = 0; y < matrix.sizeY; y++) {
            for(let x = 0; x < matrix.sizeX; x++) {

                console.log(matrix.getProcessor(x, y).processorTaskList)

            }
            console.log("")
        }*/

        //RESET MATRIX

        caseIndex++
    }


})


