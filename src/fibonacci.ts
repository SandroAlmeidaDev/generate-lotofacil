export function fibonacciUpTo25(): number[] {
  const fibonacciNumbers: number[] = [1, 2];
  let a = 1;
  let b = 2;

  while (fibonacciNumbers.length < 7) {
    const nextFibonacci = a + b;
    fibonacciNumbers.push(nextFibonacci);

    a = b;
    b = nextFibonacci;
  }

  return fibonacciNumbers;
}
