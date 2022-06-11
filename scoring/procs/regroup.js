/*
  regroup
  Converts groups.json to testGroups.json.
*/
const fs = require('fs');
// Initialize the data.
const data = {
  tests: {},
  groups: {}
};
const compile = () => {
  // Add the groups to the data.
  const groupsJSON = fs.readFileSync(`${__dirname}/../data/groups.json`, 'utf8');
  const groups = JSON.parse(groupsJSON);
  data.groups = groups;
  // For each group:
  const groupIDs = Object.keys(groups);
  groupIDs.forEach(groupID => {
    // Add its tests to the data.
    const packageIDs = Object.keys(groups[groupID]);
    packageIDs.forEach(packageID => {
      const tests = groups[groupID][packageID];
      tests.forEach(test => {
        const testID = test.replace(/ .+/, '');
        const what = test.replace(/^[^ ]+ /, '');
        if (! data.tests[packageID]) {
          data.tests[packageID] = {};
        }
        data.tests[packageID][testID] = {
          groupID,
          what
        };
      });
    });
  });
  return data;
};
fs.writeFileSync(`${__dirname}/../data/testGroups.json`, JSON.stringify(compile(), null, 2));
console.log(`File testGroups.json created`);
