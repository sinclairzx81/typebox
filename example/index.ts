import { Type, Static } from '@sinclair/typebox'

// ------------------------------------------------------
// decorator
// ------------------------------------------------------

export const method = () => (...args: any) => {}

// ------------------------------------------------------
// contract
// ------------------------------------------------------

type Request = Static<typeof Request>
const Request = Type.Object({ id: Type.String() })

type Response = Static<typeof Response>
const Response = Type.Object({ id: Type.String() })

// ------------------------------------------------------
// service
// ------------------------------------------------------

export class Service {
    @method()
    method(request: Request): Response {
        return request
    }
}

// ...

const service = new Service()

service.method({ id: '1' })