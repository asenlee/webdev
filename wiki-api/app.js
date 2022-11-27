
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const e = require("express");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1/wikiDB', {useNewUrlParser: true});

const articleSchema = mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);


//// requests targeting all articles

app.route("/articles")

.get(function(req, res) {
    Article.find({}, function(err, results) {
        if (err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
})

.post(function(req, res) {
    const newTitle = req.body.title;
    const newContent = req.body.content;

    const newArticle = new Article({
        title: newTitle,
        content: newContent
    });

    newArticle.save(function(err) {
        if (err) {
            res.send(err);
        } else {
            res.send("Successfully added a new article.");
        }
    });
})

.delete(function(req, res) {
    Article.deleteMany(function(err) {
        if (err) {
            res.send(err);
        } else {
            res.send("All documents successfully deleted.");
        }
    });
});


//// requests target specific article

app.route("/articles/:articleTitle")

.get(function(req, res) {
    Article.findOne({title: req.params.articleTitle}, function(err, requestedArticle) {
        if (err) {
            res.send(err);
        } else {
            res.send(requestedArticle);
        }
    });
})

.put(function(req, res) {
    Article.updateOne(
        {title: req.params.articleTitle}, 
        {title: req.body.title, content: req.body.content},
        {overwrite: true}, function(err) {
            if (err) {
                res.send(err);
            } else {
                res.send("Updated successfully.");
            }
    });
})

.patch(function(req, res) {
    Article.updateOne(
        {title: req.params.articleTitle}, 
        {$set: req.body},
        function(err) {
            if (err) {
                res.send(err);
            } else {
                res.send("Updated successfully.");
            }
    });
})

.delete(function(req, res) {
    Article.deleteOne({title: req.params.articleTitle}, function(err) {
        if (err) {
            res.send(err);
        } else {
            res.send("Deleted Successfully");
        }
    });
});



app.listen(3000, function(err){
    if (err) {
        console.log(err);
    } else {
        console.log("Server started on port 3000.");
    }
});