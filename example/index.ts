{
  'Should extend Object 1'

  type T = (new () => number) extends object ? 1 : 2

}
{
  type T = (new () => number) extends {} ? 1 : 2
}

type T = (new () => number) extends { length: number } ? 1 : 2

class X {}