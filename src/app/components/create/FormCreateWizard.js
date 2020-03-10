// Frameworks
import React, { useState, useEffect, useContext } from 'react';

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
import FormCreateClasification from './FormCreateClassification';
import FormCreateCommon from './FormCreateCommon';
import FormCreateFungible from './FormCreateFungible';
import FormCreateNonFungible from './FormCreateNonFungible';
import FormCreateConfirm from './FormCreateConfirm';
import TokenTypeBadge from '../TokenTypeBadge';

// App Images
import partyPopperImg from '../../../images/party-popper.png';

// Data Context for State
import { RootContext } from '../../stores/root.store';


const useCustomStyles = makeStyles(theme => ({
    root: {
        position: 'relative',
        width: '100%',
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

const getSteps = () => {
    return [
        'Select a Classification',
        'Identify Particle',
        'Define Physics',
        'Spawn into Existence',
    ];
};

const getStepContent = ({createParticleData, onSubmitForm, step, back, next}) => {
    switch (step) {
        case 0:
            return (<FormCreateClasification back={back} next={next} />);
        case 1:
            return (<FormCreateCommon back={back} next={next} />);
        case 2:
            if (createParticleData.classification === 'plasma') {
                return (<FormCreateFungible back={back} next={next} />);
            }
            return (<FormCreateNonFungible back={back} next={next} />);
        case 3:
            return (<FormCreateConfirm back={back} next={onSubmitForm} />);
        default:
            return 'Unknown step';
    }
};

function FormCreateWizard({ onSubmitForm }) {
    const customClasses = useCustomStyles();

    const [rootState, rootDispatch] = useContext(RootContext);
    const { createParticleData } = rootState;

    const [activeStep, setActiveStep] = useState(0);
    const steps = getSteps();

    useEffect(() => {
        return () => {
            rootDispatch({type: 'CLEAR_CREATION_DATA'});
        };
    }, []);

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
                {steps.map((label, step) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent component="div">
                            {
                                getStepContent({
                                    step,
                                    createParticleData,
                                    onSubmitForm: _handleSubmitForm,
                                    back: handleBack,
                                    next: handleNext,
                                })
                            }
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={0} className={customClasses.resetContainer}>
                    <Grid container direction="row" justify="center" alignItems="center">
                        <img src={partyPopperImg} alt="Party Popper" style={{width: 200}} />
                    </Grid>
                    <Box py={3}>
                        <Grid container direction="row" justify="center" alignItems="center">
                            <Typography>Finished! Your Particle is being Created!</Typography>
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
            )}
        </div>
    );
}

export default FormCreateWizard;
