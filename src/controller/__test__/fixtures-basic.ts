export const fixtureVessels = {
    faulty: [
        {
            // missing id
            name: "ABIDJAN EXPRESS"
        },
        {
            imo: 9314935,
            // missing name
        },
    ],
    ok: [
        {
            imo: 9303807,
            name: "ABIDJAN EXPRESS"
        },
        {
            imo: 9314935,
            name: "AS CAROLINA"
        },
        {
            imo: 9335173,
            name: "COSCO BOSTON"
        },
        {
            imo: 9337626,
            name: "NYK CONSTELLATION"
        },
        {
            imo: 9387425,
            name: "EMPIRE"
        },
        {
            imo: 9388340,
            name: "ONE COSMOS"
        },
        {
            imo: 9461867,
            name: "APL CHONGQING"
        },
        {
            imo: 9485007,
            name: "YM MASCULINITY"
        },
        {
            imo: 9597549,
            name: "APL MIAMI"
        },
        {
            imo: 9732319,
            name: "AL MASHRAB"
        },
        {
            imo: 9757187,
            name: "MILANO BRIDGE"
        },
        {
            imo: 9769271,
            name: "MOL TRIUMPH"
        }
    ]
};

export const fixtureSchedules = {
    ok: {
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
    },
    faulty: {
        vessel: {
            //imo: 9757187,  missing imo
            name: 'MILANO BRIDGE'
        },
        portCalls: [
            {
                //arrival: '2018-12-30T08:00:00+00:00',  missing arrival
                departure: '2018-12-31T03:00:00+00:00',
                createdDate: '2018-11-15T14:58:44.813629+00:00',
                isOmitted: true,
                service: 'East Coast Loop 4',
                port: {
                    id: 'HKHKG',
                    //name: 'Hong Kong'  missing name
                },
                logEntries: [
                    {
                        updatedField: 'departure',
                        //arrival: null, missing arrival
                        departure: '2018-12-31T03:00:00+00:00',
                        isOmitted: null,
                        createdDate: '2018-11-15T14:58:44.813629+00:00'
                    }
                ]
            }
        ]
    }
};
