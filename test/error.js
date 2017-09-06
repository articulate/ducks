const { expect } = require('chai')

const { error } = require('..')

describe('error', () => {
  const type    = 'TYPE'
  const payload = new Error('whoops')

  it('creates an FSA-style error-action', () =>
    expect(error(type, payload)).to.eql({ type, payload, error: true })
  )

  it('curries to form error-action creators', () =>
    expect(error(type)(payload)).to.eql({ type, payload, error: true })
  )
})
