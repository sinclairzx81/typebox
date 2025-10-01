/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson 

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

import { type TLocalizedValidationError, type TValidationErrorBase, type TStandardSchemaV1Error, IsLocalizedValidationError } from 'typebox/error'
import { StandardSchemaV1 } from './standard-schema-v1.ts'
import Guard from 'typebox/guard'

// --------------------------------------------------------
// StandardSchema: PathSegments
// --------------------------------------------------------
function PathSegments(pointer: string): string[] {
  if (Guard.IsEqual(pointer.length, 0)) return []
  return pointer.slice(1).split("/").map(segment => segment.replace(/~1/g, "/").replace(/~0/g, "~"))
}
// --------------------------------------------------------
// IsStandardSchemaV1Error
// --------------------------------------------------------
function IsStandardSchemaV1Error(error: TValidationErrorBase): error is TStandardSchemaV1Error {
  return Guard.IsEqual(error.keyword, '~standard')
}
// --------------------------------------------------------
// IssuesFromLocalizedError
// --------------------------------------------------------
function IssuesFromStandardSchemaV1Error(error: TStandardSchemaV1Error): StandardSchemaV1.Issue[] {
  const leading = PathSegments(error.instancePath)
  const issues = Guard.IsArray(error.params.issues) ? error.params.issues : []
  return issues.map(issue => {
    const message = Guard.IsString(issue.message) ? issue.message : 'unknown'
    const path = Guard.IsArray(issue.path) ? [...leading, ...issue.path] : leading
    return { message, path }
  })
}
function IssuesFromRegularError(error: TLocalizedValidationError): StandardSchemaV1.Issue[] {
  const path = PathSegments(error.instancePath)
  return [{ path, message: error.message  }]
}
function IssuesFromLocalizedError(error: TLocalizedValidationError): StandardSchemaV1.Issue[] {
  return IsStandardSchemaV1Error(error) 
    ? IssuesFromStandardSchemaV1Error(error) 
    : IssuesFromRegularError(error)
}
// --------------------------------------------------------
// IssuesFromUnknown
// --------------------------------------------------------
function IssuesFromUnknown(error: object): StandardSchemaV1.Issue[] {
  const path = Guard.HasPropertyKey(error, 'path') && Guard.IsArray(error.path) && error.path.every(segment => Guard.IsString(segment)) ? error.path : []
  const message = Guard.HasPropertyKey(error, 'message') && Guard.IsString(error.message) ? error.message : 'unknown'
  return [{ path, message } as StandardSchemaV1.Issue]
}
// --------------------------------------------------------
// CreateIssues
// --------------------------------------------------------
function FromError(error: object): StandardSchemaV1.Issue[] {
  return IsLocalizedValidationError(error)
    ? IssuesFromLocalizedError(error)
    : IssuesFromUnknown(error)
}
// --------------------------------------------------------
// ToStandardSchemaV1Issues
// --------------------------------------------------------
export type TErrorLike = TValidationErrorBase | StandardSchemaV1.Issue

/** Transforms an array of ErrorLikes into a consistent StandardSchemaV1.Issue[] array. */
export function ToStandardSchemaV1Issues(errorLikes: TErrorLike[]): StandardSchemaV1.Issue[] {
  return errorLikes.reduce<StandardSchemaV1.Issue[]>((result, error) => {
    return [...result, ...FromError(error)]
  }, [])
}