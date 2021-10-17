import { default as debug } from 'debug';

import type { Request, Response } from 'express';

import type { Schedule, Vessels } from './validations/validationDefs';
import { loadSchedule, loadVessels } from './loadData';
import type { PortCallByPort, VesselDelay } from './transformations';
import {
    removeOmittedPortCalls,
    replaceDates,
    sortLogEntries,
    updatePortCallsByPort,
    updatePortCallDelayByVessel
} from './transformations'

import {
    portCallVisitsRankGroupByPort,
    portCallDurationsGroupByPort,
    portCallDelayGroupByVesselByDelayRank
} from './reports';


const printer = debug('generateReports');

//types 

type ReportNames = 'top5ports' | 'lowest5ports' | 'portCallQuintiles' | 'vesselForeCastByDayDelay';

interface ReportContent {
    title: string
    report: unknown
}

export type AllReports = Record<ReportNames, ReportContent>;

export default async function reportController(req: Request, resp: Response): Promise<void> {

    const portCallsByPort: Record<string, PortCallByPort[]> = {};
    const VesselDelays: Record<string, VesselDelay[]> = {};

    printer('fetching vessels');

    const vessels: Vessels = await loadVessels();
    const schedules: Schedule[] = [];
    for (const vessel of vessels) {
        const schedule = await loadSchedule(vessel.imo);
        schedules.push(schedule);

        // mutate in place, to avoid duplicating arrays

        removeOmittedPortCalls(schedule.portCalls);

        // replace string dates with Date objects (in place)
        schedule.portCalls.forEach(replaceDates);

        // sort logEntries ascending on LogEntry.createdDate
        schedule.portCalls.forEach(pc => {
            pc.logEntries.sort(sortLogEntries);
        });

        // Collect statistics (preparation for reports)

        // 1. Collect port call visits, and duration
        updatePortCallsByPort(schedule, portCallsByPort);

        // 2. Collect vessel delay's from LogEntries
        updatePortCallDelayByVessel(schedule, VesselDelays);
    }
    printer('number of schedules fetched: %d', schedules.length);

    // reports
    // 1. top 5 port Calls
    // The five ports with the most port calls, and the number of port calls for each of these five ports.

    const portCallVisits = portCallVisitsRankGroupByPort(portCallsByPort);
    // the data is degenerate it is better to speak of "ranked" Ports
    const top5ports: ReportContent = {
        title: 'Top 5 ports (ranked) with the most port calls',
        report: portCallVisits.slice(-5).reverse().map((pvc, i) => ({
            rank: i + 1,
            portCalls: pvc.numberOfCalls,
            ports: pvc.ports.join(',')
        }))
    };

    // 2. top 5 port Calls
    // The five ports with the most port calls, and the number of port calls for each of these five ports.

    const lowest5ports: ReportContent = {
        title: 'Lowest 5 ports (ranked) with the least port calls',
        report: portCallVisits.slice(0, 5).map((pcv, i) => ({
            rank: i + 1,
            portCalls: pcv.numberOfCalls,
            ports: pcv.ports.join(',')
        }))
    }

    // 3. quantiles of port call durations per port (5%, 20%, 50%, 75% 90%)
    const portCallDurationQuantiles = portCallDurationsGroupByPort(portCallsByPort, 0.05, 0.2, 0.5, 0.75, 0.9);

    const portCallQuintiles: ReportContent = {
        title: 'the percentiles of port call durations: 5th, 20th, 50th, 75th and 90th percentiles.',
        report: portCallDurationQuantiles
    }


    //console.log(portCallQuantiles)
    // 4. For each vessel, calculate the 5%, 50% and 80% percentiles for the port call delay when the vessel is 14, 7 and 2 days from arrival.

    const portCallDelay = portCallDelayGroupByVesselByDelayRank(VesselDelays, 0.05, 0.5, 0.8);
    const vesselForeCastByDayDelay: ReportContent = {
        title: 'the 5th, 50th and 80th percentiles for the port call delay when the vessel is 14, 7 and 2 days from arrival',
        report: portCallDelay
    }

    const allReports: AllReports = {
        top5ports,
        lowest5ports,
        portCallQuintiles,
        vesselForeCastByDayDelay
    };

    resp.send(allReports);
}
