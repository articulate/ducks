const constant = require('crocks/combinators/constant')
const IO       = require('crocks/IO')

// sideEffect : (() -> a) -> IO Action
const sideEffect = f =>
  IO(f).map(constant({ type: 'SIDE_EFFECT' }))

module.exports = sideEffect
