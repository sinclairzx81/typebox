import { Hashing } from 'typebox/system'
import { Assert } from 'test'

const Test = Assert.Context('System.Hashing')

Test('Should hash number', () => {
  Assert.IsEqual('string', typeof Hashing.Hash(1))
  const A = Hashing.Hash(1)
  const B = Hashing.Hash(2)
  Assert.NotEqual(A, B)
})
Test('Should hash string', () => {
  Assert.IsEqual('string', typeof Hashing.Hash('hello'))
  const A = Hashing.Hash('hello')
  const B = Hashing.Hash('world')
  Assert.NotEqual(A, B)
})
Test('Should hash boolean', () => {
  Assert.IsEqual('string', typeof Hashing.Hash(true))
  Assert.IsEqual('string', typeof Hashing.Hash(false))
  const A = Hashing.Hash(true)
  const B = Hashing.Hash(false)
  Assert.NotEqual(A, B)
})
Test('Should hash null', () => {
  Assert.IsEqual('string', typeof Hashing.Hash(null))
  const A = Hashing.Hash(null)
  const B = Hashing.Hash(undefined)
  Assert.NotEqual(A, B)
})
Test('Should hash array', () => {
  Assert.IsEqual('string', typeof Hashing.Hash([0, 1, 2, 3]))
  const A = Hashing.Hash([0, 1, 2, 3])
  const B = Hashing.Hash([0, 2, 2, 3])
  Assert.NotEqual(A, B)
})
Test('Should hash object 1', () => {
  Assert.IsEqual('string', typeof Hashing.Hash({ x: 1, y: 2 }))
  const A = Hashing.Hash({ x: 1, y: 2 })
  const B = Hashing.Hash({ x: 2, y: 2 })
  Assert.NotEqual(A, B)
})
Test('Should hash object 2', () => {
  const A = Hashing.Hash({ x: 1, y: [1, 2] })
  const B = Hashing.Hash({ x: 1, y: [1, 3] })
  Assert.NotEqual(A, B)
})
Test('Should hash object 3', () => {
  const A = Hashing.Hash({ x: 1, y: undefined })
  const B = Hashing.Hash({ x: 1 })
  Assert.NotEqual(A, B)
})
Test('Should hash object 4', () => {
  const A = Hashing.Hash({ x: 1, y: new Uint8Array([0, 1, 2]) })
  const B = Hashing.Hash({ x: 1, y: [0, 1, 2] })
  Assert.NotEqual(A, B)
})
Test('Should hash object 5', () => {
  const A = Hashing.Hash({ x: 1, y: undefined })
  const B = Hashing.Hash({ x: 2, y: undefined })
  Assert.NotEqual(A, B)
})
Test('Should hash Date', () => {
  Assert.IsEqual('string', typeof Hashing.Hash(new Date()))
  const A = Hashing.Hash(new Date(1))
  const B = Hashing.Hash(new Date(2))
  Assert.NotEqual(A, B)
})
Test('Should hash Uint8Array', () => {
  Assert.IsEqual('string', typeof Hashing.Hash(new Uint8Array([0, 1, 2, 3])))
  const A = Hashing.Hash(new Uint8Array([0, 1, 2, 3]))
  const B = Hashing.Hash(new Uint8Array([0, 2, 2, 3]))
  Assert.NotEqual(A, B)
})
Test('Should hash undefined', () => {
  Assert.IsEqual('string', typeof Hashing.Hash(undefined))
  const A = Hashing.Hash(undefined)
  const B = Hashing.Hash(null)
  Assert.NotEqual(A, B)
})
Test('Should hash symbol 1', () => {
  Assert.IsEqual('string', typeof Hashing.Hash(Symbol()))
  const A = Hashing.Hash(Symbol(1))
  const B = Hashing.Hash(Symbol())
  Assert.NotEqual(A, B)
})
Test('Should hash symbol 2', () => {
  Assert.IsEqual('string', typeof Hashing.Hash(Symbol()))
  const A = Hashing.Hash(Symbol(1))
  const B = Hashing.Hash(Symbol(2))
  Assert.NotEqual(A, B)
})
Test('Should hash symbol 2', () => {
  Assert.IsEqual('string', typeof Hashing.Hash(Symbol()))
  const A = Hashing.Hash(Symbol(1))
  const B = Hashing.Hash(Symbol(1))
  Assert.IsEqual(A, B)
})
Test('Should hash bigint 1', () => {
  Assert.IsEqual('string', typeof Hashing.Hash(BigInt(1)))
  const A = Hashing.Hash(BigInt(1))
  const B = Hashing.Hash(BigInt(2))
  Assert.NotEqual(A, B)
})
Test('Should hash bigint 2', () => {
  Assert.IsEqual('string', typeof Hashing.Hash(BigInt(1)))
  const A = Hashing.Hash(BigInt(1))
  const B = Hashing.Hash(BigInt(1))
  Assert.IsEqual(A, B)
})
// ----------------------------------------------------------------
// Unicode
// ----------------------------------------------------------------
Test('Should hash unicode 1 (retain single byte hash)', () => {
  const hash = Hashing.Hash('a')
  Assert.IsEqual(hash, '08546307b5081774')
})
Test('Should hash unicode 2', () => {
  const hash = Hashing.Hash('안녕 세계')
  Assert.IsEqual(hash, 'd4ef6bafd6d9615e')
})
// ----------------------------------------------------------------
// TypeArray
// ----------------------------------------------------------------
Test('Should hash TypeArray 1', () => {
  const A = Hashing.Hash(new Float32Array([1, 2, 3]))
  const B = Hashing.Hash(new Float32Array([1, 2, 3]))
  Assert.IsEqual(A, B)
})
Test('Should hash TypeArray 2', () => {
  const A = Hashing.Hash(new Float32Array([1, 2, 3]))
  const B = Hashing.Hash(new Float32Array([1, 2, 4]))
  Assert.NotEqual(A, B)
})
Test('Should hash TypeArray 3', () => {
  const A = Hashing.Hash(new Float32Array([1, 2, 3]))
  const B = Hashing.Hash(new Uint8Array(new Float32Array([1, 2, 3]).buffer))
  Assert.IsEqual(A, B)
})
// ----------------------------------------------------------------
// Function
// ----------------------------------------------------------------
Test('Should hash Function 1', () => {
  const A = Hashing.Hash(function () {
    return 1
  })
  const B = Hashing.Hash(function () {
    return 1
  })
  Assert.IsEqual(A, B)
})
Test('Should hash Function 2', () => {
  const A = Hashing.Hash(function () {
    return 1
  })
  const B = Hashing.Hash(function () {
    return 2
  })
  Assert.NotEqual(A, B)
})
Test('Should hash Function 3', () => {
  const A = Hashing.Hash(() => {
    return 1
  })
  const B = Hashing.Hash(() => {
    return 1
  })
  Assert.IsEqual(A, B)
})
Test('Should hash Function 4', () => {
  const A = Hashing.Hash(() => {
    return 1
  })
  const B = Hashing.Hash(() => {
    return 2
  })
  Assert.NotEqual(A, B)
})
// ----------------------------------------------------------------
// Constructor
// ----------------------------------------------------------------
Test('Should hash Constructor 1', () => {
  const A = Hashing.Hash(
    class Foo {
      x() {}
    }
  )
  const B = Hashing.Hash(
    class Foo {
      x() {}
    }
  )
  Assert.IsEqual(A, B)
})
Test('Should hash Constructor 2', () => {
  const A = Hashing.Hash(
    class Foo {
      x() {}
    }
  )
  const B = Hashing.Hash(
    class Foo {
      y() {}
    }
  )
  Assert.NotEqual(A, B)
})
Test('Should hash Constructor 3', () => {
  const A = Hashing.Hash(
    class Foo {
      x() {}
    }
  )
  const B = Hashing.Hash(
    class {
      x() {}
    }
  )
  Assert.NotEqual(A, B)
})
Test('Should hash Constructor 4', () => {
  const A = Hashing.Hash(
    class {
      x() {}
    }
  )
  const B = Hashing.Hash(
    class {
      x() {}
    }
  )
  Assert.IsEqual(A, B)
})
Test('Should hash Constructor 5', () => {
  const A = Hashing.Hash(
    class {
      x() {}
    }
  )
  const B = Hashing.Hash(
    class {
      y() {}
    }
  )
  Assert.NotEqual(A, B)
})
Test('Should hash Constructor 6', () => {
  const A = Hashing.Hash(
    class {
      x() {}
    }
  )
  const B = Hashing.Hash(class {})
  Assert.NotEqual(A, B)
})
Test('Should hash Constructor 7', () => {
  const A = Hashing.Hash(class {})
  const B = Hashing.Hash(class {})
  Assert.IsEqual(A, B)
})
// ----------------------------------------------------------------
// RegExp
// ----------------------------------------------------------------
Test('Should hash RegExp 1', () => {
  const A = Hashing.Hash(/abc/)
  const B = Hashing.Hash(/abc/)
  Assert.IsEqual(A, B)
})
Test('Should hash RegExp 2', () => {
  const A = Hashing.Hash(/abc/)
  const B = Hashing.Hash(/cba/)
  Assert.NotEqual(A, B)
})

