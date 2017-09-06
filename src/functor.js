const curry = require('crocks/helpers/curry')

// functor : Store -> Function -> Action -> a
const functor = ({ dispatch }, next, action) => {
  if (typeof action.map === 'function') {
    action.map(dispatch)
    return
  }
  next(action)
}

module.exports = curry(functor)
