import { AbortController, AbortSignal } from 'node-abort-controller'

const kAbortError = new Error('Abort')

const TASK_TIME = 3000
const ABORT_TIME = 1000

const print = (s: string, ...args: any[]) => console.log(`${Math.round(Date.now() / 1000)}: ${s}`, ...args)

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

async function main() {
  const controller = new AbortController()
  const { signal } = controller

  print('running')

  print('start-->')
  runTask(TASK_TIME, signal)
    .then(() => {
      print('<--end')
    })
    .catch((err) => {
      print('catch error:' + err?.message)
    })

  // simulate interrupt
  cancelTask(controller, ABORT_TIME)

  print('done')
}

main().catch((e) => console.error(e))
