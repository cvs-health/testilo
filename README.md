# testilo
Utilities for Testaro

## Introduction

The Testilo package contains utilities that facilitate the use of the [Testaro](https://www.npmjs.com/package/testaro) package.

Testaro performs digital accessibility tests on web artifacts and creates reports in JSON format. The utilities in Testilo prepare jobs for Testaro to run and create additional value from the reports that Testaro produces.

Because Testilo supports Testaro, this `README` file presumes that you have access to the Testaro `README` file and therefore does not repeat information provided there.

## Branches

The `writer` branch contains the state of Testilo as of 2022-11-07. In that branch, Testilo must read and write files when it aims, scores, or digests. That makes Testilo unusable as a dependency in applications that do not have permission to both read and write files.

The `main` branch contains the state of Testilo starting on 2022-11-07. In that branch, Testilo does not need to read or write files when it aims, scores, or digests, so applications without write permission can still use Testilo as a dependency if they need only those functionalities.

This `README.md` file documents the `main` branch.

## Dependencies

The `dotenv` dependency lets you set environment variables in an untracked `.env` file. This prevents secret data, such as passwords, from being shared as part of this package.

When Testilo is a dependency of another application, the `.env` file is not imported, because it is not tracked, so all needed environment variables must be provided by the importing application.

## Architecture

Testilo is written in Node.js. Commands are given to Testilo in a command-line (terminal) interface or programmatically.

Shared routines that perform scoring, digesting, and comparing are _procs_ and are located in the `procs` directory.

Testilo can be installed wherever Node.js (version 14 or later) is installed. This can be a server or the same workstation on which Testaro is installed.

The reason for Testilo being an independent package, rather than part of Testaro, is that Testilo can be installed on any host, while Testaro can run successfully only on a Windows or Macintosh workstation (and perhaps on some workstations with Ubuntu operating systems). Testaro runs tests similar to those that a human accessibility tester would run, using whatever browsers, input devices, system settings, simulated and attached devices, and assistive technologies tests may require. Thus, Testaro is limited to functionalities that require workstation attributes. For maximum flexibility in the management of Testaro jobs, all other functionalities are located outside of Testaro. You could have software such as Testilo running on a server, communicating with multiple workstations running Testaro, receiving job orders from the server and returning job results to the server for further processing.

## Utilities

### `aim`

The `aim` function allows you to _aim_ a script at a host. That means modifying the script so that it performs its operations on the specified host. The modifications are:
- Modify the value of the `id` property of the script by:
   - Prefixing the value with a time stamp.
   - Suffixing the value with the value of the `id` property of the host.
- Modify each `url` command of the script by changing the values of its `which`, `what`, and `id` properties to the values of those properties of the host.
- Add a `source` property to the script, identifying the script, the host, and the requester.

Execution by a module:

```javaScript
const aimScript = async () => {
  const fs = require('fs/promises');
  const host = {
    which: https://w3c.org/,
    what: 'World Wide Web Consortium',
    id: w3c
  };
  const {aim} = require('testilo/aim');
  const scriptJSON = await fs.readFile(`${process.env.SCRIPTDIR}/tp25.json`, 'utf8');
  const script = JSON.parse(scriptJSON);
  const aimedScript = aim(script, host, 'developer@w3c.org');
  await fs.writeFile(
    `${process.env.JOBDIR}/${aimedScript.id}.json`, JSON.stringify(aimedScript, null, 2)
  );
  console.log(`Script ${aimedScript.source.script} aimed at ${aimedScript.host.what}`);
}
aimScript();
```

Execution by a user:

```bash
node call aim tp25 https://w3.org/ 'World Wide Web Consortium' w3c developer@w3c.org
```

In these examples, a copy of the script file named `tp25.json` in the `SCRIPTDIR` directory is aimed at the World Wide Web Consortium and then saved in the `JOBDIR` directory.

The `aim` function neither reads nor writes files. Its arguments are a script object, a host object, and a requester-email-address string, and it returns the script object, aimed at the host.

### `merge`

The `merge` function is similar to the `aim` function, but it aims a script at multiple hosts, not only one. The hosts are identified in a _batch_, a file in the `BATCHDIR` directory. The output of `merge` is multiple script files, one per host, saved in the `JOBDIR` directory.

A batch is a JSON-format file representing a `batch` object, which contains an array of _hosts_.

Here is an example of a batch:

```json
{
  "id": "usFedExec1",
  "what": "United States federal executive agencies",
  "hosts": [
    {
      "id": "achp",
      "which": "https://www.achp.gov/",
      "what": "Advisory Council on Historic Preservation (ACHP)"
    },
    {
      "id": "agm",
      "which": "https://www.usagm.gov/",
      "what": "Agency for Global Media"
    }
  ]
}
```

Execution by a module:

```javaScript
const {merge} = require('testilo/merge');
merge('tp25', 'weborgs')
.then(() => {
  console.log('Merger complete');
});
```

Execution by a user:

```bash
node call merge tp25 weborgs
```

In these examples, a copy of the script file named `tp25.json` in the `SCRIPTDIR` directory is aimed at all the hosts in the batch file named `weborgs.json` in the `BATCHDIR` directory, and the resulting host-specific scripts are saved in the `JOBDIR` directory.

### `score`

Testaro performs tests and produces reports of test results. Testilo can add scores to those reports. In this way, each report can not only detail successes and failures of individual tests but also assign scores to those results and combine the partial scores into total scores.

The `score` function performs scoring. It depends on a _score proc_ to define the scoring rules. Some score procs are in the Testilo package (in the `procs/score` directory), and you can create more score procs to implement different rules.

Execution by a module:

```javaScript
const fs = require('fs/promises');
const scoreReport = async rawReport => {
  const {score} = require('testilo/score');
  const procJSON = await fs.readFile(`${process.env.SCOREPROCDIR}/sp25a.json`, 'utf8');
  const proc = JSON.parse(procJSON);
  const scoredReport = score(proc, rawReport);
  await fs.writeFile(
    `${process.env.REPORTDIR_SCORED}/${scoredReport.id}.json`, JSON.stringify(scoredReport, null, 2)
  );
  console.log(`Report ${scoredReport.id} scored`);
};
fs.readFile(`${process.env.REPORTDIR_RAW}/756mr-tp25-w3c.json`, 'utf8')
.then(rawReportJSON => {
  const rawReport = JSON.parse(rawReportJSON);
  scoreReport(rawReport);
});
```

Execution by a user:

```bash
node call score sp25a
node call score sp25a 756mr
```

In these examples, the `score` function applies a score proc named `sp25a`, of which a copy is in the file `sp25a.json` in the `SCOREPROCDIR` directory, to a raw report `756mr-tp25-w3c.json` in the `REPORTDIR_RAW` directory and returns the same report with score data added. The scored report is saved in the `REPORTDIR_SCORED` directory.

The user statement can pass only 2 arguments to `call` if the first report in the `REPORTDIR_RAW` directory is the desired raw report. If there are multiple reports in that directory and the desired one is not the first, the user must pass 3 arguments to `call`, and the third argument must be a string, such that the first report in that directory that begins with that string is the desired report.

The `score` function neither reads nor writes files. Its arguments are a score-proc string and a raw-report object, and it returns a scored-report object.

### `multiScore`

The `multiScore` function scores all the reports in the `REPORTDIR_RAW` directory and writes the scored reports in the `REPORTDIR_SCORED` directory.

Execution by a module:

```javaScript
const {multiScore} = require('testilo/multiScore');
multiScore('sp25a')
.then(hostCount => {
  console.log(`Scoring complete. Count of reports scored: ${hostCount}`);
});
```

Execution by a user:

```bash
node call multiScore sp25a
```

The argument to `multiScore` names the score proc to be used. The `multiScore` function scores all the reports in the `REPORTDIR_RAW` directory and writes the scored reports in the `REPORTDIR_SCORED` directory.

### `digest`

Testaro reports, both originally and after they are scored, are JavaScript objects. When represented as JSON, they are human-readable, but basically designed for machine tractability.

The `digest` function converts scored reports into HTML documents with explanatory content. Thus, it converts machine-oriented reports into human-oriented reports, called _digests_. It depends on a _digest proc_ to define the digesting rules. Some digest procs are in the Testilo package (in the `procs/digest` directory), and you can create more digest procs to implement different rules.

Execution by a module:

```javaScript
const fs = require('fs/promises');
const digestReport = async scoredReport => {
  const {digest} = require('testilo/digest');
  const procJSON = await fs.readFile(`${process.env.DIGESTPROCDIR}/dp25a.json`, 'utf8');
  const proc = JSON.parse(procJSON);
  const digest = digest(proc, scoredReport);
  await fs.writeFile(
    `${process.env.REPORTDIR_DIGESTED}/${digest.id}.json`, JSON.stringify(digest, null, 2)
  );
  console.log(`Report ${digest.id} digested`);
};
fs.readFile(`${process.env.REPORTDIR_SCORED}/756mr-tp25-w3c.json`, 'utf8')
.then(scoredReportJSON => {
  const scoredReport = JSON.parse(scoredReportJSON);
  digestReport(scoredReport);
});
```

Execution by a user:

```bash
node call digest sp25a
node call digest sp25a 756mr
```

In these examples, the `digest` function applies a digest proc named `dp25a`, of which a copy is in the file `dp25a.json` in the `DIGESTPROCDIR` directory, to a scored report `756mr-tp25-w3c.json` in the `REPORTDIR_SCORED` directory and returns an HTML digest for that same report. The digest is saved in the `REPORTDIR_DIGESTED` directory.

The user statement can pass only 2 arguments to `call` if the first report in the `REPORTDIR_SCORED` directory is the desired scored report. If there are multiple reports in that directory and the desired one is not the first, the user must pass 3 arguments to `call`, and the third argument must be a string, such that the first report in that directory that begins with that string is the desired report.

The `digest` function neither reads nor writes files. Its arguments are a digest-proc string and a scored-report object, and it returns a digest HTML string.

### `multiDigest`

The `multiDigest` function digests all the reports in the `REPORTDIR_SCORED` directory and writes the digests in the `REPORTDIR_DIGESTED` directory.

Execution by a module:

```javaScript
const {multiDigest} = require('testilo/multiDigest');
multiDigest('dp25a')
.then(hostCount => {
  console.log(`Digesting complete. Count of reports digested: ${hostCount}`);
});
```

Execution by a user:

```bash
node call multiDigest dp25a
```

The argument to `multiDigest` or the second argument to `call` names the digest proc to be used. The `multiDigest` function digests all the reports in the `REPORTDIR_SCORED` directory and writes the digests in the `REPORTDIR_DIGESTED` directory.

The digests created by `digest` are HTML files, and they expect a `style.css` file to exist in their directory. The `reports/digested/style.css` file in Testilo is an appropriate stylesheet to be copied into the `REPORTDIR_DIGESTED` directory.

### `compare`

You can summarize multiple scored reports by producing a document comparing the scores. The `compare` function does this. It gathers scores from a set of scored reports and produces an HTML document comparing the scores. It depends on a _comparison proc_ to define the rules for making and showing the comparative scores. Some compare procs are in the Testilo package (in the `procs/compare` directory), and you can create more compare procs to implement different rules.

Execution by a module:

```javaScript
const {compare} = require('testilo/compare');
compare('cp25a', 'legislators')
.then(() => {
  console.log(`Comparison complete`);
});
```

Execution by a user:

```bash
node call compare cp25a legislators
```

The first argument to `compare`, or the second argument to `call`,  names the comparison proc to be used. The subsequent argument specifies a base of the name of the comparative report that will be produced. The scores in all reports in the `REPORTDIR_SCORED` directory will be compared. The comparative report will be written in the `COMPARISONDIR` directory.

The comparison created by `compare` is an HTML file, and it expects a `style.css` file to exist in its directory. The `reports/comparative/style.css` file in Testilo is an appropriate stylesheet to be copied into the `COMPARISONDIR` directory.