// ----------------------------------------------------------------
// Instance
// ----------------------------------------------------------------
Test('Should hash Instance 1', () => {
  class A {}
  class B {}
  const a = Hashing.Hash(new A())
  const b = Hashing.Hash(new B())
  Assert.IsEqual(a, b)
})
Test('Should hash Instance 2', () => {
  class A {
    x() {}
  }
  class B {}
  const a = Hashing.Hash(new A())
  const b = Hashing.Hash(new B())
  Assert.NotEqual(a, b)
})
// ----------------------------------------------------------------
// Instance
// ----------------------------------------------------------------
Test('Should hash misc 1', () => {
  const A = Hashing.Hash(new String('1'))
  const B = Hashing.Hash(new String('1'))
  Assert.IsEqual(A, B)
})
Test('Should hash misc 2', () => {
  const A = Hashing.Hash(new String('1'))
  const B = Hashing.Hash(new String('2'))
  Assert.NotEqual(A, B)
})
Test('Should hash misc 3', () => {
  const A = Hashing.Hash(new Number(1))
  const B = Hashing.Hash(new Number(1))
  Assert.IsEqual(A, B)
})
Test('Should hash misc 4', () => {
  const A = Hashing.Hash(new Number(1))
  const B = Hashing.Hash(new Number(2))
  Assert.NotEqual(A, B)
})
Test('Should hash misc 3', () => {
  const A = Hashing.Hash(new Boolean(true))
  const B = Hashing.Hash(new Boolean(true))
  Assert.IsEqual(A, B)
})
Test('Should hash misc 4', () => {
  const A = Hashing.Hash(new Boolean(true))
  const B = Hashing.Hash(new Boolean(false))
  Assert.NotEqual(A, B)
})
