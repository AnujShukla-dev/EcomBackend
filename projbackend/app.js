require("dotenv").config();
const express  = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require('cors');

const authRoutes = require("./routes/auth");

//DB Connection
mongoose
.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
})
.then(()=>{
    console.log('DB CONNECTED')
}).catch(
   () =>{console.log("Db got error ops!!")}
);

//Middlewares 
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use("/api",authRoutes)

//My Routes


//Port
const port  = process.env.PORT || 8001;

//Starting a server
app.listen(port,()=>{
    console.log(`app is running at ${port}`);
})
 