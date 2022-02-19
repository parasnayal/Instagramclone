const express = require("express");
const app = express();
var cors = require('cors');
const mongoose = require("mongoose");
const { MONGO_URI } = require("./config/keys")
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on("connected", () => {
    console.log("connected to mongodb successfully");
})
mongoose.connection.on("error", (err) => {
    console.log("Some error occured ", err);
})
app.use(cors())
app.use(express.json());
app.use(require("./Routers/userRouter"));
app.use(require("./Routers/postRouter"));
app.use(require("./Routers/user"));
if (process.env.NODE_ENV === "production") {
    app.use(express.static('client/build'));
    const path = require('path');
    app.get("*", (req, res) => {
        res.send(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}
app.listen(PORT, () => {
    console.log(`Express app listening at http://localhost:${PORT}`);
});