# ajv-content-encoding: Plugin for `contentEncoding` validation in AJV

Adds support to [AJV](https://github.com/epoberezkin/ajv) for validating 
strings with [`contentEncoding`](https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.8).

Supports the types defined in [RFC2045](https://tools.ietf.org/html/rfc2045#section-6.1): 
`base64`, `7bit`, `8bit`, `binary`, and `quoted-printable`.

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


## Caveats

- The values of `contentEncoding` should be all-lowercase, and are case-sensitive
  (i.e. `base64`, `7bit`, `8bit`, `binary`, and `quoted-printable`).
- The `quoted-printable` validation does not validate all constraints on quoted-printable encodings. 
  E.g., it is more forgiving in when to allow newline characters etc.
