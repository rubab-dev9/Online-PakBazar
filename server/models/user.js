const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [5, "Name must be at least 5 characters long"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, "Please fill a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8,
        validate: {
            validator: function (value) {
                // Only validate when password is modified
                if (!this.isModified('password')) {
                    return true;
                }

                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#.])[A-Za-z\d@$!%*?&#.]{8,}$/.test(value);
            },
            message:
                "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
        },
    },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    role: {
        type: String,
        enum: ["customer", "supplier", "admin"],
        default: "customer"
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    accountVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Encrypt password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("User", userSchema);
