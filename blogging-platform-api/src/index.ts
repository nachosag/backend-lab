import { Connection } from './adapters/outbound/database/mongodb.js'
import { MongoDB } from './adapters/outbound/repositories/mongodb.js'

const connection = await new Connection().getConnection()
const repo = new MongoDB( connection )
await repo.init()

console.log( 'Hello World' )
