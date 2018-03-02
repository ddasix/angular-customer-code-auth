const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
  username: String,
  password: String,
  admin: {
    type: Boolean,
    default: false
  }
})

User.statics.create = function(username, password) {
  console.log('User.statics.create: ',username, password)
  const user = new this({
    username,
    password
  })

  return user.save()
}

User.statics.findOneByUsername = function(username) {
  console.log('User.statics.findOneByUsername: ',username)
  return this.findOne({
    username
  }).exec()
}

User.methods.verify = function(password) {
  return this.password === password
}

User.methods.assignAdmin = function() {
  this.admin = true
  return this.save()
}

module.exports = mongoose.model('User', User)
