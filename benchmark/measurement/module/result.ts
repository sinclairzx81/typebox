export type Result = {
  type: string
  ajv: {
    iterations: number
    completed: number
  }
  compiler: {
    iterations: number
    completed: number
  }
  value?: {
    iterations: number
    completed: number
  }
}
