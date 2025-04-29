import { Serializer } from "@sinclair/typebox/serializer";
import { Assert } from "../../assert";
import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { SerializerKind } from "src/serializer/types";

describe("serialize/full/any", () => {
  it("Should serialize any", () => {
    const T = Type.Any();
    const serialized = Serializer.Full.Serialize(T);
    Assert.IsEqual(serialized, `{"serializerKind":${SerializerKind.Any}}`);
  });

  it("Should deserialize any", () => {
    const serialized = `{"serializerKind":${SerializerKind.Any}}`;
    const deserialized = Serializer.Full.Deserialize(serialized);

    const testSchema = Type.Object({
      aany: deserialized,
    });
    const passes = Value.Check(testSchema, {
      aany: "any",
    });
    Assert.IsEqual(passes, true);
  });
});
