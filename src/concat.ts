import * as Bluebird from 'bluebird'
import {concat, from, of } from 'rxjs'
import { concatAll, delay, concatMap, map, mergeMap, scan, tap } from 'rxjs/operators'

const doAsyncTask = async (id: number): Promise<Response | string> => {
  await Bluebird.delay(id * 10)

  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
  const data = await response.json()
  
  return data
}
 
export const run = async () => {
  const source = [
    10, 20, 30
  ]

  const list = from(source)
  .pipe(
    tap((id) => console.log(id)),
    concatMap((id) => doAsyncTask(id)),
    //tap((r) => console.log('_item_', r)),
  )

  const lastTask1 =of(1)
  .pipe(
    tap((id) => console.log(id)),
    map((id) => doAsyncTask(id))
  ).toPromise()

  const obs = concat(list, lastTask1)

  obs.subscribe(
    val => console.log(`next: ${JSON.stringify(val)}`),
    val => console.log(`err: ${val}`),
    () => console.log('complete!')
  )
}
