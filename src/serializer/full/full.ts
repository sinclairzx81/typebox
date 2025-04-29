import { CompiledSerializedFullSchema } from "./types";
import type { TKind, TSchema } from "src/type/schema";
import { Kind } from "../../type/symbols/index";
import type { makeSerializer, SerializerKind } from "../types";
import { serializerString } from "./serializers/string";
import { serializerAny } from "./serializers/any";
import { serializerObject } from "./serializers/object";

type Serializer = ReturnType<typeof makeSerializer<TSchema, TSchema>>;

const kindToSerializer = new Map<SerializerKind, Serializer>();
const typepoxKindToSerializer = new Map<TKind[typeof Kind], Serializer>();

const register = (s: Serializer) => {
  kindToSerializer.set(s.serializerKind, s);
  typepoxKindToSerializer.set(s.schemaKind, s);
};

register(serializerString() as any);
register(serializerAny() as any);
register(serializerObject() as any);

export function Serialize<T extends TSchema>(schema: T): string {
  const serializer = typepoxKindToSerializer.get(schema[Kind]);

  if (!serializer) {
    throw new Error(`No serializer found for ${schema[Kind]}`);
  }

  return serializer.serialize(schema);
}

export function Deserialize<T extends TSchema>(serialized: string): T {
  const parsed = JSON.parse(serialized);
  const decoded = CompiledSerializedFullSchema.Decode(parsed);
  const serializer = kindToSerializer.get(decoded.serializerKind);

  if (!serializer) {
    throw new Error(`No serializer found for ${decoded.serializerKind}`);
  }

  return serializer.deserialize(parsed) as T;
}
