export function promisify(callbackStyleFn) {
  return (...args) =>
      new Promise((resolve, reject) =>
        callbackStyleFn(...args, (err, results) =>
          err ? reject(err) : resolve(results)));
}
