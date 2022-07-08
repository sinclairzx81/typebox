export type Result = {
  type: string
  ajv: {
    iterations: number
    completed: number
  }
  typebox: {
    iterations: number
    completed: number
  }
}
