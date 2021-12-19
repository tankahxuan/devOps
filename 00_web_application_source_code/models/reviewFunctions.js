
var db = require("./mongoDBConfig.js")
var review = require('./reviewSchema');



var reviewDB={

getReview: function(callback){
    review.find({}).then(docs=>{
        var status = true
        var message ="Data feteched successfully"
        return callback(status, message, docs)

    })
    
},
addReview:function(newReview, callback){
    console.log(newReview)
    newReview.save().then(docs => {
        var status =true
        var message ="Data added successfully"
        return callback(status, message, docs)

    }).catch(error => {
        var status = false
        var message = error
        return callback(status, message, null)
    });

},
deleteReview:function(deleteReviewId,callback){
    review.deleteOne(deleteReviewId).then(doc=>{
        var status =true
        var message ="Data deleted successfully"
        return callback(status, message, doc)
    }).catch(err=>{return callback(404,"Error delete data",err)})
},


}

module.exports= reviewDB;