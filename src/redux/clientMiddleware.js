import defer from 'lodash/function/defer';

export default function clientMiddleware() {
  return () => {
    return (next) => (action) => {
      const { promise, types, ...rest } = action;
      if (!promise) return next(action);

      const [ REQUEST, SUCCESS, FAILURE ] = types;
      next({ ...rest, type: REQUEST });
      return defer(() => promise().then(
        (result) => next({ ...rest, result, type: SUCCESS }),
        (error) => next({ ...rest, error, type: FAILURE })
      ));
    };
  };
}
