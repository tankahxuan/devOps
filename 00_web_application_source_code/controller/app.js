var express = require('express'),
    cookieParser = require('cookie-parser'),
    path = require('path'),
    bodyParser = require('body-parser'),
    request = require('request'),
    dateFormat = require('dateformat'),
    CSVToJSON = require('csvtojson'),
    cors=require('cors'),
    mongodbConn = require("../models/mongoDBConfig");



// ========================================
// Application Middlewares
// ========================================
var app = express();

// To Enable CORS middleware for all orgins:
app.options('*', cors()); // include before other routes
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use("/SummerMelts/views", express.static('views'));

app.set("view engine", "ejs")

app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  });
  
var dbconn = mongodbConn.getConnection();
if(dbconn){
console.log("mongodb connected");
}
else{
console.log("database connection error");
}

var review=require('../models/reviewSchema'),
    reviewfunctions=require('../models/reviewFunctions');
// ========================================
// API Routes here
// ========================================
app.post('/SummerMelts/submitReview', function (req, res) {
    
    const newReview = new review({
        name: req.body.name,
        review_text: req.body.review_text,
        review_date: req.body.review_date,
        review_id: req.body.review_id
    })

    reviewfunctions.addReview(newReview, function(status, message, docs){
        res.json({
            status:status,
            message:message,
            doc:docs
        })
    } )
})

app.get('/SummerMelts/getallReviews',(req,res)=>{
    reviewfunctions.getReview((status,message,doc)=>{
        res.json({
            status:status,
            message:message,
            doc:doc
        })
    })
})


app.delete('/SummerMelts/deleteReview/:id',(req,res,next)=>{
    deleteUserID={ _id: req.params.id }
    reviewfunctions.deleteReview(deleteUserID,(status,msg,doc)=>{
        res.json({
            status:status,
            message:msg,
            doc:doc
        })
    })
})




// ========================================
// Web Application Render HTML Routes here
// ========================================

app.get('/SummerMelts/reviews', function (req, res) {
    
   
    res.render('reviews.ejs');
})






module.exports=app;