import { Type } from "@sinclair/typebox";
import { ok, fail } from "./validate";

describe("Discriminated union", () => {
  it("Should validate union with only a single match", () => {
    const A = Type.Object({
      x: Type.Literal("x1"),
    });
    const B = Type.Object({
      x: Type.Literal("x2"),
      a: Type.String(),
    });
    const T = Type.DiscriminatedUnion([A, B], "x");
    ok(T, {
      x: "x1",
    });
    ok(T, {
      x: "x2",
      a: "string",
    });
  });

  it("Should not validate when union is not matched", () => {
    const A = Type.Object({
      x: Type.Literal("x1"),
    });
    const B = Type.Object({
      x: Type.Literal("x2"),
      a: Type.String(),
    });
    const T = Type.DiscriminatedUnion([A, B], "x");
    fail(T, {
      x: "x2",
    });
  });
});
