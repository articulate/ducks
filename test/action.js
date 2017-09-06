const { expect } = require('chai')

const { action } = require('..')

describe('action', () => {
  const type    = 'TYPE'
  const payload = 'payload'

  it('creates an FSA-style action', () =>
    expect(action(type, payload)).to.eql({ type, payload })
  )

  it('curries to form action creators', () =>
    expect(action(type)(payload)).to.eql({ type, payload })
  )
})
