let todotasks = [];
let inprogresstasks = [];
let donetasks =[];

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

// Require your Task class here
const Task = require('./models/task'); // Adjust the path as needed
const { privateEncrypt } = require("crypto");

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
    if (taskStatus == 'TO_DO'){
      todotasks.push(newTask);
    }
    else if (taskStatus == 'IN_PROGRESS'){
      inprogresstasks.push(newTask);
    }
    else{
      donetasks.push(newTask);
    }
    
    
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
  res.render("edit_task", responseData);
});

// Add a separate route for handling the redirect
app.post("/edit_task/redirect", function (req, res) {
  // Redirect to the main page
  res.redirect("/main_page");
});

app.post("/delete_task", function(req, res) {
  console.log(req.body)
  // Extract data from the form
  const taskIndex = req.body.Index;
  const taskStage = req.body.Stage
  var intIndex = parseInt(taskIndex,10)
  console.log(intIndex)
  console.log(taskStage)
  if (taskStage == 'TO_DO'){
    todotasks.splice(intIndex, 1);
  }
  else if (taskStage == 'IN_PROGRESS'){
    inprogresstasks.splice(intIndex, 1);
  }
  else{
    donetasks.splice(intIndex, 1);
  }

  // Create a new task object using your Task class

  // You should implement a function in your Task class to save this new task to your data store.
  // For example, you could save it to a database or an array in memory.

  // Redirect to the main page or wherever you want to go after creating the task
  res.json({ success: true });
});

app.post("/move_task", function(req, res) {
  const target = req.body.target;
  const prev = req.body.prev;
  const index = req.body.index;
  console.log(target)
  console.log(prev)
  console.log(index)
  
  //access the task object
  if (prev == 'TO_DO'){
    var task = todotasks[index]
    todotasks.splice(index, 1);
  }
  else if (prev == 'IN_PROGRESS'){
    var task = inprogresstasks[index]
    inprogresstasks.splice(index, 1);
  }
  else{
    var task = donetasks[index]
    donetasks.splice(index, 1);
  }

  console.log(task)
  task.status = target

  if (target == 'TO_DO'){
    todotasks.push(task);
  }
  else if (target == 'IN_PROGRESS'){
    inprogresstasks.push(task);
  }
  else{
    donetasks.push(task);
  }

  res.json({ success: true });

});

app.get("/main_page", function(req, res) {
  // Render the main_page.html or any other page you want to show
  //res.render("main_page");
  //res.sendFile(path.join(__dirname, "/views/main_page.html"));
  res.render("main_page", { todotasks: todotasks,  inprogresstasks: inprogresstasks, donetasks:donetasks});
});

// Add a new route to display the create_task.html page
app.get("/create_task_page", function(req, res) {
  res.sendFile(path.join(__dirname, "/views/create_task.html"));
});

// Add a new route to display the edit_task.html page
app.get("/edit_task_page", function(req, res) {
  res.sendFile(path.join(__dirname, "/views/edit_task.html"));
});

// Add a new route to display the delete_task.html page
app.get("/delete_task_page", function(req, res) {
  res.sendFile(path.join(__dirname, "/views/delete_task.html"));
});

// Add a new route to display the login_page.html page
app.get("/login_page", function(req, res) {
  res.sendFile(path.join(__dirname, "/views/login_page.html"));
});