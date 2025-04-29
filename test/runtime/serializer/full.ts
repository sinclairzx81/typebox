import { Serializer } from "@sinclair/typebox/serializer";
import { Assert } from "../assert";
import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

describe("serialize/full", () => {
  it("Should serialize", () => {
    const T = Type.String();
    const serialized = Serializer.Full.Serialize(T);
    Assert.IsEqual(serialized, '{"serializerKind":2}');
  });

  it("Should deserialize", () => {
    const serialized = '{"serializerKind":2}';
    const deserialized = Serializer.Full.Deserialize(serialized);

    const testSchema = Type.Object({
      aString: deserialized,
    });
    const passes = Value.Check(testSchema, {
      aString: "somestring",
    });
    Assert.IsEqual(passes, true);
  });
});
