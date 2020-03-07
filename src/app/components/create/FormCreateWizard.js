// Frameworks
import React, { useState, useEffect } from 'react';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// App Components
import FormCreateClasification from './FormCreateClassification';
import FormCreateCommon from './FormCreateCommon';


const useCustomStyles = makeStyles(theme => ({
    root: {
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

const getStepContent = ({step, back, next, onUpdate}) => {
    switch (step) {
        case 0:
            return (<FormCreateClasification back={back} next={next} onUpdate={onUpdate} />);
        case 1:
            return (<FormCreateCommon back={back} next={next} onUpdate={onUpdate} />);
        case 2:
            return 'Todo..';
        case 3:
            return 'Todo..';
        default:
            return 'Unknown step';
    }
};

function FormCreateWizard({ onSubmitForm }) {
    const customClasses = useCustomStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({});
    const steps = getSteps();

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const handleUpdate = (sectionData) => {
        console.log('handleUpdate', sectionData);
        setFormData({
            ...formData,
            ...sectionData
        });
    };

    useEffect(() => {
        console.log('FormCreateWizard formData', formData);
    }, [formData]);

    return (
        <div className={customClasses.root}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, step) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent component="div">
                            {
                                getStepContent({
                                    step,
                                    back: handleBack,
                                    next: handleNext,
                                    onUpdate: handleUpdate
                                })
                            }
                            <div className={customClasses.actionsContainer}>
                                <div>
                                    <Button
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        className={customClasses.button}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleNext}
                                        className={customClasses.button}
                                    >
                                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                    </Button>
                                </div>
                            </div>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={0} className={customClasses.resetContainer}>
                    <Typography>All steps completed - you&apos;re finished</Typography>
                    <Button onClick={handleReset} className={customClasses.button}>
                        Reset
                    </Button>
                </Paper>
            )}
        </div>
    );
}

export default FormCreateWizard;
