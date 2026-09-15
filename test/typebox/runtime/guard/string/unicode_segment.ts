import { Assert } from 'test'
import * as UnicodeSegmentGuard from '../../../../../src/guard/unicode/unicode_segment.ts' // (Internal)

const Test = Assert.Context('Guard.UnicodeSegmentGuard')

// ------------------------------------------------------------------
// UnicodeSegmentGuard.GraphemeCount
// ------------------------------------------------------------------
Test('Should GraphemeCount 1', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount(''), 0)
})
Test('Should GraphemeCount 2', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('a'), 1)
})
Test('Should GraphemeCount 3', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('hello'), 5)
})
Test('Should GraphemeCount 4', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('a b c'), 5)
})
Test('Should GraphemeCount 5', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('!?.'), 3)
})
Test('Should GraphemeCount 6', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('é'), 1)
})
Test('Should GraphemeCount 7', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('éàè'), 3)
})
Test('Should GraphemeCount 8', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('e\u0301'), 1)
})
Test('Should GraphemeCount 9', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('a\u0301b\u0301'), 2)
})
Test('Should GraphemeCount 10', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('漢字'), 2)
})
Test('Should GraphemeCount 11', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('😄'), 1)
})
Test('Should GraphemeCount 12', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('😄😄😄'), 3)
})
Test('Should GraphemeCount 13', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('😄🎉🔥'), 3)
})
Test('Should GraphemeCount 14', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('Hello 😄!'), 8)
})
Test('Should GraphemeCount 15', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('𝄞'), 1)
})
Test('Should GraphemeCount 16', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('𝄞𝄞'), 2)
})
Test('Should GraphemeCount 17', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('A𝄞B'), 3)
})
Test('Should GraphemeCount 18', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('a😄b'), 3)
})
Test('Should GraphemeCount 19', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('😄🎉'), 2)
})
Test('Should GraphemeCount 20', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('🗺️'), 1)
})
Test('Should GraphemeCount 21', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('🗺️✈️'), 2)
})
Test('Should GraphemeCount 22', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('🗺️a'), 2)
})
Test('Should GraphemeCount 23', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('🗺️\u0301'), 1)
})
Test('Should GraphemeCount 24', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('🇳🇿'), 1)
})
Test('Should GraphemeCount 25', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('🇳🇿🇰🇷'), 2)
})
Test('Should GraphemeCount 26', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('NZ🇳🇿'), 3)
})
Test('Should GraphemeCount 27', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('🇳🇿😄'), 2)
})
Test('Should GraphemeCount 28', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('a😄e\u0301'), 3)
})
Test('Should GraphemeCount 29', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('😄🇳🇿e\u0301'), 3)
})
Test('Should GraphemeCount 30', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('🧳🇰🇷abc'), 5)
})
Test('Should GraphemeCount 31', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('a🇰🇷😄🗺️e\u0301'), 5)
})
Test('Should GraphemeCount 32', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('🇳🇿🇰🇷🇯🇵'), 3)
})
Test('Should GraphemeCount 33', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('a\u0301\u0323'), 1) // a + acute + dot below
})
Test('Should GraphemeCount 34', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('\u0301b'), 2) // combining mark + b
})
Test('Should GraphemeCount 35', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('\uDC00'), 1)
})
Test('Should GraphemeCount 36', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('🏝️🛳️'), 2)
})
Test('Should GraphemeCount 37', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('✈️🗺️'), 2)
})
Test('Should GraphemeCount 38', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('a🇳🇿🧳b'), 4)
})
Test('Should GraphemeCount 39', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('𝄞𝄢𝄫'), 3) // multiple musical symbols (surrogate pairs)
})
Test('Should GraphemeCount 40', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('👩‍👩‍👧'), 1)
})
Test('Should GraphemeCount 41', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('👨‍👩‍👧‍👦'), 1)
})
Test('Should GraphemeCount 42', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('👩‍❤️‍💋‍👨'), 1)
})
Test('Should GraphemeCount 43', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('👩‍❤️‍👩'), 1)
})
Test('Should GraphemeCount 44', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('🧑‍🦱🧑‍🦰'), 2)
})
Test('Should GraphemeCount 45', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('👨‍⚕️👩‍⚕️'), 2)
})
Test('Should GraphemeCount 46', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('\u0301'), 1)
})
Test('Should GraphemeCount 47', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('\u0300'), 1)
})
Test('Should GraphemeCount 48', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('a\u0301'), 1)
})
Test('Should GraphemeCount 49', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('e\u0300'), 1)
})
Test('Should GraphemeCount 50', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('a\u0301\u0323'), 1)
})
// ------------------------------------------------------------------
// UnicodeSegmentGuard.IsMinLength
// ------------------------------------------------------------------
Test('Should IsMinLength 0', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMinLength('', 0))
})
Test('Should IsMinLength 1', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMinLength('a', 1))
})
Test('Should IsMinLength 2', () => {
  Assert.IsFalse(UnicodeSegmentGuard.IsMinLength('a', 2))
})
Test('Should IsMinLength 3', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMinLength('abc', 3))
})
Test('Should IsMinLength 4', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMinLength('abc', 2))
})
Test('Should IsMinLength 5', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMinLength('e\u0301', 1))
})
Test('Should IsMinLength 6', () => {
  Assert.IsFalse(UnicodeSegmentGuard.IsMinLength('e\u0301', 2))
})
Test('Should IsMinLength 7', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMinLength('a\u0301\u0323b', 2))
})
Test('Should IsMinLength 8', () => {
  Assert.IsFalse(UnicodeSegmentGuard.IsMinLength('a\u0301\u0323b', 3))
})
Test('Should IsMinLength 9', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMinLength('😄', 1))
})
Test('Should IsMinLength 10', () => {
  Assert.IsFalse(UnicodeSegmentGuard.IsMinLength('😄', 2))
})
Test('Should IsMinLength 11', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMinLength('😄😄', 2))
})
Test('Should IsMinLength 12', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMinLength('😄😄', 1))
})
Test('Should IsMinLength 13', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMinLength('👩‍❤️‍💋‍👨', 1))
})
Test('Should IsMinLength 14', () => {
  Assert.IsFalse(UnicodeSegmentGuard.IsMinLength('👩‍❤️‍💋‍👨', 2))
})
Test('Should IsMinLength 15', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMinLength('👨‍👩‍👧‍👦👩‍👩‍👧', 2))
})
Test('Should IsMinLength 16', () => {
  Assert.IsFalse(UnicodeSegmentGuard.IsMinLength('👨‍👩‍👧‍👦👩‍👩‍👧', 3))
})
Test('Should IsMinLength 17', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMinLength('🇳🇿', 1))
})
Test('Should IsMinLength 18', () => {
  Assert.IsFalse(UnicodeSegmentGuard.IsMinLength('🇳🇿', 2))
})
Test('Should IsMinLength 19', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMinLength('🇳🇿🇰🇷', 2))
})
Test('Should IsMinLength 20', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMinLength('🇳🇿🇰🇷', 1))
})
Test('Should IsMinLength 21', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMinLength('a🇳🇿😄', 3))
})
Test('Should IsMinLength 22', () => {
  Assert.IsFalse(UnicodeSegmentGuard.IsMinLength('a🇳🇿😄', 4))
})
Test('Should IsMinLength 23', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMinLength('🏝️🛳️', 2))
})
Test('Should IsMinLength 24', () => {
  Assert.IsFalse(UnicodeSegmentGuard.IsMinLength('🏝️🛳️', 3))
})
// ------------------------------------------------------------------
// UnicodeSegmentGuard.IsMaxLength
// ------------------------------------------------------------------
Test('Should IsMaxLength 1', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMaxLength('a', 1))
})
Test('Should IsMaxLength 2', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMaxLength('a', 2))
})
Test('Should IsMaxLength 3', () => {
  Assert.IsFalse(UnicodeSegmentGuard.IsMaxLength('abc', 2))
})
Test('Should IsMaxLength 4', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMaxLength('abc', 3))
})
Test('Should IsMaxLength 5', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMaxLength('e\u0301', 1))
})
Test('Should IsMaxLength 6', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMaxLength('e\u0301', 2))
})
Test('Should IsMaxLength 7', () => {
  Assert.IsFalse(UnicodeSegmentGuard.IsMaxLength('a\u0301\u0323b', 1))
})
Test('Should IsMaxLength 8', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMaxLength('a\u0301\u0323b', 2))
})
Test('Should IsMaxLength 9', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMaxLength('😄', 1))
})
Test('Should IsMaxLength 10', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMaxLength('😄', 2))
})
Test('Should IsMaxLength 11', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMaxLength('😄😄', 2))
})
Test('Should IsMaxLength 12', () => {
  Assert.IsFalse(UnicodeSegmentGuard.IsMaxLength('😄😄', 1))
})
Test('Should IsMaxLength 13', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMaxLength('👩‍❤️‍💋‍👨', 1))
})
Test('Should IsMaxLength 14', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMaxLength('👩‍❤️‍💋‍👨', 2))
})
Test('Should IsMaxLength 15', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMaxLength('👨‍👩‍👧‍👦👩‍👩‍👧', 2))
})
Test('Should IsMaxLength 16', () => {
  Assert.IsFalse(UnicodeSegmentGuard.IsMaxLength('👨‍👩‍👧‍👦👩‍👩‍👧', 1))
})
Test('Should IsMaxLength 17', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMaxLength('🇳🇿', 1))
})
Test('Should IsMaxLength 18', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMaxLength('🇳🇿', 2))
})
Test('Should IsMaxLength 19', () => {
  Assert.IsFalse(UnicodeSegmentGuard.IsMaxLength('🇳🇿🇰🇷', 1))
})
Test('Should IsMaxLength 20', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMaxLength('🇳🇿🇰🇷', 2))
})
Test('Should IsMaxLength 21', () => {
  Assert.IsFalse(UnicodeSegmentGuard.IsMaxLength('a🇳🇿😄', 2))
})
Test('Should IsMaxLength 22', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMaxLength('a🇳🇿😄', 3))
})
Test('Should IsMaxLength 23', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMaxLength('🏝️🛳️', 2))
})
Test('Should IsMaxLength 24', () => {
  Assert.IsFalse(UnicodeSegmentGuard.IsMaxLength('🏝️🛳️', 1))
})
// ------------------------------------------------------------------
// UnicodeSegmentGuard.FastPath Tests
// ------------------------------------------------------------------
Test('Should FastPath 1', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMinLength('abc', 2))
})
Test('Should FastPath 2', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMinLength('abc', 3))
})
Test('Should FastPath 3', () => {
  Assert.IsFalse(UnicodeSegmentGuard.IsMinLength('abc', 4))
})
Test('Should FastPath 4', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMaxLength('abc', 3))
})
Test('Should FastPath 5', () => {
  Assert.IsFalse(UnicodeSegmentGuard.IsMaxLength('abcd', 3))
})
Test('Should FastPath 6', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('𝄞'), 1)
})
Test('Should FastPath 7', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('𝄞𝄢𝄫'), 3)
})
Test('Should FastPath 8', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('A𝄞B'), 3)
})
Test('Should FastPath 9', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('👩‍👩‍👧'), 1)
})
Test('Should FastPath 10', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('👨‍👩‍👧‍👦'), 1)
})
Test('Should FastPath 11', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('👩‍❤️‍💋‍👨👩‍👩‍👧👨‍👩‍👧‍👦'), 3)
})
Test('Should FastPath 12', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('🇳🇿'), 1)
})
Test('Should FastPath 13', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('🇳🇿🇰🇷🇯🇵'), 3)
})
Test('Should FastPath 14', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('a🇰🇷😄'), 3)
})
Test('Should FastPath 15', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('a\u0301\u0323'), 1)
})
Test('Should FastPath 16', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('\u0301\u0323b'), 2)
})
Test('Should FastPath 17', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('🗺️'), 1)
})
Test('Should FastPath 18', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('🗺️✈️'), 2)
})
Test('Should FastPath 19', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMinLength('e\u0301', 1))
})
Test('Should FastPath 20', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMaxLength('👩‍👩‍👧', 1))
})
Test('Should FastPath 21', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount(''), 0)
})
Test('Should FastPath 22', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('\u0301'), 1)
})
Test('Should FastPath 23', () => {
  Assert.IsEqual(UnicodeSegmentGuard.GraphemeCount('\uDC00'), 1)
})
// ------------------------------------------------------------------
// UnicodeSegmentGuard.FastPath - Variation Selectors and Combining Marks (non-surrogate base)
//
// Ref: https://github.com/sinclairzx81/typebox/pull/1648
// ------------------------------------------------------------------
Test('Should FastPath 24', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMaxLength('❤️', 1)) // ❤️ base + variation selector
})
Test('Should FastPath 25', () => {
  Assert.IsFalse(UnicodeSegmentGuard.IsMinLength('❤️', 2)) // ❤️ base + variation selector
})
Test('Should FastPath 26', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMaxLength('☀️', 1)) // ☀️ base + variation selector
})
Test('Should FastPath 27', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMaxLength('a᪰', 1)) // base + combining mark U+1AB0
})
Test('Should FastPath 28', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMaxLength('a᷀', 1)) // base + combining mark U+1DC0
})
Test('Should FastPath 29', () => {
  Assert.IsTrue(UnicodeSegmentGuard.IsMaxLength('a︠', 1)) // base + combining mark U+FE20
})
