const curry = require('crocks/helpers/curry')

// handle : a -> { k: (a, b, Boolean) -> a } -> (a, Action) -> a
const handle = (init, reducers) =>
  (state = init, { type, payload, error }) =>
    reducers[type] ? reducers[type](state, payload, error) : state

module.exports = curry(handle)
