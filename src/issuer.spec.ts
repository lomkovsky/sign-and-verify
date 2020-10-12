import { readFileSync } from 'fs';
import { expect } from 'chai';
import 'mocha';

import { createIssuer } from './issuer';
import { SignatureOptions, createSigner } from './signatures';
import { Config } from './config';

const identifer = 'did:web:digitalcredentials.github.io#96K4BSIWAkhcclKssb8yTWMQSz4QzPWBy-JsAFlwoIs';
const controller = 'did:web:digitalcredentials.github.io';
const credential = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1"
  ],
  "id": "http://example.gov/credentials/3732",
  "type": [
    "VerifiableCredential",
    "UniversityDegreeCredential"
  ],
  "issuer": "did:web:digitalcredentials.github.io",
  "issuanceDate": "2020-03-10T04:24:12.164Z",
  "credentialSubject": {
    "id": "did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg",
    "degree": {
      "type": "BachelorDegree",
      "name": "Bachelor of Science and Arts"
    }
  }
};
const config: Config = {
  port: 5000,
  unlockedDid: JSON.parse(readFileSync("data/unlocked-did:web:digitalcredentials.github.io.json").toString("ascii"))
};
const issuer = createIssuer(config)
const signer = createSigner(config);

describe('Issuer test',
  () => {
    it('should create suite', () => {
      const options = new SignatureOptions({ verificationMethod: identifer });
      const result = signer.createSuite(options);
      expect(result.key.id).to.equal(identifer);
      expect(result.key.type).to.equal('JsonWebKey2020');
      expect(result.key.controller).to.equal(controller);
    });

    it('should sign', async () => {
      const options = new SignatureOptions({ verificationMethod: identifer });
      const result = await issuer.sign(credential, options);
      expect(result.issuer).to.equal(controller);
    }).slow(5000).timeout(10000);
  });
