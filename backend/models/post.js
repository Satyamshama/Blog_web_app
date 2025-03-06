const mongoose = require("mongoose")

const postSchema = mongoose.Schema({
    postId: {
        type: Number,
        unique: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


// Pre-save Middleware to Automatically Assign postId
postSchema.pre("save", async function (next) { // Use regular function syntax for correct `this` binding
    const post = this;

    if (!post.postId) {
        try {
            const count = await mongoose.model("posts").countDocuments();
            post.postId = count + 1; // Assign `postId` based on the current count + 1
            next();
        } catch (error) {
            return next(error); // Pass error to the next middleware or function
        }
    } else {
        next(); // Skip if `postId` is already set
    }
});

// Model
const Post = mongoose.model("posts", postSchema);

module.exports = Post;


// // pre-Middleware -> This Middleware gets activated whenever the 'save' operation is performed
// postSchema.pre("save", async (next) => {
//     // 'this' refers to the current post that is going to be saved
//     const post = this

//     if(!post.postId) {
//         // count number of posts
//         const count = await mongoose.model("posts").countDocuments()

//         post.postId = count + 1
//         next()
//     }
//     else {
//         next()
//     }
// })


// // Model
// const Post = mongoose.model("posts", postSchema)

// module.exports = Post