/*
  sp11a
  Testilo score proc 11a
  Computes scores from Testaro script tp11 and adds them to a report.
  Usage example: node score 35k1r sp11a
*/

// ########## IMPORTS

// Module to read and write files.
const fs = require('fs/promises');

// CONSTANTS

const scoreProcID = 'sp11a';
// Define the configuration disclosures.
const logWeights = {
  logCount: 0.5,
  logSize: 0.01,
  errorLogCount: 1,
  errorLogSize: 0.02,
  prohibitedCount: 15,
  visitTimeoutCount: 10,
  visitRejectionCount: 10
};
const soloWeight = 1;
const countWeights = {
  absolute: 2,
  largest: 1,
  smaller: 0.4
};
const preventionWeights = {
  testaro: 50,
  other: 100
};
// Initialize the score details on test packages and test groups.
const packageDetails = {};
const groupDetails = {
  groups: {},
  solos: {}
};
// Initialize a score summary.
const summary = {
  total: 0,
  log: 0,
  preventions: 0,
  solos: 0,
  groups: {}
};
const otherPackages = ['aatt', 'alfa', 'axe', 'ibm', 'tenon', 'wave'];
const preventionScores = {};
// Define the test groups.
const groups = {
  duplicateID: {
    weight: 2,
    packages: {
      aatt: {
        'e:F77': {
          weight: 1,
          what: 'Duplicate id attribute value'
        }
      },
      alfa: {
        r3: {
          weight: 1,
          what: 'Element ID is not unique'
        }
      },
      axe: {
        'duplicate-id': {
          weight: 1,
          what: 'ID attribute value must be unique'
        }
      },
      ibm: {
        RPT_Elem_UniqueId: {
          weight: 1,
          what: 'Element id attribute values must be unique within a document'
        }
      }
    }
  },
  imageInputNoText: {
    weight: 4,
    packages: {
      aatt: {
        'e:H36': {
          weight: 1,
          what: 'Image submit button missing an alt attribute'
        }
      },
      alfa: {
        r28: {
          weight: 1,
          what: 'Image input element has no accessible name'
        }
      },
      axe: {
        'input-image-alt': {
          weight: 1,
          what: 'Image buttons must have alternate text'
        }
      },
      ibm: {
        'v:WCAG20_Input_ExplicitLabelImage': {
          weight: 1,
          what: 'Input element of type image should have a text alternative'
        }
      },
      wave: {
        'e:alt_input_missing': {
          weight: 1,
          what: 'Image button missing alternative text'
        }
      }
    }
  },
  imageNoText: {
    weight: 4,
    packages: {
      aatt: {
        'e:H37': {
          weight: 1,
          what: 'Img element missing an alt attribute'
        }
      },
      alfa: {
        r2: {
          weight: 1,
          what: 'Image has no accessible name'
        }
      },
      axe: {
        'image-alt': {
          weight: 1,
          what: 'Images must have alternate text'
        }
      },
      ibm: {
        'v:WCAG20_Img_HasAlt': {
          weight: 1,
          what: 'Images must have an alt attribute if they convey meaning, or alt="" if decorative'
        }
      },
      wave: {
        'e:alt_missing': {
          weight: 1,
          what: 'Missing alternative text'
        }
      }
    }
  },
  pageLanguage: {
    weight: 3,
    packages: {
      aatt: {
        'e:H57': {
          weight: 1,
          what: 'Lang attribute of the document element'
        }
      },
      alfa: {
        r4: {
          weight: 1,
          what: 'Lang attribute missing, empty, or only whitespace'
        }
      },
      axe: {
        'html-has-lang': {
          weight: 1,
          what: 'Html element must have a lang attribute'
        }
      },
      ibm: {
        WCAG20_Html_HasLang: {
          weight: 1,
          what: 'Page detected as HTML, but has no lang attribute'
        }
      },
      wave: {
        'e:language_missing': {
          weight: 1,
          what: 'Language missing or invalid'
        }
      }
    }
  },
  pageLanguageBad: {
    weight: 3,
    packages: {
      alfa: {
        r5: {
          weight: 1,
          what: 'Lang attribute has no valid primary language tag'
        }
      },
      axe: {
        'html-lang-valid': {
          weight: 1,
          what: 'Html element must have a valid value for the lang attribute'
        }
      },
      ibm: {
        'v:WCAG20_Elem_Lang_Valid': {
          weight: 1,
          what: 'Lang attribute does not include a valid primary language'
        }
      }
    }
  },
  languageChange: {
    weight: 2,
    packages: {
      aatt: {
        'e:H58': {
          weight: 1,
          what: 'Change in language is not marked'
        }
      },
      alfa: {
        r7: {
          weight: 1,
          what: 'Lang attribute has no valid primary language subtag'
        }
      },
      axe: {
        'valid-lang': {
          weight: 1,
          what: 'Lang attribute must have a valid value'
        }
      }
    }
  },
  headingStructure: {
    weight: 2,
    packages: {
      aatt: {
        'w:G141': {
          weight: 1,
          what: 'Heading structure is not logically nested'
        }
      },
      alfa: {
        r53: {
          weight: 1,
          what: 'Heading skips one or more levels'
        }
      },
      axe: {
        'heading-order': {
          weight: 1,
          what: 'Heading levels should only increase by one'
        }
      },
      tenon: {
        155: {
          weight: 1,
          what: 'These headings are not structured in a hierarchical manner'
        }
      },
      wave: {
        'a:heading_skipped': {
          weight: 1,
          what: 'Skipped heading level'
        }
      }
    }
  },
  objectNoText: {
    weight: 2,
    packages: {
      aatt: {
        'e:ARIA6+H53': {
          weight: 1,
          what: 'Object elements must contain a text alternative'
        }
      },
      axe: {
        'object-alt': {
          weight: 1,
          what: 'Object elements must have alternate text'
        }
      },
      ibm: {
        'v:WCAG20_Object_HasText': {
          weight: 1,
          what: 'Object elements must have a text alternative'
        }
      },
      wave: {
        'a:plugin': {
          weight: 1,
          what: 'An unidentified plugin is present'
        }
      }
    }
  },
  imageMapAreaNoText: {
    weight: 3,
    packages: {
      aatt: {
        'e:H24': {
          weight: 1,
          what: 'Area element in an image map missing an alt attribute'
        }
      },
      axe: {
        'area-alt': {
          weight: 1,
          what: 'Active area elements must have alternate text'
        }
      },
      ibm: {
        'v:HAAC_Img_UsemapAlt': {
          weight: 1,
          what: 'Image map or child area has no text alternative'
        },
        'v:WCAG20_Area_HasAlt': {
          weight: 1,
          what: 'Area element in an image map has no text alternative'
        }
      },
      wave: {
        'e:alt_area_missing': {
          weight: 1,
          what: 'Image map area missing alternative text'
        }
      }
    }
  },
  eventKeyboard: {
    weight: 3,
    packages: {
      aatt: {
        'w:G90': {
          weight: 1,
          what: 'Event handler functionality not available by keyboard'
        }
      },
      wave: {
        'a:event_handler': {
          weight: 1,
          what: 'Device-dependent event handler'
        }
      }
    }
  },
  labelForBadID: {
    weight: 4,
    packages: {
      aatt: {
        'w:H44': {
          weight: 1,
          what: 'Label for attribute is bad ID'
        }
      },
      wave: {
        'a:label_orphaned': {
          weight: 1,
          what: 'Orphaned form label'
        }
      }
    }
  },
  linkNoText: {
    weight: 4,
    packages: {
      alfa: {
        r11: {
          weight: 1,
          what: 'Link has no accessible name'
        }
      },
      axe: {
        'link-name': {
          weight: 1,
          what: 'Links must have discernible text'
        }
      },
      ibm: {
        'v:WCAG20_A_HasText': {
          weight: 1,
          what: 'Hyperlinks must have a text description'
        }
      },
      tenon: {
        57: {
          weight: 1,
          what: 'Link has no text inside it'
        }
      },
      wave: {
        'e:link_empty': {
          weight: 1,
          what: 'Link contains no text'
        }
      }
    }
  },
  linkTextsSame: {
    weight: 2,
    packages: {
      tenon: {
        98: {
          weight: 1,
          what: 'These links have the same text but different destinations'
        }
      }
    }
  },
  linkPair: {
    weight: 1,
    packages: {
      wave: {
        'a:link_redundant': {
          weight: 1,
          what: 'Adjacent links go to same URL'
        }
      }
    }
  },
  linkForcesNewWindow: {
    weight: 2,
    packages: {
      tenon: {
        218: {
          weight: 1,
          what: 'Link opens in a new window without user control'
        }
      }
    }
  },
  buttonNoText: {
    weight: 4,
    packages: {
      alfa: {
        r12: {
          weight: 1,
          what: 'Button has no accessible name'
        }
      },
      axe: {
        'aria-command-name': {
          weight: 1,
          what: 'ARIA commands must have an accessible name'
        }
      },
      wave: {
        'e:button_empty': {
          weight: 1,
          what: 'Button is empty or has no value text'
        }
      }
    }
  },
  parentMissing: {
    weight: 3,
    packages: {
      alfa: {
        r42: {
          weight: 1,
          what: 'Element is not owned by an element of its required context role'
        }
      },
      axe: {
        'aria-required-parent': {
          weight: 1,
          what: 'Certain ARIA roles must be contained by particular parents'
        }
      }
    }
  },
  svgImageNoText: {
    weight: 4,
    packages: {
      alfa: {
        r43: {
          weight: 1,
          what: 'SVG image element has no accessible name'
        }
      },
      axe: {
        'svg-img-alt': {
          weight: 1,
          what: 'SVG elements with an img role must have an alternative text'
        }
      }
    }
  },
  metaBansZoom: {
    weight: 3,
    packages: {
      alfa: {
        r47: {
          weight: 1,
          what: 'Meta element restricts zooming'
        }
      },
      axe: {
        'meta-viewport': {
          weight: 1,
          what: 'Zooming and scaling should not be disabled'
        }
      }
    }
  },
  childMissing: {
    weight: 3,
    packages: {
      alfa: {
        r68: {
          weight: 1,
          what: 'Element owns no elements as required by its semantic role'
        }
      },
      axe: {
        'aria-required-children': {
          weight: 1,
          what: 'Certain ARIA roles must contain particular children'
        }
      }
    }
  },
  leadingFrozen: {
    weight: 3,
    packages: {
      alfa: {
        r93: {
          weight: 1,
          what: 'Style attribute with !important prevents adjusting line height'
        }
      },
      axe: {
        'avoid-inline-spacing': {
          weight: 1,
          what: 'Inline text spacing must be adjustable with custom stylesheets'
        }
      }
    }
  },
  noLeading: {
    weight: 2,
    packages: {
      alfa: {
        r73: {
          weight: 1,
          what: 'Paragraphs of text have insufficient line height'
        }
      }
    }
  },
  leadingClipsText: {
    weight: 3,
    packages: {
      tenon: {
        144: {
          weight: 1,
          what: 'Line height insufficent to properly display computed font size'
        }
      }
    }
  },
  iframeNoText: {
    weight: 3,
    packages: {
      alfa: {
        r13: {
          weight: 1,
          what: 'Iframe has no accessible name'
        }
      },
      axe: {
        'frame-title': {
          weight: 1,
          what: 'Frames must have an accessible name'
        }
      },
      ibm: {
        'v:WCAG20_Frame_HasTitle': {
          weight: 1,
          what: 'Inline frames must have a unique, non-empty title attribute'
        }
      }
    }
  },
  roleBad: {
    weight: 3,
    packages: {
      axe: {
        'aria-allowed-role': {
          weight: 1,
          what: 'ARIA role should be appropriate for the element'
        }
      },
      ibm: {
        'v:aria_semantics_role': {
          weight: 1,
          what: 'ARIA roles must be valid for the element to which they are assigned'
        }
      },
      testaro: {
        role: {
          weight: 1,
          what: 'Nonexistent or implicit-overriding role'
        }
      }
    }
  },
  roleMissingAttribute: {
    weight: 3,
    packages: {
      axe: {
        'aria-required-attr': {
          weight: 1,
          what: 'Required ARIA attributes must be provided'
        }
      },
      ibm: {
        'v:Rpt_Aria_RequiredProperties': {
          weight: 1,
          what: 'ARIA role on an element must have required attributes'
        }
      }
    }
  },
  roleBadAttribute: {
    weight: 3,
    packages: {
      alfa: {
        r20: {
          weight: 1,
          what: 'Aria- attribute is not defined'
        }
      },
      axe: {
        'aria-valid-attr': {
          weight: 1,
          what: 'ARIA attributes must conform to valid names'
        }
      },
      ibm: {
        'v:Rpt_Aria_ValidProperty': {
          weight: 1,
          what: 'ARIA attributes must be valid for the role'
        }
      }
    }
  },
  autocompleteBad: {
    weight: 2,
    packages: {
      aatt: {
        'w:H98': {
          weight: 1,
          what: 'Autocomplete attribute wrong'
        }
      },
      alfa: {
        r10: {
          weight: 1,
          what: 'Autocomplete attribute has no valid value'
        }
      },
      axe: {
        'autocomplete-valid': {
          weight: 1,
          what: 'Autocomplete attribute must be used correctly'
        }
      },
      ibm: {
        'v:WCAG21_Input_Autocomplete': {
          weight: 1,
          what: 'Autocomplete attribute token(s) must be appropriate for the input form field'
        }
      }
    }
  },
  contrastAA: {
    weight: 3,
    packages: {
      alfa: {
        r69: {
          weight: 1,
          what: 'Text outside widget has subminimum contrast'
        }
      },
      axe: {
        'color-contrast': {
          weight: 1,
          what: 'Elements must have sufficient color contrast'
        }
      },
      ibm: {
        'v:IBMA_Color_Contrast_WCAG2AA': {
          weight: 1,
          what: 'Contrast ratio of text with background must meet WCAG 2.1 AA'
        }
      },
      wave: {
        'c:contrast': {
          weight: 1,
          what: 'Very low contrast'
        }
      }
    }
  },
  contrastAAA: {
    weight: 1,
    packages: {
      alfa: {
        r66: {
          weight: 1,
          what: 'Text contrast less than AAA requires'
        }
      },
      tenon: {
        95: {
          weight: 1,
          what: 'Element has insufficient color contrast (Level AAA)'
        }
      }
    }
  },
  contrastRisk: {
    weight: 1,
    packages: {
      aatt: {
        'w:F24': {
          weight: 1,
          what: 'Inline background color needs complementary foreground color'
        },
        'w:G18': {
          weight: 1,
          what: 'Contrast adequacy not determinable'
        }
      }
    }
  },
  headingEmpty: {
    weight: 2,
    packages: {
      axe: {
        'empty-heading': {
          weight: 1,
          what: 'Headings should not be empty'
        }
      },
      ibm: {
        'v:RPT_Header_HasContent': {
          weight: 1,
          what: 'Heading elements must provide descriptive text'
        }
      },
      wave: {
        'e:heading_empty': {
          weight: 1,
          what: 'Empty heading'
        }
      }
    }
  },
  imageTextRedundant: {
    weight: 1,
    packages: {
      axe: {
        'image-redundant-alt': {
          weight: 1,
          what: 'Text of buttons and links should not be repeated in the image alternative'
        }
      },
      ibm: {
        'v:WCAG20_Img_LinkTextNotRedundant': {
          weight: 1,
          what: 'Text alternative for image within link should not repeat link text or adjacent link text'
        }
      }
    }
  },
  linkTitleRedundant: {
    weight: 1,
    packages: {
      tenon: {
        79: {
          weight: 1,
          what: 'Link has a title attribute that is the same as the text inside the link'
        }
      }
    }
  },
  pageTitle: {
    weight: 3,
    packages: {
      axe: {
        'document-title': {
          weight: 1,
          what: 'Documents must contain a title element'
        }
      },
      wave: {
        'e:title_invalid': {
          weight: 1,
          what: 'Missing or uninformative page title'
        }
      }
    }
  },
  h1Missing: {
    weight: 1,
    packages: {
      axe: {
        'page-has-heading-one': {
          weight: 1,
          what: 'Page should contain a level-one heading'
        }
      },
      wave: {
        'a:h1_missing': {
          weight: 1,
          what: 'Missing first level heading'
        }
      }
    }
  },
  pseudoHeadingRisk: {
    weight: 1,
    packages: {
      aatt: {
        'w:H42': {
          weight: 1,
          what: 'Heading coding should be used if intended as a heading'
        }
      }
    }
  },
  pseudoLinkRisk: {
    weight: 2,
    packages: {
      tenon: {
        129: {
          weight: 1,
          what: 'CSS underline on text that is not a link'
        }
      }
    }
  },
  pseudoListRisk: {
    weight: 1,
    packages: {
      aatt: {
        'w:H48': {
          weight: 1,
          what: 'Navigation links should be coded as list'
        }
      }
    }
  },
  selectNoText: {
    weight: 3,
    packages: {
      aatt: {
        'w:H91': {
          weight: 1,
          what: 'Select element has no value available to an accessibility API'
        }
      },
      axe: {
        'select-name': {
          weight: 1,
          what: 'Select element must have an accessible name'
        }
      },
      wave: {
        'a:select_missing_label': {
          weight: 1,
          what: 'Select missing label'
        }
      }
    }
  },
  selectFlatRisk: {
    weight: 1,
    packages: {
      aatt: {
        'w:H85': {
          weight: 1,
          what: 'If selection list contains groups of related options, they should be grouped with optgroup'
        }
      }
    }
  },
  ariaReferenceBad: {
    weight: 4,
    packages: {
      ibm: {
        'v:Rpt_Aria_ValidIdRef': {
          weight: 1,
          what: 'ARIA property must reference non-empty unique id of visible element'
        }
      },
      wave: {
        'e:aria_reference_broken': {
          weight: 1,
          what: 'Broken ARIA reference'
        }
      }
    }
  },
  accessKeyDuplicate: {
    weight: 3,
    packages: {
      ibm: {
        'v:WCAG20_Elem_UniqueAccessKey': {
          weight: 1,
          what: 'Accesskey attribute values on each element must be unique for the page'
        }
      },
      wave: {
        'a:accesskey': {
          weight: 1,
          what: 'Accesskey'
        }
      }
    }
  },
  fieldSetMissing: {
    weight: 2,
    packages: {
      ibm: {
        'v:WCAG20_Input_RadioChkInFieldSet': {
          weight: 1,
          what: 'Input is in a different group than another with the name'
        }
      },
      testaro: {
        radioSet: {
          weight: 1,
          what: 'No or invalid grouping of radio buttons in fieldsets'
        }
      },
      wave: {
        'a:fieldset_missing': {
          weight: 1,
          what: 'Missing fieldset'
        }
      }
    }
  },
  nameValue: {
    weight: 3,
    packages: {
      aatt: {
        'e:F68': {
          weight: 1,
          what: 'Form control wrongly labeled or unlabeled'
        },
        'e:H91': {
          weight: 1,
          what: 'Missing name or value of form control or link'
        }
      },
      wave: {
        'e:label_missing': {
          weight: 1,
          what: 'Missing form label'
        }
      }
    }
  },
  targetSize: {
    weight: 2,
    packages: {
      tenon: {
        152: {
          weight: 1,
          what: 'Actionable element is smaller than the minimum required size'
        }
      }
    }
  },
  visibleBulk: {
    weight: 1,
    packages: {
      testaro: {
        bulk: {
          weight: 1,
          what: 'Count of visible elements as a multiple of 300'
        }
      }
    }
  },
  activeEmbedding: {
    weight: 2,
    packages: {
      testaro: {
        embAc: {
          weight: 1,
          what: 'Active elements embedded in links or buttons'
        }
      }
    }
  },
  tabFocusability: {
    weight: 3,
    packages: {
      testaro: {
        focAll: {
          weight: 1,
          what: 'Discrepancy between elements that should be and that are Tab-focusable'
        }
      }
    }
  },
  focusIndication: {
    weight: 3,
    packages: {
      alfa: {
        r65: {
          weight: 1,
          what: 'Element in sequential focus order has no visible focus'
        }
      },
      testaro: {
        focInd: {
          weight: 1,
          what: 'Focused element displaying no or nostandard focus indicator'
        }
      }
    }
  },
  allCaps: {
    weight: 1,
    packages: {
      tenon: {
        153: {
          weight: 1,
          what: 'Long string of text is in all caps'
        }
      }
    }
  },
  textBeyondLandmarks: {
    weight: 1,
    packages: {
      alfa: {
        r57: {
          weight: 1,
          what: 'Perceivable text content not included in any landmark'
        }
      }
    }
  },
  focusableOperable: {
    weight: 3,
    packages: {
      testaro: {
        focOp: {
          weight: 1,
          what: 'Operable elements that cannot be Tab-focused and vice versa'
        }
      }
    }
  },
  hoverSurprise: {
    weight: 1,
    packages: {
      testaro: {
        hover: {
          weight: 1,
          what: 'Content changes caused by hovering'
        }
      }
    }
  },
  labelClash: {
    weight: 2,
    packages: {
      testaro: {
        labClash: {
          weight: 1,
          what: 'Incompatible label types'
        }
      }
    }
  },
  linkUnderlines: {
    weight: 2,
    packages: {
      testaro: {
        linkUl: {
          weight: 1,
          what: 'Non-underlined inline links'
        }
      }
    }
  },
  menuNavigation: {
    weight: 2,
    packages: {
      testaro: {
        menuNav: {
          weight: 1,
          what: 'Nonstandard keyboard navigation among focusable menu items'
        }
      }
    }
  },
  tabNavigation: {
    weight: 2,
    packages: {
      testaro: {
        tabNav: {
          weight: 1,
          what: 'Nonstandard keyboard navigation among tabs'
        }
      }
    }
  },
  spontaneousMotion: {
    weight: 2,
    packages: {
      testaro: {
        motion: {
          weight: 1,
          what: 'Change of visible content not requested by user'
        }
      }
    }
  },
  inconsistentStyles: {
    weight: 1,
    packages: {
      testaro: {
        styleDiff: {
          weight: 1,
          what: 'Heading, link, and button style inconsistencies'
        }
      }
    }
  },
  zIndexNotZero: {
    weight: 1,
    packages: {
      testaro: {
        zIndex: {
          weight: 1,
          what: 'Layering with nondefault z-index values'
        }
      }
    }
  }
};

