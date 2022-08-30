import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Format } from '@sinclair/typebox/format'
import { Value } from '@sinclair/typebox/value'
import { Type, Static } from '@sinclair/typebox'

import * as ts from 'typescript'

Format.Set('typescript', value => {
  const filename = "test.ts";
  const code = `const test: number = 1 + 2;`;
  
  const sourceFile = ts.createSourceFile(
      filename, code, ts.ScriptTarget.Latest
  );
  
  const defaultCompilerHost = ts.createCompilerHost({});
  
  const customCompilerHost: ts.CompilerHost = {
      getSourceFile: (name, languageVersion) => {
          console.log(`getSourceFile ${name}`);
  
          if (name === filename) {
              return sourceFile;
          } else {
              return defaultCompilerHost.getSourceFile(
                  name, languageVersion
              );
          }
      },
      writeFile: (filename, data) => {},
      getDefaultLibFileName: () => "lib.d.ts",
      useCaseSensitiveFileNames: () => false,
      getCanonicalFileName: filename => filename,
      getCurrentDirectory: () => "",
      getNewLine: () => "\n",
      getDirectories: () => [],
      fileExists: () => true,
      readFile: () => ""
  };
  
  const program = ts.createProgram(
      ["test.ts"], {}, customCompilerHost
  );
  const x = ts.getPreEmitDiagnostics(program);
  console.log(x)
  
  return true
})
// ts.getPreEmitDiagnostics(program); // check these
const T = Type.String({ format: 'typescript'})

const A = Value.Check(T, 'const message: string = 10')

console.log(A, 1)
