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

The `main` branch contains the state of Testilo from 2022-12-24 until now. In that branch, Testilo can prepare jobs that require multi-step operations to reach and pre-process the targets being tested.

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
- A common use case is to define a battery of tests and to have those tests performed on multiple targets. In that case, you need to create multiple jobs, one per page. The jobs are identical, except for the target-specific acts (including navigating to targets). If you tell Testilo about the tests and the targets, Testilo can create such collections of jobs for you.
- Some tests operate on a copy of a target and modify that copy. Usually, one wants test isolation: The results of a test do not depend on any previously performed tests. To ensure test isolation, a job containing such target-modifying tests must follow them with acts that restore the target to its desired pre-test state. Testilo can insert the required target-restoring acts into each job after target-modifying tests.

The `merge` module performs these services.

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
    script: 'ts25',
    batch: 'weborgs',
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

Most of the properties of this job object come from your script and your batch. The acts of type `placeholder` in the script have been replaced with the specified (i.e. `main`) array of acts of the first target of the batch. In this case, that target has only one array of acts, and that array contains two acts, but a target could have multiple act arrays with distinct names, and an act array could include any number of acts or be empty.

If the named array of acts includes an act of type `launch`, that act gets a `which` property, identical to the value of the `launch` property of the `placeholder` object. In this way, a placeholder can dictate which browser type is to be launched.

The `merge` module has added other properties to the job:
- a creation time
- a timestamp, derived from the creation time
- a job ID, composed of the timestamp, the script ID, and the target ID
- a `sources` property, identifying the script, the batch, the target within the batch, and an email address obtained from the environment variable `process.env.REQUESTER`.

This job is ready to be executed by Testaro.

