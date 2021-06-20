const User = require('../models/user')
const jwt = require('jsonwebtoken')
const passportLocalMongoose = require('passport-local-mongoose')
const passport = require('passport')

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


var user = ''

exports.home = (req, res) => {
    if(req.isAuthenticated()) res.redirect('/dashboard')
    res.render('index', { user: user })
}


exports.register = async (req, res) => {

    console.log(req.body)

    try {
        const { name, username, password } = req.body

        // validation
        if (!name) return res.status(400).send('name is required')
        if (!username) return res.status(400).send('email is required')

        if (!password || password.length < 6) {
            return res
                .status(400)
                .send('Password is required and should be more than 6 charactors')
        }

        let userExist = await User.findOne({ username }).exec();
        if (userExist) return res.status(400).send('Email is already taken')

     

        

        User.register(new User({ username, name, email: username }), password, (err, user) => {
            if (err)  console.log('error', err)
         else {
                passport.authenticate('local')(req, res, function(){
                 if (err) res.status(400).json({ message: err })
                 const user = username
                 return res.redirect('/dashboard')
                })
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(400).send('error. try again')
    }
}

exports.login = (req, res,next) => {

    //collect inputs
    const { username, password } = req.body

    //validation
    if (!username) return res.status(400).send('email is required')
    if (!password) return res.status(400).send('password is required')

    const user = new User({
        username, password
    })

    req.login(user,(err)=>{
        if (err) res.status(400).json({message: err})
        passport.authenticate('local')(req, res, function(){
            if (err) res.status(400).json({ message: err })
           res.redirect('/dashboard')
           })    
    })
}

exports.logout = (req,res) =>{
    req.logout();
    res.redirect('/')

}

