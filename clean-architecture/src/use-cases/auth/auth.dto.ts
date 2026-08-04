export interface RegisterInput {
  email: string
  password: string
  name: string
  phone?: string
}
export interface RegisterOutput {
  token: string
  userId: string
  customerId: string
}
export interface LoginInput {
  email: string
  password: string
}
export interface LoginOutput {
  token: string
  userId: string
}
