import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import siteOptions from '../../utils/site-options';

function SEO({description, keywords, lang, meta, title}) {

    const metaDescription = description || siteOptions.metadata.description;
    const metaKeywords = keywords || siteOptions.metadata.keywords;

    return (
        <Helmet
            htmlAttributes={{
                lang,
            }}
            title={title}
            titleTemplate={`%s | ${siteOptions.metadata.title}`}
            meta={[
                {
                    name: `description`,
                    content: metaDescription,
                },
                {
                    name: `keywords`,
                    content: metaKeywords.join(' '),
                },
                {
                    property: `og:title`,
                    content: title,
                },
                {
                    property: `og:description`,
                    content: metaDescription,
                },
                {
                    property: `og:type`,
                    content: `website`,
                },
                {
                    name: `twitter:card`,
                    content: `summary`,
                },
                {
                    name: `twitter:creator`,
                    content: siteOptions.metadata.author,
                },
                {
                    name: `twitter:title`,
                    content: title,
                },
                {
                    name: `twitter:description`,
                    content: metaDescription,
                },
            ].concat(meta)}
        />
    );
}

SEO.defaultProps = {
    lang: `en`,
    keywords: [],
    meta: [],
    description: ``,
};

SEO.propTypes = {
    description: PropTypes.string,
    lang: PropTypes.string,
    meta: PropTypes.arrayOf(PropTypes.object),
    keywords: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string.isRequired,
};

export default SEO;
