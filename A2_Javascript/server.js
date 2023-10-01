let ejs = require("ejs");
let db;
let collection;

const express = require("express");
let path = require("path");
const app = express();
app.listen(8080);
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use(express.urlencoded({ extended: true }));

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://jtan0365:jtan0365@cluster0.my7ao9m.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");  

    db = client.db("database1");
    usersCollection = db.collection("users");
    sprintsCollection = db.collection("sprints");


    var columns = [];
    let users = [];
    let admins = [];
    let sprints = [];

    // Require your Column class here
    const Column = require('./models/column'); 
    // Require your Task class here
    const Task = require('./models/task'); // Adjust the path as needed
    const Sprint = require('./models/sprint'); // Adjust the path as needed
    const { privateEncrypt } = require("crypto");

    const User = require('./models/user'); // Adjust the path as needed

    var todo = new Column("To-do")
    var inprog = new Column("In-Progress")
    var completed = new Column("Completed")
    columns.push(todo);
    columns.push(inprog);
    columns.push(completed);

    var t1 = new Task('eqwe',
    0,
    'FRONTEND',
    'IMPORTANT',
    'qwe',
    '0',
    'PLANNING',
    false)

    var t2 = new Task('eqwe',
    0,
    'UI',
    'LOW',
    'qwe',
    '0',
    'PLANNING',
    false)

    t1.addTime(5);
    t2.addTime(2);
    t2.addTime(2);

    todo.tasks.push(t1)
    todo.tasks.push(t2)

    var s1 = new Sprint("Sprint 1", "NOT_STARTED", "2023-06-24", "2023-07-03")
    s1.columns = columns
    // sprints.push(s1)
    // once s1 exist in the database, no need to run below line of code
    // sprintsCollection.insertOne(s1);

    var u1 = new User("Aaron", "aaro22@user.slay.com", "123")
    var u2 = new User("Aavon", "avon43@user.slay.com", "123")
    var u3 = new User("Alex", "alex65@user.slay.com", "123")
    var u4 = new User("Banana", "bnan72@user.slay.com", "123")
    var u5 = new User("Bonia", "bona85@user.slay.com", "123")
    var u6 = new User("Kuna", "kuna64@user.slay.com", "123")
    var u7 = new User("Pony", "pony11@user.slay.com", "123")
    var u8 = new User("Amy", "ammy94@user.slay.com", "123")
    var u9 = new User("Lori", "lori22@user.slay.com", "123")
    users.push(u1);
    users.push(u2);
    users.push(u3);
    users.push(u4);
    users.push(u5);
    users.push(u6);

    users.push(u7);
    users.push(u8);
    users.push(u9);

    users.sort((a, b) => a.name.localeCompare(b.name));

    // once these data exist in the database, no need to run below line of code
    // usersCollection.insertMany(users);

    sprints = await sprintsCollection.find({}).toArray(); // Update the sprints array
    users = await usersCollection.find({}).toArray(); // Update the users array
    
    // Create an array to store tasks
    app.get("/", function (req, res) {
      res.redirect("/login_page");
      });

    app.post("/login_page", function(req, res) {
        res.redirect("/dashboard");
    });



    // Other Express setup code

    // Handle POST request to create a new task
    app.post("/create_task", async function(req, res) {
        // console.log(req.body)
        // Extract data from the form
        const taskName = req.body.taskName;
        const taskDescription = req.body.taskDescription;
        const taskPriority = req.body.taskPriority;
        const taskComplexity = parseInt(req.body.taskComplexity);
        const taskTag = req.body.taskTag;
        const taskStatus = req.body.taskStatus;
        const taskStage = req.body.taskStage;
        const isUrgent = JSON.parse(req.body.isUrgent);
        const taskAssignees = req.body.taskAssignees;
        const sprintIndex = req.body.sprintIndex;
        console.log(taskName, taskComplexity, taskTag, taskPriority, taskDescription, taskStatus, taskStage, isUrgent,taskAssignees)

        // Create a new task object using your Task class
        const newTask = new Task(taskName, taskComplexity, taskTag, taskPriority, taskDescription, taskStatus, taskStage, isUrgent);

        var stringArray = taskAssignees.split(',');
        var numberArray = stringArray.map(function(item) {
          return parseFloat(item);
        });

        for (var i = 0; i < numberArray.length; i++) {
          newTask.addAssignees(users[numberArray[i]])
          temp_user = users[numberArray[i]];
          temp_user.addTask(newTask);
          user_id = temp_user.ID;
          await usersCollection.updateOne({ ID: user_id }, { $set: temp_user })
          // console.log(users[numberArray[i]])
        }
        
        temp_sprint = sprints[sprintIndex];
        temp_sprint.columns[parseInt(taskStatus)].tasks.push(newTask);
        sprintsCollection.updateOne( { ID: temp_sprint.ID }, { $set: temp_sprint })
        res.status(200).json({ success: true });
    });

    // Handle POST request to edit task
    app.post("/edit_task", async function(req, res) {
      // console.log(req.body)
      const taskName = req.body.taskName;
      const taskDescription = req.body.taskDescription;
      const taskPriority = req.body.taskPriority;
      const taskComplexity = parseInt(req.body.taskComplexity);
      const taskTag = req.body.taskTag;
      const taskStatus = req.body.taskStatus;
      const taskStage = req.body.taskStage;
      const isUrgent = JSON.parse(req.body.isUrgent);
      const taskAssignees = req.body.taskAssignees;
      const index1 = req.body.columnIndex;
      const index2 = req.body.taskIndex;
      const sprintIndex = req.body.sprintIndex;
      console.log("-------")
      
      let task = sprints[sprintIndex].columns[Number(index1)].tasks[Number(index2)];
      
      console.log("BEFORE EDITING");
      console.log(task);
      task.name = taskName;
      task.complexity = taskComplexity;
      task.tag = taskTag ;
      task.priority = taskPriority;
      task.assignees = [];
      task.description = taskDescription;
      task.urgent = isUrgent;
      task.status = taskStatus;
      task.stage = taskStage;

      var stringArray = taskAssignees.split(',');

      console.log(taskAssignees);
        var numberArray = stringArray.map(function(item) {
          return parseFloat(item);
        });

        console.log(numberArray);

        for (var i = 0; i < numberArray.length; i++) {
          task.addAssignees(users[numberArray[i]])
          temp_user = users[numberArray[i]];
          temp_user.addTask(task);
          user_id = temp_user.ID;
          await usersCollection.updateOne({ ID: user_id }, { $set: temp_user })
          // console.log(users[numberArray[i]])
        }
        temp_sprint = sprints[sprintIndex];
        temp_sprint.columns[Number(index1)].removeTasks(task);
        sprintsCollection.updateOne( { ID: temp_sprint.ID }, {  $pull: {
          // Define the field you want to remove the task from
          // Assuming it's 'columns.<index>.tasks', where <index> is the index of the column
          [`columns.${Number(index1)}.tasks`]: task
      } })
        temp_sprint2 = sprints[sprintIndex];
        temp_sprint2.columns[parseInt(taskStatus)].tasks.push(task);
        sprintsCollection.updateOne( { ID: temp_sprint2.ID }, { $set: temp_sprint2 })
      console.log("-------------------");
      console.log("AFTER EDITING");
      console.log(task);


      res.status(200).json({ success: true });
    });

    // Add a separate route for handling the redirect
    // app.post("/edit_task/redirect", function (req, res) {
    //   // Redirect to the main page
    //   res.redirect("/main_page");
    // });

    app.post("/delete_task",async function(req, res) {
      // console.log(req.body)
      // Extract data from the form
      const columnIndex = req.body.columnIndex;
      const taskIndex = req.body.taskIndex
      const sprintIndex = req.body.sprintIndex
      var intIndex = parseInt(taskIndex,10)

      var deletedTask = sprints[sprintIndex].columns[parseInt(columnIndex)].tasks.splice(parseInt(taskIndex),1)[0]
      // Step 2: Identify the corresponding sprint document
      const sprintId = sprints[sprintIndex].ID; // Assuming you have an '_id' property for sprints

      // Step 3: Update the MongoDB collection to remove the task
      const deleteTaskQuery = { ID: sprintId };
      const deleteTaskUpdate = {
        $pull: {
          // Define the path to the tasks array you want to remove from
          // Assuming it's 'columns.<index>.tasks', where <index> is the index of the column
          [`columns.${parseInt(columnIndex)}.tasks`]: deletedTask
        }
      };

      // Update the sprint document in the MongoDB collection
      await sprintsCollection.updateOne(deleteTaskQuery, deleteTaskUpdate);

      var deletedTaskAssignees = deletedTask.assignees

      for (var i = 0; i < deletedTaskAssignees.length; i++) {
        var assigneeIndex = users.indexOf(deletedTaskAssignees[i]);
        var deletetaskIndex = users[assigneeIndex].tasks.indexOf(deletedTask)
        users[assigneeIndex].tasks.splice(deletetaskIndex,1)
        var assignee = deletedTaskAssignees[i];
      
        // Find the user document in the usersCollection
        const userQuery = { /* Define the query to find the user based on a unique identifier */ };
        const userUpdate = {
          $pull: {
            tasks: deletedTask // Remove the deletedTask from the user's tasks array
          }
        };
      
        // Update the user document in the usersCollection
        await usersCollection.updateOne(userQuery, userUpdate);
      }
      res.json({ success: true });
    });

    app.post("/move_task",async function(req, res) {
      const target = req.body.target;
      const prev = req.body.prev;
      const index = req.body.itemindex;
      const targetColumnIndex = req.body.targetColumnIndex;
      const prevColumnIndex = req.body.prevColumnIndex;
      const sprintIndex = req.body.sprintIndex;
      console.log(target)
      console.log(prev)
      console.log(index)
      console.log(targetColumnIndex)
      console.log(prevColumnIndex)

      console.log("ebfore")
      console.log(columns)
      console.log(columns[parseInt(prevColumnIndex)].tasks)

      var task = sprints[sprintIndex].columns[parseInt(prevColumnIndex)].tasks.splice(parseInt(index),1)[0]
      // Find the sprint document in the sprintsCollection based on a unique identifier
      const sprintQuery = { ID: sprints[sprintIndex].ID };

      // Define the update to remove the task from the specified column within the sprint
      const sprintUpdate = {
        $pull: {
          [`columns.${prevColumnIndex}.tasks`]: task // Remove the task from the specified column's tasks array
        }
      };

      // Update the sprint document in the sprintsCollection
      await sprintsCollection.updateOne(sprintQuery, sprintUpdate);

      console.log("status before")
      task.status = targetColumnIndex

      temp_sprint = sprints[sprintIndex]
      temp_sprint.columns[parseInt(targetColumnIndex)].tasks.push(task)
      // Find the sprint document in the sprintsCollection based on a unique identifier
      const sprintQuery1 = { ID: temp_sprint.ID };

      // Define the update to push the task into the specified column's tasks array within the sprint
      const sprintUpdate1 = {
        $push: {
          [`columns.${targetColumnIndex}.tasks`]: task // Push the task into the specified column's tasks array
        }
      };

      // Update the sprint document in the sprintsCollection
      await sprintsCollection.updateOne(sprintQuery1, sprintUpdate1);
      console.log("done")

      res.json({ success: true });

    });

    app.get("/main_page", function(req, res) {
      // Render the main_page.html or any other page you want to show
      //res.render("main_page");
      //res.sendFile(path.join(__dirname, "/views/main_page.html"));
      const sprintIndex = req.query.sprintIndex;
      res.render("main_page", {columns:sprints[sprintIndex].columns, sprintIndex: sprintIndex, sprintName: sprints[sprintIndex].name});
    });

    app.get("/filter", function(req, res) {
      const sprintIndex = req.query.sprintIndex;
      res.render("filter", {columns:sprints[sprintIndex], users:users, sprintIndex:sprintIndex});
    });


    app.get("/manage_user", function(req, res) {
      res.render("manage_user", {users:users});
    });
    // Add a new route to display the create_task.html page
    app.get("/create_task", function(req, res) {
      console.log("WTFFFFFFFFFFFFFFFFFFFFFFFFFFFFf");
      const sprintIndex = req.query.sprintIndex;
      res.render("create_task", {columns:sprints[sprintIndex].columns, users:users, sprintIndex:sprintIndex});
    });

    // Add a new route to display the edit_task.html page
    app.get("/edit_task_page", function(req, res) {
      //res.sendFile(path.join(__dirname, "/views/edit_task.html"));

      // Get the values of the parameters
      let sprintIndex = req.query.sprintIndex;
      let columnIndex = req.query.param1;
      let taskIndex = req.query.param2;
      const task = sprints[sprintIndex].columns[Number(columnIndex)].tasks[Number(taskIndex)]
      const ID = task.id
      const name = task.name
      const complexity = task.complexity
      const tag = task.tag
      const priority = task.priority
      const assignees = task.assignees
      const description = task.description
      const urgent = task.urgent
      const status = task.status
      const stage = task.stage
      res.render("edit_task",{task:[ID,name,complexity,tag,priority,assignees,description,urgent,status,stage,Number(columnIndex),Number(taskIndex)], columns:sprints[sprintIndex].columns, users:users});
      // const columnIndex = req.query.param1;
      // const taskIndex = req.query.param2;
      // const sprintIndex = req.query.sprintIndex;
      // console.log(columnIndex)
      // console.log(taskIndex)

      // var task = sprints[sprintIndex].columns[parseInt(columnIndex)].tasks[parseInt(taskIndex)]
      // console.log(task)
      // res.render("edit_task", {task:task, columns:sprints[sprintIndex], users: users, sprintIndex:sprintIndex});
    });

    // Add a new route to display the delete_task.html page
    app.get("/delete_task_page", function(req, res) {
      res.sendFile(path.join(__dirname, "/views/delete_task.html"));
    });

    // Add a new route to display the login_page.html page
    app.get("/login_page", function(req, res) {
      res.sendFile(path.join(__dirname, "/views/login_page.html"));
    });

    app.get("/dashboard", function(req, res) {
      res.render("dashboard", {sprints:sprints});
    });


    // Handle POST request to create a new task
    app.post("/create_column",async function(req, res) {
      console.log(req.body)
      // Extract data from the form
      const columnName = req.body.columnName;
      const sprintIndex = req.body.sprintIndex;
      console.log(columnName);
      console.log(sprintIndex);
      

      // Create a new task object using your Task class
      const newColumn = new Column(columnName);
      temp_sprint = sprints[sprintIndex];
      temp_sprint.columns.push(newColumn);
      const sprintQuery = { ID:  temp_sprint.ID };

      // Define the update to push the new column into the sprint's columns array
      const sprintUpdate = {
        $push: {
          columns: newColumn // Push the new column into the sprint's columns array
        }
      };

      // Update the sprint document in the sprintsCollection
      await sprintsCollection.updateOne(sprintQuery, sprintUpdate);
      
      res.status(200).json({ success: true });
    });

    app.post("/edit_column",async function(req, res) {
      console.log(req.body)
      // Extract data from the form
      const columnName = req.body.columnName;
      const columnIndex = req.body.columnIndex;
      const sprintIndex = req.body.sprintIndex;
      console.log(columnName);
      console.log(columnIndex);
      console.log(sprintIndex);

      temp_sprint = sprints[sprintIndex];
      temp_sprint.columns[columnIndex].name = columnName;
      
      // Find the sprint document in the sprintsCollection based on a unique identifier
      const sprintQuery = { ID : temp_sprint.ID};

      // Define the updated column object with the new name
      const updatedColumn = { name: columnName };

      // Define the update to set the updated column in the sprint's columns array
      const sprintUpdate = {
        $set: {
          [`columns.${columnIndex}`]: updatedColumn // Set the updated column in the sprint's columns array
        }
      };

      // Update the sprint document in the sprintsCollection
      await sprintsCollection.updateOne(sprintQuery, sprintUpdate);

      res.status(200).json({ success: true });
    });

    app.post("/delete_column",async function(req, res) {
      console.log(req.body)
      // Extract data from the form
      const columnIndex = req.body.columnIndex;
      const sprintIndex = req.body.sprintIndex;
      console.log(columnIndex);

      temp_sprint = sprints[sprintIndex]
      temp_sprint.columns.splice(parseInt(columnIndex),1);
      // Find the sprint document in the sprintsCollection based on a unique identifier
      const sprintQuery = { ID :  temp_sprint.ID };

      // Define the update to exclude the removed column from the sprint's columns array
      const sprintUpdate = {
        $pull: {
          columns: { /* Define the criteria to identify the column you want to remove */ }
        }
      };

      // Update the sprint document in the sprintsCollection
      await sprintsCollection.updateOne(sprintQuery, sprintUpdate);
      console.log(columns)

        
      res.status(200).json({ success: true });
      
    });

    app.post("/move_column", async function(req, res) {
      console.log(req.body)
      // Extract data from the form
      const sourceIndex = req.body.source;
      const targetIndex = req.body.target;
      const sprintIndex = req.body.sprintIndex;
      console.log(sourceIndex);
      console.log(targetIndex);

      temp_sprint = sprints[sprintIndex];
      const columnToMove = temp_sprint.columns.splice(sourceIndex, 1)[0];
      temp_sprint.columns.splice(targetIndex, 0, columnToMove);

      // Find the sprint document in the sprintsCollection based on a unique identifier
      const sprintQuery = { ID : temp_sprint.ID };

      // Get the current columns array from the sprint
      const sprint = sprintsCollection.findOne(sprintQuery);
      const currentColumns = sprint.columns;

      // Define the update to set the new columns array in the sprint
      const sprintUpdate = {
        $set: { columns: currentColumns }
      };

      // Update the sprint document in the sprintsCollection
      await sprintsCollection.updateOne(sprintQuery, sprintUpdate);
      res.status(200).json({ success: true });
      
    });

    app.get("/edit_user_page", function(req, res) {
      //res.sendFile(path.join(__dirname, "/views/edit_task.html"));

      // Get the values of the parameters
      const userIndex = req.query.param1;

      var user = users[parseInt(userIndex)]
      res.render("edit_user", {user:user});
    });

    app.post("/edit_user",async function(req, res) {
      console.log(req.body)
      // Extract data from the form
      const userName = req.body.userName;
      const userUsername = req.body.userUsername;
      const userPassword = req.body.userPassword;
      const userId = req.body.userId;
      console.log(userName)
      console.log(userUsername)
      console.log(userPassword)
      console.log(userId)

      const targetUser = users.find((user) => user.id === userId);
      const userUpdates = {};
      if (targetUser.name !== userName){
        targetUser.name = userName;
        userUpdates.name = userName;
      }
      if (targetUser.username !== userUsername){
        targetUser.username = userUsername;
        userUpdates.username = userUsername;
      }
      if (userPassword.length > 0 && userPasswordtargetUser.password !== userPassword){
        targetUser.password = userPassword;
        userUpdates.password = userPassword;
        console.log("pw changed")
      }

      // Find the user document in the usersCollection based on a unique identifier
      const userQuery = { ID: targetUser.ID };

      // Check if there are updates to apply
      if (Object.keys(userUpdates).length > 0) {
        // Update the user document in the usersCollection
        await usersCollection.updateOne(userQuery, { $set: userUpdates });
      }

      users.sort((a, b) => a.name.localeCompare(b.name));
      
      res.json({ success: true });
      
    });


    app.post("/delete_user",async function(req, res) {
      console.log(req.body)
      // Extract data from the form
      const userIndex = req.body.userIndex;

      var deletedUser = users.splice(parseInt(userIndex),1)[0]

      await usersCollection.deleteOne({ ID: deletedUser.ID })

      for (var i = 0; i < deletedUser.tasks.length; i++) {
        indexOfUserInTask = deletedUser.tasks[i].assignees.indexOf(deletedUser)
        deletedUser.tasks[i].assignees.splice(indexOfUserInTask,1)

        console.log(deletedUser.tasks[i].assignees)
      
      }
      await sprintsCollection.updateMany(
        { "columns.tasks.assignees": deletedUser.ID }, // Match tasks where the user is in the assignees array
        { $pull: { "columns.tasks.$.assignees": deletedUser.ID } } // Remove the user from the assignees array
      )


      res.json({ success: true });
    });

    app.post("/add_user", async function(req, res) {
      console.log(req.body)
      // Extract data from the form
      const userName = req.body.userName;
      const userUsername = req.body.userUsername;
      const userPassword = req.body.userPassword;
      console.log(userName)
      console.log(userUsername)
      console.log(userPassword)

      const usernameExists = await usersCollection.findOne({ username: userUsername });
      if (usernameExists){
        res.status(400).json({ success: false });
      }
      else{
        newUser = new User(userName, userUsername, userPassword);

        users.push(newUser)
        users.sort((a, b) => a.name.localeCompare(b.name));
        await usersCollection.insertOne(newUser);
        res.status(200).json({ success: true });
      }
      
    });

    app.get("/add_user", function(req, res) {
      //res.sendFile(path.join(__dirname, "/views/edit_task.html"));
      res.render("add_user");
    });

    app.post("/delete_sprint",async function(req, res) {
      console.log(req.body)
      const sprintIndex = req.body.sprintIndex;
      console.log(sprintIndex);
      
      sprints.splice(parseInt(sprintIndex),1)
      temp_sprint = sprints[parseInt(sprintIndex)]
      await sprintsCollection.deleteOne({ ID: temp_sprint.ID });
      res.status(200).json({ success: true });
    });

    app.get("/create_sprint", function(req, res) {
      //res.sendFile(path.join(__dirname, "/views/edit_task.html"));
      res.render("create_sprint");
    });

    app.post("/create_sprint", function(req, res) {
      const sprintName = req.body.sprintName;
      const sprintStatus = req.body.sprintStatus;
      const sprintStartDate = req.body.sprintStartDate;
      const sprintEndDate = req.body.sprintEndDate;
      console.log(sprintName,sprintStatus,sprintStartDate,sprintEndDate);

      const newSprint = new Sprint(sprintName, sprintStatus, sprintStartDate, sprintEndDate);
      sprints.push(newSprint);
      sprintsCollection.insertOne(newSprint);
      
      res.status(200).json({ success: true });
    });


    app.get("/edit_sprint", function(req, res) {
      const sprintIndex = req.query.sprintIndex;
      console.log("Here")
      console.log(sprintIndex)
      console.log(sprints[sprintIndex]);
      res.render("edit_sprint", {sprint:sprints[sprintIndex]});
    });

    app.post("/edit_sprint",async function(req, res) {
      const sprintName = req.body.sprintName;
      const sprintStatus = req.body.sprintStatus;
      const sprintStartDate = req.body.sprintStartDate;
      const sprintEndDate = req.body.sprintEndDate;
      const sprintIndex = req.body.sprintIndex;
      console.log(sprintName,sprintStatus,sprintStartDate,sprintEndDate, sprintIndex);

      var sprint = sprints[parseInt(sprintIndex)];
      sprint.name = sprintName;
      sprint.status = sprintStatus;
      sprint.start_date = sprintStartDate;
      sprint.end_date = sprintEndDate;

      // Assuming each sprint document has a unique identifier like '_id'
      const sprintId = sprints[sprintIndex].ID; // Replace with the actual field name

      // Create an update object with the new values
      const updateObject = {
        $set: {
          name: sprintName,
          status: sprintStatus,
          start_date: sprintStartDate,
          end_date: sprintEndDate
        }
      };

      // Update the sprint document in the MongoDB collection
      const result = await sprintsCollection.updateOne({ ID: sprintId }, updateObject);

      res.status(200).json({ success: true });
    });
  } finally{
    // await client.close();
  }
}

run().catch(console.dir);