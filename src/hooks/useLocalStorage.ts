import { useState, useEffect } from 'react';

// ----------------------------------------------------------------------

export default function useLocalStorage(key: string, defaultValue: Record<string, string | boolean>) {
    const [value, setValue] = useState(() => {
        const storedValue = localStorage.getItem(key);
        return storedValue === null ? defaultValue : JSON.parse(storedValue);
    });

    useEffect(() => {
        const listener = (e: StorageEvent) => {
            if (e.storageArea === localStorage && e.key === key) {
                setValue(JSON.parse(e.newValue as string));
            }
        };
        window.addEventListener('storage', listener);

        return () => {
            window.removeEventListener('storage', listener);
        };
    }, [key, defaultValue]);

    const setValueInLocalStorage = (newValue: string | Function) => {
        setValue((currentValue: any) => {
            const result = typeof newValue === 'function' ? newValue(currentValue) : newValue;
            localStorage.setItem(key, JSON.stringify(result));
            return result;
        });
    };

    return [value, setValueInLocalStorage];
}
