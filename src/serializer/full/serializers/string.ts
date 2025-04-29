import { Type } from "../../../type";
import { CommonSchemaOptionsSchema } from "../types";
import { makeSerializer, SerializerKind } from "src/serializer/types";

export function serializerString() {
  const SerSchema = Type.Intersect([
    Type.Object({
      maxLength: Type.Optional(Type.Number()),
      minLength: Type.Optional(Type.Number()),
      pattern: Type.Optional(Type.String()),
      format: Type.Optional(Type.String()),
      contentEncoding: Type.Optional(Type.String()),
      contentMediaType: Type.Optional(Type.String()),
    }),
    CommonSchemaOptionsSchema,
  ]);

  return makeSerializer({
    schema: Type.String(),
    serializerKind: SerializerKind.String,
    serializationSchema: SerSchema,
    serialize(schema) {
      return {
        ...schema,
      };
    },
    deserialize(options) {
      return Type.String(options);
    },
  });
}
