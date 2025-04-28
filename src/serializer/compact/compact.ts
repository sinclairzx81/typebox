import { CompiledSerializedCompactSchema, type KindCompact, type SerializerCompact } from "./types";
import type { TKind, TSchema } from "src/type/schema";
import { Kind } from "../../type/symbols/index";

export const compactKindToSerializer = new Map<
  KindCompact,
  SerializerCompact<any, any>
>();

export const typepoxKindToSerializer = new Map<
  TKind[typeof Kind],
  SerializerCompact<any, any>
>();

import "./serializers/any";

export function Serialize<T extends TSchema>(schema: T): string | undefined {
  const serializer = typepoxKindToSerializer.get(schema[Kind]);

  if (!serializer) {
    console.warn(`No serializer found for ${schema[Kind]}`);
    return undefined;
  }

  return JSON.stringify(serializer.serialize(schema));
}

export function Deserialize<T extends TSchema>(schema: string): T | undefined {
  const parsed = JSON.parse(schema);
  const serialized = CompiledSerializedCompactSchema.Decode(parsed);
  const serializer = compactKindToSerializer.get(serialized.compactKind);

  if (!serializer) {
    console.warn(`No serializer found for ${serialized.compactKind} (deserialize)`);
    return undefined;
  }

  const deserialized = serializer.deserialize(parsed);
  return deserialized;
}
