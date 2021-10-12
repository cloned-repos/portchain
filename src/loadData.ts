import { Path } from 'path-parser';
import { debug } from 'debug';

const vesselsUri = process.env.URI_VESSEL || 'https://import-coding-challenge-api.portchain.com/api/v2/vessels';

const vesselScheduleUriBuilder = Path.createPath<{ vesselId: string }>(process.env.URI_VESSEL_SCHEDULE || 'https://import-coding-challenge-api.portchain.com/api/v2/schedule/:vesselId');

const printer = debug('loadData');

export async function loadData(): data {


}

//const vesselScheduleUri = vesselScheduleUriBuilder.build({vesselId: ''});