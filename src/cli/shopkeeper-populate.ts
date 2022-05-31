#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .description("lists the themes in your store, along with their IDs and statuses")
  .argument("products", "creates products in your store")
  .argument("customers", "creates customers in your store")
  .argument("draftorders", "creates draft orders in your store")
  .option("-c, --count <NUMBER>")
  .action(() => {
  })

program.parse();
