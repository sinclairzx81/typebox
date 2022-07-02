import { TypeCompiler } from '@sinclair/typebox/compiler'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Type } from '@sinclair/typebox'

const T: any = Type.String()                         // T is any

const { type } = T                                   // type is any

if(TypeGuard.TString(T)) {
    
  const { type } = T                                 // type is 'string'
}








