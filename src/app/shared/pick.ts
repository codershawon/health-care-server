
// The pick function creates a new object by selecting only the specified keys from an input object. It ensures the selected keys exist in the original object and returns a partial object with just those key-value pairs.

const pick=<T extends Record<string, unknown>,k extends keyof T>(obj: T, keys: k[]): Partial<T>=>{
    const finalObj: Partial<T>={};
 
    for(const key of keys){
       if(obj && Object.hasOwnProperty.call(obj,key)){
         finalObj[key] = obj[key];
       }
    }
    console.log(finalObj);
    return finalObj;
 }
 export default pick;