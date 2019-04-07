const { verify } = require('../helpers/jwt')

module.exports = (req, res, next) => {
  try {
    const decode = verify(req.headers.token, process.env.SECRET_KEY)
    req.authenticated = decode
    next()

  } catch(err) {
    res.status(401).json({ error: 'Authentication ERROR'})
  }
}