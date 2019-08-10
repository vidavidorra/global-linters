#!/usr/bin/env node

import { Cli } from '../src/cli/cli';

new Cli(process.argv.splice(2));
