const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  picture: {
    type: String,
    default:
      'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    // required: true,
  },
  //   isAdmin: { type: Boolean, required: true, default: false },
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log(enteredPassword, this.password);
  return await bcrypt.compare(enteredPassword, this.password);
};

// what to do before saving : create a salt
userSchema.pre('save', async function (next) {
  //if current password is not modified move to the next
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  console.log(salt);
  this.password = await bcrypt.hash(this.password, salt);
  console.log(this.password);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
