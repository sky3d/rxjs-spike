import { BehaviorSubject, Observable, Subject, from, range } from 'rxjs'
import { filter, map, tap, takeUntil } from 'rxjs/operators'
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
}

const initUsers = (n: number) => times(n, (index) => ({
  id: index + 1,
  name: faker.internet.userName(),
  role: random(usersRoles)
}))


function filterUsers(observable: Observable<User>, types: string[], ) {
  
  const cancelWithLimit = new Subject<void>();

  return observable
  .pipe(
    takeUntil(cancelWithLimit),
    tap((x) => {
      if (x.id > 5) {
        cancelWithLimit.next(undefined)
      }
    }),
    filter((x) => x.role === 'user'),
    tap(console.log)
  )
}


export const runPipe = () => {
  print('observers pipe')

  const users = initUsers(10)
  console.log(users)

  let res

  const observable = from(users)
  
  
  const filtered = filterUsers(observable, ['user'])
  console.log('[x] filtering')
  
  res = filtered.subscribe({
    complete: () => {
      console.log('complete')
    }
  })
}  
