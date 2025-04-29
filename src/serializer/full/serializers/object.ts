import { TSchema, Type } from "../../../type";
import { Deserialize, Serialize } from "../full";
import { CommonSchemaOptionsSchema } from "../types";
import { makeSerializer, SerializerKind } from "src/serializer/types";

export function serializerObject() {
  const SerSchema = Type.Intersect([
    Type.Object({
      /**
       * The values are recursively serialized schemas
       */
      properties: Type.Record(Type.String(), Type.String()),
      required: Type.Array(Type.String()),
    }),
    CommonSchemaOptionsSchema,
  ]);

  return makeSerializer({
    schema: Type.Object({} as any),
    serializerKind: SerializerKind.Object,
    serializationSchema: SerSchema,
    serialize(schema) {
      const required = schema.required || [];
      const properties = Object.entries(schema.properties || {})
        .map(([k, v]) => [k, Serialize(v as TSchema)])
        .reduce((acc, [k, v]) => {
          acc[k] = v;
          return acc;
        }, {} as Record<string, string>);

      return {
        ...schema,
        required,
        properties,
      };
    },
    deserialize(options) {
      return Type.Object(
        Object.entries(options.properties || {})
          .map(([k, v]) => {
            return [
              k,
              options.required.some((v) => k === v)
                ? Deserialize(v)
                : Type.Optional(Deserialize(v)),
            ];
          })
          .reduce((acc, [k, v]) => {
            acc[k as string] = v as TSchema;
            return acc;
          }, {} as Record<string, TSchema>),
        options
      );
    },
  });
}