/** A base registry class */
export class BaseRegistry<Fn extends Function> {
    private readonly map = new Map<string, Fn>;
    
    /** Returns the entries in this registry */
    Entries = () => {
        return new Map(this.map)
    }
    /** Clears all user defined string formats */
    Clear = () => {
        return this.map.clear()
    }
    /** Deletes a registered format */
    Delete = (format: string) => {
        return this.map.delete(format)
    }
    /** Returns true if the user defined string format exists */
    Has = (format: string) => {
        return this.map.has(format)
    }
    /** Sets a validation function for a user defined string format */
    Set = (format: string, func: Fn) => {
        this.map.set(format, func)
    }
    /** Gets a validation function for a user defined string format */
    Get = (format: string) => {
        return this.map.get(format)
    }
}