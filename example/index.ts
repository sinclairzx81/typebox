import Value from 'typebox/value'
import Type from 'typebox'

function Decode<Type extends Type.TSchema>(type: Type, value: unknown): Type.StaticDecode<Type> {
  return Value.Pipeline(
    Value.Clone,
    Value.Convert,
    Value.Clean,
    Value.Assert
  )(type, value)
}
function Encode<Type extends Type.TSchema>(type: Type, value: unknown): Type.StaticEncode<Type> { 
  return Value.Pipeline(
    Value.Clone,
    Value.Encode, 
    Value.Convert, 
    Value.Clean,
    Value.Assert,
  )(type, value)
}

  

