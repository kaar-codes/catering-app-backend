import { hash } from "bcrypt";
import { Schema, model } from "mongoose";

const userSchema = new Schema({
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
    validate: [
      function (val) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val);
      },
      "Email ID invalid",
    ],
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
  contact: {
    type: String,
    max: [10, "Max 10 characters"],
    min: [10, "Min 10 characters"],
    required: [true, "Contact number is mandatory."],
    unique: [true, "Contact number already added"],
  },
});

userSchema.pre("save", async function () {
  this.password = await hash(this.password, 10);
  this.confirmPassword = undefined;
});

const UserModel = model("USER", userSchema);

export default UserModel;
