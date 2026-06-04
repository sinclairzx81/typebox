import { type Static, Type } from 'typebox'
import { Assert } from 'test'

// ------------------------------------------------------------------
// Varying Dependent Expressions
// ------------------------------------------------------------------
{
  {
    const T = Type.Script('if number then 1 else string')
    type T = Static<typeof T>
    Assert.IsExtendsMutual<T, 1 | string>(true)
  }
  {
    const T = Type.Script('if number then 1 else 1')
    type T = Static<typeof T>
    Assert.IsExtendsMutual<T, 1>(true)
  }
  {
    const T = Type.Script('if number then string else 1')
    type T = Static<typeof T>
    Assert.IsExtendsMutual<T, never>(true)
  }
  {
    const T = Type.Script('if number then string else string')
    type T = Static<typeof T>
    Assert.IsExtendsMutual<T, string>(true)
  }
  {
    const T = Type.Script('if (number|string) then string else number')
    type T = Static<typeof T>
    Assert.IsExtendsMutual<T, string>(true)
  }
  {
    const T = Type.Script('if (number|string) then number else number')
    type T = Static<typeof T>
    Assert.IsExtendsMutual<T, number>(true)
  }
  const T = Type.Script('if string then "hello" else "world"')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, 'hello'>(true)
}
{
  const T = Type.Script('if "a" then 42 else 0')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, 0>(true)
}
{
  const T = Type.Script('if (string | number) then boolean else boolean')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, boolean>(true)
}
{
  const T = Type.Script('if (string | number) then "yes" else "no"')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, 'yes'>(true)
}
{
  const T = Type.Script('if any then number else string')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, any>(true)
}
{
  const T = Type.Script('if never then number else string')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, string>(true)
}
{
  const T = Type.Script('if number then (if string then 1 else 2) else 3')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, 2>(true)
}
{
  const T = Type.Script('if number then (if never then 1 else 2) else 3')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, 2>(true)
}
{
  const T = Type.Script('if never then (if string then 1 else 2) else 3')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, 3>(true)
}
{
  const T = Type.Script('if boolean then "true" else "false"')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, 'false'>(true)
}
{
  const T = Type.Script('if { a: string } then object else 1[]')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<
    T,
    ({
      a: string
    } & object) | 1[]
  >(true)
}
{
  const T = Type.Script('if string then { status: "ok" } else { status: "error" }')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<
    T,
    (string & {
      status: 'ok'
    }) | {
      status: 'error'
    }
  >(true)
}
{
  const T = Type.Script('if string then (number | boolean) else string')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, never>(true)
}
{
  const T = Type.Script('if unknown then 1 else 0')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, 1>(true)
}
{
  const T = Type.Script('if ("yes" | "no") then string else number')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, number | 'yes' | 'no'>(true)
}
{
  const T = Type.Script('if (number & bigint) then 1 else 2')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, 2>(true)
}
{
  const T = Type.Script('if null then "isNull" else "isNotNull"')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, 'isNotNull'>(true)
}
{
  const T = Type.Script('if undefined then 100 else 200')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, 200>(true)
}
{
  const T = Type.Script('if void then string else number')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, number>(true)
}
{
  const T = Type.Script('if (string | never) then (1 | string) else number')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, string | number>(true)
}
{
  const T = Type.Script('if number then (if string then (if boolean then 1 else 2) else 3) else 4')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, 3>(true)
}
{
  const T = Type.Script('if string[] then "array" else "scalar"')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, 'scalar' | (string[] & 'array')>(true)
}
{
  const T = Type.Script('if "" then 1 else 2')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, 2>(true)
}
{
  const T = Type.Script('if 0 then "zero" else "nonzero"')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, 'nonzero'>(true)
}
{
  const T = Type.Script('if false then "f" else "t"')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, 't'>(true)
}
{
  const T = Type.Script('if true then "t" else "f"')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, 'f'>(true)
}
{
  const T = Type.Script('if (1 | string) then boolean else never')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, never>(true)
}
{
  const T = Type.Script('if (number | string) then "same" else "same"')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, 'same'>(true)
}
{
  const T = Type.Script('if [number, string] then 5 else 10')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, 10 | ([number, string] & 5)>(true)
}
{
  const T = Type.Script('if bigint then "huge" else "small"')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, 'small'>(true)
}
{
  const T = Type.Script('if symbol then "sym" else "nosym"')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, 'nosym'>(true)
}
{
  const T = Type.Script('if (string | boolean) then (if number then 1 else 2) else (if string then 3 else 4)')
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, 4>(true)
}
// ------------------------------------------------------------------
// Refinement
// ------------------------------------------------------------------
{
  const T = Type.Script(`{
    x: number
    y: number  
  } & if { x: 1 } then { y: 1 }`)
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, {
    y: number
    x: number
  }>(true)
}
{
  const T = Type.Script(`{
    x: number
    y: number  
  } & if { x: 1 } then { y: 1 } else unknown`)
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, {
    y: number
    x: number
  }>(true)
}
{
  const T = Type.Script(`{
    x: number
    y: number  
  } & if { x: 1 } then { y: 1 } else never`)
  type T = Static<typeof T>
  Assert.IsExtendsMutual<
    T,
    {
      x: number
      y: number
    } & {
      x: 1
    } & {
      y: 1
    }
  >(true)
}
// ------------------------------------------------------------------
// Constructive
// ------------------------------------------------------------------
{
  const T = Type.Script(`
    if { x: 1 } then 
    if { y: 1 } then
    { z: 1 }  
  `)
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, unknown>(true)
}
{
  const T = Type.Script(`
    if { x: 1 } then 
    if { y: 1 } then
    { z: 1 } else never
  `)
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, unknown>(true)
}
{
  const T = Type.Script(`
    if { x: 1 } then 
    if { y: 1 } then
    { z: 1 } else never else never
  `)
  type T = Static<typeof T>
  Assert.IsExtendsMutual<
    T,
    {
      x: 1
    } & {
      y: 1
    } & {
      z: 1
    }
  >(true)
}
{
  const { T } = Type.Script(`
    type T = (if { x: number } then { y: number } else never) &
             (if { a: string } then { b: string } else never)
  `)
  type T = Static<typeof T>
  Assert.IsExtendsMutual<
    T,
    {
      x: number
    } & {
      y: number
    } & {
      a: string
    } & {
      b: string
    }
  >(true)
}

