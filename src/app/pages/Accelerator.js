// Frameworks
import React, { useContext } from 'react';
import UseAnimations from 'react-useanimations';
import * as _ from 'lodash';

// Material UI
import Alert from '@material-ui/lab/Alert';
import Container from '@material-ui/core/Container';
import Hidden from '@material-ui/core/Hidden';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

// Data Context for State
import { RootContext } from '../stores/root.store';
import { WalletContext } from '../stores/wallet.store';

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
    market: {component: () => (<Market/>), header: 'Available Particles!', noAccountMsg: 'You must connect your account in order to Mint Particles!'},
    create: {component: () => (<Create/>), header: 'Create a new Particle Type!', noAccountMsg: 'You must connect your account in order to Create Particle Types!'},
    mint:   {component: () => (<Mint/>),   header: 'Mint a Particle!', noAccountMsg: 'You must connect your account in order to Mint Particles!'},
    manage: {component: () => (<Manage/>), header: 'Manage your Particles!', noAccountMsg: 'You must connect your account in order to see your Particle Types!'},
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
    const { acceleratorTab, connectionState } = rootState;

    const [ walletState ] = useContext(WalletContext);
    const { allReady } = walletState;

    const _getTabByIndex = (index) => {
        return _tabsList[_.keys(_tabsList)[index]];
    };

    const _getHeader = () => {
        return (
            <Typography
                variant={'h5'}
                component={'h3'}
                className={classes.pageHeader}
            >
                {_getTabByIndex(acceleratorTab).header}
            </Typography>
        );
    };

    const handleTabChange = (event, newTab) => {
        rootDispatch({type: 'SET_ACCELERATOR_TAB', payload: newTab});
    };

    const _getTabContent = () => {
        if (!allReady) {
            return (
                <>
                    {_getHeader()}
                    <Alert
                        variant="outlined"
                        severity="warning"
                        icon={<UseAnimations animationKey="alertTriangle" size={24} />}
                    >
                        {_getTabByIndex(acceleratorTab).noAccountMsg}
                    </Alert>
                </>
            );
        }

        if (!_.isEmpty(connectionState)) {
            return (
                <>
                    {_getHeader()}
                </>
            );
        }

        return (
            <>
                {_getHeader()}
                {_getTabByIndex(acceleratorTab).component()}
            </>
        );
    };

    return (
        <div className={classes.tabBar}>
            <SEO title="Particle Accelerator" />
            <Container maxWidth="md">
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

                {_getTabContent()}

                <ConnectionWarning />
            </Container>
        </div>
    );
};

export default Accelerator;
