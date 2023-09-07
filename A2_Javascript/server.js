let express = require("express");
let ejs = require("ejs");

//const mongodb = require("mongodb");
let path = require("path");

let app = express();
const PORT_NUMBER = 8080;

app.listen(PORT_NUMBER, () => {
    console.log(`Listening on port ${PORT_NUMBER}`);
  });
  
app.use(express.urlencoded({ extended: true }));

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

//Configure MongoDB
//const MongoClient = mongodb.MongoClient;
// Connection URL
//const url = "mongodb://localhost:27017/";

let db;
//Connect to mongoDB server
// MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
//   if (err) {
//     console.log("Err  ", err);
//   } else {
//     console.log("Connected successfully to server");
//     db = client.db("fit2095parcels");
//   }
// });

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/views/main_page.html"));
  });

app.post("/login_page", function(req, res) {
    console.log("ok")
    res.render("main_page");
});