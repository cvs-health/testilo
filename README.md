# testilo
Scorer and digester of Testaro reports

## Introduction

This application enriches [Testaro](https://www.npmjs.com/package/testaro) reports. Testaro performs digital accessibility tests on web artifacts and creates reports in JSON format. To make those reports more useful, this application, Testilo, computes scores, converts the scored reports to human-readable web pages (_digests_), and compiles human-readable web pages comparing the scores of multiple artifacts.

## Dependencies

The `dotenv` dependency lets you set environment variables in an untracked `.env` file.

## Architecture

The routines that perform scoring, digesting, and comparing are _procs_ and are located in the `procs` directory.

To score reports, Testilo needs to be told which reports to score and which scoring procedure (or _score proc_) to use.

Similarly, once reports have been scored, Testilo can digest them. For this purpose, Testilo needs to be told which scored reports to digest and which _digest proc_ to use.

Likewise, Testilo can compare scored reports. It needs to be told which reports to compare and which _comparison proc_ to use.

Testilo includes some score procs, digest procs, and comparison procs. You can add others.

## Execution

### Scoring

#### Process

To score Testaro reports, execute the statement `node score procID reportNameStart`. Replace (here and below) `procID` with the base of the name of the score proc. An environment variable named `REPORTDIR_RAW` defines a directory (i.e. a filesystem path, relative to the project directory of Testilo) where Testilo will look for the raw (i.e. not-yet-scored) reports. If you want Testilo to score all of the reports in that directory, you can omit the `reportNameStart` argument. If, instead, you want Testilo to score only the reports in that directory whose names begin with a certain string, replace `reportNameStart` with that string. So, for example, suppose the raw reports are in the `reports/raw` directory of a project, `testing`, that sits alongside of Testilo in your filesystem. Then you would assign the value `'../testing/reports/raw'` to the environment variable `REPORTDIR_RAW`. Now, to score all of the reports in that directory with score proc `sp11a`, execute `node score sp11a`. Or, to score only the reports in that directory whose filenames begin with `4rper`, execute  node score sp11a `4rper`.

This procedure has two preconditions:
- The score proc is compatible with the script (or _test proc_) that produced the report(s).
- You have defined environment variables `REPORTDIR_RAW` and (for the scored reports that Testilo will write) `REPORTDIR_SCORED`.

The scored report file has the same name as the original. The scored report has the same content as the original, plus new properties named `score` and `scoreProcID`.

#### Procedures

The score procs included with Testilo represent milestones in the refinement of a scoring methodology.

One development has been an expansion of the set of packages. The progression from score proc `sp09a` to `sp10a` included the addition of the Tenon package.

The main development has been a change from package-based to issue-based scoring. With package-based scoring, each package yielded a score, and the scores were summed into a total score. With issue-based scoring, the individual tests in each package are classified into groups, such that the tests from various packages in any particular group all seek to discover approximately the same type of accessibility issue. An artifact gets a score on each group, and the group scores are summed into a total score. The change from package-based to issue-based scoring took place in the progression from score proc `sp10a` to `sp10b`.

The problem of combining partly similar tests from different packages and producing an appropriate accessibility score has no perfect solution, and each successive score proc embodies efforts to make the result more appropriate.

#### Prevention

Testaro reports an error when it is unable to perform a test on a host. A score proc can take such errors into account. The score procs included with Testilo do that by estimating scores when a package cannot be run.

### Digesting

To make scored Testaro reports more useful for humans, Testilo can create digests of scored reports. A digest is an HTML document (a web page) summarizing and explaining the findings, with the scored report appended to it.

To make Testilo digest reports, execute the statement `node digest procID reportNameStart`. The rules for this statement are the same as for the `score` statement, except that the directory where Testilo finds the reports in the one referenced by the `REPORTDIR_SCORED` environment variable, and the directory where Testilo will write the digests is the one referenced by `REPORTDIR_DIGESTED`. In order to make the digests appear correct in a browser, you must copy the `reports/digested/style.css` file into the `REPORTDIR_DIGESTED` directory.

### Comparing

You can use Testilo to publish comparisons of accessibility scores. To do this, execute the statement `node compare abc xyz`, replacing `abc` with a filename base for the comparison and `xyz` with the name of a subdirectory of the `procs/compare` directory.

Testilo will examine all of the scored reports in the `REPORTDIR_SCORED` directory. The comparison proc in the `xyz` directory will construct a web page. Testilo will save the page in the `COMPARISONDIR` directory. The name of the file will be `abc.html`.

Comparison procs can design various pages on the basis of a set of scored reports. As an example, the `cp0` comparison proc creates a page that contains a table of scores, shown both numerically and with a bar graph. In the table, the first column contains descriptions of the pages (the `what` property of the hosts in the batch), such as “Wikipedia English”. Each such description is a link to the page on the web. The second column contains the scores of the pages. Each score is a link to the digest for its page. The link points to a digest located in a `digests` directory adjacent to the page itself. Thus, to use the `cp0` comparison proc, you would copy its output file to a web server, create a `digests` directory on the server as a sibling of that file, and copy the digest files into the `digests` directory.

This procedure has some preconditions:
- The comparison proc is compatible with the score proc that scored the report.
- Testilo can find the scored report files in the directory whose relative path (relative to the project directory of Testilo) is the value of the `REPORTDIR_SCORED` environment variable.
- Testilo can read in the `REPORTDIR_SCORED` directory.
- There is a `COMPARISONDIR` environment variable, whose value is the relative path of a directory that Testilo can write to.
- The `procs/compare` directory contains a subdirectory named `xyz`, which in turn contains files named `index.html` and `index.js`.
- You have copied the `reports/comparative/style.css` file into the `COMPARISONDIR` directory.
