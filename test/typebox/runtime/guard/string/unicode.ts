import { Assert } from 'test'
import * as UnicodeGuard from '../../../../../src/guard/unicode/unicode.ts' // (Internal)

// ------------------------------------------------------------------
// UnicodeGuard is the default StringGuard. We don't export the
// Grapheme or Unicode Guard
// ------------------------------------------------------------------
const Test = Assert.Context('Guard.UnicodeGuard')

// ------------------------------------------------------------------
// UnicodeGuard.CodePointCount
// ------------------------------------------------------------------
Test('Should CodePointCount 1', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount(''), 0)
})
Test('Should CodePointCount 2', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('a'), 1)
})
Test('Should CodePointCount 3', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('hello'), 5)
})
Test('Should CodePointCount 4', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('a b c'), 5)
})
Test('Should CodePointCount 5', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('!?.'), 3)
})
Test('Should CodePointCount 6', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('é'), 1)
})
Test('Should CodePointCount 7', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('éàè'), 3)
})
Test('Should CodePointCount 8', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('e\u0301'), 2) // e + combining acute (NOT merged, unlike graphemes)
})
Test('Should CodePointCount 9', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('a\u0301b\u0301'), 4)
})
Test('Should CodePointCount 10', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('漢字'), 2)
})
Test('Should CodePointCount 11', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('😄'), 1) // surrogate pair -> 1 code point
})
Test('Should CodePointCount 12', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('😄😄😄'), 3)
})
Test('Should CodePointCount 13', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('😄🎉🔥'), 3)
})
Test('Should CodePointCount 14', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('Hello 😄!'), 8)
})
Test('Should CodePointCount 15', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('𝄞'), 1)
})
Test('Should CodePointCount 16', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('𝄞𝄞'), 2)
})
Test('Should CodePointCount 17', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('A𝄞B'), 3)
})
Test('Should CodePointCount 18', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('a😄b'), 3)
})
Test('Should CodePointCount 19', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('😄🎉'), 2)
})
Test('Should CodePointCount 20', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('🗺️'), 2) // base + variation selector, NOT merged
})
Test('Should CodePointCount 21', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('🗺️✈️'), 4)
})
Test('Should CodePointCount 22', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('🗺️a'), 3)
})
Test('Should CodePointCount 23', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('🗺️\u0301'), 3)
})
Test('Should CodePointCount 24', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('🇳🇿'), 2) // two regional indicators, NOT merged
})
Test('Should CodePointCount 25', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('🇳🇿🇰🇷'), 4)
})
Test('Should CodePointCount 26', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('NZ🇳🇿'), 4)
})
Test('Should CodePointCount 27', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('🇳🇿😄'), 3)
})
Test('Should CodePointCount 28', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('a😄e\u0301'), 4)
})
Test('Should CodePointCount 29', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('😄🇳🇿e\u0301'), 5)
})
Test('Should CodePointCount 30', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('🧳🇰🇷abc'), 6)
})
Test('Should CodePointCount 31', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('a🇰🇷😄🗺️e\u0301'), 8)
})
Test('Should CodePointCount 32', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('🇳🇿🇰🇷🇯🇵'), 6)
})
Test('Should CodePointCount 33', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('a\u0301\u0323'), 3) // a + acute + dot below, NOT merged
})
Test('Should CodePointCount 34', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('\u0301b'), 2)
})
Test('Should CodePointCount 35', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('\uDC00'), 1) // lone surrogate counts as 1 code point
})
Test('Should CodePointCount 36', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('🏝️🛳️'), 4)
})
Test('Should CodePointCount 37', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('✈️🗺️'), 4)
})
Test('Should CodePointCount 38', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('a🇳🇿🧳b'), 5)
})
Test('Should CodePointCount 39', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('𝄞𝄢𝄫'), 3)
})
Test('Should CodePointCount 40', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('👩‍👩‍👧'), 5) // woman, ZWJ, woman, ZWJ, girl
})
Test('Should CodePointCount 41', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('👨‍👩‍👧‍👦'), 7)
})
Test('Should CodePointCount 42', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('👩‍❤️‍💋‍👨'), 8)
})
Test('Should CodePointCount 43', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('👩‍❤️‍👩'), 6)
})
Test('Should CodePointCount 44', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('🧑‍🦱🧑‍🦰'), 6)
})
Test('Should CodePointCount 45', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('👨‍⚕️👩‍⚕️'), 8)
})
Test('Should CodePointCount 46', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('\u0301'), 1)
})
Test('Should CodePointCount 47', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('\u0300'), 1)
})
Test('Should CodePointCount 48', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('a\u0301'), 2)
})
Test('Should CodePointCount 49', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('e\u0300'), 2)
})
Test('Should CodePointCount 50', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('a\u0301\u0323'), 3)
})
// ------------------------------------------------------------------
// UnicodeGuard.IsMinLength
// ------------------------------------------------------------------
Test('Should IsMinLength 0', () => {
  Assert.IsTrue(UnicodeGuard.IsMinLength('', 0))
})
Test('Should IsMinLength 1', () => {
  Assert.IsTrue(UnicodeGuard.IsMinLength('a', 1))
})
Test('Should IsMinLength 2', () => {
  Assert.IsFalse(UnicodeGuard.IsMinLength('a', 2))
})
Test('Should IsMinLength 3', () => {
  Assert.IsTrue(UnicodeGuard.IsMinLength('abc', 3))
})
Test('Should IsMinLength 4', () => {
  Assert.IsTrue(UnicodeGuard.IsMinLength('abc', 2))
})
Test('Should IsMinLength 5', () => {
  Assert.IsTrue(UnicodeGuard.IsMinLength('e\u0301', 2))
})
Test('Should IsMinLength 6', () => {
  Assert.IsFalse(UnicodeGuard.IsMinLength('e\u0301', 3))
})
Test('Should IsMinLength 7', () => {
  Assert.IsTrue(UnicodeGuard.IsMinLength('a\u0301\u0323b', 4))
})
Test('Should IsMinLength 8', () => {
  Assert.IsFalse(UnicodeGuard.IsMinLength('a\u0301\u0323b', 5))
})
Test('Should IsMinLength 9', () => {
  Assert.IsTrue(UnicodeGuard.IsMinLength('😄', 1))
})
Test('Should IsMinLength 10', () => {
  Assert.IsFalse(UnicodeGuard.IsMinLength('😄', 2))
})
Test('Should IsMinLength 11', () => {
  Assert.IsTrue(UnicodeGuard.IsMinLength('😄😄', 2))
})
Test('Should IsMinLength 12', () => {
  Assert.IsTrue(UnicodeGuard.IsMinLength('😄😄', 1))
})
Test('Should IsMinLength 13', () => {
  Assert.IsTrue(UnicodeGuard.IsMinLength('👩‍❤️‍💋‍👨', 8))
})
Test('Should IsMinLength 14', () => {
  Assert.IsFalse(UnicodeGuard.IsMinLength('👩‍❤️‍💋‍👨', 9))
})
Test('Should IsMinLength 15', () => {
  Assert.IsTrue(UnicodeGuard.IsMinLength('👨‍👩‍👧‍👦👩‍👩‍👧', 12))
})
Test('Should IsMinLength 16', () => {
  Assert.IsFalse(UnicodeGuard.IsMinLength('👨‍👩‍👧‍👦👩‍👩‍👧', 13))
})
Test('Should IsMinLength 17', () => {
  Assert.IsTrue(UnicodeGuard.IsMinLength('🇳🇿', 2))
})
Test('Should IsMinLength 18', () => {
  Assert.IsFalse(UnicodeGuard.IsMinLength('🇳🇿', 3))
})
Test('Should IsMinLength 19', () => {
  Assert.IsTrue(UnicodeGuard.IsMinLength('🇳🇿🇰🇷', 4))
})
Test('Should IsMinLength 20', () => {
  Assert.IsTrue(UnicodeGuard.IsMinLength('🇳🇿🇰🇷', 3))
})
Test('Should IsMinLength 21', () => {
  Assert.IsTrue(UnicodeGuard.IsMinLength('a🇳🇿😄', 4))
})
Test('Should IsMinLength 22', () => {
  Assert.IsFalse(UnicodeGuard.IsMinLength('a🇳🇿😄', 5))
})
Test('Should IsMinLength 23', () => {
  Assert.IsTrue(UnicodeGuard.IsMinLength('🏝️🛳️', 4))
})
Test('Should IsMinLength 24', () => {
  Assert.IsFalse(UnicodeGuard.IsMinLength('🏝️🛳️', 5))
})
// ------------------------------------------------------------------
// UnicodeGuard.IsMaxLength
// ------------------------------------------------------------------
Test('Should IsMaxLength 1', () => {
  Assert.IsTrue(UnicodeGuard.IsMaxLength('a', 1))
})
Test('Should IsMaxLength 2', () => {
  Assert.IsTrue(UnicodeGuard.IsMaxLength('a', 2))
})
Test('Should IsMaxLength 3', () => {
  Assert.IsFalse(UnicodeGuard.IsMaxLength('abc', 2))
})
Test('Should IsMaxLength 4', () => {
  Assert.IsTrue(UnicodeGuard.IsMaxLength('abc', 3))
})
Test('Should IsMaxLength 5', () => {
  Assert.IsTrue(UnicodeGuard.IsMaxLength('e\u0301', 2))
})
Test('Should IsMaxLength 6', () => {
  Assert.IsFalse(UnicodeGuard.IsMaxLength('e\u0301', 1))
})
Test('Should IsMaxLength 7', () => {
  Assert.IsFalse(UnicodeGuard.IsMaxLength('a\u0301\u0323b', 3))
})
Test('Should IsMaxLength 8', () => {
  Assert.IsTrue(UnicodeGuard.IsMaxLength('a\u0301\u0323b', 4))
})
Test('Should IsMaxLength 9', () => {
  Assert.IsTrue(UnicodeGuard.IsMaxLength('😄', 1))
})
Test('Should IsMaxLength 10', () => {
  Assert.IsTrue(UnicodeGuard.IsMaxLength('😄', 2))
})
Test('Should IsMaxLength 11', () => {
  Assert.IsTrue(UnicodeGuard.IsMaxLength('😄😄', 2))
})
Test('Should IsMaxLength 12', () => {
  Assert.IsFalse(UnicodeGuard.IsMaxLength('😄😄', 1))
})
Test('Should IsMaxLength 13', () => {
  Assert.IsTrue(UnicodeGuard.IsMaxLength('👩‍❤️‍💋‍👨', 8))
})
Test('Should IsMaxLength 14', () => {
  Assert.IsFalse(UnicodeGuard.IsMaxLength('👩‍❤️‍💋‍👨', 7))
})
Test('Should IsMaxLength 15', () => {
  Assert.IsTrue(UnicodeGuard.IsMaxLength('👨‍👩‍👧‍👦👩‍👩‍👧', 12))
})
Test('Should IsMaxLength 16', () => {
  Assert.IsFalse(UnicodeGuard.IsMaxLength('👨‍👩‍👧‍👦👩‍👩‍👧', 11))
})
Test('Should IsMaxLength 17', () => {
  Assert.IsTrue(UnicodeGuard.IsMaxLength('🇳🇿', 2))
})
Test('Should IsMaxLength 18', () => {
  Assert.IsFalse(UnicodeGuard.IsMaxLength('🇳🇿', 1))
})
Test('Should IsMaxLength 19', () => {
  Assert.IsFalse(UnicodeGuard.IsMaxLength('🇳🇿🇰🇷', 3))
})
Test('Should IsMaxLength 20', () => {
  Assert.IsTrue(UnicodeGuard.IsMaxLength('🇳🇿🇰🇷', 4))
})
Test('Should IsMaxLength 21', () => {
  Assert.IsFalse(UnicodeGuard.IsMaxLength('a🇳🇿😄', 3))
})
Test('Should IsMaxLength 22', () => {
  Assert.IsTrue(UnicodeGuard.IsMaxLength('a🇳🇿😄', 4))
})
Test('Should IsMaxLength 23', () => {
  Assert.IsTrue(UnicodeGuard.IsMaxLength('🏝️🛳️', 4))
})
Test('Should IsMaxLength 24', () => {
  Assert.IsFalse(UnicodeGuard.IsMaxLength('🏝️🛳️', 3))
})
// ------------------------------------------------------------------
// UnicodeGuard.FastPath Tests
// ------------------------------------------------------------------
Test('Should FastPath 1', () => {
  Assert.IsTrue(UnicodeGuard.IsMinLength('abc', 2))
})
Test('Should FastPath 2', () => {
  Assert.IsTrue(UnicodeGuard.IsMinLength('abc', 3))
})
Test('Should FastPath 3', () => {
  Assert.IsFalse(UnicodeGuard.IsMinLength('abc', 4))
})
Test('Should FastPath 4', () => {
  Assert.IsTrue(UnicodeGuard.IsMaxLength('abc', 3))
})
Test('Should FastPath 5', () => {
  Assert.IsFalse(UnicodeGuard.IsMaxLength('abcd', 3))
})
Test('Should FastPath 6', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('𝄞'), 1)
})
Test('Should FastPath 7', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('𝄞𝄢𝄫'), 3)
})
Test('Should FastPath 8', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('A𝄞B'), 3)
})
Test('Should FastPath 9', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('👩‍👩‍👧'), 5)
})
Test('Should FastPath 10', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('👨‍👩‍👧‍👦'), 7)
})
Test('Should FastPath 11', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('👩‍❤️‍💋‍👨👩‍👩‍👧👨‍👩‍👧‍👦'), 20)
})
Test('Should FastPath 12', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('🇳🇿'), 2)
})
Test('Should FastPath 13', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('🇳🇿🇰🇷🇯🇵'), 6)
})
Test('Should FastPath 14', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('a🇰🇷😄'), 4)
})
Test('Should FastPath 15', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('a\u0301\u0323'), 3)
})
Test('Should FastPath 16', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('\u0301\u0323b'), 3)
})
Test('Should FastPath 17', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('🗺️'), 2)
})
Test('Should FastPath 18', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('🗺️✈️'), 4)
})
Test('Should FastPath 19', () => {
  Assert.IsTrue(UnicodeGuard.IsMinLength('e\u0301', 2))
})
Test('Should FastPath 20', () => {
  Assert.IsTrue(UnicodeGuard.IsMaxLength('👩‍👩‍👧', 5))
})
Test('Should FastPath 21', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount(''), 0)
})
Test('Should FastPath 22', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('\u0301'), 1)
})
Test('Should FastPath 23', () => {
  Assert.IsEqual(UnicodeGuard.CodePointCount('\uDC00'), 1)
})
Test('Should FastPath 24', () => {
  Assert.IsFalse(UnicodeGuard.IsMaxLength('❤️', 1)) // ❤️ base + variation selector = 2 code points
})
Test('Should FastPath 25', () => {
  Assert.IsTrue(UnicodeGuard.IsMinLength('❤️', 2)) // ❤️ base + variation selector = 2 code points
})
Test('Should FastPath 26', () => {
  Assert.IsTrue(UnicodeGuard.IsMaxLength('☀️', 2)) // ☀️ base + variation selector
})
Test('Should FastPath 27', () => {
  Assert.IsTrue(UnicodeGuard.IsMaxLength('a᪰', 2)) // base + combining mark U+1AB0
})
Test('Should FastPath 28', () => {
  Assert.IsTrue(UnicodeGuard.IsMaxLength('a᷀', 2)) // base + combining mark U+1DC0
})
Test('Should FastPath 29', () => {
  Assert.IsTrue(UnicodeGuard.IsMaxLength('a︠', 2)) // base + combining mark U+FE20
})
