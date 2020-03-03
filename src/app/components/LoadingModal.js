// Frameworks
import React from 'react';

// Material UI
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';

// Rimble UI
import {
    Box,
    Flex,
    Loader,
} from 'rimble-ui';

// Custom Styles
import useRootStyles from '../layout/styles/root.styles';


const LoadingModal = ({ isOpen, title, progress }) => {
    const classes = useRootStyles();
    return (
        <Modal
            aria-labelledby="loading-modal-title"
            aria-describedby="loading-modal-description"
            open={isOpen}
        >
            <div className={classes.simpleModal}>
                <Flex flexWrap="wrap">
                    <Box width={1/4}>
                        <Loader size="80px" />
                    </Box>
                    <Box width={3/4} pl={10}>
                        <Typography variant="h6" id="loading-modal-title">
                            {title}
                        </Typography>
                        <Typography variant="subtitle1" id="loading-modal-description">
                            {progress}
                        </Typography>
                    </Box>
                </Flex>
            </div>
        </Modal>
    )
};

export default LoadingModal;
