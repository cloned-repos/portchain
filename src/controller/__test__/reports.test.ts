import {
    portCallVisitsRankGroupByPort,
    portCallDurationsGroupByPort,
    portCallDelayGroupByVesselByDelayRank
} from '../reports';

import type {
    PortCallByPort,
    VesselDelay
} from '../transformations';

describe('reports', () => {
    describe('portcall visits', () => {
        it('vessel visits grouped by port', () => {
            const map: Record<string, PortCallByPort[]> =
            {
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
            };
            const result = portCallVisitsRankGroupByPort(map);
            expect(result).toEqual([
                { ports: ['USNYC:New York', 'JPTYO:Tokyo'], numberOfCalls: 1 },
                { ports: ['USORF:Norfolk'], numberOfCalls: 2 }
            ]);
        });
        it('No qunatiles specified when grouping portCall duration by port', () => {
            const result = portCallDurationsGroupByPort({});
            expect(result).toEqual({});
        });
        it('duration of portcall grouped by port', () => {
            const map: Record<string, PortCallByPort[]> =
            {
                "USNYC:New York":
                    [
                        {
                            visitedBy:
                            {
                                imo: 9757187,
                                name: 'MILANO BRIDGE'
                            },
                            duration: 3600 * 24 * 1000 // 1 days 
                        },
                        {
                            visitedBy:
                            {
                                imo: 9757187,
                                name: 'MILANO BRIDGE'
                            },
                            duration: 2 * 3600 * 24 * 1000// 2 days
                        },
                        {
                            visitedBy:
                            {
                                imo: 9757187,
                                name: 'MILANO BRIDGE'
                            },
                            duration: 3 * 3600 * 24 * 1000// 3 days
                        },
                        {
                            visitedBy:
                            {
                                imo: 9757187,
                                name: 'MILANO BRIDGE'
                            },
                            duration: 4 * 3600 * 24 * 1000// 4 days
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
            };
            const result = portCallDurationsGroupByPort(map, 0, 0.25, 0.5, 0.75, 1);
            expect(result).toEqual({
                'USNYC:New York': {
                    durationQuintiles: [
                        '1 day',
                        '1 day, 18 hours',
                        '2 days, 12 hours',
                        '3 days, 6 hours',
                        '4 days',
                    ],
                    sampleSize: 4
                },
                'USORF:Norfolk': {
                    durationQuintiles: [
                        '12 hours',
                        '1 day, 15 hours, 15 seconds',
                        '2 days, 18 hours, 30 seconds',
                        '3 days, 21 hours, 45 seconds',
                        '5 days, 1 minute'
                    ],
                    sampleSize: 2
                },
                'JPTYO:Tokyo': {
                    durationQuintiles: [
                        '3 days, 1 minute',
                        '3 days, 1 minute',
                        '3 days, 1 minute',
                        '3 days, 1 minute',
                        '3 days, 1 minute'
                    ],
                    sampleSize: 1
                }
            });
        });
    });
    describe('vessel arrival forecast grouped by n day delays', () => {
        it('rank by vessel', () => {
            const map: Record<string, VesselDelay[]> = {
                '9769271:MOL TRIUMPH': [
                    { delay: '2d', forecasted: 10800000 },
                    { delay: '2d', forecasted: 20280000 },
                    { delay: '2d', forecasted: 63000000 },
                    { delay: '2d', forecasted: 28800000 },
                    { delay: '2d', forecasted: 22680000 },
                    { delay: '2d', forecasted: 51120000 },
                    { delay: '2d', forecasted: 0 },
                    { delay: '2d', forecasted: 720000 },
                    { delay: '2d', forecasted: 60480000 },
                    { delay: '2d', forecasted: 1080000 },
                    { delay: '2d', forecasted: 3960000 },
                    { delay: '2d', forecasted: 19920000 },
                    { delay: '2d', forecasted: 20880000 },
                    { delay: '2d', forecasted: 27360000 },
                    { delay: '2d', forecasted: 46440000 },
                    { delay: '2d', forecasted: 82800000 },
                    { delay: '2d', forecasted: 11880000 },
                    { delay: '2d', forecasted: 23400000 },
                    { delay: '2d', forecasted: 16920000 },
                    { delay: '2d', forecasted: 4680000 },
                    { delay: '2d', forecasted: 3240000 },
                    { delay: '2d', forecasted: 4320000 }]
            };
            const result1 = portCallDelayGroupByVesselByDelayRank(map, 0, 1);
            expect(result1).toEqual({
                '9769271:MOL TRIUMPH': {
                    '2d': {
                        forecastedQuintiles: [
                            '0 seconds',
                            '23 hours'
                        ],
                        sampleSize: 22
                    }
                }
            });
            const result2 = portCallDelayGroupByVesselByDelayRank(map, 0, 0.5, 1);
            expect(result2).toEqual(
                {
                    "9769271:MOL TRIUMPH": {
                        "2d": {
                            "forecastedQuintiles": [
                                '0 seconds',
                                '5 hours, 35 minutes',
                                '23 hours'
                            ],
                            "sampleSize": 22
                        }
                    }
                }
            );
        });
    });
});