import type { Schedule, PortCall } from '../validations/validationDefs'

export const cleanUpOmittedPC: Schedule = {
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

export const cleanUpOmittedLogEntries: Schedule = {
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
                    updatedField: 'isOmitted',
                    arrival: null,
                    departure: '2018-12-31T03:00:00+00:00',
                    isOmitted: true,
                    createdDate: '2018-11-15T14:58:44.813629+00:00'
                },
                {
                    updatedField: 'isOmitted',
                    arrival: null,
                    departure: null,
                    isOmitted: false,
                    createdDate: '2018-11-15T14:58:44.813629+00:00'
                },
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
                    updatedField: 'isOmitted',
                    arrival: null,
                    departure: null,
                    isOmitted: false,
                    createdDate: '2018-11-15T14:58:44.813629+00:00'
                },
                {
                    updatedField: 'arrival',
                    arrival: '2018-12-30T08:00:00+00:00',
                    departure: null,
                    isOmitted: null,
                    createdDate: '2018-11-15T14:58:44.813629+00:00'
                }
            ]
        }
    ]
};

export const unsortedLogEntries: PortCall =
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
            updatedField: 'isOmitted',
            arrival: null,
            departure: null,
            isOmitted: false,
            createdDate: '2018-11-20T22:08:04+00:00'
        },
        {
            updatedField: 'arrival',
            arrival: '2019-01-18T13:00:00+00:00',
            departure: null,
            isOmitted: null,
            createdDate: '2018-11-27T16:33:43+00:00'
        },
        {
            updatedField: 'departure',
            arrival: null,
            departure: '2019-01-19T09:00:00+00:00',
            isOmitted: null,
            createdDate: '2018-11-27T16:33:43+00:00'
        },
        {
            updatedField: 'arrival',
            arrival: '2019-01-18T12:00:00+00:00',
            departure: null,
            isOmitted: null,
            createdDate: '2018-12-24T20:05:59+00:00'

        }
    ]
};

export const schedule4PortCallGroupByPort_01: Schedule = {
    vessel: {
        imo: 9757187,
        name: 'MILANO BRIDGE'
    },
    portCalls: [
        {
            // 2 days 172_800_000ms
            arrival: '2019-01-20T09:48:00+00:00',
            departure: '2019-01-22T09:48:00+00:00',
            createdDate: '2018-08-13T00:30:31.497247+00:00',
            isOmitted: false,
            service: 'East Coast Loop 4',
            port: {
                id: 'USNYC',
                name: 'New York'
            },
            logEntries: [] // not important for this fixture
        },
        {
            // 5 days 432_000_000 ms
            arrival: '2019-01-05T18:54:00+00:00',
            departure: '2019-01-10T18:55:00+00:00',
            createdDate: '2018-10-25T19:24:29.069964+00:00',
            isOmitted: false,
            service: 'East Coast Loop 4',
            port: {
                id: 'USORF',
                name: 'Norfolk'
            },
            logEntries: [] // not important for this fixture
        }
    ]
};

export const schedule4PortCallGroupByPort_02: Schedule = {
    vessel: {
        imo: 9388340,
        name: 'ONE COSMOS'
    },
    portCalls: [{
        // approx 3 days 259_200_000
        arrival: '2019-01-05T18:54:00+00:00',
        departure: '2019-01-08T18:55:00+00:00',
        createdDate: '2018-10-25T19:24:29.069964+00:00',
        isOmitted: false,
        service: 'Pacific North Loop 2',
        port: {
            id: 'JPTYO',
            name: 'Tokyo'
        },
        logEntries: []
    },
    {
        // 12 hours  43_200_000
        arrival: '2020-01-05T09:55:00+00:00',
        departure: '2020-01-05T21:55:00+00:00',
        createdDate: '2019-10-25T19:24:29.069964+00:00',
        isOmitted: false,
        service: 'Pacific North Loop 2',
        port: {
            id: 'USORF',
            name: 'Norfolk'
        },
        logEntries: []
    }
    ]
};

export const schedule4PortCallDelayGroupByVessel_01: Schedule = {
    vessel: {
        imo: 9388340,
        name: 'ONE COSMOS'
    },
    portCalls: [{
        arrival: '2019-04-05T18:54:00+00:00',

        departure: '2019-04-08T18:55:00+00:00',

        createdDate: '2018-10-25T19:24:29.069964+00:00',
        isOmitted: false,
        service: 'Pacific North Loop 2',
        port: {
            id: 'JPTYO',
            name: 'Tokyo'
        },
        logEntries: [
            {
                updatedField: 'arrival',
                arrival: '2019-01-18T12:00:00+00:00',
                departure: null,
                isOmitted: null,
                createdDate: '2019-04-05T20:05:59+00:00' // this can happen after actual arrival, the correct time is entered
            },
            {
                updatedField: 'arrival',
                arrival: '2019-01-18T12:00:00+00:00',
                departure: null,
                isOmitted: null,
                createdDate: '2018-12-24T20:05:59+00:00'

            }



        ]
    },
    {
        // 12 hours  43_200_000
        arrival: '2020-01-05T09:55:00+00:00',
        departure: '2020-01-05T21:55:00+00:00',
        createdDate: '2019-10-25T19:24:29.069964+00:00',
        isOmitted: false,
        service: 'Pacific North Loop 2',
        port: {
            id: 'USORF',
            name: 'Norfolk'
        },
        logEntries: []
    }
    ]
};

