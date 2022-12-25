# testilo
Utilities for Testaro

## Introduction

The Testilo package contains utilities that facilitate the use of the [Testaro](https://www.npmjs.com/package/testaro) package.

Testaro performs digital accessibility tests on web artifacts and creates reports in JSON format. The utilities in Testilo fall into two categories:
- Job preparation
- Report enhancement

Because Testilo supports Testaro, this `README` file presumes that you have access to the Testaro `README` file and therefore does not repeat information provided there.

## Branches

The `writer` branch contains the state of Testilo as of 2022-11-07. In that branch, Testilo must read and write files. That makes Testilo unusable as a dependency in applications that do not have permission to both read and write files.

The `simple` branch contains the state of Testilo as of 2022-12-23. In that branch, Testilo does not need to read or write files, so applications without write permission can still use Testilo as a dependency.

The `main` branch contains the state of Testilo from 2022-12-24 until now. In that branch, Testilo can prepare jobs that require multi-step operations to reach and pre-process the pages being tested.

This `README.md` file documents the `main` branch.

## Dependencies

The `dotenv` dependency lets you set environment variables in an untracked `.env` file. This prevents secret data, such as passwords, from being shared as part of this package.

When Testilo is a dependency of another application, the `.env` file is not imported, because it is not tracked, so all needed environment variables must be provided by the importing application.

## Architecture

Testilo is written in Node.js. Commands are given to Testilo in a command-line (terminal) interface or programmatically.

Shared routines are _procs_ and are located in the `procs` directory.

Testilo can be installed wherever Node.js (version 14 or later) is installed. This can be a server or the same workstation on which Testaro is installed.

The reason for Testilo being an independent package, rather than part of Testaro, is that Testilo can be installed on any host, while Testaro can run successfully only on a Windows or Macintosh workstation (and perhaps on some workstations with Ubuntu operating systems). Testaro runs tests similar to those that a human accessibility tester would run, using whatever browsers, input devices, system settings, simulated and attached devices, and assistive technologies tests may require. Thus, Testaro is limited to functionalities that require workstation attributes. For maximum flexibility in the management of Testaro jobs, all other functionalities are located outside of Testaro. You could have software such as Testilo running on a server, communicating with multiple workstations running Testaro. The workstations could receive job orders from the server and return job results to the server for further processing.

## Job preparation

### Introduction

Testaro executes _jobs_. In a job, Testaro performs _acts_ (tests and other operations) on _targets_ (typically, web pages). The Testaro `README.md` file specifies the requirements for a job.

You can create a job for Testaro directly, without using Testilo.

Testilo can, however, make job preparation more efficient in two scenarios:
- A common use case is to define a battery of tests and to have those tests performed on multiple targets. In that case, you want multiple jobs, one per page. The jobs are identical, except for the target-specific acts (including navigating to targets). If you give Testilo this information, Testilo can create such collections of jobs for you. The `merge` module does this.
- Some tests operate on a copy of a target and modify that copy. Usually, one wants test isolation: The results of a test do not depend on any previously performed tests. To ensure test isolation, a job containing such target-modifying tests must follow them with acts that restore the target to its desired pre-test state. If you tell Testilo which tests you want performed in which order and how to reach the target, Testilo can insert the required target-restoring acts into a job after target-modifying tests. The `isolate` module does this.

### Merging

To use the `merge` module, you need to create a _script_ and a _batch_. The script is an object that specifies a job, except for the targets. The batch is an object that specifies target-specific acts. The script contains an array of acts, with placeholders. The `merge` module creates one job per target, replacing the placeholders with the acts specific to that target.

Here is an example illustrating how merging works.

You have created this script:

```javaScript
{
  id: 'ts25',
  what: 'Motion, Axe, and bulk',
  strict: true,
  acts: [
    {
      type: 'injection',
      browserType: 'webkit'
    },
    {
      type: 'test',
      which: 'motion',
      what: 'spontaneous change of content; requires webkit',
      delay: 2500,
      interval: 2500,
      count: 5
    },
    {
      type: 'injection',
      browserType: 'chromium'
    },
    {
      type: 'test',
      which: 'axe',
      withItems: true,
      rules: [],
      what: 'Axe core, all rules, with details'
    },
    {
      type: 'test',
      which: 'bulk',
      what: 'count of visible elements'
    }
  ]
}
```

You have also created this batch:

```javaScript
{
  "id": "weborgs",
  "what": "Web standards organizations",
  "hosts": [
    {
      "id": "mozilla",
      "which": "https://www.mozilla.org/en-US/",
      "what": "Mozilla"
    },
    {
      "id": "w3c",
      "which": "https://www.w3.org/",
      "what": "W3C"
    }
  ]
}

```

Its four properties provide:
- `id`: a unique ID for the script, which is saved in a JSON file in the `process.env.SCRIPTDIR` directory.
- `what`: a description of the script.
- `script`: whether Testaro should reject server redirections.
- `commands`: the step-by-step instructions for Testaro.

In this example, there are 3 tests to be performed. There are also 2 commands of the type `injection`. Those commands tell Testilo to replace them with commands stored in a batch.

### Batches

Here is an example of a batch:


```javaScript
{
  job: {
    id: 'unique identifier of this job'
    what: 'description of the job',
    strict: 'whether to disallow redirections (true or false)',
    timelimit: 'seconds allowed for job execution (integer)',
    sources: {
      script: 'ID of the script',
      batch: 'ID of the batch',
      host: {
        id: 'ID',
        which: 'URL',
        what: 'name'
      },
      requester: 'email address to be notified'
    },
    creationTime: 'when the job was created (string with format 2022-11-20T15:50:27)',
    timeStamp: 'alphanumeric representation of the creation time'
  },
  acts: 'array of the commands to be performed and their results',
  jobData: 
}
```
- `id`
- `acts`
- `jobData`

You can create such an object directly and save it as a JSON file for use by Testaro, without using Testilo.

If, however, you want to create multiple jobs that perform an identical sequence of tests on various pages, Testilo can facilitate the preparation. For this purpose, you must create two artifacts:
- A script
- A batch

The script is an object with these properties:
- 

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
  const scriptJSON = await fs.readFile(`${process.env.SCRIPTDIR}/ts25.json`, 'utf8');
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
node call aim ts25 https://w3.org/ 'World Wide Web Consortium' w3c developer@w3c.org
```

In these examples, a copy of the script file named `ts25.json` in the `SCRIPTDIR` directory is aimed at the World Wide Web Consortium and then saved in the `JOBDIR` directory.

The `aim` function neither reads nor writes files. Its arguments are a script object, a host object, and a requester-email-address string, and it returns a job object, aimed at the host.

### `merge`

The `merge` module is similar to the `aim` module, but it aims a script at multiple hosts, not only one. The hosts are identified in a _batch_, a file in the `BATCHDIR` directory. The output of `merge` is multiple script files, one per host, saved in the `JOBDIR` directory.

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
merge('ts25', 'weborgs', 'developer@w3.org')
.then(() => {
  console.log('Merger complete');
});
```

Execution by a user:

```bash
node call merge ts25 weborgs developer@w3.org
```

In these examples, a copy of the script file named `ts25.json` in the `SCRIPTDIR` directory is aimed at all the hosts in the batch file named `weborgs.json` in the `BATCHDIR` directory, and the resulting jobs are saved in the `JOBDIR` directory. Each job has a `sources` property that identifies an email address to be notified after the job has been run.

### `isolate`

Some Testaro tests change the pages that they test. By doing so, they could contaminate the results of subsequent tests. To isolate tests, you can launch a browser and navigate again to the page being tested after each potentially contaminating test unless that test is the last act. The `isolate` module does this.

Execution by a module:

```javaScript
const isolateTests = async (jobID, injectorID) => {
  const fs = require('fs/promises');
  const jobJSON = await fs.readFile(`${process.env.JOBDIR}/${jobID}.json`, 'utf8');
  const job = JSON.parse(jobJSON);
  const injectorJSON = await fs.readFile(`${process.env.INJECTORDIR}/${injectorID}.json`, 'utf8');
  const injector = JSON.parse(injectorJSON);
  const expandedJob = Array.from(job);
  expandedJob.acts = inject(expandedJob.acts, injector);
  await fs.writeFile(
    `${process.env.JOBDIR_EXPANDED}/${jobID}.json`, JSON.stringify(expandedJob, null, 2)
  );
  console.log(`Job ${jobID} expanded`);
};
isolateTests('6gapx-tp25-wikipedia', 'chromium-simple');
```

Execution by a user:

```bash
node call isolate '6gapx-tp25-wikipedia' 'chromium-simple'
```

In these examples, the `isolate` function expands job `6gapx-tp25-wikipedia` by injecting the acts in the `chromium-simple` injector into the acts of the job wherever an act is a non-final contaminant. The expanded job is saved in the `process.env.JOBDIR_EXPANDED` directory.

### `score`

Testaro performs tests and produces reports of test results. Testilo can add scores to those reports. In this way, each report can not only detail successes and failures of individual tests but also assign scores to those results and combine the partial scores into total scores.

The `score` module performs scoring. It depends on a _score proc_ to define the scoring rules. Some score procs are in the Testilo package (in the `procs/score` directory), and you can create more score procs to implement different rules.

Execution by a module:

```javaScript
const scoreReport = async (scoreProcID, rawReportID) => {
  const fs = require('fs/promises');
  const {score} = require('testilo/score');
  const {scorer} = require(`${process.env.SCOREPROCDIR}/${scoreProcID}`);
  const rawReportJSON = await fs.readFile(
    `${process.env.REPORTDIR_RAW}/${rawReportID}.json`, 'utf8'
  );
  const rawReport = JSON.parse(rawReportJSON);
  const scoredReport = score(scorer, rawReport);
  await fs.writeFile(
    `${process.env.REPORTDIR_SCORED}/${scoredReport.id}.json`, JSON.stringify(scoredReport, null, 2)
  );
  console.log(`Report ${scoredReport.id} scored`);
};
scoreReport('sp25a', '756mr-ts25-w3c');
```

Execution by a user:

```bash
node call score sp25a
node call score sp25a 756mr
```

In these examples, the `score` function applies a score proc named `sp25a`, of which a copy is in the file `sp25a.json` in the `SCOREPROCDIR` directory, to a raw report `756mr-ts25-w3c.json` in the `REPORTDIR_RAW` directory and returns the same report with score data added. The scored report is saved in the `REPORTDIR_SCORED` directory.

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
const digestReport = async (digestProcID, scoredReportID) => {
  const fs = require('fs/promises');
  const {digest} = require('testilo/digest');
  const {makeQuery} = require(`${process.env.DIGESTPROCDIR}/${digestProcID}/index`);
  const digestTemplate = await fs.readFile(
    `${process.env.DIGESTPROCDIR}/${digestProcID}/index.html`
  );
  const digestedReport = digest(digestTemplate, makeQuery, scoredReport);
  const digestedReport = digest(makeQuery, scoredReport);
  await fs.writeFile(`${process.env.REPORTDIR_DIGESTED}/${digestedReport.id}.html`, digestedReport);
  console.log(`Report ${digestedReport.id} digested`);
};
digestReport('dp25a', '756mr-ts25-w3c');
```

Execution by a user:

```bash
node call digest dp25a
node call digest dp25a 756mr
```

In these examples, the `digest` function applies a digest proc named `dp25a`, of which a copy is in the file `dp25a.json` in the `DIGESTPROCDIR` directory, to a scored report `756mr-ts25-w3c.json` in the `REPORTDIR_SCORED` directory and returns an HTML digest for that same report. The digest is saved in the `REPORTDIR_DIGESTED` directory.

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



Testilo can prepare jobs for execution by Testaro.

A _job_ is an object with this initial structure:

```javaScript
{
  specs: {},
  acts: []
}
```

Testilo can populate the `specs` property with job requirements and the `acts` array with a sequence of _acts_ (operations) to be performed by Testaro.

When Testaro executes a job, Testaro will convert it to a _report_ by adding content to the job:
- Testaro will add to each act information about the result of the act.
- Testaro will add a `jobData` object property to the report, containing other information about the execution of the job.

Using Testilo is more efficient when you wish to perform a battery of tests on multiple _hosts_ (pages). In this situation, you can create a _script_ describing the battery of tests and a _batch_ describing the instructions for reaching the hosts. Then Testilo can combine the batch with the script, creating one job per host.

