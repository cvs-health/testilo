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

Testilo includes some score procs, digest procs, and comparison procs. You can add others.

## Execution

### Scoring

To score Testaro reports, execute the statement `node score abc xyz`. Replace (here and below) `abc` with the base of the name of the file containing the report, or the prefix of the file name. Replace `xyz` with the base of the name of the score proc.

If you replace `abc` with the entire name base, Testilo will score one report. If you replace `abc` with a prefix (such as `35k1r-`), Testilo will score all the reports whose names begin with that prefix.

This procedure has some preconditions:
- The score proc is compatible with the script that produced the report(s).
- The filename extension is `.json`.
- Testilo can find the report file(s) in the directory whose relative path (relative to the project directory of Testilo) is the value of the `REPORTDIR_RAW` environment variable.
- Testilo can read in the `REPORTDIR_RAW` directory.
- There is a `REPORTDIR_SCORED` environment variable, whose value is the relative path of a directory that Testilo can write to.
- The `procs/score` directory contains a file named `xyz.js`.

When Testilo scores a report, Testilo saves the scored report in the directory whose relative path is the value of the `REPORTDIR_SCORED`. The scored report file has the same name as the original. The scored report has the same content as the original, plus a new property named `score`.

### Digesting

To make scored Testaro reports more useful for humans, Testilo can create digests of scored reports. A digest is an HTML document (a web page) summarizing and explaining the findings, with the scored report appended to it.

To make Testilo digest reports, execute the statement `node digest abc xyz`, replacing `abc` (here and below) with a whole base name or prefix, as with scoring, and `xyz` with the base of the name of the digest proc.

This procedure has some preconditions:
- The digest proc is compatible with the score proc that scored the report.
- The filename extension is `.json`.
- Testilo can find the scored report file(s) in the directory whose relative path (relative to the project directory of Testilo) is the value of the `REPORTDIR_SCORED` environment variable.
- Testilo can read in the `REPORTDIR_SCORED` directory.
- There is a `REPORTDIR_DIGESTED` environment variable, whose value is the relative path of a directory that Testilo can write to.
- The `procs/digest` directory contains a subdirectory named `xyz`, which in turn contains files named `index.html` and `index.js`.
- You have copied the `reports/digested/style.css` file into the `REPORTDIR_DIGESTED` directory.

When Testilo digests a report, Testilo saves the digest in the directory whose relative path is the value of the `REPORTDIR_DIGESTED` environment variable. The digest has the same name as the report on which it is based, except with `.html` as the extension.

### Comparing

You can use Testilo to publish comparisons of accessibility scores. To do this, execute the statement `node compare abc xyz`, replacing `abc` with the prefix of the names of the reports and `xyz` with the name of a subdirectory of the `procs/compare` directory.

Testilo will use the comparison proc you name to compile the scores into a table and construct a web page containing that table. It will save the page in the `reports/comparative` directory. The name of the file will be `abc.html`.

In the table, the first column will contain descriptions of the pages (the `what` property of the hosts in the batch), such as “Wikipedia English”. Each such description will be a link to the page on the web. The second column will contain the scores of the pages. Each score will be a link to the digest for its page. The link will be `

This procedure has some preconditions:
- The comparison proc is compatible with the score proc that scored the report.
- Testilo can find the scored report files in the directory whose relative path (relative to the project directory of Testilo) is the value of the `REPORTDIR_SCORED` environment variable.
- Testilo can read in the `REPORTDIR_SCORED` directory.
- There is a `COMPARISONDIR` environment variable, whose value is the relative path of a directory that Testilo can write to.
- The `procs/compare` directory contains a subdirectory named `xyz`, which in turn contains files named `index.html` and `index.js`.
- You have copied the `reports/comparative/style.css` file into the `COMPARISONDIR` directory.
