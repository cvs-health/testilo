/*
  tempgroup
  Converts groups.json for inclusion in score procs.
*/
const fs = require('fs');
// Initialize the data.
const groupWeights = {
  accessKeyDuplicate: 3,
  activeEmbedding: 2,
  allCaps: 1,
  ariaReferenceBad: 4,
  autocompleteBad: 2,
  buttonNoText: 4,
  childMissing: 3,
  contrastAA: 3,
  contrastAAA: 1,
  duplicateID: 2,
  eventKeyboard: 3,
  fieldSetMissing: 2,
  focusableOperable: 3,
  focusIndication: 3,
  h1Missing: 1,
  headingEmpty: 2,
  headingStructure: 2,
  hoverSurprise: 1,
  iframeNoText: 3,
  imageInputNoText: 4,
  imageMapAreaNoText: 3,
  imageNoText: 4,
  imageTextRedundant: 1,
  inconsistentStyles: 1,
  contrastRisk: 1,
  labelClash: 2,
  labelForBadID: 4,
  languageChange: 2,
  leadingClipsText: 3,
  leadingFrozen: 3,
  linkForcesNewWindow: 2,
  linkNoText: 4,
  linkPair: 1,
  linkTextsSame: 2,
  linkTitleRedundant: 1,
  linkUnderlines: 2,
  menuNavigation: 2,
  metaBansZoom: 3,
  nameValue: 3,
  noLeading: 2,
  objectNoText: 2,
  pageLanguage: 3,
  pageLanguageBad: 3,
  pageTitle: 3,
  parentMissing: 3,
  pseudoHeadingRisk: 1,
  pseudoLinkRisk: 2,
  pseudoListRisk: 1,
  roleBad: 3,
  roleBadAttribute: 3,
  roleMissingAttribute: 3,
  selectFlatRisk: 1,
  selectNoText: 3,
  spontaneousMotion: 2,
  svgImageNoText: 4,
  tabFocusability: 3,
  tabNavigation: 2,
  targetSize: 2,
  textBeyondLandmarks: 1,
  visibleBulk: 1,
  zIndexNotZero: 1
};
const groups = {};
const compile = () => {
  const oldGroupsJSON = fs.readFileSync(`${__dirname}/../data/groups.json`, 'utf8');
  const oldGroups = JSON.parse(oldGroupsJSON);
  const groupIDs = Object.keys(oldGroups);
  groupIDs.forEach(groupID => {
    groups[groupID] = {
      weight: groupWeights[groupID] || 0,
      packages: {}
    };
    const packageIDs = Object.keys(oldGroups[groupID]);
    packageIDs.forEach(packageID => {
      groups[groupID].packages[packageID] = {};
      const testStrings = oldGroups[groupID][packageID];
      testStrings.forEach(testString => {
        const testID = testString.replace(/ .+/, '');
        const testWhat = testString.replace(/^[^ ]+ /, '');
        groups[groupID].packages[packageID][testID] = {
          weight: 0,
          what: testWhat
        };
      });
    });
  });
  console.log(JSON.stringify(groups, null, 2));
};
compile();
