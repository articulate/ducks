const { add, assoc, evolve, flip } = require('ramda')
const { expect } = require('chai')

const { action, error, handle } = require('..')

describe('handle', () => {
  let state

  const init = {
    color: 'red',
    count: 0,
    error: null
  }

  const errored = (state, payload, error) =>
    error ? assoc('error', payload, state) : state

  const increment = (state, step) =>
    evolve({ count: add(step) }, state)

  const paint = flip(assoc('color'))

  const reducer = handle(init, {
    ERROR:     errored,
    INCREMENT: increment,
    PAINT:     paint
  })

  beforeEach(() =>
    state = reducer(undefined, {})
  )

  it('initializes the state correctly', () =>
    expect(state).to.eql(init)
  )

  describe('when dispatching a supported action', () => {
    beforeEach(() =>
      state = reducer(state, action('INCREMENT', 2))
    )

    it('uses the correct reducer and peels open the payload', () =>
      expect(state.count).to.equal(2)
    )
  })

  describe('when dispatching an unsupported action', () => {
    beforeEach(() =>
      state = reducer(state, action('NOPE', null))
    )

    it('passes through the current state unchanged', () =>
      expect(state).to.eql(init)
    )
  })

  describe('when dispatching an error-action', () => {
    const broke = new Error('broke')

    beforeEach(() =>
      state = reducer(state, error('ERROR', broke))
    )

    it('passes the `error` flag correctly', () =>
      expect(state.error).to.equal(broke)
    )
  })
})
