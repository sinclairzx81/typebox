import { Value } from "@sinclair/typebox/value";
import { Type } from "@sinclair/typebox";
import { Assert } from "../../assert/index";

describe("value/cast/Recursive", () => {
  const T = Type.Recursive((This) =>
    Type.Object({
      id: Type.String(),
      nodes: Type.Array(This),
    })
  );
  const E = { id: "", nodes: [] };
  it("Should upcast from string", () => {
    const value = "hello";
    const result = Value.Cast(T, value);
    Assert.IsEqual(result, E);
  });
  it("Should upcast from number", () => {
    const value = E;
    const result = Value.Cast(T, value);
    Assert.IsEqual(result, E);
  });
  it("Should upcast from boolean", () => {
    const value = true;
    const result = Value.Cast(T, value);
    Assert.IsEqual(result, E);
  });
  it("Should upcast from object", () => {
    const value = {};
    const result = Value.Cast(T, value);
    Assert.IsEqual(result, E);
  });
  it("Should upcast from array", () => {
    const value = [1];
    const result = Value.Cast(T, value);
    Assert.IsEqual(result, E);
  });
  it("Should upcast from undefined", () => {
    const value = undefined;
    const result = Value.Cast(T, value);
    Assert.IsEqual(result, E);
  });
  it("Should upcast from null", () => {
    const value = null;
    const result = Value.Cast(T, value);
    Assert.IsEqual(result, E);
  });
  it("Should upcast from date", () => {
    const value = new Date(100);
    const result = Value.Cast(T, value);
    Assert.IsEqual(result, E);
  });
  it("Should preserve", () => {
    const value = {
      id: "A",
      nodes: [
        { id: "B", nodes: [] },
        { id: "C", nodes: [] },
        { id: "D", nodes: [] },
      ],
    };
    const result = Value.Cast(T, value);
    Assert.IsEqual(result, value);
  });
  it("Should upcast from varying types", () => {
    const TypeA = Type.Recursive((This) =>
      Type.Object({
        id: Type.String(),
        nodes: Type.Array(This),
      })
    );
    const TypeB = Type.Recursive((This) =>
      Type.Object({
        id: Type.String(),
        name: Type.String({ default: "test" }),
        nodes: Type.Array(This),
      })
    );
    const ValueA = {
      id: "A",
      nodes: [
        { id: "B", nodes: [] },
        { id: "C", nodes: [] },
        { id: "D", nodes: [] },
      ],
    };
    const ValueB = Value.Cast(TypeB, ValueA);
    // Assert.isEqual(ValueB, {
    //   id: 'A',
    //   name: 'test',
    //   nodes: [
    //     { id: 'B', name: 'test', nodes: [] },
    //     { id: 'C', name: 'test', nodes: [] },
    //     { id: 'D', name: 'test', nodes: [] },
    //   ],
    // })
  });

  it("should handle simple circular structures", () => {
    const input = {
      a: "hello",
    };

    // @ts-expect-error
    input.b = input;

    const schema = Type.Recursive((This) =>
      Type.Object({
        a: Type.String(),
        b: This,
      })
    );

    const result = Value.Cast(schema, input);

    Assert.IsEqual(result, input);
  });

  it("should handle type coercion in circular structures #1", () => {
    const input = {
      id: 1,
      nodes: [],
    };

    // @ts-expect-error
    input.nodes = [input];

    const schema = Type.Recursive((This) =>
      Type.Object({
        id: Type.String(),
        nodes: Type.Array(This),
      })
    );

    const result = Value.Cast(schema, input);

    const output = {
      id: "",
      nodes: [],
    };

    // @ts-expect-error
    output.nodes = [output];

    Assert.IsEqual(result, output);
  });

  it("should handle type coercion in circular structures #2", () => {
    const input = {
      value: 42, // number should be cast to string
      next: null,
    };

    // @ts-expect-error
    input.next = input;

    const schema = Type.Recursive((This) =>
      Type.Object({
        value: Type.String(),
        next: Type.Union([This, Type.Null()]),
      })
    );

    const result = Value.Cast(schema, input);

    Assert.IsEqual(result.value, "");
    Assert.IsEqual(result.next, result);
  });

  it("should handle deeply nested circular structures", () => {
    const input = {
      id: "root",
      child: {
        id: "child",
        parent: null,
      },
    };

    // Create circular reference
    // @ts-expect-error
    input.child.parent = input;

    const schema = Type.Recursive((This) =>
      Type.Object({
        id: Type.String(),
        child: Type.Object({
          id: Type.String(),
          parent: Type.Union([This, Type.Null()]),
        }),
      })
    );

    const result = Value.Cast(schema, input);

    Assert.IsEqual(result.id, "root");
    Assert.IsEqual(result.child.id, "child");
    Assert.IsEqual(result.child.parent, result);
  });

  it("should handle circular array with multiple references", () => {
    const node1 = { id: "node1", refs: [] };
    const node2 = { id: "node2", refs: [] };

    // @ts-expect-error
    node1.refs = [node2, node1];
    // @ts-expect-error
    node2.refs = [node1];

    const schema = Type.Recursive((This) =>
      Type.Object({
        id: Type.String(),
        refs: Type.Array(This),
      })
    );

    const result = Value.Cast(schema, node1);

    Assert.IsEqual(result.id, "node1");
    Assert.IsEqual(result.refs.length, 2);
    Assert.IsEqual(result.refs[0].id, "node2");
    Assert.IsEqual(result.refs[1], result);
    Assert.IsEqual(result.refs[0].refs[0], result);
  });

  it("should handle optional properties in circular structures", () => {
    const input = {
      id: "test",
      parent: undefined,
    };

    // @ts-expect-error
    input.parent = input;

    const schema = Type.Recursive((This) =>
      Type.Object({
        id: Type.String(),
        parent: Type.Optional(This),
        metadata: Type.Optional(Type.String()),
      })
    );

    const result = Value.Cast(schema, input);

    Assert.IsEqual(result.id, "test");
    Assert.IsEqual(result.parent, result);
    Assert.IsEqual(result.metadata, undefined);
  });

  it("should handle mixed circular and non-circular references", () => {
    const leaf = { id: "leaf", children: [] };
    const branch = { id: "branch", children: [leaf] };
    const root = { id: "root", children: [branch] };

    // Add circular reference
    // @ts-expect-error
    branch.children.push(root);

    const schema = Type.Recursive((This) =>
      Type.Object({
        id: Type.String(),
        children: Type.Array(This),
      })
    );

    const result = Value.Cast(schema, root);

    Assert.IsEqual(result.id, "root");
    Assert.IsEqual(result.children.length, 1);
    Assert.IsEqual(result.children[0].id, "branch");
    Assert.IsEqual(result.children[0].children.length, 2);
    Assert.IsEqual(result.children[0].children[0].id, "leaf");
    Assert.IsEqual(result.children[0].children[1], result);
  });

  it("should handle circular references with union types", () => {
    const textNode = {
      type: "text",
      content: "Hello",
      parent: null,
    };

    const containerNode = {
      type: "container",
      children: [textNode],
      parent: null,
    };

    // @ts-expect-error
    textNode.parent = containerNode;
    // @ts-expect-error
    containerNode.parent = containerNode; // self-reference

    const schema = Type.Recursive((This) =>
      Type.Union([
        Type.Object({
          type: Type.Literal("text"),
          content: Type.String(),
          parent: Type.Union([This, Type.Null()]),
        }),
        Type.Object({
          type: Type.Literal("container"),
          children: Type.Array(This),
          parent: Type.Union([This, Type.Null()]),
        }),
      ])
    );

    const result = Value.Cast(schema, containerNode);

    Assert.IsEqual(result.type, "container");
    // @ts-expect-error - TypeScript can't infer the union type here
    Assert.IsEqual(result.children.length, 1);
    // @ts-expect-error
    Assert.IsEqual(result.children[0].type, "text");
    // @ts-expect-error
    Assert.IsEqual(result.children[0].content, "Hello");
    // @ts-expect-error
    Assert.IsEqual(result.children[0].parent, result);
    Assert.IsEqual(result.parent, result);
  });
});
