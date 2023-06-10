# testilo
Utilities for Testaro

## Introduction

The Testilo package contains utilities that facilitate the use of the [Testaro](https://www.npmjs.com/package/testaro) package.

Testaro performs digital accessibility tests on web artifacts and creates reports in JSON format. The utilities in Testilo fall into two categories:
- Job preparation
- Report enhancement

Because Testilo supports Testaro, this `README` file presumes that you have access to the Testaro `README` file and therefore does not repeat information provided there.

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

Testilo can, however, make job preparation more efficient in these scenarios:
- You want to perform a battery of tests on multiple targets.
- You want to test targets for particular issues, using whichever tools happen to have tests for those issues.

### Target lists

The simplest version of a list of targets is a _target list_. It is an array of arrays defining 1 or more targets. It is stored as a tab-delimited text file, with one line per target. Each line contains 3 items, with tabs between them:
- An ID for the target
- A description of the target
- The URL of the target

For example, a stored target list (with “→” representing the Tab character) might be:

```text
w3c→World Wide Web Consortium→https://www.w3.org/
moz→Mozilla Foundation→https://foundation.mozilla.org/en/
```

### Batches

Targets can be specified in a more complex way, too. That allows you to create jobs in which particular targets are handled distinctively in particular contexts. The more complex representation of a set of targets is a _batch_. Here is the start of a batch, showing its first target:

```javaScript
{
  id: 'clothing-stores',
  what: 'clothing stores',
  targets: [
    {
      id: 'acme',
      what: 'Acme Clothes',
      acts: {
        public: [
          {
            type: 'launch'
          },
          {
            type: 'url',
            which: 'https://acmeclothes.com/',
            what: 'Acme Clothes home page'
          }
        ],
        private: [
          {
            type: 'launch'
          },
          {
            type: 'url',
            which: 'https://acmeclothes.com/login.html',
            what: 'Acme Clothes login page'
          },
          {
            type: 'text',
            which: 'User Name',
            what: 'tester34'
          },
          {
            type: 'text',
            which: 'Password',
            what: '__TESTER34_PASSWORD__'
          },
          {
            type: 'button',
            which: 'Submit',
            what: 'submit the login form'
          },
          {
            type: 'wait',
            which: 'title',
            what: 'account'
          }
        ]
      }
    },
    …
  ]
}
```

As shown, a batch, unlike a target list, defines named sequences of acts. They can be plugged into jobs, so various complex operations can be performed on each target.

### Scripts

The generic, target-independent description of a job is _script_. A script can contain _placeholders_ that Testilo replaces with acts from a batch, creating one job per target. Thus, one script plus one batch can generate an unlimited number of jobs.

Here is a script:

```javaScript
{
  id: 'ts99',
  what: 'Axe and QualWeb on account page',
  strict: true,
  timeLimit: 60,
  acts: [
    {
      type: 'placeholder',
      which: 'private',
      launch: 'chromium'
    },
    {
      type: 'test',
      which: 'axe',
      detailLevel: 1,
      rules: [],
      what: 'Axe core, all rules'
    },
    {
      type: 'test',
      which: 'qualWeb',
      withNewContent: false,
      what: 'QualWeb, all rules'
    }
  ]
}
```

This script has 3 acts. The first is a placeholder act. The above batch can be merged with this script to create jobs. In that case, the first job would launch a Chromium browser, navigate to the Acme login page, complete and submit the login form, wait for the account page to load, run the Axe tests, and then run the QualWeb tests. If the batch contained additional targets, additional jobs would be created, with the login actions for each target specified in the `private` array of the `acts` object of that target.

As shown in this example, when a browser is launched by placeholder substitution, the script can determine the browser type (`chromium`, `firefox`, or `webkit`) by assigning a value to a `launch` property of the placeholder. That is useful, because sometimes it is the actions specified in a script that dictate which browser type is appropriate.

### Target list to batch

If you have a target list, the `batch` module of Testilo can convert it to a batch. The batch will contain, for each target, one array of acts named `main`, containing a `launch` act (depending on the script to specify the browser type) and a `url` act.

#### Invocation

There are two ways to use the `batch` module.

##### By a module

A module can invoke `batch` in this way:

```javaScript
const {batch} = require('testilo/batch');
const batchObj = batch(listID, what, targets);
```

This invocation references `listID`, `what`, and `targets` variables that the module must have already defined. The `listID` variable is a unique identifier for the target list. the `what` variable describes the target list. The `targets` variable is an array of arrays, with each array containing the 3 items (ID, description, and URL) defining one target.

The `batch()` function of the `batch` module generates a batch and returns it as an object. The invoking module can further dispose of the batch as needed.

##### By a user

A user can invoke `batch` in this way:

- Create a target list and save it as a text file (with tab-delimited items in newline-delimited lines) in the `targetLists` subdirectory of the `process.env.SPECDIR` directory. Name the file `x.tsv`, where `x` is the list ID.
- In the Testilo project directory, execute this statement:
    - `node call batch i w`

In this statement, replace `i` with the list ID and `w` with a description of the batch.

The `call` module will retrieve the named target list.
The `batch` module will convert the target list to a batch.
The `call` module will save the batch as a JSON file in the `batches` subdirectory of the `process.env.SPECDIR` directory.

### Issues to script

Testilo classifies issues. The built-in issue classifications are located in the `procs/score` directory, in files whose names begin with `tic` (for “Testilo issue classification”). You can create additional `tic` files with custom issue classifications.

If you want Testaro to test targets for particular issues, you can name those issues and use the Testilo `script` module to create a script.

#### Invocation

There are two ways to use the `script` module.

##### By a module

A module can invoke `script` in this way:

```javaScript
const {script} = require('testilo/script');
const scriptObj = script(scriptID, issueClasses, issueID0, issueID1, …);
```

This invocation references `scriptID`, `issueClasses`, and `issueID` variables.
- The `scriptID` variable is an alphanumeric string.
- The `issueClasses` variable is an object that classifies issues, such as the `issueClasses` object in a `tic` file.
- The `issueID` variables are strings, such as `'regionNoText'`, that name of properties of the `issueClasses` object.

The `script()` function of the `script` module generates a script and returns it as an object. The invoking module can further dispose of the script as needed.

##### By a user

A user can invoke `script` in this way: In the Testilo project directory, execute the statement `node call script s c i0 i1 i2 i3 …`.

In this statement:
- Replace `s` with an ID for the script, such as `headings`.
- Replace `c` with the base name, such as `tic99`, of an issue classification file in the `score` subdirectory of the `process.env.FUNCTIONDIR` directory.
- Replace the remaining arguments (`i0` etc.) with issue IDs from that classification file.

The `call` module will retrieve the named classification from its directory.
The `script` module will create a script.
The `call` module will save the script as a JSON file in the `scripts` subdirectory of the `process.env.SPECDIR` directory.

#### Options

When the `script` module creates a script for you, it does not ask you for all of the options that the script may require. Instead, it chooses options. After you invoke `script`, you can edit the script that it creates to revise options.

### Merge

Testilo merges batches with scripts, producing jobs, by means of the `merge` module.

The `merge` module needs to be given a batch and a script. In addition, `merge` offers an isolation option. If you exercise it, the `merge` module will act as if the latest placeholder were **again** inserted after each target-modifying test act, except where that test act is the last act or where the next act after it is a placeholder.

#### Output

##### Without isolation

Suppose you ask for a merger of the above batch and script, **without** the isolation option. Then the first job produced by `merge` will look like this:

```javaScript
{
  id: '7is3i-ts99-acme',
  what: 'Axe on account page',
  strict: true,
  timeLimit: 60,
  acts: [
    {
      type: 'launch',
      which: 'chromium'
    },
    {
      type: 'url',
      which: 'https://acmeclothes.com/login.html',
      what: 'Acme Clothes login page'
    },
    {
      type: 'text',
      which: 'User Name',
      what: 'tester34'
    },
    {
      type: 'text',
      which: 'Password',
      what: '34SecretTester'
    },
    {
      type: 'button',
      which: 'Submit',
      what: 'submit the login form'
    },
    {
      type: 'wait',
      which: 'title',
      what: 'account'
    },
    {
      type: 'test',
      which: 'axe',
      detailLevel: 1,
      rules: [],
      what: 'Axe core, all rules'
    },
    {
      type: 'test',
      which: 'qualWeb',
      withNewContent: false,
      what: 'QualWeb, all rules'
    }
  ],
  sources: {
    script: 'ts99',
    batch: 'clothing-stores',
    target: {
      id: 'acme',
      what: 'Acme Clothes'
    },
    requester: 'you@yourdomain.tld'
  },
  creationTime: '2023-11-20T15:50:27',
  timeStamp: '7is3i'
}
```

Testilo has substituted the `private` acts from the `acme` target of the batch for the placeholder when creating the job. Testilo also has:
- let the script determine the browser type of the `launch` act.
- added a unique timestamp to the job.
- added the creation time to the job.
- given the job an ID that combines the timestamp with the script ID and the batch ID.
- inserted a `sources` property into the job, recording facts about the script, the batch, the target, and the email address given by the user who requested the merger.

This is a valid Testaro job.

##### With isolation

If, however, you requested a merger **with** isolation, then Testilo would take cognizance of the fact that an `axe` test act is a target-modifying act. Testilo would therefore act as if another instance of the placeholder had been located in the script after the `axe` test act. So, copies of the same 6 acts that precede the `axe` test act would be inserted **after** the `axe` test act, too.

Of the 10 tools providing tests for Testaro, 6 are target-modifying:
- `axe`
- `continuum`
- `htmlcs`
- `ibm`
- `wave`

#### Invocation

There are two ways to use the `merge` module.

##### By a module

A module can invoke `merge` in this way:

```javaScript
const {merge} = require('testilo/merge');
const jobs = merge(script, batch, requester, true);
```

This invocation references `script`, `batch`, and `requester` variables that the module must have already defined. The `script` and `batch` variables are a script object and a batch object, respectively. The `requester` variable is an email address. The fourth argument is a boolean, specifying whether to perform isolation; a missing fourth argument is equivalent to `false`. The `merge()` function of the `merge` module generates jobs and returns them in an array. The invoking module can further dispose of the jobs as needed.

##### By a user

A user can invoke `merge` in this way:

- Create a script and save it as a JSON file in the `scripts` subdirectory of the `process.env.SPECDIR` directory.
- Create a batch and save it as a JSON file in the `batches` subdirectory of the `process.env.SPECDIR` directory.
- In the Testilo project directory, execute one of these statements:
    - `node call merge s b e true`
    - `node call merge s b e false`
    - `node call merge s b e`

In these statements, replace `s` and `b` with the base names of the script and batch files, respectively. For example, if the script file is named `ts99.json`, then replace `s` with `ts99`. Replace `e` with an email address, or with an empty string if the environment variable `process.env.REQUESTER` exists and you want to use it.

The first statement will cause a merger **with** isolation.
The second and third statements will cause a merger **without* isolation.

The `call` module will retrieve the named script and batch from their respective directories.
The `merge` module will create an array of jobs.
The `call` module will save the jobs as JSON files in the `todo` subdirectory of the `process.env.JOBDIR` directory.

#### Validation

To test the `merge` module, in the project directory you can execute the statement `node validation/merge/validate`. If `merge` is valid, all logging statements will begin with “Success” and none will begin with “ERROR”.

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

Testilo can enhance such a report in three ways:
- adding scores
- creating digests
- creating comprisons

To add scores to reports, the `score` module of Testilo performs computations on the test results and adds a `score` property to each report.

The `score()` function of the `score` module takes two arguments:
- a scoring function
- an array of report objects

A scoring function defines scoring rules. The Testilo package contains a `procs/score` directory, in which there are modules that export scoring functions. You can use one of those scoring functions, or you can create your own.

### Invocation

There are two ways to invoke the `score` module.

#### By a module

A module can invoke `score` in this way:

```javaScript
const {score} = require('testilo/score');
const {scorer} = require('testilo/procs/score/tsp99');
score(scorer, reports);
```

The first argument to `score()` is a scoring function. In this example, it has been obtained from a module in the Testilo package, but it could be a custom function. The second argument to `score()` is an array of report objects. The invoking module can further dispose of the scored reports as needed.

#### By a user

A user can invoke `score` in this way:

```bash
node call score tsp99
node call score tsp99 75m
```

When a user invokes `score` in this example, the `call` module:
- gets the scoring module `tsp99` from its JSON file `tsp99.json` in the `score` subdirectory of the `process.env.FUNCTIONDIR` directory.
- gets the reports from the `raw` subdirectory of the `process.env.REPORTDIR` directory.
- writes the scored reports in JSON format to the `scored` subdirectory of the `process.env.REPORTDIR` directory.

The optional third argument to call (`75m` in this example) is a report selector. Without the argument, `call` gets all the reports in the `raw` subdirectory. With the argument, `call` gets only those reports whose names begin with the argument string.

### Validation

To test the `score` module, in the project directory you can execute the statement `node validation/score/validate`. If `score` is valid, all logging statements will begin with “Success” and none will begin with “ERROR”.

## Rport digesting

### Introduction

Reports from Testaro are JavaScript objects. When represented as JSON, they are human-readable, but not human-friendly. They are basically designed for machine tractability. Testilo can _digest_ a scored report, converting it to a human-oriented HTML document, or _digest_.

The `digest` module digests a scored report. Its `digest()` function takes three arguments:
- a digest template
- a digesting function
- an array of scored report objects

The digest template is an HTML document containing placeholders. A copy of the template, with its placeholders replaced by computed values, becomes the digest. The digesting function defines the rules for replacing the placeholders with values. The Testilo package contains a `procs/digest` directory, in which there are subdirectories containing pairs of templates and modules that export digesting functions. You can use one of those pairs, or you can create your own.

### Invocation

There are two ways to use the `digest` module.

#### By a module

A module can invoke `digest` in this way:

```javaScript
const {digest} = require('testilo/digest');
const digesterDir = `${process.env.FUNCTIONDIR}/digest/dp99a`;
fs.readFile(`${digesterDir}/index.html`, 'utf8')
.then(template => {
  const {digester} = require(`${digesterDir}/index`);
  const digestedReports = digest(template, digester, scoredReports);
});
```

The first two arguments to `digest()` are a digest template and a digesting function. In this example, they have been obtained from files in the Testilo package, but they could be custom-made. The third argument to `digest()` is an array of scored report objects. The `digest()` function returns an array of digested reports. The invoking module can further dispose of the digested reports as needed.

#### By a user

A user can invoke `digest` in this way:

```bash
node call digest tdp99
node call digest tdp99 75m
```

When a user invokes `digest` in this example, the `call` module:
- gets the template and the digesting module from subdirectory `tdp99` in the `digest` subdirectory of the `process.env.FUNCTIONDIR` directory.
- gets the reports from the `scored` subdirectory of the `process.env.REPORTDIR` directory.
- writes the digested reports to the `digested` subdirectory of the `process.env.REPORTDIR` directory.

The optional third argument to call (`75m` in this example) is a report selector. Without the argument, `call` gets all the reports in the `scored` subdirectory of the `process.env.REPORTDIR` directory. With the argument, `call` gets only those reports whose names begin with the argument string.

The digests created by `digest` are HTML files, and they expect a `style.css` file to exist in their directory. The `reports/digested/style.css` file in Testilo is an appropriate stylesheet to be copied into the directory where digested reports are written.

### Validation

To test the `digest` module, in the project directory you can execute the statement `node validation/digest/validate`. If `digest` is valid, all logging statements will begin with “Success” and none will begin with “ERROR”.

### Report comparison

If you use Testilo to perform a battery of tests on multiple targets, you may want a single report that compares the total scores received by the targets. Testilo can produce such a _comparative report_.

The `compare` module compares the scores in a collection of scored reports. Its `compare()` function takes three arguments:
- a comparison template
- a comparison function
- an array of scored reports

The comparison template is an HTML document containing placeholders. A copy of the template, with its placeholders replaced by computed values, becomes the comparative report. The comparison function defines the rules for replacing the placeholders with values. The Testilo package contains a `procs/compare` directory, in which there are subdirectories containing pairs of templates and modules that export comparison functions. You can use one of those pairs, or you can create your own.

### Invocation

There are two ways to use the `compare` module.

#### By a module

A module can invoke `compare` in this way:

```javaScript
const fs = require('fs/promises);
const {compare} = require('testilo/compare');
const comparerDir = `${process.env.FUNCTIONDIR}/compare/tcp99`;
fs.readFile(`${comparerDir}/index.html`)
.then(template => {
  const {comparer} = require(`${comparerDir}/index`);
  const comparativeReport = compare(template, comparer, scoredReports);
});
```

The first two arguments to `compare()` are a template and a comparison function. In this example, they have been obtained from files in the Testilo package, but they could be custom-made. The third argument to `compare()` is an array of report objects. The `compare()` function returns a comparative report. The invoking module can further dispose of the comparative report as needed.

#### By a user

A user can invoke `compare` in this way:

```bash
node call compare tcp99 legislators
```

When a user invokes `compare` in this example, the `call` module:
- gets the template and the comparison module from subdirectory `tcp99` of the subdirectory `compare` in the `process.env.FUNCTIONDIR` directory.
- gets all the reports in the `scored` subdirectory of the `process.env.REPORTDIR` directory.
- writes the comparative report as an HTML file named `legislators.html` to the `comparative` subdirectory of the `process.env.REPORTDIR` directory.

The comparative report created by `compare` is an HTML file, and it expects a `style.css` file to exist in its directory. The `reports/comparative/style.css` file in Testilo is an appropriate stylesheet to be copied into the directory where comparative reports are written.

### Validation

To test the `compare` module, in the project directory you can execute the statement `node validation/compare/validate`. If `compare` is valid, all logging statements will begin with “Success” and none will begin with “ERROR”.
