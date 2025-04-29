import { Type } from "../../../type";
import { CommonSchemaOptionsSchema } from "../types";
import { makeSerializer, SerializerKind } from "src/serializer/types";

export function serializerAny() {
  const SerSchema = Type.Intersect([CommonSchemaOptionsSchema]);

  return makeSerializer({
    schema: Type.Any(),
    serializerKind: SerializerKind.Any,
    serializationSchema: SerSchema,
    serialize(schema) {
      return {
        ...schema,
      };
    },
    deserialize(options) {
      return Type.Any(options);
    },
  });
}
