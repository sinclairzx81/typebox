import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'
import { GlobalsGuard } from 'typebox/guard'
const Test = Assert.Context('Value.Repair.Base')

// ------------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/1388
// ------------------------------------------------------------------
Test('Should Repair 1', () => {
  class DateType extends Type.Base<Date> {
    public override Check(value: unknown): value is Date {
      return value instanceof Date
    }
    public override Errors(value: unknown): object[] {
      return !this.Check(value) ? [{ message: 'not a Date' }] : []
    }
  }
  const T = Type.Object({
    createdDate: new DateType(),
    updatedDate: new DateType()
  })
  // Create override is required
  Assert.Throws(() => Value.Repair(T, { createdDate: new Date(0) }))
})
Test('Should Repair 2', () => {
  class DateType extends Type.Base<Date> {
    public override Create(): Date {
      return new Date()
    }
    public override Check(value: unknown): value is Date {
      return value instanceof Date
    }
    public override Errors(value: unknown): object[] {
      return !this.Check(value) ? [{ message: 'not a Date' }] : []
    }
  }
  const T = Type.Object({
    createdDate: new DateType(),
    updatedDate: new DateType()
  })
  const R = Value.Repair(T, { createdDate: new Date(0) })
  Assert.HasPropertyKey(R, 'createdDate')
  Assert.HasPropertyKey(R, 'updatedDate')
  Assert.IsTrue(GlobalsGuard.IsDate(R.createdDate))
  Assert.IsTrue(GlobalsGuard.IsDate(R.updatedDate))
  Assert.IsTrue(R.createdDate.getTime() === 0)
  Assert.IsTrue(R.updatedDate.getTime() !== 0)
})
