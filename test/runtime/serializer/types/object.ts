import { Serializer } from "@sinclair/typebox/serializer";
import { Assert } from "../../assert";
import { Type } from "@sinclair/typebox";

describe("serialize/full/object", () => {
  it("Should correctly serialize/deserialize object", async () => {
    const T = Type.Object({
      a: Type.String(),
      b: Type.String(),
      c: Type.Object({
        x: Type.String(),
        y: Type.String(),
      }),
    });
    const serialized = Serializer.Full.Serialize(T);
    const deserialized = Serializer.Full.Deserialize(serialized);
    Assert.IsEqual(T, deserialized);
  });
});
