// A mock function to mimic making an async request for data
export function fetchCount(amount = 1) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (amount === 7) {
        return reject(`can't fetch ${amount}`);
      }
      resolve({ data: amount });
    }, 500)
  );
}
