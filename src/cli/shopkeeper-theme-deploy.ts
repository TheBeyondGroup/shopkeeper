#!/usr/bin/env node

import { Command } from 'commander';
import BlueGreenStrategy from '../lib/strategy/blue-green-strategy';

const program = new Command();

program
  .description('deploy a theme')
  .option('--staging', 'deploy to staging environment', false)

const options = program.opts();

program.action(() => {
  const blueGreenStrategy = new BlueGreenStrategy();
  blueGreenStrategy.deploy(options.staging);
});

program.parse();
