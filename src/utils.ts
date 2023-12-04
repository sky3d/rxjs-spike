export const print = (s: string, ...args: any[]) =>
  console.log(`${Math.round(Date.now() / 1000)}: ${s}`, ...args)

export const random = (arr: Array<any>) => arr[Math.floor(Math.random() * arr.length)]
