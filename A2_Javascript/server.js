let todotasks = [];
let inprogresstasks = [];
let donetasks =[];
let columns = [];

// Require your Column class here
const Column = require('./models/column'); 
// Require your Task class here
const Task = require('./models/task'); // Adjust the path as needed
const { privateEncrypt } = require("crypto");


let express = require("express");
let ejs = require("ejs");

const mongodb = require("mongodb");
let path = require("path");

let app = express();
const PORT_NUMBER = 8080;

app.listen(PORT_NUMBER, () => {
    console.log(`Listening on port ${PORT_NUMBER}`);
  });
  
app.use(express.urlencoded({ extended: true }));

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");


// Configure MongoDB
const MongoClient = mongodb.MongoClient;
// Connection URL
const url = "mongodb://localhost:27017/";

let db;
// Connect to mongoDB server
// MongoClient.connect(url, function (err, client) {
//   if (err) {
//     console.log("Err  ", err);
//   } else {
//     console.log("Connected successfully to server");
//     db = client.db("database_1");
//   }
// });

// Create an array to store tasks
app.get("/", function (req, res) {
  res.redirect("/login_page");
  });

app.post("/login_page", function(req, res) {
    res.redirect("main_page");
});





// Other Express setup code

// Handle POST request to create a new task
app.post("/create_task", function(req, res) {
    console.log(req.body)
    // Extract data from the form
    const taskName = req.body.taskName;
    const taskDescription = req.body.taskDescription;
    const taskPriority = req.body.taskPriority;
    const taskComplexity = req.body.taskComplexity;
    const taskTag = req.body.taskTag;
    const taskStatus = req.body.taskStatus;
    const taskStage = req.body.taskStage;
    console.log(taskName, taskComplexity, taskTag, taskPriority, taskDescription, taskStatus, taskStage)

    // Create a new task object using your Task class
    const newTask = new Task(taskName, taskComplexity, taskTag, taskPriority, taskDescription, taskStatus, taskStage);

    // You should implement a function in your Task class to save this new task to your data store.
    // For example, you could save it to a database or an array in memory.

    // Insert newTask into the database (assuming you have a MongoDB collection called 'tasks')
    // db.collection('database_1').insertOne(newTask, function(err, result) {
    //   if (err) {
    //       console.log("Error inserting task into MongoDB:", err);
    //   } else {
    //       console.log("Task inserted successfully:", result.insertedId);
    //   }
    // });

    // Add the new task to the tasks array
    // if (taskStatus == 'TO_DO'){
    //   todotasks.push(newTask);
    // }
    // else if (taskStatus == 'IN_PROGRESS'){
    //   inprogresstasks.push(newTask);
    // }
    // else{
    //   donetasks.push(newTask);
    //}

    columns[parseInt(taskStatus)].tasks.push(newTask);
    console.log("here")
    console.log(columns[parseInt(taskStatus)].tasks);
    
    
    res.redirect("/main_page");
});

// Handle POST request to edit task
app.post("/edit_task", function(req, res) {
  console.log(req.body)
  // Extract data from the form
  const taskIndex = req.body.Index;
  const taskStage = req.body.Stage
  var intIndex = parseInt(taskIndex,10)
  console.log(intIndex)
  console.log(taskStage)
  console.log(todotasks[taskIndex])
  let responseData;

  if (taskStage == "TO_DO") {
    console.log("Passing in")
    console.log(todotasks[taskIndex])

    res.render("edit_task",{task: todotasks[taskIndex], index: taskIndex, list: todotasks }); 
  } else if (taskStage == "IN_PROGRESS") {
    responseData = { task: inprogresstasks[taskIndex], index: taskIndex, list: inprogresstasks };
  } else {
    responseData = { task: donetasks[taskIndex], index: taskIndex, list: donetasks };
  }

  // Send the JSON response if requested via AJAX

  //   Render the edit_task template
  //res.render("edit_task", responseData);
});

// Add a separate route for handling the redirect
app.post("/edit_task/redirect", function (req, res) {
  // Redirect to the main page
  res.redirect("/main_page");
});

app.post("/delete_task", function(req, res) {
  console.log(req.body)
  // Extract data from the form
  const columnIndex = req.body.columnIndex;
  const taskIndex = req.body.taskIndex
  var intIndex = parseInt(taskIndex,10)

  columns[parseInt(columnIndex)].tasks.splice(parseInt(taskIndex),1)

  // Create a new task object using your Task class

  // You should implement a function in your Task class to save this new task to your data store.
  // For example, you could save it to a database or an array in memory.

  // Redirect to the main page or wherever you want to go after creating the task
  res.json({ success: true });
});

app.post("/move_task", function(req, res) {
  const target = req.body.target;
  const prev = req.body.prev;
  const index = req.body.itemindex;
  const targetColumnIndex = req.body.targetColumnIndex;
  const prevColumnIndex = req.body.prevColumnIndex;
  console.log(target)
  console.log(prev)
  console.log(index)
  console.log(targetColumnIndex)
  console.log(prevColumnIndex)

  console.log("ebfore")
  console.log(columns)
  console.log(columns[parseInt(prevColumnIndex)].tasks)

  var task = columns[parseInt(prevColumnIndex)].tasks.splice(parseInt(index),1)[0]

  console.log("status before")
  console.log(task.status)
  task.status = targetColumnIndex
  console.log("status changed")
  console.log(task.status)

  columns[parseInt(targetColumnIndex)].tasks.push(task)
  console.log("done")
  console.log(columns)
  console.log(columns[parseInt(prevColumnIndex)].tasks)

  res.json({ success: true });

});

app.get("/main_page", function(req, res) {
  // Render the main_page.html or any other page you want to show
  //res.render("main_page");
  //res.sendFile(path.join(__dirname, "/views/main_page.html"));
  res.render("main_page", { todotasks: todotasks,  inprogresstasks: inprogresstasks, donetasks:donetasks, columns:columns});
});

// Add a new route to display the create_task.html page
app.get("/create_task_page", function(req, res) {
  res.render("create_task", {columns:columns});
});

// Add a new route to display the edit_task.html page
app.get("/edit_task_page", function(req, res) {
  //res.sendFile(path.join(__dirname, "/views/edit_task.html"));

  // Get the values of the parameters
  const columnIndex = req.query.param1;
  const taskIndex = req.query.param2;
  console.log(columnIndex)
  console.log(taskIndex)

  var task = columns[parseInt(columnIndex)].tasks[parseInt(taskIndex)]
  console.log(task)
  res.render("edit_task", {task:task, columns:columns});
});

// Add a new route to display the delete_task.html page
app.get("/delete_task_page", function(req, res) {
  res.sendFile(path.join(__dirname, "/views/delete_task.html"));
});

// Add a new route to display the login_page.html page
app.get("/login_page", function(req, res) {
  res.sendFile(path.join(__dirname, "/views/login_page.html"));
});




// Handle POST request to create a new task
app.post("/create_column", function(req, res) {
  console.log(req.body)
  // Extract data from the form
  const columnName = req.body.columnName;
  console.log(columnName);

  // Create a new task object using your Task class
  const newColumn = new Column(columnName);
  columns.push(newColumn);
  console.log(columns)
  
  //res.redirect("/main_page");
});