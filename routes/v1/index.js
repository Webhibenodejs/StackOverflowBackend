var express = require('express');
var router = express.Router();

const CategoryController = require('../../Controller/CategoryController')
const QuestionController = require('../../Controller/QuestionController')
const AnswerController = require('../../Controller/AnswerController')
const UserController = require('../../Controller/UserController')
const SignupController = require('../../Controller/Auth/SignUpController')
const LoginController = require('../../Controller/Auth/LoginController')


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

// category crud start
router.post('/create', CategoryController.create)
router.get('/view', CategoryController.viewall)
router.put('/update/:id', CategoryController.update_data)
router.delete('/delete/:id', CategoryController.delete_data)
// category crud end


// questions crud start
router.post('/create_question',QuestionController.create)
router.get('/view_question',QuestionController.viewall)
router.put('/update_question/:id',QuestionController.update_data)
router.delete('/delete_question/:id',QuestionController.delete_data)
// questions crud end

// answers crud start
router.post('/create_answer',AnswerController.create)
router.get('/view_answer',AnswerController.viewall)
router.put('/update_answer/:id',AnswerController.update_data)
router.delete('/delete_answer/:id',AnswerController.delete_data)
// answer crud end


// get all user 
router.get('/view_user',UserController.viewall_user)
// single user fetch
router.get('/view_single_user/:id',UserController.single_use_fetch)

// signup
router.post('/signup',SignupController.create)

// login
router.get('/login',LoginController.login)



module.exports = router;