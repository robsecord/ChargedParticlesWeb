import React from 'react';
import { Link } from 'gatsby';

import Layout from '../layout/layout';
import SEO from '../components/seo';

const About = () => (
    <Layout>
        <SEO title="About" />

        <h1>About</h1>
        <Link to="/">Go back to the homepage</Link>
        <hr/>
    </Layout>
);

export default About;
