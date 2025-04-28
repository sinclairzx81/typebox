import { Serializer } from "@sinclair/typebox/serializer";
import { Assert } from "../assert";
import { Type } from "@sinclair/typebox";

describe("serialize/jsonschema", () => {
  it("Should run serializer", () => {
    const T = Type.Array(Type.String());
    const serialized = Serializer.JSONSchema.Serialize(T);
  });
});
