
const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time))

async function main() {

  console.log('Start')
  await delay(1000)
}

main()
  .then(() => {
    console.log('Done!')
  })
  .catch((e) => console.error(e))
