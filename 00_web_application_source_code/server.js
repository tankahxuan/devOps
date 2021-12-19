const app = require('./controller/app.js')

const port = 3000;
const hostname = "localhost";
const purpose = "...Summer Melts Webpage.."
app.listen(port, function () {
    console.log(`\n${purpose}\n`);
    console.log(`Listening to port:  http://${hostname}:${port}/SummerMelts`);
    console.log("Do not close this window")
})
