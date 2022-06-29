import * as Types from '../typebox';
export interface CheckOk {
    ok: true;
}
export interface CheckFail {
    ok: false;
    expr: string;
    path: string;
    kind: string;
}
export declare type CheckFunction = (value: unknown) => CheckOk | CheckFail;
export declare namespace TypeCompiler {
    interface Condition {
        schema: Types.TSchema;
        expr: string;
        path: string;
    }
    /** Returns the validation kernel as a string. This function is primarily used for debugging. */
    function Kernel<T extends Types.TSchema>(schema: T, additional?: Types.TSchema[]): string;
    /** Compiles a type into validation function */
    function Compile<T extends Types.TSchema>(schema: T, additional?: Types.TSchema[]): CheckFunction;
}
