// Frameworks
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { navigate } from '@reach/router';
import * as _ from 'lodash';

// Material UI
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';

// App Components
import { AppTitleLink } from './AppTitleLink';

// Data Context for State
import { RootContext } from '../stores/root.store';

// Common
import { GLOBALS } from '../../utils/globals';

// Custom Styles
import useRootStyles from '../layout/styles/root.styles';

// Tabs List for Accelerator
import acceleratorTabsList from './AcceleratorTabsList';


const Sidemenu = ({ title, closeDrawer }) => {
    const classes = useRootStyles();
    const [ rootState, rootDispatch ] = useContext(RootContext);
    const { acceleratorTab } = rootState;

    const _getIndexByTabKey = (tabKey) => {
        return _.indexOf(_.keys(acceleratorTabsList) || [], tabKey)
    };

    const _selectTab = (tabKey) => () => {
        closeDrawer();
        navigate(GLOBALS.ACCELERATOR_ROOT);
        rootDispatch({type: 'SET_ACCELERATOR_TAB', payload: _getIndexByTabKey(tabKey)});
    };

    const _isSelected = (tabKey) => {
        return acceleratorTab === _getIndexByTabKey(tabKey)
    };

    return (
        <div>
            <AppBar position="static" className={classNames(classes.sidemenu, classes.appBar)}>
                <Toolbar>
                    <AppTitleLink title="" />
                </Toolbar>
            </AppBar>
            <Divider/>

            <List>
                {_.map(acceleratorTabsList, (tabData, tabKey) => (
                    <ListItem
                        button
                        key={tabKey}
                        selected={_isSelected(tabKey)}
                        onClick={_selectTab(tabKey)}
                    >
                        <ListItemText
                            primary={tabData.label}
                        />
                    </ListItem>
                ))}
            </List>

        </div>
    );
};

Sidemenu.propTypes = {
    title: PropTypes.string.isRequired,
    closeDrawer: PropTypes.func.isRequired,
};

export { Sidemenu };
