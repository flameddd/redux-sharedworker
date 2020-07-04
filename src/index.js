const defaultWorker = `
  const ports = [];
  onconnect = function (connectEvent) {
    ports.push(connectEvent.ports[0])
    connectEvent.ports[0].onmessage = function(event) {
      ports.forEach(port => {
        port.postMessage(event.data)
      })
    }
  }
`;

const createSharedWorker = ({
  worker,
  SHARED_WORDER_ID,
  targetActions,
}) => () => (next) => (action) => {
  const { type, SHARED_WORDER_ACTION = false } = action;
  if (SHARED_WORDER_ACTION || targetActions.indexOf(type) !== -1) {
    worker.port.postMessage({
      SHARED_WORDER_ID,
      SHARED_WORDER_ACTION: true,
      ...action,
    });
  }

  if (type === "SHARED_WORDER_INIT") {
    worker.port.onmessage = function ({ data }) {
      if (data.SHARED_WORDER_ID === SHARED_WORDER_ID) {
        return;
      }
      return next(event.data);
    };
  }

  return next(action);
};

const reduxMiddleware = () => (next) => (action) => next(action);

export const createSharedWorkerMiddleware = ({
  customWorker = defaultWorker,
  targetActions = [],
} = {}) => {
  if (!window.SharedWorker) {
    console.warn(
      "REDUX_SHAREDWORKER WARNING: The browser does not support SharedWorker"
    );
    return reduxMiddleware;
  }

  if (typeof customWorker !== "string") {
    console.error(
      'REDUX_SHAREDWORKER WARNING: parameter "customWorker" must be String type'
    );
    return reduxMiddleware;
  }

  if (!Array.isArray(targetActions)) {
    console.error(
      'REDUX_SHAREDWORKER WARNING: parameter "targetActions" must be Array[String] type'
    );
    return reduxMiddleware;
  }

  const SHARED_WORDER_ID = `${Date.now()}`;
  const worker = new SharedWorker(
    `data:application/javascript,${encodeURIComponent(customWorker)}`,
    "REDUX_SHAREDWORKER"
  );

  return createSharedWorker({
    worker,
    SHARED_WORDER_ID,
    targetActions: targetActions.filter((action) => typeof action === "string"),
  });
};

export default createSharedWorkerMiddleware;
