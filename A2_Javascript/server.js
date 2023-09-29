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
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);


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
sprints.push(s1)

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


// Create an array to store tasks
app.get("/", function (req, res) {
  res.redirect("/login_page");
  });

app.post("/login_page", function(req, res) {
    res.redirect("/dashboard");
});



// Other Express setup code

// Handle POST request to create a new task
app.post("/create_task", function(req, res) {
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
      users[numberArray[i]].addTask(newTask)
      // console.log(users[numberArray[i]])
    }

    sprints[sprintIndex].columns[parseInt(taskStatus)].tasks.push(newTask);

    res.status(200).json({ success: true });
});

// Handle POST request to edit task
app.post("/edit_task", function(req, res) {
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
  console.log("-------")
  
  let task = columns[Number(index1)].tasks[Number(index2)];
  
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
    var numberArray = stringArray.map(function(item) {
      return parseFloat(item);
    });

    for (var i = 0; i < numberArray.length; i++) {
      task.addAssignees(users[numberArray[i]])
      users[numberArray[i]].addTask(task)
      // console.log(users[numberArray[i]])
    }
    columns[Number(index1)].removeTasks(task);
    columns[parseInt(taskStatus)].tasks.push(task);
  console.log("-------------------");
  console.log("AFTER EDITING");
  console.log(task);

  res.redirect("/main_page");
});

// Add a separate route for handling the redirect
// app.post("/edit_task/redirect", function (req, res) {
//   // Redirect to the main page
//   res.redirect("/main_page");
// });

app.post("/delete_task", function(req, res) {
  // console.log(req.body)
  // Extract data from the form
  const columnIndex = req.body.columnIndex;
  const taskIndex = req.body.taskIndex
  const sprintIndex = req.body.sprintIndex
  var intIndex = parseInt(taskIndex,10)

  var deletedTask = sprints[sprintIndex].columns[parseInt(columnIndex)].tasks.splice(parseInt(taskIndex),1)[0]

  var deletedTaskAssignees = deletedTask.assignees

  for (var i = 0; i < deletedTaskAssignees.length; i++) {
    var assigneeIndex = users.indexOf(deletedTaskAssignees[i]);
    var deletetaskIndex = users[assigneeIndex].tasks.indexOf(deletedTask)
    users[assigneeIndex].tasks.splice(deletetaskIndex,1)

  }

  
  res.json({ success: true });
});

