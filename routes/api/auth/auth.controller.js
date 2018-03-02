const User = require('../../../models/user')
const config = require('../../../config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
/*
    POST /api/auth/register
    {
        username,
        password
    }
*/

exports.register = (req, res) => {
  const { username, password } = req.body
  let newUser = null

  console.log('exports.register: ', req.body, username, password);

  const create = (user) => {
    console.log(user)
    if(user) {
      throw new Error('Username is Exists')
    } else {
      return User.create(username, password)
    }
  }

  const count = (user) => {
    newUser = user
    return User.count({}).exec()
  }

  const assign = (count) => {
    if(count === 1) {
      return newUser.assignAdmin()
    } else {
      return Promise.resolve(false)
    }
  }

  const respond = (isAdmin) => {
    res.json({
      message: 'registered successfully',
      admin: isAdmin ? true : false
    })
  }

  const onError = (error) => {
    res.status(409).json({
      message: error.message
    })
  }

  User.findOneByUsername(username)
    .then(create)
    .then(count)
    .then(assign)
    .then(respond)
    .catch(onError)
}

exports.login = (req, res) => {
  const { username, password } = req.body
  const secret = req.app.get('jwt-secret')

  const check = (user) => {
    if(!user) {
      throw new Error('Login Failed')
    } else {
      if(user.verify(password)) {
        const promise = new Promise((resolve, reject) => {
          jwt.sign({
            _id: user._id,
            username: user.username,
            admin: user.admin
          }, secret, {
            expiresIn: '7d',
            issuer: 'localhost',
            subject: 'userInfo'
          }, (err, token)=>{
            if(err) {
              reject(err)
            } else {
              resolve(token)
            }
          })

        })
        return promise

      } else {
        throw new Error('Login Failed')
      }
    }
  }

  const respond = (token) => {
    res.json({
      message: 'logged in successfully',
      token
    })
  }

  const onError = (err) => {
    console.log(err)
    res.status(403).json({
      message: err.message
    })
  }

  User.findOneByUsername(username)
    .then(check)
    .then(respond)
    .catch(onError)
}

exports.check = (req, res) => {
  res.json({
    success: true,
    info: req.decoded
  })
}

exports.me = (req, res) => {
  var token = req.headers['x-access-token']

  if(!token) {
    return res.status(401).send({
      message: 'No token provided.'
    })
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if(err) {
      return res.status(500).send({
        message: 'Failed to authenticate token.'
      })
    }

    res.status(200).send(decoded)
  })
}
