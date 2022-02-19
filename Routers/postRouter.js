const express = require("express");
const router = express.Router();
const middleware = require("../Middleware/Middleware");
const user = require("../Models/User");
const post = require("../Models/Post");
router.post("/createpost", middleware, (req, res) => {
    const { title, body, image } = req.body;
    if (!title || !body || !image) {
        return res.status(400).json({ error: "Please add all the fields" });
    }
    req.user.password = undefined;
    const Post = new post({
        title,
        body,
        image,
        postedBy: req.user
    })
    Post.save().then(result => {
        res.json({ post: result })
    })
        .catch(err => {
            console.log(err)
        })
});

// Route => to get user's post
router.get("/mypost", middleware, (req, res) => {
    post.find({ postedBy: req.user.id })
        .populate("postedBy", "name id")
        .then(data => res.json({ data }))
        .catch(error => console.log(error));
});
router.get("/allpost", middleware, (req, res) => {
    post.find()
        .populate("postedBy", "name id")
        .populate("comments.postedBy", "name id")
        .then(data => res.json({ data }))
        .catch(error => console.log(error));
});
router.put("/likes", middleware, (req, res) => {
    post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user.id }
    }, {
        new: true
    }).exec((error, result) => {
        if (error) {
            return res.status(422).json({ error })
        }
        else {
            return res.json(result);
        }
    })
})
router.put("/unlike", middleware, (req, res) => {
    post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user.id }
    }, {
        new: true
    }).exec((error, result) => {
        if (error) {
            return res.status(422).json({ error })
        }
        else {
            return res.json(result);
        }
    })
})
router.put("/comments", middleware, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user.id
    }
    post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true
    })
        .populate("comments.postedBy", "id name")
        .populate("postedBy", "id name")
        .exec((error, result) => {
            if (error) {
                return res.status(422).json({ error })
            }
            else {
                return res.json(result);
            }
        })
});
router.delete("/deletepost/:postId", middleware, (req, res) => {
    post.findOne({ id: req.params.postId })
        .populate("postedBy", "id")
        .exec((error, result) => {
            if (error || !result) {
                return res.status(422).json(result);
            }
            if (result.postedBy.id.toString() === req.user.id.toString()) {
                result.remove()
                    .then(result => res.json(result))
                    .catch(error => console.log(error));
            }
        })
});
router.get("/getsubpost", middleware, (req, res) => {
    post.find({postedBy:{$in:req.user.following}})
        .populate("postedBy", "name id")
        .populate("comments.postedBy", "name id")
        .then(data => res.json({ data }))
        .catch(error => console.log(error));
});
module.exports = router;