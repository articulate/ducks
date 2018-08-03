// onError : ((a, b) -> a) -> (a, b, Boolean) -> a
const onError = f =>
  (state, payload, error) =>
    (error ? f(state, payload) : state)

module.exports = onError
