import { Paths } from './types';

export default function keepPaths<T extends Record<string, any> , K extends Paths<T>>(obj: T, paths: K[]): Partial<T> {
  const newObj: Partial<T> = {};

  // Using for of is adding 1.2KiB to the bundle
  for(let pathIndex = 0;pathIndex < paths.length; pathIndex++) {
    const path = paths[pathIndex];
    let newObjPointer = newObj; // pointer
    let originalObjPointer = obj; // pointer
    
    const fields = path.split(".");
    for(let i = 0;i < fields.length; i++) {
      const field = fields[i];
      if(i === fields.length - 1) {
        Object.assign(newObjPointer, {[field]: originalObjPointer[field]});
      } else {
        if(!newObjPointer[field]) {
          if(Array.isArray(originalObjPointer[field])) {
            Object.assign(newObjPointer, {[field]: []});
          } else {
            Object.assign(newObjPointer, {[field]: {}});
          }
        }
        newObjPointer = newObjPointer[field] as object;
        originalObjPointer = originalObjPointer[field] || {}; // Walk into the original object to get the value later
      }
    }
  }

  return newObj;
}
