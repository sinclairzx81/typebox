/*--------------------------------------------------------------------------

@sinclair/typebox/codegen

The MIT License (MIT)

Copyright (c) 2017-2023 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

import { Formatter } from './formatter'
import * as ts from 'typescript'

// --------------------------------------------------------------------------
// Errors
// --------------------------------------------------------------------------
export class TypeScriptToJsonSchemaNonExpressable extends Error {
  constructor(type: string) {
    super(`TypeScriptToJsonSchema: Cannot express syntax type '${type}'`)
  }
}
// --------------------------------------------------------------------------
// Transform
// --------------------------------------------------------------------------
export namespace TypeScriptToJsonSchema {
  function isReadonlyProperty(node: ts.PropertySignature): boolean {
    return node.modifiers !== undefined && node.modifiers.find((modifier) => modifier.getText() === 'readonly') !== undefined
  }
  function isOptionalProperty(node: ts.PropertySignature) {
    return node.questionToken !== undefined
  }
  function isExport(node: ts.InterfaceDeclaration | ts.TypeAliasDeclaration | ts.EnumDeclaration): boolean {
    return node.modifiers !== undefined && node.modifiers.find((modifier) => modifier.getText() === 'export') !== undefined
  }
  function* SourceFile(node: ts.SourceFile): IterableIterator<string> {
    for (const next of node.getChildren()) {
      yield* Visit(next)
    }
  }
  function* PropertySignature(node: ts.PropertySignature): IterableIterator<string> {
    const [readonly, optional] = [isReadonlyProperty(node), isOptionalProperty(node)]
    const type = Collect(node.type)
    if (readonly && optional) {
      return yield `${node.name.getText()}: ${type}`
    } else if (readonly) {
      return yield `${node.name.getText()}: ${type}`
    } else if (optional) {
      return yield `${node.name.getText()}: ${type}`
    } else {
      return yield `${node.name.getText()}: ${type}`
    }
  }
  function* ArrayTypeNode(node: ts.ArrayTypeNode): IterableIterator<string> {
    const type = Collect(node.elementType)
    yield `{
      type: 'array',
      items: ${type}
    }`
  }
  function* TupleTypeNode(node: ts.TupleTypeNode): IterableIterator<string> {
    const types = node.elements.map((type) => Collect(type)).join(',\n')
    yield `{
      type: 'array',
      items: [${types}],
      minItems: ${node.elements.length},
      maxItems: ${node.elements.length}
    }`
  }
  function* UnionTypeNode(node: ts.UnionTypeNode): IterableIterator<string> {
    const types = node.types.map((type) => Collect(type)).join(',\n')
    yield `{
      anyOf: [
        ${types}
      ]
    }`
  }
  function* IntersectionTypeNode(node: ts.IntersectionTypeNode): IterableIterator<string> {
    const types = node.types.map((type) => Collect(type)).join(',\n')
    yield `{
      allOf: [
        ${types}
      ]
    }`
  }
  function* TypeOperatorNode(node: ts.TypeOperatorNode): IterableIterator<string> {
    throw new TypeScriptToJsonSchemaNonExpressable('TypeOperatorNode')
  }
  function* Parameter(node: ts.ParameterDeclaration): IterableIterator<string> {
    yield Collect(node.type)
  }
  function* FunctionTypeNode(node: ts.FunctionTypeNode): IterableIterator<string> {
    throw new TypeScriptToJsonSchemaNonExpressable('FunctionTypeNode')
  }
  function* ConstructorTypeNode(node: ts.ConstructorTypeNode): IterableIterator<string> {
    throw new TypeScriptToJsonSchemaNonExpressable('ConstructorTypeNode')
  }
  function* EnumMember(node: ts.EnumMember): IterableIterator<string> {
    if (node.initializer) {
      return yield `{
        const: ${node.initializer.getText()}
      }`
    }
    return yield `{
      const: '${node.name.getText()}'
    }`
  }
  function* EnumDeclaration(node: ts.EnumDeclaration): IterableIterator<string> {
    const exports = isExport(node) ? 'export ' : ''
    const name = node.name.getText()
    const members = node.members.map((member) => Collect(member)).join(',\n')
    yield `${exports}const ${name} = {
      anyOf: [
        ${members}
      ]
    }`
  }
  function* InterfaceDeclaration(node: ts.InterfaceDeclaration): IterableIterator<string> {
    if (node.typeParameters) {
      const exports = isExport(node) ? 'export ' : ''
      const members = node.members.map((member) => Collect(member)).join(',\n')
      const required = node.members
        .filter((member) => member.questionToken === undefined)
        .map((member) => `'${member.name?.getText()}'`)
        .join(',\n')
      const parameters = node.typeParameters.map((param) => `${Collect(param)}`).join(', ')
      const definition = `${exports}const ${node.name.getText()} = (${parameters}) => {
        type: 'object,
        properties: {
          ${members}
        },
        required: [
          ${required}
        ],
      }`
      yield `${definition}`
    } else {
      const exports = isExport(node) ? 'export ' : ''
      const members = node.members.map((member) => Collect(member)).join(',\n')
      const required = node.members
        .filter((member) => member.questionToken === undefined)
        .map((member) => `'${member.name?.getText()}'`)
        .join(',\n')
      const definition = `${exports}const ${node.name.getText()} = {
        type: 'object',
        properties: {
          ${members}
        },
        required: [
          ${required}
        ]
      }`
      yield `${definition}`
    }
  }

  function* TypeAliasDeclaration(node: ts.TypeAliasDeclaration): IterableIterator<string> {
    if (node.typeParameters) {
      const exports = isExport(node) ? 'export ' : ''
      const parameters = node.typeParameters.map((param) => `${Collect(param)}`).join(', ')
      const type = Collect(node.type)
      const definition = `${exports}const ${node.name.getText()} = (${parameters}) => ${type}`
      yield `${definition}`
    } else {
      const exports = isExport(node) ? 'export ' : ''
      const type = Collect(node.type)
      const definition = `${exports}const ${node.name.getText()} = ${type}`
      yield `${definition}`
    }
  }

  function* TypeParameterDeclaration(node: ts.TypeParameterDeclaration): IterableIterator<string> {
    yield node.name.getText()
  }

  function* ParenthesizedTypeNode(node: ts.ParenthesizedTypeNode): IterableIterator<string> {
    yield Collect(node.type)
  }

  function* RestTypeNode(node: ts.RestTypeNode): IterableIterator<string> {
    throw new TypeScriptToJsonSchemaNonExpressable('RestTypeNode')
  }

  function* ConditionalTypeNode(node: ts.ConditionalTypeNode): IterableIterator<string> {
    throw new TypeScriptToJsonSchemaNonExpressable('ConditionalTypeNode')
  }

  function* TypeReferenceNode(node: ts.TypeReferenceNode): IterableIterator<string> {
    const name = node.typeName.getText()
    const args = node.typeArguments ? `(${node.typeArguments.map((type) => Collect(type)).join(', ')})` : ''
    if (name === 'Array') {
      return yield `{
        type: 'array',
        items: ${args}
      }`
    } else if (name === 'Record') {
      throw new TypeScriptToJsonSchemaNonExpressable('TypeReferenceNode:Record')
    } else if (name === 'Partial') {
      throw new TypeScriptToJsonSchemaNonExpressable('TypeReferenceNode:Partial')
    } else if (name === 'Uint8Array') {
      throw new TypeScriptToJsonSchemaNonExpressable('TypeReferenceNode:Uint8Array')
    } else if (name === 'Required') {
      throw new TypeScriptToJsonSchemaNonExpressable('TypeReferenceNode:Required')
    } else if (name === 'Omit') {
      throw new TypeScriptToJsonSchemaNonExpressable('TypeReferenceNode:Omit')
    } else if (name === 'Pick') {
      throw new TypeScriptToJsonSchemaNonExpressable('TypeReferenceNode:Pick')
    } else if (name === 'Promise') {
      throw new TypeScriptToJsonSchemaNonExpressable('TypeReferenceNode:Promise')
    } else if (name === 'ReturnType') {
      throw new TypeScriptToJsonSchemaNonExpressable('TypeReferenceNode:ReturnType')
    } else if (name === 'InstanceType') {
      throw new TypeScriptToJsonSchemaNonExpressable('TypeReferenceNode:InstanceType')
    } else if (name === 'Parameters') {
      throw new TypeScriptToJsonSchemaNonExpressable('TypeReferenceNode:Parameters')
    } else if (name === 'ConstructorParameters') {
      throw new TypeScriptToJsonSchemaNonExpressable('TypeReferenceNode:ConstructorParameters')
    } else if (name === 'Exclude') {
      throw new TypeScriptToJsonSchemaNonExpressable('TypeReferenceNode:Exclude')
    } else if (name === 'Extract') {
      throw new TypeScriptToJsonSchemaNonExpressable('TypeReferenceNode:Extract')
    } else {
      return yield `${name}${args}`
    }
  }

  function* TypeLiteralNode(node: ts.TypeLiteralNode): IterableIterator<string> {
    const members = node.members.map((member) => Collect(member)).join(',\n')
    const required = node.members
      .filter((member) => member.questionToken === undefined)
      .map((member) => `'${member.name?.getText()}'`)
      .join(',\n')
    yield `{
      type: 'object',
      properties: {
        ${members}
      },
      required: [
        ${required}
      ]
    }`
  }

  function* LiteralTypeNode(node: ts.LiteralTypeNode): IterableIterator<string> {
    const text = node.getText()
    if (text === 'null')
      return yield `{ 
      type: 'null' 
    }`
    yield `{ 
      const: ${node.getText()} 
    }`
  }

  function* FunctionDeclaration(node: ts.FunctionDeclaration): IterableIterator<string> {
    yield node.getText()
  }

  function* ClassDeclaration(node: ts.ClassDeclaration): IterableIterator<string> {
    yield node.getText()
  }

  function Collect(node: ts.Node | undefined): string {
    return `${[...Visit(node)].join('')}`
  }

  function CollectNewLine(node: ts.Node | undefined): string {
    return [...Visit(node)].join('\n\n')
  }

  function* Visit(node: ts.Node | undefined): IterableIterator<string> {
    if (node === undefined) return
    if (ts.isSourceFile(node)) {
      return yield* SourceFile(node)
    } else if (ts.isInterfaceDeclaration(node)) {
      return yield* InterfaceDeclaration(node)
    } else if (ts.isTypeAliasDeclaration(node)) {
      return yield* TypeAliasDeclaration(node)
    } else if (ts.isParameter(node)) {
      return yield* Parameter(node)
    } else if (ts.isFunctionTypeNode(node)) {
      return yield* FunctionTypeNode(node)
    } else if (ts.isConstructorTypeNode(node)) {
      return yield* ConstructorTypeNode(node)
    } else if (ts.isEnumMember(node)) {
      return yield* EnumMember(node)
    } else if (ts.isEnumDeclaration(node)) {
      return yield* EnumDeclaration(node)
    } else if (ts.isPropertySignature(node)) {
      return yield* PropertySignature(node)
    } else if (ts.isTypeReferenceNode(node)) {
      return yield* TypeReferenceNode(node)
    } else if (ts.isTypeLiteralNode(node)) {
      return yield* TypeLiteralNode(node)
    } else if (ts.isLiteralTypeNode(node)) {
      return yield* LiteralTypeNode(node)
    } else if (ts.isArrayTypeNode(node)) {
      return yield* ArrayTypeNode(node)
    } else if (ts.isTupleTypeNode(node)) {
      return yield* TupleTypeNode(node)
    } else if (ts.isIntersectionTypeNode(node)) {
      return yield* IntersectionTypeNode(node)
    } else if (ts.isUnionTypeNode(node)) {
      return yield* UnionTypeNode(node)
    } else if (ts.isTypeOperatorNode(node)) {
      return yield* TypeOperatorNode(node)
    } else if (ts.isTypeParameterDeclaration(node)) {
      return yield* TypeParameterDeclaration(node)
    } else if (ts.isParenthesizedTypeNode(node)) {
      return yield* ParenthesizedTypeNode(node)
    } else if (ts.isRestTypeNode(node)) {
      return yield* RestTypeNode(node)
    } else if (ts.isFunctionDeclaration(node)) {
      return yield* FunctionDeclaration(node)
    } else if (ts.isClassDeclaration(node)) {
      return yield* ClassDeclaration(node)
    } else if (ts.isConditionalTypeNode(node)) {
      return yield* ConditionalTypeNode(node)
    } else if (node.kind === ts.SyntaxKind.KeyOfKeyword) {
      throw new TypeScriptToJsonSchemaNonExpressable('KeyOfKeyword')
    } else if (node.kind === ts.SyntaxKind.NumberKeyword) {
      return yield `{ 
        type: 'number' 
      }`
    } else if (node.kind === ts.SyntaxKind.StringKeyword) {
      return yield `{ 
        type: 'string' 
      }`
    } else if (node.kind === ts.SyntaxKind.BooleanKeyword) {
      return yield `{ 
        type: 'boolean' 
      }`
    } else if (node.kind === ts.SyntaxKind.UndefinedKeyword) {
      throw new TypeScriptToJsonSchemaNonExpressable('UndefinedKeyword')
    } else if (node.kind === ts.SyntaxKind.UnknownKeyword) {
      return yield `{

      }`
    } else if (node.kind === ts.SyntaxKind.AnyKeyword) {
      return yield `{ 

      }`
    } else if (node.kind === ts.SyntaxKind.NeverKeyword) {
      return yield `{
        anyOf: [
          { 
            type: 'boolean', 
            const: true 
          }, 
          { 
            type: 'boolean', 
            const: false 
          }
        ]
      }`
    } else if (node.kind === ts.SyntaxKind.NullKeyword) {
      return yield `{ 
        type: 'null' 
      }`
    } else if (node.kind === ts.SyntaxKind.VoidKeyword) {
      throw new TypeScriptToJsonSchemaNonExpressable('KeyOfKeyword')
    } else if (node.kind === ts.SyntaxKind.EndOfFileToken) {
      return
    } else if (node.kind === ts.SyntaxKind.SyntaxList) {
      for (const child of node.getChildren()) {
        yield* Visit(child)
      }
      return
    } else {
      console.log('Unhandled:', ts.SyntaxKind[node.kind])
      return yield node.getText()
    }
  }

  /** Generates TypeBox types from TypeScript interface and type definitions */
  export function Generate(typescriptCode: string) {
    const source = ts.createSourceFile('code.ts', typescriptCode, ts.ScriptTarget.ESNext, true)
    const declarations = CollectNewLine(source)
    const types = Formatter.Format(declarations)
    return [types].join('\n')
  }
}
