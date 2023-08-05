import { Errors } from '@sinclair/typebox/errors'
import { TSchema } from '@sinclair/typebox'

/** Resolves errors */
export function Resolve<T extends TSchema>(schema: T, value: unknown) {
  return [...Errors(schema, value)]
}
