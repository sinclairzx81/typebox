import { TypeCompiler } from "@sinclair/typebox/compiler";
import { type Static, Type } from "@sinclair/typebox/type";
import { SerializerKindSchema } from "../types";

export const SerializedFullSchema = Type.Object({
  serializerKind: SerializerKindSchema,
});
export type SerializedFull = Static<typeof SerializedFullSchema>;
export const CompiledSerializedFullSchema =
  TypeCompiler.Compile(SerializedFullSchema);

export const CommonSchemaOptionsSchema = Type.Object({
  $id: Type.Optional(Type.String()),
  ttitle: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
  default: Type.Optional(Type.Any()),
  examples: Type.Optional(Type.Any()),
  readOnly: Type.Optional(Type.Boolean()),
  writeOnly: Type.Optional(Type.Boolean()),
});
