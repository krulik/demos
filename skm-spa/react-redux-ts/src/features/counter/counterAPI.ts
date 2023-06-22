// A mock function to mimic making an async request for data
export function fetchCount(amount = 1) {
  return new Promise<{ data: number }>((resolve, reject) => {
    setTimeout(() => {
      if (amount === 3) {
        return reject(`Can't fetch count ${amount}`)
      }
      resolve({ data: amount })
    }, 500)
  });
}
