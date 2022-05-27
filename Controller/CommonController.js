const Question = require("../Model/Question");
const Answer = require("../Model/Answer");
const User = require("../Model/User");
const Blog = require("../Model/Blog");


const total_questions = async (req, res) => {
    return Question.aggregate([
        {
            $match: { isDeleted: false, status: true }
        },
        {
            $count: "total_question_count"
        }
    ]).then((data) => {
        return res.status(200).json({
            status: true,
            data: data,
            error: null
        });
    }).catch((error) => {
        return res.status(200).json({
            status: false,
            data: null,
            error: "Something Went Wrong !!!",
        });
    });



}


const total_answers = async (req, res) => {
    return Answer.aggregate([
        {
            $match: { isDeleted: false }
        },
        {
            $count: "total_answer_count"
        }
    ]).then((data) => {
        return res.status(200).json({
            status: true,
            data: data,
            error: null
        });
    }).catch((error) => {
        return res.status(200).json({
            status: false,
            data: null,
            error: "Something Went Wrong !!!",
        });
    });



}

const total_users = async (req, res) => {
    return User.aggregate([
        {
            $match: { isDeleted: false, status: true }
        },
        {
            $count: "total_question_count"
        }
    ]).then((data) => {
        return res.status(200).json({
            status: true,
            data: data,
            error: null
        });
    }).catch((error) => {
        return res.status(200).json({
            status: false,
            data: null,
            error: "Something Went Wrong !!!",
        });
    });



}

const total_blogs = async (req, res) => {
    return Blog.aggregate([
        {
            $match: { isDeleted: false, status: true }
        },
        {
            $count: "total_question_count"
        }
    ]).then((data) => {
        return res.status(200).json({
            status: true,
            data: data,
            error: null
        });
    }).catch((error) => {
        return res.status(200).json({
            status: false,
            data: null,
            error: "Something Went Wrong !!!",
        });
    });



}






module.exports = {
    total_questions,
    total_answers,
    total_users,
    total_blogs
}