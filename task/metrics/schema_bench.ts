import * as Type from "typebox";
import * as Schema from "typebox/schema";

const Timestamp = Type.Refine(Type.Unsafe<Date>({}), (value) => value instanceof Date);
const Image = Type.Object({
  id: Type.Number(),
  created: Timestamp,
  title: Type.String({ minLength: 1, maxLength: 100 }),
  type: Type.Enum(["jpg", "png"]),
  size: Type.Number(),
  url: Type.String({ format: "url" }),
});
const Rating = Type.Object({
  id: Type.Number(),
  stars: Type.Number({ minimum: 1, maximum: 5 }),
  title: Type.String({ minLength: 1, maxLength: 100 }),
  text: Type.String({ minLength: 1, maxLength: 1000 }),
  images: Type.Array(Image),
});
const Product = Type.Object({
  id: Type.Number(),
  created: Timestamp,
  title: Type.String({ minLength: 1, maxLength: 100 }),
  brand: Type.String({ minLength: 1, maxLength: 30 }),
  description: Type.String({ minLength: 1, maxLength: 500 }),
  price: Type.Number({ minimum: 1, maximum: 10000 }),
  discount: Type.Union([Type.Number({ minimum: 1, maximum: 100 }), Type.Null()]),
  quantity: Type.Number({ minimum: 1, maximum: 10 }),
  tags: Type.Array(Type.String({ minLength: 1, maxLength: 30 })),
  images: Type.Array(Image),
  ratings: Type.Array(Rating),
});

Schema.Parse(Product, {});