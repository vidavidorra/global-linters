#!/usr/bin/env node

import { Cli } from '../src/cli/cli';

const cli = new Cli();
cli.Run(process.argv.splice(2));
