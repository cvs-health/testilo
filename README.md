# testilo
Scorer and digester of Testaro reports

## Introduction

This application enriches [Testaro](https://www.npmjs.com/package/testaro) reports. Testaro performs digital accessibility tests on Web resources and creates reports in JSON format of the results. To make those reports more useful, this application, Testilo, computes scores and converts the scored reports to human-readable web pages.

## Dependencies

The `dotenv` dependency lets you set environment variables in an untracked `.env` file.

## Scoring

To score a Testaro report, execute the statement `node score xyz`, replacing `xyz` with the base of the name of the file containing the report.

This procedure has some preconditions:
- The full name of the report file is `xyz.json`.
- The report file is located in the directory whose relative path (relative to the project directory of Testilo) is the value of the `REPORTDIR` environment variable.
- Testilo can read and write in that report directory.
- The `procs/score` directory contains a file named `tspnn.js`, where `tspnn` is replaced with the value of the `id` property of the `script` property of the report.

Thus, the script that Testaro ran in order to produce the report must be one that Testilo has a scoring algorithm (_score proc_) for. If so, Testilo can score the report.

If Testilo scores a report, Testilo saves the scored report alongside the original report. The scored report file has the same name as the original, plus `-scored` added to the base name.

## Digesting

To make a scored Testaro report more useful for humans, Testilo can create a digest of the report. This is an HTML document (a web page) summarizing the findings.

The digesting functionality currently exists in a different application and is being ported to Testilo.
