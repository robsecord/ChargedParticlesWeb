// Frameworks
import React, { useState } from 'react';

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
