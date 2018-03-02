const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.query.token

  if(!token) {
    return res.status(403).json({
      success: false,
      message: 'not logged in'
    })
  }

  const promise = new Promise((resolve, reject) => {
    jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
      if(err) {
        reject(err)
      } else {
        resolve(decoded)
      }
    })
  })

  const respond = (decoded) => {
    req.decoded = decoded
    next()
  }

  const onError = (err) => {
    res.status(403).json({
      success: false,
      message: err.message
    })
  }

  promise
    .then(respond)
    .catch(onError)
}

module.exports = authMiddleware
