// Frameworks
import React, { useState } from 'react';
import * as _ from 'lodash';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Stepper from '@material-ui/core/Stepper';
import Grid from '@material-ui/core/Grid';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// App Components
import ParticleClassification from './ParticleClassification';
import ParticleIdentity from './ParticleIdentity';
import ParticleAttributes from './ParticleAttributes';
import FungibleParticle from './FungibleParticle';
import NonFungibleParticle from './NonFungibleParticle';
import CreateConfirm from './CreateConfirm';
import TokenTypeBadge from '../TokenTypeBadge';

// App Images
import partyPopperImg from '../../../images/party-popper.png';

// Data Context for State
import { useRootContext } from '../../contexts/root';
import { useTransactionContext } from '../../contexts/transaction';


const useCustomStyles = makeStyles(theme => ({
    root: {
        position: 'relative',
        width: '100%',

        '& .type-badge': {
            position: 'absolute',
            top: 20,
            right: 30,
        }
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
}));

const getSteps = ({createParticleData, onSubmitForm, back, next}) => {
    const steps = [];
    steps.push({label: 'Select a Classification', content: (<ParticleClassification back={back} next={next} />)});
    steps.push({label: 'Identify Particle Type', content: (<ParticleIdentity back={back} next={next} />)});
    if (createParticleData.classification === 'series') {
        steps.push({label: 'Customize Series', content: (<ParticleAttributes back={back} next={next} />)});
    }
    if (createParticleData.classification === 'plasma') {
        steps.push({label: 'Define Physics', content: (<FungibleParticle back={back} next={next} />)});
    } else {
        steps.push({label: 'Define Physics', content: (<NonFungibleParticle back={back} next={next} />)});
    }
    steps.push({label: 'Spawn into Existence', content: (<CreateConfirm back={back} next={onSubmitForm} />)});
    return steps;
};

function CreateWizard({ onSubmitForm }) {
    const customClasses = useCustomStyles();

    const [rootState, rootDispatch] = useRootContext();
    const { createParticleData } = rootState;

    const [ txState ] = useTransactionContext();
    const { streamState } = txState;

    const [activeStep, setActiveStep] = useState(0);

    // useEffect(() => {
    //     return () => {
    //         rootDispatch({type: 'CLEAR_CREATION_DATA'});
    //     };
    // }, []);

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
        rootDispatch({type: 'CLEAR_CREATION_DATA'});
    };

    const _handleSubmitForm = (formData) => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
        onSubmitForm(formData);
    };

    const steps = getSteps({
        createParticleData,
        onSubmitForm: _handleSubmitForm,
        back: handleBack,
        next: handleNext,
    });

    const _getFinalStepNotice = () => {
        if (activeStep === steps.length) {
            if (streamState === 'started') {
                return _getTxStartedNotice();
            } else if (!_.isEmpty(streamState)) {
                return _getTxCompletedNotice();
            }
        }
        return '';
    };

    const _getTxStartedNotice = () => {
        return (
            <Paper square elevation={0} className={customClasses.resetContainer}>
                <Grid container direction="row" justify="center" alignItems="center">
                    <img src={partyPopperImg} alt="Party Popper" style={{width: 200}} />
                </Grid>
                <Box py={3}>
                    <Grid container direction="row" justify="center" alignItems="center">
                        <Typography>Transaction Started!  Please check your wallet to Sign the Transaction!</Typography>
                    </Grid>
                </Box>
            </Paper>
        );
    };

    const _getTxCompletedNotice = () => {
        return (
            <Paper square elevation={0} className={customClasses.resetContainer}>
                <Grid container direction="row" justify="center" alignItems="center">
                    <img src={partyPopperImg} alt="Party Popper" style={{width: 200}} />
                </Grid>
                <Box py={3}>
                    <Grid container direction="row" justify="center" alignItems="center">
                        <Typography>Finished! Your Particle is being created!</Typography>
                    </Grid>
                </Box>
                <Box py={2}>
                    <Divider />
                </Box>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Button onClick={handleReset} variant="outlined" color="primary" className={customClasses.button}>
                        Restart
                    </Button>
                </Grid>
            </Paper>
        );
    };

    return (
        <div className={customClasses.root}>
            {
                activeStep > 0 && (
                    <TokenTypeBadge
                        typeData={createParticleData}
                    />
                )
            }
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map(data => (
                    <Step key={data.label}>
                        <StepLabel>{data.label}</StepLabel>
                        <StepContent component="div">
                            {data.content}
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {
                _getFinalStepNotice()
            }
        </div>
    );
}

export default CreateWizard;
