const mongoose = require('mongoose');

var mongoDBconnect = {
    getConnection: function () {
        var conn = mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        return conn;
    }

}
module.exports = mongoDBconnect;

