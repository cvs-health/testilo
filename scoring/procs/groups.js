/*
  groups
  Converts duplications.json to groups.json.
*/
const fs = require('fs');
// Initialize an array of groups.
const groups = [];
// Returns the group that an issue belongs to.
const getGroupIndex = (package, issueID) => {
  return groups.findIndex(group => group[package] && group[package].includes(issueID));
};
// Assign an issue to a group.
const addToGroup = (package, issue, index) => {
  if (groups[index][package]) {
    groups[index][package].push(issue);
  }
  else {
    groups[index][package] = [issue];
  }
};
const compile = () => {
  const dupsJSON = fs.readFileSync(`${__dirname}/../data/duplications.json`, 'utf8');
  const dups = JSON.parse(dupsJSON);
  // For each pair of packages:
  const packagePairs = Object.keys(dups);
  packagePairs.forEach(packagePair => {
    const packages = packagePair.split('_');
    // For each issue in the first package:
    Object.keys(dups[packagePair]).forEach(issueA => {
      const groupIndexA = getGroupIndex(packages[0], issueA);
      const issueB = Object.keys(dups[packagePair][issueA])[0];
      const groupIndexB = getGroupIndex(packages[1], issueB);
      // If both issues belong to groups and the groups differ:
      if (groupIndexA > -1 && groupIndexB > -1 && groupIndexB !== groupIndexA) {
        // Report the discrepancy.
        console.log(`Inspect ${packages[0]} ${issueA} and ${packages[1]} ${issueB}`);
      }
      // Otherwise, if only the first issue belongs to a group:
      else if (groupIndexA > -1 && groupIndexB === -1) {
        // Assign the second issue to that group.
        addToGroup(packages[1], issueB, groupIndexA);
      }
      // Otherwise, if only the second issue belongs to a group:
      else if (groupIndexA === -1 && groupIndexB > -1) {
        // Assign the first issue to that group.
        addToGroup(packages[0], issueA, groupIndexB);
      }
      // Otherwise, if neither issue belongs to a group:
      else if (groupIndexA === -1 && groupIndexB === -1) {
        // Create a group and add both issues to it.
        groups.push({
          [packages[0]]: [issueA],
          [packages[1]]: [issueB]
        });
      }
    });
  });
  return groups;
};
fs.writeFileSync(`${__dirname}/../data/groups.json`, JSON.stringify(compile(), null, 2));
console.log(`File groups.json, containing ${groups.length} groups, created`);