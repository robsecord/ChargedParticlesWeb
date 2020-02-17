// Frameworks
import React, { useContext } from 'react';
import * as _ from 'lodash';

// Material UI
import Container from '@material-ui/core/Container';
import Hidden from '@material-ui/core/Hidden';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// Data Context for State
import { RootContext } from '../stores/root.store';

// Custom Styles
import useRootStyles from '../layout/styles/root.styles';

// App Components
import { ConnectionWarning } from '../components/ConnectionWarning.js';
import SEO from '../layout/SEO';

// Route Templates
import Create from './Create';
import Mint from './Mint';
import Manage from './Manage';
import Market from './Market';

import acceleratorTabsList from '../components/AcceleratorTabsList';

const _tabsList = _.merge({}, acceleratorTabsList, {
    create: {component: () => (<Create/>)},
    mint:   {component: () => (<Mint/>)},
    manage: {component: () => (<Manage/>)},
    market: {component: () => (<Market/>)},
});

function a11yProps(id) {
    return {
        id: `wallet-tab-${id}`,
        'aria-controls': `wallet-tab-${id}`,
    };
}

// Accelerator Route
const Accelerator = () => {
    const classes = useRootStyles();
    const [ rootState, rootDispatch ] = useContext(RootContext);
    const { acceleratorTab } = rootState;

    const _getTabByIndex = (index) => {
        return _tabsList[_.keys(_tabsList)[index]];
    };

    const handleTabChange = (event, newTab) => {
        rootDispatch({type: 'SET_ACCELERATOR_TAB', payload: newTab});
    };

    return (
        <div className={classes.tabBar}>
            <SEO title="Particle Accelerator" />
            <Container maxWidth="md">
                <ConnectionWarning />
                <Hidden smDown implementation="css">
                    <AppBar position="static" color="default">
                        <Tabs
                            value={acceleratorTab}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                            aria-label="Action Tabs"
                        >
                            {_.map(_tabsList, (tabData, tabKey) => {
                                return (<Tab
                                    key={tabKey}
                                    label={tabData.label}
                                    {...a11yProps(tabData.id)}
                                />);
                            })}
                        </Tabs>
                    </AppBar>
                </Hidden>

                {_getTabByIndex(acceleratorTab).component()}
            </Container>
        </div>
    );
};

export default Accelerator;
