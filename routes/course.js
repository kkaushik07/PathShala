const express = require('express')
const multer = require('multer')
const shortid = require('shortid')

const { addLesson, addCourse, courses, enroll, dashboard, myCourse, completed ,incomplete, catagories,remains } = require('../controllers/course')
const path = require('path')

const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), 'statics/Videos'))
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() + '-' + file.originalname)
    }
})

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), 'statics/images'))
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() + '-' + file.originalname)
    }
})






const upload = multer({ storage })
const imageUpload = multer({storage: imageStorage})



router.post('/course/lesson/addlesson', upload.array('lesson'), addLesson)
router.post('/course/create',imageUpload.single('image'),addCourse)
router.post('/courses/:course/:enroll',enroll)
router.post('/completed',completed)
router.post('/Incompleted',incomplete)

router.get('/dashboard',dashboard)
router.get('/categories',catagories)
router.get('/:category/:courses', courses)
router.get('/:lesson/:course/:Slug',myCourse)
router.get('/:name', remains)


module.exports = router