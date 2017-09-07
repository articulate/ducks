const Async      = require('crocks/Async')
const { expect } = require('chai')
const property   = require('prop-factory')

const { action, also } = require('..')

describe('also', () => {
  const after  = action('AFTER', null)
  const before = action('BEFORE', null)
  const res    = property()

  beforeEach(() =>
    Async.of(before)
      .map(also(after))
      .fork(res, res)
  )

  it('pairs an Async result with a follow-up action', () =>
    expect(res()).to.eql([ before, after ])
  )
})
