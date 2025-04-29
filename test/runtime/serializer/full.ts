import { Serializer } from "@sinclair/typebox/serializer";
import { Assert } from "../assert";
import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { SerializerKind } from "src/serializer/types";

describe("serialize/full", () => {
  it("Should serialize", () => {
    const T = Type.String();
    Serializer.Full.Serialize(T);
  });

  it("Should deserialize", () => {
    const serialized = `{"serializerKind":${SerializerKind.String}}`;
    Serializer.Full.Deserialize(serialized);
  });
});
