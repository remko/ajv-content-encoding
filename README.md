# [ajv-content-encoding](https://el-tramo.be/ajv-content-encoding): contentEncoding support for AJV

Adds support to [AJV](https://github.com/epoberezkin/ajv) for validating 
strings with [`contentEncoding`](https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.8).

## Install

    yarn add ajv-content-encoding

or

    npm install ajv-content-encoding

## Usage 

    const Ajv = require('ajv');
    const ajv = require('ajv-content-encoding')(new Ajv());

    const validate = ajv.compile({
      type: "string",
      contentEncoding: "base64"
    });

    validate("aGVsbG8K"); // true
    validate("invalid"); // false
