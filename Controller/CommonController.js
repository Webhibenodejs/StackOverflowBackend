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

const search_data = async (req, res) => {
    // let dataSet = {
    //     searchBy: req.body.searchBy 
    // }

    // var searchVarieable = { title : { $regex : req.body.searchBy , $options : "i" }}


    return Question.aggregate([
        {
            $match: {
                title: { $regex: req.body.searchBy, $options: "i" },
                isDeleted: false,
                status: true
            },
        },
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            __v: 0,
                            isDeleted: 0,
                            status: 0,
                            createOn: 0
                        },
                    }
                ],
                as: "categoryDetails"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            __v: 0,
                            email: 0,
                            password: 0,
                            status: 0,
                            isDeleted: 0,
                            createOn: 0
                        },
                    }
                ],
                as: "userDetails"
            }
        },
        {
            $lookup: {
                from: "tags",
                localField: "tag.tagId",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            __v: 0,
                            description: 0,
                            status: 0,
                            isDeleted: 0,
                            createOn: 0
                        },
                    }
                ],
                as: "tagDetails"
            }
        },
        {
            $project: {
                __v: 0,
                status: 0,
                isDeleted: 0,
                category: 0,
                userId: 0,
                tag: 0
            },
        },
        { $unwind: "$categoryDetails" },
        { $unwind: "$userDetails" }
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
            test: error
        });
    });
}




module.exports = {
    total_questions,
    total_answers,
    total_users,
    total_blogs,
    search_data
}