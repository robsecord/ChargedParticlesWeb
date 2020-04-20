// Frameworks
import React, { useState, useEffect } from 'react';
import * as _ from 'lodash';

// App Components
import { Helpers } from '../../utils/helpers';
import { AssetTokenHelpers } from '../blockchain/asset-token-helpers';

// Data Context for State
import { useNetworkContext } from '../contexts/network';
import { useWalletContext } from '../contexts/wallet';

// Material UI
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';


const useCustomStyles = makeStyles(theme => ({
    container: {
        margin: 0,
    },
    approvalContainer: {
        textAlign: 'center',
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
    },
    approvalHeading: {
        display: 'block',
        fontSize: '0.7em',
        lineHeight: 1.2,
        marginTop: 8,
        color: theme.palette.grey[400],
    },
    approvalBody: {
        display: 'block',
        fontSize: theme.fontSizes[2],
        marginTop: 3,
        marginBottom: 8,
    },
    disabled: {
        opacity: 0.5,
    }
}));

const ApproveButton = withStyles(theme => ({
    root: {
        width: '100%',
        padding: 0,
        borderRadius: 0,
        borderBottomLeftRadius: theme.shape.borderRadius,
    },
    label: {
        display: 'block',
    },
}))(Button);

const UnlockButton = withStyles(theme => ({
    root: {
        width: '100%',
        padding: 0,
        borderRadius: 0,
        borderBottomRightRadius: theme.shape.borderRadius,
    },
    label: {
        display: 'block',
    },
}))(Button);

const UseMaxButton = withStyles(theme => ({
    label: {
        display: 'block',
        fontSize: 9,
        color: theme.palette.grey[500],

        '& span': {
            display: 'block',
            paddingBottom: 3,
            fontSize: 12,
            lineHeight: '1em',
            color: theme.palette.grey[200],
        },
    },
}))(Button);


const UnlockableAssetInput = ({ particle, onUpdate }) => {
    const customClasses = useCustomStyles();

    const [ networkState ] = useNetworkContext();
    const { isNetworkConnected } = networkState;
    //
    const [ walletState ] = useWalletContext();
    const { allReady, connectedAddress } = walletState;

    // Asset Amount for Funding
    const [assetAmount,        setAssetAmount]      = useState(0);
    const [isAssetAmountValid, setAssetAmountValid] = useState(false);

    // Asset Amount used for Input/Display
    const [assetAmountInput,        setAssetAmountInput] = useState('');
    const [isAssetAmountInputValid, setAssetAmountInputValid] = useState(true);

    // Contract Values
    const [approvalAmount, setApprovalAmount]   = useState(0);
    const [assetBalance,   setAssetBalance]     = useState(0);

    // Validations
    const requiresApproval = assetAmount > 0 && assetAmount > approvalAmount;

    useEffect(() => {
        if (allReady && isNetworkConnected) {
            AssetTokenHelpers.getApprovalAmount({owner: connectedAddress, assetPairId: particle.assetPairId})
                .then(amount => {
                    setApprovalAmount(Helpers.toEther(amount));
                })
                .catch(err => {
                    console.log(err);
                });

            AssetTokenHelpers.getBalance({owner: connectedAddress, assetPairId: particle.assetPairId})
                .then(balance => {
                    setAssetBalance(Helpers.toEther(balance));
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, [allReady, isNetworkConnected]);

    useEffect(() => {
        if (_.isEmpty(assetAmountInput)) {
            setAssetAmountInputValid(true);
        } else {
            const assetAmountInputNum = parseFloat(assetAmountInput);
            const conditions = [
                assetAmountInputNum > 0,
                assetAmountInputNum <= assetBalance,
            ];
            setAssetAmountInputValid(_.every(conditions, Boolean));
        }
    }, [assetAmountInput, assetBalance, setAssetAmountInputValid]);

    useEffect(() => {
        const conditions = [
            assetAmount > 0,
            assetBalance > 0,
            assetAmount <= approvalAmount,
            assetAmount <= assetBalance,
        ];
        setAssetAmountValid(_.every(conditions, Boolean));

    }, [assetAmount, assetBalance, approvalAmount, setAssetAmountValid]);

    useEffect(() => {
        onUpdate({
            assetPairId: particle.assetPairId,
            amount: assetAmount,
            isValid: isAssetAmountValid,
        });
    }, [assetAmount, isAssetAmountValid, particle, onUpdate]);

    const _handleAssetAmountBlur = evt => {
        let value = !_.isEmpty(evt.target.value) ? parseFloat(evt.target.value) : 0;
        value = (value > 0) ? value : 0;
        setAssetAmount(value);
    };

    const _updateAssetAmount = evt => {
        // let value = !_.isEmpty(evt.target.value) ? parseFloat(evt.target.value) : 0;
        // value = (value > 0) ? value : 0;
        let value = _.trimStart(evt.target.value, '0');
        setAssetAmountInput(value);

        _handleAssetAmountBlur(evt);
    };

    const _useMaxAmount = () => {
        setAssetAmountInput(assetBalance);
        setAssetAmount(assetBalance);
    };

    return (
        <div className={customClasses.container}>
            <FormControl
                variant="outlined"
                fullWidth
                required
                error={!isAssetAmountInputValid}
            >
                <InputLabel htmlFor="assetAmountId">Asset Amount</InputLabel>
                <OutlinedInput
                    id="assetAmountId"
                    type="number"
                    value={assetAmountInput}
                    onChange={_updateAssetAmount}
                    onBlur={_handleAssetAmountBlur}
                    endAdornment={
                        <InputAdornment position="end">
                            <UseMaxButton
                                variant="outlined"
                                onClick={_useMaxAmount}
                            >
                                Use Max <span>{_.round(assetBalance, 3)}</span>
                            </UseMaxButton>
                        </InputAdornment>
                    }
                    labelWidth={128}
                />
            </FormControl>

            <div className={customClasses.approvalContainer}>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                >
                    <Grid item xs={12} sm={6}>
                        <ApproveButton
                            variant={requiresApproval ? 'contained' : 'outlined'}
                            color={requiresApproval ? 'primary' : 'default'}
                            disabled={!requiresApproval}
                        >
                            <Typography component={'span'} variant={'overline'} className={customClasses.approvalHeading}>Approve</Typography>
                            <Typography component={'span'} variant={'body1'} className={customClasses.approvalBody}>{assetAmount}</Typography>
                        </ApproveButton>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <UnlockButton
                            variant={requiresApproval ? 'contained' : 'outlined'}
                            color={requiresApproval ? 'secondary' : 'default'}
                            disabled={true}
                        >
                            <Typography component={'span'} variant={'overline'} className={customClasses.approvalHeading}>Infinity</Typography>
                            <Typography component={'span'} variant={'body1'} className={customClasses.approvalBody}>Unlock</Typography>
                        </UnlockButton>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
};

export default UnlockableAssetInput;
