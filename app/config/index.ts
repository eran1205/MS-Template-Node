import * as fs from 'fs';

import { Config } from './environment/config.model';

let _config: Config;
const env = process.env.NODE_ENV;

if (!env) {
    throw new Error('NODE_ENV environment variable not found.');
}

try {
    _config = require(`./environment/${env}`).config;
}
catch (e) {
    throw Error(`Error loading configuration file, ${e.message}`);
}

export const config = _config;