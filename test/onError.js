const { assoc } = require('ramda')
const { expect } = require('chai')

const { action, error, handle, onError } = require('..')

describe('onError', () => {
  let state

  const init = { message: '' }

  const incrementError = (state, err) =>
    assoc('message', err.message, state)

  const reducer = handle(init, {
    INCREMENT: onError(incrementError)
  })

  beforeEach(() =>
    state = reducer(undefined, {})
  )

  describe('when an error-action is dispatched', () => {
    beforeEach(() =>
      state = reducer(state, error('INCREMENT', new Error('wrong maths')))
    )

    it('executes the wrapped reducer', () =>
      expect(state.message).to.equal('wrong maths')
    )
  })

  describe('when a non-error action is dispatched', () => {
    beforeEach(() =>
      state = reducer(state, action('INCREMENT', 2))
    )

    it('does not execute the wrapped reducer', () =>
      expect(state.message).to.equal('')
    )
  })
})
