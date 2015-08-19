#!/bin/bash
set -e

echo "copying site folder contents to s3://labs.waylay.io"

# http://docs.aws.amazon.com/cli/latest/userguide/using-s3-commands.html
aws --color=auto \
  --recursive \
  --exclude="node_modules/*" \
  --exclude=".DS_Store" \
  --exclude="gulpfile.js" \
  --exclude="package.json" \
  --exclude="less/*" \
  --region "us-east-1" \
  s3 cp site s3://labs.waylay.io/
