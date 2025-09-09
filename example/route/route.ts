/*--------------------------------------------------------------------------

RouteBox

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

import type { TSchema, Static } from 'typebox'
import { Validator } from 'typebox/compile'

// ------------------------------------------------------------------
// RequestContext
// ------------------------------------------------------------------
export type RequestContext = Omit<globalThis.Request, 
  'body' | 'bodyUsed' | 'bytes' | 'clone' | 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text'
>
// ------------------------------------------------------------------
// RouteHandler
// ------------------------------------------------------------------
export type RouteHandler<Request extends TSchema, Response extends TSchema> =
  (context: RequestContext, request: Static<Request>) => Static<Response> | Promise<Static<Response>>;

// ------------------------------------------------------------------
// RouteOptions
// ------------------------------------------------------------------
export interface RouteOptions<
  Request extends TSchema = TSchema,
  Response extends TSchema = TSchema
> {
  request: Request;
  response: Response;
}
// ------------------------------------------------------------------
// Route
// ------------------------------------------------------------------
export class Route<Path extends string, Options extends RouteOptions> {
  private readonly requestValidator: Validator<{}, Options['request']>;
  private readonly responseValidator: Validator<{}, Options['response']>;

  constructor(
    private readonly path: Path,
    private readonly options: Options,
    private readonly handler: RouteHandler<Options['request'], Options['response']>
  ) {
    this.requestValidator = new Validator({}, this.options.request);
    this.responseValidator = new Validator({}, this.options.response);
  }
  private jsonResponse(data: unknown, status: number): globalThis.Response {
    return new globalThis.Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  private validate(validator: Validator<{}, TSchema>, data: unknown, errorStatus: number, errorLabel: string): globalThis.Response | null {
    if (!validator.Check(data)) {
      return this.jsonResponse(
        { error: `${errorLabel} validation failed`, details: validator.Errors(data) },
        errorStatus
      )
    }
    return null
  }
  public async call(request: globalThis.Request): Promise<globalThis.Response> {
    try {
      const body = await request.json()

      const badRequest = this.validate(this.requestValidator, body, 400, 'Request');
      if (badRequest) return badRequest
      const context: RequestContext = request as RequestContext

      const reply = await this.handler(context, body)
      const badResponse = this.validate(this.responseValidator, reply, 500, 'Response');
      if (badResponse) return badResponse

      return this.jsonResponse(reply, 200)
    } catch (error: any) {
      return this.jsonResponse(
        { error: 'Server error', message: error.message ?? String(error) },
        500
      )
    }
  }
}
// ------------------------------------------------------------------
// Route
// ------------------------------------------------------------------
import Type from 'typebox'

export const route = new Route('/api/users/{id:number}', {
  request: Type.Script(`{
    x: number
    y: number
    z: number
  }`),
  response: Type.Script(`{
    x: number
    y: number
    z: number
  }`)
}, (context, request) => {
  
  throw 1
})