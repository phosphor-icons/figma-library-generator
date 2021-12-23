#!/usr/bin/env node
"use strict";

const fs = require("fs/promises");
const path = require("path");
const axios = require("axios");
const chalk = require("chalk");
const { Command } = require("commander");
const { version } = require("../package.json");

const ICON_API_URL = "https://api.phosphoricons.com";
const CATGEGORY_MAP = {
  Arrows: "ARROWS",
  Brands: "BRAND",
  Commerce: "COMMERCE",
  Communication: "COMMUNICATION",
  Design: "DESIGN",
  Development: "DEVELOPMENT",
  Education: "EDUCATION",
  Games: "GAMES",
  "Health & Wellness": "HEALTH",
  "Maps & Travel": "MAP",
  "Math & Finance": "FINANCE",
  Media: "MEDIA",
  "Office & Editing": "OFFICE",
  People: "PEOPLE",
  "Security & Warnings": "SECURITY",
  "System & Devices": "SYSTEM",
  Time: "TIME",
  "Weather & Nature": "WEATHER",
};

async function main() {
  const program = new Command();
  program
    .version(version)
    .option(
      "-r --release <version>",
      "Fetch icons from Phosphor API and compile to internal data structure"
    )
    .option("-p --published", "Published status of icons")
    .option("-P, --no-published", "Published status of icons")
    .option("-q --query <text>", "Fulltext search term")
    .option("-n --name <name>", "Exact icon namee match");

  program.parse(process.argv);
  const params = new URLSearchParams(Object.entries(program.opts())).toString();

  try {
    const res = await axios.get(`${ICON_API_URL}?${params}`);
    if (res.data) {
      let fileString = `\
import * as Icons from "phosphor-react";
import { IconEntry, IconCategory } from ".";

export const icons: ReadonlyArray<IconEntry> = [
`;

      res.data.icons.forEach((icon) => {
        fileString += `\
  {
    name: "${icon.name}",
    category: IconCategory.${CATGEGORY_MAP[icon.category]},
    tags: ${JSON.stringify(["*new*", ...icon.tags])},
    Icon: Icons.${icon.name
      .split("-")
      .map((substr) => substr.replace(/^\w/, (c) => c.toUpperCase()))
      .join("")},
  },
`;
        console.log(`${chalk.inverse.green(" DONE ")} ${icon.name}`);
      });

      fileString += `
];

if (process.env.NODE_ENV === "development") {
  console.log(\`\${icons.length} icons\`);
}

export const iconCount = (icons.length * 6)
  .toString()
  .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

`;

      try {
        await fs.writeFile(
          path.join(__dirname, "../src/lib/new.ts"),
          fileString
        );
        console.log(
          `${chalk.green(" DONE ")} ${res.data.icons.length} icons ingested`
        );
      } catch (e) {
        console.error(`${chalk.inverse.red(" FAIL ")} Could not write file`);
      }
    } else {
      console.error(`${chalk.inverse.red(" FAIL ")} No data`);
    }
  } catch (e) {
    console.error(e);
    process.exit(-1);
  }
}

main();
