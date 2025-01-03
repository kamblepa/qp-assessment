import config from './config';
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

import api from './routes/api/index';

/***** Spawn Express App *****/
const app: Application = express();

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());

// Use the API router for the '/api' route
app.use('/api', api);

/***** Start Node app *****/
const port = process.env.PORT || config.app.port; // Fall back to env PORT if available
const server = app.listen(port, () => {
    console.log(`UI started on Port ${port}`);
});
