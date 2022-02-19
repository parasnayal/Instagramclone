const express = require("express");
const router = express.Router();
const post = require("../Models/Post");
const user = require("../Models/User");
const middleware = require("./Middleware/Middleware")
router.get("/user/:id", middleware, (req, res) => {
    user.findOne({ id: req.params.id })
        .select("-password")
        .then(user => {
            post.find({ postedBy: req.params.id })
                .populate("postedBy", "id name")
                .exec((error, posts) => {
                    if (error) {
                        return res.status(422).json({ error })
                    }
                    else {
                        return res.json({ user, posts });
                    }
                })
        })
        .catch(err => {
            return res.status(404).json({ error: "User not found" });
        })
})
router.put("/follow", middleware, (req, res) => {
    user.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user.id }
    }, {
        new: true
    },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            user.findByIdAndUpdate(req.user.id, {
                $push: { following: req.body.followId }
            },
                {
                    new: true
                }
            )
                .select("-password")
                .then(result => res.json(result))
                .catch(err => {
                    return res.status(422).json({ error: err })
                })
        }
    )
})
router.put("/unfollow", middleware, (req, res) => {
    user.findByIdAndUpdate(req.body.unfollowId, {
        $pull: { followers: req.user.id }
    }, {
        new: true
    },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            user.findByIdAndUpdate(req.user.id, {
                $pull: { following: req.body.unfollowId }
            },
                {
                    new: true
                }
            )
                .select("-password")
                .then(result => res.json(result))
                .catch(err => {
                    return res.status(422).json({ error: err })
                })
        }
    )
})
router.put("/updatepic", middleware, (req, res) => {
    user.findByIdAndUpdate(req.user.id, { $set: { pic: req.body.pic } }, { new: true },
        (error, result) => {
            if (error) {
                return res.status(422).json({ error: "pic can not post" })
            }
            res.json(result);
        })
})
module.exports = router;