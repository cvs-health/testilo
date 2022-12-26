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
- A common use case is to define a battery of tests and to have those tests performed on multiple targets. In that case, you want multiple jobs, one per page. The jobs are identical, except for the target-specific acts (including navigating to targets). If you give Testilo this information, Testilo can create such collections of jobs for you.
- Some tests operate on a copy of a target and modify that copy. Usually, one wants test isolation: The results of a test do not depend on any previously performed tests. To ensure test isolation, a job containing such target-modifying tests must follow them with acts that restore the target to its desired pre-test state. If you tell Testilo which tests you want performed in which order and how to reach the target, Testilo can insert the required target-restoring acts into the job after target-modifying tests.

The `merge` module merges batches with scripts, with or without test isolation.

### Procedure

To use the `merge` module, you need to create a _script_ and a _batch_:
- The script is an object that specifies a job, except for the targets.
- The batch is an object that specifies target-specific acts for targets.

The script contains an array of acts, with placeholders. For each target in the batch, the `merge` module creates a job, in which the placeholders are replaced with the acts specific to that target in the batch.

### Example

Here is an example illustrating how merging works.

#### Script

Suppose you have created this script:

```javaScript
{
  id: 'ts25',
  what: 'Motion, Axe, and bulk',
  strict: true,
  timeLimit: 60,
  acts: [
    {
      type: 'placeholder',
      which: 'main',
      launch: 'webkit'
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
      type: 'placeholder',
      which: 'main',
      launch: 'chromium'
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

The `acts` array of this script contains tree regular acts and two placeholders.

#### Batch

Suppose you have also created this batch:

```javaScript
{
  id: 'weborgs',
  what: 'Web standards organizations',
  targets: [
    {
      id: 'mozilla',
      what: 'Mozilla Foundation',
      acts: {
        main: [
          {
            type: 'launch'
          },
          {
            type: 'url',
            which: 'https://foundation.mozilla.org/en/',
            what: 'Mozilla Foundation'
          }
        ]
      }
    },
    {
      id: 'w3c',
      what: 'World Wide Web Consortium',
      acts: {
        main: [
          {
            type: 'launch'
          },
          {
            type: 'url',
            which: 'https://www.w3.org/',
            what: 'World Wide Web Consortium'
          }
        ]
      }
    }
  ]
}
```

This batch defines two targets.

#### Isolation option

The `merge` module offers an isolation option. If you exercise it, the `merge` module will act as if the latest placeholder were again inserted after each target-modifying test, except where that test is the last act or the next act after it is a placeholder.

#### Output

Suppose you ask for a merger of the above batch and script, **without** the isolation option. Then the first job produced by `merge` could be:

```javaScript
{
  id: '7izc1-ts25-mozilla',
  what: 'Motion, Axe, and bulk',
  strict: true,
  timeLimit: 60,
  acts: [
    {
      type: 'launch',
      which: 'webkit'
    },
    {
      type: 'url',
      which: 'https://foundation.mozilla.org/en/',
      what: 'Mozilla Foundation'
    }
    {
      type: 'test',
      which: 'motion',
      what: 'spontaneous change of content; requires webkit',
      delay: 2500,
      interval: 2500,
      count: 5
    },
    {
      type: 'launch',
      which: 'chromium'
    },
    {
      type: 'url',
      which: 'https://foundation.mozilla.org/en/',
      what: 'Mozilla Foundation'
    }
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
  ],
  sources: {
    script: "ts25",
    batch: "weborgs",
    target: {
      id: 'mozilla',
      what: 'Mozilla Foundation'
    },
    requester: 'you@yourdomain.tld'
  },
  creationTime: '2023-11-20T15:50:27',
  timeStamp: 'bizc1'
}
```

Most of the properties of this job object come from your script and your batch. The acts of type `placeholder` in the script have been replaced with the specified array of acts of the first target of the batch. In this case, that target has only one array of acts, and that array contains two acts, but a target could have multiple act arrays, and an act array could include any number of acts or be empty.

If the named array of acts includes an act of type `launch`, that act gets a `which` property, identical to the value of the `launch` property of the `placeholder` object. In this way, a placeholder can dictate which browser type is to be launched.

The `merge` module has added other properties to the job:
- a creation time
- a timestamp, derived from the creation time
- a job ID, composed of the timestamp, the script ID, and the target ID
- a `sources` property, identifying the script, the batch, the target within the batch, and your email address, which it has obtained from the environment variable `REQUESTER`.

This job is ready to be executed by Testaro.

If, however, you requested a merger **with** test isolation, then `merge` would act as if another instance of

    ```javaScript
    {
      type: 'placeholder',
      which: 'main',
      launch: 'chromium'
    },
    ```

were located in the script after the `axe` test, because the `axe` test is target-modifying and could therefore change the result of the `bulk` test that follows it. So, additional acts of type `launch` and `url` would appear after the `axe` test in the job.

### Invocation

There are two ways to use the `merge` module.

#### By a module

A module can invoke `merge` in this way:

```javaScript
const {merge} = require('testilo/merge');
const jobs = merge(script, batch, true);
```

This invocation references `script` and `batch` variables that the module has already defined and invokes the isolation option by specifying `true` as a third argument to `merge()`. To reject the isolation option, the invocation could replace `true` with `false` or omit the third argument. The `merge()` function of the `merge` module generates jobs and returns them in an array. The invoking module can further dispose of the jobs as needed.

#### By a user

A user can invoke `merge` in this way:

- Create a script and save it as a JSON file named `ts25.json` in the `process.env.SCRIPTDIR` directory.
- Create a batch and save it as a JSON file named `weborgs.json` in the `process.env.BATCHDIR` directory.
- In the Testilo project directory, execute the statement `node call merge ts25 weborgs true`.

The `call` module will retrieve the named script and batch from their respective directories.
The `merge` module will create an array of jobs.
The `call` module will save the jobs in the `process.env.JOBDIR` directory.

To reject the isolation option, the user can change the statement to either of these:
- `node call merge ts25 weborgs false`
- `node call merge ts25 weborgs`

## Report scoring

### Introduction

Testaro executes jobs and produces reports of test results. Testilo can add scores to those reports. In this way, each report can not only detail successes and failures of individual tests but also assign scores to those results and combine the partial scores into total scores.

The `score` module scores a report. Its `score` function takes two arguments:
- a scoring function
- a report object

The `multiScore` module scores all the reports in the `process.env.REPORTDIR_RAW` directory. The `multiScore()` function in that module takes one argument: a scoring function.

The scoring function defines the scoring rules. The Testilo package contains a `procs/score` directory, in which there are modules that export scoring functions. You can use one of those scoring functions, or you can create your own.

### Invocation

There are two ways to use the `score` and `multiScore` modules.

#### By a module

A module can invoke `score` in this way:

```javaScript
const {score} = require('testilo/score');
const {scorer} = require('testilo/procs/score/sp25a');
const scoredReport = score(scorer, rawReport);
```

The first argument to `score()` is a scoring function. In this example, it has been obtained from a JSON file in the Testilo package, but it could be a custom function. The second argument to `score()` is a report object; typically, it would be obtained from 

A module can invoke `multiScore` in this way:

```javaScript
const {multiScore} = require('testilo/multiScore');
const {scorer} = require('testilo/procs/score/sp25a');
const scoredReports = multiScore(scorer, rawReports);
```

The second argument to `multiScore()` is an array of report objects.

#### By a user

A user can invoke `score` in this way:

```bash
node call score sp25a
node call score sp25a 75
```

A user can invoke `multiScore` in this way:

```bash
node call multiScore sp25a
```

When a user invokes `score` or `multiScore`, the `call` module:
- gets the scoring module `sp25a` from its JSON file `sp25a.json` in the `process.env.SCOREPROCDIR` directory
- gets the report(s) from the `process.env.REPORTDIR_RAW` directory
- writes the scored report(s) to the `process.env.REPORTDIR__SCORED` directory

When the user invokes `score`, the `call` module allows the user to identify the report to be scored with one or more characters at the start of its name, instead of the whole name, as long as the desired report is the first one in the `process.env.REPORTDIR_RAW` directory that matches.

## Report digesting

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

