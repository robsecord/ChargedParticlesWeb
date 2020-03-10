const config = require('./config');

module.exports = {
    siteMetadata: {
        title           : config.site.title,
        titleTemplate   : config.site.titleTemplate,
        description     : config.site.desc,
        author          : config.site.author,
        url             : config.site.url,
        logoUrl         : config.site.logoUrl,
        image           : config.site.image,
        twitterUsername : config.site.twitterUsername,
    },

    pathPrefix: config.pathPrefix,

    plugins: [
        `gatsby-plugin-react-helmet`,
        {
            resolve: `gatsby-plugin-create-client-paths`,
            options: {prefixes: [`/app/*`]},
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name:               config.manifest.name,
                short_name:         config.manifest.shortName,
                start_url:          config.manifest.startUrl,
                background_color:   config.manifest.backgroundColor,
                theme_color:        config.manifest.themeColor,
                display:            config.manifest.display,
                icon:               config.manifest.icon,
            },
        },
        `gatsby-plugin-lodash`,
        {
            resolve: `gatsby-plugin-prefetch-google-fonts`,
            options: {
                fonts: [
                    {
                        family: `Roboto`,
                        variants: [`300`, `400`, `500`]
                    },
                    {
                        family: `Montserrat`,
                        variants: [`400`, `700`]
                    },
                    {
                        family: `Open Sans`,
                        variants: [`400`, `700`]
                    },
                ],
            },
        },
        {
            resolve: `gatsby-plugin-material-ui`,
            options: {
                stylesProvider: {
                    injectFirst: true,
                },
            },
        },
        `gatsby-plugin-styled-components`,
        {
            resolve: 'gatsby-plugin-react-svg',
            options: {
                rule: {
                    include: /svg|vendor/
                }
            }
        },

        // `gatsby-plugin-netlify`,
        'gatsby-plugin-ipfs',

        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.dev/offline
        `gatsby-plugin-offline`,
    ],
};
