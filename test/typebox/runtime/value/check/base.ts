import Guard from 'typebox/guard'
import { Type } from 'typebox'
import { Fail, Ok } from './_validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.Base')

class TStringBase extends Type.Base<string> {
  public override Check(value: unknown): value is string {
    return typeof value === 'string'
  }
  public override Errors(value: unknown): object[] {
    return typeof value === 'string' ? [] : [{ message: 'expected string' }]
  }
}
const StringBase = () => new TStringBase()

// ------------------------------------------------------------------
// Direct
// ------------------------------------------------------------------
Test('Should validate Base 1', () => {
  const T: TStringBase = StringBase()
  Ok(T, 'hello')
})
Test('Should validate Base 2', () => {
  const T: TStringBase = StringBase()
  Fail(T, 1)
})
// ------------------------------------------------------------------
// Embedded
// ------------------------------------------------------------------
Test('Should validate Base 3', () => {
  const T = Type.Tuple([StringBase(), StringBase(), StringBase(), StringBase()])
  Ok(T, ['A', 'B', 'C', 'D'])
})
Test('Should validate Base 4', () => {
  const T = Type.Tuple([StringBase(), StringBase(), StringBase(), StringBase()])
  Fail(T, ['A', 'B', 'C', 1])
})
Test('Should validate Base 5', () => {
  const T = Type.Tuple([StringBase(), StringBase(), StringBase(), StringBase()])
  Fail(T, ['A', 'B', 'C'])
})
// ------------------------------------------------------------------
// Error Mapping: Validation Error | Throw Detection | Coverage
// ------------------------------------------------------------------
Test('Should validate Base 6', () => {
  class Foo extends Type.Base {
    override Check(value: unknown): value is unknown {
      return false
    }
    override Errors(): object[] {
      return [{
        keyword: '~base',
        schemaPath: '',
        instancePath: '',
        params: { issues: [{ message: '' }] },
        message: ''
      }]
    }
  }
  Fail(new Foo(), [])
})
Test('Should validate Base 7', () => {
  class Foo extends Type.Base {
    override Check(value: unknown): value is unknown {
      return false
    }
    override Errors(): object[] {
      return [{
        keyword: '~base',
        schemaPath: '',
        instancePath: '',
        params: { issues: [{ message: 1 }] },
        message: ''
      }]
    }
  }
  Fail(new Foo(), [])
})
Test('Should validate Base 8', () => {
  class Foo extends Type.Base {
    override Check(value: unknown): value is unknown {
      return false
    }
    override Errors(): object[] {
      return [{
        keyword: '~base',
        schemaPath: '',
        instancePath: '',
        params: { issues: null },
        message: ''
      }]
    }
  }
  Fail(new Foo(), [])
})
Test('Should validate Base 9', () => {
  class Foo extends Type.Base {
    override Check(value: unknown): value is unknown {
      return false
    }
    override Errors(): object[] {
      return [{
        keyword: '~base',
        schemaPath: '',
        instancePath: '',
        params: { issues: [{ message: '', path: [] }] }
      }]
    }
  }
  Fail(new Foo(), [])
})
// ------------------------------------------------------------------
// Error Mapping: Validator | Throw Detection | Coverage
// ------------------------------------------------------------------
Test('Should validate Base 10', () => {
  class Foo extends Type.Base {
    override Check(value: unknown): value is unknown {
      return false
    }
    override Errors(): object[] {
      return [{ path: [] }]
    }
  }
  Fail(new Foo(), [])
})
Test('Should validate Base 11', () => {
  class Foo extends Type.Base {
    override Check(value: unknown): value is unknown {
      return false
    }
    override Errors(): object[] {
      return [{ path: 1 }]
    }
  }
  Fail(new Foo(), [])
})
Test('Should validate Base 12', () => {
  class Foo extends Type.Base {
    override Check(value: unknown): value is unknown {
      return false
    }
    override Errors(): object[] {
      return [{ path: [1] }]
    }
  }
  Fail(new Foo(), [])
})
Test('Should validate Base 13', () => {
  class Foo extends Type.Base {
    override Check(value: unknown): value is unknown {
      return false
    }
    override Errors(): object[] {
      return [{}]
    }
  }
  Fail(new Foo(), [])
})
// ------------------------------------------------------------------
// Base Error | Validator
// ------------------------------------------------------------------
Test('Should validate Base 14', () => {
  class Foo extends Type.Base {
    override Check(value: unknown): value is unknown {
      return false
    }
    override Errors(value: unknown): object[] {
      return [{ foo: 1, bar: 2, baz: 3 }]
    }
  }
  const F = new Foo()
  const R = F.Errors(null) as [{ foo: 1; bar: 2; baz: 3 }]
  Assert.IsTrue(Guard.IsArray(R))
  const E = R[0]
  Assert.HasPropertyKey(E, 'foo')
  Assert.HasPropertyKey(E, 'bar')
  Assert.HasPropertyKey(E, 'baz')
})

Test('Should validate Base 15', () => {
  class Foo extends Type.Base {
    override Check(value: unknown): value is unknown {
      return false
    }
    override Errors(value: unknown): object[] {
      return [{ foo: 1, bar: 2, baz: 3 }]
    }
  }
  const F = new Foo()
  const R = F['~base'].errors(null)
  Assert.IsTrue(Guard.IsArray(R))
  const E = R[0]
  Assert.HasPropertyKey(E, 'foo')
  Assert.HasPropertyKey(E, 'bar')
  Assert.HasPropertyKey(E, 'baz')
})
