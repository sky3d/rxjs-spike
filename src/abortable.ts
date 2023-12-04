import { AbortController, AbortSignal } from 'node-abort-controller'
import { print } from './utils'

const kAbortError = new Error('Abort')

const TASK_TIME = 10_000
const ABORT_TIME = 5_000

function cancelTask(controller: AbortController, time: number) {
  setTimeout(() => {
    print('===> throw abort')
    controller.abort()
  }, time)
}

function runTask(time: number, signal: AbortSignal): Promise<void | Error> {
  return new Promise((resolve, reject) => {
    print('processing')

    signal.addEventListener('abort', () => {
      print('on abort:', signal.aborted)
      clearTimeout(timeoutId)
      reject(kAbortError)
    })

    const timeoutId = setTimeout(resolve, time)

    if (signal.aborted) {
      clearTimeout(timeoutId)
    }
  })
}

export async function runAbortableTasks() {
  const controller = new AbortController()
  const { signal } = controller
  print('--->start')
  runTask(TASK_TIME, signal)
    .then(() => {
      print('<--finish')
    })
    .catch((err) => {
      print('catch error: ' + err?.message)
    })

  // simulate interrupt
  const delay = 10_000
  cancelTask(controller, ABORT_TIME + delay)


}
