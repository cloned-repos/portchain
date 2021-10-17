// jsonSchema Snippets

const vessel = {
  $id: 'https://www.portchain.com/vessel.json',
  type: 'object',
  title: 'Vessel',
  properties: {
    imo: {
      type: 'integer',
      exclusiveMinimum: 0
    },
    name: {
      type: 'string'
    }
  },
  required: ['imo', 'name'],
  additionalProperties: false
}

interface Vessel {
  imo: number
  name: string;
}

const vessels = {
  $id: 'https://www.portchain.com/vessels.json',
  title: 'Vessels',
  type: 'array',
  items: {
    $ref: 'https://www.portchain.com/vessel.json'
  },
  minItems: 1
}

type Vessels = Vessel[];

const port = {
  $id: 'https://www.portchain.com/Port.json',
  title: 'Port',
  description: 'Port/Harbor',
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' }
  },
  required: ['id', 'name'],
  additionalProperties: false
};


interface Port {
  id: string;
  name: string;
}

const logEntry = {
  $id: 'https://www.portchain.com/LogEntry.json',
  title: 'LogEntry',
  type: 'object',
  oneOf: [
    {
      type: 'object',
      properties: {
        updatedField: { const: 'departure' },
        arrival: { type: 'null' },
        departure: { type: 'string', format: 'date-time' },
        isOmitted: { type: 'null' },
        createdDate: { type: 'string', format: 'date-time' }
      },
      additionalProperties: false,
      required: ['updatedField', 'arrival', 'departure', 'isOmitted', 'createdDate'],
    },
    {
      type: 'object',
      properties: {
        updatedField: { const: 'arrival' },
        arrival: { type: 'string', format: 'date-time' },
        departure: { type: 'null' },
        isOmitted: { type: 'null' },
        createdDate: { type: 'string', format: 'date-time' }
      },
      additionalProperties: false,
      required: ['updatedField', 'arrival', 'departure', 'isOmitted', 'createdDate'],
    },
    {
      type: 'object',
      properties: {
        updatedField: { const: 'isOmitted' },
        arrival: { type: 'null' },
        departure: { type: 'null' },
        isOmitted: { type: 'boolean' },
        createdDate: { type: 'string', format: 'date-time' }
      },
      additionalProperties: false,
      required: ['updatedField', 'arrival', 'departure', 'isOmitted', 'createdDate'],
    }
  ]
}



type UpdateFieldType = 'departure' | 'arrival' | 'isOmitted';

// matches                '{2018} -{11}     - {15}    T {14}    :{58}     : {44}    .{813629} +{00}     :{00}'
type DateTemplateTypeWithMS = `${number}-${number}-${number}T${number}:${number}:${number}.${number}+${number}:${number}`;
// matches                '{2018} -{11}     - {15}    T {14}    :{58}     : {44}    +{00}     :{00}'
type DateTemplateType = `${number}-${number}-${number}T${number}:${number}:${number}+${number}:${number}` | DateTemplateTypeWithMS;

interface LogEntry {
  updatedField: UpdateFieldType
  arrival: DateTemplateType | null | Date
  departure: DateTemplateType | null | Date
  isOmitted: null | boolean
  createdDate: DateTemplateType | Date
}

const logEntries = {
  $id: 'https://www.portchain.com/LogEntries.json',
  type: 'array',
  title: 'LogEntries',
  items: {
    $ref: 'https://www.portchain.com/LogEntry.json'
  },
  minItems: 1
}

type LogEntries = LogEntry[];


interface PortCall {
  arrival: DateTemplateType | Date
  departure: DateTemplateType | Date
  createdDate: DateTemplateType | Date
  isOmitted: boolean
  service: string
  port: Port
  logEntries: LogEntries
}

const portCall = {
  $id: 'https://www.portchain.com/PortCall.json',
  title: 'PortCall',
  type: 'object',
  properties: {
    arrival: {
      type: 'string',
      format: 'date-time'
    },
    departure: {
      type: 'string',
      format: 'date-time'
    },
    createdDate: {
      type: 'string',
      format: 'date-time'
    },
    isOmitted: { type: 'boolean' },
    service: { type: 'string' },
    port: {
      $ref: 'https://www.portchain.com/Port.json'
    },
    logEntries: {
      $ref: 'https://www.portchain.com/LogEntries.json'
    }
  },
  additionalProperties: false,
  required: ['arrival', 'departure', 'createdDate', 'isOmitted', 'service', 'port', 'logEntries']
};

type PortCalls = PortCall[];

const portCalls = {
  $id: 'https://www.portchain.com/PortCalls.json',
  title: 'PortCalls',
  type: 'array',
  items: {
    $ref: 'https://www.portchain.com/PortCall.json'
  },
  minItems: 1
}

interface Schedule {
  vessel: Vessel
  portCalls: PortCalls
}

const schedule = {
  $id: 'https://www.portchain.com/Schedule.json',
  title: 'Schedule',
  type: 'object',
  properties: {
    vessel: {
      $ref: 'https://www.portchain.com/vessel.json'
    },
    portCalls: {
      $ref: 'https://www.portchain.com/PortCalls.json'
    }
  },
  additionalProperties: false,
  required: ['vessel', 'portCalls']
}

export type { Vessel, Vessels, Port, LogEntry, LogEntries, PortCall, PortCalls, Schedule, DateTemplateType, UpdateFieldType };
export { vessel, vessels, port, logEntry, logEntries, portCall, portCalls, schedule };
