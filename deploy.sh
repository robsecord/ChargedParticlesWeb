#!/usr/bin/env bash

echo "Bumping version number.."
version update -p

echo "Rebuilding.."
npm run build

echo "Deploying to Netlify.."
git add .
git commit -m "$1"
git push

#echo "Deploying to IPFS.."
#ipfsHash=$(ipfs add -r public | tail -n 1)
#echo "Deployed to: $ipfsHash"

#echo "Opening Deployed Site.."
#open "https://ipfs.io/ipfs/$ipfsHash"

#echo "Publishing to IPNS (Stage).."
#ipfs name publish --key=ipfs-cp-stg ${ipfsHash}
