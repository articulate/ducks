// onSuccess : ((a, b) -> a) -> (a, b, Boolean) -> a
const onSuccess = f =>
  (state, payload, error) =>
    (error ? state : f(state, payload))

module.exports = onSuccess
