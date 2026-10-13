export function IsSamePropertyValue(
  left: object,
  right: object,
  key: PropertyKey
): void {
  const leftValue = Object.getOwnPropertyDescriptor(left, key)?.value
  const rightValue = Object.getOwnPropertyDescriptor(right, key)?.value
  if (!Object.is(leftValue, rightValue)) {
    throw new Error(`Expected property '${String(key)}' to be preserved`)
  }
}
