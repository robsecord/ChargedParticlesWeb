// Frameworks
import React from 'react';
import { Heading, Button, Text, Box } from 'rimble-ui';

// Layout Components
import Layout from '../components/layout';
import SEO from '../components/seo';

// Static Route
const IndexPage = () => {
    return (
        <Layout>
            <SEO title="Home" keywords={[`gatsby`, `application`, `react`]}/>

            <Heading as={"h3"}>
                NFTs Earning Interest with DeFi!
            </Heading>
            <Box mt={4}>
                <Text.p>
                    <Button size="small" as="a" href="/app/">Particle Accelerator</Button>
                </Text.p>
                <Text.p>
                    <Button size="small" as="a" href="/about/">About</Button>
                </Text.p>
            </Box>
            <hr/>
        </Layout>
    );
};

export default IndexPage;
