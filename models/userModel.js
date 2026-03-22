import { hash } from "bcrypt";
import { Schema, model } from "mongoose";
import isEmail from "validator/lib/isEmail.js";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      max: [16, "Max characters (16) reached"],
      required: [true, "Need to add First name"],
      alias: "fname",
    },
    lastName: {
      type: String,
      max: [4, "Max characters (4) reached"],
      alias: "lname",
    },
    email: {
      type: String,
      required: [true, "Email is mandatory"],
      unique: [true, "Email ID already exist"],
      validate: [(val) => isEmail(val), "Email ID invalid"],
    },
    password: {
      type: String,
      required: [true, "Password required"],
      min: [8, "Minimum 8 characters"],
      max: [16, "Maximum limit 16 character"],
    },
    confirmPassword: {
      type: String,
      required: [true, "Confirm Password is required"],
      min: [8, "Minimum 8 characters"],
      max: [16, "Maximum limit 16 character"],
      validate: [
        function (val) {
          return val === this.password;
        },
        "Confirm Password and Password didn't match",
      ],
    },
    role: {
      type: String,
      enum: ["CUSTOMER", "ADMIN"],
      required: [true, "Role is required"],
    },
    phone: {
      type: String,
      maxlength: [10, "Max 10 characters"],
      minLength: [10, "Min 10 characters"],
      required: [true, "Contact number is mandatory."],
      unique: [true, "Contact number already added"],
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  this.password = hash(this.password, 10);
  this.confirmPassword = undefined;
});

const UserModel = model("Users", userSchema);

export default UserModel;
