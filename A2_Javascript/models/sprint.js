/**
 * Represent Event
 * @class
 */
class Sprint {

    constructor(name,status, start_date, end_date) {

        this.id = this.generateId();
        this.name = name;
        this.columns = [];
        this.start_date = start_date;
        this.end_date = end_date; 
        this.status = status;
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
        return `SPRINT-${randomNumber}${randomNumber1}${randomNumber2}${randomNumber3}`;
    }
    

    getId() {
        return this.id;
    }

    setid(ID) {
        this.id = ID;
    }

    setCol(col){
        this.columns = col;
    }

    setStartDate(startdate){
        this.start_date = startdate
    }

    setEndDate(endDate){
        this.end_date = endDate
    }

    calculateDuration(){
        return (this.end_date - this.start_date);
    }

    calculateTotaltime(){
        var totalTime = 0;
        for (let i = 0; i < this.columns.length; i++) {
            for (let j = 0; j < this.columns[i].tasks.length; j++) {
                totalTime += this.columns[i].tasks[j].time;
            }
        }

        return totalTime;
    }

}

module.exports = Sprint;