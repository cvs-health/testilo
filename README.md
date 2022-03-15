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

In this content, replace `abc` with your Github username and `def` with your Github personal access token.
