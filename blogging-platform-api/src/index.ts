import { Connection } from './infrastructure/database/mongodb.js'
import { MongoDB } from './infrastructure/repositories/mongodb.js'

const connection = await new Connection().getConnection()
const repo = new MongoDB( connection )
await repo.init()

console.log( 'Hello World' )
