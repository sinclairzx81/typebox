import { TypeCompiler } from "src/compiler/compiler";
import { Kind, type Static, Type, type TString } from "../../../type";
import {
  CommonSchemaOptionsSchema,
  KindCompactE,
  SerializedCompactSchema,
  type SerializerCompact,
} from "../types";
import { compactKindToSerializer, typepoxKindToSerializer } from "../compact";

export const SerSchema = Type.Composite([
  Type.Transform(
    Type.Object({
      ml: Type.Optional(Type.Number()),
      mn: Type.Optional(Type.Number()),
      p: Type.Optional(Type.String()),
      f: Type.Optional(Type.String()),
      ce: Type.Optional(Type.String()),
      cm: Type.Optional(Type.String()),
    })
  )
    .Decode((value) => ({
      maxLength: value.ml,
      minLength: value.mn,
      pattern: value.p,
      format: value.f,
      contentEncoding: value.ce,
      contentMediaType: value.cm,
    }))
    .Encode((value) => ({
      ml: value.maxLength,
      mn: value.minLength,
      p: value.pattern,
      f: value.format,
      ce: value.contentEncoding,
      cm: value.contentMediaType,
    })),
  SerializedCompactSchema,
  CommonSchemaOptionsSchema,
]);
type Ser = Static<typeof SerSchema>;
const CompiledSer = TypeCompiler.Compile(SerSchema);

export const StringCompact: SerializerCompact<TString, Ser> = {
  serialize: (v) => ({ k: KindCompactE.String }),
  deserialize: (s) => {
    const parsed = CompiledSer.Decode(s);
    return Type.String(parsed);
  },
  kindCompact: KindCompactE.String,
  kind: Type.String({})[Kind],
};

compactKindToSerializer.set(StringCompact.kindCompact, StringCompact);
typepoxKindToSerializer.set(StringCompact.kind, StringCompact);
