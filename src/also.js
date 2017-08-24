const curry = require('crocks/helpers/curry')

// also : Action -> Action -> [Action]
const also = (after, before) => [ before, after ]

module.exports = curry(also)
