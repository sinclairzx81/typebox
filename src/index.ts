/*--------------------------------------------------------------------------

@sinclair/typebox

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
// Infrastructure
// ------------------------------------------------------------------
export { Kind, Hint, ReadonlyKind, OptionalKind, TransformKind } from './type/symbols/index'
export { PatternBoolean, PatternBooleanExact, PatternNumber, PatternNumberExact, PatternString, PatternStringExact } from './type/patterns/index'
export { TypeRegistry, FormatRegistry } from './type/registry/index'
export { TypeGuard, ValueGuard } from './type/guard/index'
export { CloneType, CloneRest } from './type/clone/type'
export { TypeBoxError } from './type/error/index'
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
export { Any, type TAny } from './type/any/index'
export { Array, type TArray, type ArrayOptions } from './type/array/index'
export { AsyncIterator, type TAsyncIterator } from './type/async-iterator/index'
export { Awaited, type TAwaited } from './type/awaited/index'
export { BigInt, type TBigInt, type BigIntOptions } from './type/bigint/index'
export { Boolean, type TBoolean } from './type/boolean/index'
export { Composite, type TComposite } from './type/composite/index'
export { Const, type TConst } from './type/const/index'
export { Constructor, type TConstructor } from './type/constructor/index'
export { ConstructorParameters, type TConstructorParameters } from './type/constructor-parameters/index'
export { Date, type TDate, type DateOptions } from './type/date/index'
export { Deref, type TDeref } from './type/deref/index'
export { Enum, type TEnum } from './type/enum/index'
export { Exclude, type TExclude, type TExcludeFromMappedResult } from './type/exclude/index'
export { Extends, type TExtends, type ExtendsFromMappedResult, type ExtendsFromMappedKey, ExtendsCheck, ExtendsResult, ExtendsUndefinedCheck } from './type/extends/index'
export { Extract, type TExtract, type TExtractFromMappedResult } from './type/extract/index'
export { Function, type TFunction } from './type/function/index'
export { Increment, type Assert, type AssertType, type AssertRest, type AssertProperties, type Ensure, type Evaluate, type TupleToIntersect, type TupleToUnion, type UnionToTuple } from './type/helpers/index'
export { Index, IndexPropertyKeys, IndexFromMappedKey, IndexFromMappedResult, type TIndex, type TIndexPropertyKeys, type TIndexFromMappedKey, type TIndexFromMappedResult } from './type/indexed/index'
export { InstanceType, type TInstanceType } from './type/instance-type/index'
export { Integer, type TInteger, type IntegerOptions } from './type/integer/index'
export { Intersect, IntersectEvaluated, type TIntersect, type TIntersectEvaluated, type IntersectOptions } from './type/intersect/index'
export { Iterator, type TIterator } from './type/iterator/index'
export { Intrinsic, IntrinsicFromMappedKey, type TIntrinsic, Capitalize, type TCapitalize, Lowercase, type TLowercase, Uncapitalize, type TUncapitalize, Uppercase, type TUppercase } from './type/intrinsic/index'
export { KeyOf, type TKeyOf, type KeyOfFromMappedResult, KeyOfPropertyKeys, KeyOfPattern } from './type/keyof/index'
export { Literal, type TLiteral, type TLiteralValue } from './type/literal/index'
export { Mapped, MappedKey, MappedResult, type TMapped, type TMappedKey, type TMappedResult, type TMappedFunction } from './type/mapped/index'
export { Never, type TNever } from './type/never/index'
export { Not, type TNot } from './type/not/index'
export { Null, type TNull } from './type/null/index'
export { Number, type TNumber, type NumberOptions } from './type/number/index'
export { Object, type TObject, type TProperties, type ObjectOptions } from './type/object/index'
export { Omit, type TOmit, type TOmitFromMappedKey, type TOmitFromMappedResult } from './type/omit/index'
export { Optional, OptionalFromMappedResult, type TOptional, type TOptionalWithFlag, type TOptionalFromMappedResult } from './type/optional/index'
export { Parameters, type TParameters } from './type/parameters/index'
export { Partial, PartialFromMappedResult, type TPartial, type TPartialFromMappedResult } from './type/partial/index'
export { Pick, type TPick, type TPickFromMappedKey, type TPickFromMappedResult } from './type/pick/index'
export { Promise, type TPromise } from './type/promise/index'
export { Readonly, ReadonlyFromMappedResult, type TReadonly, type TReadonlyWithFlag, type TReadonlyFromMappedResult } from './type/readonly/index'
export { ReadonlyOptional, type TReadonlyOptional } from './type/readonly-optional/index'
export { Record, type TRecord } from './type/record/index'
export { Recursive, type TRecursive, type TThis } from './type/recursive/index'
export { Ref, type TRef } from './type/ref/index'
export { RegExp, type TRegExp } from './type/regexp/index'
export { Required, type TRequired, type TRequiredFromMappedResult } from './type/required/index'
export { Rest, type TRest } from './type/rest/index'
export { ReturnType, type TReturnType } from './type/return-type/index'
export { type TSchema, type TKind, type SchemaOptions, type TAnySchema } from './type/schema/index'
export { type Static, type StaticDecode, type StaticEncode } from './type/static/index'
export { Strict } from './type/strict/index'
export { String, type TString, type StringOptions, type StringFormatOption, type StringContentEncodingOption } from './type/string/index'
export { Symbol, type TSymbol, type TSymbolValue as SymbolValue } from './type/symbol/index'
export {
  TemplateLiteral,
  IsTemplateLiteralFinite,
  IsTemplateLiteralExpressionFinite,
  TemplateLiteralParse,
  TemplateLiteralParseExact,
  TemplateLiteralGenerate,
  TemplateLiteralExpressionGenerate,
  type TTemplateLiteral,
  type TIsTemplateLiteralFinite,
  type TTemplateLiteralGenerate,
  type TTemplateLiteralKind,
} from './type/template-literal/index'
export { Transform, TransformDecodeBuilder, TransformEncodeBuilder, type TTransform, type TransformOptions, type TransformFunction } from './type/transform/index'
export { Tuple, type TTuple } from './type/tuple/index'
export { Uint8Array, type TUint8Array, type Uint8ArrayOptions } from './type/uint8array/index'
export { Undefined, type TUndefined } from './type/undefined/index'
export { Union, UnionEvaluated, type TUnion, type TUnionEvaluated } from './type/union/index'
export { Unknown, type TUnknown } from './type/unknown/index'
export { Unsafe, type TUnsafe } from './type/unsafe/index'
export { Void, type TVoid } from './type/void/index'
// ------------------------------------------------------------------
// Namespace
// ------------------------------------------------------------------
export { Type, JsonTypeBuilder, JavaScriptTypeBuilder } from './type/type/index'
