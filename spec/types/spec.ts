import { TSchema, Static } from './typebox'

export const infer = <T extends TSchema>(_: T): Static<T> => null as any as Static<T>

export * from 'tsd'



