const express = require('express')
const app = express();
const mongoose = require('mongoose')
require('dotenv').config({ path: __dirname + "/.env" });

const MongoUrl = process.env.MONGO_CONNECTION_URL;
const port = process.env.PORT || 5000;

app.use(express.json());

app.use(require('./modules/routes'));


// database connection 
mongoose.connect(MongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useCreateIndex: true
})
mongoose.connection.on("connected", () => {
    console.log("Connected to mongoDB...")
})
mongoose.connection.on("error", (err) => {
    console.log("Error", err)
})
app.get('/', (req, res) => {
    res.send("For Testing")
})


app.listen(port, () => { console.log('Server is running on port ' + port) })