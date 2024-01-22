import { runPipe } from './pipe'
import { run } from './concat'
import { runAbortableTasks } from './abortable'
import { print } from './utils'


export async function main(): Promise<any> {
  print('running')

  //runAbortableTasks()

  // runPipe()
  run()

  print('DONE!')
}
