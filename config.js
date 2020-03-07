
const title    = 'Charged Particles';
const subtitle = 'DeFi-NFTs';
const prodUrl  = 'https://charged-particles.eth.link'; // No trailing slash
const imageSm  = 'src/images/favicon/android-chrome-192x192.png';
const imageLg  = 'src/images/favicon/android-chrome-512x512.png';

const site = {
    title           : subtitle,
    titleTemplate   : `%s · ${title}`,
    desc            : 'Interest-bearing NFTs on the Ethereum Blockchain!',
    author          : 'Rob Secord (robsecord.eth)',
    twitterUsername : '@DefiNft',
    url             : prodUrl,
    logoUrl         : imageSm,
    image           : imageSm,
};

const manifest = {
    name            : title,
    shortName       : subtitle, // max 12 characters
    startUrl        : prodUrl,
    backgroundColor : '#343434',
    themeColor      : '#EC407A',
    display         : 'standalone',
    icon            : imageLg, // This path is relative to the root of the site.
};

module.exports = {
    site,
    manifest,

    pathPrefix: '__GATSBY_IPFS_PATH_PREFIX__',

    // social
    socialLinks: [
        {
            icon: 'fa-github',
            name: 'Github',
            url: 'https://github.com/robsecord/ChargedParticlesEth',
        },
        // {
        //     icon: 'fa-twitter',
        //     name: 'Twitter',
        //     url: 'https://twitter.com/[__your_social_link__]',
        // },
        // {
        //     icon: 'fa-facebook',
        //     name: 'Facebook',
        //     url: 'https://facebook.com/[__your_social_link__]',
        // },
        // {
        //     icon: 'fa-envelope-o',
        //     name: 'Email',
        //     url: 'mailto:[__your_email_address__]',
        // },
    ],
};
