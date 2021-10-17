// vendor
import { Path } from 'path-parser';
import { default as debug } from 'debug';
import type { Debug } from 'debug';
import fetch from 'node-fetch';

// app
import type { ErrorObject } from 'ajv';
import { vessels, vessel, portCall, portCalls, logEntry, logEntries, port, schedule} from './validations/validationDefs';
import type { Vessels, Schedule } from './validations/validationDefs';
import createAjv from './validations/ajvEnhanced';

// init
export const vesselsUri = process.env.URI_VESSEL || 'https://import-coding-challenge-api.portchain.com/api/v2/vessels';
const vesselScheduleUriObject = new URL(process.env.URI_VESSEL_SCHEDULE || 'https://import-coding-challenge-api.portchain.com/api/v2/schedule/:vesselId');

function vesselScheduleUriBuilder(vesselId: number): string {
    const copy = new URL(vesselScheduleUriObject);
    copy.pathname = Path.createPath(copy.pathname).build({ vesselId });
    return copy.toString();
}

function createVesselsValidator() {

    const ajv = createAjv({ schemas: [vessel, vessels] });
    const validator = ajv.getSchema(vessels.$id);
    if (!validator) {
        throw new Error(`Schema with ${vessels.$id} not found`);
    }
    return function (data: { [index: string]: unknown } = {}): [undefined | ErrorObject[], Vessels] {
        const result = validator(data);
        const errors = Object.assign({}, validator.errors);
        return [!result ? errors : undefined, (data as unknown as Vessels)];
    }
}

function createScheduleValidator() {
    
    const ajv = createAjv({ schemas: [schedule, portCall, logEntries, port, logEntry, portCalls, vessel] });
    const validator = ajv.getSchema(schedule.$id);

    if (!validator) {
        throw new Error(`Schema with ${vessels.$id} not found`);
    }

    return function (data: { [index: string]: unknown } = {}): [undefined | ErrorObject[], Schedule] {
        const result = validator(data);
        const errors = Object.assign({}, validator.errors);
        return [!result ? errors : undefined, (data as unknown as Schedule)];
    }
}

const validateVessels = createVesselsValidator();
const printDebugVessels = (debug as Debug)('loadVessels');

export async function loadVessels(): Promise<Vessels> {
    const respVessels = await fetch(vesselsUri);
    if (!respVessels.ok) {
        printDebugVessels('url=[%s], status=[%d], statusText=[%s], body=[%s]',
            vesselsUri,
            respVessels.status,
            respVessels.statusText,
            await respVessels.text()
        );
        throw new Error(`http Error from: ${vesselsUri}, status:${respVessels.status} ${respVessels.statusText}`);
    }
    const dataRaw = await respVessels.json() as { [index: string]: unknown };
    const [err, data] = validateVessels(dataRaw);
    if (err) {
        printDebugVessels('url=[%s], data invalid, errors=[%j], dataRaw=[%j]',
            vesselsUri,
            err,
            dataRaw
        );
        throw new Error(`Vessels validation error: ${JSON.stringify(err)}`)
    }
    return data;
}

const validateSchedule = createScheduleValidator();
const printDebugSchedule = debug('loadSchedule');

export async function loadSchedule(vesselId: number): Promise<Schedule> {

    const uri = vesselScheduleUriBuilder(vesselId);
    const respSchedule = await fetch(uri);
    if (!respSchedule.ok) {
        printDebugSchedule('url=[%s], status=[%d], statusText=[%s], body=[%s]',
            vesselsUri,
            respSchedule.status,
            respSchedule.statusText,
            await respSchedule.text
        );
        throw new Error(`http Error from: ${uri}, status:${respSchedule.status} ${respSchedule.statusText}`);
    }

    const dataRaw = await respSchedule.json() as { [index: string]: unknown };
    const [err, data] = validateSchedule(dataRaw);
    if (err) {
        printDebugSchedule('url=[%s], data invalid, errors=[%j], dataRaw=[%j]',
            err,
            dataRaw
        );
        throw new Error(`Validation Error of Schedule of vessel ${vesselId}: ${JSON.stringify(err)}`);
    }
    return data;
}

