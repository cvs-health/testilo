# testilo
Runner of Testaro tests

## Introduction

This application is designed to be installed on a Windows or Macintosh host and to operate as a runner of Testaro jobs.

[Testaro](https://www.npmjs.com/package/testaro) is a dependency that performs digital accessibility tests on Web resources.

## Dependencies

The `dotenv` dependency lets you set environment variables in an untracked `.env` file.

The Testaro dependency has some dependencies in the @siteimprove scope that are Github Packages. In order to execute `npm install` successfully, you need the `.npmrc` file in your project directory with this content, unless an `.npmrc` file in your home directory or elsewhere provides the same content:

```bash
@siteimprove:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:username=abc
//npm.pkg.github.com/:_authToken=def
```

In this content, replace `abc` with your Github username and `def` with a Github personal access token that has `read:packages` scope.

## Operation

### General

Testilo orders a Testaro job by calling Testaro’s `handleRequest` function with an object argument. The argument has this structure:

```javascript
{
  id,
  script: {…},
  log: [],
  acts: []
}
```

The `script` property has a Testaro script as its value. See the Testaro `README.md` file for documentation on scripts.

If a script is represented as JSON in a file `scripts/scriptX.json`, you can incorporate it into the options object of a Testaro call by executing the statement

```javascript
node index scriptX
```

### Batches

You may wish to have Testaro perform the same sequence of tests on multiple web pages. In that case, you can create a _batch_, with the following structure:

```javascript
{
  what: 'Web leaders',
  hosts: {
    id: 'w3c',
    which: 'https://www.w3.org/',
    what: 'W3C'
  },
  {
    id: 'wikimedia',
    which: 'https://www.wikimedia.org/',
    what: 'Wikimedia'
  }
}
```

With a batch, you can execute a single statement to call Testaro multiple times, one per host. On each call, Testilo takes one of the hosts in the batch and substitutes it for each host specified in a `url` command of the script. Testilo waits for each Testaro job to finish before calling the next Testaro job.

If a batch is represented as a JSON file `batches/batchY.json`, you can use it to call a set of Testaro jobs with the statement

```javascript
node index scriptX batchY
```

Given that statement, Testilo replaces the hosts in the script with the first host in the batch and calls Testaro. When Testaro finishes performing that script, Testilo replaces the script hosts with the second batch host and calls Testaro again. And so on.

### Reports

When you execute a `node index …` statement, Testilo begins populating the object argument by giving its `id` property a value. If there is no batch, the value of that property is a string encoding the date and time when you executed the statement (e.g., `eh9q7r`). If there is a batch, the value is the same, except that it is suffixed with a hyphen-minus character followed by the `id` value of the host (e.g., `eh9q7r-wikimedia`).

Testaro delivers its results by populating the `log` and `acts` arrays of the object argument. Testilo waits for Testaro to finish performing the script and then saves the object argument in JSON format as a file in the `reports` directory.

## Configuration

### `ibm` test

Testaro can perform the `ibm` test. That test requires the `aceconfig.js` configuration file in the root directory of the Testilo project.

### Environment variables

If a `wave` test is included in a script, an environment variable named `TESTARO_WAVE_KEY` must exist, with your WAVE API key as its value.

Before executing a Testaro script, you can optionally also set the environment variables `TESTARO_DEBUG` (to `'true'` or anything else) and/or `TESTARO_WAITS` (to a non-negative integer). The effects of these variables are described in the Testaro `index.js` file.
