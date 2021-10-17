# portchain-challenge

- The application is build as a `REST` endpoint (default listening on port 3000) or whatever is specified in environment variable `PORT`.
- There is extensive validation of json data fetched from external endpoints using [JSonSchema](https://json-schema.org)
- LogEntries with `createdDate` **AFTER** the arrival time are ignored as these are not arrival forecasts.

## Install and Run

- This application was developped using node `>=16.9.1`, you will need the same version or higher
- The application is written in typescript, hence the `npm run build` step before `npm start`

```bash

npm i 

npm run build

npm start 

>Server is listening on port:3000
```

## View Reports

Go to `http://localhost:3000` to view the reports

- Advicable to use FireFox or Chrome Browser as these create pretty formatted JSON response.
- `sampleSize` of the specific population is added for quintiles (goes to accuracy and relevance)

## Testing and codecoverage

```bash

npm i

npm run test

------------------------|---------|----------|---------|---------|--------------------
File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s  
------------------------|---------|----------|---------|---------|--------------------
All files               |   96.72 |    87.14 |     100 |   96.51 |                    
 controller             |   96.35 |    87.14 |     100 |   96.23 |                    
  loadData.ts           |   96.22 |    81.81 |     100 |   96.22 | 28,43              
  reports.ts            |     100 |      100 |     100 |     100 |                    
  transformations.ts    |   94.11 |    85.29 |     100 |    93.9 | 60,101,112,115,118 
 controller/validations |     100 |      100 |     100 |     100 | 
  ajvEnhanced.ts        |     100 |      100 |     100 |     100 | 
  validationDefs.ts     |     100 |      100 |     100 |     100 | 
------------------------|---------|----------|---------|---------|--------------------
Test Suites: 4 passed, 4 total
Tests:       38 passed, 38 total
Snapshots:   0 total
Time:        7.935 s
```
