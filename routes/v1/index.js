var express = require('express');
var router = express.Router();

const CategoryController = require('../../Controller/CategoryController')
const QuestionController = require('../../Controller/QuestionController')
const AnswerController = require('../../Controller/AnswerController')
const UserController = require('../../Controller/UserController')
const SignupController = require('../../Controller/Auth/SignUpController')
const LoginController = require('../../Controller/Auth/LoginController')
const TagController = require('../../Controller/TagController')
const VoteController = require('../../Controller/VoteController')
const BlogController = require('../../Controller/BlogController')



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
router.get('/single-question-fetch/:id',QuestionController.single_ques_fetch)
router.get('/unanswered-question',QuestionController.no_answered_ques)
// questions crud end

// answers crud start
router.post('/create_answer',AnswerController.create)
router.get('/view_answer',AnswerController.viewall)
router.put('/update_answer/:id',AnswerController.update_data)
router.put('/delete_answer/:id',AnswerController.delete_data)
// answer crud end

// get all user 
router.get('/view_user',UserController.viewall_user)
// single user fetch
router.get('/view_single_user/:id',UserController.single_use_fetch)

// signup
router.post('/signup',SignupController.create)

// login
router.post('/login',LoginController.login)

// Tag crud start
router.post('/tag_create', TagController.create)
router.get('/tag_view', TagController.viewall)
router.put('/tag_update/:id', TagController.update_data)
router.put('/tag_delete/:id', TagController.delete_data)
// Tag crud end


// vote crud start
router.post('/create_vote', VoteController.create)
// vote crud end


// blog crud start
router.post('/blog_create', BlogController.create)
router.get('/blog_view_all', BlogController.viewall)
router.put('/blog_update/:id', BlogController.update_data)
router.put('/blog_delete/:id', BlogController.delete_data)
// blog crud end


module.exports = router;

