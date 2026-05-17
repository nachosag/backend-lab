export class PostNotFound extends Error {
  public readonly id: string
  public readonly name: string

  constructor ( id: string ) {
    super( `Post with id ${ id } was not found` )
    this.id = id
    this.name = 'PostNotFound'
  }
}
