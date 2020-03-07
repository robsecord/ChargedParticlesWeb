import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';
import * as _ from 'lodash';

function SEO({description, lang, meta, title}) {
    const {site} = useStaticQuery(graphql`
      query {
        site {
          siteMetadata {
            defaultTitle: title
            defaultDescription: description
            titleTemplate
            url
            image
            twitterUsername
          } 
        }
      }
    `);

    const seoTitle = _.isEmpty(title) ? site.siteMetadata.defaultTitle : title;
    const metaDescription = _.isEmpty(description) ? site.siteMetadata.defaultDescription : description;
    const keywords = [`ethereum`, `defi`, `nft`, `charged particles`];

    return (
        <Helmet
            defer={false}
            htmlAttributes={{
                lang,
            }}
            title={seoTitle}
            titleTemplate={site.siteMetadata.titleTemplate}
            meta={[
                {
                    name: `description`,
                    content: metaDescription,
                },
                {
                    name: `image`,
                    content: site.siteMetadata.image,
                },
                {
                    name: `keywords`,
                    content: keywords.join(' '),
                },
                {
                    property: `og:url`,
                    content: site.siteMetadata.url,
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
                    name: `og:image`,
                    content: site.siteMetadata.image,
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
                    content: site.siteMetadata.twitterUsername,
                },
                {
                    name: `twitter:title`,
                    content: title,
                },
                {
                    name: `twitter:description`,
                    content: metaDescription,
                },
                {
                    name: `twitter:image`,
                    content: site.siteMetadata.image,
                },
            ].concat(meta)}
        />
    );
}

SEO.defaultProps = {
    lang: `en`,
    meta: [],
    description: ``,
    title: ``,
};

SEO.propTypes = {
    description: PropTypes.string,
    lang: PropTypes.string,
    meta: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string,
};

export default SEO;
