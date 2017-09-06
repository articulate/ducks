const { expect } = require('chai')
const spy        = require('@articulate/spy')

const { action, functor } = require('..')

describe('functor (redux middleware)', () => {
  const axn   = action('TYPE', null)
  const next  = spy()
  const store = { dispatch: spy() }
  const list  = [ axn ]

  afterEach(() => {
    next.reset()
    store.dispatch.reset()
  })

  describe('when action is a functor', () => {
    beforeEach(() =>
      functor(store, next, list)
    )

    it('maps the dispatch function over the functor', () => {
      expect(store.dispatch.calls.length).to.equal(1)
      expect(store.dispatch.calls[0][0]).to.eql(axn)
    })

    it('does not call the next middleware', () =>
      expect(next.calls.length).to.equal(0)
    )
  })

  describe('when action is not a functor', () => {
    beforeEach(() =>
      functor(store, next, axn)
    )

    it('does not map the dispatch function over the functor', () =>
      expect(store.dispatch.calls.length).to.equal(0)
    )

    it('calls the next middleware with the action', () =>
      expect(next.calls[0]).to.eql([axn])
    )
  })
})
