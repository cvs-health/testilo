# testilo
Scorer and digester of Testaro reports

## Introduction

This application enriches [Testaro](https://www.npmjs.com/package/testaro) reports. Testaro performs digital accessibility tests on Web resources and creates reports in JSON format. To make those reports more useful, this application, Testilo, computes scores and converts the scored reports to human-readable web pages (_digests_).

## Dependencies

The `dotenv` dependency lets you set environment variables in an untracked `.env` file.

## Architecture

The routines that perform scoring and digesting are _procs_ and are located in the `procs` directory.

To score a report, Testilo needs to be told where to find the report, and also which scoring procedure (or _score proc_) to use. There could be multiple score procs differently aggregating the same report into scores.

Similarly, once a report has been scored, Testilo can digest it, provided that Testilo is told where to find the scored report and which _digest proc_ to use. Different digest procs could produce different human-oriented explanations of the same scored report, such as for different audiences.

Testilo includes some score procs and digest procs. You can add others.

## Execution

### Scoring

To score a Testaro report, execute the statement `node score abc xyz`, replacing (here and below) `abc` with the base of the name of the file containing the report and `xyz` with the base of the name of the score proc.

This procedure has some preconditions:
- The score proc is compatible with the report.
- The full name of the report file is `abc.json`.
- The report file is located in the directory whose relative path (relative to the project directory of Testilo) is the value of the `REPORTDIR_RAW` environment variable.
- Testilo can read and write in the `REPORTDIR_RAW` directory.
- Testilo can write in the `REPORTDIR_SCORED` directory.
- The `procs/score` directory contains a file named `xyz.js`.

Thus, the script that Testaro ran in order to produce the report must be one that Testilo has a scoring algorithm (_score proc_) for. If so, Testilo can score the report.

When Testilo scores a report, Testilo saves the scored report in the directory whose relative path is the value of the `REPORTDIR_SCORED`. The scored report file has the same name as the original.

### Digesting

To make a scored Testaro report more useful for humans, Testilo can create a digest of the report. This is an HTML document (a web page) summarizing and explaining the findings.

To make Testilo digest a report, execute the statement `node digest abc xyz`, replacing `abc` (here and below) with the base of the name of the file containing the scored report and `xyz` with the base of the name of the digest proc.

This procedure has some preconditions:
- The digest proc is compatible with the report.
- The full name of the report file is `abc.json`.
- The report file is located in the directory whose relative path (relative to the project directory of Testilo) is the value of the `REPORTDIR_SCORED` environment variable.
- Testilo can read and write in the `REPORTDIR_SCORED` directory.
- Testilo can write in the `REPORTDIR_DIGESTED` directory.
- The `procs/digest` directory contains a subdirectory named `xyz`, which in turn contains files named `index.html` and `index.js`.
- You have copied the `reports/digested/style.css` file into the `REPORTDIR_DIGESTED` directory.

When Testilo digests a report, Testilo saves the digest in the directory whose relative path is the value of the `REPORTDIR_DIGESTED`. The digest has the name `abc.html`.
