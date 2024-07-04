export type FlatPromise<T> = [promise: Promise<T>, resolve: (value: T) => void, reject: (reason: any) => void]

export function resolvePromise<T = void>(): FlatPromise<T> {
  let resolve, reject
  // eslint-disable-next-line promise/param-names
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return [promise, resolve as any, reject as any]
}
