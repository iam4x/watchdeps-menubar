// // from https://github.com/erikras/react-redux-universal-hot-example/blob/master/src%2Fredux%2FclientMiddleware.js
export default function clientMiddleware() {
  return () => {
    return (next) => (action) => {
      const { promise, types, ... rest } = action;
      if (!promise) return next(action);

      const [ REQUEST, SUCCESS, FAILURE ] = types;
      next({ ...rest, type: REQUEST });
      return promise().then(
        (result) => next({ ...rest, result, type: SUCCESS }),
        (error) => next({ ...rest, error, type: FAILURE })
      );
    };
  };
}
