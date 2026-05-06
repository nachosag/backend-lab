export function parseArgs() {
  const args = process.argv.slice(2)
  const username = args[0]

  if (!username) {
    throw Error('Username is required')
  }

  return username
}
