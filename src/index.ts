

import { writeSync } from 'fs';

import express from 'express';

import reportController from './controller'

const app = express();

app.use(express.json());

app.get('/', reportController);


const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log('Server is listening on port:'+PORT);
})



process.on('uncaughtException', (err, origin) => {
    writeSync(
        process.stderr.fd,
        `Caught exception: ${err}\n` +
        `Exception origin: ${origin}`
    );
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    writeSync(
        process.stderr.fd,
        `Unhandled Rejection Reason: ${String(reason)}`);
    promise
        .then(err => {
            writeSync(
                process.stderr.fd,
                `Unhandled Rejection value:${String(err)}`)
        })
        .then(() => process.exit(1));
});