// FUNCTIONS

// Adds a score to the package details.
const addDetail = (actWhich, testID, addition = 1) => {
  if (!packageDetails[actWhich]) {
    packageDetails[actWhich] = {};
  }
  if (!packageDetails[actWhich][testID]) {
    packageDetails[actWhich][testID] = 0;
  }
  packageDetails[actWhich][testID] += addition;
};
// Scores a report.
exports.scorer = async report => {
  // If there are any acts in the report:
  const {acts} = report;
  if (Array.isArray(acts)) {
    // If any of them are test acts:
    const testActs = acts.filter(act => act.type === 'test');
    if (testActs.length) {
      // For each test act:
      testActs.forEach(test => {
        const {which} = test;
        // Add scores to the package details.
        if (which === 'aatt') {
          const issues = test.result && test.result.report;
          if (issues && Array.isArray(issues)) {
            issues.forEach(issue => {
              const {type, id} = issue;
              if (type && id) {
                const typedID = `${type[0]}:${id}`;
                // Add 4 per error, 1 per warning.
                addDetail(which, typedID, type === 'error' ? 4 : 1);
              }
            });
          }
        }
        else if (which === 'alfa') {
          const issues = test.result && test.result.items;
          if (issues && Array.isArray(issues)) {
            issues.forEach(issue => {
              const {verdict, rule} = issue;
              if (verdict && rule) {
                const {ruleID} = rule;
                if (ruleID) {
                  // Add 4 per failure, 1 per warning (“cantTell”).
                  addDetail(which, ruleID, verdict === 'failed' ? 4 : 1);
                }
              }
            });
          }
        }
        else if (which === 'axe') {
          const impactScores = {
            minor: 1,
            moderate: 2,
            serious: 3,
            critical: 4
          };
          const tests = test.result && test.result.details;
          if (tests) {
            const warnings = tests.incomplete;
            const {violations} = tests;
            [[warnings, 0.25], [violations, 1]].forEach(issueClass => {
              if (issueClass[0] && Array.isArray(issueClass[0])) {
                issueClass[0].forEach(issueType => {
                  const {id, nodes} = issueType;
                  if (id && nodes && Array.isArray(nodes)) {
                    nodes.forEach(node => {
                      const {impact} = node;
                      if (impact) {
                        // Add the impact score for a violation or 25% of it for a warning.
                        addDetail(which, id, issueClass[1] * impactScores[impact]);
                      }
                    });
                  }
                });
              }
            });
          }
        }
        else if (which === 'ibm') {
          const {result} = test;
          const {content, url} = result;
          if (content && url) {
            let preferredMode = 'content';
            if (
              content.error ||
              (content.totals &&
                content.totals.violation &&
                url.totals &&
                url.totals.violation &&
                url.totals.violation > content.totals.violation)
            ) {
              preferredMode = 'url';
            }
            const {items} = result[preferredMode];
            if (items && Array.isArray(items)) {
              items.forEach(issue => {
                const {ruleID, level} = issue;
                if (ruleID && level) {
                  // Add 4 per violation, 1 per warning (“recommendation”).
                  addDetail(which, ruleID, level === 'violation' ? 4 : 1);
                }
              });
            }
          }
        }
        else if (which === 'tenon') {
          const issues =
            test.result && test.result.data && test.result.data.resultSet;
          if (issues && Array.isArray(issues)) {
            issues.forEach(issue => {
              const {tID, priority, certainty} = issue;
              if (tID && priority && certainty) {
                // Add 4 per issue if certainty and priority 100, less if less.
                addDetail(which, tID, certainty * priority / 2500);
              }
            });
          }
        }
        else if (which === 'wave') {
          const classScores = {
            error: 4,
            contrast: 3,
            alert: 1
          };
          const issueClasses = test.result && test.result.categories;
          if (issueClasses) {
            ['error', 'contrast', 'alert'].forEach(issueClass => {
              const {items} = issueClasses[issueClass];
              if (items) {
                const testIDs = Object.keys(items);
                if (testIDs.length) {
                  testIDs.forEach(testID => {
                    const {count} = items[testID];
                    if (count) {
                      addDetail(
                        which, `${issueClass[0]}:${testID}`, count * classScores[issueClass]
                      );
                    }
                  });
                }
              }
            });
          }
        }
        else if (which === 'bulk') {
          const count = test.result && test.result.visibleElements;
          if (typeof count === 'number') {
            // Add 1 per 300 visible elements beyond 300.
            addDetail('testaro', which, Math.max(0, count / 300 - 1));
          }
        }
        else if (which === 'embAc') {
          const issueCounts = test.result && test.result.totals;
          if (issueCounts) {
            const counts = Object.values(issueCounts);
            const total = counts.reduce((sum, current) => sum + current);
            // Add 3 per embedded element.
            addDetail('testaro', which, 3 * total);
          }
        }
        else if (which === 'focAll') {
          const discrepancy = test.result && test.result.discrepancy;
          if (discrepancy) {
            addDetail('testaro', which, 2 * Math.abs(discrepancy));
          }
        }
        else if (which === 'focInd') {
          const issueTypes =
            test.result && test.result.totals && test.result.totals.types;
          if (issueTypes) {
            const missingCount = issueTypes.indicatorMissing
            && issueTypes.indicatorMissing.total
            || 0;
            const badCount = issueTypes.nonOutlinePresent
            && issueTypes.nonOutlinePresent.total
            || 0;
            // Add 3 per missing, 1 per non-outline focus indicator.
            addDetail('testaro', which, badCount + 3 * missingCount);
          }
        }
        else if (which === 'focOp') {
          const issueTypes =
            test.result && test.result.totals && test.result.totals.types;
          if (issueTypes) {
            const noOpCount = issueTypes.onlyFocusable && issueTypes.onlyFocusable.total || 0;
            const noFocCount = issueTypes.onlyOperable && issueTypes.onlyOperable.total || 0;
            // Add 3 per unfocusable, 1 per inoperable element.
            addDetail('testaro', which, 3 * noFocCount + noOpCount);
          }
        }
        else if (which === 'hover') {
          const issues = test.result && test.result.totals;
          if (issues) {
            const {
              impactTriggers,
              additions,
              removals,
              opacityChanges,
              opacityImpact,
              unhoverables
            } = issues;
            // Add score with weights on hover-impact types.
            const score = 2 * impactTriggers
            + 0.5 * additions
            + removals
            + 0.3 * opacityChanges
            + 0.2 * opacityImpact
            + unhoverables;
            if (faultCount) {
              addDetail('testaro', which, score);
            }
          }
        }
        else if (which === 'labClash') {
          const mislabeledCount = test.result
          && test.result.totals
          && test.result.totals.mislabeled
          || 0;
          // Add 1 per element with conflicting labels (ignoring unlabeled elements).
          addDetail('testaro', which, mislabeledCount);
        }
        else if (which === 'linkUl') {
          const totals = test.result && test.result.totals && test.result.totals.adjacent;
          if (totals) {
            const nonUl = totals.total - totals.underlined || 0;
            // Add 2 per non-underlined adjacent link.
            addDetail('testaro', which, 2 * nonUl);
          }
        }
        else if (which === 'menuNav') {
          const issueCount = test.result
          && test.result.totals
          && test.result.totals.navigations
          && test.result.totals.navigations.all
          && test.result.totals.navigations.all.incorrect
          || 0;
          // Add 2 per defect.
          addDetail('testaro', which, 2 * issueCount);
        }
        else if (which === 'motion') {
          const data = test.result;
          if (data) {
            const {
              meanLocalRatio,
              maxLocalRatio,
              globalRatio,
              meanPixelChange,
              maxPixelChange,
              changeFrequency
            } = data;
            const score = 2 * (meanLocalRatio - 1)
            + (maxLocalRatio - 1)
            + globalRatio - 1
            + meanPixelChange / 10000
            + maxPixelChange / 25000
            + 3 * changeFrequency
            || 0;
            addDetail('testaro', which, score);
          }
        }
        else if (which === 'radioSet') {
          const totals = test.result && test.result.totals;
          const {total, inSet} = totals;
          const score = total - inset || 0;
          // Add 1 per misgrouped radio button.
          addDetail('testaro', which, score);
        }
        else if (which === 'role') {
          const issueCount = test.result && test.result.badRoleElements || 0;
          // Add 1 per misassigned role.
          addDetail('testaro', which, issueCount);
        }
        else if (which === 'styleDiff') {
          const totals = test.result && test.result.totals;
          if (totals) {
            let score = 0;
            // For each element type that has any style diversity:
            Object.values(totals).forEach(typeData => {
              const {total, subtotals} = typeData;
              if (subtotals) {
                const styleCount = subtotals.length;
                const plurality = subtotals[0];
                const minorities = total - plurality;
                // Add 1 per style, 0.2 per element with any nonplurality style.
                score += styleCount + 0.2 * minorities;
              }
            });
            addDetail('testaro', which, score);
          }
        }
        else if (which === 'tabNav') {
          const issueCount = test.result
          && test.result.totals
          && test.result.totals.navigations
          && test.result.totals.navigations.all
          && test.result.totals.navigations.all.incorrect
          || 0;
          // Add 2 per defect.
          addDetail('testaro', which, 2 * issueCount);
        }
        else if (which === 'zIndex') {
          const issueCount = test.result && test.result.totals && test.result.totals.total || 0;
          // Add 1 per non-auto zIndex.
          addDetail('testaro', which, issueCount);
        }
      });
      // Get the prevention scores and add them to the summary.
      const actsPrevented = testActs.filter(test => test.result.prevented);
      actsPrevented.forEach(act => {
        if (otherPackages.includes(act.which)) {
          preventionScores[act.which] = preventionWeights.other;
        }
        else {
          preventionScores[`testaro-${act.which}`] = preventionWeights.testaro;
        }
      });
      const preventionScore = Object.values(preventionScores).reduce(
        (sum, current) => sum + current,
        0
      );
      summary.preventions = preventionScore;
      summary.total += preventionScore;
      // Reorganize the group data.
      const testGroups = {
        testaro: {},
        aatt: {},
        alfa: {},
        axe: {},
        ibm: {},
        tenon: {},
        wave: {}
      };
      Object.keys(groups).forEach(groupName => {
        Object.keys(groups[groupName].packages).forEach(packageName => {
          Object.keys(groups[groupName].packages[packageName]).forEach(testID => {
            testGroups[packageName][testID] = groupName;
          });
        });
      });
      // Populate the group details.
      Object.keys(packageDetails).forEach(packageName => {
        Object.keys(packageDetails[packageName]).forEach(testID => {
          const groupName = testGroups[packageName][testID];
          if (! groupDetails.groups[groupName]) {
            groupDetails.groups[groupName] = {};
          }
          if (! groupDetails.groups[groupName][packageName]) {
            groupDetails.groups[groupName][packageName] = {};
          }
          groupDetails.groups[groupName][packageName][testID] = packageDetails[packageName][testID];
        });
      });
      const groupPackageIDs = Object.keys(tests);
      groupPackageIDs.forEach(packageID => {
        const packageTestIDs = Object.keys(tests[packageID]);
        packageTestIDs.forEach(testID => {
          const testData = tests[packageID][testID];
          const {groupID, what} = testData;
          if (!groupDetails.groups[groupID]) {
            groupDetails.groups[groupID] = {};
          }
          if (!groupDetails.groups[groupID][packageID]) {
            groupDetails.groups[groupID][packageID] = {};
          }
          groupDetails.groups[testData.groupID][packageID][testID] = {
            what,
            issueCount: 0
          };
        });
      });
      // Get the IDs of the packages whose tests report any issues.
      const issuePackageIDs = Object.keys(packageDetails);
      // For each such package:
      issuePackageIDs.forEach(packageID => {
        // Get the IDs of the tests in the package that report issues.
        const issueTestIDs = Object.keys(packageDetails[packageID]);
        // For each such test:
        issueTestIDs.forEach(testID => {
          // Get its group data, if any.
          const testGroupData = tests[packageID][testID];
          const issueCount = packageDetails[packageID][testID];
          // If it is in a group:
          if (testGroupData) {
            // Add the issue count to the group details.
            const {groupID} = testGroupData;
            groupDetails.groups[groupID][packageID][testID].issueCount =
              issueCount;
          }
          // Otherwise, i.e. if the test is solo:
          else {
            // Add the issue count to the solo details.
            if (!groupDetails.solos[packageID]) {
              groupDetails.solos[packageID] = {};
            }
            groupDetails.solos[packageID][testID] = issueCount;
          }
        });
      });
      // Delete from the group details groups without any issues.
      const groupIDs = Object.keys(groupDetails.groups);
      groupIDs.forEach(groupID => {
        const groupPackageData = Object.values(groupDetails.groups[groupID]);
        if (
          groupPackageData.every(datum =>
            Object.values(datum).every(test => test.issueCount === 0)
          )
        ) {
          delete groupDetails.groups[groupID];
        }
      });
      // Get the group scores and add them to the summary.
      const issueGroupIDs = Object.keys(groupDetails.groups);
      const {absolute, largest, smaller} = countWeights;
      issueGroupIDs.forEach(groupID => {
        const issueCounts = [];
        const groupPackageData = Object.values(groupDetails.groups[groupID]);
        groupPackageData.forEach(packageDatum => {
          const issueCountSum = Object.values(packageDatum).reduce(
            (sum, current) => sum + current.issueCount,
            0
          );
          issueCounts.push(issueCountSum);
        });
        issueCounts.sort((a, b) => b - a);
        const groupScore =
          groupWeights[groupID] *
          (absolute +
            largest * issueCounts[0] +
            smaller *
              issueCounts.slice(1).reduce((sum, current) => sum + current, 0));
        const roundedScore = Math.round(groupScore);
        summary.groups[groupID] = roundedScore;
        summary.total += roundedScore;
      });
      // Get the solo scores and add them to the summary.
      const issueSoloPackageIDs = Object.keys(groupDetails.solos);
      issueSoloPackageIDs.forEach(packageID => {
        const testIDs = Object.keys(groupDetails.solos[packageID]);
        testIDs.forEach(testID => {
          const issueCount = groupDetails.solos[packageID][testID];
          const issueScore = Math.round(soloWeight * issueCount);
          summary.solos += issueScore;
          summary.total += issueScore;
        });
      });
    }
  }
  // Get the log score.
  logScore = Math.floor(
    logWeights.count * report.logCount +
      logWeights.size * report.logSize +
      logWeights.prohibited * report.prohibitedCount +
      logWeights.visitTimeout * report.visitTimeoutCount +
      logWeights.visitRejection * report.visitRejectionCount
  );
  summary.log = logScore;
  summary.total += logScore;
  // Add the score facts to the report.
  report.score = {
    scoreProcID,
    logWeights,
    groupWeights,
    soloWeight,
    countWeights,
    preventionWeights,
    packageDetails,
    groupDetails,
    preventionScores,
    summary
  };
};
