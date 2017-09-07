const { expect } = require('chai')
const spy        = require('@articulate/spy')

const { sideEffect } = require('..')

describe('sideEffect', () => {
  const redirect = spy()
  const safeRedirect = sideEffect(redirect)

  afterEach(() =>
    redirect.reset()
  )

  it('wraps the side-effect in an IO', () =>
    expect(safeRedirect.type()).to.equal('IO')
  )

  describe('when run', () => {
    let res

    beforeEach(() =>
      res = safeRedirect.run()
    )

    it('executes the side-effect', () =>
      expect(redirect.calls.length).to.equal(1)
    )

    it('returns an FSA-compliant action', () =>
      expect(res).to.eql({ type: 'SIDE_EFFECT' })
    )
  })
})
