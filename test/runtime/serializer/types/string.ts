import { Serializer } from "@sinclair/typebox/serializer";
import { Assert } from "../../assert";
import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { SerializerKind } from "src/serializer/types";

describe("serialize/full/string", () => {
  it("Should serialize string", () => {
    const T = Type.String();
    const serialized = Serializer.Full.Serialize(T);
    Assert.IsEqual(serialized, `{"serializerKind":${SerializerKind.String}}`);
  });

  it("Should deserialize string", () => {
    const serialized = `{"serializerKind":${SerializerKind.String}}`;
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
