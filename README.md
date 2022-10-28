# testilo
Utilities for Testaro

## Introduction

The Testilo package contains utilities that facilitate the use of the [Testaro](https://www.npmjs.com/package/testaro) package.

Testaro performs digital accessibility tests on web artifacts and creates reports in JSON format. The utilities in Testilo prepare jobs for Testaro to run and create additional value from the reports that Testaro produces.

Because Testilo supports Testaro, this `README` file presumes that you have access to the Testaro `README` file and therefore does not repeat information provided there.

## Dependencies

The `dotenv` dependency lets you set environment variables in an untracked `.env` file. This prevents secret data, such as passwords, from being shared as part of this package.

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
const host = {
  which: https://w3c.org/,
  what: 'World Wide Web Consortium',
  id: w3c
};
const fs = require('fs/promises');
const {aim} = require('testilo/aim');
const aimedScript = aim('tp25', host, 'developer@w3c.org');
fs.writeFile(process.env.JOBDIR, JSON.stringify(aimedScript, null, 2));
```

Execution by a user:

```bash
node call aim tp25 https://w3.org/ 'World Wide Web Consortium' w3c developer@w3c.org
```

In these examples, a copy of the script file named `tp25.json` in the `SCRIPTDIR` directory is aimed at the World Wide Web Consortium and then saved in the `JOBDIR` directory.

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

### `score`

Testaro performs tests and produces reports of test results. Testilo can add scores to those reports. In this way, each report can not only detail successes and failures of individual tests but also assign scores to those results and combine the partial scores into total scores.

The `score` function performs scoring. It depends on _score procs_ to define the scoring rules. Some score procs are in the Testilo package (in the `procs/score` directory), and you can create more score procs to implement different rules.

Execution by a module:

```javaScript
const {score} = require('testilo/score');
score('sp25a', '756mr')
.then(hostCount => {
  console.log(`Scoring complete. Count of reports scored: ${hostCount}`);
});
```

Execution by a user:

```bash
node call score sp25a 756mr
```

The first argument to `score` names the score proc to be used. The second argument is optional. If it is present, then only reports whose names begin with the value of that argument will be scored. Otherwise all reports in the `REPORTDIR_RAW` directory will be scored. The scored reports will be written in the `REPORTDIR_SCORED` directory.

### `digest`

Testaro reports, both originally and after they are scored, are JSON files. That format is human-readable, but it is basically designed for machine tractability.

The `digest` function converts scored reports into HTML documents with explanatory content. Thus, it converts machine-oriented reports into human-oriented reports, called _digests_. It depends on _digest procs_ to define the digesting rules. Some digest procs are in the Testilo package (in the `procs/digest` directory), and you can create more digest procs to implement different rules.

Execution by a module:

```javaScript
const {digest} = require('testilo/digest');
digest('dp25a', '756mr')
.then(hostCount => {
  console.log(`Digesting complete. Count of reports digested: ${hostCount}.`);
});
```

Execution by a user:

```bash
node call digest sp25a 756mr
```

The first argument to `digest` names the digest proc to be used. The second argument is optional. If it is present, then only reports whose names begin with the value of that argument will be digested. Otherwise all reports in the `REPORTDIR_SCORED` directory will be digested. The digested reports will be written in the `REPORTDIR_DIGESTED` directory.

The digests created by `digest` are HTML files, and they expect a `style.css` file to exist in their directory. The `reports/digested/style.css` file in Testilo is an appropriate stylesheet to be copied into the `REPORTDIR_DIGESTED` directory.

### `compare`

You can summarize the results of a multi-host job by producing a document comparing the scores received by the hosts. The `compare` function does this. It gathers scores from a set of scored reports and produces an HTML document comparing the scores. It depends on _comparison procs_ to define the rules for making and showing the comparative scores. Some compare procs are in the Testilo package (in the `procs/compare` directory), and you can create more compare procs to implement different rules.

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

The first argument to `compare` names the comparison proc to be used. The second argument specifies a base of the name of the comparative report that will be produced. The scores in all reports in the `REPORTDIR_SCORED` directory will be compared. The comparative report will be written in the `COMPARISONDIR` directory.

The digests created by `compare` are HTML files, and they expect a `style.css` file to exist in their directory. The `reports/comparative/style.css` file in Testilo is an appropriate stylesheet to be copied into the `COMPARISONDIR` directory.
