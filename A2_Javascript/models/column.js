/**
 * Represent Event
 * @class
 */
class Column {

    constructor(name) {

        this.id = this.generateId();
        this.name = name;
        this.tasks= [];
    }


    generateId() {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const randomChar1 = characters[Math.floor(Math.random()*characters.length)];
        const randomChar2 = characters[Math.floor(Math.random()*characters.length)];
        // Random number between 0000-9999
        const randomNumber = Math.floor(Math.random() * 10);
        const randomNumber1 = Math.floor(Math.random() * 10);
        const randomNumber2 = Math.floor(Math.random() * 10);
        const randomNumber3 = Math.floor(Math.random() * 10);
        return `E${randomChar1}${randomChar2}-${randomNumber}${randomNumber1}${randomNumber2}${randomNumber3}`;
    }
    

    getId() {
        return this.id;
    }

    addTasks(newTask) {
        this.tasks.push(newTask);
        
    }

    removeTasks(oldTask) {
        let itemToRemove = oldTask;
        let indexToRemove = this.tasks.indexOf(itemToRemove);
        console.log("index: " + indexToRemove);
        // if (indexToRemove !== -1) {
        //     this.priority.splice(indexToRemove, 1);
        //     }
        this.tasks = this.tasks.filter(item => item !== oldTask);
    }
}

module.exports = Column;