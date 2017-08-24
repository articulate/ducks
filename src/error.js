const curry = require('crocks/helpers/curry')

// error : String -> a -> Action
const error = (type, payload) => ({ type, payload, error: true })

module.exports = curry(error)
