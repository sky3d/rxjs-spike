import { BehaviorSubject, Observable, Subject, from, range } from 'rxjs'
import { filter, map, tap, takeUntil, takeWhile, concatMap } from 'rxjs/operators'
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


function filterUsers(observable: Observable<User>, types: string[], ) {
  
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

const updateUser = async(user: User): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      user.updatedAt = Date.now()
      resolve(user)
    }, 500)
  })
}

export const runPipe = () => {
  print('observers pipe')

  const users = initUsers(10)
  console.log(users)

  let res

  let observable = from(users)
  
  // observable = takeTopN(observable, 7)
  // console.log('[x] top 5', observable)

  // observable = cancelOn(observable, 7)
  // console.log('[x] canceling on 5')

  observable = filterUsers(observable, ['user'])
  console.log('[x] filtering')
  
  res = observable.subscribe({
    complete: () => {
      console.log('complete')
    }
  })
}  
