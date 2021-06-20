const mongoose = require('mongoose')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')



const {Schema} =mongoose

const userSchema = new Schema({
    username:{
        type: String,
        trim: true,
        reuired: true
    },
    name:{
        type: String,
        trim: true,
        required: true
    },
    email:{
        type: String,
        trim: true,
        required: true,
        unique: true

    },
    profilePic:{
        type: String,
        default:'/avatar.png'
    },
    role:{
        type:[String],
        default:['subscriber'],
        enum:['subscriber','Author','Admin']
    }

},{ timestamps:true })

userSchema.plugin(passportLocalMongoose,{
    selectFields: 'username name email'
})

exports.User = new mongoose.model('User',userSchema)

// passport.use(User.createStrategy())
// passport.serializeUser(User.serializeUser())
// passport.deserializeUser(User.deserializeUser())

module.exports = mongoose.model('User',userSchema)