const curry = require('crocks/helpers/curry')

// action : String -> a -> Action
const action = (type, payload) => ({ type, payload })

module.exports = curry(action)
