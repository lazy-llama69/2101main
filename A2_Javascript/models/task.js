/**
 * Represent Event
 * @class
 */
class Task {

    constructor(name, complexity, tag, priority, description, status, stage, urgent) {

        this.id = this.generateId();
        this.name = name;
        this.complexity = complexity ;
        this.tag = tag ;
        this.priority = priority;
        this.assignees = [];
        this.description = description;
        this.urgent = urgent;
        this.status = status;
        this.stage = stage
        this.time_list = [];
        this.time = 0;
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


    addAssignees(newAssignee) {
        this.assignees.push(newAssignee)
    }

    removeAssignees(oldAssignee) {
        let itemToRemove = oldAssignee;
        let indexToRemove = this.assignees.indexOf(itemToRemove);
        if (indexToRemove !== -1) {
            this.assignees.splice(indexToRemove, 1);
            }
    }


    addPriority(newPriority) {
        let priorityLength = this.priority.length
        if (priorityLength == 0){
            this.priority.push(newPriority);
        }
        else if (priorityLength == 1){
            if (this.priority[0] == "IMPORTANT" && newPriority == "URGENT"){
                this.priority.push(newPriority)
            }
            else if (this.priority[0] == "URGENT" && newPriority == "IMPORTANT"){
                this.priority.push(newPriority)
            }
        }
        
    }

    removePriority(oldPriority) {
        let itemToRemove = oldPriority;
        let indexToRemove = this.priority.indexOf(itemToRemove);
        if (indexToRemove !== -1) {
            this.priority.splice(indexToRemove, 1);
            }
    }

    addTime(newTime) {
        this.time_list.push(newTime);
        this.time += newTime;
    }
}

module.exports = Task;