If, however, you requested a merger **with** isolation, then `merge` would act as if another instance of

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
const jobs = merge(script, batch, requester, true);
```

This invocation references `script`, `batch`, and `requester` variables that the module must have already defined. The `script` and `batch` variables are a script object and a batch object, respectively. The `requester` variable is an email address. The fourth argument is a boolean, specifying whether to perform isolation; a missing fourth argument is equivalent to `false`. The `merge()` function of the `merge` module generates jobs and returns them in an array. The invoking module can further dispose of the jobs as needed.

#### By a user

A user can invoke `merge` in this way:

- Create a script and save it as a JSON file in the `process.env.SCRIPTDIR` directory.
- Create a batch and save it as a JSON file in the `process.env.BATCHDIR` directory.
- In the Testilo project directory, execute one of these statements:
    - `node call merge x y z true`
    - `node call merge x y z false`
    - `node call merge x y z`

In these statements, replace `x` and `y` with the base names of the script and batch files, respectively. For example, if the script file is named `ts25.json`, then replace `x` with `ts25`. Replace `z` with an email address.

The first statement will cause a merger with isolation.
The second and third statements will cause a merger without isolation.

The `call` module will retrieve the named script and batch from their respective directories.
The `merge` module will create an array of jobs.
The `call` module will save the jobs in the `process.env.JOBDIR` directory.

### Validation

To test the `merge` module, in the project directory you can execute the statement `node validation/merge/validate`. All logging statements should begin with “Success” and none should begin with “ERROR”.

## Report scoring

### Introduction

Testaro executes jobs and produces reports of test results. A report is identical to a job (see the example above), except that:
- The acts contain additional data recorded by Testaro to describe the results of the performance of the acts. Acts of type `test` have additional data describing test results (successes, failures, and details).
- Testaro also adds a `jobData` property, describing information not specific to any particular act.

Thus, a report produced by Testaro contains these properties:
- `id`
- `what`
- `strict`
- `timeLimit`
- `acts`
- `sources`
- `creationTime`
- `timeStamp`
- `jobData`

Testilo can add scores to a report. In this way, a report can not only detail successes and failures of individual tests but also assign scores to those results and combine the partial scores into total scores. The scores are contained in a new `score` property that Testilo adds to a report.

The `score` module scores a report. Its `score()` function takes two arguments:
- a scoring function
- an array of report objects

A scoring function defines scoring rules. The Testilo package contains a `procs/score` directory, in which there are modules that export scoring functions. You can use one of those scoring functions, or you can create your own.

### Invocation

There are two ways to use the `score` module.

#### By a module

A module can invoke `score` in this way:

```javaScript
const {score} = require('testilo/score');
const {scorer} = require('testilo/procs/score/sp25a');
const scoredReports = score(scorer, rawReports);
```

The first argument to `score()` is a scoring function. In this example, it has been obtained from a JSON file in the Testilo package, but it could be a custom function. The second argument to `score()` is an array of report objects.

#### By a user

A user can invoke `score` in this way:

```bash
node call score sp25a
node call score sp25a 75
```

When a user invokes `score` in this example, the `call` module:
- gets the scoring module `sp25a` from its JSON file `sp25a.json` in the `process.env.SCOREPROCDIR` directory
- gets the reports from the `process.env.REPORTDIR_RAW` directory
- writes the scored reports to the `process.env.REPORTDIR__SCORED` directory

The optional third argument to call (`75` in this example) is a report selector. Without the argument, `call` gets all the reports in the `process.env.REPORTDIR_RAW` directory. With the argument, `call` gets only those reports whose names begin with the argument string.

## Report digesting

### Introduction

Reports created by Testaro, both originally and after they are scored, are JavaScript objects. When represented as JSON, they are human-readable, but not human-friendly. They are basically designed for machine tractability. Testilo can _digest_ a scored report, converting it to a human-oriented HTML document, or _digest_.

The `digest` module digests a scored report. Its `digest()` function takes three arguments:
- a digest template
- a digesting function
- an array of report objects

The digest template is an HTML document containing placeholders. A copy of the template, with its placeholders replaced by texts, becomes the digest. The digesting function defines the rules for replacing the placeholders with texts. The Testilo package contains a `procs/digest` directory, in which there are subdirectories containing pairs of templates and modules that export digesting functions. You can use one of those pairs, or you can create your own.

### Invocation

There are two ways to use the `digest` module.

#### By a module

A module can invoke `digest` in this way:

```javaScript
const {digest} = require('testilo/digest');
const digesterDir = `${process.env.DIGESTPROCDIR}/dp25a`;
fs.readFile(`${digesterDir}/index.html`)
.then(template => {
  const {digester} = require(`${digesterDir}/index`);
  const digestedReports = digest(template, digester, scoredReports);
});
```

The first two arguments to `digest()` are a digest template and a digesting function. In this example, they have been obtained from files in the Testilo package, but they could be custom-made. The third argument to `digest()` is an array of report objects.

#### By a user

A user can invoke `digest` in this way:

```bash
node call digest dp25a
node call digest dp25a 75
```

When a user invokes `digest` in this example, the `call` module:
- gets the template and the digesting module from subdirectory `dp25a` in the `process.env.DIGESTPROCDIR` directory
- gets the reports from the `process.env.REPORTDIR_SCORED` directory
- writes the digested reports to the `process.env.REPORTDIR__DIGESTED` directory

The optional third argument to call (`75` in this example) is a report selector. Without the argument, `call` gets all the reports in the `process.env.REPORTDIR_SCORED` directory. With the argument, `call` gets only those reports whose names begin with the argument string.

The digests created by `digest` are HTML files, and they expect a `style.css` file to exist in their directory. The `reports/digested/style.css` file in Testilo is an appropriate stylesheet to be copied into the directory where digested reports are written.

### Report comparison

If you use Testilo to perform a battery of tests on multiple targets, you may want a single report that compares the total scores received by the targets. Testilo can produce such a _comparative report_.

The `compare` module compares the scores in a collection of scored reports. Its `compare()` function takes three arguments:
- a comparison template
- a comparison function
- an array of scored reports

The comparison template is an HTML document containing placeholders. A copy of the template, with its placeholders replaced by texts, becomes the comparative report. The comparison function defines the rules for replacing the placeholders with texts. The Testilo package contains a `procs/compare` directory, in which there are subdirectories containing pairs of templates and modules that export comparison functions. You can use one of those pairs, or you can create your own.

### Invocation

There are two ways to use the `compare` module.

#### By a module

A module can invoke `compare` in this way:

```javaScript
const fs = require('fs/promises);
const {compare} = require('testilo/compare');
const comparerDir = `${process.env.COMPAREPROCDIR}/cp25a`;
fs.readFile(`${comparerDir}/index.html`)
.then(template => {
  const {comparer} = require(`${comparerDir}/index`);
  const comparativeReports = compare(template, comparer, scoredReports);
});
```

The first two arguments to `compare()` are a template and a comparison function. In this example, they have been obtained from files in the Testilo package, but they could be custom-made. The third argument to `compare()` is an array of report objects.

#### By a user

A user can invoke `compare` in this way:

```bash
node call compare cp25a legislators
```

When a user invokes `compare` in this example, the `call` module:
- gets the template and the comparison module from subdirectory `cp25a` in the `process.env.COMPAREPROCDIR` directory
- gets all the reports in the `process.env.REPORTDIR_SCORED` directory
- writes the comparative report as an HTML file named `legislators.html` to the `process.env.REPORTDIR__COMPARATIVE` directory

The comparative reports created by `compare` are HTML files, and they expect a `style.css` file to exist in their directory. The `reports/comparative/style.css` file in Testilo is an appropriate stylesheet to be copied into the directory where comparative reports are written.