app.post("/move_task", function(req, res) {
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

  console.log("status before")
  task.status = targetColumnIndex

  sprints[sprintIndex].columns[parseInt(targetColumnIndex)].tasks.push(task)
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
  let columnIndex = req.query.param1;
  let taskIndex = req.query.param2;
  const task = columns[Number(columnIndex)].tasks[Number(taskIndex)]
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
  res.render("edit_task",{task:[ID,name,complexity,tag,priority,assignees,description,urgent,status,stage,Number(columnIndex),Number(taskIndex)], columns:columns, users:users});
  const columnIndex = req.query.param1;
  const taskIndex = req.query.param2;
  const sprintIndex = req.query.sprintIndex;
  console.log(columnIndex)
  console.log(taskIndex)

  var task = sprints[sprintIndex].columns[parseInt(columnIndex)].tasks[parseInt(taskIndex)]
  console.log(task)
  res.render("edit_task", {task:task, columns:sprints[sprintIndex], users: users, sprintIndex:sprintIndex});
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
app.post("/create_column", function(req, res) {
  console.log(req.body)
  // Extract data from the form
  const columnName = req.body.columnName;
  const sprintIndex = req.body.sprintIndex;
  console.log(columnName);
  console.log(sprintIndex);
  

  // Create a new task object using your Task class
  const newColumn = new Column(columnName);
  sprints[sprintIndex].columns.push(newColumn);
  
  res.status(200).json({ success: true });
});

app.post("/edit_column", function(req, res) {
  console.log(req.body)
  // Extract data from the form
  const columnName = req.body.columnName;
  const columnIndex = req.body.columnIndex;
  const sprintIndex = req.body.sprintIndex;
  console.log(columnName);
  console.log(columnIndex);
  console.log(sprintIndex);

  sprints[sprintIndex].columns[columnIndex].name = columnName

  res.status(200).json({ success: true });
});

app.post("/delete_column", function(req, res) {
  console.log(req.body)
  // Extract data from the form
  const columnIndex = req.body.columnIndex;
  const sprintIndex = req.body.sprintIndex;
  console.log(columnIndex);

  sprints[sprintIndex].columns.splice(parseInt(columnIndex),1)
  console.log(columns)

    
  res.status(200).json({ success: true });
  
});

app.post("/move_column", function(req, res) {
  console.log(req.body)
  // Extract data from the form
  const sourceIndex = req.body.source;
  const targetIndex = req.body.target;
  const sprintIndex = req.body.sprintIndex;
  console.log(sourceIndex);
  console.log(targetIndex);


  const columnToMove = sprints[sprintIndex].columns.splice(sourceIndex, 1)[0];
  sprints[sprintIndex].columns.splice(targetIndex, 0, columnToMove);

  res.status(200).json({ success: true });
  
});

app.get("/edit_user_page", function(req, res) {
  //res.sendFile(path.join(__dirname, "/views/edit_task.html"));

  // Get the values of the parameters
  const userIndex = req.query.param1;

  var user = users[parseInt(userIndex)]
  res.render("edit_user", {user:user});
});

app.post("/edit_user", function(req, res) {
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

  if (targetUser.name !== userName){
    targetUser.name = userName
  }
  if (targetUser.username !== userUsername){
    targetUser.username = userUsername
  }
  if (userPassword.length > 0 && userPasswordtargetUser.password !== userPassword){
    targetUser.password = userPassword
    console.log("pw changed")
  }

  users.sort((a, b) => a.name.localeCompare(b.name));
  
  res.json({ success: true });
  
});


app.post("/delete_user", function(req, res) {
  console.log(req.body)
  // Extract data from the form
  const userIndex = req.body.userIndex;

  var deletedUser = users.splice(parseInt(userIndex),1)[0]

  for (var i = 0; i < deletedUser.tasks.length; i++) {
    indexOfUserInTask = deletedUser.tasks[i].assignees.indexOf(deletedUser)
    deletedUser.tasks[i].assignees.splice(indexOfUserInTask,1)

    console.log(deletedUser.tasks[i].assignees)

  }

  
  res.json({ success: true });
});

app.post("/add_user", function(req, res) {
  console.log(req.body)
  // Extract data from the form
  const userName = req.body.userName;
  const userUsername = req.body.userUsername;
  const userPassword = req.body.userPassword;
  console.log(userName)
  console.log(userUsername)
  console.log(userPassword)

  const usernameExists = users.some(user => user.username === userUsername);
  if (usernameExists){
    res.status(400).json({ success: false });
  }
  else{
    newUser = new User(userName, userUsername, userPassword);

    users.push(newUser)
    users.sort((a, b) => a.name.localeCompare(b.name));
    
    res.status(200).json({ success: true });
  }
  
});

app.get("/add_user", function(req, res) {
  //res.sendFile(path.join(__dirname, "/views/edit_task.html"));
  res.render("add_user");
});

app.post("/delete_sprint", function(req, res) {
  console.log(req.body)
  const sprintIndex = req.body.sprintIndex;
  console.log(sprintIndex);

  sprints.splice(parseInt(sprintIndex),1)

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
  
  res.status(200).json({ success: true });
});


app.get("/edit_sprint", function(req, res) {
  const sprintIndex = req.query.sprintIndex;
  console.log("Here")
  console.log(sprintIndex)
  console.log(sprints[sprintIndex]);
  res.render("edit_sprint", {sprint:sprints[sprintIndex]});
});

app.post("/edit_sprint", function(req, res) {
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
  
  res.status(200).json({ success: true });
});


