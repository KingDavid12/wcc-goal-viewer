import { useState } from "react";
import * as _ from "lodash";
import { RecursivePartial } from "../types/recursivePartial";

export interface Writeable<T, U>
{
    set: (value: U | ((value: T) => U)) => void;
}
export interface Atom<T> extends Writeable<T, T>
{
    get: T;
}
export interface DerivedAtom<T> extends Writeable<T, RecursivePartial<T>>
{
    get: T;
}

export const atom = function <T>(initialValue: T): Atom<T>
{
    const [get, set] = useState(initialValue);
    return ({ get, set });
};

export const derive = function <T, K extends keyof T>(
    atom: Atom<T> | DerivedAtom<T>,
    key: K,
    onSet?: (value: T[K]) => void
): DerivedAtom<T[K]>
{
    return ({
        get: atom.get[key],
        set: value =>
        {
            if (typeof value === "function")
            {
                atom.set(current =>
                {
                    const result = _.merge(current, { [key]: value(current[key]) }); 
                    onSet?.(result[key]);
                    return result;
                });
                return;
            }

            const result = _.merge(atom.get, { [key]: value });

            onSet?.(result[key]);
            atom.set(result);
        }
    });
};

export const useAtom = function <T, U>(atom: (Atom<T> | DerivedAtom<T>) & Writeable<T, U>): [T, (value: U) => void]
{
    return ([atom.get, atom.set]);
};