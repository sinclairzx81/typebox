export declare enum EditType {
    Delete = 0,
    Update = 1,
    Insert = 2
}
export declare type Edit = Insert | Update | Delete;
export declare type Update = [EditType.Update, string, any];
export declare type Insert = [EditType.Insert, string, any];
export declare type Delete = [EditType.Delete, string];
export declare namespace DeltaValue {
    function Diff(valueA: any, valueB: any): Edit[];
    function Edit(valueA: any, operations: Edit[]): any;
}
