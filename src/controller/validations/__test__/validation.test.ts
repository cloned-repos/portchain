import { vessel, vessels, port, logEntry, logEntries, portCall, portCalls, schedule } from '../validationDefs';
import createAjv from '../ajvEnhanced';
import type { AnySchema } from 'ajv';

function createAjvHelper(id: string, ...rest: AnySchema[]) {
    const ajv = createAjv({ schemas: rest });
    const validate = ajv.getSchema(id);
    if (validate === undefined) {
        throw new Error(`Could not find id: ${id}`);
    }
    return validate;
}

describe('jsonSchema vessel schedule validation', () => {
    describe('Schema vessel', () => {
        it('missing "name" field', () => {
            const validate = createAjvHelper(vessel.$id, vessel);
            const result = validate({ imo: 798465 });
            expect(result).toBe(false);
            expect(validate.errors).toEqual(
                [
                    {
                        instancePath: '',
                        schemaPath: '#/required',
                        keyword: 'required',
                        params: { missingProperty: 'name' },
                        message: 'must have required property \'name\''
                    }
                ]
            );
        });
        it('missing "imo" field', () => {
            const validate = createAjvHelper(vessel.$id, vessel);
            const result = validate({ name: 'MILANO BRIDGE' });
            expect(result).toBe(false);
            expect(validate.errors).toEqual(
                [
                    {
                        instancePath: '',
                        schemaPath: '#/required',
                        keyword: 'required',
                        params: { missingProperty: 'imo' },
                        message: "must have required property 'imo'"
                    }
                ]
            );
        });
        it('compliant data', () => {
            const validate = createAjvHelper(vessel.$id, vessel);
            const result = validate({ name: 'MILANO BRIDGE', imo: 24352435 });
            expect(result).toBe(true);
            expect(validate.errors).toBeNull();
        });
    });
    describe('Schema vesselS validation', () => {
        it('error if vessels is empty array', () => {
            const validate = createAjvHelper(vessels.$id, vessel, vessels);
            const result = validate([]);//{ name: 'MILANO BRIDGE', imo: 24352435 });
            expect(result).toBe(false);
            expect(validate.errors).toEqual([
                {
                    instancePath: '',
                    schemaPath: '#/minItems',
                    keyword: 'minItems',
                    params: { limit: 1 },
                    message: 'must NOT have fewer than 1 items'
                }
            ]);
        });
        it('error if vessels is array with wrong item type', () => {
            const validate = createAjvHelper(vessels.$id, vessel, vessels);
            const result = validate([{ n: 'MILANO BRIDGE', i: 24352435 }]);
            expect(result).toBe(false);
            expect(validate.errors).toEqual([
                {
                    instancePath: '/0',
                    schemaPath: 'https://www.portchain.com/vessel.json/required',
                    keyword: 'required',
                    params: { missingProperty: 'imo' },
                    message: "must have required property 'imo'"
                },
                {
                    instancePath: '/0',
                    schemaPath: 'https://www.portchain.com/vessel.json/required',
                    keyword: 'required',
                    params: { missingProperty: 'name' },
                    message: "must have required property 'name'"
                }
            ]);
        });
        it('complient data for vessels', () => {
            const validate = createAjvHelper(vessels.$id, vessel, vessels);
            const result = validate([{ name: 'MILANO BRIDGE', imo: 24352435 }]);
            expect(result).toBe(true);
            expect(validate.errors).toBeNull();
        });
    });
    describe('Schema Port validation', () => {
        it('complient data, extra fields are sanitized', () => {
            const validate = createAjvHelper(port.$id, port);
            const data = { id: 'HKHKG', name: 'Hong Kong', hello: 'world' };
            const result = validate(data);
            expect(result).toBe(true);
            expect(validate.errors).toBeNull();
            expect(data).toEqual({ id: 'HKHKG', name: 'Hong Kong' });
        });
        it('missing fields is an error', () => {
            const validate = createAjvHelper(port.$id, port);
            const data = { hello: 'world' };
            const result = validate(data);
            expect(result).toBe(false);
            expect(validate.errors).toEqual([
                {
                    instancePath: '',
                    schemaPath: '#/required',
                    keyword: 'required',
                    params: { missingProperty: 'id' },
                    message: "must have required property 'id'"
                },
                {
                    instancePath: '',
                    schemaPath: '#/required',
                    keyword: 'required',
                    params: { missingProperty: 'name' },
                    message: "must have required property 'name'"
                }
            ]);
            expect(data).toEqual({});
        });
    });
    describe('Schema logEntry validation', () => {
        it('complient data', () => {
            const validate = createAjvHelper(logEntry.$id, logEntry);
            const data = {
                updatedField: 'departure',
                arrival: null,
                departure: '2018-12-31T03:00:00+00:00',
                isOmitted: null,
                createdDate: '2018-11-15T14:58:44.813629+00:00'
            };
            const result = validate(data);
            expect(result).toBe(true);
            expect(validate.errors).toBeNull();
        });
        it('complient data, all versions of updated field', () => {
            const validate = createAjvHelper(logEntry.$id, logEntry);
            const data = {
                updatedField: 'arrival',
                arrival: '2018-12-31T03:00:00+00:00',
                departure: null,
                isOmitted: null,
                createdDate: '2018-11-15T14:58:44.813629+00:00'
            };
            const result = validate(data);
            expect(result).toBe(true);
            expect(validate.errors).toBeNull();
        });
        it('complient data, isOmitted=false, departure, arrival are both null', () => {
            const validate = createAjvHelper(logEntry.$id, logEntry);
            const data = {
                updatedField: 'isOmitted',
                arrival: null,
                departure: null,
                isOmitted: false,
                createdDate: '2018-11-15T14:58:44.813629+00:00'
            };
            const result = validate(data);
            expect(result).toBe(true);
            expect(validate.errors).toBeNull();
        });
        it('invalid date for "createdDated", isOmitted is not boolean or null updatedField is invalid string value', () => {
            const validate = createAjvHelper(logEntry.$id, logEntry);
            const data = {
                updatedField: 'somefield',
                arrival: null,
                departure: null,
                isOmitted: 'false',
                createdDate: '2018-33-15'
            };
            const result = validate(data);
            expect(result).toBe(false);
            expect(validate.errors).toEqual([
                {
                    instancePath: '/updatedField',
                    schemaPath: '#/oneOf/0/properties/updatedField/const',
                    keyword: 'const',
                    params: { allowedValue: 'departure' },
                    message: 'must be equal to constant'
                },
                {
                    instancePath: '/departure',
                    schemaPath: '#/oneOf/0/properties/departure/type',
                    keyword: 'type',
                    params: { type: 'string' },
                    message: 'must be string'
                },
                {
                    instancePath: '/isOmitted',
                    schemaPath: '#/oneOf/0/properties/isOmitted/type',
                    keyword: 'type',
                    params: { type: 'null' },
                    message: 'must be null'
                },
                {
                    instancePath: '/createdDate',
                    schemaPath: '#/oneOf/0/properties/createdDate/format',
                    keyword: 'format',
                    params: { format: 'date-time' },
                    message: 'must match format "date-time"'
                },
                {
                    instancePath: '/updatedField',
                    schemaPath: '#/oneOf/1/properties/updatedField/const',
                    keyword: 'const',
                    params: { allowedValue: 'arrival' },
                    message: 'must be equal to constant'
                },
                {
                    instancePath: '/arrival',
                    schemaPath: '#/oneOf/1/properties/arrival/type',
                    keyword: 'type',
                    params: { type: 'string' },
                    message: 'must be string'
                },
                {
                    instancePath: '/isOmitted',
                    schemaPath: '#/oneOf/1/properties/isOmitted/type',
                    keyword: 'type',
                    params: { type: 'null' },
                    message: 'must be null'
                },
                {
                    instancePath: '/createdDate',
                    schemaPath: '#/oneOf/1/properties/createdDate/format',
                    keyword: 'format',
                    params: { format: 'date-time' },
                    message: 'must match format "date-time"'
                },
                {
                    instancePath: '/updatedField',
                    schemaPath: '#/oneOf/2/properties/updatedField/const',
                    keyword: 'const',
                    params: { allowedValue: 'isOmitted' },
                    message: 'must be equal to constant'
                },
                {
                    instancePath: '/isOmitted',
                    schemaPath: '#/oneOf/2/properties/isOmitted/type',
                    keyword: 'type',
                    params: { type: 'boolean' },
                    message: 'must be boolean'
                },
                {
                    instancePath: '/createdDate',
                    schemaPath: '#/oneOf/2/properties/createdDate/format',
                    keyword: 'format',
                    params: { format: 'date-time' },
                    message: 'must match format "date-time"'
                },
                {
                    instancePath: '',
                    schemaPath: '#/oneOf',
                    keyword: 'oneOf',
                    params: { passingSchemas: null },
                    message: 'must match exactly one schema in oneOf'
                }
            ]);
        });
    });
    describe('Schema logEntries validation', () => {
        //
        it('empty array is an error', () => {
            const validate = createAjvHelper(logEntries.$id, logEntries, logEntry);
            const result = validate([]);
            expect(result).toBe(false);
            expect(validate.errors).toEqual(
                [
                    {
                        instancePath: '',
                        schemaPath: '#/minItems',
                        keyword: 'minItems',
                        params: { limit: 1 },
                        message: 'must NOT have fewer than 1 items'
                    }
                ]
            );
        });

        it('array with one element is invalid', () => {
            const validate = createAjvHelper(logEntries.$id, logEntries, logEntry);
            const result = validate([
                {
                    updatedField: 'isOmitted',
                    arrival: '2018-12-31T03:00:00+00:00',
                    departure: null,
                    isOmitted: null,
                    createdDate: '2018-12-31T03:00:00+00:00'
                },
                {
                    updatedField: 'invalid-field',
                    arrival: '2018-12-31T03:00:00+00:00',
                    departure: null,
                    isOmitted: null,
                    createdDate: '2018-12-31T03:00:00+00:00'
                }]);
            expect(result).toBe(false);
            expect(validate.errors).toEqual([
                {
                    instancePath: '/0/updatedField',
                    schemaPath: 'https://www.portchain.com/LogEntry.json/oneOf/0/properties/updatedField/const',
                    keyword: 'const',
                    params: { allowedValue: 'departure' },
                    message: 'must be equal to constant'
                },
                {
                    instancePath: '/0/arrival',
                    schemaPath: 'https://www.portchain.com/LogEntry.json/oneOf/0/properties/arrival/type',
                    keyword: 'type',
                    params: { type: 'null' },
                    message: 'must be null'
                },
                {
                    instancePath: '/0/departure',
                    schemaPath: 'https://www.portchain.com/LogEntry.json/oneOf/0/properties/departure/type',
                    keyword: 'type',
                    params: { type: 'string' },
                    message: 'must be string'
                },
                {
                    instancePath: '/0/updatedField',
                    schemaPath: 'https://www.portchain.com/LogEntry.json/oneOf/1/properties/updatedField/const',
                    keyword: 'const',
                    params: { allowedValue: 'arrival' },
                    message: 'must be equal to constant'
                },
                {
                    instancePath: '/0/arrival',
                    schemaPath: 'https://www.portchain.com/LogEntry.json/oneOf/2/properties/arrival/type',
                    keyword: 'type',
                    params: { type: 'null' },
                    message: 'must be null'
                },
                {
                    instancePath: '/0/isOmitted',
                    schemaPath: 'https://www.portchain.com/LogEntry.json/oneOf/2/properties/isOmitted/type',
                    keyword: 'type',
                    params: { type: 'boolean' },
                    message: 'must be boolean'
                },
                {
                    instancePath: '/0',
                    schemaPath: 'https://www.portchain.com/LogEntry.json/oneOf',
                    keyword: 'oneOf',
                    params: { passingSchemas: null },
                    message: 'must match exactly one schema in oneOf'
                },
                {
                    instancePath: '/1/updatedField',
                    schemaPath: 'https://www.portchain.com/LogEntry.json/oneOf/0/properties/updatedField/const',
                    keyword: 'const',
                    params: { allowedValue: 'departure' },
                    message: 'must be equal to constant'
                },
                {
                    instancePath: '/1/arrival',
                    schemaPath: 'https://www.portchain.com/LogEntry.json/oneOf/0/properties/arrival/type',
                    keyword: 'type',
                    params: { type: 'null' },
                    message: 'must be null'
                },
                {
                    instancePath: '/1/departure',
                    schemaPath: 'https://www.portchain.com/LogEntry.json/oneOf/0/properties/departure/type',
                    keyword: 'type',
                    params: { type: 'string' },
                    message: 'must be string'
                },
                {
                    instancePath: '/1/updatedField',
                    schemaPath: 'https://www.portchain.com/LogEntry.json/oneOf/1/properties/updatedField/const',
                    keyword: 'const',
                    params: { allowedValue: 'arrival' },
                    message: 'must be equal to constant'
                },
                {
                    instancePath: '/1/updatedField',
                    schemaPath: 'https://www.portchain.com/LogEntry.json/oneOf/2/properties/updatedField/const',
                    keyword: 'const',
                    params: { allowedValue: 'isOmitted' },
                    message: 'must be equal to constant'
                },
                {
                    instancePath: '/1/arrival',
                    schemaPath: 'https://www.portchain.com/LogEntry.json/oneOf/2/properties/arrival/type',
                    keyword: 'type',
                    params: { type: 'null' },
                    message: 'must be null'
                },
                {
                    instancePath: '/1/isOmitted',
                    schemaPath: 'https://www.portchain.com/LogEntry.json/oneOf/2/properties/isOmitted/type',
                    keyword: 'type',
                    params: { type: 'boolean' },
                    message: 'must be boolean'
                },
                {
                    instancePath: '/1',
                    schemaPath: 'https://www.portchain.com/LogEntry.json/oneOf',
                    keyword: 'oneOf',
                    params: { passingSchemas: null },
                    message: 'must match exactly one schema in oneOf'
                }
            ]);
        });
        it('valid input', () => {
            const validate = createAjvHelper(logEntries.$id, logEntries, logEntry);
            const data = [{
                updatedField: 'isOmitted',
                arrival: null,
                departure: null,
                isOmitted: true,
                createdDate: '2018-12-31T03:00:00+00:00'
            }];
            const result = validate(data);
            expect(result).toBe(true);
            expect(validate.errors).toBeNull();
        });
    });
    describe('Schema portCall validation', () => {
        it('valid input', () => {
            const validate = createAjvHelper(portCall.$id, portCall, logEntries, port, logEntry);
            const data = {
                arrival: '2018-12-30T08:00:00+00:00',
                departure: '2018-12-31T03:00:00+00:00',
                createdDate: '2018-11-15T14:58:44.813629+00:00',
                isOmitted: true,
                service: 'East Coast Loop 4',
                port: {
                    id: 'HKHKG',
                    name: 'Hong Kong'
                },
                logEntries: [
                    {
                        updatedField: 'departure',
                        arrival: null,
                        departure: '2018-12-31T03:00:00+00:00',
                        isOmitted: null,
                        createdDate: '2018-11-15T14:58:44.813629+00:00'
                    }
                ]
            };
            const result = validate(data);
            expect(result).toBe(true);
            expect(validate.errors).toBeNull();
        });
        it('missing port info should cause error', () => {
            const validate = createAjvHelper(portCall.$id, portCall, logEntries, port, logEntry);
            const data = {
                arrival: '2018-12-30T08:00:00+00:00',
                departure: '2018-12-31T03:00:00+00:00',
                createdDate: '2018-11-15T14:58:44.813629+00:00',
                isOmitted: true,
                service: 'East Coast Loop 4',
                // port
                logEntries: [
                    {
                        updatedField: 'departure',
                        arrival: null,
                        departure: '2018-12-31T03:00:00+00:00',
                        isOmitted: null,
                        createdDate: '2018-11-15T14:58:44.813629+00:00'
                    }
                ]
            };
            const result = validate(data);
            expect(result).toBe(false);
            expect(validate.errors).toEqual(
                [
                    {
                        instancePath: '',
                        schemaPath: '#/required',
                        keyword: 'required',
                        params: { missingProperty: 'port' },
                        message: "must have required property 'port'"
                    }
                ]
            );
        });
        it('missing logEntries or empty LogEntries', () => {
            const validate = createAjvHelper(portCall.$id, portCall, logEntries, port, logEntry);
            const data = {
                arrival: '2018-12-30T08:00:00+00:00',
                departure: '2018-12-31T03:00:00+00:00',
                createdDate: '2018-11-15T14:58:44.813629+00:00',
                isOmitted: true,
                service: 'East Coast Loop 4',
                port: {
                    id: 'SGSIN',
                    name: 'Singapore'
                }
            };
            const result = validate(data);
            expect(result).toBe(false);
            expect(validate.errors).toEqual([
                {
                    instancePath: '',
                    schemaPath: '#/required',
                    keyword: 'required',
                    params: { missingProperty: 'logEntries' },
                    message: "must have required property 'logEntries'"
                }
            ]);
        });
        it('missing properties or wrong data types', () => {
            const validate = createAjvHelper(portCall.$id, portCall, logEntries, port, logEntry);
            const data = {
                arrival: '2018-12-30T08:00:00+00:00',
                departure: '2018-12-31T03:00:00+00:00',
                createdDate: '2018-11-15T14:58:44.813629+00:00',
                isOmitted: true,
                service: 'East Coast Loop 4',
                port: {
                    id: 'SGSIN',
                    name: 'Singapore'
                }
            };
            const result = validate(data);
            expect(result).toBe(false);
            expect(validate.errors).toEqual([
                {
                    instancePath: '',
                    schemaPath: '#/required',
                    keyword: 'required',
                    params: { missingProperty: 'logEntries' },
                    message: "must have required property 'logEntries'"
                }
            ]);
            const data2 = {
                arrival: '2018-12-30T08:00:00+00:00',
                departure: null,
                createdDate: '2018-11-15T14:58:44.813629+00:00',
                isOmitted: false,
                service: 'East Coast Loop 4',
                port: {
                    id: 'SGSIN',
                    name: 'Singapore'
                },
                logEntries: []
            };
            const result2 = validate(data2);
            expect(result2).toBe(false);
            expect(validate.errors).toEqual([
                {
                    instancePath: '/departure',
                    schemaPath: '#/properties/departure/type',
                    keyword: 'type',
                    params: { type: 'string' },
                    message: 'must be string'
                },
                {
                    instancePath: '/logEntries',
                    schemaPath: '#/minItems',
                    keyword: 'minItems',
                    params: { limit: 1 },
                    message: 'must NOT have fewer than 1 items'
                }
            ]);
        });
    });
    describe('Schema portCalls validation', () => {
        it('validation should reject empty array', () => {
            const validate = createAjvHelper(portCalls.$id, portCall, logEntries, port, logEntry, portCalls);
            const result = validate([]);
            expect(result).toBe(false);
            expect(validate.errors).toEqual(
                [
                    {
                        instancePath: '',
                        schemaPath: '#/minItems',
                        keyword: 'minItems',
                        params: { limit: 1 },
                        message: 'must NOT have fewer than 1 items'
                    }
                ]
            );
        });
        it('compliant data', () => {
            const validate = createAjvHelper(portCalls.$id, portCall, logEntries, port, logEntry, portCalls);
            const result = validate([{
                arrival: '2018-12-30T08:00:00+00:00',
                departure: '2018-12-31T03:00:00+00:00',
                createdDate: '2018-11-15T14:58:44.813629+00:00',
                isOmitted: true,
                service: 'East Coast Loop 4',
                port: {
                    id: 'HKHKG',
                    name: 'Hong Kong'
                },
                logEntries: [
                    {
                        updatedField: 'departure',
                        arrival: null,
                        departure: '2018-12-31T03:00:00+00:00',
                        isOmitted: null,
                        createdDate: '2018-11-15T14:58:44.813629+00:00'
                    }
                ]
            }]);
            expect(result).toBe(true);
            expect(validate.errors).toBeNull();
        });
    });
    describe('Schema Schedule validation', () => {
        it('compliant data', () => {
            const validate = createAjvHelper(schedule.$id, schedule, portCall, logEntries, port, logEntry, portCalls, vessel);
            const data = {
                vessel: {
                    imo: 9757187,
                    name: 'MILANO BRIDGE'
                },
                portCalls: [
                    {
                        arrival: '2018-12-30T08:00:00+00:00',
                        departure: '2018-12-31T03:00:00+00:00',
                        createdDate: '2018-11-15T14:58:44.813629+00:00',
                        isOmitted: true,
                        service: 'East Coast Loop 4',
                        port: {
                            id: 'HKHKG',
                            name: 'Hong Kong'
                        },
                        logEntries: [
                            {
                                updatedField: 'departure',
                                arrival: null,
                                departure: '2018-12-31T03:00:00+00:00',
                                isOmitted: null,
                                createdDate: '2018-11-15T14:58:44.813629+00:00'
                            }
                        ]
                    }
                ]
            };
            const result = validate(data);
            expect(result).toBe(true);
        });
    });
});