// ------------------------------------------------------------------
// Conditional Dependent Expressions
// ------------------------------------------------------------------
{
  const { T } = Type.Script(`
    type T = (if { x: number } then
              if { y: number } then
              { z: number } else never else never)
              extends { x: number, y: number, z: number } ? true : false
  `)
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, true>(true)
}
{
  const { T } = Type.Script(`
    type T = ({ x: number } & if { x: number } then { y: number } else never)
              extends { x: number, y: number } ? true : false
  `)
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, true>(true)
}
{
  const { T } = Type.Script(`
    type T = ({ x: number } & if { x: number } then { y: number } else unknown)
              extends { x: number } ? true : false
  `)
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, true>(true)
}
{
  const { T } = Type.Script(`
    type T = ({ country: 'United States of America' } &
               if { country: 'United States of America' } then
               { postal_code: string } else
               { postal_code: string })
               extends { country: 'United States of America', postal_code: string } ? true : false
  `)
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, true>(true)
}
{
  const { T } = Type.Script(`
    type T = (if { a: number } then
              if { b: number } then
              if { c: number } then
              { d: number } else never else never else never)
              extends { a: number, b: number, c: number, d: number } ? true : false
  `)
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, true>(true)
}
{
  const { T } = Type.Script(`
    type T = (if { x: number } then { y: number })
              extends unknown ? true : false
  `)
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, true>(true)
}
{
  const { T } = Type.Script(`
    type T = (if { x: number } then { y: number })
              extends { y: number } ? true : false
  `)
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, false>(true)
}
// ------------------------------------------------------------------
// Parameterized
// ------------------------------------------------------------------
{
  const A = Type.Number()
  const B = Type.Literal(1)
  const T = Type.Script(
    { A, B },
    `{
   x: A
   y: A
 } & if { x: B | (1 extends 1 ? true: false) } then { y: B } else 
     if { y: 2 } then { x: 2 } else 
     never
`
  )
  type T = Static<typeof T>
  Assert.IsExtendsMutual<
    T,
    & {
      y: number
      x: number
    }
    & (
      | ({
        x: true | 1
      } & {
        y: 1
      })
      | ({
        y: 2
      } & {
        x: 2
      })
    )
  >(true)
}
