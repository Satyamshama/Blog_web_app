const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Pre-save Middleware -> This Middleware gets activated whenever the 'save' operation is performed
userSchema.pre("save", async function (next) { // Use regular function here
    const user = this;

    if (!user.password) {
        const defaultPassword = "1234";
        user.password = defaultPassword;
    }
    next();
});

// Model
const User = mongoose.model("users", userSchema);

module.exports = User;