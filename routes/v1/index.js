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
const FollowController = require('../../Controller/FollowController')
const FooterController = require('../../Controller/FooterController')



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
router.get('/category-wise-all-question/:id',QuestionController.category_wise_all_ques)
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
// user profile update
router.put('/update_user/:id',UserController.update_data)
// user password change
router.put('/update_password/:id',UserController.update_password)


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


// vote start
router.post('/create_vote', VoteController.create)
// vote end

// user follow start
router.post('/create_follow', FollowController.create)
router.post('/check-follwing', FollowController.checkFollowing)
router.delete('/unfollow', FollowController.unfollow)
// user follow end

// tag follow start
router.post('/create-tag-follow', FollowController.tagFollowCreate)
router.post('/check-tag-follwing', FollowController.checkTagFollowing)
router.delete('/tag-unfollow', FollowController.unfollowTag)
// tag follow end

// blog crud start
router.post('/blog_create', BlogController.create)
router.get('/blog_view_all', BlogController.viewall)
router.put('/blog_update/:id', BlogController.update_data)
router.put('/blog_delete/:id', BlogController.delete_data)
router.get('/blog_single_view/:id', BlogController.viewsingle)
// blog crud end

// contact_us start
router.post('/send-contacts', FooterController.send_mails)
// contact_us end


module.exports = router;

