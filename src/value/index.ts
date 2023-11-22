/*--------------------------------------------------------------------------

@sinclair/typebox/value

The MIT License (MIT)

Copyright (c) 2017-2023 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

// ------------------------------------------------------------------
// Value Errors (re-export)
// ------------------------------------------------------------------
export { ValueError, ValueErrorType, ValueErrorIterator } from '../errors/index'
// ------------------------------------------------------------------
// Value Operators
// ------------------------------------------------------------------
export { Cast, ValueCastArrayUniqueItemsTypeError, ValueCastNeverTypeError, ValueCastRecursiveTypeError, ValueCastUnknownTypeError } from './cast/index'
export { Check } from './check/index'
export { Clean } from './clean/index'
export { Clone } from './clone/index'
export { Convert, ValueConvertUnknownTypeError } from './convert/index'
export { Create, ValueCreateIntersectTypeError, ValueCreateNeverTypeError, ValueCreateNotTypeError, ValueCreateRecursiveInstantiationError, ValueCreateTempateLiteralTypeError, ValueCreateUnknownTypeError } from './create/index'
export { Default } from './default/index'
export { Diff, Patch, Edit, Delete, Insert, Update, ValueDeltaObjectWithSymbolKeyError, ValueDeltaUnableToDiffUnknownValue } from './delta/index'
export { Equal } from './equal/index'
export { Hash, ValueHashError } from './hash/index'
export { Mutate, type Mutable, ValueMutateInvalidRootMutationError, ValueMutateTypeMismatchError } from './mutate/index'
export { ValuePointer } from './pointer/index'
export { TransformDecode as DecodeTransform, TransformEncode as EncodeTransform, HasTransform, TransformDecodeCheckError, TransformDecodeError, TransformEncodeCheckError, TransformEncodeError } from './transform/index'
// ------------------------------------------------------------------
// Value Guards
// ------------------------------------------------------------------
export {
  ArrayType,
  HasPropertyKey,
  IsArray,
  IsAsyncIterator,
  IsBigInt,
  IsBoolean,
  IsDate,
  IsFunction,
  IsInteger,
  IsIterator,
  IsNull,
  IsNumber,
  IsObject,
  IsPlainObject,
  IsPromise,
  IsString,
  IsSymbol,
  IsTypedArray,
  IsUint8Array,
  IsUndefined,
  IsValueType,
  ObjectType,
  TypedArrayType,
  ValueType,
} from './guard/index'
// ------------------------------------------------------------------
// Value Namespace
// ------------------------------------------------------------------
export { Value } from './value/index'
