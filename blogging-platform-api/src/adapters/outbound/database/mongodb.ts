import "dotenv/config"
import { MongoClient, ServerApiVersion } from "mongodb"

export class Connection {
  private uri: string
  private client: MongoClient | undefined
  private isConnected: boolean = false

  constructor () {
    if ( !process.env.MONGODB_URI ) {
      throw new Error( "MONGODB_URI is not defined" )
    }

    this.uri = process.env.MONGODB_URI
  }

  async connect () {
    if ( !this.client ) {
      this.client = new MongoClient( this.uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      } )
    }

    await this.client.connect()
    this.isConnected = true
    return this.client
  }

  async ping () {
    const client = await this.connect()
    await client.db().command( { ping: 1 } )
    console.log( 'Pinged your deployment. Successfully connected to MongoDB!' )
  }

  async closeConnection () {
    await this.client?.close()
    this.client = undefined
    this.isConnected = false
  }

  async getConnection () {
    if ( !this.isConnected ) {
      const client = await this.connect()
      return client.db()
    }
    return this.client!.db()
  }
}

const connection = new Connection()

async function checkConnection () {
  try {
    await connection.ping()
  } finally {
    await connection.closeConnection()
  }
}

checkConnection().catch( console.dir )
