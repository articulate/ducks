// logError : (a, b, Boolean) -> a
const logError = (state, payload, error) => {
  if (error) console.error(payload)
  return state
}

module.exports = logError
