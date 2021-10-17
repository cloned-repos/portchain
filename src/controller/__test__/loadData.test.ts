import { loadVessels, loadSchedule, vesselsUri } from '../loadData';
import type { RequestInfo, HeadersInit, BodyInit } from 'node-fetch';
import { fixtureVessels, fixtureSchedules } from './fixtures-basic';
import { fnMap } from 'node-fetch';
import type { MockHandler } from './mock-fetch';
import { FetchResponse, _404 } from './mock-fetch';
import { readFileSync } from 'fs';
import { resolve } from 'path';

//augment node-fetch
declare module "node-fetch" {
    const fnMap: Map<RequestInfo, MockHandler<unknown>>
}

describe('Vessel data', () => {
    beforeEach(() => {
        fnMap.clear();
    })
    it('loadVessels run correctly', async () => {
        fnMap.set(
            vesselsUri,
            (method: string, headers: HeadersInit, body: BodyInit | null, url: RequestInfo) => {
                return new FetchResponse<typeof fixtureVessels.ok>(true, 200, '', JSON.stringify(fixtureVessels.ok), url);
            });
        const data = await loadVessels();
        expect(data).toEqual(fixtureVessels.ok);
    });
    it('loadVessel remote endpoint returns invalid data', async () => {
        fnMap.set(
            vesselsUri,
            (method: string, headers: HeadersInit, body: BodyInit | null, url: RequestInfo) => {
                return new FetchResponse<typeof fixtureVessels.faulty>(true, 200, '', JSON.stringify(fixtureVessels.faulty), url);
            }
        );
        await expect(loadVessels()).rejects.toThrowError(`Vessels validation error: {"0":{"instancePath":"/0","schemaPath":"https://www.portchain.com/vessel.json/required","keyword":"required","params":{"missingProperty":"imo"},"message":"must have required property 'imo'"},"1":{"instancePath":"/1","schemaPath":"https://www.portchain.com/vessel.json/required","keyword":"required","params":{"missingProperty":"name"},"message":"must have required property 'name'"}}`);
    });
    it('loadVessel remote endpoint returns non 200-299', async () => {
        fnMap.set(
            vesselsUri,
            _404
        );
        await expect(loadVessels()).rejects.toThrowError(`http Error from: https://import-coding-challenge-api.portchain.com/api/v2/vessels, status:404`);
    });
});

describe('Schedule data', () => {
    beforeEach(() => {
        fnMap.clear();
    });
    it('loadSchedule run correctly', async () => {
        fnMap.set(
            'https://import-coding-challenge-api.portchain.com/api/v2/schedule/9757187',
            (method: string, headers: HeadersInit, body: BodyInit | null, url: RequestInfo) => {
                return new FetchResponse<typeof fixtureSchedules.ok>(true, 200, '', JSON.stringify(fixtureSchedules.ok), url);
            });
        const data = await loadSchedule(9757187);
        expect(data).toEqual(fixtureSchedules.ok);
    });

    it('loadSchedule remote endpoint responds non 200-299un correctly', async () => {
        fnMap.set(
            'https://import-coding-challenge-api.portchain.com/api/v2/schedule/9757187',
            _404
        );
        await expect(loadSchedule(9757187)).rejects.toThrowError(`http Error from: https://import-coding-challenge-api.portchain.com/api/v2/schedule/9757187, status:404`);
    });
    it('loadSchedule remote endpoint returns invalid data', async () => {
        fnMap.set(
            'https://import-coding-challenge-api.portchain.com/api/v2/schedule/9757187',
            (method: string, headers: HeadersInit, body: BodyInit | null, url: RequestInfo) => {
                return new FetchResponse<typeof fixtureSchedules.faulty>(true, 200, '', JSON.stringify(fixtureSchedules.faulty), url);
            }
        );
        const message = readFileSync(resolve(__dirname, 'schedule-validation-error.txt'), { encoding: 'utf8'});
        await expect(loadSchedule(9757187)).rejects.toThrowError(message);
    });
});

