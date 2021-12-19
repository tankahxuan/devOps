
const mongoose = require('mongoose');
const schema = mongoose.Schema


// this will be our data base's data structure 
const reviewSchema = new schema({
    review_id: { type: String, required: true },
    name: { type: String, required: true },
    review_text: { type: String, required: true },
    review_date: { type: String, required: true }
  
});

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model('reviews', reviewSchema);