// Frameworks
import React, { useEffect } from 'react';

import { useAttributes } from './customHooks';

import AttrAddItem from './AttrAddItem';
import AttrList from './AttrList';

const AttrListContainer = ({ initialAttributes = [], onUpdate }) => {
    const { attributes, addAttribute, removeAttribute } = useAttributes(initialAttributes);

    useEffect(() => {
        onUpdate(attributes);
    }, [attributes, onUpdate]);

    return (
        <>
            <AttrAddItem
                onAddItem={addAttribute}
            />
            <AttrList
                attributes={attributes}
                onRemove={idx => removeAttribute(idx)}
            />
        </>
    );
};

export default AttrListContainer;
