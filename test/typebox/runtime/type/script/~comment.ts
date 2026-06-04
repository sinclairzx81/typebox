import { Assert } from 'test'
import * as Type from 'typebox'
import { Guard } from 'typebox/guard'

// ------------------------------------------------------------------
// These tests kick up the input tokenizers. TypeBox currently
// (as of writing these tests) implements comment discard local
// to the project, but comment discard needs to be moved into
// ParseBox along with other JavaScript token types (todo)
// ------------------------------------------------------------------
const Test = Assert.Context('Type.Script.Comment')

// ------------------------------------------------------------------
// Line
// ------------------------------------------------------------------
Test('Should Comment 1', () => {
  const T: Type.TObject<{
    x: Type.TNumber
    y: Type.TNumber
  }> = Type.Script(`{
    x: number  // x
    y: number  // y
  }`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
  Assert.IsEqual(Guard.Keys(T.properties).length, 2)
})

Test('Should Comment 2', () => {
  const T: Type.TObject<{
    y: Type.TNumber
  }> = Type.Script(`{
    // x: number
    y: number
  }`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
  Assert.IsEqual(Guard.Keys(T.properties).length, 1)
})

Test('Should Comment 3', () => {
  const T: Type.TObject<{
    x: Type.TNumber
    y: Type.TNumber
  }> = Type.Script(`
  // leading  
  {
    x: number
    y: number
  }`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
  Assert.IsEqual(Guard.Keys(T.properties).length, 2)
})
Test('Should Comment 4', () => {
  const T: Type.TObject<{
    x: Type.TNumber
    y: Type.TNumber
  }> = Type.Script(`
  // leading { x: string }
  {
    x: number
    y: number
  }`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
  Assert.IsEqual(Guard.Keys(T.properties).length, 2)
})
Test('Should Comment 5', () => {
  const T: Type.TObject<{
    x: Type.TNumber
    y: Type.TNumber
  }> = Type.Script(`{
    // x
    x: number
    // y
    y: number
  }`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
  Assert.IsEqual(Guard.Keys(T.properties).length, 2)
})
Test('Should Comment 6', () => {
  const T: Type.TNever = Type.Script(`
  // {
  }
  {
    x: number
    y: number
  }`)
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Comment 7', () => {
  const T: Type.TObject<{
    x: Type.TNumber
    y: Type.TNumber
  }> = Type.Script(`{
    x: number  // x
    y: number  // y
  } // trailing`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
  Assert.IsEqual(Guard.Keys(T.properties).length, 2)
})
Test('Should Comment 8', () => {
  const { X, Y } = Type.Script(`
    // X
    type X = { x: number }
    // Y
    type Y = { y: number }
  `)
  Assert.IsTrue(Type.IsObject(X))
  Assert.IsTrue(Type.IsObject(Y))
  Assert.IsTrue(Type.IsNumber(X.properties.x))
  Assert.IsTrue(Type.IsNumber(Y.properties.y))
})
Test('Should Comment 9', () => {
  const { X, Y } = Type.Script(`
    type X = { x: number } // X
    type Y = { y: number } // Y
  `)
  Assert.IsTrue(Type.IsObject(X))
  Assert.IsTrue(Type.IsObject(Y))
  Assert.IsTrue(Type.IsNumber(X.properties.x))
  Assert.IsTrue(Type.IsNumber(Y.properties.y))
})
Test('Should Comment 10', () => {
  const { X, Y } = Type.Script(`
    type X = { x: number } // X //
    type Y = { y: number } // Y //
  `)
  Assert.IsTrue(Type.IsObject(X))
  Assert.IsTrue(Type.IsObject(Y))
  Assert.IsTrue(Type.IsNumber(X.properties.x))
  Assert.IsTrue(Type.IsNumber(Y.properties.y))
})
// ------------------------------------------------------------------
// Multiline
// ------------------------------------------------------------------
Test('Should Comment 11', () => {
  const T = Type.Script(`{
    x: number /* x */
    y: number /* y */
  }`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
  Assert.IsEqual(Guard.Keys(T.properties).length, 2)
})
Test('Should Comment 12', () => {
  const T = Type.Script(`/* x */ {
    x: number 
    y: number
  }`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
  Assert.IsEqual(Guard.Keys(T.properties).length, 2)
})
Test('Should Comment 13', () => {
  const T = Type.Script(`{
    /* x: number */
    y: number
  }`)
  Assert.IsTrue(Type.IsObject(T))

  Assert.IsTrue(Type.IsNumber(T.properties.y))
  Assert.IsEqual(Guard.Keys(T.properties).length, 1)
})
Test('Should Comment 14', () => {
  const T = Type.Script(`{
     x /**/: number 
    y: number
  }`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
  Assert.IsEqual(Guard.Keys(T.properties).length, 2)
})
Test('Should Comment 15', () => {
  const T: Type.TUnion<[Type.TLiteral<1>, Type.TLiteral<2>]> = Type.Script(`
    1 /* x */ | 2
  `)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 1)
  Assert.IsEqual(T.anyOf[1].const, 2)
})
Test('Should Comment 16', () => {
  const T = Type.Script(`
    1 /* x */ & 2
  `)
  Assert.IsTrue(Type.IsIntersect(T))
  Assert.IsEqual(T.allOf[0].const, 1)
  Assert.IsEqual(T.allOf[1].const, 2)
})
Test('Should Comment 17', () => {
  const T: Type.TIntersect<[
    Type.TObject<{ x: Type.TLiteral<1> }>,
    Type.TLiteral<2>
  ]> = Type.Script(`
    { x: /* x */ 1 } /* x */ & 2
  `)
  Assert.IsTrue(Type.IsIntersect(T))
  Assert.IsEqual(T.allOf[0].properties.x.const, 1)
  Assert.IsEqual(T.allOf[1].const, 2)
})
Test('Should Comment 18', () => {
  const T: Type.TTemplateLiteral<'^(1|2)$'> = Type.Script(`
    type T = \`\${1 | /* hello */ 2 }\`
  `).T
  Assert.IsTrue(Type.IsTemplateLiteral(T))
  Assert.IsEqual(T.pattern, '^(1|2)$')
})
// ------------------------------------------------------------------
// Pathological
// ------------------------------------------------------------------
Test('Should Comment 19', () => {
  const T: Type.TObject<{
    x: Type.TNumber
    y: Type.TNumber
  }> = Type.Script(`
    /*--------------------------------------------------------------------------

    TypeBox

    The MIT License (MIT)

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

    // ------------------------------------------------------------------
    // Vector | Standard Vector Type
    // ------------------------------------------------------------------
    export /* optional */ type Vector =
    {
      /** 
       * The x property 
       * @additional Specifys the x axis offset
       * 
       */
      x: number
      /** 
       * The y property 
       * @additional Specifys the x axis offset
       */
      y: number // should we use uppercase?
    }
  `).Vector
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
  Assert.IsEqual(Guard.Keys(T.properties).length, 2)
})
