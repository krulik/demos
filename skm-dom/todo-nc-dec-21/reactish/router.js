export let router = {
  hashchange,
  hash
};

function hashchange(callback) {
  window.addEventListener('hashchange', (e) => {
    let from = getHash(e.oldURL);
    let to = getHash(e.newURL);
    if (from === to) {
      console.log('skipping hashchange');
      return;
    }
    callback(e, {from, to});
  });
}

function hash(...args) {
  if (args.length === 0) {
    return getHash(document.location);
  }
  document.location.hash = args[0];
}

function getHash(url) {
  return String(url).split('#')[1];
}