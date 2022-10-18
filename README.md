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

### `merge`

The `merge` utility is useful when you want Testaro to perform the same set of operations on multiple hosts. For example, you may want the same tests run on multiple web pages. You would have a single script, and you would want multiple jobs created from it. Each job would target one host, and, for that purpose, any `url` command in the script would be modified so that its properties are those of that host. The `merge` utility (similar to mail merge in office applications) does this. It creates Testaro jobs out of a script and a _batch_.

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

The `merge` utility finds all the `url` commands in a script (telling the browser what to visit), replaces them with one of the hosts in the batch, and outputs the modified script as a job. It then does the same with each of the other hosts in the batch.

To execute `merge`, you need to have three environment variables defined to tell `merge` where files are located. You can define the environment variables in the `.env` file. Here is an example:

```
SCRIPTDIR=../testing/scripts
BATCHDIR=../testing/batches
JOBDIR=../testing/jobs
```

In this example, the script, batch, and job files are located in directories named `scripts`, `batches`, and `jobs` within `testing`, which is a sibling directory of the Testilo project directory.

The syntax of the `merge` statement is documented in `merge.js`.

Suppose that:
- The environment variables are defined as in the above example.
- There is a script file named `testall.json`.
- The above batch example is in a file named `usFedExec1.json`.

The statement `node merge testall usFedExec1 allFedExec` would tell Testilo to merge the batch `../testing/batches/usFedExec1.json` and the script `../testing/scripts/testall.json` into two job files and save those files in the directory `../testing/jobs/allFedExec`. Testilo will create any directories necessary to save the files there.

### `score`

Testaro performs tests and produces reports of test results. Testilo can add scores to those reports. In this way, each report can not only detail successes and failures of individual tests but also assign scores to those results and combine the partial scores into total scores.

The `score` utility performs scoring. It depends on score procs to define the scoring rules. Some score procs are in the Testilo package (in the `procs/score` directory), and you can create more score procs to implement different rules.

You can score multiple reports with a single invocation of `score`.

To execute `score`, you need to have two environment variables defined to tell `score` where files are located. You can define the environment variables in the `.env` file. Here is an example:

```
REPORTDIR_RAW=../testing/reports/raw
REPORTDIR_SCORED=../testing/reports/scored
```

The named directories must already exist.

The syntax of the `score` statement is documented in `score.js`.

A scored report file is identical to the file it was created from, except that the scored report has new properties named `score` and `scoreProcID`. The `score` property contains the scores.

### `digest`

Testaro reports, both originally and after they are scored, are JSON files. That format is basically designed for machine tractability.

The `digest` utility converts scored reports into HTML documents with explanatory content. Thus, it converts machine-oriented reports into human-oriented reports, called _digests_. It depends on digest procs to define the digesting rules. Some digest procs are in the Testilo package (in the `procs/digest` directory), and you can create more digest procs to implement different rules.

You can digest multiple scored reports with a single invocation of `digest`.

To execute  `digest`, you need to have two environment variables defined to tell `digest` where files are located. You can define the environment variables in the `.env` file. Here is an example:

```
REPORTDIR_SCORED=../testing/reports/scored
REPORTDIR_DIGESTED=../testing/reports/digested
```

The named directories must already exist.

The syntax of the `digest` statement is documented in `digest.js`.

The digests created by `digest` are HTML files, and they expect a `style.css` file to exist in their directory. The `reports/digested/style.css` file in Testilo is an appropriate stylesheet to be copied into `process.env.REPORTDIR_DIGESTED`.

### `compare`

You can summarize the results of a multi-host job by producing a document comparing the scores received by the hosts. The `compare` utility does this.

The `compare` utility gathers scores from a set of scored reports and produces an HTML document comparing the scores. It depends on compare procs to define the rules for making and showing the comparative scores. Some compare procs are in the Testilo package (in the `procs/compare` directory), and you can create more compare procs to implement different rules.

To execute  `compare`, you need to have two environment variables defined to tell `digest` where files are located. You can define the environment variables in the `.env` file. Here is an example:

```
REPORTDIR_SCORED=../testing/reports/scored
COMPARISONDIR=../testing/reports/compared
```

The named directories must already exist.

The syntax of the `compare` statement is documented in `compare.js`.

The comparisons created by `compare` are HTML files, and they expect a `style.css` file to exist in their directory. The `reports/comparative/style.css` file in Testilo is an appropriate stylesheet to be copied into `process.env.COMPARISONDIR`.
