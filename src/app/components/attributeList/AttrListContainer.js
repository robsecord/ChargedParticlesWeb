// Frameworks
import React from 'react';

import { useAttributes } from './customHooks';

import AttrAddItem from './AttrAddItem';
import AttrList from './AttrList';

const AttrListContainer = ({ initialAttributes = [] }) => {
    const { attributes, addAttribute, removeAttribute } = useAttributes(initialAttributes);

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
