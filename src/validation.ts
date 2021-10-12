
// jsonSchema Snippets
const vessel = {
  $id: 'https://www.portchain.com/vessel.json',
  // annotation
  title: 'Vessel',
  // annotation
  type: 'object',
  properties: {
    imo: {
      description: 'Unique vesselId',
      type: 'integer',
      exclusiveMinimum: 0
    },
    name: {
      description: 'Name of the Vessel',
      type: 'string'
    }
  },
  required: ['imo', 'name'],
  additionalProperties: false
}

// plural
const vessels = {
  $id: 'https://www.portchain.com/vessels.json',
  title: 'Vessels',
  description: 'Array of Vessel type',
  type: 'array',
  items: {
    $ref: 'https://www.portchain.com/vessel.json'
  },
  minItems: 1
}

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


const logEntry = {
  $id: 'https://www.portchain.com/LogEntry.json',
  type: 'object',
  properties: {
    updatedField: { enum: ['departure', 'arrival', 'isOmitted'] },
    arrival: {
      oneOf: [
        { type: "null" },
        { type: 'string', format: 'date-time' }
      ]
    },
    departure: {
      oneOf: [
        { type: "null" },
        { type: 'string', format: 'date-time' }
      ]
    },
    isOmitted: {
      oneOf: [
        { type: "null" },
        { type: 'boolean', }
      ]
    },
    createdDate: {
      type: 'string',
      format: 'date-time'
    }
  },
  required: ['updatedField', 'arrival', 'departure', 'isOmitted', 'createdDate'],
  additionalProperties: false
}

const logEntries = {
  $id: 'https://www.portchain.com/LogEntries.json',
  type: 'array',
  items: {
    $ref: 'https://www.portchain.com/LogEntry.json'
  },
  minItems: 1
}

const portCall = {
  $id: 'https://www.portchain.com/PortCall.json',
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

const portCalls = {
  $id: 'https://www.portchain.com/PortCalls.json',
  type: 'array',
  items: {
    $ref: 'https://www.portchain.com/PortCall.json'
  },
  minItems: 1
}


const schedule = {
  $id: 'https://www.portchain.com/Schedule.json',
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

export { vessel, vessels, port, logEntry, logEntries, portCall, portCalls, schedule };
