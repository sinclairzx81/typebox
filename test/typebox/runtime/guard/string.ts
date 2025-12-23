import { Assert } from 'test'
import Guard from 'typebox/guard'

const Test = Assert.Context('StringGuard')

// ------------------------------------------------------------------
// Guard.GraphemeCount
// ------------------------------------------------------------------
Test('Should GraphemeCount 1', () => {
  Assert.IsEqual(Guard.GraphemeCount(''), 0)
})
Test('Should GraphemeCount 2', () => {
  Assert.IsEqual(Guard.GraphemeCount('a'), 1)
})
Test('Should GraphemeCount 3', () => {
  Assert.IsEqual(Guard.GraphemeCount('hello'), 5)
})
Test('Should GraphemeCount 4', () => {
  Assert.IsEqual(Guard.GraphemeCount('a b c'), 5)
})
Test('Should GraphemeCount 5', () => {
  Assert.IsEqual(Guard.GraphemeCount('!?.'), 3)
})
Test('Should GraphemeCount 6', () => {
  Assert.IsEqual(Guard.GraphemeCount('é'), 1)
})
Test('Should GraphemeCount 7', () => {
  Assert.IsEqual(Guard.GraphemeCount('éàè'), 3)
})
Test('Should GraphemeCount 8', () => {
  Assert.IsEqual(Guard.GraphemeCount('e\u0301'), 1)
})
Test('Should GraphemeCount 9', () => {
  Assert.IsEqual(Guard.GraphemeCount('a\u0301b\u0301'), 2)
})
Test('Should GraphemeCount 10', () => {
  Assert.IsEqual(Guard.GraphemeCount('漢字'), 2)
})
Test('Should GraphemeCount 11', () => {
  Assert.IsEqual(Guard.GraphemeCount('😄'), 1)
})
Test('Should GraphemeCount 12', () => {
  Assert.IsEqual(Guard.GraphemeCount('😄😄😄'), 3)
})
Test('Should GraphemeCount 13', () => {
  Assert.IsEqual(Guard.GraphemeCount('😄🎉🔥'), 3)
})
Test('Should GraphemeCount 14', () => {
  Assert.IsEqual(Guard.GraphemeCount('Hello 😄!'), 8)
})
Test('Should GraphemeCount 15', () => {
  Assert.IsEqual(Guard.GraphemeCount('𝄞'), 1)
})
Test('Should GraphemeCount 16', () => {
  Assert.IsEqual(Guard.GraphemeCount('𝄞𝄞'), 2)
})
Test('Should GraphemeCount 17', () => {
  Assert.IsEqual(Guard.GraphemeCount('A𝄞B'), 3)
})
Test('Should GraphemeCount 18', () => {
  Assert.IsEqual(Guard.GraphemeCount('a😄b'), 3)
})
Test('Should GraphemeCount 19', () => {
  Assert.IsEqual(Guard.GraphemeCount('😄🎉'), 2)
})
Test('Should GraphemeCount 20', () => {
  Assert.IsEqual(Guard.GraphemeCount('🗺️'), 1)
})
Test('Should GraphemeCount 21', () => {
  Assert.IsEqual(Guard.GraphemeCount('🗺️✈️'), 2)
})
Test('Should GraphemeCount 22', () => {
  Assert.IsEqual(Guard.GraphemeCount('🗺️a'), 2)
})
Test('Should GraphemeCount 23', () => {
  Assert.IsEqual(Guard.GraphemeCount('🗺️\u0301'), 1)
})
Test('Should GraphemeCount 24', () => {
  Assert.IsEqual(Guard.GraphemeCount('🇳🇿'), 1)
})
Test('Should GraphemeCount 25', () => {
  Assert.IsEqual(Guard.GraphemeCount('🇳🇿🇰🇷'), 2)
})
Test('Should GraphemeCount 26', () => {
  Assert.IsEqual(Guard.GraphemeCount('NZ🇳🇿'), 3)
})
Test('Should GraphemeCount 27', () => {
  Assert.IsEqual(Guard.GraphemeCount('🇳🇿😄'), 2)
})
Test('Should GraphemeCount 28', () => {
  Assert.IsEqual(Guard.GraphemeCount('a😄e\u0301'), 3)
})
Test('Should GraphemeCount 29', () => {
  Assert.IsEqual(Guard.GraphemeCount('😄🇳🇿e\u0301'), 3)
})
Test('Should GraphemeCount 30', () => {
  Assert.IsEqual(Guard.GraphemeCount('🧳🇰🇷abc'), 5)
})
Test('Should GraphemeCount 31', () => {
  Assert.IsEqual(Guard.GraphemeCount('a🇰🇷😄🗺️e\u0301'), 5)
})
Test('Should GraphemeCount 32', () => {
  Assert.IsEqual(Guard.GraphemeCount('🇳🇿🇰🇷🇯🇵'), 3)
})
Test('Should GraphemeCount 33', () => {
  Assert.IsEqual(Guard.GraphemeCount('a\u0301\u0323'), 1) // a + acute + dot below
})
Test('Should GraphemeCount 34', () => {
  Assert.IsEqual(Guard.GraphemeCount('\u0301b'), 2) // combining mark + b
})
Test('Should GraphemeCount 35', () => {
  Assert.IsEqual(Guard.GraphemeCount('\uDC00'), 1)
})
Test('Should GraphemeCount 36', () => {
  Assert.IsEqual(Guard.GraphemeCount('🏝️🛳️'), 2)
})
Test('Should GraphemeCount 37', () => {
  Assert.IsEqual(Guard.GraphemeCount('✈️🗺️'), 2)
})
Test('Should GraphemeCount 38', () => {
  Assert.IsEqual(Guard.GraphemeCount('a🇳🇿🧳b'), 4)
})
Test('Should GraphemeCount 39', () => {
  Assert.IsEqual(Guard.GraphemeCount('𝄞𝄢𝄫'), 3) // multiple musical symbols (surrogate pairs)
})
Test('Should GraphemeCount 40', () => {
  Assert.IsEqual(Guard.GraphemeCount('👩‍👩‍👧'), 1)
})
Test('Should GraphemeCount 41', () => {
  Assert.IsEqual(Guard.GraphemeCount('👨‍👩‍👧‍👦'), 1)
})
Test('Should GraphemeCount 42', () => {
  Assert.IsEqual(Guard.GraphemeCount('👩‍❤️‍💋‍👨'), 1)
})
Test('Should GraphemeCount 43', () => {
  Assert.IsEqual(Guard.GraphemeCount('👩‍❤️‍👩'), 1)
})
Test('Should GraphemeCount 44', () => {
  Assert.IsEqual(Guard.GraphemeCount('🧑‍🦱🧑‍🦰'), 2)
})
Test('Should GraphemeCount 45', () => {
  Assert.IsEqual(Guard.GraphemeCount('👨‍⚕️👩‍⚕️'), 2)
})
Test('Should GraphemeCount 46', () => {
  Assert.IsEqual(Guard.GraphemeCount('\u0301'), 1)
})
Test('Should GraphemeCount 47', () => {
  Assert.IsEqual(Guard.GraphemeCount('\u0300'), 1)
})
Test('Should GraphemeCount 48', () => {
  Assert.IsEqual(Guard.GraphemeCount('a\u0301'), 1)
})
Test('Should GraphemeCount 49', () => {
  Assert.IsEqual(Guard.GraphemeCount('e\u0300'), 1)
})
Test('Should GraphemeCount 50', () => {
  Assert.IsEqual(Guard.GraphemeCount('a\u0301\u0323'), 1)
})
// ------------------------------------------------------------------
// Guard.IsMinLength
// ------------------------------------------------------------------
Test('Should IsMinLength 1', () => {
  Assert.IsTrue(Guard.IsMinLength('a', 1))
})
Test('Should IsMinLength 2', () => {
  Assert.IsFalse(Guard.IsMinLength('a', 2))
})
Test('Should IsMinLength 3', () => {
  Assert.IsTrue(Guard.IsMinLength('abc', 3))
})
Test('Should IsMinLength 4', () => {
  Assert.IsTrue(Guard.IsMinLength('abc', 2))
})
Test('Should IsMinLength 5', () => {
  Assert.IsTrue(Guard.IsMinLength('e\u0301', 1))
})
Test('Should IsMinLength 6', () => {
  Assert.IsFalse(Guard.IsMinLength('e\u0301', 2))
})
Test('Should IsMinLength 7', () => {
  Assert.IsTrue(Guard.IsMinLength('a\u0301\u0323b', 2))
})
Test('Should IsMinLength 8', () => {
  Assert.IsFalse(Guard.IsMinLength('a\u0301\u0323b', 3))
})
Test('Should IsMinLength 9', () => {
  Assert.IsTrue(Guard.IsMinLength('😄', 1))
})
Test('Should IsMinLength 10', () => {
  Assert.IsFalse(Guard.IsMinLength('😄', 2))
})
Test('Should IsMinLength 11', () => {
  Assert.IsTrue(Guard.IsMinLength('😄😄', 2))
})
Test('Should IsMinLength 12', () => {
  Assert.IsTrue(Guard.IsMinLength('😄😄', 1))
})
Test('Should IsMinLength 13', () => {
  Assert.IsTrue(Guard.IsMinLength('👩‍❤️‍💋‍👨', 1))
})
Test('Should IsMinLength 14', () => {
  Assert.IsFalse(Guard.IsMinLength('👩‍❤️‍💋‍👨', 2))
})
Test('Should IsMinLength 15', () => {
  Assert.IsTrue(Guard.IsMinLength('👨‍👩‍👧‍👦👩‍👩‍👧', 2))
})
Test('Should IsMinLength 16', () => {
  Assert.IsFalse(Guard.IsMinLength('👨‍👩‍👧‍👦👩‍👩‍👧', 3))
})
Test('Should IsMinLength 17', () => {
  Assert.IsTrue(Guard.IsMinLength('🇳🇿', 1))
})
Test('Should IsMinLength 18', () => {
  Assert.IsFalse(Guard.IsMinLength('🇳🇿', 2))
})
Test('Should IsMinLength 19', () => {
  Assert.IsTrue(Guard.IsMinLength('🇳🇿🇰🇷', 2))
})
Test('Should IsMinLength 20', () => {
  Assert.IsTrue(Guard.IsMinLength('🇳🇿🇰🇷', 1))
})
Test('Should IsMinLength 21', () => {
  Assert.IsTrue(Guard.IsMinLength('a🇳🇿😄', 3))
})
Test('Should IsMinLength 22', () => {
  Assert.IsFalse(Guard.IsMinLength('a🇳🇿😄', 4))
})
Test('Should IsMinLength 23', () => {
  Assert.IsTrue(Guard.IsMinLength('🏝️🛳️', 2))
})
Test('Should IsMinLength 24', () => {
  Assert.IsFalse(Guard.IsMinLength('🏝️🛳️', 3))
})
// ------------------------------------------------------------------
// Guard.IsMaxLength
// ------------------------------------------------------------------
Test('Should IsMaxLength 1', () => {
  Assert.IsTrue(Guard.IsMaxLength('a', 1))
})
Test('Should IsMaxLength 2', () => {
  Assert.IsTrue(Guard.IsMaxLength('a', 2))
})
Test('Should IsMaxLength 3', () => {
  Assert.IsFalse(Guard.IsMaxLength('abc', 2))
})
Test('Should IsMaxLength 4', () => {
  Assert.IsTrue(Guard.IsMaxLength('abc', 3))
})
Test('Should IsMaxLength 5', () => {
  Assert.IsTrue(Guard.IsMaxLength('e\u0301', 1))
})
Test('Should IsMaxLength 6', () => {
  Assert.IsTrue(Guard.IsMaxLength('e\u0301', 2))
})
Test('Should IsMaxLength 7', () => {
  Assert.IsFalse(Guard.IsMaxLength('a\u0301\u0323b', 1))
})
Test('Should IsMaxLength 8', () => {
  Assert.IsTrue(Guard.IsMaxLength('a\u0301\u0323b', 2))
})
Test('Should IsMaxLength 9', () => {
  Assert.IsTrue(Guard.IsMaxLength('😄', 1))
})
Test('Should IsMaxLength 10', () => {
  Assert.IsTrue(Guard.IsMaxLength('😄', 2))
})
Test('Should IsMaxLength 11', () => {
  Assert.IsTrue(Guard.IsMaxLength('😄😄', 2))
})
Test('Should IsMaxLength 12', () => {
  Assert.IsFalse(Guard.IsMaxLength('😄😄', 1))
})
Test('Should IsMaxLength 13', () => {
  Assert.IsTrue(Guard.IsMaxLength('👩‍❤️‍💋‍👨', 1))
})
Test('Should IsMaxLength 14', () => {
  Assert.IsTrue(Guard.IsMaxLength('👩‍❤️‍💋‍👨', 2))
})
Test('Should IsMaxLength 15', () => {
  Assert.IsTrue(Guard.IsMaxLength('👨‍👩‍👧‍👦👩‍👩‍👧', 2))
})
Test('Should IsMaxLength 16', () => {
  Assert.IsFalse(Guard.IsMaxLength('👨‍👩‍👧‍👦👩‍👩‍👧', 1))
})
Test('Should IsMaxLength 17', () => {
  Assert.IsTrue(Guard.IsMaxLength('🇳🇿', 1))
})
Test('Should IsMaxLength 18', () => {
  Assert.IsTrue(Guard.IsMaxLength('🇳🇿', 2))
})
Test('Should IsMaxLength 19', () => {
  Assert.IsFalse(Guard.IsMaxLength('🇳🇿🇰🇷', 1))
})
Test('Should IsMaxLength 20', () => {
  Assert.IsTrue(Guard.IsMaxLength('🇳🇿🇰🇷', 2))
})
Test('Should IsMaxLength 21', () => {
  Assert.IsFalse(Guard.IsMaxLength('a🇳🇿😄', 2))
})
Test('Should IsMaxLength 22', () => {
  Assert.IsTrue(Guard.IsMaxLength('a🇳🇿😄', 3))
})
Test('Should IsMaxLength 23', () => {
  Assert.IsTrue(Guard.IsMaxLength('🏝️🛳️', 2))
})
Test('Should IsMaxLength 24', () => {
  Assert.IsFalse(Guard.IsMaxLength('🏝️🛳️', 1))
})
// ------------------------------------------------------------------
// Guard.FastPath Tests
// ------------------------------------------------------------------
Test('Should FastPath 1', () => {
  Assert.IsTrue(Guard.IsMinLength('abc', 2))
})
Test('Should FastPath 2', () => {
  Assert.IsTrue(Guard.IsMinLength('abc', 3))
})
Test('Should FastPath 3', () => {
  Assert.IsFalse(Guard.IsMinLength('abc', 4))
})
Test('Should FastPath 4', () => {
  Assert.IsTrue(Guard.IsMaxLength('abc', 3))
})
Test('Should FastPath 5', () => {
  Assert.IsFalse(Guard.IsMaxLength('abcd', 3))
})
Test('Should FastPath 6', () => {
  Assert.IsEqual(Guard.GraphemeCount('𝄞'), 1)
})
Test('Should FastPath 7', () => {
  Assert.IsEqual(Guard.GraphemeCount('𝄞𝄢𝄫'), 3)
})
Test('Should FastPath 8', () => {
  Assert.IsEqual(Guard.GraphemeCount('A𝄞B'), 3)
})
Test('Should FastPath 9', () => {
  Assert.IsEqual(Guard.GraphemeCount('👩‍👩‍👧'), 1)
})
Test('Should FastPath 10', () => {
  Assert.IsEqual(Guard.GraphemeCount('👨‍👩‍👧‍👦'), 1)
})
Test('Should FastPath 11', () => {
  Assert.IsEqual(Guard.GraphemeCount('👩‍❤️‍💋‍👨👩‍👩‍👧👨‍👩‍👧‍👦'), 3)
})
Test('Should FastPath 12', () => {
  Assert.IsEqual(Guard.GraphemeCount('🇳🇿'), 1)
})
Test('Should FastPath 13', () => {
  Assert.IsEqual(Guard.GraphemeCount('🇳🇿🇰🇷🇯🇵'), 3)
})
Test('Should FastPath 14', () => {
  Assert.IsEqual(Guard.GraphemeCount('a🇰🇷😄'), 3)
})
Test('Should FastPath 15', () => {
  Assert.IsEqual(Guard.GraphemeCount('a\u0301\u0323'), 1)
})
Test('Should FastPath 16', () => {
  Assert.IsEqual(Guard.GraphemeCount('\u0301\u0323b'), 2)
})
Test('Should FastPath 17', () => {
  Assert.IsEqual(Guard.GraphemeCount('🗺️'), 1)
})
Test('Should FastPath 18', () => {
  Assert.IsEqual(Guard.GraphemeCount('🗺️✈️'), 2)
})
Test('Should FastPath 19', () => {
  Assert.IsTrue(Guard.IsMinLength('e\u0301', 1))
})
Test('Should FastPath 20', () => {
  Assert.IsTrue(Guard.IsMaxLength('👩‍👩‍👧', 1))
})
Test('Should FastPath 21', () => {
  Assert.IsEqual(Guard.GraphemeCount(''), 0)
})
Test('Should FastPath 22', () => {
  Assert.IsEqual(Guard.GraphemeCount('\u0301'), 1)
})
Test('Should FastPath 23', () => {
  Assert.IsEqual(Guard.GraphemeCount('\uDC00'), 1)
})
