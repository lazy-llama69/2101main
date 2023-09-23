/**
 * Represent Event
 * @class
 */
class Admin {

    constructor(name, username, password) {

        this.id = this.generateId();
        this.name = name;
        this.username = username;
        this.password = password;
    }


    generateId() {
        // Random number between 0000-9999
        const randomNumber = Math.floor(Math.random() * 10);
        const randomNumber1 = Math.floor(Math.random() * 10);
        const randomNumber2 = Math.floor(Math.random() * 10);
        const randomNumber3 = Math.floor(Math.random() * 10);
        return `ADMIN-${randomNumber}${randomNumber1}${randomNumber2}${randomNumber3}`;
    }
    

    getId() {
        return this.id;
    }

}

module.exports = Admin;