import * as Module from 'typebox/module'
import * as Type from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Module.Build')

// ------------------------------------------------------------------
// Invalid Variable Name
// ------------------------------------------------------------------
Test('Should Build 0', () => {
  Assert.Throws(() => Module.Build({ '0': Type.String() }))
})
Test('Should Build 1', () => {
  Assert.Throws(() => Module.Build({ '1A': Type.String() }))
})
Test('Should Build 2', () => {
  Assert.Throws(() => Module.Build({ '': Type.String() }))
})
Test('Should Build 3', () => {
  Assert.Throws(() => Module.Build({ 'A B': Type.String() }))
})
Test('Should Build 4', () => {
  Assert.Throws(() => Module.Build({ 'A\nB': Type.String() }))
})
Test('Should Build 5', () => {
  Assert.Throws(() => Module.Build({ 'A-B': Type.String() }))
})
Test('Should Build 6', () => {
  Assert.Throws(() => Module.Build({ 'A.B': Type.String() }))
})
Test('Should Build 7', () => {
  Assert.Throws(() => Module.Build({ 'A/B': Type.String() }))
})
Test('Should Build 8', () => {
  Assert.Throws(() => Module.Build({ '@A': Type.String() }))
})
Test('Should Build 9', () => {
  Assert.Throws(() => Module.Build({ '#A': Type.String() }))
})
Test('Should Build 10', () => {
  Assert.Throws(() => Module.Build({ 'A()': Type.String() }))
})
Test('Should Build 11', () => {
  Assert.Throws(() => Module.Build({ 'class': Type.String() }))
})
Test('Should Build 12', () => {
  Assert.Throws(() => Module.Build({ 'function': Type.String() }))
})
Test('Should Build 13', () => {
  Assert.Throws(() => Module.Build({ 'return': Type.String() }))
})
Test('Should Build 14', () => {
  Assert.Throws(() => Module.Build({ 'null': Type.String() }))
})
// ------------------------------------------------------------------
// Injection Guards
// ------------------------------------------------------------------
Test('Should Build 15', () => {
  Assert.Throws(() => Module.Build({ 'A = 1; throw 1': Type.String() }))
})
Test('Should Build 16', () => {
  Assert.Throws(() => Module.Build({ '"; process.exit(); "': Type.String() }))
})
Test('Should Build 17', () => {
  Assert.Throws(() => Module.Build({ 'A) { } function B(': Type.String() }))
})
