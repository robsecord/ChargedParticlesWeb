// Reference:
//    https://usehooks.com/

// Frameworks
import React, { useState, useEffect, useCallback } from 'react';


export const useAttributes = (initialValue = []) => {
    const [ attributes, setAttributes ] = useState(initialValue);

    return {
        attributes,

        addAttribute: attributeData => {
            setAttributes(
                attributes.concat(attributeData)
            );
        },

        removeAttribute: idx => {
            setAttributes(attributes.filter((attr, index) => idx !== index));
        }
    };
};

export const useLocalStorage = (key, initialValue) => {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error also return initialValue
            console.log(error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = value => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.log(error);
        }
    };

    return [storedValue, setValue];
};

export const useAsync = (asyncFunction, immediate = true) => {
    const [pending, setPending] = useState(false);
    const [value, setValue] = useState(null);
    const [error, setError] = useState(null);

    const execute = useCallback(() => {
        setPending(true);
        setValue(null);
        setError(null);
        return asyncFunction()
            .then(response => setValue(response))
            .catch(error => setError(error))
            .finally(() => setPending(false));
    }, [asyncFunction]);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return { execute, pending, value, error };
};


export const useMemoCompare = (value, compare) => {
    // Ref for storing previous value
    const previousRef = useRef();
    const previous = previousRef.current;

    // Pass previous and new value to compare function
    const isEqual = compare(previous, value);

    // If not equal update previous to new value (for next render)
    // and then return new new value below.
    useEffect(() => {
        if (!isEqual) {
            previousRef.current = value;
        }
    });

    return isEqual ? previous : value;
};

export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(
        () => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            return () => {
                clearTimeout(handler);
            };
        },
        [value]
    );

    return debouncedValue;
};

export const usePrevious = (value) => {
    // The ref object is a generic container whose current property is mutable ...
    // ... and can hold any value, similar to an instance property on a class
    const ref = useRef();

    // Store current value in ref
    useEffect(() => {
        ref.current = value;
    }, [value]); // Only re-run if value changes

    // Return previous value (happens before update in useEffect above)
    return ref.current;
};

export const useWhyDidYouUpdate = (name, props) => {
    const previousProps = useRef();

    useEffect(() => {
        if (previousProps.current) {
            const allKeys = Object.keys({ ...previousProps.current, ...props });
            const changesObj = {};
            allKeys.forEach(key => {
                if (previousProps.current[key] !== props[key]) {
                    changesObj[key] = {
                        from: previousProps.current[key],
                        to: props[key]
                    };
                }
            });

            if (Object.keys(changesObj).length) {
                console.log('[why-did-you-update]', name, changesObj);
            }
        }
        previousProps.current = props;
    });
};
