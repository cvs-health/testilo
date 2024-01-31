# testilo
Utilities for Testaro

## Introduction

The Testilo package contains utilities that facilitate the use of the [Testaro](https://www.npmjs.com/package/testaro) package.

Testaro performs jobs and creates reports in JSON format. The utilities in Testilo fall into two categories:
- Job preparation
- Report enhancement

Because Testilo supports Testaro, this `README` file presumes that you have access to the Testaro `README` file and therefore does not repeat information provided there.

## Dependencies

The `dotenv` dependency lets you set environment variables in an untracked `.env` file. This prevents secret data, such as passwords, from being shared as part of this package.

When Testilo is a dependency of another application, the `.env` file is not imported, because it is not tracked, so all needed environment variables must be provided by the importing application.

## Architecture

Testilo is written in Node.js. Commands are given to Testilo in a command-line (terminal) interface or programmatically.

Shared routines, called _procs_, are located in the `procs` directory.

Testilo can be installed wherever Node.js (version 14 or later) is installed. This can be a server or the same workstation on which Testaro is installed.

The reason for Testilo being an independent package, rather than part of Testaro, is that Testilo can be installed on any host, while Testaro can run successfully only on a Windows, Macintosh, Ubuntu, or Debian workstation. Testaro runs tests similar to those that a human accessibility tester would run, using whatever browsers, input devices, system settings, simulated and attached devices, and assistive technologies tests may require. Thus, Testaro is limited to functionalities that require workstation attributes. For maximum flexibility in the management of Testaro jobs, all other functionalities are located outside of Testaro. You could have software such as Testilo running on a server, communicating with multiple workstations running Testaro. The workstations could receive jobs from the server and return job reports to the server for further processing.

## Configuration

Environment variables for Testilo can be specified in a `.env` file. An example:

```bash
FUNCTIONDIR=./procs
JOBDIR=../testdir/jobs
REPORTDIR=../testdir/reports
REQUESTER=a11ymgr@a11yorg.com
SPECDIR=../testdir/specs
```

The `FUNCTIONDIR` environment variable typically references the `procs` directory, but it could reference a different directory in the filesystem where Testilo resides, if you wanted to customize the procs that Testilo uses.

`JOBDIR` references a directory in the filesystem where jobs created by the `merge` proc are to be saved.

`REPORTDIR` references a directory in the filesystem where reports are saved.

`REQUESTER` is an email address that will be used as a job property if no other email address is specified for the `sources.requester` property of the job.

`SPECDIR` references a directory in the filesystem where tanrget lists, batches, and scripts can be found. Those are raw materials from which Testaro creates jobs.

## Job preparation

### Introduction

Testaro executes _jobs_. In a job, Testaro performs _acts_ (tests and other operations) on _targets_ (typically, web pages). The Testaro `README.md` file specifies the requirements for a job.

You can create a job for Testaro directly, without using Testilo.

Testilo can, however, make job preparation more efficient in these scenarios:
- You want to perform a battery of tests on multiple targets.
- You want to test targets only for particular issues, using whichever tools happen to have tests for those issues.

### Target lists

The simplest version of a list of targets is a _target list_. It is an array of arrays defining 1 or more targets. It can be stored as a tab-delimited text file.

A target is defined by 2 items:
- A description
- A URL

For example, a target list might be:

```javaScript
[
  ['World Wide Web Consortium', 'https://www.w3.org/'],
  ['Mozilla Foundation', 'https://foundation.mozilla.org/en/']
]
```

If this target list were stored as a file, its content would be this (with “→” representing the Tab character):

```text
World Wide Web Consortium→https://www.w3.org/
Mozilla Foundation→https://foundation.mozilla.org/en/
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
      which: 'https://acmeclothes.com/',
      acts: {
        public: [
          {
            type: 'launch',
            what: 'Acme Clothes home page',
            url: 'https://acmeclothes.com/'
          }
        ],
        private: [
          {
            type: 'launch',
            what: 'Acme Clothes login page',
            url: 'https://acmeclothes.com/login.html'
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

A batch is a JavaScript object. It can be converted to JSON and stored in a file.

### Scripts

The generic, target-independent description of a job is _script_. A script can contain _placeholders_ that Testilo replaces with acts from a batch, creating one job per target. Thus, one script plus a batch containing _n_ targets will generate _n_ jobs.

Here is a script:

```javaScript
{
  id: 'ts99',
  what: 'aside mislocation',
  strict: true,
  isolate: true,
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
      detailLevel: 2,
      rules: ['landmark-complementary-is-top-level'],
      what: 'Axe'
    },
    {
      type: 'test',
      which: 'qualWeb',
      withNewContent: false,
      rules: ['QW-BP25', 'QW-BP26']
      what: 'QualWeb'
    }
  ]
}
```

A script has several properties that specify facts about the jobs to be created. They include:
- `id`: an ID. A script can be converted from a JavaScript object to JSON and saved in a file in the `SPECDIR` directory, where it will be named by its ID (e.g., if the ID is `ts99`, the file name will be `ts99.json`). Thus, each script needs an `id` with a unique value.
- `what`: a description of the script.
- `strict`: `true` if Testaro is to abort jobs when a target redirects a request to a URL differing substantially from the one specified. If `false` Testaro is to allow redirection. All differences are considered substantial unless the URLs differ only in the presence and absence of a trailing slash.
- `isolate`: If `true`, Testilo, before creating a job, will isolate test acts, as needed, from effects of previous test acts, by inserting a copy of the latest placeholder after each target-modifying test act other than the final act. If `false`, placeholders will not be duplicated.
- `timeLimit`: This specifies the maximum duration, in seconds, of a job. Testaro will abort jobs that are not completed within that time.
- `acts`: an array of acts.

The first act in this example script is a placeholder, whose `which` property is `'private'`. If the above batch were merged with this script, in each job the placeholder would be replaced with the `private` acts of a target. For example, the first act of the first job would launch a Chromium browser, navigate to the Acme login page, complete and submit the login form, wait for the account page to load, run the Axe tests, and then run the QualWeb tests. If the batch contained additional targets, additional jobs would be created, with the login actions for each target specified in the `private` array of the `acts` object of that target.

As shown in this example, when a browser is launched by placeholder substitution, the script can determine the browser type (`chromium`, `firefox`, or `webkit`) by assigning a value to a `launch` property of the placeholder. This allows a script to ensure that the tests it requires are performed with appropriate browser types. Some browser types are incompatible with some tests.

### Target list to batch

If you have a target list, the `batch` module of Testilo can convert it to a batch. The batch will contain, for each target, one array of acts named `main`, containing a `launch` act (depending on the script to specify the browser type and the target to specify the URL).

#### Invocation

There are two ways to use the `batch` module.

##### By a module

A module can invoke `batch` in this way:

```javaScript
const {batch} = require('testilo/batch');
const batchObj = batch(id, what, targets);
```

This invocation references `id`, `what`, and `targets` variables that the module must have already defined. The `id` variable is a unique identifier for the target list. The `what` variable describes the target list. The `targets` variable is an array of arrays, with each array containing the 2 items (description and URL) defining one target.

The `batch()` function of the `batch` module generates a batch and returns it as an object. The invoking module can further dispose of the batch as needed.

The ID assigned to each target by the `batch()` function is a sequential (base-62 alphanumeric) string, rather than a mnemonic like the one (`'acme'`) in the above example.

##### By a user

A user can invoke `batch` in this way:

- Create a target list and save it as a text file (with tab-delimited items in newline-delimited lines) in the `targetLists` subdirectory of the `SPECDIR` directory. Name the file `x.tsv`, where `x` is the list ID.
- In the Testilo project directory, execute the statement `node call batch id what`.

In this statement, replace `id` with the list ID and `what` with a string describing the batch.

The `call` module will retrieve the named target list.
The `batch` module will convert the target list to a batch.
The `call` module will save the batch as a JSON file in the `batches` subdirectory of the `SPECDIR` directory.

### Issues to script

Testilo contains a classification of tool rules into _issues_. It is located in the `procs/score` directory and has a file name starting with `tic` (Testilo issue classification). You can create custom classifications and save them in a `score` subdirectory of the `FUNCTIONDIR` directory.

For example, one of the issues in the `tic40.js` file is `mainNot1`. Four rules are classified as belonging to that issue: rule `main_element_only_one` of `aslint` and 3 more rules defined by 3 other tools.

If you want Testaro to test targets for only particular issues, you can use the `script` module to create a script. Jobs created from that script will make Testaro test for only the issues you specify to the `script` module.

If you want Testaro to test targets for **all** the rules of all the available tools, you can use the `script` module to create a script that does not impose any issue restrictions.

#### Invocation

There are two ways to use the `script` module.

##### By a module

A module can invoke `script` in this way:

```javaScript
const {script} = require('testilo/script');
const scriptObj = script(scriptID, issues, issueID0, issueID1, …);
```

This invocation references `scriptID`, `issues`, and `issueID` variables.
- The `scriptID` variable specifies the ID that the script will have.
- The `issues` variable (if present) is an object that classifies issues, such as the `issues` object in a `tic` file.
- The `issueID` variables (if any) are strings, such as `'regionNoText'`, that name issues, i.e. properties of the `issues` object, that you want jobs from the script to test for.

The `script()` function of the `script` module generates a script and returns it as an object. The invoking module can further modify and use the script as needed.

To create a script **without** issue restrictions, a module can use this invocation:

```javaScript
const {script} = require('testilo/script');
const scriptObj = script(scriptID);
```

##### By a user

A user can invoke `script` in this way: In the Testilo project directory, execute the statement `node call script id ticnn issuea issueb …`.

In this statement:
- Replace `id` with an ID for the script, such as `headings`.
- Replace `ticnn` with the base, such as `tic99`, of the name of an issue classification file in the `score` subdirectory of the `FUNCTIONDIR` directory.
- Replace the remaining arguments (`issuea` etc.) with issue names from that classification file.

The `call` module will retrieve the named classification.
The `script` module will create a script.
The `call` module will save the script as a JSON file in the `scripts` subdirectory of the `SPECDIR` directory.

To create a script without any issue restrictions, a user can execute the statement `node call script id`.

#### Options

The `script` module will use the value of the `SEND_REPORT_TO` environment variable as the value of the `sendReportTo` property of the script, if that variable exists, and otherwise will leave that property with an empty-string value.

When the `script` module creates a script for you, it does not ask you for all of the options that the script may require. Instead, it chooses default options. After you invoke `script`, you can edit the script that it creates to revise options.

### Merge

Testilo merges batches with scripts, producing jobs, by means of the `merge` module.

#### Output

Suppose you ask for a merger of the above batch and script. Then the first job produced by `merge` will look like this:

```javaScript
{
  id: '240115T1200-4Rw-acme',
  what: 'aside mislocation',
  strict: true,
  timeLimit: 60,
  standard: 'also',
  observe: false,
  sendReportTo: 'https://ourdomain.com/testman/api/report'
  timeStamp: '240115T1200',
  acts: [
    {
      type: 'launch',
      which: 'chromium',
      what: 'Acme Clothes login page',
      url: 'https://acmeclothes.com/login.html'
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
      detailLevel: 2,
      rules: ['landmark-complementary-is-top-level'],
      what: 'Axe'
    },
    {
      type: 'launch',
      which: 'chromium',
      what: 'Acme Clothes login page',
      url: 'https://acmeclothes.com/login.html'
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
      which: 'qualWeb',
      withNewContent: false,
      rules: ['QW-BP25', 'QW-BP26']
      what: 'QualWeb'
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
  creationTime: '241120T1550'
}
```

Testilo has substituted the `private` acts from the `acme` target of the batch for the placeholder when creating the job. Testilo also has:
- inserted a copy of those same acts after the `axe` test act, because `axe` is a target-modifying tool.
- let the script determine the browser type of the `launch` act.
- given the job an ID that combines the time stamp with a differentiator and the batch ID.
- inserted a `sources` property into the job, recording facts about the script, the batch, the target, the requester, and the report URL.
- added a time stamp describing the creation time to the job.

This is a valid Testaro job.

#### Invocation

There are two ways to use the `merge` module.

##### By a module

A module can invoke `merge` in this way:

```javaScript
const {merge} = require('testilo/merge');
const jobs = merge(script, batch, standard, observe, requester, timeStamp);
```

The `merge` module uses these 4 arguments to create jobs from a script and a batch.

The arguments are:
- `script`: a script.
- `batch`: a batch.
- `standard`: how to handle standardization. If `also`, jobs will tell Testaro to include in its reports both the original results of the tests of tools and the Testaro-standardized results. If `only`, reports are to include only the standardized test results. If `no`, reports are to include only the original results, without standardization.
- `observe`: whether to allow granular observation. If `true`, jobs will tell Testaro to permit granular observation of job progress. If `false`, jobs will tell Testaro not to permit granular observation, but only to send the report to the server when the report is completed. It is generally user-friendly to allow granular observation, and for user applications to implement it, if they make users wait while jobs are assigned and performed, since that process typically takes about 3 minutes.
- `requester`: an email address.
- `timeStamp`: the earliest UTC date and time when the jobs may be assigned (format `240415T1230`), or an empty string if now.

The `merge()` function of the `merge` module generates jobs and returns them in an array. The invoking module can further dispose of the jobs as needed.

##### By a user

A user can invoke `merge` in this way:

- Create a script and save it as a JSON file in the `scripts` subdirectory of the `SPECDIR` directory.
- Create a batch and save it as a JSON file in the `batches` subdirectory of the `SPECDIR` directory.
- In the Testilo project directory, execute the statement:

```javascript
node call merge scriptID batchID standard observe requester timeStamp todoDir
```

In this statement, replace:
- `scriptID` with the ID (which is also the base of the file name) of the script.
- `batchID` with the ID (which is also the base of the file name) of the batch.
- `standard`, `observe`, `requester`, and `timeStamp` as described above.
- `todoDir`: `true` if the jobs are to be saved in the `todo` subdirectory, or `false` if they are to be saved in the `pending` subdirectory, of the `JOBDIR` directory.

The `call` module will retrieve the named script and batch from their respective directories.
The `merge` module will create an array of jobs.
The `call` module will save the jobs as JSON files in the `todo` or `pending` subdirectory of the `JOBDIR` directory.

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

### Scorers

The built-in scoring functions are named `scorer` and are exported by files whose names begin with `tsp` (for Testilo scoring proc). Those functions make use of `issues` objects defined in files whose names begin with `tic`. An `issues` object defines an issue classification: a body of data about rules of tools and the tool-agnostic issues that those rules are deemed to belong to.

The properties of an `issues` object are issue objects: objects containing data about issues. Here is an example from `tic40.js`:

```javascript
multipleLabelees: {
  summary: 'labeled element ambiguous',
  why: 'User cannot get help on the topic of a form item',
  wcag: '1.3.1',
  weight: 4,
  tools: {
    aslint: {
      label_implicitly_associatedM: {
        variable: false,
        quality: 1,
        what: 'Element contains more than 1 labelable element.'
      }
    },
    nuVal: {
      'The label element may contain at most one button, input, meter, output, progress, select, or textarea descendant.': {
        variable: false,
        quality: 1,
        what: 'Element has more than 1 labelable descendant.'
      },
      'label element with multiple labelable descendants.': {
        variable: false,
        quality: 1,
        what: 'Element has multiple labelable descendants.'
      }
    }
  }
},
```

In this example, `multipleLabelees` is the issue ID. The `weight` property represents the severity of the issue and ranges from 1 to 4. The `tools` property is an object containing data about the tools that have rules deemed to belong to the issue. Here there are 2 such tools: `aslint` and `nuVal`. The tool properties are objects containing data about the relevant rules of those tools: 1 from the `aslint` tool and 2 from the `nuVal` tool.

The property for each rule has the rule ID as its name.

The `variable` property is `true` if the rule ID is a regular expression or `false` if the rule ID is a string. Most rule IDs are strings, but some rules have patterns rather than constant strings as their identifiers, and in those cases regular expressions matching the patterns are the property names.

The `quality` property is usually 1, but if the test of the rule is known to be inaccurate the value is a fraction of 1, so the result of that test will be downweighted.

Some issue objects (such as `flash` in `tic40.js`) have a `max` property, equal to the maximum possible count of instances. That property allows a scorer to ascribe a greater weight to an instance of that issue.

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
- gets the scoring module `tsp99` from its JSON file `tsp99.json` in the `score` subdirectory of the `FUNCTIONDIR` directory.
- gets the reports from the `raw` subdirectory of the `REPORTDIR` directory.
- writes the scored reports in JSON format to the `scored` subdirectory of the `REPORTDIR` directory.

The optional third argument to call (`75m` in this example) is a report selector. Without the argument, `call` gets all the reports in the `raw` subdirectory. With the argument, `call` gets only those reports whose names begin with the argument string.

### Validation

To test the `score` module, in the project directory you can execute the statement `node validation/score/validate`. If `score` is valid, all logging statements will begin with “Success” and none will begin with “ERROR”.

## Report digesting

### Introduction

Reports from Testaro are JavaScript objects. When represented as JSON, they are human-readable, but not human-friendly. They are basically designed for machine tractability. Testilo can _digest_ a scored report, converting it to a human-oriented HTML document, or _digest_.

The `digest` module digests a scored report. Its `digest()` function takes three arguments:
- a digest template
- a digesting function
- an array of scored report objects

The digest template is an HTML document containing placeholders. A copy of the template, with its placeholders replaced by computed values, becomes the digest. The digesting function defines the rules for replacing the placeholders with values. The Testilo package contains a `procs/digest` directory, in which there are subdirectories, each containing a template and a module that exports a digesting function. You can use one of those template-module pairs, or you can create your own.

The included template-module pairs format placeholders with leading and trailing underscore pairs (such as `__issueCount__`).

### Invocation

There are two ways to use the `digest` module.

#### By a module

A module can invoke `digest` in this way:

```javaScript
const {digest} = require('testilo/digest');
const digesterDir = `${process.env.FUNCTIONDIR}/digest/tdp99a`;
const {digester} = require(`${digesterDir}/index`);
const reportDir = 'https://xyz.org/a11yTesting/reports';
digest(digester, scoredReports, reportDir)
.then(digestedReports => {…});
```

The first argument to `digest()` is a digesting function. In this example, it has been obtained from a file in the Testilo package, but it could be custom-made. The second argument to `digest()` is an array of scored report objects. The third argument is the URL of a directory where the reports being digested are located. The `digest()` function needs that URL because a digest includes a link to the full report. The link concatenates the directory URL with the report ID and a `.json` suffix. The `digest()` function returns an array of digested reports. The invoking module can further dispose of the digested reports as needed.

#### By a user

A user can invoke `digest` in this way:

```bash
node call digest tdp99 ../scored
node call digest tdp99 ../scored 75m
```

When a user invokes `digest` in this example, the `call` module:
- gets the template and the digesting module from subdirectory `tdp99` in the `digest` subdirectory of the `FUNCTIONDIR` directory.
- gets the reports from the `scored` subdirectory of the `REPORTDIR` directory.
- writes the digested reports to the `digested` subdirectory of the `REPORTDIR` directory.
- includes in each digest a link to the scored report, whose destination is `..scored/id.json`, where `id` is replaced with the ID of the report.

The optional fourth argument to `call` (`75m` in this example) is a report selector. Without the argument, `call` gets all the reports in the `scored` subdirectory of the `REPORTDIR` directory. With the argument, `call` gets only those reports whose names begin with the argument string.

The digests created by `digest` are HTML files, and they expect a `style.css` file to exist in their directory. The `reports/digested/style.css` file in Testilo is an appropriate stylesheet to be copied into the directory where digested reports are written.

As illustrated by these examples, the URL argument can be absolute or relative to the digest.

## Report difgesting

### Introduction

A _difgest_ is a digest that compares two reports. They can be reports of different targets, or reports of the same target from two different times or under two different conditions.

The `difgest` module difgests two scored reports. Its `difgest()` function takes three arguments:
- a difgest template
- a difgesting function
- an array of two scored report objects

The difgest template and module operate like the digest ones.

### Invocation

There are two ways to use the `difgest` module.

#### By a module

A module can invoke `difgest` in this way:

```javaScript
const {difgest} = require('testilo/difgest');
const difgesterDir = `${process.env.FUNCTIONDIR}/difgest/tdp99a`;
const {difgester} = require(`${difgesterDir}/index`);
difgest(difgester, scoredReportA, scoredReportB, digestAURL, digestBURL)
.then(difgestedReport => {…});
```

The difgest will include links to the two digests, which, in turn, contain links to the full reports.

`difgest()` returns a difgest. The invoking module can further dispose of the difgest as needed.

#### By a user

A user can invoke `difgest` in this way:

```bash
node call difgest tfp99 20141215T1200-x7-3 20141215T1200-x7-4
```

When a user invokes `difgest` in this example, the `call` module:
- gets the template and the difgesting module from subdirectory `tfp99` in the `difgest` subdirectory of the `FUNCTIONDIR` directory.
- gets reports `20141215T1200-x7-3` and `20141215T1200-x7-4` from the `scored` subdirectory of the `REPORTDIR` directory.
- writes the difgested report to the `difgested` subdirectory of the `REPORTDIR` directory.

Difgests include links to the digests of the two reports. The `call` module assumes that those digests are located in a `digested` subdirectory of the `REPORTDIR` directory.

Difgests expect a `style.css` file to exist in their directory, as digests do.

### Validation

To test the `digest` module, in the project directory you can execute the statement `node validation/digest/validate`. If `digest` is valid, all logging statements will begin with “Success” and none will begin with “ERROR”.

### Report comparison

If you use Testilo to perform a battery of tests on multiple targets, you may want a single report that compares the total scores received by the targets. Testilo can produce such a _comparative report_.

The `compare` module compares the scores in a collection of scored reports. Its `compare()` function takes two arguments:
- a comparison function
- an array of scored reports

The comparison function defines the rules for generating an HTML file comparing the scored reports. The Testilo package contains a `procs/compare` directory, in which there are subdirectories containing modules that export comparison functions. You can use one of those functions, or you can create your own.

### Invocation

There are two ways to use the `compare` module.

#### By a module

A module can invoke `compare` in this way:

```javaScript
const {compare} = require('testilo/compare');
const comparerDir = `${process.env.FUNCTIONDIR}/compare/tcp99`;
const {comparer} = require(`${comparerDir}/index`);
compare(comparer, scoredReports)
.then(comparison => {…});
```

The first argument to `compare()` is a comparison function. In this example, it been obtained from a file in the Testilo package, but it could be custom-made. The second argument to `compare()` is an array of report objects. The `compare()` function returns a comparative report. The invoking module can further dispose of the comparative report as needed.

#### By a user

A user can invoke `compare` in this way:

```bash
node call compare tcp99 legislators 23pl
```

When a user invokes `compare` in this example, the `call` module:
- gets the comparison module from subdirectory `tcp99` of the subdirectory `compare` in the `FUNCTIONDIR` directory.
- gets all the reports in the `scored` subdirectory of the `REPORTDIR` directory whose file names begin with `23pl`.
- writes the comparative report as an HTML file named `legislators.html` to the `comparative` subdirectory of the `REPORTDIR` directory.

The fourth argument to `call` (`23pl` in this example) is optional. If it is omitted, `call` will get and `comparer` will compare all the reports in the `scored` directory.

The comparative report created by `compare` is an HTML file, and it expects a `style.css` file to exist in its directory. The `reports/comparative/style.css` file in Testilo is an appropriate stylesheet to be copied into the directory where comparative reports are written.

### Tool crediting

If you use Testaro to perform all the tests of all the tools on multiple targets and score the reports with a score proc that maps tool rules onto tool-agnostic issues, you may want to tabulate the comparative efficacy of each tool in discovering instances of issues. Testilo can help you do this by producing a _credit report_.

The `credit` module tabulates the contribution of each tool to the discovery of issue instances in a collection of scored reports. Its `credit()` function takes one argument: an array of scored reports.

The credit report contains four sections:
- `counts`: for each issue, how many instances each tool reported
- `onlies`: for each issue of which only 1 tool reported instances, which tool it was
- `mosts`: for each issue of which at least 2 tools reported instances, which tool(s) reported the maximum instance count
- `tools`: for each tool, two sections:
    - `onlies`: a list of the issues that only the tool reported instances of
    - `mosts`: a list of the issues for which the instance count of the tool was not surpassed by that of any other tool

### Invocation

There are two ways to use the `credit` module.

#### By a module

A module can invoke `credit` in this way:

```javaScript
const {credit} = require('testilo/credit');
credit(scoredReports)
.then(creditReport => {…});
```

The argument to `credit()` is an array of scored report objects. The `credit()` function returns a credit report. The invoking module can further dispose of the credit report as needed.

#### By a user

A user can invoke `credit` in this way:

```bash
node call credit legislators 23pl
```

When a user invokes `credit` in this example, the `call` module:
- gets all the reports in the `scored` subdirectory of the `REPORTDIR` directory whose file names begin with `23pl`.
- writes the credit report as a JSON file named `legislators.json` to the `credit` subdirectory of the `REPORTDIR` directory.

The third argument to `call` (`23pl` in this example) is optional. If it is omitted, `call` will get and `credit()` will tabulate all the reports in the `scored` directory.

### Validation

To test the `compare` module, in the project directory you can execute the statement `node validation/compare/validate`. If `compare` is valid, all logging statements will begin with “Success” and none will begin with “ERROR”.

## Origin

Work on the functionalities of Testaro and Testilo began in 2017. It was named [Autotest](https://github.com/jrpool/autotest) in early 2021 and then partitioned into the more single-purpose packages Testaro and Testilo in January 2022.

## Etymology

“Testilo” means “testing tool” in Esperanto.
