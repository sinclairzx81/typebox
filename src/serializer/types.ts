import { TypeCompiler } from "src/compiler/compiler";
import { Kind, type Static, type TSchema, Type } from "../type";
import { Value } from "../value";

export enum SerializerKind {
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
export const SerializerKindSchema = Type.Enum(SerializerKind);

export function makeSerializer<
  Schema extends TSchema,
  SerializationSchema extends TSchema
>({
  serializerKind,
  deserialize,
  schema,
  serializationSchema,
  serialize,
}: {
  serializerKind: SerializerKind;
  schema: Schema;
  serializationSchema: SerializationSchema;
  serialize: (schema: Schema) => Static<SerializationSchema>;
  deserialize: (val: Static<SerializationSchema>) => Schema;
}) {
  const serializationSchemaCompiled = TypeCompiler.Compile(serializationSchema);
  const serializeInternal = (p: Static<Schema>) => {
    const serializationObject = serialize(p as any);
    const cleaned = Value.Clean(
      serializationSchema,
      serializationObject
    ) as object;
    const encoded = serializationSchemaCompiled.Encode({
      ...cleaned,
      serializerKind,
    });
    return JSON.stringify(encoded);
  };

  const deserializeInternal = (serialized: object) => {
    const parsed = serializationSchemaCompiled.Decode(serialized);
    return deserialize(parsed as any);
  };

  return {
    serializerKind,
    schemaKind: schema[Kind],
    serializationSchema,
    serializationSchemaCompiled,
    serialize: serializeInternal,
    deserialize: deserializeInternal,
  };
}
