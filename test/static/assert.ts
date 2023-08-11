import { Static, StaticDecode, StaticEncode, TSchema } from '@sinclair/typebox'

export function Expect<T extends TSchema>(schema: T) {
  return {
    ToStatic: <U extends Static<T>>() => {},
    ToStaticDecode: <U extends StaticDecode<T>>() => {},
    ToStaticEncode: <U extends StaticEncode<T>>() => {},
  }
}
