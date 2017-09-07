const { assoc, flip } = require('ramda')
const { expect }      = require('chai')
const spy             = require('@articulate/spy')

const { action, error, handle, logError } = require('..')

const consoleError = console.error

describe('logError', () => {
  let state

  const init = { name: 'bob' }

  const rename = flip(assoc('name'))

  const reducer = handle(init, {
    RENAME:          rename,
    RENAME_DEBOUNCE: logError
  })

  beforeEach(() => {
    console.error = spy()
    state = reducer(undefined, {})
  })

  afterEach(() =>
    console.error = consoleError
  )

  describe('when a non-error action is dispatched', () => {
    beforeEach(() =>
      state = reducer(state, action('RENAME_DEBOUNCE', 'bobby'))
    )

    it('does not log the payload to stderr', () =>
      expect(console.error.calls.length).to.equal(0)
    )

    it('passes through the state', () =>
      expect(state).to.equal(state)
    )
  })

  describe('when `error` is true', () => {
    const payload = new Error('superbad')

    beforeEach(() =>
      state = reducer(state, error('RENAME_DEBOUNCE', payload))
    )

    it('logs the payload to stderr', () =>
      expect(console.error.calls[0]).to.eql([ payload ])
    )

    it('passes through the state', () =>
      expect(state).to.equal(state)
    )
  })
})
