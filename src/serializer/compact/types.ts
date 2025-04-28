import { TypeCompiler } from "@sinclair/typebox/compiler";
import {
  type Kind,
  type Static,
  type TSchema,
  Type,
} from "@sinclair/typebox/type";

export enum KindCompactE {
  Any = 0,
  Unknown = 1,
  String = 2,
  Number = 3,
  Integer = 4,
  Boolean = 5,
  Null = 6,
  Literal = 7,
  Array = 8,
  Object = 9,
  Tuple = 10,
  Enum = 11,
  Const = 12,
  KeyOf = 13,
  Union = 14,
  Intersect = 15,
  Composite = 16,
  Never = 17,
  Not = 18,
  Extends = 19,
  Extract = 20,
  Exclude = 21,
  Mapped = 22,
  TemplateLiteral = 23,
  Record = 24,
  Partial = 25,
  Required = 26,
  Pick = 27,
  Omit = 28,
  Index = 29,
  Uncapitalize = 31,
  Capitalize = 32,
  Uppercase = 33,
  Lowercase = 34,
  Ref = 35,
}

export const KindCompactSchema = Type.Enum(KindCompactE);
export type KindCompact = Static<typeof KindCompactSchema>;

export const SerializedCompactSchema = 
Type.Transform(
  Type.Object(
    {
      k: KindCompactSchema,
    },
    { additionalProperties: true }
  )
)
  .Decode((value) => ({ compactKind: value.k }))
  .Encode((value) => ({ k: value.compactKind }));
export type SerializedCompact = Static<typeof SerializedCompactSchema>;
export const CompiledSerializedCompactSchema = TypeCompiler.Compile(
  SerializedCompactSchema
);

export const CommonSchemaOptionsSchema = Type.Transform(
  Type.Object({
    $id: Type.Optional(Type.String()),
    t: Type.Optional(Type.String()),
    desc: Type.Optional(Type.String()),
    def: Type.Optional(Type.Any()),
    ex: Type.Optional(Type.Any()),
    rO: Type.Optional(Type.Boolean()),
    wO: Type.Optional(Type.Boolean()),
  })
)
  .Decode((value) => ({
    $id: value.$id,
    title: value.t,
    description: value.desc,
    default: value.def,
    examples: value.ex,
    readOnly: value.rO,
    writeOnly: value.wO,
  }))
  .Encode((value) => ({
    $id: value.$id,
    t: value.title,
    desc: value.description,
    def: value.default,
    ex: value.examples,
    rO: value.readOnly,
    wO: value.writeOnly,
  }));

export interface SerializerCompact<
  T extends TSchema,
  Serialized extends SerializedCompact
> {
  kindCompact: KindCompact;
  kind: T[typeof Kind];
  serialize: (schema: T) => Serialized;
  deserialize: (val: Serialized) => T;
}
