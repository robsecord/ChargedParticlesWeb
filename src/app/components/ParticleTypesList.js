// Frameworks
import React, { useState, useEffect } from 'react';
import * as _ from 'lodash';

// App Components
import ParticleCard from './ParticleCard';
import { ParticleHelpers } from '../../utils/particle-helpers';
import { GLOBALS } from '../../utils/globals';

// List of Particle Types
const ParticleTypesList = ({ owner, transactions, allowCache }) => {
    const [ expandedRow, setExpandedRow ] = useState(false);
    const [ particleData, setParticleData ] = useState({});

    let isMounted = true;
    useEffect(() => {
        const particles = ParticleHelpers.cleanCommonTxnFields(transactions);
        if (_.size(particles)) {
            ParticleHelpers.getParticleData(particles)
                .then((loadedParticles) => {
                    if (isMounted) {
                        setParticleData(loadedParticles);
                    }
                })
                .catch(console.error);
        }

        return () => {
            isMounted = false;
        };
    }, [transactions, setParticleData]);

    const _toggleExpandedRow = (event, isExpanded, panel) => {
        setExpandedRow(isExpanded ? panel : false);
    };

    const _getExpansionRow = (particle) => {
        return (
            <ParticleCard
                key={particle.typeId}
                particle={particle}
                expansionPanel={{
                    expanded: expandedRow === particle.typeId,
                    onChange: _toggleExpandedRow
                }}
            />
        );
    };

    const _getRows = () => {
        let first = null;
        const rest = _.map(particleData, particle => {
            if (particle.typeId === GLOBALS.ION_TOKEN_ID) {
                first = _getExpansionRow(particle);
                return;
            }
            return _getExpansionRow(particle);
        });
        return _.compact([first, ...rest]);
    };

    // Display Types
    return (
        <>
            {_getRows()}
        </>
    );
};

export default ParticleTypesList;
