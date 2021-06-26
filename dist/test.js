// src/typebox.ts
var ReadonlyOptionalModifier = Symbol("ReadonlyOptionalModifier");
var OptionalModifier = Symbol("OptionalModifier");
var ReadonlyModifier = Symbol("ReadonlyModifier");
var KeyOfKind = Symbol("KeyOfKind");
var UnionKind = Symbol("UnionKind");
var TupleKind = Symbol("TupleKind");
var ObjectKind = Symbol("ObjectKind");
var DictKind = Symbol("DictKind");
var ArrayKind = Symbol("ArrayKind");
var EnumKind = Symbol("EnumKind");
var LiteralKind = Symbol("LiteralKind");
var StringKind = Symbol("StringKind");
var NumberKind = Symbol("NumberKind");
var IntegerKind = Symbol("IntegerKind");
var BooleanKind = Symbol("BooleanKind");
var NullKind = Symbol("NullKind");
var UnknownKind = Symbol("UnknownKind");
var AnyKind = Symbol("AnyKind");
var ConstructorKind = Symbol("ConstructorKind");
var FunctionKind = Symbol("FunctionKind");
var PromiseKind = Symbol("PromiseKind");
var UndefinedKind = Symbol("UndefinedKind");
var VoidKind = Symbol("VoidKind");
function isObject(object) {
  return typeof object === "object" && object !== null && !Array.isArray(object);
}
function isArray(object) {
  return typeof object === "object" && object !== null && Array.isArray(object);
}
function clone(object) {
  if (isObject(object))
    return Object.keys(object).reduce((acc, key) => ({...acc, [key]: clone(object[key])}), {});
  if (isArray(object))
    return object.map((item) => clone(item));
  return object;
}
function distinct(keys) {
  return Object.keys(keys.reduce((acc, key) => {
    return {...acc, [key]: null};
  }, {}));
}
var TypeBuilder = class {
  ReadonlyOptional(item) {
    return {...item, modifier: ReadonlyOptionalModifier};
  }
  Readonly(item) {
    return {...item, modifier: ReadonlyModifier};
  }
  Optional(item) {
    return {...item, modifier: OptionalModifier};
  }
  Tuple(items, options = {}) {
    const additionalItems = false;
    const minItems = items.length;
    const maxItems = items.length;
    return {...options, kind: TupleKind, type: "array", items, additionalItems, minItems, maxItems};
  }
  Object(properties, options = {}) {
    const property_names = Object.keys(properties);
    const optional = property_names.filter((name) => {
      const candidate = properties[name];
      return candidate.modifier && (candidate.modifier === OptionalModifier || candidate.modifier === ReadonlyOptionalModifier);
    });
    const required_names = property_names.filter((name) => !optional.includes(name));
    const required = required_names.length > 0 ? required_names : void 0;
    return required ? {...options, kind: ObjectKind, type: "object", properties, required} : {...options, kind: ObjectKind, type: "object", properties};
  }
  Intersect(items, options = {}) {
    const type = "object";
    const properties = items.reduce((acc, object) => ({...acc, ...object["properties"]}), {});
    const required = distinct(items.reduce((acc, object) => object["required"] ? [...acc, ...object["required"]] : acc, []));
    return required.length > 0 ? {...options, type, kind: ObjectKind, properties, required} : {...options, type, kind: ObjectKind, properties};
  }
  Union(items, options = {}) {
    return {...options, kind: UnionKind, anyOf: items};
  }
  Dict(item, options = {}) {
    const additionalProperties = item;
    return {...options, kind: DictKind, type: "object", additionalProperties};
  }
  Array(items, options = {}) {
    return {...options, kind: ArrayKind, type: "array", items};
  }
  Enum(item, options = {}) {
    const values = Object.keys(item).filter((key) => isNaN(key)).map((key) => item[key]);
    if (values.length === 0) {
      return {...options, kind: EnumKind, enum: values};
    }
    const type = typeof values[0];
    if (values.some((value) => typeof value !== type)) {
      return {...options, kind: EnumKind, type: ["string", "number"], enum: values};
    }
    return {...options, kind: EnumKind, type, enum: values};
  }
  Literal(value, options = {}) {
    return {...options, kind: LiteralKind, const: value, type: typeof value};
  }
  String(options = {}) {
    return {...options, kind: StringKind, type: "string"};
  }
  RegEx(regex, options = {}) {
    return this.String({...options, pattern: regex.source});
  }
  Number(options = {}) {
    return {...options, kind: NumberKind, type: "number"};
  }
  Integer(options = {}) {
    return {...options, kind: IntegerKind, type: "integer"};
  }
  Boolean(options = {}) {
    return {...options, kind: BooleanKind, type: "boolean"};
  }
  Null(options = {}) {
    return {...options, kind: NullKind, type: "null"};
  }
  Unknown(options = {}) {
    return {...options, kind: UnknownKind};
  }
  Any(options = {}) {
    return {...options, kind: AnyKind};
  }
  KeyOf(schema, options = {}) {
    const keys = Object.keys(schema.properties);
    return {...options, kind: KeyOfKind, type: "string", enum: keys};
  }
  Required(schema, options = {}) {
    const next = {...clone(schema), ...options};
    next.required = Object.keys(next.properties);
    for (const key of Object.keys(next.properties)) {
      const property = next.properties[key];
      switch (property.modifier) {
        case ReadonlyOptionalModifier:
          property.modifier = ReadonlyModifier;
          break;
        case ReadonlyModifier:
          property.modifier = ReadonlyModifier;
          break;
        case OptionalModifier:
          delete property.modifier;
          break;
        default:
          delete property.modifier;
          break;
      }
    }
    return next;
  }
  Partial(schema, options = {}) {
    const next = {...clone(schema), ...options};
    delete next.required;
    for (const key of Object.keys(next.properties)) {
      const property = next.properties[key];
      switch (property.modifier) {
        case ReadonlyOptionalModifier:
          property.modifier = ReadonlyOptionalModifier;
          break;
        case ReadonlyModifier:
          property.modifier = ReadonlyOptionalModifier;
          break;
        case OptionalModifier:
          property.modifier = OptionalModifier;
          break;
        default:
          property.modifier = OptionalModifier;
          break;
      }
    }
    return next;
  }
  Pick(schema, keys, options = {}) {
    const next = {...clone(schema), ...options};
    next.required = next.required ? next.required.filter((key) => keys.includes(key)) : void 0;
    for (const key of Object.keys(next.properties)) {
      if (!keys.includes(key))
        delete next.properties[key];
    }
    return next;
  }
  Omit(schema, keys, options = {}) {
    const next = {...clone(schema), ...options};
    next.required = next.required ? next.required.filter((key) => !keys.includes(key)) : void 0;
    for (const key of Object.keys(next.properties)) {
      if (keys.includes(key))
        delete next.properties[key];
    }
    return next;
  }
  Strict(schema) {
    return JSON.parse(JSON.stringify(schema));
  }
  Constructor(args, returns, options = {}) {
    return {...options, kind: ConstructorKind, type: "constructor", arguments: args, returns};
  }
  Function(args, returns, options = {}) {
    return {...options, kind: FunctionKind, type: "function", arguments: args, returns};
  }
  Promise(item, options = {}) {
    return {...options, type: "promise", kind: PromiseKind, item};
  }
  Undefined(options = {}) {
    return {...options, type: "undefined", kind: UndefinedKind};
  }
  Void(options = {}) {
    return {...options, type: "void", kind: VoidKind};
  }
};
var Type = new TypeBuilder();

// test.ts
var A = Type.Object({
  a: Type.Number(),
  b: Type.Number()
});
var B = Type.Object({
  c: Type.Number(),
  d: Type.Number()
}, {additionalProperties: false});
var C = Type.Intersect([A, B], {additionalProperties: false});
console.log(B);
