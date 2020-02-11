// Frameworks
import ipfsClient from 'ipfs-http-client';

const IPFS = {
    gateway: 'https://ipfs.io/ipfs',
    client: ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' }),

    async saveImageFile({fileBuffer}) {
        const options = {
            // recursive: false,
            // progress: (prog) => console.log(`received: ${prog}`)
        };
        const source = this.client.add([fileBuffer], options);
        let fileUrl;
        for await (const file of source) {
            fileUrl = `${this.gateway}/${file.path}`;
        }
        return fileUrl;
    },

    async saveJsonFile({jsonObj}) {
        const options = {
            // recursive: false,
            // progress: (prog) => console.log(`received: ${prog}`)
        };
        const source = this.client.add(JSON.stringify(jsonObj), options);
        let fileUrl;
        for await (const file of source) {
            fileUrl = `${this.gateway}/${file.path}`;
        }
        return fileUrl;
    },
};

export default IPFS;
