export declare namespace Pointer {
    /** Formats the RFC6901 JsonPointer as an array of paths. */
    function Format(pointer: string): string[];
    /** Sets the value at the given pointer. If the pointer does not exist it is created. */
    function Set(value: any, pointer: string, update: any): void;
    /** Deletes a value at the given pointer. */
    function Delete(value: any, pointer: string): any[] | undefined;
    /** True if a value exists at the given pointer */
    function Has(value: any, pointer: string): boolean;
    /** Gets the value at the given pointer */
    function Get(value: any, pointer: string): any;
}
