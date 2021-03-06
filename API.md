# API

| Function | Signature |
| -------- | --------- |
| [`action`](#action) | `String -> a -> Action` |
| [`also`](#also) | `Action -> Action -> [Action]` |
| [`error`](#error) | `String -> a -> Action` |
| [`handle`](#handle) | `a -> { k: (a, b, Boolean) -> a } -> (a, Action) -> a` |
| [`logError`](#logerror) | `(a, b, Boolean) -> a` |
| [`onError`](#onerror) | `((a, b) -> a) -> (a, b, Boolean) -> a` |
| [`onSuccess`](#onsuccess) | `((a, b) -> a) -> (a, b, Boolean) -> a` |
| [`sideEffect`](#sideeffect) | `(() -> a) -> IO Action` |

### action

`@articulate/ducks/lib/action`

```haskell
action :: String -> a -> Action
```

Curried action creator.  Accepts a `String` for the `type`, and anything for the `payload`, and then returns an [FSA-compliant](https://github.com/acdlite/flux-standard-action) action with the format `{ type, payload }`.

See also [`error`](#error), [`handle`](#handle).

```js
const { action } = require('@articulate/ducks')

action('TOGGLE', 42) //=> { type: 'TOGGLE', payload: 42 }

const sendEmail = action('SEND_EMAIL')
sendEmail({ to: 'example@email.com' }) //=> { type: 'SEND_EMAIL', payload: { to: 'example@email.com' } }
```

### also

`@articulate/ducks/lib/also`

```haskell
also :: Action -> Action -> [Action]
```

Helper to dispatch a follow-up action only after an `Async` action resolves.

Requires [`redux-functor`](https://github.com/articulate/redux-functor) middleware to be applied, since it combines two actions into an `Array` of actions, and an `Array` is a functor.

```js
const { also, sideEffect } = require('@articulate/ducks')
const Async = require('crocks/Async')

const createItem = item =>
  Async((rej, res) => { /* send request to create item */ })

const redirectToItem = ({ id }) =>
  sideEffect(() => window.location.href = `/items/${id}`)

const item = { id: 'foo' }

// Below, if creating the item fails, the redirect never happens.
// Otherwise, the redirect only happens after the Async resolves.
createItem(item).map(also(redirectToItem(item))) //=> Async Error [Action]
```

### error

`@articulate/ducks/lib/error`

```haskell
error :: String -> a -> Action
```

Curried error-action creator.  Accepts a `String` for the `type`, and anything for the `payload`, and then returns an [FSA-compliant](https://github.com/acdlite/flux-standard-action) action representing an error with the format `{ type, payload, error: true }`.

See also [`action`](#action), [`handle`](#handle).

```js
const { error } = require('@articulate/ducks')

error('FETCH_USER', new Error('fetch failed')) //=> { type: 'FETCH_USER', payload: Error(...), error: true }

const sendEmail = error('SEND_EMAIL')
sendEmail(new Error('mailbox full')) //=> { type: 'SEND_EMAIL', payload: Error(...), error: true }
```

### handle

`@articulate/ducks/lib/handle`

```haskell
handle :: a -> { k: (a, b, Boolean) -> a } -> (a, Action) -> a
```

Accepts an initial state and a map of action types to reducers, and returns a reducer than handles multiple action types.

Eliminates considerable boilerplate when creating reducers by avoiding verbose `switch` statements and by peeling open the `action.payload` for you. Also safely passes back the previous state if an action `type` is not found in the handlers, as [recommended](http://redux.js.org/docs/basics/Reducers.html).

Requires the use of [FSA-compliant](https://github.com/acdlite/flux-standard-action) actions.

See also [`action`](#action), [`error`](#error).

```js
const add    = require('ramda/src/add')
const assign = require('crocks/helpers/assign')
const evolve = require('ramda/src/evolve')

const { action, handle } = require('@articulate/ducks')

const init = { counter: 0, color: 'blue' }

const reducer = handle(init, {
  INCREMENT: (state, step)  => evolve({ counter: add(step) }, state),
  COLORIZE:  (state, color) => assign({ color }, state)
})

var state = reducer(undefined, {})                  //=> { counter: 0, color: 'blue' }
state = reducer(state, action('INCREMENT', 5))      //=> { counter: 5, color: 'blue' }
state = reducer(state, action('COLORIZE', 'red'))   //=> { counter: 5, color: 'red' }
state = reducer(state, action('NOT_HANDLED', null)) //=> { counter: 5, color: 'red' }
```

### logError

`@articulate/ducks/lib/logError`

```haskell
logError :: (a, b, Boolean) -> a
```

A cheater reducer to log error-actions to `console.error` before safely returning the current state untouched.  No, this is not a pure function.  But it is a very useful one, especially for async actions where the resolved value isn't used, but you still want to know about errors.

See also [`handle`](#handle).

```js
const { handle, logError } = require('@articulate/ducks')

const reducer = handle({}, {
  UPDATE_ITEM_DEBOUNCE: logError
})
```

### onError

`@articulate/ducks/lib/onError`

```haskell
onError :: ((a, b) -> a) -> (a, b, Boolean) -> a
```

Wraps a reducer to produce a new reducer.  If an error-action is dispatched, it executes the original reducer.  Otherwise, the current state is returned untouched.

See also [`handle`](#handle), [`onSuccess`](#onsuccess).

```js
const assoc = require('crocks/helpers/assoc')
const { handle, onError } = require('@articulate/ducks')

const dealWithIt = (state, err) =>
  assoc('errorMessage', err.message, state)

const reducer = handle({}, {
  FAILS_SOMETIMES: onError(dealWithIt)
})
```

### onSuccess

`@articulate/ducks/lib/onSuccess`

```haskell
onSuccess :: ((a, b) -> a) -> (a, b, Boolean) -> a
```

Wraps a reducer to produce a new reducer.  If an error-action is dispatched, the current state is returned untouched.  Otherwise, it executes the original reducer.

See also [`handle`](#handle), [`onError`](#onerror).

```js
const assoc = require('crocks/helpers/assoc')
const { handle, onSuccess } = require('@articulate/ducks')

const putItem = (state, item) =>
  assoc(item.id, item, state)

const reducer = handle({}, {
  CREATE_ITEM: onSuccess(putItem)
})
```

### sideEffect

`@articulate/ducks/lib/sideEffect`

```haskell
sideEffect :: (() -> a) -> IO Action
```

Safely wraps a side-effect in an [`IO`](https://github.com/evilsoft/crocks#crocks) that returns this [FSA-compliant](https://github.com/acdlite/flux-standard-action) action: `{ type: 'SIDE_EFFECT' }`.  Useful for things like redirecting, setting the `document.title`, or logging to the console.

Requires a middleware that can handle [`IO`](https://github.com/evilsoft/crocks#crocks) actions, such as [`redux-io`](https://www.npmjs.com/package/redux-io).

See also [`also`](#also).

```js
const { also, sideEffect } = require('@articulate/ducks')
const { applyMiddleware, combineReducers, createStore } = require('redux')
const functor = require('redux-functor')
const future  = require('redux-future').default
const io      = require('redux-io').default

const { deleteItem } = require('../ducks/items') // Async action creator
const reducers       = require('../ducks')

const store = createStore(
  combineReducers(reducers),
  applyMiddleware(
    io('run'),
    future,
    functor
  )
)

const redirectHome = sideEffect(() => location.href = '/')

const action = deleteItem({ id: 'abc' }).map(also(redirectHome))

store.dispatch(action)  //=> deletes the item, then redirects home
```
