/**
 * Represent Event
 * @class
 */
class User {

    constructor(name, username, password) {

        this.id = this.generateId();
        this.name = name;
        this.username = username;
        this.password = password;
        this.tasks = [];
    }


    generateId() {
        // Random number between 0000-9999
        const randomNumber = Math.floor(Math.random() * 10);
        const randomNumber1 = Math.floor(Math.random() * 10);
        const randomNumber2 = Math.floor(Math.random() * 10);
        const randomNumber3 = Math.floor(Math.random() * 10);
        return `USER-${randomNumber}${randomNumber1}${randomNumber2}${randomNumber3}`;
    }

    setid(id){
        this.id = id;
    }

    setTasks(tasks){
        this.tasks = tasks;
    }
    
    addTask(newTask) {
        this.tasks.push(newTask)
    }

    removeTask(oldTask) {
        let itemToRemove = oldTask;
        let indexToRemove = this.tasks.indexOf(itemToRemove);
        if (indexToRemove !== -1) {
            this.tasks.splice(indexToRemove, 1);
            }
    }

    getId() {
        return this.id;
    }

}

module.exports = User;