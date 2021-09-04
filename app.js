//jshint esversion:6
// Title: Personal blog. 
// Author: Lilian Umeakunne
// Date: 20/07/2021
// Project: Personal blog built using Node and express.

// Dependencies
const express = require("express");
const mongoose = require("mongoose")
const bodyParser = require("body-parser");
const ejs = require("ejs");
const PORT = process.env.PORT || 3000;

const homeStartingContent = "Armu Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// connect to mongodb:

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

// create a new postSchema that contains a title and content:
const postSchema = {
  title: String,
  content: String
};

// create a new mongoose model using the schema to define your posts collection, before creating a new document:
const Post = mongoose.model("Post", postSchema);

// This function makes a get request to the home.ejs file in order to render the content for the home page.
// find all the posts in the posts collection and render that in the home.ejs file after I had deleted the existing posts array:
app.get("/", function(req, res){
  
  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });

});

// This function makes a get request to the compose.ejs file in order to render the content for the compose page.
app.get("/compose", function(req, res){

  res.render("compose");
});

// This function makes a post request to the /compose route, tapping into the title and the body of the post request.
app.post("/compose", function(req,res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
    });
  
    post.save(function(err){
      if (!err){
        res.redirect("/");
      }
   
    });
});

// lodash is used here to convert all inputs to string. 
// This function renders new posts on individual web page on the website when read more is clicked.
// Expressjs routing was used to achieve this.
app.get("/posts/:postId", function(req, res){
  
  const requestedPostId = req.params.postId;
  
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

// This function makes a get request to the about.ejs file in order to render the content for the about page.
app.get("/about", function(req, res){
  res.render("about", {aboutUs: aboutContent});
});

// This function makes a get request to the contact.ejs file in order to render the content for the contact us page.
app.get("/contact", function(req , res){
  res.render("contact", {contactUs: contactContent});
});


app.listen(PORT, function() {
  console.log("Server started on port 3000");
});