function math(fn, a, b, callback) {
  let fetchPromise = fetch(`http://localhost:3000/math/${fn}?a=${a}&b=${b}`);
  fetchPromise
    .then((response) => response.json())
    .then((jsonResponse) => {
      /*
        jsonResponse: {res: 42}
      */
      let res = jsonResponse.res;
      console.log(`${a} ${fn} ${b} = ${res}`);

      if (typeof res === 'string') {
        throw Error(res);
      }

      callback(res);
    });
}

math('add', 2, 2, (res) => {
  math('multiply', res, 10, (res) => {
    math('divide', res, 0, (res) => {
      math('subtract', res, 10, (res) => {
        console.log('done');
      });
    });
  });
});