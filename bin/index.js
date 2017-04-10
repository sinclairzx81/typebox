var typebox = (function () {
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
                  } else return require(id)
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
          return "object";
      }
      exports.reflect = reflect;
  });
  define("spec", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      function Any() {
          return {
              kind: "any",
              phantom: undefined
          };
      }
      exports.Any = Any;
      function Undefined() {
          return {
              kind: "undefined",
              phantom: undefined
          };
      }
      exports.Undefined = Undefined;
      function Null() {
          return {
              kind: "null",
              phantom: undefined
          };
      }
      exports.Null = Null;
      function Literal(value) {
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
      function Object(properties) {
          return {
              kind: "object",
              properties: properties
          };
      }
      exports.Object = Object;
      function Array(type) {
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
          return {
              kind: "union",
              types: types
          };
      }
      exports.Union = Union;
      function Intersect() {
          var types = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              types[_i] = arguments[_i];
          }
          return {
              kind: "intersect",
              types: types
          };
      }
      exports.Intersect = Intersect;
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
                      message: "Property of type '" + actual + "' with length '" + actual_length + "' is invalid",
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
      function check_Object(type, name, value) {
          var kind = reflect_1.reflect(value);
          if (kind !== "object") {
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
              var unionkind = type.types.map(function (type) { return type.kind; }).join(" | ");
              return FailBinding(name, unionkind, reflect_1.reflect(value));
          }
          else {
              return Ok();
          }
      }
      function check_Intersect(type, name, value) {
          return Ok();
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
              case "object": return check_Object(type, name, value);
              case "array": return check_Array(type, name, value);
              case "tuple": return check_Tuple(type, name, value);
              case "union": return check_Union(type, name, value);
              case "intersect": return check_Intersect(type, name, value);
              default: throw new Error("unknown type.");
          }
      }
      function check(type, value) {
          return check_All(type, "value", value);
      }
      exports.check = check;
  });
  define("schema", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      function schema(type) {
          return {};
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
          if (left.kind === "object" && right.kind === "object") {
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
  define("infer", ["require", "exports", "reflect", "compare", "spec"], function (require, exports, reflect_2, compare_1, spec) {
      "use strict";
      exports.__esModule = true;
      function infer(value) {
          var kind = reflect_2.reflect(value);
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
              case "object":
                  return spec.Object(Object.keys(value)
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
  define("index", ["require", "exports", "reflect", "check", "schema", "infer", "spec"], function (require, exports, reflect_3, check_1, schema_1, infer_1, spec_1) {
      "use strict";
      exports.__esModule = true;
      exports.reflect = reflect_3.reflect;
      exports.check = check_1.check;
      exports.schema = schema_1.schema;
      exports.infer = infer_1.infer;
      exports.Any = spec_1.Any;
      exports.Undefined = spec_1.Undefined;
      exports.Null = spec_1.Null;
      exports.Literal = spec_1.Literal;
      exports.String = spec_1.String;
      exports.Number = spec_1.Number;
      exports.Boolean = spec_1.Boolean;
      exports.Object = spec_1.Object;
      exports.Array = spec_1.Array;
      exports.Tuple = spec_1.Tuple;
      exports.Union = spec_1.Union;
      exports.Intersect = spec_1.Intersect;
  });
  
  return collect(); 
})();