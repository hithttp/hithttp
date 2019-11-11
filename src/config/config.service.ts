import { Injectable, Inject } from '@nestjs/common';

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { CONFIG_OPTIONS } from './constants';

@Injectable()
export class ConfigService {
    private readonly envConfig: Record<string, string>;
    constructor(@Inject(CONFIG_OPTIONS) filePath: string) {
        this.envConfig = dotenv.parse(fs.readFileSync(filePath))
        
console.log(`${process.env.NODE_ENV || 'development'}.env`,this.envConfig )
    }
    get(key: string): string {
        return this.envConfig[key];
    }
}