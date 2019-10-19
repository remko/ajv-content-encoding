const expect = require("chai").expect;
const Ajv = require("ajv");
const plugin = require("../index");

describe("plugin", () => {
  it("should ignore object", () => {
    const validate = plugin(new Ajv()).compile({
      type: "object",
      contentEncoding: "base64"
    });
    const result = validate({});
    expect(result).to.be.true;
    expect(validate.errors).to.be.null;
  });

  it("should validate string without contentEncoding", () => {
    const validate = plugin(new Ajv()).compile({ type: "string" });
    const result = validate("hello");
    expect(result).to.be.true;
    expect(validate.errors).to.be.null;
  });

  it("should fail to compile on unknown contentEncoding", () => {
    expect(() => {
      plugin(new Ajv()).compile({
        type: "string",
        contentEncoding: "dummy"
      });
    }).to.throw;
  });

  it("should validate without compilation", () => {
    const ajv = plugin(new Ajv());
    const result = ajv.validate(
      {
        type: "string",
        contentEncoding: "base64"
      },
      "aGVsbG8K"
    );
    expect(result).to.be.true;
    expect(ajv.errors).to.be.null;
  });

  it("should validate with compilation", () => {
    const validate = plugin(new Ajv()).compile({
      type: "string",
      contentEncoding: "base64"
    });
    const result = validate("aGVsbG8K");
    expect(result).to.be.true;
    expect(validate.errors).to.be.null;
  });

  it("should not validate unknown contentEncoding", () => {
    expect(() => {
      plugin(new Ajv()).validate(
        {
          type: "string",
          contentEncoding: "dummy"
        },
        "hello"
      );
    }).to.throw;
  });

  it("should not have errors after valid", () => {
    const validate = plugin(new Ajv()).compile({
      type: "string",
      contentEncoding: "base64"
    });
    validate("invalid");
    expect(validate.errors).to.have.lengthOf(1);
    validate("aGVsbG8K");
    expect(validate.errors).to.be.null;
  });

  describe("7bit", function() {
    it("should validate ASCII string", () => {
      const ajv = plugin(new Ajv());
      const result = ajv.validate(
        {
          type: "string",
          contentEncoding: "7bit"
        },
        "hello"
      );
      expect(result).to.be.true;
      expect(ajv.errors).to.be.null;
    });

    it("should validate string with control characters", () => {
      const validate = plugin(new Ajv()).compile({
        type: "string",
        contentEncoding: "7bit"
      });
      const result = validate("hello\nthere");
      expect(result).to.be.true;
      expect(validate.errors).to.be.null;
    });

    it("should not validate 8bit string", () => {
      const validate = plugin(new Ajv()).compile({
        type: "string",
        contentEncoding: "7bit"
      });
      const result = validate("hello \u{2603} there");
      expect(validate.errors).to.have.lengthOf(1);
      expect(result).to.be.false;
    });
  });

  describe("base64", function() {
    it("should validate encoded string with Base64 contentEncoding", () => {
      const validate = plugin(new Ajv()).compile({
        type: "string",
        contentEncoding: "base64"
      });
      const result = validate("aGVsbG8K");
      expect(result).to.be.true;
      expect(validate.errors).to.be.null;
    });

    it("should validate 1-padded encoded string with Base64 contentEncoding", () => {
      const validate = plugin(new Ajv()).compile({
        type: "string",
        contentEncoding: "base64"
      });
      const result = validate("aGVsbAo=");
      expect(result).to.be.true;
      expect(validate.errors).to.be.null;
    });

    it("should validate 2-padded encoded string with Base64 contentEncoding", () => {
      const validate = plugin(new Ajv()).compile({
        type: "string",
        contentEncoding: "base64"
      });
      const result = validate("aGVsCg==");
      expect(result).to.be.true;
      expect(validate.errors).to.be.null;
    });

    it("should not validate unencoded string with Base64 contentEncoding", () => {
      const validate = plugin(new Ajv()).compile({
        type: "string",
        contentEncoding: "base64"
      });
      const result = validate("invalid");
      expect(validate.errors).to.have.lengthOf(1);
      expect(result).to.be.false;
    });
  });

  describe("quoted-printable", function() {
    it("should validate ASCII string", () => {
      const validate = plugin(new Ajv()).compile({
        type: "string",
        contentEncoding: "quoted-printable"
      });
      const result = validate("hello");
      expect(result).to.be.true;
      expect(validate.errors).to.be.null;
    });

    it("should validate quoted-printable string", () => {
      const validate = plugin(new Ajv()).compile({
        type: "string",
        contentEncoding: "quoted-printable"
      });
      const result = validate("hello=20there");
      expect(result).to.be.true;
      expect(validate.errors).to.be.null;
    });

    it("should validate multiline quoted-printable string", () => {
      const validate = plugin(new Ajv()).compile({
        type: "string",
        contentEncoding: "quoted-printable"
      });
      const result = validate("hello=20there=\nhi");
      expect(result).to.be.true;
      expect(validate.errors).to.be.null;
    });

    it("should not validate string with =", () => {
      const validate = plugin(new Ajv()).compile({
        type: "string",
        contentEncoding: "quoted-printable"
      });
      const result = validate("hello=A");
      expect(validate.errors).to.have.lengthOf(1);
      expect(result).to.be.false;
    });

    it("should not validate multiline string with =", () => {
      const validate = plugin(new Ajv()).compile({
        type: "string",
        contentEncoding: "quoted-printable"
      });
      const result = validate("hello=A\nhi");
      expect(validate.errors).to.have.lengthOf(1);
      expect(result).to.be.false;
    });

    it("should not validate string with control characters", () => {
      const validate = plugin(new Ajv()).compile({
        type: "string",
        contentEncoding: "quoted-printable"
      });
      const result = validate("hello\bthere");
      expect(validate.errors).to.have.lengthOf(1);
      expect(result).to.be.false;
    });

    it("should not validate 8bit string", () => {
      const validate = plugin(new Ajv()).compile({
        type: "string",
        contentEncoding: "quoted-printable"
      });
      const result = validate("hello \u{2603} there");
      expect(validate.errors).to.have.lengthOf(1);
      expect(result).to.be.false;
    });
  });

  describe("binary", function() {
    it("should validate any string", () => {
      const ajv = plugin(new Ajv());
      const result = ajv.validate(
        {
          type: "string",
          contentEncoding: "binary"
        },
        "hello \u{2603} there"
      );
      expect(result).to.be.true;
      expect(ajv.errors).to.be.null;
    });
  });

  describe("8bit", function() {
    it("should validate any string", () => {
      const ajv = plugin(new Ajv());
      const result = ajv.validate(
        {
          type: "string",
          contentEncoding: "8bit"
        },
        "hello \u{2603} there"
      );
      expect(result).to.be.true;
      expect(ajv.errors).to.be.null;
    });
  });
});
