import { Schedule, Vessel, PortCalls, PortCall, LogEntry, LogEntries, DateTemplateType } from './validations/validationDefs';


export interface PortCallByPort {
    visitedBy: Vessel,
    duration: number //time in ms
}

export type Delay = '2d' | '7d' | '14d';

export const _2days = 3600 * 24 * 2 * 1000; // in ms
export const _7days = 3600 * 24 * 7 * 1000;
export const _14days = 3600 * 24 * 14 * 1000;

export const delayMarkers: [Delay, number][] = [['2d', _2days], ['7d', _7days], ['14d', _14days]];

export interface VesselDelay {
    delay: Delay;
    forecasted: number; // time in ms NB: the forecast can belong to more then one Delay, in that case this object will be repeated
    degenerate?: boolean; // this delay occurs multiple times
}

export function removeOmittedPortCalls(pc: PortCalls): void {
    for (let i = 0; i < pc.length;) {
        if (pc[i].isOmitted === true) {
            pc.splice(i, 1);
            continue;
        }
        removeLogEntriesTypeOmitted(pc[i].logEntries)
        i++;
    }
}

function removeLogEntriesTypeOmitted(le: LogEntries) {
    for (let i = 0; i < le.length;) {
        if (le[i].updatedField === 'isOmitted') {
            le.splice(i, 1);
            continue;
        }
        i++;
    }
}

//
// descending sort, most recent date is at the start of the array
export function sortLogEntries(a: LogEntry, b: LogEntry): number {
    const aValue = (a.createdDate as Date).valueOf();
    const bValue = (b.createdDate as Date).valueOf();
    return bValue - aValue;
}


function transformDate(dateStr: DateTemplateType | Date): Date {
    if (dateStr instanceof Date) {
        return dateStr;
    }
    const date = new Date(dateStr);
    if (false === dateStr.startsWith(date.toISOString().slice(0, -5))) {
        // not good abort
        throw new Error(`Invalid date format encountered`);
    }
    return date;
}

export function replaceDates(obj: PortCall): void {
    obj.arrival = transformDate(obj.arrival);
    obj.departure = transformDate(obj.departure);
    obj.createdDate = transformDate(obj.createdDate);
    obj.logEntries.forEach(le => {
        if (le.arrival !== null) {
            le.arrival = transformDate(le.arrival);
        }
        if (le.departure !== null) {
            le.departure = transformDate(le.departure);
        }
        le.createdDate = transformDate(le.createdDate);
    });
}

export function updatePortCallsByPort(s: Schedule, map: Record<string, PortCallByPort[]>): void {
    const vessel = s.vessel;
    s.portCalls.forEach(pc => {
        const key = pc.port.id + ':' + pc.port.name;
        const visits: PortCallByPort[] = map[key] || [];
        map[key] = visits;

        const departure = pc.departure.valueOf() as number;
        const arrival = pc.arrival.valueOf() as number;

        const duration = departure - arrival;
        visits.push({ visitedBy: vessel, duration })
    });
}

export function updatePortCallDelayByVessel(s: Schedule, map: Record<string, VesselDelay[]>): void {
    const key = s.vessel.imo + ':' + s.vessel.name;
    const delays: VesselDelay[] = map[key] || [];
    map[key] = delays;
    s.portCalls.forEach(pc => {
        if (typeof pc.arrival === 'string') {
            return;
        }
        const actualArrival = pc.arrival.valueOf();

        let cursor = 0;
        // just to be sure, sort in place on on LogEntry.createdDate

        for (let j = 0; j < pc.logEntries.length && cursor < delayMarkers.length; j++) {
            const le = pc.logEntries[j];
            // filter out arrival
            if (le.updatedField !== 'arrival') {
                continue;
            }
            if (le.arrival === null) {
                continue;
            }
            if (typeof le.arrival === 'string' || typeof le.createdDate === 'string') {
                continue;
            }
            const leTS = le.createdDate.valueOf();
            // this is not a forecast, it is a correction
            if (leTS > actualArrival) {
                continue;
            }
            let degenerate = false;
            while (cursor < delayMarkers.length) {
                const diff = (actualArrival - leTS)
                if (diff >= delayMarkers[cursor][1]) {
                    const marker = delayMarkers[cursor][0];
                    const forecastedArrival = le.arrival.valueOf();
                    const delay = Math.abs(actualArrival - forecastedArrival);
                    const od: VesselDelay = { delay: marker, forecasted: delay };
                    if (degenerate) {
                        od.degenerate = true;
                    }
                    delays.push(od);
                    degenerate = true;
                    cursor++;
                    continue;
                }
                degenerate = false;
                break; // all done for this logEntry
            }
        }
    });
}
