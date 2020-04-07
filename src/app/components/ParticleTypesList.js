// Frameworks
import React, { useState, useEffect, useCallback } from 'react';
import * as _ from 'lodash';

// App Components
import ParticleCard from './ParticleCard';
import { LocalCache } from '../../utils/local-cache';
import { Helpers } from '../../utils/helpers';
import { GLOBALS } from '../../utils/globals';

let fetchedParticles = {};

// List of Particle Types
const ParticleTypesList = ({ owner, transactions, allowCache }) => {
    const [ expandedRow, setExpandedRow ] = useState(false);
    const [ particleData, setParticleData ] = useState({});

    const cacheId = _.isEmpty(owner) ? 'global' : owner;
    const particleCache = useCallback(() => LocalCache.get(`PTC_${cacheId}`, {}), [cacheId]);
    const setParticleCache = (value) => LocalCache.set(`PTC_${cacheId}`, value);

    let isMounted = true;
    let _delayNextEffect = false;
    useEffect(() => {
        if (allowCache) {
            const allData = {...particleData};
            const cacheData = {...particleCache()};

            _.forEach(cacheData, particle => {
                const id = particle.typeId;
                if (_.isEmpty(allData[id]) && !fetchedParticles[id]) {
                    allData[id] = particle;
                }
            });

            if (!_.isEqual(particleData, allData)) {
                setParticleData(allData);
                _delayNextEffect = true;
            }
        }
    }, [allowCache, particleCache, particleData, setParticleData]);

    useEffect(() => {
        const particleTxs = [];
        if (!_delayNextEffect) {
            _.forEach(Helpers.cleanCommonTxnFields(transactions), tx => {
                const id = tx.typeId;
                const particle = particleData[id];
                if (_.isEmpty(particle) && !fetchedParticles[id]) {
                    particleTxs.push(tx);
                }
            });

            if (_.size(particleTxs)) {
                Helpers.fetchParticleMetadata(particleTxs, particleData)
                    .then((allData) => {
                        if (!isMounted) { return; }
                        _.forEach(allData, particle => { fetchedParticles[particle.typeId] = true; });
                        setParticleData(allData);
                        updateParticleCache(allData);
                    })
                    .catch(console.error);
            }
        }

        return () => {
            fetchedParticles = {};
            isMounted = false;
        };
    }, [transactions, particleData, setParticleData]);

    const updateParticleCache = (allData) => {
        if (allowCache) {
            setParticleCache(allData);
        }
    };

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
