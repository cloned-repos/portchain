import Ajv from 'ajv';
import type { Options } from 'ajv';
import ajvFormats from 'ajv-formats';

export default function createAjv(opts: Options): Ajv{
    const ajv = new Ajv(Object.assign({}, opts,  { removeAdditional: true, allErrors: true }));
    // add string 
    ajvFormats(ajv);
    return ajv;
}