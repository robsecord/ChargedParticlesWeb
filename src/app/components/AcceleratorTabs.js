// Frameworks
import React from 'react';
import { navigate } from 'gatsby';
import * as _ from 'lodash';

// Material UI
import Hidden from '@material-ui/core/Hidden';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// App Components
import { GLOBALS } from '../../utils/globals';
import acceleratorTabsList from './AcceleratorTabsList';

function a11yProps(id) {
    return {
        id: `accelerator-tab-${id}`,
        'aria-controls': `accelerator-tab-${id}`,
    };
}

// Accelerator Tab Navigation
const AcceleratorTabs = ({ location }) => {

    const _currentTabIndex = () => {
        const path = location.pathname.replace(`${GLOBALS.ACCELERATOR_ROOT}/`, '');
        const routeId = _.first(path.split('/'));
        return _.get(_.find(acceleratorTabsList, {id: routeId}), 'index', 0);
    };
    const acceleratorTab = _currentTabIndex();

    const handleTabChange = (event, routeIndex) => {
        const defaultRoute = acceleratorTabsList.market.route;
        const route = _.get(_.find(acceleratorTabsList, {index: routeIndex}), 'route', defaultRoute);
        if (!_.isEmpty(route)) {
            navigate(`${GLOBALS.ACCELERATOR_ROOT}${route}`);
        }
    };

    return (
        <Hidden smDown implementation="css">
            <AppBar position="static" color="default">
                <Tabs
                    value={acceleratorTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="Accelerator Tabs"
                >
                    {_.map(acceleratorTabsList, (tabData, tabKey) => {
                        return (<Tab
                            key={tabKey}
                            label={tabData.label}
                            {...a11yProps(tabData.id)}
                        />);
                    })}
                </Tabs>
            </AppBar>
        </Hidden>
    );
};

export { AcceleratorTabs };
