# Redux SharedWorker
SharedWorker [middleware](https://redux.js.org/advanced/middleware) for Redux.

```bash
npm install @flameddd/redux-sharedworker
```

# BREAKING CHANGE from V1 to V2 (upgrade to V2 to fix [#1](https://github.com/flameddd/redux-sharedworker/issues/1) issue)
- **Add** init flow
  - V2 have to `dispatch({ type: 'SHARED_WORDER_INIT' })` to **init** **sharedworker's onmessage** to receive broadcast actions
- **Rename** Action field to `SHARED_WORDER_ACTION` (instead of `SHARE_WORDER_SYNC_ACTION`)

## What Redux SharedWorker can do ?
Relay on [SharedWorker](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker). We can communicate with multi windows. **Redux SharedWorker** middleware help us to broadcast **Actions** to across multi Tabs and Windows.

<p align="center">
  <img width="auto" height="450" src="https://github.com/flameddd/redux-sharedworker-demo/raw/master/demo2.gif"
</p>
  
### demo repo
- https://github.com/flameddd/redux-sharedworker-demo

## Installation
```bash
npm install @flameddd/redux-sharedworker
```

**3 steps** after intalled:
1. Add redux middleware
2. Dispatch `{ type: 'SHARED_WORDER_INIT' }` action for **receive** broadcast actions
3. Dispatch to Broadcast Actions
    - **TWO** way to **broadcast Actions** (either one)
      1. add action's **type** into **targetActions** (example in below)
      2. add **SHARED_WORDER_ACTION** feild in action (example in below)

## Add redux middleware
To enable **Redux SharedWorker**, use [`applyMiddleware()`](https://redux.js.org/api/applymiddleware):

```js
import { createStore, applyMiddleware, compose } from 'redux';
import createSharedWorkerMiddleware from '@flameddd/redux-sharedworker';
import rootReducer from './reducers/index';

const middlewares = [
  createSharedWorkerMiddleware(),
  //...
];

const enhancers = [applyMiddleware(...middlewares)];

const store = createStore(
  rootReducer,
  compose(...enhancers),
);
```

## Init redux-sharedworker
after `v2` version, you have to `dispatch({ type: 'SHARED_WORDER_INIT' })` action to **init** **sharedworker's onmessage** function

### hooks example
```js
import React from 'react';
import { useDispatch } from 'react-redux';

function App() {
  const dispatch = useDispatch(); 

  React.useEffect(() => {
    dispatch({ type: 'SHARED_WORDER_INIT' })
  },[dispatch])

  return (
    <div className="App" />
  );
}

export default App;
```

### connect class example
```js
import React from 'react';
import { connect } from 'react-redux';

// use connect to get dispatch props
class App extends React.Component {
  componentDidMount() {
    this.props.dispatch({ type: 'SHARED_WORDER_INIT' });
  }
  render() {
    return (
      <div className="App" />
    );
  }
}

const mapStateToProps = null;
const mapDispatchToProps = null
export default connect(mapStateToProps, mapDispatchToProps)(App);
```

## createSharedWorkerMiddleware({ customWorker, targetActions })
### customWorker (String)(optional)

```js
// Example: **Customize** your `worker.js`:
// see "debug worker" section in below to debug customWorker

const customWorker = `
  const ports = [];
  onconnect = function (connectEvent) {
    ports.push(connectEvent.ports[0])
    connectEvent.ports[0].onmessage = function(event) {
      // console.log(event)
      ports.forEach(port => {
        port.postMessage(event.data)
      })
    }
  }
`;

const middlewares = [
  createSharedWorkerMiddleware({ customWorker }),
  //...
];
```

### targetActions (Array[String])(optional)(default = [])
`redux-sharedworker` will **broadcast Actions** when action **type** match one of **targetActions**

```js
const middlewares = [
  createSharedWorkerMiddleware({ targetActions: ['ADD'] }),
];
```

<p align="center">
  <img width="auto" height="450" src="demo01.gif"
</p>

## SHARED_WORDER_ACTION (~~SHARE_WORDER_SYNC_ACTION~~)
**SHARED_WORDER_ACTION** is an alternative way to **broadcast Actions** when **Action type** does NOT include in **targetActions**.

**Add SHARED_WORDER_ACTION** field and set **true**. `redux-sharedworker` will **broadcast** this action too.

```js
function mapDispatchToProps(dispatch) {
  return {
    onAdd: () => dispatch({ type: 'ADD' }),
    onMIN: () => dispatch({ type: 'MIN' }),
    onRest: () => dispatch({ type: 'RESET', SHARED_WORDER_ACTION: true }),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
```

## debug worker
### Chrome
type `chrome://inspect` into URL and `inspect` worker. This can help a lot when you are developing worker. `console.log` information to take look.  

<p align="center">
  <img width="500" height="400" src="chrome_worker_inspect.jpg"
</p>

### Firefox
[How to show the active service workers in the firefox dev tools?](https://stackoverflow.com/questions/48428725/how-to-show-the-active-service-workers-in-the-firefox-dev-tools)

## Can I Use ? (browsers support)
- https://caniuse.com/#search=shared 

2020/07/03
<p align="center">
  <img width="auto" height="400" src="CanIUse.jpg"
</p>

## TODO
- react hooks example
- DEMO gifs
- DEMO project

## License

MIT
