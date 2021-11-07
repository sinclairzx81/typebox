import { Type, Static } from "@sinclair/typebox";

// -------------------------------------------------

const T0 = Type.DiscriminatedUnion(
  [
    Type.Object({
      a: Type.String(),
      b: Type.Literal("discriminatorA"),
    }),
    Type.Object({
      a: Type.String(),
      b: Type.Literal("discriminatorB"),
      c: Type.String(),
    }),
  ],
  "b"
);

const F0 = (arg: Static<typeof T0>) => {};
F0({
  a: "string",
  b: "discriminatorA",
});
F0({
  a: "string",
  b: "discriminatorB",
  c: "string",
});

// // -------------------------------------------------

const T1 = Type.DiscriminatedUnion(
  [
    Type.Object({
      a: Type.String(),
      b: Type.Literal("discriminatorA"),
    }),
    Type.Object({
      a: Type.String(),
      b: Type.Literal("discriminatorB"),
      c: Type.String(),
    }),
  ],
  // @ts-expect-error
  "c"
);
