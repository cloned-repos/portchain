const clone = require('clone');

import { Schedule, PortCall } from '../validations/validationDefs';

import {
    cleanUpOmittedPC,
    cleanUpOmittedLogEntries,
    unsortedLogEntries,
    schedule4PortCallGroupByPort_01,
    schedule4PortCallGroupByPort_02,
    portCallDelayFixture
} from './fixtures-transformation';

import {
    removeOmittedPortCalls,
    replaceDates,
    sortLogEntries,
    updatePortCallsByPort,
    updatePortCallDelayByVessel
} from '../transformations';

import type { PortCallByPort, VesselDelay } from '../transformations';

describe('transformations', () => {
    //
    it('remove omitted portCalls from Schedule', () => {
        const schedule: Schedule = clone(cleanUpOmittedPC);
        removeOmittedPortCalls(schedule.portCalls);
        expect(schedule).toEqual({
            vessel: {
                imo: 9757187,
                name: 'MILANO BRIDGE'
            },
            portCalls: [
                {
                    arrival: '2018-12-30T08:00:00+00:00',
                    departure: '2018-12-31T03:00:00+00:00',
                    createdDate: '2018-11-15T14:58:44.813629+00:00',
                    isOmitted: false,
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
        })
    });
    it('remove logEntries of type "isOmitted" from NON omitted PortCalls', () => {
        const schedule: Schedule = clone(cleanUpOmittedLogEntries);
        removeOmittedPortCalls(schedule.portCalls);
        expect(schedule).toEqual({
            vessel: {
                imo: 9757187,
                name: 'MILANO BRIDGE'
            },
            portCalls: [
                {
                    arrival: '2018-12-30T08:00:00+00:00',
                    departure: '2018-12-31T03:00:00+00:00',
                    createdDate: '2018-11-15T14:58:44.813629+00:00',
                    isOmitted: false,
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
                },
                {
                    arrival: '2018-12-30T08:00:00+00:00',
                    departure: '2018-12-31T03:00:00+00:00',
                    createdDate: '2018-11-15T14:58:44.813629+00:00',
                    isOmitted: false,
                    service: 'East Coast Loop 4',
                    port: {
                        id: 'HKHKG',
                        name: 'Hong Kong'
                    },
                    logEntries: [
                        {
                            arrival: "2018-12-30T08:00:00+00:00",
                            createdDate: "2018-11-15T14:58:44.813629+00:00",
                            departure: null,
                            isOmitted: null,
                            updatedField: 'arrival'
                        }
                    ]
                }
            ]
        })
    });
    it('replaceDates with Date object', () => {
        const schedule: Schedule = clone(cleanUpOmittedLogEntries);
        removeOmittedPortCalls(schedule.portCalls);
        schedule.portCalls.forEach(replaceDates);
        const expected: Schedule = {
            vessel: {
                imo: 9757187,
                name: 'MILANO BRIDGE'
            },
            portCalls: [
                {
                    arrival: new Date('2018-12-30T08:00:00+00:00'),
                    departure: new Date('2018-12-31T03:00:00+00:00'),
                    createdDate: new Date('2018-11-15T14:58:44.813629+00:00'),
                    isOmitted: false,
                    service: 'East Coast Loop 4',
                    port: {
                        id: 'HKHKG',
                        name: 'Hong Kong'
                    },
                    logEntries: [
                        {
                            updatedField: 'departure',
                            arrival: null,
                            departure: new Date('2018-12-31T03:00:00+00:00'),
                            isOmitted: null,
                            createdDate: new Date('2018-11-15T14:58:44.813629+00:00')
                        }
                    ]
                },
                {
                    arrival: new Date('2018-12-30T08:00:00+00:00'),
                    departure: new Date('2018-12-31T03:00:00+00:00'),
                    createdDate: new Date('2018-11-15T14:58:44.813629+00:00'),
                    isOmitted: false,
                    service: 'East Coast Loop 4',
                    port: {
                        id: 'HKHKG',
                        name: 'Hong Kong'
                    },
                    logEntries: [
                        {
                            updatedField: 'arrival',
                            arrival: new Date('2018-12-30T08:00:00+00:00'),
                            departure: null,
                            isOmitted: null,
                            createdDate: new Date('2018-11-15T14:58:44.813629+00:00')
                        }

                    ]
                }
            ]
        };
        expect(schedule).toEqual(expected);
        schedule.portCalls.forEach(replaceDates);
        expect(schedule).toEqual(expected);
    });
    it('sorting LogEntries descending', () => {
        const pc: PortCall = clone(unsortedLogEntries);
        replaceDates(pc);
        pc.logEntries.sort(sortLogEntries);
        expect(pc.logEntries).toEqual(
            [
                {
                    updatedField: 'arrival',
                    arrival: new Date('2019-01-18T12:00:00+00:00'),
                    departure: null,
                    isOmitted: null,
                    createdDate: new Date('2018-12-24T20:05:59+00:00')

                },
                {
                    updatedField: 'arrival',
                    arrival: new Date('2019-01-18T13:00:00+00:00'),
                    departure: null,
                    isOmitted: null,
                    createdDate: new Date('2018-11-27T16:33:43+00:00')
                },
                {
                    updatedField: 'departure',
                    arrival: null,
                    departure: new Date('2019-01-19T09:00:00+00:00'),
                    isOmitted: null,
                    createdDate: new Date('2018-11-27T16:33:43+00:00')
                },
                {
                    updatedField: 'isOmitted',
                    arrival: null,
                    departure: null,
                    isOmitted: false,
                    createdDate: new Date('2018-11-20T22:08:04+00:00')
                }
            ]);
    });
    it('updatePortCallsByPort collect portCalls by Port', () => {
        const sched1: Schedule = schedule4PortCallGroupByPort_01;
        const sched2: Schedule = schedule4PortCallGroupByPort_02;

        sched1.portCalls.forEach(replaceDates);
        sched2.portCalls.forEach(replaceDates);

        const map: Record<string, PortCallByPort[]> = {};
        updatePortCallsByPort(sched1, map);
        updatePortCallsByPort(sched2, map);

        expect(map).toEqual({
            "USNYC:New York":
                [
                    {
                        visitedBy:
                        {
                            imo: 9757187,
                            name: 'MILANO BRIDGE'
                        },
                        duration: 172800000 // 2 days=  172_800_000ms
                    }
                ],
            "USORF:Norfolk":
                [
                    {
                        visitedBy:
                        {
                            imo: 9757187,
                            name: 'MILANO BRIDGE'
                        },
                        duration: 432060000 //  5 days = 432_000_000 ms
                    },
                    {
                        visitedBy:
                        {
                            imo: 9388340,
                            name: 'ONE COSMOS'
                        },
                        duration: 43200000 //// 12 hours = 43_200_000
                    }
                ],
            "JPTYO:Tokyo": [
                {
                    visitedBy:
                    {
                        imo: 9388340,
                        name: 'ONE COSMOS'
                    },
                    duration: 259260000 //  // approx 3 days 259_200_000
                }
            ]
        });
    });
    it('updatePortCallDelayByVessel collect portCalls Delay by Vessel', () => {
        const sched1: Schedule = clone(portCallDelayFixture);
        const map: Record<string, VesselDelay[]> = {};
        sched1.portCalls.forEach(replaceDates);
        sched1.portCalls.forEach(pc => {
            pc.logEntries.sort(sortLogEntries);
        });
        updatePortCallDelayByVessel(sched1, map);
        expect(map).toEqual({
            '9388340:ONE COSMOS': [
                { delay: '2d', forecasted: 3240000 },
                { delay: '7d', forecasted: 3240000, degenerate: true },
                { delay: '14d', forecasted: 206640000 }
            ]
        });
    });
});