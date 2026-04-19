import { Arguments } from 'typebox/system'
import Value from 'typebox/value'
import Type from 'typebox'

// ------------------------------------------------------------------
// Decode
// ------------------------------------------------------------------
export function Decode<Context extends Type.TProperties, Type extends Type.TSchema>(context: Context, type: Type, value: unknown): Type.StaticDecode<Type, Context>
export function Decode<Type extends Type.TSchema>(type: Type, value: unknown): Type.StaticDecode<Type, {}>
export function Decode(...args: unknown[]): unknown {
  const [context, type, value] = Arguments.Match<[Type.TProperties, Type.TSchema, unknown]>(args, {
    3: (context, type, value) => [context, type, value],
    2: (type, value) => [{}, type, value]
  })
  return Value.Pipeline(
    Value.Clone,
    Value.Default,
    Value.Convert,
    Value.Clean,
    Value.Parse,
    Value.Decode
  )(context, type, value)
}
// ------------------------------------------------------------------
// Encode
// ------------------------------------------------------------------
export function Encode<Context extends Type.TProperties, Type extends Type.TSchema>(context: Context, type: Type, value: unknown): Type.StaticEncode<Type, Context>
export function Encode<Type extends Type.TSchema>(type: Type, value: unknown): Type.StaticEncode<Type, {}>
export function Encode(...args: unknown[]): unknown {
  const [context, type, value] = Arguments.Match<[Type.TProperties, Type.TSchema, unknown]>(args, {
    3: (context, type, value) => [context, type, value],
    2: (type, value) => [{}, type, value]
  })
  return Value.Pipeline(
    Value.Clone,
    Value.Encode,
    Value.Default,
    Value.Convert,
    Value.Clean,
    Value.Parse
  )(context, type, value)
}
