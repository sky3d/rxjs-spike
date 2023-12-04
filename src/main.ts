import { runPipe } from './pipe'
import { runAbortableTasks } from './abortable'
import { print } from './utils'


export async function main(): Promise<any> {
  print('running')

  //runAbortableTasks()

  runPipe()
}
