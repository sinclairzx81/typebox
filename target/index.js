(function () {
  var main = null;
  var modules = {
      "require": {
          factory: undefined,
          dependencies: [],
          exports: function (args, callback) { return require(args, callback); },
          resolved: true
      }
  };
  function define(id, dependencies, factory) {
      return main = modules[id] = {
          dependencies: dependencies,
          factory: factory,
          exports: {},
          resolved: false
      };
  }
  function resolve(definition) {
      if (definition.resolved === true)
          return;
      definition.resolved = true;
      var dependencies = definition.dependencies.map(function (id) {
          return (id === "exports")
              ? definition.exports
              : (function () {
                  if(modules[id] !== undefined) {
                    resolve(modules[id]);
                    return modules[id].exports;
                  } else {
                    try {
                      return require(id);
                    } catch(e) {
                      throw Error("module '" + id + "' not found.");
                    }
                  }
              })();
      });
      definition.factory.apply(null, dependencies);
  }
  function collect() {
      Object.keys(modules).map(function (key) { return modules[key]; }).forEach(resolve);
      return (main !== null) 
        ? main.exports
        : undefined
  }

  define("reflect", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      function reflect(value) {
          if (value === undefined)
              return "undefined";
          if (value === null)
              return "null";
          if (typeof value === "function")
              return "function";
          if (typeof value === "string")
              return "string";
          if (typeof value === "number")
              return "number";
          if (typeof value === "boolean")
              return "boolean";
          if (typeof value === "object") {
              if (value instanceof Array)
                  return "array";
              if (value instanceof Date)
                  return "date";
          }
          return "complex";
      }
      exports.reflect = reflect;
  });
  define("spec", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      function Any() {
          return {
              kind: "any"
          };
      }
      exports.Any = Any;
      function Undefined() {
          return {
              kind: "undefined"
          };
      }
      exports.Undefined = Undefined;
      function Null() {
          return {
              kind: "null"
          };
      }
      exports.Null = Null;
      function Literal(value) {
          if (typeof value !== "string" && typeof value !== "number")
              throw Error("Literal only allows for string or numeric values.");
          return {
              kind: "literal",
              value: value
          };
      }
      exports.Literal = Literal;
      function String() {
          return {
              kind: "string"
          };
      }
      exports.String = String;
      function Number() {
          return {
              kind: "number"
          };
      }
      exports.Number = Number;
      function Boolean() {
          return {
              kind: "boolean"
          };
      }
      exports.Boolean = Boolean;
      function Complex(properties) {
          if (properties === void 0) { properties = {}; }
          return {
              kind: "complex",
              properties: properties
          };
      }
      exports.Complex = Complex;
      function Array(type) {
          if (type === void 0) { type = Any(); }
          return {
              kind: "array",
              type: type
          };
      }
      exports.Array = Array;
      function Tuple() {
          var types = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              types[_i] = arguments[_i];
          }
          if (types.length === 0)
              throw Error("Type tuple requires at least one type.");
          return {
              kind: "tuple",
              types: types
          };
      }
      exports.Tuple = Tuple;
      function Union() {
          var types = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              types[_i] = arguments[_i];
          }
          if (types.length === 0)
              throw Error("Type union requires at least one type.");
          return {
              kind: "union",
              types: types
          };
      }
      exports.Union = Union;
  });
  define("check", ["require", "exports", "reflect"], function (require, exports, reflect_1) {
      "use strict";
      exports.__esModule = true;
      function Ok() {
          return {
              success: true,
              errors: []
          };
      }
      function FailBinding(binding, expect, actual) {
          return {
              success: false,
              errors: [{
                      binding: binding,
                      message: "Type '" + actual + "' is not assignable to type '" + expect + "'",
                      expect: expect,
                      actual: actual
                  }]
          };
      }
      function FailRequired(binding, expect, actual) {
          return {
              success: false,
              errors: [{
                      binding: binding,
                      message: "Property of type '" + expect + "' is required",
                      expect: expect,
                      actual: actual
                  }]
          };
      }
      function FailLengthMismatch(binding, expect, actual, expect_length, actual_length) {
          return {
              success: false,
              errors: [{
                      binding: binding,
                      message: "Property of type '" + actual + "' with a length " + actual_length + " is invalid. Expect length of " + expect_length,
                      expect: expect,
                      actual: actual
                  }]
          };
      }
      function FailUnexpected(binding, expect, actual) {
          var parts = binding.split(".");
          var property = parts[parts.length - 1];
          return {
              success: false,
              errors: [{
                      binding: binding,
                      message: "Property of type '" + actual + "' is not valid for this object",
                      expect: expect,
                      actual: actual
                  }]
          };
      }
      function check_Any(type, name, value) {
          return Ok();
      }
      function check_Undefined(type, name, value) {
          var kind = reflect_1.reflect(value);
          return (kind !== "undefined")
              ? FailBinding(name, type.kind, kind)
              : Ok();
      }
      function check_Null(type, name, value) {
          var kind = reflect_1.reflect(value);
          return (kind !== "null")
              ? FailBinding(name, type.kind, kind)
              : Ok();
      }
      function check_Literal(type, name, value) {
          var actual = reflect_1.reflect(value);
          var expect = reflect_1.reflect(type.value);
          if (actual !== expect) {
              return FailBinding(name, expect, actual);
          }
          else if (type.value !== value) {
              return FailBinding(name, type.value, actual);
          }
          else {
              return Ok();
          }
      }
      function check_String(type, name, value) {
          var kind = reflect_1.reflect(value);
          return (kind !== "string")
              ? FailBinding(name, type.kind, kind)
              : Ok();
      }
      function check_Number(type, name, value) {
          var kind = reflect_1.reflect(value);
          return (kind !== "number")
              ? FailBinding(name, type.kind, kind)
              : Ok();
      }
      function check_Boolean(type, name, value) {
          var kind = reflect_1.reflect(value);
          return (kind !== "boolean")
              ? FailBinding(name, type.kind, kind)
              : Ok();
      }
      function check_Complex(type, name, value) {
          var kind = reflect_1.reflect(value);
          if (kind !== "complex") {
              return FailBinding(name, type.kind, kind);
          }
          else {
              var results = new Array();
              var unexpected_queue = Object.keys(value).map(function (key) { return ({ key: key, value: value[key] }); });
              while (unexpected_queue.length > 0) {
                  var property = unexpected_queue.shift();
                  if (type.properties[property.key] === undefined) {
                      results.push(FailUnexpected(name + "." + property.key, "undefined", reflect_1.reflect(property.value)));
                  }
              }
              var expected_queue = Object.keys(type.properties).map(function (key) { return ({ key: key, type: type.properties[key] }); });
              while (expected_queue.length > 0) {
                  var property = expected_queue.shift();
                  if (value[property.key] === undefined && property.type.kind !== "undefined") {
                      results.push(FailRequired(name + "." + property.key, property.type.kind, "undefined"));
                  }
                  else {
                      results.push(check_All(property.type, name + "." + property.key, value[property.key]));
                  }
              }
              return results.reduce(function (acc, result) {
                  if (result.errors.length > 0)
                      acc.success = false;
                  for (var i = 0; i < result.errors.length; i++)
                      acc.errors.push(result.errors[i]);
                  return acc;
              }, { success: true, errors: [] });
          }
      }
      function check_Array(type, name, value) {
          var kind = reflect_1.reflect(value);
          if (kind !== "array") {
              return FailBinding(name, type.kind, kind);
          }
          else {
              var array = value;
              return array.map(function (item, index) { return check_All(type.type, name + ("[" + index + "]"), item); }).reduce(function (acc, result) {
                  if (result.errors.length > 0) {
                      acc.success = false;
                  }
                  for (var i = 0; i < result.errors.length; i++) {
                      acc.errors.push(result.errors[i]);
                  }
                  return acc;
              }, { success: true, errors: [] });
          }
      }
      function check_Tuple(type, name, value) {
          var kind = reflect_1.reflect(value);
          var array = value;
          if (kind !== "array") {
              return FailBinding("name", type.kind, kind);
          }
          else if (array.length !== type.types.length) {
              return FailLengthMismatch(name, type.kind, kind, type.types.length, array.length);
          }
          else {
              return array.map(function (item, index) {
                  return check_All(type.types[index], name + ("[" + index + "]"), item);
              }).reduce(function (acc, c) {
                  if (c.errors.length > 0) {
                      acc.success = false;
                  }
                  for (var i = 0; i < c.errors.length; i++) {
                      acc.errors.push(c.errors[i]);
                  }
                  return acc;
              }, { success: true, errors: [] });
          }
      }
      function check_Union(type, name, value) {
          var results = type.types.map(function (type) { return check_All(type, name, value); });
          var failed = results.reduce(function (acc, result) {
              if (result.success === false) {
                  acc += 1;
              }
              return acc;
          }, 0);
          if (failed === type.types.length) {
              var unionkind = type.types.map(function (type) {
                  return type.kind === "literal"
                      ? type.value
                      : type.kind;
              }).join(" | ");
              return FailBinding(name, unionkind, reflect_1.reflect(value));
          }
          else {
              return Ok();
          }
      }
      function check_All(type, name, value) {
          switch (type.kind) {
              case "any": return check_Any(type, name, value);
              case "undefined": return check_Undefined(type, name, value);
              case "null": return check_Null(type, name, value);
              case "literal": return check_Literal(type, name, value);
              case "string": return check_String(type, name, value);
              case "number": return check_Number(type, name, value);
              case "boolean": return check_Boolean(type, name, value);
              case "complex": return check_Complex(type, name, value);
              case "array": return check_Array(type, name, value);
              case "tuple": return check_Tuple(type, name, value);
              case "union": return check_Union(type, name, value);
              default: throw new Error("unknown type.");
          }
      }
      function check(type, value) {
          return check_All(type, "value", value);
      }
      exports.check = check;
  });
  define("schema", ["require", "exports", "reflect"], function (require, exports, reflect_2) {
      "use strict";
      exports.__esModule = true;
      function schema_Any(type) {
          return {};
      }
      function schema_Undefined(type) {
          return { "type": "null" };
      }
      function schema_Null(type) {
          return { "type": "null" };
      }
      function schema_Literal(type) {
          var kind = reflect_2.reflect(type.value);
          switch (kind) {
              case "string": return { "type": "string", "pattern": type.value };
              case "number": return { "type": "number", "minimum": type.value, "maximum": type.value };
          }
      }
      function schema_String(type) {
          return { "type": "string" };
      }
      function schema_Number(type) {
          return { "type": "number" };
      }
      function schema_Boolean(type) {
          return { "type": "boolean" };
      }
      function schema_Complex(type) {
          var expanded = Object.keys(type.properties).map(function (key) { return ({
              key: key,
              type: type.properties[key]
          }); });
          var properties = expanded
              .reduce(function (acc, c) {
              acc[c.key] = schema_Base(c.type);
              return acc;
          }, {});
          var required = expanded
              .filter(function (property) { return property.type.kind !== "undefined"; })
              .map(function (property) { return property.key; });
          return {
              "type": "object",
              "properties": properties,
              "required": required
          };
      }
      function schema_Array(type) {
          return {
              "type": "array",
              "items": schema_Base(type.type)
          };
      }
      function schema_Tuple(type) {
          var items = type.types.map(function (type) { return schema_Base(type); });
          return {
              "type": "array",
              "items": items,
              "additionalItems": false,
              "minItems": items.length,
              "maxItems": items.length
          };
      }
      function schema_Union(type) {
          var types = type.types.map(function (type) { return schema_Base(type); });
          return {
              "anyOf": types
          };
      }
      function schema_Base(type) {
          switch (type.kind) {
              case "any": return schema_Any(type);
              case "undefined": return schema_Undefined(type);
              case "null": return schema_Null(type);
              case "literal": return schema_Literal(type);
              case "string": return schema_String(type);
              case "number": return schema_Number(type);
              case "boolean": return schema_Boolean(type);
              case "complex": return schema_Complex(type);
              case "array": return schema_Array(type);
              case "tuple": return schema_Tuple(type);
              case "union": return schema_Union(type);
              default: throw new Error("unknown type.");
          }
      }
      function schema(type) {
          var base = schema_Base(type);
          var schema = {
              "$schema": "http://json-schema.org/draft-04/schema#"
          };
          return Object.keys(base).reduce(function (acc, key) {
              acc[key] = base[key];
              return acc;
          }, schema);
      }
      exports.schema = schema;
  });
  define("compare", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      function compare(left, right) {
          if (left.kind === "any" || right.kind === "any")
              return true;
          if (left.kind === "string" && right.kind === "string")
              return true;
          if (left.kind === "number" && right.kind === "number")
              return true;
          if (left.kind === "null" && right.kind === "null")
              return true;
          if (left.kind === "undefined" && right.kind === "undefined")
              return true;
          if (left.kind === "boolean" && right.kind === "boolean")
              return true;
          if (left.kind === "literal" && right.kind === "literal")
              return left.value === right.value;
          if (left.kind === "complex" && right.kind === "complex") {
              var object_left = left;
              var object_right = right;
              var keys = Object.keys(object_left.properties);
              if (keys.length !== Object.keys(object_right.properties).length) {
                  return false;
              }
              for (var i = 0; i < keys.length; i++) {
                  if (object_right.properties[keys[i]] === undefined) {
                      return false;
                  }
              }
              for (var i = 0; i < keys.length; i++) {
                  if (compare(object_left.properties[keys[i]], object_right.properties[keys[i]]) === false) {
                      return false;
                  }
              }
              return true;
          }
          if (left.kind === "array" && right.kind === "array") {
              var array_left = left;
              var array_right = right;
              return compare(array_left.type, array_right.type);
          }
          if (left.kind === "tuple" && right.kind === "tuple") {
              var tuple_left = left;
              var tuple_right = right;
              if (tuple_left.types.length !== tuple_right.types.length)
                  return false;
              for (var i = 0; i < tuple_left.types.length; i++) {
                  if (compare(tuple_left.types[i], tuple_right.types[i]) === false) {
                      return false;
                  }
              }
              return true;
          }
          if (left.kind === "union" && right.kind === "union") {
              var union_left = left;
              var union_right = right;
              if (union_left.types.length === 0 && union_right.types.length === 0) {
                  return true;
              }
          }
          if (left.kind === "union") {
              var union_left = left;
              for (var i = 0; i < union_left.types.length; i++) {
                  if (compare(union_left.types[i], right) === true) {
                      return true;
                  }
              }
          }
          if (right.kind === "union") {
              var union_right = right;
              for (var i = 0; i < union_right.types.length; i++) {
                  if (compare(union_right.types[i], left) === true) {
                      return true;
                  }
              }
          }
          return false;
      }
      exports.compare = compare;
  });
  define("infer", ["require", "exports", "reflect", "compare", "spec"], function (require, exports, reflect_3, compare_1, spec) {
      "use strict";
      exports.__esModule = true;
      function infer(value) {
          var kind = reflect_3.reflect(value);
          switch (kind) {
              case "undefined": return spec.Undefined();
              case "null": return spec.Null();
              case "string": return spec.String();
              case "number": return spec.Number();
              case "boolean": return spec.Boolean();
              case "array":
                  var array = value;
                  if (array.length === 0) {
                      return spec.Array(spec.Any());
                  }
                  else {
                      var types = array.reduce(function (acc, value, index) {
                          if (index > 64)
                              return acc;
                          var type = infer(value);
                          var found = false;
                          for (var i = 0; i < acc.length; i++) {
                              if (compare_1.compare(acc[i], type)) {
                                  found = true;
                                  break;
                              }
                          }
                          if (!found) {
                              acc.push(type);
                          }
                          return acc;
                      }, []);
                      return spec.Array((types.length > 1)
                          ? spec.Union.apply(this, types)
                          : types[0]);
                  }
              case "complex":
                  return spec.Complex(Object.keys(value)
                      .map(function (key) { return ({
                      key: key,
                      type: infer(value[key])
                  }); }).reduce(function (acc, value) {
                      acc[value.key] = value.type;
                      return acc;
                  }, {}));
              default:
                  throw new Error("unsupported type '" + kind + "'");
          }
      }
      exports.infer = infer;
  });
  define("generate", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      function generate_Any(type) {
          return {};
      }
      function generate_Null(type) {
          return null;
      }
      function generate_Undefined(type) {
          return undefined;
      }
      function generate_Complex(type) {
          return Object.keys(type.properties)
              .map(function (key) { return ({ key: key, value: generate(type.properties[key]) }); })
              .reduce(function (acc, value) {
              acc[value.key] = value.value;
              return acc;
          }, {});
      }
      function generate_Array(t) {
          return [
              generate(t.type),
              generate(t.type),
              generate(t.type)
          ];
      }
      function generate_Tuple(t) {
          return t.types.map(function (type) { return generate(type); });
      }
      function generate_Number(t) {
          return 0;
      }
      function generate_String(t) {
          return "string";
      }
      function generate_Boolean(t) {
          return true;
      }
      function generate_Union(t) {
          if (t.types.length === 0) {
              return {};
          }
          else {
              return generate(t.types[0]);
          }
      }
      function generate_Literal(t) {
          return t.value;
      }
      function generate(type) {
          switch (type.kind) {
              case "any": return generate_Any(type);
              case "null": return generate_Null(type);
              case "undefined": return generate_Undefined(type);
              case "complex": return generate_Complex(type);
              case "array": return generate_Array(type);
              case "tuple": return generate_Tuple(type);
              case "number": return generate_Number(type);
              case "string": return generate_String(type);
              case "boolean": return generate_Boolean(type);
              case "union": return generate_Union(type);
              case "literal": return generate_Literal(type);
              default: throw Error("unknown type.");
          }
      }
      exports.generate = generate;
  });
  define("index", ["require", "exports", "reflect", "check", "schema", "infer", "compare", "generate", "spec"], function (require, exports, reflect_4, check_1, schema_1, infer_1, compare_2, generate_1, spec_1) {
      "use strict";
      exports.__esModule = true;
      exports.reflect = reflect_4.reflect;
      exports.check = check_1.check;
      exports.schema = schema_1.schema;
      exports.infer = infer_1.infer;
      exports.compare = compare_2.compare;
      exports.generate = generate_1.generate;
      exports.Any = spec_1.Any;
      exports.Undefined = spec_1.Undefined;
      exports.Null = spec_1.Null;
      exports.Literal = spec_1.Literal;
      exports.String = spec_1.String;
      exports.Number = spec_1.Number;
      exports.Boolean = spec_1.Boolean;
      exports.Complex = spec_1.Complex;
      exports.Array = spec_1.Array;
      exports.Tuple = spec_1.Tuple;
      exports.Union = spec_1.Union;
  });
  
  return collect(); 
})();