import * as Types from '../typebox';
/** TypeGuard tests that values conform to a known TypeBox type specification */
export declare namespace TypeGuard {
    /** Returns true if the given schema is TAny */
    function TAny(schema: any): schema is Types.TAny;
    /** Returns true if the given schema is TArray */
    function TArray(schema: any): schema is Types.TArray;
    /** Returns true if the given schema is TBoolean */
    function TBoolean(schema: any): schema is Types.TBoolean;
    /** Returns true if the given schema is TConstructor */
    function TConstructor(schema: any): schema is Types.TConstructor;
    /** Returns true if the given schema is TFunction */
    function TFunction(schema: any): schema is Types.TFunction;
    /** Returns true if the given schema is TInteger */
    function TInteger(schema: any): schema is Types.TInteger;
    /** Returns true if the given schema is TLiteral */
    function TLiteral(schema: any): schema is Types.TLiteral;
    /** Returns true if the given schema is TNull */
    function TNull(schema: any): schema is Types.TNull;
    /** Returns true if the given schema is TNumber */
    function TNumber(schema: any): schema is Types.TNumber;
    /** Returns true if the given schema is TObject */
    function TObject(schema: any): schema is Types.TObject;
    /** Returns true if the given schema is TPromise */
    function TPromise(schema: any): schema is Types.TPromise;
    /** Returns true if the given schema is TRecord */
    function TRecord(schema: any): schema is Types.TRecord;
    /** Returns true if the given schema is TSelf */
    function TSelf(schema: any): schema is Types.TSelf;
    /** Returns true if the given schema is TRef */
    function TRef(schema: any): schema is Types.TRef;
    /** Returns true if the given schema is TString */
    function TString(schema: any): schema is Types.TString;
    /** Returns true if the given schema is TTuple */
    function TTuple(schema: any): schema is Types.TTuple;
    /** Returns true if the given schema is TUndefined */
    function TUndefined(schema: any): schema is Types.TUndefined;
    /** Returns true if the given schema is TUnion */
    function TUnion(schema: any): schema is Types.TUnion;
    /** Returns true if the given schema is TUint8Array */
    function TUint8Array(schema: any): schema is Types.TUint8Array;
    /** Returns true if the given schema is TUnknown */
    function TUnknown(schema: any): schema is Types.TUnknown;
    /** Returns true if the given schema is TVoid */
    function TVoid(schema: any): schema is Types.TVoid;
    /** Returns true if the given schema is TSchema */
    function TSchema(schema: any): schema is Types.TSchema;
}
