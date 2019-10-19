var base64RE = new RegExp(
  "^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$"
);
// eslint-disable-next-line no-control-regex
var sevenBitRE = new RegExp("^[\x00-\x7F]*$");

var quotedPrintableRE = new RegExp(
  // eslint-disable-next-line no-control-regex
  "^(([\t\n\r\x21-\x3C\x3E-\x7E]|=[0-9A-F]{2})*(=\n|\n)?)*$"
);

function validateBase64(value) {
  if (base64RE.test(value)) {
    return true;
  }
  validateBase64.errors = (validateBase64.errors || []).concat({
    keyword: "contentEncoding",
    message: "invalid base64-encoded data"
  });
  return false;
}

function validate7bit(value) {
  if (sevenBitRE.test(value)) {
    return true;
  }
  validate7bit.errors = (validate7bit.errors || []).concat({
    keyword: "contentEncoding",
    message: "invalid 7-bit data"
  });
  return false;
}

function validateQuotedPrintable(value) {
  if (quotedPrintableRE.test(value)) {
    return true;
  }
  validateQuotedPrintable.errors = (
    validateQuotedPrintable.errors || []
  ).concat({
    keyword: "contentEncoding",
    message: "invalid quoted-printable data"
  });
  return false;
}

function ignore() {
  return true;
}

module.exports = function(ajv) {
  ajv.removeKeyword("contentEncoding");
  ajv.addKeyword("contentEncoding", {
    type: "string",
    metaSchema: {
      type: "string",
      enum: ["base64", "7bit", "8bit", "binary", "quoted-printable"]
    },
    errors: true,
    compile: function(schema) {
      switch (schema) {
        case "base64":
          return validateBase64;
        case "7bit":
          return validate7bit;
        case "quoted-printable":
          return validateQuotedPrintable;
        default:
          return ignore;
      }
    }
  });
  return ajv;
};
