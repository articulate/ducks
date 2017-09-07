const { add, evolve } = require('ramda')
const { expect } = require('chai')

const { action, error, handle, onSuccess } = require('..')

describe('onSuccess', () => {
  let state

  const init = { count: 0 }

  const increment = (state, step) =>
    evolve({ count: add(step) }, state)

  const reducer = handle(init, {
    INCREMENT: onSuccess(increment)
  })

  beforeEach(() =>
    state = reducer(undefined, {})
  )

  describe('when an error-action is dispatched', () => {
    beforeEach(() =>
      state = reducer(state, error('INCREMENT', new Error('wrong maths')))
    )

    it('does not execute the wrapped reducer', () =>
      expect(state.count).to.equal(0)
    )
  })

  describe('when a non-error action is dispatched', () => {
    beforeEach(() =>
      state = reducer(state, action('INCREMENT', 2))
    )

    it('executes the wrapped reducer', () =>
      expect(state.count).to.equal(2)
    )
  })
})
