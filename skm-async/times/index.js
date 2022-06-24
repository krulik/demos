let number = 0;

console.log(1);

setTimeout(() => {
  console.log(2);
}, 0);

console.log(3);

setTimeout(() => {
  console.log(4);
  console.log(5);
  console.log(number);
}, 0);

for (let i = 0; i < 100000000; i++) {
  number++;
}