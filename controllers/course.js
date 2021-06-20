const Course = require('../models/course');
const slugify = require('slugify');
const Enrolled = require('../models/enrolledCourses');

exports.courses = async (req, res) => {

  

  const category= req.params.category

    if(req.isAuthenticated()){
        const alreadyEnrolled = await Enrolled.find({ user: req.user._id }).exec()

        const courses = await Course.find({category}).populate('Author', '_id name').exec((err, result) => {
            if (err) console.log(err)
            if (result) {
               (console.log("courses controller"))
                res.render('courses.ejs', { result ,alreadyEnrolled, user:req.user})
            }
        })
        
    }else{
        const courses = await Course.find({category}).populate('Author', '_id name').exec((err, result) => {
        if (err) console.log(err)
        if (result) {
            //console.log(result)
            res.render('courses.ejs', { result, alreadyEnrolled: null , user: req.user})
        }
    })}
    

    
}

exports.addCourse = (req, res) => {

    const { title, description, price, category, Author } = req.body

    const image = req.file.filename
    console.log(image)
    const course = new Course({
        title, description, price, catagory, Slug: slugify(title), Author, image
    })
    course.save((err, course) => {
        if (err) return res.status(400).json({ message: err })
        if (course) return res.status(201).json({ message: 'course added', course })
    })
 }


exports.addLesson = (req, res) => {


    const { title, description, course, Slug , Author} = req.body;


    const lessonVideos = req.files.map(file => file.filename);
    const lesson = Course.findOneAndUpdate({ Slug , Author},
        {
            $push: { lessons: { title, description, course, Slug: slugify(title), lessonVideo: lessonVideos } }
        }, { new: true }
    )
        .populate('Author', '_id name').exec((err, lesson) => {
            if (err) res.status(400).json({ message: 'lesson could not be added', err: err })
            if (lesson) res.status(201).json({ message: "lessonAdded", lesson })
        })

}

exports.enroll = async (req, res) => {


    if (req.isAuthenticated()) {
        const { Slug } = req.body
        const user = req.user._id
        const { course } = req.params

        const alreadyEnrolled = await Enrolled.findOne({ course, user }).exec()

        if (alreadyEnrolled) return res.send("already enrolled ")

        const enroll = await new Enrolled({ course, user, Slug }).save()

        res.redirect('/dashboard')
    }
    res.redirect("/")
}

exports.catagories = (req,res)=>{
    
    res.render('category',{user:req.user})
}

exports.dashboard = async (req, res) => {

    
    if (req.isAuthenticated()) {
        const enrolled = await Enrolled.find({ user: req.user._id }).populate('course').exec((err, results) => {
            if (err) console.log(err)
            if (results) { console.log("dashboard controller")
                res.render('dashboard', { results , user: req.user._id })}
        })
    }
    else {
        res.redirect("/")
    }


}

exports.myCourse = async (req, res) => {

    if (req.isAuthenticated()) {

        const {course,Slug} = req.params
        //console.log(course,Slug)
        const enrolledCourse = await Enrolled.findOne({ user: req.user._id,course , Slug}).populate('course').exec((err, results) => {
            if (err) console.log(err)
            if (results) { console.log( "myCourse controller")
                res.render('myCourse', { results , user: req.user._id })}
        })
    } else {
        res.redirect('/')
    }
}

exports.completed = (req, res) => {

    if (req.isAuthenticated()) {
        const { Slug,course, title } = req.body
        //console.log(Slug, title)

        const complete = Enrolled.findOneAndUpdate({ user: req.user._id  ,course },
                    {$push: { 'completedLessons': title }}).exec((err) => {

                if (err) res.status(400).json({ message: 'lesson could not be marked as done', err: err })
                
                return res.redirect(`/lesson/${course}/${Slug}`)
            })

    } else{
        res.redirect('/')
    } 
}

exports.incomplete = (req,res) => {

    if (req.isAuthenticated()) {
        const { Slug,course, title } = req.body
        //console.log(Slug, title)

        const incomplete = Enrolled.findOneAndUpdate({ user: req.user._id,course },
                    {$pull: { 'completedLessons': title }}).exec((err) => {

                if (err) res.status(400).json({ message: 'lesson could not be unmarked as done', err: err })
                
                return res.redirect(`/${course}/${Slug}`)
            })

    } else{
        res.redirect('/')
    }     

}

exports.remains = (req,res)=>{
    res.render('remaining',{user:req.user})
}

