import Ajv from 'ajv';
import { vessel, vessels } from './validation';

const ajv = new Ajv({ schemas: [vessel, vessels] });

const validate = ajv.getSchema(vessel.$id);

console.log(validate);