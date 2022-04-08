# testilo
Client that runs Testaro tests to fulfill Aorta jobs

## Introduction

This application is designed to be installed on a Windows or Macintosh host and to operate as an agent performing Testaro jobs for an Aorta server.

[Testaro](https://www.npmjs.com/package/testaro) is a dependency that performs digital accessibility tests on Web resources.

[Aorta](https://github.com/jrpool/aorta) is a server application that routes orders to testers and receives test reports back from testers. Testilo acts as a tester for Aorta.

## Dependencies

The Testaro dependency has some dependencies in the @siteimprove scope that are Github Packages. In order to execute `npm install` successfully, you need the `.npmrc` file in your project directory with this content, unless an `.npmrc` file in your home directory or elsewhere provides the same content:

```bash
@siteimprove:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:username=abc
//npm.pkg.github.com/:_authToken=def
```

In this content, replace `abc` with your Github username and `def` with a Github personal access token that has `read:packages` scope.

## Operation

Testilo acts as an Aorta _user_ with `test` permission. By executing the statement `node index`, you start Testilo. Periodically, it connects to an Aorta server and asks whether there are any jobs assigned to its user. If there are any, Testilo retrieves the first job and performs it. When the job is finished, Testilo contacts the Aorta server again and creates a report in Aorta containing the results of the job.

The interval between instances of this operation is settable (see below). Testilo performs only one job at a time. If a job is in progress at the next scheduled time for retrieving a job, that instance is skipped.

## Configuration

### General

An untracked `.env` file contains environment variables required by Testilo. It has this format:

```bash
USERNAME=x0
AUTHCODE=x1
ENVIRONMENT=x2
PRODPROTOCOL=https
PRODHOSTNAME=x3
PRODPORT=443
DEVPROTOCOL=http
DEVHOSTNAME=localhost
DEVPORT=3005
TESTARO_WAVE_KEY=x4
INTERVAL=x5
```

To create the `.env` file, replace `x0` with an Aorta user ID, `x1` with the Aorta authCode for that user, `x2` with either `DEV` (if running locally) or `prod` (if running on a server), `x3` with the hostname (such as `example.com`) of the Aorta server (thus, not including the `/aorta` path that Testilo will add), `x4` with a WAVE API key if Testilo is going to perform any tests using the WAVE API, and `x5` with the number of milliseconds to wait between repetitions (such as `60000` for one minute).

### `ibm` test

Testaro can perform the `ibm` test. That test requires the `aceconfig.js` configuration file in the root directory.
