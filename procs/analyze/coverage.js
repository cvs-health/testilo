/*
  © 2024 CVS Health and/or one of its affiliates. All rights reserved.

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

/*
  coverage.js
  Checks coverage of Testaro tests in an issue classification.
*/

// Returns a tabulation of the instance counts of issues reported by tools in scored reports.
const coverage = ticID => {
  const evalRules = {
    allCaps: 'leaf elements with entirely upper-case text longer than 7 characters',
    allHidden: 'page that is entirely or mostly hidden',
    allSlanted: 'leaf elements with entirely italic or oblique text longer than 39 characters',
    autocomplete: 'name and email inputs without autocomplete attributes',
    bulk: 'large count of visible elements',
    buttonMenu: 'nonstandard keyboard navigation between items of button-controlled menus',
    captionLoc: 'caption elements that are not first children of table elements',
    distortion: 'distorted text',
    docType: 'document without a doctype property',
    dupAtt: 'elements with duplicate attributes',
    embAc: 'active elements embedded in links or buttons',
    filter: 'filter styles on elements',
    focAll: 'discrepancies between focusable and Tab-focused elements',
    focInd: 'missing and nonstandard focus indicators',
    focOp: 'Tab-focusable elements that are not operable',
    focVis: 'links that are invisible when focused',
    headEl: 'invalid elements within the head',
    headingAmb: 'same-level sibling headings with identical texts',
    hover: 'hover-caused content changes',
    hovInd: 'hover indication nonstandard',
    hr: 'hr element instead of styles used for vertical segmentation',
    labClash: 'labeling inconsistencies',
    legendLoc: 'legend elements that are not first children of fieldset elements',
    lineHeight: 'text with a line height less than 1.5 times its font size',
    linkExt: 'links that automatically open new windows',
    linkAmb: 'links with identical texts but different destinations',
    linkOldAtt: 'links with deprecated attributes',
    linkTitle: 'links with title attributes repeating text content',
    linkTo: 'links without destinations',
    linkUl: 'missing underlines on inline links',
    miniText: 'text smaller than 11 pixels',
    motion: 'motion without user request',
    nonTable: 'table elements used for layout',
    opFoc: 'Operable elements that are not Tab-focusable',
    optRoleSel: 'Non-option elements with option roles that have no aria-selected attributes',
    phOnly: 'input elements with placeholders but no accessible names',
    pseudoP: 'adjacent br elements suspected of nonsemantically simulating p elements',
    radioSet: 'radio buttons not grouped into standard field sets',
    role: 'invalid and native-replacing explicit roles',
    styleDiff: 'style inconsistencies',
    tabNav: 'nonstandard keyboard navigation between elements with the tab role',
    targetSize: 'buttons, inputs, and non-inline links smaller than 44 pixels wide and high',
    titledEl: 'title attributes on inappropriate elements',
    zIndex: 'non-default Z indexes'
  };
  const {issues} = require(`${__dirname}/../score/${ticID}`);
  const testaroRuleIDs = new Set();
  Object.values(issues).forEach(issue => {
    if (issue.tools && issue.tools.testaro) {
      Object.keys(issue.tools.testaro).forEach(ruleID => {
        testaroRuleIDs.add(ruleID);
      });
    }
  });
  Object.keys(evalRules).forEach(ruleID => {
    if (! testaroRuleIDs.has(ruleID)) {
      console.log(`${ticID} is missing ${ruleID}`);
    }
  });
};
coverage('tic35');
