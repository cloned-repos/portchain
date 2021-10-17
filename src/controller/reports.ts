
import { HumanizeDurationLanguage, HumanizeDuration } from 'humanize-duration-ts';

const langService = new HumanizeDurationLanguage();
const humanizer =  new HumanizeDuration(langService);


import type { Delay, PortCallByPort, VesselDelay } from './transformations';

export interface PortRankingVisits {
    ports: string[]
    numberOfCalls: number
}

export interface PortDurationQuintiles {
    durationQuintiles: string[]
    sampleSize: number
}

export interface ForeCastedQuantities {
    forecastedQuintiles: string[]
    sampleSize: number
}

export type VesselQuintileDelays = Record<string, Record<Delay, ForeCastedQuantities>>;
export type PortQuintileDurations = Record<string, PortDurationQuintiles>

export function portCallVisitsRankGroupByPort(map: Record<string, PortCallByPort[]>): PortRankingVisits[] {

    const rankRaw: Record<number, string[]> = {};
    for (const key of Object.keys(map)) {
        const length = map[key].length;
        rankRaw[length] = rankRaw[length] || [];
        rankRaw[length].push(key);
    }
    const ordered = Array.from(Object.entries(rankRaw)).
        map(r => {
            return {
                ports: r[1],
                numberOfCalls: parseInt(r[0], 10)
            };
        })
        .sort((a, b) => {
            return a.numberOfCalls - b.numberOfCalls;
        });

    return ordered;
}


function determineQuintiles(samples: number[], ...quintiles: number[]): string[] {
    samples.sort((a, b) => a - b);
    const N = samples.length;
    const i = quintiles.map(v => (N - 1) * v);

    const q = i.map(index => {
        const idx = Math.trunc(index);
        const f1 = 1 - (index - idx);
        const f2 = 1 - f1;
        let _rc = samples[idx] * f1
        if (f2 !== 0 && (idx + 1) < samples.length) {
            _rc += samples[idx + 1] * f2;
        }
        return humanizer.humanize(Math.round(_rc));
    });
    return q;
}

export function portCallDurationsGroupByPort(map: Record<string, PortCallByPort[]>, ...quintiles: number[]): PortQuintileDurations {
    if (quintiles.length === 0) {
        return {};
    }
    const rc: PortQuintileDurations = {};
    for (const port of Object.keys(map)) {
        // only select durations
        const durations = map[port].map(pcp => pcp.duration);
        const q = determineQuintiles(durations, ...quintiles);
        rc[port] = { durationQuintiles: q, sampleSize: durations.length };
    }
    return rc;
}

export function portCallDelayGroupByVesselByDelayRank(map: Record<string, VesselDelay[]>, ...quintiles: number[]): VesselQuintileDelays {
    // only select durations
    const collector: Record<string, Record<Delay, number[]>> = {};
    for (const vessel of Object.keys(map)) {
        collector[vessel] = collector[vessel] || {}
        for (const vesselDelay of map[vessel]) {
            collector[vessel][vesselDelay.delay] = collector[vessel][vesselDelay.delay] || [];
            collector[vessel][vesselDelay.delay].push(vesselDelay.forecasted);
        }
    }
    const rc: VesselQuintileDelays = {};
    for (const vessel of Object.keys(collector)) {
        rc[vessel] = {} as Record<Delay, ForeCastedQuantities>;
        (['2d', '7d', '14d'] as Delay[]).forEach(delay => {
            const samples = collector[vessel][delay];
            if (samples === undefined){
                 return null;
            }
            const q = determineQuintiles(samples, ...quintiles);
            rc[vessel][delay] = { forecastedQuintiles: q, sampleSize: samples.length };
        });
    }
    return rc;
}