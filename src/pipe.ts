import * as Bluebird from 'bluebird'

import { BehaviorSubject, Observable, ObservedValueOf, Subject, concat, from, interval, range } from 'rxjs'
import { 
  filter, map, tap, takeUntil, takeWhile,  concatMap, finalize, ignoreElements, take
} from 'rxjs/operators'
import { times } from 'lodash'
import { faker } from '@faker-js/faker'

import { print, random } from './utils'

function observers() {
  range(1, 20)
    .pipe(
      filter(x => x % 2 === 1),
      map(x => x + x)
    )
    .subscribe(x => print('obs', x))

}

const usersRoles = ['admin', 'user', 'guest']
type User = { 
  id: number
  name: string
  role: string
  updatedAt: number
}

const initUsers = (n: number) => times(n, (index) => ({
  id: index + 1,
  name: faker.internet.userName(),
  role: random(usersRoles)
}))

const saveUsersTaks = async (): Promise<any> => {
  console.log('---SAVE Started--')
  await Bluebird.delay(2000)
  console.log('---SAVE DONE--')
  return { code: 200 }
}

const updateUser = async(user: User): Promise<User> => {
  await Bluebird.delay(500)
  user.updatedAt = Date.now()
  return user
}

const performTask = async(ts: number): Promise<number> => {
  await Bluebird.delay(ts)
  console.log(`.....task executed after ${ts} ms`)
  return Date.now()
}

function cancelOn(observable: Observable<User>, id: number) {
  const cancelWithLimit = new Subject<void>();

  return observable
  .pipe(
    takeUntil(cancelWithLimit),
    tap((x) => {
      if (x.id == id) {
        console.log('-->cancel', x)
        cancelWithLimit.next(undefined)
      }
    }),
    tap(console.log)
  )
}

function withIgnoreElements() {
    //emit value every 100ms
  const source = interval(100);
  //ignore everything but complete
  const example = source
    .pipe(
      take(5), 
      tap((x) => console.log(x)),
      // Do not call next(N) but 
      ignoreElements() 
      // Call complete
  );
  //output: "COMPLETE!"

/* 
  * Params: next, error, complete
  */
  const subscribe = example.subscribe(
    val => console.log(`NEXT: ${val}`),
    val => console.log(`ERROR: ${val}`),
    () => console.log('COMPLETE!')
  );
}

function filterUsers(observable: Observable<User>, types: string[]) {
  return observable
  .pipe(
    filter((x) => x.role === 'user'),
    concatMap(updateUser),
    tap(console.log)
  )
}

function takeTopN(observable: Observable<User>, num: number) {
  
  return observable
  .pipe(
    takeWhile((x) => x.id <= num),
    tap(console.log)
  )
}

function finalizeSample(observable: Observable<User>, types: string[], ) {
  return observable
  .pipe(
    filter((x) => x.role === 'user'),
    concatMap(updateUser),
    tap((x) => console.log(`user ${JSON.stringify(x)} updated!`)),
    ignoreElements(), // suppress NEXT calls
    finalize(async () => { 
        console.log(`executing...`, Date.now())
        const time = await performTask(2000); 
        console.log(`finalize ok!`, time)
     })
  )
}

function concatPipesSample(observables) {
  print('schedule tasks after updating users')

  const updateUsers = observables
    .pipe(
      concatMap(updateUser),
      tap((x) => console.log(`user ${JSON.stringify(x)} updated!`)),
      //ignoreElements(), // suppress NEXT calls
    )

  const pipe2 = saveUsersTaks()

  return concat(updateUsers, pipe2)
}


export const runPipe = () => {
  print('observers pipe')



  
  const users = initUsers(10)
  console.log(users)

  let res

  //withIgnoreElements()

  let observable = from(users)
  
  // observable = concatPipesSample(observable)
  // console.log('pipe with concat called')
  
  // observable = takeTopN(observable, 7)
  // console.log('[x] top 5', observable)

  // observable = cancelOn(observable, 7)
  // console.log('[x] canceling on 5')

  // observable = filterUsers(observable, ['user'])
  // console.log('[x] filtering')

  observable = finalizeSample(observable, ['user'])
  console.log('pipe with finalize called')

  res = observable.subscribe({
    complete: () => {
      console.log('[x] COMPLETE')
    },
    next: (x) => {
      console.log(`NEXT --> ${JSON.stringify(x)}`)
    },
    error: (err) => {
      console.log(`! ERROR: ${err}`)
    }
  })
}  
