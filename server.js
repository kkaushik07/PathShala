const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
const User = require('./models/user')




require('dotenv').config() 

//create express app
const app = express();

var jsonParser       = bodyParser.json({limit:1024*1024*20, type:'application/json'});
var urlencodedParser = bodyParser.urlencoded({ extended:true,limit:1024*1024*20,type:'application/x-www-form-urlencoded' })


//apply middleware 
app.set('view engine', "ejs")
app.use(express.static( __dirname +'/statics'))
app.use(urlencodedParser);
app.use(cors());
app.use(jsonParser);

app.use(session({
    secret: "EDUMEE",
    resave:false,
    saveUninitialized: false
}))
 
app.use(passport.initialize())
app.use(passport.session())


//mongoDB
mongoose.connect('mongodb+srv://dbUser:mongod@cluster0.o1hzn.mongodb.net/udemyDB?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}
).then(() => {
    console.log("dbConnected successfully")
})
.catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
})


passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//route
app.use( require('./routes/auth'))
app.use(require('./routes/course'))



//port
const port = process.env.PORT || 8000
app.listen(port, () => console.log(`server is running on ${port}`))
console.log('server setup')
