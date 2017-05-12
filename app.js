var express = require("express");
var http = require("http");
var GoogleImages = require("google-images");
var app = express();
var client = new GoogleImages("010943239557185514526:0hr49zbv1n4", "AIzaSyBO80Sy-frIgp3hbqddbm2NZoRGzKkXRp4");
//var path = require("path");
var nodemon = require("nodemon");
var db = require("./db");
var bodyParser = require("body-parser");
var path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({
  extended:false}));
  app.use(bodyParser.json());
  app.get("/api", function(req, res) {

  res.end("index.html");
});

app.get("/api/latest/imagesearch/", function(req, res) {
  db.getConnection(function(err, connection) {
    var columns = ["term", "when"];
    connection.query("SELECT ?? FROM ?? ORDER BY ? DESC LIMIT 10", [columns, "history", "id"],function (err, results){
      res.json(results);
      connection.release();
      if (err) throw err;
    });
  });
});

app.get("/api/imagesearch/:id", function(req, res) {
  var id = req.params.id;
  var arr = [];
  var time = new Date();
  var off = req.query.offset;
  var data = {term: id, when: time};

  client.search(id, {page:off}).then(function (images) {
    db.getConnection(function(err, connection) {
      connection.query("INSERT INTO history SET ?", data, function (err, results) {
        connection.release();
        if (err) throw err;
      });
    });

    for (var i=0;i<images.length;i++){

      arr.push({
        url: images[i].url,
        snippet: images[i].description,
        thumbnail: images[i].thumbnail.url,
        context: images[i].parentPage
      });
    }
    res.json(arr);
  });
});

app.listen(5000);
console.log("Server running at http://localhost:5000/");