export const portCallDelayFixture: Schedule = {
    vessel: {
        imo: 9388340,
        name: 'ONE COSMOS'
    },
    portCalls: [
        {
            arrival: '2019-01-05T09:54:00+00:00',
            departure: '2019-01-05T18:55:00+00:00',
            createdDate: '2018-10-25T19:24:29.069964+00:00',
            isOmitted: false,
            service: 'Pacific North Loop 2',
            port: {
                id: 'JPTYO',
                name: 'Tokyo'
            },
            logEntries: [
                {
                    updatedField: 'arrival',
                    arrival: '2018-12-29T23:00:00+00:00',
                    departure: null,
                    isOmitted: null,
                    createdDate: '2018-10-25T19:24:29.069964+00:00'
                },
                {
                    updatedField: 'arrival',
                    arrival: '2019-01-01T23:00:00+00:00',
                    departure: null,
                    isOmitted: null,
                    createdDate: '2018-11-01T22:27:00.770093+00:00'
                },
                {
                    updatedField: 'arrival',
                    arrival: '2019-01-05T20:00:00+00:00',
                    departure: null,
                    isOmitted: null,
                    createdDate: '2018-12-03T11:59:29.663335+00:00'
                },
                {
                    updatedField: 'arrival',
                    arrival: '2019-01-05T23:00:00+00:00',
                    departure: null,
                    isOmitted: null,
                    createdDate: '2018-12-06T14:24:27.975045+00:00'
                },
                {
                    updatedField: 'arrival',
                    arrival: '2018-12-31T20:00:00+00:00',
                    departure: null,
                    isOmitted: null,
                    createdDate: '2018-12-16T14:20:07.18892+00:00'
                },
                {
                    updatedField: 'arrival',
                    arrival: '2019-01-01T11:00:00+00:00',
                    departure: null,
                    isOmitted: null,
                    createdDate: '2018-12-17T15:58:23.699822+00:00'
                },
                {
                    updatedField: 'arrival',
                    arrival: '2019-01-06T11:00:00+00:00',
                    departure: null,
                    isOmitted: null,
                    createdDate: '2018-12-18T08:17:51.080753+00:00'
                },
                {
                    updatedField: 'arrival',
                    arrival: '2019-01-04T08:00:00+00:00',
                    departure: null,
                    isOmitted: null,
                    createdDate: '2018-12-18T19:04:13.065227+00:00' 
                },
                {
                    updatedField: 'arrival',
                    arrival: '2019-01-01T11:00:00+00:00',
                    departure: null,
                    isOmitted: null,
                    createdDate: '2018-12-18T20:23:31.946282+00:00' // 17.563 days
                },
                {
                    // this is the 14 day delay
                    updatedField: 'arrival',
                    arrival: '2019-01-03T00:30:00+00:00',
                    departure: null,
                    isOmitted: null,
                    createdDate: '2018-12-22T03:37:44.773653+00:00' // 14.26 days
                },
                {
                    updatedField: 'arrival',
                    arrival: '2019-01-02T01:00:00+00:00',
                    departure: null,
                    isOmitted: null,
                    createdDate: '2018-12-23T22:29:40.438266+00:00' // 12.4 days
                },
                {
                    updatedField: 'arrival',
                    arrival: '2019-01-05T23:00:00+00:00',
                    departure: null,
                    isOmitted: null,
                    createdDate: '2018-12-24T05:30:00.595979+00:00' // diff  12.18 days
                },
                {
                    updatedField: 'arrival',
                    arrival: '2019-01-02T20:00:00+00:00',
                    departure: null,
                    isOmitted: null,
                    createdDate: '2018-12-24T10:32:13.913654+00:00' // diff 11.9 days
                },
                {
                    updatedField: 'arrival',
                    arrival: '2019-01-03T23:00:00+00:00',
                    departure: null,
                    isOmitted: null,
                    createdDate: '2018-12-25T23:52:57.798316+00:00' // diff 10.4 days
                },
                {
                    updatedField: 'arrival',
                    arrival: '2019-01-04T23:00:00+00:00',
                    departure: null,
                    isOmitted: null,
                    createdDate: '2018-12-26T09:34:10.442228+00:00' // diff 10 days 
                },
                {
                    // this is both the 2 day delay and 7 day delay
                    updatedField: 'arrival',
                    arrival: '2019-01-05T09:00:00+00:00',
                    departure: null,
                    isOmitted: null,
                    createdDate: '2018-12-28T04:54:48.932366+00:00' // diff 8 days: '2019-01-05T09:54:00+00:00'
                },
                {
                    /* 
                        This mutation was made  2 days AFTER the ship left (departure: '2019-01-05T18:55:00+00:00'
                        So for sure this is NOT a forecast!
                    */
                    updatedField: 'arrival',
                    arrival: '2019-01-05T09:48:00+00:00',
                    departure: null,
                    isOmitted: null,
                    createdDate: '2019-01-05T10:24:24.903194+00:00' 
                },
                
                {
                    /* 
                        This mutation was made  2 days AFTER the ship left (departure: '2019-01-05T18:55:00+00:00'
                        So for sure this is NOT a forecast!
                    */
                    updatedField: 'arrival',
                    arrival: '2019-01-05T09:54:00+00:00',
                    departure: null,
                    isOmitted: null,
                    createdDate: '2019-01-07T00:33:37.594775+00:00'
                }
            ]
        }
    ]
};


