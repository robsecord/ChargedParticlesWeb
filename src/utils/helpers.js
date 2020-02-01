
export const Helpers = {};

Helpers.getBlockieOptions = (walletData, opts = {}) => {
    const defaultOptions = {
        size        : 15,
        scale       : 2,
        seed        : walletData.connectedAddress,
        color       : `#${walletData.connectedAddress.slice(2, 8)}`,
        bgcolor     : `#${walletData.connectedAddress.slice(12, 18)}`,
        spotcolor   : `#${walletData.connectedAddress.slice(22, 28)}`,
    };
    return {...defaultOptions, ...opts};
};
