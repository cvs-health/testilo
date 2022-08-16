/*
  sp15b
  Testilo score proc 15b

  Computes scores from Testaro script tp15 and adds them to a report.
  Usage examples:
    node score sp15b 35k1r
    node score sp15b

  This proc applies specified weights to the component scores before summing them. An issue reported
  by a test is given a score. That score is determined by:
    Whether the issue is reported as an error or a warning.
    How important the issue is, if the test package is pre-weighted (axe, tenon, and testaro)
    Whether the test belongs to a group or is a solo test.
    How heavily the group is weighted, if the test package is not pre-weighted and the test belongs
      to a group

  The scores of solo tests are added together, multiplied by the soloWeight multiplier, and
    contributed to the total score.

  The scores of grouped tests are aggregated into a group score before being contributed to the
    total score. The group score is the sum of (1) an absolute score, assigned because the group has
    at least one test with a non-zero score, (2) the largest score among the tests of the group
    multiplied by a multiplier, and (3) the sum of the scores from the other tests of the group
    multiplied by a smaller multiplier. These three amounts are given by the groupWeights object.

  Browser logging and navigation statistics produce a log score, and the prevention of tests
  produces a prevention score. They, too, are added to the total score.

  Each grouped test has a quality property, typically set to 1. The value of this property can be
  modified when the test is found to be higher or lower in quality than usual.
*/

// CONSTANTS

// ID of this proc.
const scoreProcID = 'sp15b';
// Configuration disclosures.
const logWeights = {
  logCount: 0.5,
  logSize: 0.01,
  errorLogCount: 1,
  errorLogSize: 0.02,
  prohibitedCount: 15,
  visitTimeoutCount: 10,
  visitRejectionCount: 10,
  visitLatency: 1
};
// Normal latency (1 second per visit).
const normalLatency = 13;
// How much each solo issue adds to the score.
const soloWeight = 2;
// How much classified issues add to the score.
const groupWeights = {
  // Added per issue group.
  absolute: 2,
  // Added per issue reported by the package with the largest count in the group.
  largest: 1,
  // Added per issue in the group reported by each other package.
  smaller: 0.4
};
// How much each prevention adds to the score.
const preventionWeights = {
  testaro: 50,
  other: 100
};
// Non-preweighted and preweighted packages.
const otherPackages = ['alfa', 'axe', 'continuum', 'htmlcs', 'ibm', 'nuVal', 'tenon', 'wave'];
const preWeightedPackages = ['axe', 'tenon', 'testaro'];
// Test groups.
const groups = {
  ignorable: {
    weight: 0,
    packages: {
      nuVal: {
        'Element mediaelementwrapper not allowed as child of element div in this context. (Suppressing further errors from this subtree.)': {
          variable: false,
          quality: 0,
          what: 'Bug in nuVal'
        }
      }
    }
  },
  duplicateID: {
    weight: 3,
    packages: {
      alfa: {
        r3: {
          variable: false,
          quality: 1,
          what: 'Element id attribute value is not unique'
        }
      },
      axe: {
        'duplicate-id': {
          variable: false,
          quality: 1,
          what: 'id attribute value is not unique'
        },
        'duplicate-id-active': {
          variable: false,
          quality: 1,
          what: 'id attribute value of the active element is not unique'
        },
        'duplicate-id-aria': {
          variable: false,
          quality: 1,
          what: 'id attribute used in ARIA or in a label has a value that is not unique'
        }
      },
      continuum: {
        94: {
          variable: false,
          quality: 1,
          what: 'Elements contains an id attribute set to a value that is not unique in the DOM'
        }
      },
      htmlcs: {
        'e:AA.4_1_1.F77': {
          variable: false,
          quality: 1,
          what: 'Duplicate id attribute value'
        }
      },
      ibm: {
        RPT_Elem_UniqueId: {
          variable: false,
          quality: 1,
          what: 'Element id attribute value is not unique within the document'
        }
      },
      nuVal: {
        '^Duplicate ID .+$|^The first occurrence of ID .* was here.*$': {
          variable: true,
          quality: 1,
          what: 'Duplicate id'
        }
      }
    }
  },
  componentNoText: {
    weight: 4,
    packages: {
      ibm: {
        Rpt_Aria_WidgetLabels_Implicit: {
          variable: false,
          quality: 1,
          what: 'Interactive component has no programmatically associated name'
        }
      }
    }
  },
  regionNoText: {
    weight: 4,
    packages: {
      alfa: {
        r40: {
          variable: false,
          quality: 1,
          what: 'Region has no accessible name'
        }
      },
      continuum: {
        1010: {
          variable: false,
          quality: 1,
          what: 'Element with a region role has no mechanism that allows an accessible name to be calculated'
        }
      },
      ibm: {
        Rpt_Aria_RegionLabel_Implicit: {
          variable: false,
          quality: 1,
          what: 'Element with a region role has no label that describes its purpose'
        }
      }
    }
  },
  formFieldNoText: {
    weight: 4,
    packages: {
      alfa: {
        r8: {
          variable: false,
          quality: 1,
          what: 'Form field has no accessible name'
        }
      }
    }
  },
  inputNoText: {
    weight: 4,
    packages: {
      axe: {
        'aria-input-field-name': {
          variable: false,
          quality: 1,
          what: 'ARIA input field has no accessible name'
        },
        'aria-toggle-field-name': {
          variable: false,
          quality: 1,
          what: 'Toggle field has no accessible name'
        }
      },
      continuum: {
        118: {
          variable: false,
          quality: 1,
          what: 'Text input element has no mechanism that allows an accessible name to be calculated'
        },
        370: {
          variable: false,
          quality: 1,
          what: 'Search input element has no mechanism that allows an accessible name to be calculated'
        },
        507: {
          variable: false,
          quality: 1,
          what: 'element with a radio role has no mechanism that allows an accessible name to be calculated'
        },
        509: {
          variable: false,
          quality: 1,
          what: 'element with a textbox role has no mechanism that allows an accessible name to be calculated'
        },
        510: {
          variable: false,
          quality: 1,
          what: 'element with a combobox role has no mechanism that allows an accessible name to be calculated'
        }
      },
      htmlcs: {
        'e:AA.4_1_2.H91.InputText.Name': {
          variable: false,
          quality: 1,
          what: 'Text input has no accessible name'
        },
        'e:AA.4_1_2.H91.InputEmail.Name': {
          variable: false,
          quality: 1,
          what: 'Email input has no accessible name'
        },
        'e:AA.4_1_2.H91.InputFile.Name': {
          variable: false,
          quality: 1,
          what: 'File input element has no accessible name'
        },
        'e:AA.4_1_2.H91.InputTel.Name': {
          variable: false,
          quality: 1,
          what: 'Telephone input has no accessible name'
        },
        'e:AA.4_1_2.H91.InputNumber.Name': {
          variable: false,
          quality: 1,
          what: 'Number input has no accessible name'
        },
        'e:AA.4_1_2.H91.InputPassword.Name': {
          variable: false,
          quality: 1,
          what: 'Password input has no accessible name'
        },
        'e:AA.4_1_2.H91.InputSearch.Name': {
          variable: false,
          quality: 1,
          what: 'Search input has no accessible name'
        },
        'e:AA.4_1_2.H91.InputCheckbox.Name': {
          variable: false,
          quality: 1,
          what: 'Checkbox input has no accessible name'
        },
        'e:AA.4_1_2.H91.InputRadio.Name': {
          variable: false,
          quality: 1,
          what: 'Radio input has no accessible name'
        }
      }
    }
  },
  inputOnlyPlaceholder: {
    weight: 3,
    packages: {
      continuum: {
        863: {
          variable: false,
          quality: 1,
          what: 'input has an accessible name that depends on a placeholder'
        }
      }
    }
  },
  imageInputNoText: {
    weight: 4,
    packages: {
      alfa: {
        r28: {
          variable: false,
          quality: 1,
          what: 'Image input element has no accessible name'
        }
      },
      axe: {
        'input-image-alt': {
          variable: false,
          quality: 1,
          what: 'Image button has no text alternative'
        }
      },
      htmlcs: {
        'e:H36': {
          variable: false,
          quality: 1,
          what: 'Image submit button has no alt attribute'
        }
      },
      ibm: {
        WCAG20_Input_ExplicitLabelImage: {
          variable: false,
          quality: 1,
          what: 'Input element of type image has no text alternative'
        }
      },
      wave: {
        'e:alt_input_missing': {
          variable: false,
          quality: 1,
          what: 'Image button has no alternative text'
        }
      }
    }
  },
  figureNoText: {
    weight: 4,
    packages: {
      ibm: {
        HAAC_Figure_label: {
          variable: false,
          quality: 1,
          what: 'figure element has no associated label'
        }
      }
    }
  },
  imageNoText: {
    weight: 4,
    packages: {
      alfa: {
        r2: {
          variable: false,
          quality: 1,
          what: 'Image has no accessible name'
        }
      },
      axe: {
        'image-alt': {
          variable: false,
          quality: 1,
          what: 'Image has no text alternative'
        },
        'role-img-alt': {
          variable: false,
          quality: 1,
          what: 'Element with role img has no text alternative'
        }
      },
      continuum: {
        87: {
          variable: false,
          quality: 1,
          what: 'element with an image, graphics-symbol, or graphics-document role has no mechanism to calculate an accessible name'
        },
        89: {
          variable: false,
          quality: 1,
          what: 'img element has no mechanism that allows an accessible name to be calculated'
        }
      },
      htmlcs: {
        'e:AA.1_1_1.H37': {
          variable: false,
          quality: 1,
          what: 'img element has no alt attribute'
        }
      },
      ibm: {
        HAAC_Aria_ImgAlt: {
          variable: false,
          quality: 1,
          what: 'Element with an img role has no non-empty label'
        },
        WCAG20_Img_HasAlt: {
          variable: false,
          quality: 1,
          what: 'Image has no alt attribute conveying its meaning, or alt="" if decorative'
        }
      },
      nuVal: {
        'An img element must have an alt attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.': {
          variable: false,
          quality: 1,
          what: 'img element has no alt attribute'
        }
      },
      wave: {
        'e:alt_missing': {
          variable: false,
          quality: 1,
          what: 'Text alternative is missing'
        },
        'e:alt_spacer_missing': {
          variable: false,
          quality: 1,
          what: 'Spacer image has no text alternative'
        }
      }
    }
  },
  decorativeImageAltBad: {
    weight: 4,
    packages: {
      ibm: {
        WCAG20_Img_PresentationImgHasNonNullAlt: {
          variable: false,
          quality: 1,
          what: 'Image designated as decorative has no alt=""'
        }
      }
    }
  },
  imageTextBad: {
    weight: 3,
    packages: {
      alfa: {
        r39: {
          variable: false,
          quality: 1,
          what: 'Image text alternative is the filename instead'
        }
      }
    }
  },
  imageNoSource: {
    weight: 4,
    packages: {
      nuVal: {
        'Element img is missing required attribute src.': {
          variable: false,
          quality: 1,
          what: 'img element has no src attribute'
        }
      }
    }
  },
  sourceEmpty: {
    weight: 4,
    packages: {
      nuVal: {
        '^Bad value  for attribute src on element .+: Must be non-empty.*$': {
          variable: true,
          quality: 1,
          what: 'src attribute is empty'
        }
      }
    }
  },
  backgroundBad: {
    weight: 4,
    packages: {
      nuVal: {
        '^CSS: background: .+ is not a color value.*$': {
          variable: true,
          quality: 1,
          what: 'CSS background color is misdefined'
        }
      }
    }
  },
  backgroundImageBad: {
    weight: 4,
    packages: {
      nuVal: {
        '^CSS: background-image: .+ is not a background-image value.*$': {
          variable: true,
          quality: 1,
          what: 'CSS background image is misdefined'
        }
      }
    }
  },
  inputAlt: {
    weight: 4,
    packages: {
      continuum: {
        15: {
          variable: false,
          quality: 1,
          what: 'input element has an alt attribute'
        }
      }
    }
  },
  imagesSameAlt: {
    weight: 1,
    packages: {
      wave: {
        'a:alt_duplicate': {
          variable: false,
          quality: 1,
          what: 'Two images near each other have the same text alternative'
        }
      }
    }
  },
  imageTextLong: {
    weight: 2,
    packages: {
      wave: {
        'a:alt_long': {
          variable: false,
          quality: 1,
          what: 'Long text alternative'
        }
      }
    }
  },
  imageTextRisk: {
    weight: 1,
    packages: {
      continuum: {
        234: {
          variable: false,
          quality: 1,
          what: 'img element has a suspicious calculated accessible name value'
        },
      },
      wave: {
        'a:alt_suspicious': {
          variable: false,
          quality: 1,
          what: 'Image text alternative is suspicious'
        }
      }
    }
  },
  decorativeImageRisk: {
    weight: 1,
    packages: {
      htmlcs: {
        'w:AA.1_1_1.H67.2': {
          variable: false,
          quality: 1,
          what: 'Image marked as decorative may be informative'
        }
      }
    }
  },
  decorativeElementExposed: {
    weight: 2,
    packages: {
      alfa: {
        r67: {
          variable: false,
          quality: 1,
          what: 'Image marked as decorative is in the accessibility tree or has no none/presentation role'
        },
        r86: {
          variable: false,
          quality: 1,
          what: 'Element marked as decorative is in the accessibility tree or has no none/presentation role'
        }
      },
      nuVal: {
        'An img element which has an alt attribute whose value is the empty string must not have a role attribute.': {
          variable: false,
          quality: 1,
          what: 'img element with alt="" has a role attribute'
        }
      }
    }
  },
  pageLanguage: {
    weight: 4,
    packages: {
      alfa: {
        r4: {
          variable: false,
          quality: 1,
          what: 'Lang attribute missing, empty, or only whitespace'
        }
      },
      axe: {
        'html-has-lang': {
          variable: false,
          quality: 1,
          what: 'html element has no lang attribute'
        }
      },
      continuum: {
        101: {
          variable: false,
          quality: 1,
          what: 'root html element has no lang attribute'
        }
      },
      htmlcs: {
        'e:AA.3_1_1.H57.2': {
          variable: false,
          quality: 1,
          what: 'html element has no lang or xml:lang attribute'
        }
      },
      ibm: {
        WCAG20_Html_HasLang: {
          variable: false,
          quality: 1,
          what: 'Page detected as HTML, but has no lang attribute'
        }
      },
      nuVal: {
        'Consider adding a lang attribute to the html start tag to declare the language of this document.': {
          variable: false,
          quality: 1,
          what: 'html start tag has no lang attribute to declare the language of the page'
        },
        '^This document appears to be written in .+ Consider adding lang=.+ to the html start tag.*$': {
          variable: true,
          quality: 1,
          what: 'html start tag has no lang attribute to declare the language of the page'
        }
      },
      wave: {
        'e:language_missing': {
          variable: false,
          quality: 1,
          what: 'Language missing or invalid'
        }
      }
    }
  },
  pageLanguageBad: {
    weight: 4,
    packages: {
      alfa: {
        r5: {
          variable: false,
          quality: 1,
          what: 'lang attribute has no valid primary language tag'
        }
      },
      axe: {
        'html-lang-valid': {
          variable: false,
          quality: 1,
          what: 'html element has no valid value for the lang attribute'
        }
      },
      htmlcs: {
        'e:AA.3_1_1.H57.3.Lang': {
          variable: false,
          quality: 1,
          what: 'Language specified in the lang attribute of the document does not appear to be well-formed'
        }
      },
      ibm: {
        WCAG20_Elem_Lang_Valid: {
          variable: false,
          quality: 1,
          what: 'lang attribute does not include a valid primary language'
        }
      }
    }
  },
  elementLanguageBad: {
    weight: 4,
    packages: {
      htmlcs: {
        'e:AA.3_1_2.H58.1.Lang': {
          variable: false,
          quality: 1,
          what: 'Language specified in the lang attribute of the element does not appear to be well-formed'
        }
      },
      nuVal: {
        'When the attribute xml:lang in no namespace is specified, the element must also have the attribute lang present with the same value.': {
          variable: false,
          quality: 1,
          what: 'Element has no lang attrbute matching its xml:lang attribute'
        }
      }
    }
  },
  languageChange: {
    weight: 3,
    packages: {
      alfa: {
        r7: {
          variable: false,
          quality: 1,
          what: 'lang attribute has no valid primary language subtag'
        }
      },
      axe: {
        'valid-lang': {
          variable: false,
          quality: 1,
          what: 'lang attribute has no valid value'
        }
      },
      htmlcs: {
        'e:WCAG2AAA.Principle3.Guideline3_1.3_1_2.H58': {
          variable: false,
          quality: 1,
          what: 'Change in language is not marked'
        }
      }
    }
  },
  dialogNoText: {
    weight: 4,
    packages: {
      axe: {
        'aria-dialog-name': {
          variable: false,
          quality: 1,
          what: 'ARIA dialog or alertdialog node has no accessible name'
        }
      },
      continuum: {
        736: {
          variable: false,
          quality: 1,
          what: 'Element with a dialog role has no mechanism that allows an accessible name to be calculated'
        }
      }
    }
  },
  applicationNoText: {
    weight: 4,
    packages: {
      ibm: {
        Rpt_Aria_ApplicationLandmarkLabel: {
          variable: false,
          quality: 1,
          what: 'Element with an application role has no purpose label'
        }
      }
    }
  },
  objectNoText: {
    weight: 4,
    packages: {
      alfa: {
        r63: {
          variable: false,
          quality: 1,
          what: 'Object element has no accessible name'
        }
      },
      axe: {
        'object-alt': {
          variable: false,
          quality: 1,
          what: 'Object element has no text alternative'
        }
      },
      continuum: {
        249: {
          variable: false,
          quality: 1,
          what: 'object element has no mechanism that allows an accessible name to be calculated'
        }
      },
      htmlcs: {
        'e:ARIA6+H53': {
          variable: false,
          quality: 1,
          what: 'Object element contains no text alternative'
        }
      },
      ibm: {
        WCAG20_Object_HasText: {
          variable: false,
          quality: 1,
          what: 'Object element has no text alternative'
        }
      },
      wave: {
        'a:plugin': {
          variable: false,
          quality: 1,
          what: 'An unidentified plugin is present'
        }
      }
    }
  },
  videoNoText: {
    weight: 4,
    packages: {
      continuum: {
        252: {
          variable: false,
          quality: 1,
          what: 'video element has no mechanism that allows an accessible name to be calculated'
        }
      }
    }
  },
  imageMapNoText: {
    weight: 4,
    packages: {
      wave: {
        'e:alt_map_missing': {
          variable: false,
          quality: 1,
          what: 'Image that has hot spots has no alt attribute'
        }
      }
    }
  },
  imageMapAreaNoText: {
    weight: 4,
    packages: {
      axe: {
        'area-alt': {
          variable: false,
          quality: 1,
          what: 'Active area element has no text alternative'
        }
      },
      htmlcs: {
        'e:AA.1_1_1.H24': {
          variable: false,
          quality: 1,
          what: 'Area element in an image map has no alt attribute'
        }
      },
      ibm: {
        HAAC_Img_UsemapAlt: {
          variable: false,
          quality: 1,
          what: 'Image map or child area has no text alternative'
        },
        'WCAG20_Area_HasAlt': {
          variable: false,
          quality: 1,
          what: 'Area element in an image map has no text alternative'
        }
      },
      wave: {
        'e:alt_area_missing': {
          variable: false,
          quality: 1,
          what: 'Image map area has no alternative text'
        }
      }
    }
  },
  objectBlurKeyboardRisk: {
    weight: 1,
    packages: {
      htmlcs: {
        'w:AA.2_1_2.F10': {
          variable: false,
          quality: 1,
          what: 'Applet or plugin may fail to enable moving the focus away with the keyboard'
        }
      }
    }
  },
  keyboardAccess: {
    weight: 4,
    packages: {
      tenon: {
        180: {
          variable: false,
          quality: 1,
          what: 'Element is interactive but has a negative tabindex value'
        }
      }
    }
  },
  eventKeyboardRisk: {
    weight: 1,
    packages: {
      htmlcs: {
        'w:AA.2_1_1.G90': {
          variable: false,
          quality: 1,
          what: 'Event handler functionality may not be available by keyboard'
        },
        'w:AA.2_1_1.SCR20.MouseOut': {
          variable: false,
          quality: 1,
          what: 'Mousing-out functionality may not be available by keyboard'
        },
        'w:AA.2_1_1.SCR20.MouseOver': {
          variable: false,
          quality: 1,
          what: 'Mousing-over functionality may not be available by keyboard'
        },
        'w:AA.2_1_1.SCR20.MouseDown': {
          variable: false,
          quality: 1,
          what: 'Mousing-down functionality may not be available by keyboard'
        }
      },
      wave: {
        'a:event_handler': {
          variable: false,
          quality: 1,
          what: 'Device-dependent event handler'
        }
      }
    }
  },
  internalLinkBroken: {
    weight: 4,
    packages: {
      htmlcs: {
        'e:AA.2_4_1.G1,G123,G124.NoSuchID': {
          variable: false,
          quality: 1,
          what: 'Internal link references a nonexistent destination'
        }
      },
      wave: {
        'a:link_internal_broken': {
          variable: false,
          quality: 1,
          what: 'Broken same-page link'
        }
      }
    }
  },
  labelForBad: {
    weight: 3,
    packages: {
      htmlcs: {
        'w:AA.1_3_1.H44.NotFormControl': {
          variable: false,
          quality: 1,
          what: 'referent of the for attribute of the label is not a form control, so may be wrong'
        }
      },
      nuVal: {
        'The value of the for attribute of the label element must be the ID of a non-hidden form control.': {
          variable: false,
          quality: 1,
          what: 'for attribute of the label element does not reference a non-hidden form control'
        }
      }
    }
  },
  ariaLabelWrongRisk: {
    weight: 1,
    packages: {
      nuVal: {
        'Possible misuse of aria-label. (If you disagree with this warning, file an issue report or send e-mail to www-validator@w3.org.)': {
          variable: false,
          quality: 1,
          what: 'aria-label attribute may be misused'
        }
      }
    }
  },
  activeDescendantBadID: {
    weight: 4,
    packages: {
      continuum: {
        290: {
          variable: false,
          quality: 1,
          what: 'aria-activedescendant attribute is set to an invalid or duplicate id'
        }
      },
      ibm: {
        HAAC_ActiveDescendantCheck: {
          variable: false,
          quality: 1,
          what: 'aria-activedescendant property does not reference the id of a non-empty, non-hidden active child element'
        }
      }
    }
  },
  controlleeBadID: {
    weight: 4,
    packages: {
      continuum: {
        85: {
          variable: false,
          quality: 1,
          what: 'aria-controls attribute references an invalid or duplicate ID'
        }
      },
      nuVal: {
        'The aria-controls attribute must point to an element in the same document.': {
          variable: false,
          quality: 1,
          what: 'aria-controls attribute references an element not in the document'
        }
      }
    }
  },
  descriptionBadID: {
    weight: 4,
    packages: {
      continuum: {
        83: {
          variable: false,
          quality: 1,
          what: 'aria-describedby attribute references an invalid or duplicate ID'
        }
      }
    }
  },
  labelConfusionRisk: {
    weight: 1,
    packages: {
      ibm: {
        WCAG20_Input_LabelBefore: {
          variable: false,
          quality: 1,
          what: 'Text input or select element label follows the input control'
        },
        WCAG20_Input_LabelAfter: {
          variable: false,
          quality: 1,
          what: 'Checkbox or radio button label precedes the input control'
        }
      }
    }
  },
  labelBadID: {
    weight: 4,
    packages: {
      continuum: {
        95: {
          variable: false,
          quality: 1,
          what: 'element has an aria-labelledby value that includes an invalid or duplicate id'
        }
      },
      htmlcs: {
        'w:AA.1_3_1.H44.NonExistentFragment': {
          variable: false,
          quality: 1,
          what: 'Label for attribute references a nonexistent element'
        },
        'w:AA.1_3_1.ARIA16,ARIA9': {
          variable: false,
          quality: 1,
          what: 'aria-labelledby attribute references a nonexistent element'
        },
        'w:AA.4_1_2.ARIA16,ARIA9': {
          variable: false,
          quality: 1,
          what: 'aria-labelledby attribute references a nonexistent element'
        }
      },
      ibm: {
        WCAG20_Label_RefValid: {
          variable: false,
          quality: 1,
          what: 'for attribute does not reference a non-empty, unique id attribute of an input element'
        }
      },
      nuVal: {
        'The aria-labelledby attribute must point to an element in the same document.': {
          variable: false,
          quality: 1,
          what: 'aria-labelledby attribute references an element not in the document'
        },
        'The aria-describedby attribute must point to an element in the same document.': {
          variable: false,
          quality: 1,
          what: 'aria-describedby attribute references an element not in the document'
        }
      },
      wave: {
        'a:label_orphaned': {
          variable: false,
          quality: 1,
          what: 'Orphaned form label'
        }
      }
    }
  },
  haspopupBad: {
    weight: 4,
    packages: {
      ibm: {
        combobox_haspopup: {
          variable: false,
          quality: 1,
          what: 'aria-haspopup value is invalid for the role of the controlled or owned element'
        }
      }
    }
  },
  ownerConflict: {
    weight: 4,
    packages: {
      continuum: {
        360: {
          variable: false,
          quality: 1,
          what: 'Element and another element have aria-owns attributes with identical id values'
        }
      }
    }
  },
  linkNoText: {
    weight: 4,
    packages: {
      alfa: {
        r11: {
          variable: false,
          quality: 1,
          what: 'Link has no accessible name'
        }
      },
      axe: {
        'link-name': {
          variable: false,
          quality: 1,
          what: 'Link has no discernible text'
        }
      },
      continuum: {
        237: {
          variable: false,
          quality: 1,
          what: 'a element has no mechanism that allows an accessible name value to be calculated'
        }
      },
      htmlcs: {
        'e:AA.1_1_1.H30.2': {
          variable: false,
          quality: 1,
          what: 'img element is the only link content but has no text alternative'
        },
        'w:AA.4_1_2.H91.A.Empty': {
          variable: false,
          quality: 1,
          what: 'Link element has an id attribute but no href attribute or text'
        },
        'e:AA.4_1_2.H91.A.EmptyNoId': {
          variable: false,
          quality: 1,
          what: 'Link has no name or id attribute or value'
        },
        'w:AA.4_1_2.H91.A.EmptyWithName': {
          variable: false,
          quality: 1,
          what: 'Link has a name attribute but no href attribute or text'
        },
        'e:AA.4_1_2.H91.A.NoContent': {
          variable: false,
          quality: 1,
          what: 'Link has an href attribute but no text'
        }
      },
      ibm: {
        WCAG20_A_HasText: {
          variable: false,
          quality: 1,
          what: 'Hyperlink has no text description'
        }
      },
      nuVal: {
        'Bad value  for attribute href on element link: Must be non-empty.': {
          variable: false,
          quality: 1,
          what: 'link element has an empty href attribute'
        }
      },
      tenon: {
        57: {
          variable: false,
          quality: 1,
          what: 'Link has no text inside it'
        },
        91: {
          variable: false,
          quality: 1,
          what: 'Link has a background image but no text inside it'
        }
      },
      wave: {
        'e:link_empty': {
          variable: false,
          quality: 1,
          what: 'Link contains no text'
        },
        'e:alt_link_missing': {
          variable: false,
          quality: 1,
          what: 'Linked image has no text alternative'
        },
      }
    }
  },
  linkBrokenRisk: {
    weight: 2,
    packages: {
      htmlcs: {
        'w:AA.4_1_2.H91.A.Placeholder': {
          variable: false,
          quality: 1,
          what: 'Link has text but no href, id, or name attribute'
        }
      }
    }
  },
  acronymNoTitle: {
    weight: 4,
    packages: {
      tenon: {
        117: {
          variable: false,
          quality: 1,
          what: 'acronym element has no useful title value (and is deprecated; use abbr)'
        }
      }
    }
  },
  abbreviationNoTitle: {
    weight: 4,
    packages: {
      tenon: {
        233: {
          variable: false,
          quality: 1,
          what: 'abbr element is first for its abbreviation but has no useful title value'
        }
      }
    }
  },
  pdfLink: {
    weight: 1,
    packages: {
      wave: {
        'a:link_pdf': {
          variable: false,
          quality: 1,
          what: 'Link to PDF document'
        }
      }
    }
  },
  destinationLink: {
    weight: 2,
    packages: {
      htmlcs: {
        'w:AA.4_1_2.H91.A.NoHref': {
          variable: false,
          quality: 1,
          what: 'Link is misused as a link destination'
        }
      },
      testaro: {
        linkTo: {
          variable: false,
          quality: 1,
          what: 'Link has no href attribute'
        }
      }
    }
  },
  textAreaNoText: {
    weight: 4,
    packages: {
      htmlcs: {
        'e:AA.4_1_2.H91.Textarea.Name': {
          variable: false,
          quality: 1,
          what: 'textarea element has no accessible name'
        }
      }
    }
  },
  linkTextsSame: {
    weight: 2,
    packages: {
      htmlcs: {
        'e:AA.1_1_1.H2.EG3': {
          variable: false,
          quality: 1,
          what: 'alt value of the link img element duplicates the text of a link beside it'
        }
      },
      tenon: {
        98: {
          variable: false,
          quality: 1,
          what: 'Links have the same text but different destinations'
        }
      }
    }
  },
  nextLinkDestinationSame: {
    weight: 2,
    packages: {
      tenon: {
        184: {
          variable: false,
          quality: 1,
          what: 'Adjacent links point to the same destination'
        }
      }
    }
  },
  linkDestinationsSame: {
    weight: 2,
    packages: {
      tenon: {
        132: {
          variable: false,
          quality: 1,
          what: 'area element has the same href as another but a different alt'
        }
      }
    }
  },
  linkConfusionRisk: {
    weight: 1,
    packages: {
      axe: {
        'identical-links-same-purpose': {
          variable: false,
          quality: 1,
          what: 'Links with the same accessible name may serve dissimilar purposes'
        }
      }
    }
  },
  linkPair: {
    weight: 2,
    packages: {
      wave: {
        'a:link_redundant': {
          variable: false,
          quality: 1,
          what: 'Adjacent links go to the same URL'
        }
      }
    }
  },
  formNewWindow: {
    weight: 2,
    packages: {
      tenon: {
        214: {
          variable: false,
          quality: 1,
          what: 'Form submission opens a new window'
        }
      }
    }
  },
  linkForcesNewWindow: {
    weight: 3,
    packages: {
      tenon: {
        218: {
          variable: false,
          quality: 1,
          what: 'Link opens in a new window without user control'
        }
      }
    }
  },
  linkWindowSurpriseRisk: {
    weight: 1,
    packages: {
      htmlcs: {
        'w:WCAG2AAA.Principle3.Guideline3_2.3_2_5.H83.3': {
          variable: false,
          quality: 1,
          what: 'Link may open in a new window without notice'
        }
      }
    }
  },
  selectNavSurpriseRisk: {
    weight: 1,
    packages: {
      wave: {
        'a:javascript_jumpmenu': {
          variable: false,
          quality: 1,
          what: 'selection change may navigate to another page without notice'
        }
      }
    }
  },
  buttonAlt: {
    weight: 4,
    packages: {
      nuVal: {
        'Attribute alt not allowed on element button at this point.': {
          variable: false,
          quality: 1,
          what: 'button element has an alt attribute'
        }
      }
    }
  },
  buttonNoText: {
    weight: 4,
    packages: {
      alfa: {
        r12: {
          variable: false,
          quality: 1,
          what: 'Button has no accessible name'
        }
      },
      axe: {
        'aria-command-name': {
          variable: false,
          quality: 1,
          what: 'ARIA command has no accessible name'
        },
        'button-name': {
          variable: false,
          quality: 1,
          what: 'Button has no discernible text'
        },
        'input-button-name': {
          variable: false,
          quality: 1,
          what: 'Input button has no discernible text'
        }
      },
      continuum: {
        116: {
          variable: false,
          quality: 1,
          what: 'input element with type=button has no mechanism that allows an accessible name to be calculated'
        },
        224: {
          variable: false,
          quality: 1,
          what: 'button element has no mechanism that allows an accessible name to be calculated'
        },
        511: {
          variable: false,
          quality: 1,
          what: 'Element with a button role has no mechanism that allows an accessible name to be calculated'
        }
      },
      htmlcs: {
        'e:AA.4_1_2.H91.A.Name': {
          variable: false,
          quality: 1,
          what: 'Link with button role has no accessible name'
        },
        'e:AA.4_1_2.H91.Div.Name': {
          variable: false,
          quality: 1,
          what: 'div element with button role has no accessible name'
        },
        'e:AA.4_1_2.H91.Button.Name': {
          variable: false,
          quality: 1,
          what: 'Button element has no accessible name'
        },
        'e:AA.4_1_2.H91.Img.Name': {
          variable: false,
          quality: 1,
          what: 'img element with button role has no accessible name'
        },
        'e:AA.4_1_2.H91.InputButton.Name': {
          variable: false,
          quality: 1,
          what: 'Button input element has no accessible name'
        },
        'e:AA.4_1_2.H91.Span.Name': {
          variable: false,
          quality: 1,
          what: 'Element with button role has no accessible name'
        }
      },
      nuVal: {
        'Element input with attribute type whose value is button must have non-empty attribute value.': {
          variable: false,
          quality: 1,
          what: 'input element with type=button has no nonempty value attribute'
        }
      },
      wave: {
        'e:button_empty': {
          variable: false,
          quality: 1,
          what: 'Button is empty or has no value text'
        }
      }
    }
  },
  parentMissing: {
    weight: 4,
    packages: {
      alfa: {
        r42: {
          variable: false,
          quality: 1,
          what: 'Element is not owned by an element of its required context role'
        }
      },
      axe: {
        'aria-required-parent': {
          variable: false,
          quality: 1,
          what: 'ARIA role is not contained by a required parent'
        }
      },
      ibm: {
        Rpt_Aria_RequiredParent_Native_Host_Sematics: {
          variable: false,
          quality: 1,
          what: 'Element is not contained within a role-valid element'
        }
      }
    }
  },
  svgImageNoText: {
    weight: 4,
    packages: {
      alfa: {
        r43: {
          variable: false,
          quality: 1,
          what: 'SVG image element has no accessible name'
        }
      },
      axe: {
        'svg-img-alt': {
          variable: false,
          quality: 1,
          what: 'svg element with an img role has no text alternative'
        }
      },
      continuum: {
        123: {
          variable: false,
          quality: 1,
          what: 'svg element has no mechanism that allows an accessible name to be calculated'
        }
      }
    }
  },
  cssBansRotate: {
    weight: 4,
    packages: {
      axe: {
        'css-orientation-lock': {
          variable: false,
          quality: 1,
          what: 'CSS media query locks display orientation'
        }
      }
    }
  },
  textRotated: {
    weight: 2,
    packages: {
      tenon: {
        271: {
          variable: false,
          quality: 1,
          what: 'Text is needlessly rotated 60+ degrees or more, hurting comprehension'
        }
      }
    }
  },
  metaBansZoom: {
    weight: 4,
    packages: {
      alfa: {
        r47: {
          variable: false,
          quality: 1,
          what: 'Meta element restricts zooming'
        }
      },
      axe: {
        'meta-viewport': {
          variable: false,
          quality: 1,
          what: 'Zooming and scaling are disabled'
        },
        'meta-viewport-large': {
          variable: false,
          quality: 1,
          what: 'User cannot zoom and scale the text up to 500%'
        }
      },
      continuum: {
        55: {
          variable: false,
          quality: 1,
          what: 'meta element in the head stops a user from scaling the viewport size'
        },
        59: {
          variable: false,
          quality: 1,
          what: 'meta element in the head sets the viewport maximum-scale to less than 2'
        }
      },
      nuVal: {
        'Consider avoiding viewport values that prevent users from resizing documents.': {
          variable: false,
          quality: 1,
          what: 'viewport value prevents users from resizing the document'
        }
      }
    }
  },
  childMissing: {
    weight: 4,
    packages: {
      alfa: {
        r68: {
          variable: false,
          quality: 1,
          what: 'Element does not own an element required by its semantic role'
        }
      },
      axe: {
        'aria-required-children': {
          variable: false,
          quality: 1,
          what: 'ARIA role does not contain a required child'
        }
      }
    }
  },
  presentationChild: {
    weight: 4,
    packages: {
      htmlcs: {
        'e:AA.1_3_1.F92,ARIA4': {
          variable: false,
          quality: 1,
          what: 'Element has presentation role but semantic child'
        }
      }
    }
  },
  fontSizeAbsolute: {
    weight: 2,
    packages: {
      alfa: {
        r74: {
          variable: false,
          quality: 1,
          what: 'Paragraph text has an absolute font size'
        }
      }
    }
  },
  fontSmall: {
    weight: 3,
    packages: {
      alfa: {
        r75: {
          variable: false,
          quality: 1,
          what: 'Font size is smaller than 9 pixels'
        }
      },
      tenon: {
        134: {
          variable: false,
          quality: 1,
          what: 'Text is very small'
        }
      },
      testaro: {
        miniText: {
          variable: false,
          quality: 1,
          what: 'Text node has a font smaller than 11 pixels'
        }
      },
      wave: {
        'a:text_small': {
          variable: false,
          quality: 1,
          what: 'Text is very small'
        }
      }
    }
  },
  leadingFrozen: {
    weight: 4,
    packages: {
      alfa: {
        r93: {
          variable: false,
          quality: 1,
          what: 'Style attribute with !important prevents adjusting line height'
        }
      },
      axe: {
        'avoid-inline-spacing': {
          variable: false,
          quality: 1,
          what: 'Inline text spacing is not adjustable with a custom stylesheet'
        }
      }
    }
  },
  leadingAbsolute: {
    weight: 2,
    packages: {
      alfa: {
        r80: {
          variable: false,
          quality: 1,
          what: 'Paragraph text has an absolute line height'
        }
      }
    }
  },
  noLeading: {
    weight: 3,
    packages: {
      alfa: {
        r73: {
          variable: false,
          quality: 1,
          what: 'Paragraph of text has insufficient line height'
        }
      }
    }
  },
  leadingClipsText: {
    weight: 4,
    packages: {
      tenon: {
        144: {
          variable: false,
          quality: 1,
          what: 'Line height is insufficent to properly display the computed font size'
        }
      }
    }
  },
  overflowHidden: {
    weight: 4,
    packages: {
      alfa: {
        r83: {
          variable: false,
          quality: 1,
          what: 'Overflow is hidden or clipped if the text is enlarged'
        }
      }
    }
  },
  titleBad: {
    weight: 4,
    packages: {
      nuVal: {
        'Element title not allowed as child of element body in this context. (Suppressing further errors from this subtree.)': {
          variable: false,
          quality: 1,
          what: 'title element is a child of the body element'
        }
      },
      testaro: {
        titleEl: {
          variable: false,
          quality: 1,
          what: 'title attribute belongs to an inappropriate element'
        }
      }
    }
  },
  linkElementBad: {
    weight: 4,
    packages: {
      nuVal: {
        'A link element must not appear as a descendant of a body element unless the link element has an itemprop attribute or has a rel attribute whose value contains dns-prefetch, modulepreload, pingback, preconnect, prefetch, preload, prerender, or stylesheet.': {
          variable: false,
          quality: 1,
          what: 'link element with a body ancestor has no itemprop or valid rel attribute'
        },
        'A link element with an as attribute must have a rel attribute that contains the value preload or the value modulepreload or the value prefetch.': {
          variable: false,
          quality: 1,
          what: 'link element with an as attribute has no rel attribute with preload, modulepreload, or prefetch as its value'
        }
      }
    }
  },
  metaBad: {
    weight: 3,
    packages: {
      nuVal: {
        '^Attribute .+ not allowed on element meta at this point.*$': {
          variable: true,
          quality: 1,
          what: 'Attribute is not allowed on a meta element here'
        },
        '^Element meta is missing one or more of the following attributes: .+$': {
          variable: true,
          quality: 1,
          what: 'meta element is missing a required attribute'
        },
        'A document must not include more than one meta element with its name attribute set to the value description.': {
          variable: false,
          quality: 1,
          what: 'meta element with name="description" is not the only one'
        },
        'A document must not include both a meta element with an http-equiv attribute whose value is content-type, and a meta element with a charset attribute.': {
          variable: false,
          quality: 1,
          what: 'meta element with http-equiv="content-type" is incompatible with the meta element with a charset attribute'
        },
        'A document must not include more than one meta element with a http-equiv attribute whose value is content-type.': {
          variable: false,
          quality: 1,
          what: 'Page has more than 1 meta element with http-equiv="content-type"'
        },
        'A meta element with an http-equiv attribute whose value is X-UA-Compatible must have a content attribute with the value IE=edge.': {
          variable: false,
          quality: 1,
          what: 'meta element with http-equiv="X-UA-Compatible" has no content="IE=edge"'
        },
        'A document must not include more than one meta element with a charset attribute.': {
          variable: false,
          quality: 1,
          what: 'More than 1 meta element has a charset attribute'
        },
        'A charset attribute on a meta element found after the first 1024 bytes.': {
          variable: false,
          quality: 1,
          what: 'charset attribute on a meta element appears after 1024 bytes'
        },
        '^Bad value .+ for attribute .+ on element meta.*$': {
          variable: true,
          quality: 1,
          what: 'attribute of a meta element has an invalid value'
        }
      }
    }
  },
  scriptElementBad: {
    weight: 4,
    packages: {
      nuVal: {
        'Element script must not have attribute defer unless attribute src is also specified.': {
          variable: false,
          quality: 1,
          what: 'script element has a defer attribute without a src attribute'
        },
        'A script element with a src attribute must not have a type attribute whose value is anything other than the empty string, a JavaScript MIME type, or module.': {
          variable: false,
          quality: 1,
          what: 'script element has a src attribute but its type is not empty, a JS MIME type, or module'
        }
      }
    }
  },
  itemTypeBad: {
    weight: 4,
    packages: {
      nuVal: {
        'The itemtype attribute must not be specified on elements that do not have an itemscope attribute specified.': {
          variable: false,
          quality: 1,
          what: 'Element has an itemtype attribute without an itemscope attribute'
        }
      }
    }
  },
  iframeTitleBad: {
    weight: 4,
    packages: {
      alfa: {
        r13: {
          variable: false,
          quality: 1,
          what: 'iframe has no accessible name'
        }
      },
      axe: {
        'frame-title': {
          variable: false,
          quality: 1,
          what: 'Frame has no accessible name'
        },
        'frame-title-unique': {
          variable: false,
          quality: 1,
          what: 'Frame title attribute is not unique'
        }
      },
      continuum: {
        228: {
          variable: false,
          quality: 1,
          what: 'iframe has no mechanism that allows an accessible name to be calculated'
        }
      },
      htmlcs: {
        'e:AA.2_4_1.H64.1': {
          variable: false,
          quality: 1,
          what: 'iframe element has no non-empty title attribute'
        }
      },
      ibm: {
        WCAG20_Frame_HasTitle: {
          variable: false,
          quality: 1,
          what: 'Inline frame has an empty or nonunique title attribute'
        }
      }
    }
  },
  roleBad: {
    weight: 3,
    packages: {
      alfa: {
        r21: {
          variable: false,
          quality: 1,
          what: 'Element does not have a valid role'
        }
      },
      axe: {
        'aria-roles': {
          variable: false,
          quality: 1,
          what: 'ARIA role has an invalid value'
        },
        'aria-allowed-role': {
          variable: false,
          quality: 1,
          what: 'ARIA role is not appropriate for the element'
        }
      },
      continuum: {
        37: {
          variable: false,
          quality: 1,
          what: 'a element has a role attribute that is not allowed'
        },
        44: {
          variable: false,
          quality: 1,
          what: 'hr element has a role attribute'
        },
        176: {
          variable: false,
          quality: 1,
          what: 'label element has a role attribute'
        },
        285: {
          variable: false,
          quality: 1,
          what: 'button element has a role attribute that is not allowed'
        },
        319: {
          variable: false,
          quality: 1,
          what: 'ol element has a role attribute that is not allowed'
        },
        325: {
          variable: false,
          quality: 1,
          what: 'ul element has a role attribute that is not allowed'
        },
        412: {
          variable: false,
          quality: 1,
          what: 'element has a role attribute set to an invalid ARIA role value'
        }
      },
      ibm: {
        aria_semantics_role: {
          variable: false,
          quality: 1,
          what: 'ARIA role is not valid for the element to which it is assigned'
        },
        element_tabbable_role_valid: {
          variable: false,
          quality: 1,
          what: 'Tabbable element has a non-widget role'
        },
        Rpt_Aria_ContentinfoWithNoMain_Implicit: {
          variable: false,
          quality: 1,
          what: 'Element has a contentinfo role when no element has a main role'
        },
        Rpt_Aria_ValidRole: {
          variable: false,
          quality: 1,
          what: 'Element has an invalid role'
        },
        Rpt_Aria_EventHandlerMissingRole_Native_Host_Sematics: {
          variable: false,
          quality: 1,
          what: 'Element has an event handler but no valid ARIA role'
        },
        table_aria_descendants: {
          variable: false,
          quality: 1,
          what: 'Table structure element specifies an explicit role within the table container'
        }
      },
      nuVal: {
        'Bad value dialog for attribute role on element li.': {
          variable: false,
          quality: 1,
          what: 'dialog role is not valid for an li element'
        },
        'An img element with no alt attribute must not have a role attribute.': {
          variable: false,
          quality: 1,
          what: 'img element has a role attribute but no alt attribute'
        },
        '^The role attribute must not be used on a .+ element which has a table ancestor with no role attribute, or with a role attribute whose value is table, grid, or treegrid.*$': {
          variable: true,
          quality: 1,
          what: 'Table cell has a role attribute'
        }
      },
      testaro: {
        role: {
          variable: false,
          quality: 1,
          what: 'Nonexistent or implicit-overriding role'
        }
      }
    }
  },
  roleRedundant: {
    weight: 1,
    packages: {
      ibm: {
        aria_role_redundant: {
          variable: false,
          quality: 1,
          what: 'Explicitly assigned ARIA role is redundant with the implicit role of the element'
        }
      },
      nuVal: {
        '^The .+ role is unnecessary for element .+$': {
          variable: true,
          quality: 1,
          what: 'explicit role is redundant for its element'
        },
        'The textbox role is unnecessary for an input element that has no list attribute and whose type is text.': {
          variable: false,
          quality: 1,
          what: 'explicit role is redundant for a text-type input element without a list attribute'
        }
      }
    }
  },
  attributeBad: {
    weight: 4,
    packages: {
      nuVal: {
        'The itemprop attribute was specified, but the element is not a property of any item.': {
          variable: false,
          quality: 1,
          what: 'itemprop attribute is on an element that is not a property of an item'
        },
        'An aria-disabled attribute whose value is true should not be specified on an a element that has an href attribute.': {
          variable: false,
          quality: 1,
          what: 'a element has aria-disabled=true but has an href attribute'
        },
        '^Attribute .+ not allowed on element .+ at this point.*$': {
          variable: true,
          quality: 1,
          what: 'attribute not allowed on this element'
        },
        '^Bad value .+ for attribute .+ on element .+$': {
          variable: true,
          quality: 1,
          what: 'attribute on this element has an invalid value'
        },
        '^Bad value .+ for the attribute .+$': {
          variable: true,
          quality: 1,
          what: 'attribute has an invalid value'
        },
        '^Attribute .+ not allowed here.*$': {
          variable: true,
          quality: 1,
          what: 'Attribute not allowed here'
        },
        '^Attribute .+ is not serializable as XML 1\\.0.*$': {
          variable: true,
          quality: 1,
          what: 'Attribute is invalidly nonserializable'
        },
        '^Bad value  for attribute .+ on element .+: Must not be empty.*$': {
          variable: true,
          quality: 1,
          what: 'Attribute has an invalidly empty value'
        },
        '^Attribute .+ is only allowed when .+$': {
          variable: true,
          quality: 1,
          what: 'Attribute is invalid here'
        },
        'A document must not include more than one autofocus attribute.': {
          variable: false,
          quality: 1,
          what: 'Page includes more than one autofocus attribute'
        },
        '^Bad value  for attribute (?:width|height) on element img: The empty string is not a valid non-negative integer.*$': {
          variable: true,
          quality: 1,
          what: 'attribute has an empty value'
        }
      }
    }
  },
  attributeMissing: {
    weight: 4,
    packages: {
      axe: {
        'aria-required-attr': {
          variable: false,
          quality: 1,
          what: 'Required ARIA attribute is not provided'
        }
      },
      ibm: {
        Rpt_Aria_RequiredProperties: {
          variable: false,
          quality: 1,
          what: 'ARIA role on an element does not have a required attribute'
        }
      },
      nuVal: {
        'Element a is missing required attribute aria-valuenow.': {
          variable: false,
          quality: 1,
          what: 'a element has no aria-valuenow attribute'
        },
        '^Element .+ is missing one or more of the following attributes: .+$': {
          variable: true,
          quality: 1,
          what: 'Element is missing a required attribute'
        }
      }
    }
  },
  roleMissing: {
    weight: 3,
    packages: {
      nuVal: {
        '^Element .+ is missing required attribute role.*$': {
          variable: true,
          quality: 1,
          what: 'Element has no role attribute'
        }
      }
    }
  },
  roleMissingRisk: {
    weight: 1,
    packages: {
      nuVal: {
        '^Element .+ is missing one or more of the following attributes: role.*$': {
          variable: true,
          quality: 1,
          what: 'Element has no role attribute but may need one'
        }
      }
    }
  },
  ariaMissing: {
    weight: 4,
    packages: {
      alfa: {
        r16: {
          variable: false,
          quality: 1,
          what: 'Element does not have all required states and properties'
        }
      },
      continuum: {
        1040: {
          variable: false,
          quality: 1,
          what: 'element with a combobox role has no aria-controls or no aria-expanded attribute'
        },
        1042: {
          variable: false,
          quality: 1,
          what: 'element with an option role has no aria-selected attribute'
        },
        1043: {
          variable: false,
          quality: 1,
          what: 'element with a radio role has no aria-checked attribute'
        }
      },
      nuVal: {
        '^Element .+ is missing required attribute aria-.+$': {
          variable: true,
          quality: 1,
          what: 'Element is missing a required ARIA attribute'
        }
      },
      wave: {
        'e:aria_reference_broken': {
          variable: false,
          quality: 1,
          what: 'Broken ARIA reference'
        }
      }
    }
  },
  ariaBadAttribute: {
    weight: 4,
    packages: {
      alfa: {
        r18: {
          variable: false,
          quality: 1,
          what: 'ARIA state or property is not allowed for the element on which it is specified'
        },
        r19: {
          variable: false,
          quality: 1,
          what: 'ARIA state or property has an invalid value'
        },
        r20: {
          variable: false,
          quality: 1,
          what: 'ARIA attribute is not defined'
        }
      },
      axe: {
        'aria-valid-attr': {
          variable: false,
          quality: 1,
          what: 'ARIA attribute has an invalid name'
        },
        'aria-valid-attr-value': {
          variable: false,
          quality: 1,
          what: 'ARIA attribute has an invalid value'
        },
        'aria-allowed-attr': {
          variable: false,
          quality: 1,
          what: 'ARIA attribute is invalid for the role of its element'
        },
        'aria-roledescription': {
          variable: false,
          quality: 1,
          what: 'aria-roledescription is on an element with no semantic role'
        }
      },
      continuum: {
        16: {
          variable: false,
          quality: 1,
          what: 'Element has an aria-multiline attribute, which is not allowed'
        },
        38: {
          variable: false,
          quality: 1,
          what: 'Element has an aria-pressed attribute, which is not allowed'
        },
        64: {
          variable: false,
          quality: 1,
          what: 'Element has an aria-valuemax attribute that is not set to an integer'
        },
        257: {
          variable: false,
          quality: 1,
          what: 'Element has an aria-checked attribute, which is not allowed'
        },
        260: {
          variable: false,
          quality: 1,
          what: 'Element has an aria-level attribute, which is not allowed'
        },
        264: {
          variable: false,
          quality: 1,
          what: 'Element has an aria-selected attribute, which is not allowed'
        },
        270: {
          variable: false,
          quality: 1,
          what: 'Element has an aria-required attribute, which is not allowed'
        },
        281: {
          variable: false,
          quality: 1,
          what: 'Element has an aria-expanded attribute, which is not allowed'
        },
        282: {
          variable: false,
          quality: 1,
          what: 'Element has an aria-autocomplete attribute, which is not allowed'
        },
        283: {
          variable: false,
          quality: 1,
          what: 'Element has an aria-activedescendant attribute, which is not allowed'
        },
        331: {
          variable: false,
          quality: 1,
          what: 'Element has an aria-owns attribute set to a non-null value'
        },
        333: {
          variable: false,
          quality: 1,
          what: 'Element with a textbox role has an aria-owns attribute, which is not allowed'
        },
        334: {
          variable: false,
          quality: 1,
          what: 'Element with a searchbox role has an aria-owns attribute, which is not allowed'
        },
        609: {
          variable: false,
          quality: 1,
          what: 'Element has an aria-setsize attribute but has no aria-posinset attribute'
        },
        1066: {
          variable: false,
          quality: 1,
          what: 'Element has an ARIA attribute which is not valid'
        }
      },
      ibm: {
        aria_semantics_attribute: {
          variable: false,
          quality: 1,
          what: 'ARIA attributes is invalid for the element or ARIA role to which it is assigned'
        },
        Rpt_Aria_ValidProperty: {
          variable: false,
          quality: 1,
          what: 'ARIA attribute is invalid for the role'
        },
        Rpt_Aria_ValidPropertyValue: {
          variable: false,
          quality: 1,
          what: 'ARIA property value is invalid'
        }
      },
      nuVal: {
        'The aria-hidden attribute must not be specified on the noscript element.': {
          variable: false,
          quality: 1,
          what: 'noscript element has an aria-hidden attribute'
        },
        'Attribute aria-activedescendant value should either refer to a descendant element, or should be accompanied by attribute aria-owns.': {
          variable: false,
          quality: 1,
          what: 'element has no aria-owns attribute but its aria-activedescendant attribute references a non-descendant'
        },
        '^Bad value  for attribute .+ on element .+: Must be non-empty.*$': {
          variable: true,
          quality: 1,
          what: 'attribute value is empty'
        },
        'The form attribute must refer to a form element.': {
          variable: false,
          quality: 1,
          what: 'form attribute does not reference a form element'
        },
        'The aria-checked attribute should not be used on an input element which has a type attribute whose value is checkbox.': {
          variable: false,
          quality: 1,
          what: 'input element with type="checkbox" has an aria-checked attribute'
        }
      }
    }
  },
  ariaRedundant: {
    weight: 1,
    packages: {
      continuum: {
        205: {
          variable: false,
          quality: 1,
          what: 'aria-disabled attribute is redundant with the disabled attribute'
        }
      },
      ibm: {
        aria_attribute_redundant: {
          variable: false,
          quality: 1,
          what: 'ARIA attribute is used when there is a corresponding HTML attribute'
        }
      },
      nuVal: {
        '^Attribute aria-.+ is unnecessary for elements that have attribute .+$': {
          variable: true,
          quality: 1,
          what: 'ARIA attribute is redundant with the synonymous native attribute'
        }
      }
    }
  },
  ariaReferenceBad: {
    weight: 4,
    packages: {
      ibm: {
        Rpt_Aria_ValidIdRef: {
          variable: false,
          quality: 1,
          what: 'ARIA property does not reference the non-empty unique id of a visible element'
        }
      },
      wave: {
        'e:aria_reference_broken': {
          variable: false,
          quality: 1,
          what: 'Broken ARIA reference'
        }
      }
    }
  },
  autocompleteBad: {
    weight: 3,
    packages: {
      alfa: {
        r10: {
          variable: false,
          quality: 1,
          what: 'Autocomplete attribute has no valid value'
        }
      },
      axe: {
        'autocomplete-valid': {
          variable: false,
          quality: 1,
          what: 'autocomplete attribute is used incorrectly'
        }
      },
      htmlcs: {
        'e:AA.1_3_5.H98': {
          variable: false,
          quality: 1,
          what: 'autocomplete attribute and the input type are mismatched'
        }
      },
      ibm: {
        WCAG21_Input_Autocomplete: {
          variable: false,
          quality: 1,
          what: 'autocomplete attribute token is not appropriate for the input form field'
        }
      },
      nuVal: {
        'Bad value  for attribute autocomplete on element input: Must not be empty.': {
          variable: false,
          quality: 1,
          what: 'autocomplete attribute has an empty value'
        }
      }
    }
  },
  autocompleteRisk: {
    weight: 1,
    packages: {
      htmlcs: {
        'w:AA.1_3_5.H98': {
          variable: false,
          quality: 1,
          what: 'Element contains a potentially faulty value in its autocomplete attribute'
        }
      }
    }
  },
  contrastAA: {
    weight: 4,
    packages: {
      alfa: {
        r69: {
          variable: false,
          quality: 1,
          what: 'Text outside widget has subminimum contrast'
        }
      },
      axe: {
        'color-contrast': {
          variable: false,
          quality: 1,
          what: 'Element has insufficient color contrast'
        }
      },
      htmlcs: {
        'e:AA.1_4_3.G145.Fail': {
          variable: false,
          quality: 1,
          what: 'Contrast between the text and its background is less than 3:1.'
        },
        'e:AA.1_4_3.G18.Fail': {
          variable: false,
          quality: 1,
          what: 'Contrast between the text and its background is less than 4.5:1'
        }
      },
      ibm: {
        IBMA_Color_Contrast_WCAG2AA: {
          variable: false,
          quality: 1,
          what: 'Contrast ratio of text with background does not meet WCAG 2.1 AA'
        }
      },
      wave: {
        'c:contrast': {
          variable: false,
          quality: 1,
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
          variable: false,
          quality: 1,
          what: 'Text contrast less than AAA requires'
        }
      },
      axe: {
        'color-contrast-enhanced': {
          variable: false,
          quality: 1,
          what: 'Element has insufficient color contrast (Level AAA)'
        }
      },
      htmlcs: {
        'e:WCAG2AAA.Principle1.Guideline1_4.1_4_3.G18': {
          variable: false,
          quality: 1,
          what: 'Insufficient contrast'
        }
      },
      tenon: {
        95: {
          variable: false,
          quality: 1,
          what: 'Element has insufficient color contrast (Level AAA)'
        }
      }
    }
  },
  contrastRisk: {
    weight: 1,
    packages: {
      htmlcs: {
        'w:AA.1_4_3_F24.F24.BGColour': {
          variable: false,
          quality: 1,
          what: 'Inline background color may lack a complementary foreground color'
        },
        'w:AA.1_4_3_F24.F24.FGColour': {
          variable: false,
          quality: 1,
          what: 'Inline foreground color may lack a complementary background color'
        },
        'w:AA.1_4_3.G18.Abs': {
          variable: false,
          quality: 1,
          what: 'Contrast between the absolutely positioned text and its background may be inadequate'
        },
        'w:AA.1_4_3.G18.Alpha': {
          variable: false,
          quality: 1,
          what: 'Contrast between the text and its background may be less than 4.5:1, given the transparency'
        },
        'w:AA.1_4_3.G145.Abs': {
          variable: false,
          quality: 1,
          what: 'Contrast between the absolutely positioned large text and its background may be less than 3:1'
        },
        'w:AA.1_4_3.G145.Alpha': {
          variable: false,
          quality: 1,
          what: 'Contrast between the text and its background may be less than 3:1, given the transparency'
        },
        'w:AA.1_4_3.G145.BgImage': {
          variable: false,
          quality: 1,
          what: 'Contrast between the text and its background image may be less than 3:1'
        },
        'w:AA.1_4_3.G18.BgImage': {
          variable: false,
          quality: 1,
          what: 'Contrast between the text and its background image may be less than 4.5:1'
        }
      }
    }
  },
  idEmpty: {
    weight: 4,
    packages: {
      nuVal: {
        '^Bad value  for attribute .+ on element .+: An ID must not be the empty string.+$': {
          variable: true,
          quality: 1,
          what: 'id attribute has an empty value'
        },
        '^Bad value  for attribute aria-owns on element .+: An IDREFS value must contain at least one non-whitespace character.*$': {
          variable: true,
          quality: 1,
          what: 'aria-owns attribute has an empty value'
        }
      }
    }
  },
  targetEmpty: {
    weight: 4,
    packages: {
      nuVal: {
        'Bad value  for attribute target on element a: Browsing context name must be at least one character long.': {
          variable: false,
          quality: 1,
          what: 'target attribute on an a element is empty'
        }
      }
    }
  },
  headingEmpty: {
    weight: 3,
    packages: {
      alfa: {
        r64: {
          variable: false,
          quality: 1,
          what: 'Heading has no non-empty accessible name'
        }
      },
      axe: {
        'empty-heading': {
          variable: false,
          quality: 1,
          what: 'Heading empty'
        }
      },
      htmlcs: {
        'e:AA.1_3_1.H42.2': {
          variable: false,
          quality: 1,
          what: 'Heading empty'
        }
      },
      ibm: {
        RPT_Header_HasContent: {
          variable: false,
          quality: 1,
          what: 'Heading element provides no descriptive text'
        }
      },
      nuVal: {
        'Empty heading.': {
          variable: false,
          quality: 1,
          what: 'Empty heading'
        }
      },
      wave: {
        'e:heading_empty': {
          variable: false,
          quality: 1,
          what: 'Empty heading'
        }
      }
    }
  },
  headingOfNothing: {
    weight: 2,
    packages: {
      alfa: {
        r78: {
          variable: false,
          quality: 1,
          what: 'No content between two headings of the same level'
        }
      }
    }
  },
  typeRedundant: {
    weight: 1,
    packages: {
      nuVal: {
        'The type attribute is unnecessary for JavaScript resources.': {
          variable: false,
          quality: 1,
          what: 'type attribute is unnecessary for a JavaScript resource'
        },
        'The type attribute for the style element is not needed and should be omitted.': {
          variable: false,
          quality: 1,
          what: 'type attribute is unnecessary for a style element'
        }
      }
    }
  },
  imageTextRedundant: {
    weight: 1,
    packages: {
      axe: {
        'image-redundant-alt': {
          variable: false,
          quality: 1,
          what: 'Text of a button or link is repeated in the image alternative'
        }
      },
      ibm: {
        WCAG20_Img_LinkTextNotRedundant: {
          variable: false,
          quality: 1,
          what: 'Text alternative for the image in a link repeats text of the same or an adjacent link'
        }
      },
      tenon: {
        138: {
          variable: false,
          quality: 1,
          what: 'Image link alternative text repeats text in the link'
        }
      },
      wave: {
        'a:alt_redundant': {
          variable: false,
          quality: 1,
          what: 'Redundant text alternative'
        }
      }
    }
  },
  decorativeTitle: {
    weight: 1,
    packages: {
      htmlcs: {
        'e:AA.1_1_1.H67.1': {
          variable: false,
          quality: 1,
          what: 'img element has an empty alt attribute but has a nonempty title attribute'
        }
      },
      ibm: {
        WCAG20_Img_TitleEmptyWhenAltNull: {
          variable: false,
          quality: 1,
          what: 'Image alt attribute is empty, but its title attribute is not'
        }
      },
      wave: {
        'a:image_title': {
          variable: false,
          quality: 1,
          what: 'Image has a title attribute value but no alt value'
        }
      }
    }
  },
  titleRedundant: {
    weight: 1,
    packages: {
      tenon: {
        79: {
          variable: false,
          quality: 1,
          what: 'Link has a title attribute that is the same as the text inside the link'
        }
      },
      wave: {
        'a:title_redundant': {
          variable: false,
          quality: 1,
          what: 'Title attribute text is the same as text or alternative text'
        }
      }
    }
  },
  titleEmpty: {
    weight: 1,
    packages: {
      htmlcs: {
        'w:AA.1_3_1.H65': {
          variable: false,
          quality: 0.5,
          what: 'Value of the title attribute of the form control is empty or only whitespace'
        },
        'w:AA.4_1_2.H65': {
          variable: false,
          quality: 0.5,
          what: 'Value of the title attribute of the form control is empty or only whitespace'
        }
      }
    }
  },
  docType: {
    weight: 3,
    packages: {
      nuVal: {
        'Start tag seen without seeing a doctype first. Expected <!DOCTYPE html>.': {
          variable: false,
          quality: 1,
          what: 'Page does not start with <!DOCTYPE html>'
        }
      },
      testaro: {
        docType: {
          variable: false,
          quality: 1,
          what: 'document has no doctype property'
        }
      }
    }
  },
  pageTitle: {
    weight: 3,
    packages: {
      alfa: {
        r1: {
          variable: false,
          quality: 1,
          what: 'Document has no valid title element'
        }
      },
      axe: {
        'document-title': {
          variable: false,
          quality: 1,
          what: 'Document contains no title element'
        }
      },
      continuum: {
        884: {
          variable: false,
          quality: 1,
          what: 'DOM contains no document title element'
        }
      },
      htmlcs: {
        'e:AA.2_4_2.H25.1.NoTitleEl': {
          variable: false,
          quality: 1,
          what: 'Document head element contains no non-empty title element'
        }
      },
      ibm: {
        WCAG20_Doc_HasTitle: {
          variable: false,
          quality: 1,
          what: 'Page has no subject-identifying title'
        }
      },
      nuVal: {
        'Element head is missing a required instance of child element title.': {
          variable: false,
          quality: 1,
          what: 'head element has no child title element'
        }
      },
      wave: {
        'e:title_invalid': {
          variable: false,
          quality: 1,
          what: 'Missing or uninformative page title'
        }
      }
    }
  },
  headingStructure: {
    weight: 2,
    packages: {
      alfa: {
        r53: {
          variable: false,
          quality: 1,
          what: 'Heading skips one or more levels'
        }
      },
      axe: {
        'heading-order': {
          variable: false,
          quality: 1,
          what: 'Heading levels do not increase by only one'
        }
      },
      htmlcs: {
        'w:AA.1_3_1_A.G141': {
          variable: false,
          quality: 1,
          what: 'Heading level is incorrect'
        }
      },
      nuVal: {
        'Consider using the h1 element as a top-level heading only (all h1 elements are treated as top-level headings by many screen readers and other tools).': {
          variable: false,
          quality: 1,
          what: 'Page contains more than 1 h1 element'
        }
      },
      tenon: {
        155: {
          variable: false,
          quality: 1,
          what: 'Headings are not structured in a hierarchical manner'
        }
      },
      wave: {
        'a:heading_skipped': {
          variable: false,
          quality: 1,
          what: 'Skipped heading level'
        }
      }
    }
  },
  headingLevelless: {
    weight: 1,
    packages: {
      continuum: {
        71: {
          variable: false,
          quality: 1,
          what: 'element with a heading role has no aria-level attribute'
        }
      }
    }
  },
  noHeading: {
    weight: 3,
    packages: {
      alfa: {
        r59: {
          variable: false,
          quality: 1,
          what: 'Document has no headings'
        }
      },
      wave: {
        'a:heading_missing': {
          variable: false,
          quality: 1,
          what: 'Page has no headings'
        }
      }
    }
  },
  h1Missing: {
    weight: 2,
    packages: {
      alfa: {
        r61: {
          variable: false,
          quality: 1,
          what: 'First heading is not h1'
        }
      },
      axe: {
        'page-has-heading-one': {
          variable: false,
          quality: 1,
          what: 'Page contains no level-one heading'
        }
      },
      wave: {
        'a:h1_missing': {
          variable: false,
          quality: 1,
          what: 'Missing first level heading'
        }
      }
    }
  },
  articleHeadingless: {
    weight: 1,
    packages: {
      nuVal: {
        'Article lacks heading. Consider using h2-h6 elements to add identifying headings to all articles.': {
          variable: false,
          quality: 1,
          what: 'article has no heading'
        }
      }
    }
  },
  sectionHeadingless: {
    weight: 1,
    packages: {
      nuVal: {
        'Section lacks heading. Consider using h2-h6 elements to add identifying headings to all sections.': {
          variable: false,
          quality: 1,
          what: 'section has no heading'
        },
        'Section lacks heading. Consider using h2-h6 elements to add identifying headings to all sections, or else use a div element instead for any cases where no heading is needed.': {
          variable: false,
          quality: 1,
          what: 'section has no heading'
        }
      }
    }
  },
  justification: {
    weight: 1,
    packages: {
      alfa: {
        r71: {
          variable: false,
          quality: 1,
          what: 'Paragraph text is fully justified'
        }
      },
      tenon: {
        36: {
          variable: false,
          quality: 1,
          what: 'Text is fully justified'
        }
      },
      wave: {
        'a:text_justified': {
          variable: false,
          quality: 1,
          what: 'Text is justified'
        }
      }
    }
  },
  nonSemanticText: {
    weight: 2,
    packages: {
      htmlcs: {
        'w:AA.1_3_1.H49.AlignAttr': {
          variable: false,
          quality: 1,
          what: 'Special text is aligned nonsemantically'
        },
        'w:AA.1_3_1.H49.B': {
          variable: false,
          quality: 1,
          what: 'Special text is bolded nonsemantically'
        },
        'w:AA.1_3_1.H49.I': {
          variable: false,
          quality: 1,
          what: 'Special text is italicized nonsemantically'
        },
        'w:AA.1_3_1.H49.Big': {
          variable: false,
          quality: 1,
          what: 'Special text is enlarged nonsemantically'
        },
        'w:AA.1_3_1.H49.Small': {
          variable: false,
          quality: 1,
          what: 'Special text is made small nonsemantically'
        },
        'w:AA.1_3_1.H49.U': {
          variable: false,
          quality: 1,
          what: 'Special text is underlined nonsemantically'
        },
        'w:AA.1_3_1.H49.Center': {
          variable: false,
          quality: 1,
          what: 'Special text is centered nonsemantically'
        },
        'w:AA.1_3_1.H49.Font': {
          variable: false,
          quality: 1,
          what: 'Special text is designated nonsemantically with a (deprecated) font element'
        }
      }
    }
  },
  pseudoParagraphRisk: {
    weight: 1,
    packages: {
      tenon: {
        242: {
          variable: false,
          quality: 1,
          what: 'Multiple consecutive br elements may simulate paragraphs'
        }
      }
    }
  },
  pseudoHeadingRisk: {
    weight: 1,
    packages: {
      axe: {
        'p-as-heading': {
          variable: false,
          quality: 1,
          what: 'Styled p element may be misused as a heading'
        }
      },
      htmlcs: {
        'w:AA.1_3_1.H42': {
          variable: false,
          quality: 1,
          what: 'Heading coding is not used but the element may be intended as a heading'
        }
      },
      wave: {
        'a:heading_possible': {
          variable: false,
          quality: 1,
          what: 'Possible heading'
        }
      }
    }
  },
  pseudoLinkRisk: {
    weight: 1,
    packages: {
      tenon: {
        129: {
          variable: false,
          quality: 1,
          what: 'CSS underline on text that is not a link'
        }
      },
      wave: {
        'a:underline': {
          variable: false,
          quality: 1,
          what: 'CSS underline on text that is not a link'
        }
      }
    }
  },
  listChild: {
    weight: 4,
    packages: {
      axe: {
        list: {
          variable: false,
          quality: 1,
          what: 'List element ul or ol has a child element other than li, script, and template'
        },
        'definition-list': {
          variable: false,
          quality: 1,
          what: 'List element dl has a child element other than properly ordered dt and dt group, script, template, and div'
        }
      },
      continuum: {
        244: {
          variable: false,
          quality: 1,
          what: 'dl element does not contain only dt, dd, script, template, or listitem-role elements as direct child elements'
        },
        246: {
          variable: false,
          quality: 1,
          what: 'ul element does not contain only li, script, template, or listitem-role elements as direct child elements'
        }
      },
      ibm: {
        HAAC_List_Group_ListItem: {
          variable: false,
          quality: 1,
          what: 'List component with a group role has a non-listitem child'
        }
      },
      nuVal: {
        'Element dl is missing a required child element.': {
          variable: false,
          quality: 1,
          what: 'dl element has no child element.'
        }
      }
    }
  },
  listItemOrphan: {
    weight: 4,
    packages: {
      axe: {
        listitem: {
          variable: false,
          quality: 1,
          what: 'li element is not contained by a ul or ol element'
        }
      },
      continuum: {
        99: {
          variable: false,
          quality: 1,
          what: 'li element has no ul, ol, or list-role parent'
        },
        385: {
          variable: false,
          quality: 1,
          what: 'list item has no ul, ol, or list-role parent or owner'
        }
      },
      nuVal: {
        'Element li not allowed as child of element div in this context. (Suppressing further errors from this subtree.)': {
          variable: false,
          quality: 1,
          what: 'li element is a child of a div element'
        }
      }
    }
  },
  pseudoListRisk: {
    weight: 1,
    packages: {
      wave: {
        'a:list_possible': {
          variable: false,
          quality: 1,
          what: 'List may fail to be coded as such'
        }
      }
    }
  },
  pseudoOrderedListRisk: {
    weight: 1,
    packages: {
      htmlcs: {
        'w:AA.1_3_1.H48.2': {
          variable: false,
          quality: 1,
          what: 'Ordered list may fail to be coded as such'
        }
      }
    }
  },
  pseudoNavListRisk: {
    weight: 1,
    packages: {
      htmlcs: {
        'w:AA.1_3_1.H48': {
          variable: false,
          quality: 1,
          what: 'Navigation links are not coded as a list'
        }
      }
    }
  },
  selectNoText: {
    weight: 3,
    packages: {
      axe: {
        'select-name': {
          variable: false,
          quality: 1,
          what: 'select element has no accessible name'
        }
      },
      continuum: {
        114: {
          variable: false,
          quality: 1,
          what: 'select element has no mechanism that allows an accessible name to be calculated'
        }
      },
      htmlcs: {
        'e:AA.4_1_2.H91.Select.Name': {
          variable: false,
          quality: 1,
          what: 'Select element has no accessible name'
        },
        'w:AA.4_1_2.H91.Select.Value': {
          variable: false,
          quality: 1,
          what: 'Select element value has no accessible name'
        }
      },
      wave: {
        'a:select_missing_label': {
          variable: false,
          quality: 1,
          what: 'Select element has no label'
        }
      }
    }
  },
  optionNoText: {
    weight: 4,
    packages: {
      nuVal: {
        'Element option without attribute label must not be empty.': {
          variable: false,
          quality: 1,
          what: 'option element is empty but has no label attribute'
        }
      }
    }
  },
  selectFlatRisk: {
    weight: 1,
    packages: {
      htmlcs: {
        'w:AA.1_3_1.H85.2': {
          variable: false,
          quality: 1,
          what: 'Selection list may contain groups of related options that are not grouped with optgroup'
        }
      }
    }
  },
  accessKeyDuplicate: {
    weight: 3,
    packages: {
      axe: {
        accesskeys: {
          variable: false,
          quality: 1,
          what: 'accesskey attribute value is not unique'
        }
      },
      ibm: {
        WCAG20_Elem_UniqueAccessKey: {
          variable: false,
          quality: 1,
          what: 'Accesskey attribute value on an element is not unique for the page'
        }
      },
      tenon: {
        101: {
          variable: false,
          quality: 1,
          what: 'Duplicate accesskey value'
        }
      },
      wave: {
        'a:accesskey': {
          variable: false,
          quality: 1,
          what: 'Accesskey'
        }
      }
    }
  },
  fieldSetMissing: {
    weight: 2,
    packages: {
      ibm: {
        WCAG20_Input_RadioChkInFieldSet: {
          variable: false,
          quality: 1,
          what: 'Input is in a different group than another with the name'
        }
      },
      testaro: {
        radioSet: {
          variable: false,
          quality: 1,
          what: 'No or invalid grouping of radio buttons in fieldsets'
        }
      },
      wave: {
        'a:fieldset_missing': {
          variable: false,
          quality: 1,
          what: 'fieldset element is missing'
        }
      }
    }
  },
  fieldSetRisk: {
    weight: 1,
    packages: {
      htmlcs: {
        'w:AA.1_3_1.H71.SameName': {
          variable: false,
          quality: 1,
          what: 'Radio buttons or check boxes may require a group description via a fieldset element'
        }
      }
    }
  },
  legendMissing: {
    weight: 2,
    packages: {
      continuum: {
        221: {
          variable: false,
          quality: 1,
          what: 'Element with a radiogroup role has no mechanism that allows an accessible name to be calculated'
        }
      },
      htmlcs: {
        'e:AA.1_3_1.H71.NoLegend': {
          variable: false,
          quality: 1,
          what: 'Fieldset has no legend element'
        }
      },
      ibm: {
        WCAG20_Fieldset_HasLegend: {
          variable: false,
          quality: 1,
          what: 'fieldset element has no single, non-empty legend as a label'
        }
      },
      wave: {
        'a:legend_missing': {
          variable: false,
          quality: 1,
          what: 'Fieldset has no legend element'
        }
      }
    }
  },
  groupName: {
    weight: 3,
    packages: {
      alfa: {
        r60: {
          variable: false,
          quality: 1,
          what: 'Form-control group has no accessible name'
        }
      },
      htmlcs: {
        'e:AA.4_1_2.H91.Fieldset.Name': {
          variable: false,
          quality: 1,
          what: 'Fieldset has no accessible name'
        }
      }
    }
  },
  layoutTable: {
    weight: 2,
    packages: {
      testaro: {
        nonTable: {
          variable: false,
          quality: 1,
          what: 'table element fails the structural requirements for tabular data'
        }
      },
      wave: {
        'a:table_layout': {
          variable: false,
          quality: 1,
          what: 'table element is misused to arrange content'
        }
      }
    }
  },
  tableColumnsVary: {
    weight: 3,
    packages: {
      nuVal: {
        '^A table row was .+ columns wide, which is .+ than the column count established by the first row \\(.+\\).*$': {
          variable: true,
          quality: 1,
          what: 'Data or header cells are used for a table caption instead of a caption element'
        }
      }
    }
  },
  tableCaption: {
    weight: 1,
    packages: {
      axe: {
        'table-fake-caption': {
          variable: false,
          quality: 1,
          what: 'Data or header cells are used for a table caption instead of a caption element'
        }
      },
      htmlcs: {
        'w:AA.1_3_1.H39.3.NoCaption': {
          variable: false,
          quality: 1,
          what: 'Table has no caption element'
        }
      }
    }
  },
  cellHeadersNotInferrable: {
    weight: 4,
    packages: {
      htmlcs: {
        'e:AA.1_3_1.H43.HeadersRequired': {
          variable: false,
          quality: 1,
          what: 'Complex table requires headers attributes of cells'
        }
      },
      ibm: {
        Valerie_Table_DataCellRelationships: {
          variable: false,
          quality: 1,
          what: 'Not all th and td elements in the complex table have header or scope attributes'
        }
      }
    }
  },
  cellHeadersAmbiguityRisk: {
    weight: 2,
    packages: {
      htmlcs: {
        'w:AA.1_3_1.H43.ScopeAmbiguous': {
          variable: false,
          quality: 1,
          what: 'Complex table requires headers attributes of cells instead of header scopes'
        }
      }
    }
  },
  tableHeaderless: {
    weight: 3,
    packages: {
      continuum: {
        387: {
          variable: false,
          quality: 1,
          what: 'table element contains no th element or element with a rowheader or columnheader role'
        }
      },
      ibm: {
        RPT_Table_DataHeadingsAria: {
          variable: false,
          quality: 1,
          what: 'Data table does not identify headers'
        }
      }
    }
  },
  tableCellHeaderless: {
    weight: 3,
    packages: {
      alfa: {
        r77: {
          variable: false,
          quality: 1,
          what: 'Table cell has no header'
        }
      },
      axe: {
        'td-has-header': {
          variable: false,
          quality: 1,
          what: 'Cell in table larger than 3 by 3 has no header'
        }
      }
    }
  },
  tableHeaderCelless: {
    weight: 4,
    packages: {
      alfa: {
        r46: {
          variable: false,
          quality: 1,
          what: 'Header cell is not assigned to any cell'
        }
      },
      axe: {
        'th-has-data-cells': {
          variable: false,
          quality: 1,
          what: 'Table header refers to no cell'
        }
      }
    }
  },
  TableHeaderScopeRisk: {
    weight: 1,
    packages: {
      htmlcs: {
        'e:AA.1_3_1.H63.1': {
          variable: false,
          quality: 1,
          what: 'Not all th elements in the table have a scope attribute, so an inferred scope may be incorrect'
        }
      }
    }
  },
  tableHeaderEmpty: {
    weight: 2,
    packages: {
      wave: {
        'e:th_empty': {
          variable: false,
          quality: 1,
          what: 'th (table header) contains no text'
        }
      }
    }
  },
  controlNoText: {
    weight: 4,
    packages: {
      axe: {
        label: {
          variable: false,
          quality: 1,
          what: 'Form element has no label'
        }
      },
      htmlcs: {
        'e:AA.1_3_1.F68': {
          variable: false,
          quality: 1,
          what: 'Form control has no label'
        }
      },
      ibm: {
        WCAG20_Input_ExplicitLabel: {
          variable: false,
          quality: 1,
          what: 'Form control has no associated label'
        }
      },
      wave: {
        'e:label_missing': {
          variable: false,
          quality: 1,
          what: 'form element has no label'
        }
      }
    }
  },
  controlLabelInvisible: {
    weight: 4,
    packages: {
      axe: {
        'label-title-only': {
          variable: false,
          quality: 1,
          what: 'Form element has no visible label'
        }
      }
    }
  },
  titleAsLabel: {
    weight: 3,
    packages: {
      wave: {
        'a:label_title': {
          variable: false,
          quality: 1,
          what: 'Form control has a title but no label'
        }
      }
    }
  },
  visibleLabelNotName: {
    weight: 3,
    packages: {
      alfa: {
        r14: {
          variable: false,
          quality: 1,
          what: 'Visible label is not in the accessible name'
        }
      },
      axe: {
        'label-content-name-mismatch': {
          variable: false,
          quality: 1,
          what: 'Element visible text is not part of its accessible name'
        }
      },
      htmlcs: {
        'w:AA.2_5_3.F96': {
          variable: false,
          quality: 1,
          what: 'Visible label is not in the accessible name'
        }
      },
      ibm: {
        WCAG21_Label_Accessible: {
          variable: false,
          quality: 1,
          what: 'Accessible name does not match or contain the visible label text'
        }
      }
    }
  },
  targetSize: {
    weight: 3,
    packages: {
      tenon: {
        152: {
          variable: false,
          quality: 1,
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
          variable: false,
          quality: 1,
          what: 'Page contains many visible elements'
        }
      }
    }
  },
  activeEmbedding: {
    weight: 3,
    packages: {
      axe: {
        'nested-interactive': {
          variable: false,
          quality: 1,
          what: 'Interactive controls are nested'
        }
      },
      continuum: {
        22: {
          variable: false,
          quality: 1,
          what: 'Link contains an input, keygen, select, textarea, or button'
        }
      },
      nuVal: {
        'The element a must not appear as a descendant of an element with the attribute role=link.': {
          variable: false,
          quality: 1,
          what: 'a element is a descendant of an element with a link role'
        },
        'The element a must not appear as a descendant of an element with the attribute role=button.': {
          variable: false,
          quality: 1,
          what: 'a element is a descendant of an element with a button role'
        },
        'The element button must not appear as a descendant of the a element.': {
          variable: false,
          quality: 1,
          what: 'button element is a descendant of an a element'
        },
        'An element with the attribute tabindex must not appear as a descendant of the a element.': {
          variable: false,
          quality: 1,
          what: 'descendant of an a element has a tabindex attribute'
        },
        'An element with the attribute tabindex must not appear as a descendant of an element with the attribute role=link.': {
          variable: false,
          quality: 1,
          what: 'descendant of an element with a link role has a tabindex attribute'
        },
        'An element with the attribute tabindex must not appear as a descendant of an element with the attribute role=button.': {
          variable: false,
          quality: 1,
          what: 'descendant of an element with a button role has a tabindex attribute'
        },
        'An element with the attribute role=menu must not appear as a descendant of the a element.': {
          variable: false,
          quality: 1,
          what: 'Element with a menu role is a descendant of an a element'
        },
        'An element with the attribute role=menu must not appear as a descendant of an element with the attribute role=button.': {
          variable: false,
          quality: 1,
          what: 'Element with a menu role is a descendant of an element with a button role'
        }
      },
      testaro: {
        embAc: {
          variable: false,
          quality: 1,
          what: 'Active element is embedded in a link or button'
        }
      }
    }
  },
  tabFocusability: {
    weight: 4,
    packages: {
      ibm: {
        Rpt_Aria_MissingFocusableChild: {
          variable: false,
          quality: 1,
          what: 'UI component has no focusable child element for keyboard access'
        }
      },
      testaro: {
        focAll: {
          variable: false,
          quality: 0.5,
          what: 'Discrepancy between elements that should be and that are Tab-focusable'
        }
      }
    }
  },
  focusIndication: {
    weight: 4,
    packages: {
      alfa: {
        r65: {
          variable: false,
          quality: 1,
          what: 'Element in sequential focus order has no visible focus'
        }
      },
      testaro: {
        focInd: {
          variable: false,
          quality: 1,
          what: 'Focused element displaying no or nostandard focus indicator'
        }
      }
    }
  },
  allCaps: {
    weight: 1,
    packages: {
      alfa: {
        r72: {
          variable: false,
          quality: 1,
          what: 'Paragraph text is uppercased'
        }
      },
      tenon: {
        153: {
          variable: false,
          quality: 1,
          what: 'Long string of text is in all caps'
        }
      }
    }
  },
  allItalics: {
    weight: 1,
    packages: {
      alfa: {
        r85: {
          variable: false,
          quality: 1,
          what: 'Text of the paragraph is all italic'
        }
      },
      tenon: {
        154: {
          variable: false,
          quality: 1,
          what: 'Long string of text is italic'
        }
      }
    }
  },
  noLandmarks: {
    weight: 2,
    packages: {
      wave: {
        'a:region_missing': {
          variable: false,
          quality: 1,
          what: 'Page has no regions or ARIA landmarks'
        }
      }
    }
  },
  contentBeyondLandmarks: {
    weight: 2,
    packages: {
      alfa: {
        r57: {
          variable: false,
          quality: 1,
          what: 'Perceivable text content is not included in any landmark'
        }
      },
      axe: {
        region: {
          variable: false,
          quality: 1,
          what: 'Some page content is not contained by landmarks'
        }
      },
      ibm: {
        Rpt_Aria_OrphanedContent_Native_Host_Sematics: {
          variable: false,
          quality: 1,
          what: 'Content does not reside within an element with a landmark role'
        }
      }
    }
  },
  footerTopLandmark: {
    weight: 1,
    packages: {
      axe: {
        'landmark-contentinfo-is-top-level': {
          variable: false,
          quality: 1,
          what: 'contentinfo landmark (footer) is contained in another landmark'
        }
      }
    }
  },
  asideNotTop: {
    weight: 2,
    packages: {
      axe: {
        'landmark-complementary-is-top-level': {
          variable: false,
          quality: 1,
          what: 'complementary landmark (aside) is contained in another landmark'
        }
      }
    }
  },
  mainNotTop: {
    weight: 2,
    packages: {
      axe: {
        'landmark-main-is-top-level': {
          variable: false,
          quality: 1,
          what: 'main landmark is contained in another landmark'
        }
      }
    }
  },
  mainConfusion: {
    weight: 3,
    packages: {
      ibm: {
        Rpt_Aria_MultipleMainsRequireLabel_Implicit_2: {
          variable: false,
          quality: 1,
          what: 'Element with main role has no unique label among the main-role elements'
        },
        Rpt_Aria_MultipleMainsVisibleLabel_Implicit: {
          variable: false,
          quality: 1,
          what: 'Element with main role has no unique visible label among the main-role elements'
        }
      }
    }
  },
  mainNot1: {
    weight: 2,
    packages: {
      axe: {
        'landmark-one-main': {
          variable: false,
          quality: 1,
          what: 'page has no main landmark'
        },
        'landmark-no-duplicate-main': {
          variable: false,
          quality: 1,
          what: 'page has more than 1 main landmark'
        }
      },
      continuum: {
        809: {
          variable: false,
          quality: 1,
          what: 'More than 1 main element is located in the body element'
        }
      }
    }
  },
  bannerNot1: {
    weight: 2,
    packages: {
      axe: {
        'landmark-no-duplicate-banner': {
          variable: false,
          quality: 1,
          what: 'Page has more than 1 banner landmark'
        }
      },
      ibm: {
        Rpt_Aria_OneBannerInSiblingSet_Implicit: {
          variable: false,
          quality: 1,
          what: 'Multiple elements with a banner role are on the page'
        }
      }
    }
  },
  bannerNotTop: {
    weight: 2,
    packages: {
      axe: {
        'landmark-banner-is-top-level': {
          variable: false,
          quality: 1,
          what: 'banner landmark is contained in another landmark'
        }
      }
    }
  },
  footerConfusion: {
    weight: 3,
    packages: {
      ibm: {
        Rpt_Aria_MultipleContentinfoLandmarks_Implicit: {
          variable: false,
          quality: 1,
          what: 'Element with a contentinfo role has no unique purpose label among the contentinfo-role elements'
        }
      }
    }
  },
  footerNot1: {
    weight: 2,
    packages: {
      axe: {
        'landmark-no-duplicate-contentinfo': {
          variable: false,
          quality: 1,
          what: 'Page has more than 1 contentinfo landmark (footer)'
        }
      },
      ibm: {
        Rpt_Aria_MultipleContentinfoInSiblingSet_Implicit: {
          variable: false,
          quality: 1,
          what: 'Page, document, or application has more than one element with a contentinfo role'
        }
      }
    }
  },
  landmarkConfusion: {
    weight: 3,
    packages: {
      axe: {
        'landmark-unique': {
          variable: false,
          quality: 1,
          what: 'Landmark has a role and an accessible name that are identical to another'
        }
      },
      ibm: {
        landmark_name_unique: {
          variable: false,
          quality: 1,
          what: 'Landmark has no unique aria-labelledby or aria-label among landmarks in the same parent region'
        }
      }
    }
  },
  articleConfusion: {
    weight: 3,
    packages: {
      ibm: {
        Rpt_Aria_MultipleArticleRoles_Implicit: {
          variable: false,
          quality: 1,
          what: 'Element with an article role has no unique purpose label among the article-role elements'
        }
      }
    }
  },
  formConfusion: {
    weight: 3,
    packages: {
      ibm: {
        Rpt_Aria_MultipleFormLandmarks_Implicit: {
          variable: false,
          quality: 1,
          what: 'Element with a form role has no unique purpose label among the form-role elements'
        }
      }
    }
  },
  applicationConfusion: {
    weight: 3,
    packages: {
      ibm: {
        Rpt_Aria_MultipleApplicationLandmarks: {
          variable: false,
          quality: 1,
          what: 'Element with an application role has no unique purpose label among the application-role elements'
        }
      }
    }
  },
  asideConfusion: {
    weight: 3,
    packages: {
      continuum: {
        527: {
          variable: false,
          quality: 1,
          what: 'aside element has an accessible name that is non-unique among the aside elements'
        }
      },
      ibm: {
        Rpt_Aria_MultipleComplementaryLandmarks_Implicit: {
          variable: false,
          quality: 1,
          what: 'Element with a complementary role has no unique purpose label among the complementary-role elements'
        }
      }
    }
  },
  bannerConfusion: {
    weight: 3,
    packages: {
      ibm: {
        Rpt_Aria_MultipleBannerLandmarks_Implicit: {
          variable: false,
          quality: 1,
          what: 'Element with a banner role has no unique purpose label among the banner-role elements'
        }
      }
    }
  },
  navConfusion: {
    weight: 3,
    packages: {
      continuum: {
        531: {
          variable: false,
          quality: 1,
          what: 'nav element has an accessible name that is non-unique among the nav elements'
        }
      },
      ibm: {
        Rpt_Aria_MultipleNavigationLandmarks_Implicit: {
          variable: false,
          quality: 1,
          what: 'Element with a navigation role has no unique purpose label among the navigation-role elements'
        }
      }
    }
  },
  regionConfusion: {
    weight: 3,
    packages: {
      ibm: {
        Rpt_Aria_MultipleRegionsUniqueLabel_Implicit: {
          variable: false,
          quality: 1,
          what: 'Element with a region role has no unique label among the region-role elements'
        }
      }
    }
  },
  searchConfusion: {
    weight: 3,
    packages: {
      ibm: {
        Rpt_Aria_MultipleSearchLandmarks: {
          variable: false,
          quality: 1,
          what: 'Element with a search role has no unique purpose label among the search-role elements'
        }
      }
    }
  },
  asideNoText: {
    weight: 3,
    packages: {
      continuum: {
        532: {
          variable: false,
          quality: 1,
          what: 'aside element is not the only aside element but has no accessible name'
        }
      }
    }
  },
  complementaryNoText: {
    weight: 1,
    packages: {
      ibm: {
        Rpt_Aria_ComplementaryRequiredLabel_Implicit: {
          variable: false,
          quality: 1,
          what: 'Element has a complementary role but has no label'
        },
        Rpt_Aria_ComplementaryLandmarkLabel_Implicit: {
          variable: false,
          quality: 1,
          what: 'Element with a complementary role has no visible purpose label'
        }
      }
    }
  },
  navNoText: {
    weight: 3,
    packages: {
      continuum: {
        533: {
          variable: false,
          quality: 1,
          what: 'nav element is not the only nav element but has no accessible name'
        }
      }
    }
  },
  labelNoText: {
    weight: 4,
    packages: {
      ibm: {
        Valerie_Label_HasContent: {
          variable: false,
          quality: 1,
          what: 'label element has no non-empty purpose-descriptive text'
        }
      }
    }
  },
  focusableOperable: {
    weight: 3,
    packages: {
      testaro: {
        focOp: {
          variable: false,
          quality: 1,
          what: 'Operable elements that cannot be Tab-focused and vice versa'
        }
      }
    }
  },
  focusableRole: {
    weight: 3,
    packages: {
      axe: {
        'focus-order-semantics': {
          variable: false,
          quality: 1,
          what: 'Focusable element has no active role'
        }
      }
    }
  },
  focusableHidden: {
    weight: 4,
    packages: {
      alfa: {
        r17: {
          variable: false,
          quality: 1,
          what: 'Tab-focusable element is or has an ancestor that is aria-hidden'
        }
      },
      axe: {
        'aria-hidden-focus': {
          variable: false,
          quality: 1,
          what: 'ARIA hidden element is focusable or contains a focusable element'
        },
        'presentation-role-conflict': {
          variable: false,
          quality: 1,
          what: 'Element has a none/presentation role but is focusable or has a global ARIA state or property'
        }
      },
      continuum: {
        790: {
          variable: false,
          quality: 1,
          what: 'Element with an explicit or implicit nonnegative tabindex attribute is directly aria-hidden'
        }
      },
      ibm: {
        aria_hidden_focus_misuse: {
          variable: false,
          quality: 1,
          what: 'Focusable element is within the subtree of an element with aria-hidden set to true'
        }
      },
      tenon: {
        189: {
          variable: false,
          quality: 1,
          what: 'Element is typically used for interaction but has a presentation role'
        },
        194: {
          variable: false,
          quality: 1,
          what: 'Visible element is focusable but has a presentation role or aria-hidden=true attribute'
        }
      }
    }
  },
  focusedAway: {
    weight: 3,
    packages: {
      testaro: {
        focVis: {
          variable: false,
          quality: 1,
          what: 'Element when focused is off the display'
        }
      }
    }
  },
  focusableDescendants: {
    weight: 4,
    packages: {
      alfa: {
        r90: {
          variable: false,
          quality: 1,
          what: 'Element has a role making its children presentational but contains a focusable element'
        }
      }
    }
  },
  labeledHidden: {
    weight: 2,
    packages: {
      htmlcs: {
        'w:AA.1_3_1.F68.Hidden': {
          variable: false,
          quality: 1,
          what: 'Hidden form field is needlessly labeled.'
        },
        'w:AA.1_3_1.F68.HiddenAttr': {
          variable: false,
          quality: 1,
          what: 'Form field with a hidden attribute is needlessly labeled.'
        }
      }
    }
  },
  hiddenContentRisk: {
    weight: 1,
    packages: {
      axe: {
        'hidden-content': {
          variable: false,
          quality: 1,
          what: 'Some content is hidden and therefore may not be testable for accessibility'
        }
      }
    }
  },
  frameContentRisk: {
    weight: 1,
    packages: {
      axe: {
        'frame-tested': {
          variable: false,
          quality: 0.2,
          what: 'Some content is in an iframe and therefore may not be testable for accessibility'
        }
      }
    }
  },
  frameSandboxRisk: {
    weight: 2,
    packages: {
      nuVal: {
        '^Potentially bad value .+ for attribute sandbox on element iframe: Setting both allow-scripts and allow-same-origin is not recommended, because it effectively enables an embedded page to break out of all sandboxing.*$': {
          variable: true,
          quality: 1,
          what: 'iframe element has a vulnerable sandbox value containing both allow-scripts and allow-same-origin'
        }
      }
    }
  },
  hoverSurprise: {
    weight: 1,
    packages: {
      testaro: {
        hover: {
          variable: false,
          quality: 1,
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
          variable: false,
          quality: 1,
          what: 'Incompatible label types'
        }
      },
      ibm: {
        RPT_Label_UniqueFor: {
          variable: false,
          quality: 1,
          what: 'Form control does not have exactly one label'
        }
      },
      wave: {
        'e:label_multiple': {
          variable: false,
          quality: 1,
          what: 'Form control has more than one label associated with it'
        }
      }
    }
  },
  labelEmpty: {
    weight: 3,
    packages: {
      htmlcs: {
        'w:AA.1_3_1.ARIA6': {
          variable: false,
          quality: 1,
          what: 'Value of the aria-label attribute of the form control is empty or only whitespace'
        },
        'w:AA.4_1_2.ARIA6': {
          variable: false,
          quality: 1,
          what: 'Value of the aria-label attribute of the form control is empty or only whitespace'
        }
      },
      wave: {
        'e:label_empty': {
          variable: false,
          quality: 1,
          what: 'Empty form label'
        }
      }
    }
  },
  linkComprehensionRisk: {
    weight: 1,
    packages: {
      wave: {
        'a:link_suspicious': {
          variable: false,
          quality: 1,
          what: 'Suspicious link text'
        }
      }
    }
  },
  nonWebLink: {
    weight: 1,
    packages: {
      continuum: {
        141: {
          variable: false,
          quality: 1,
          what: 'a element has an href attribute set to an image file reference'
        }
      },
      wave: {
        'a:link_excel': {
          variable: false,
          quality: 1,
          what: 'Link to Microsoft Excel workbook'
        },
        'a:link_word': {
          variable: false,
          quality: 1,
          what: 'Link to Microsoft Word document'
        }
      }
    }
  },
  linkVague: {
    weight: 3,
    packages: {
      tenon: {
        73: {
          variable: false,
          quality: 1,
          what: 'Link text is too generic to communicate the purpose or destination'
        }
      }
    }
  },
  linkIndication: {
    weight: 2,
    packages: {
      alfa: {
        r62: {
          variable: false,
          quality: 1,
          what: 'Inline link is not distinct from the surrounding text except by color'
        }
      },
      axe: {
        'link-in-text-block': {
          variable: false,
          quality: 1,
          what: 'Link is not distinct from surrounding text without reliance on color'
        }
      },
      testaro: {
        linkUl: {
          variable: false,
          quality: 1,
          what: 'Non-underlined adjacent links'
        }
      }
    }
  },
  menuNavigation: {
    weight: 2,
    packages: {
      testaro: {
        menuNav: {
          variable: false,
          quality: 1,
          what: 'Nonstandard keyboard navigation among focusable menu items'
        }
      }
    }
  },
  menuItemless: {
    weight: 4,
    packages: {
      wave: {
        'e:aria_menu_broken': {
          variable: false,
          quality: 1,
          what: 'ARIA menu does not contain required menu items'
        }
      }
    }
  },
  tabNavigation: {
    weight: 2,
    packages: {
      testaro: {
        tabNav: {
          variable: false,
          quality: 1,
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
          variable: false,
          quality: 1,
          what: 'Change of visible content not requested by user'
        }
      }
    }
  },
  autoplay: {
    weight: 2,
    packages: {
      axe: {
        'no-autoplay-audio': {
          variable: false,
          quality: 1,
          what: 'video or audio element plays automatically'
        }
      }
    }
  },
  divParentBad: {
    weight: 4,
    packages: {
      nuVal: {
        'Element div not allowed as child of element button in this context. (Suppressing further errors from this subtree.)': {
          variable: false,
          quality: 1,
          what: 'div element has a button element as its parent'
        }
      }
    }
  },
  pParentBad: {
    weight: 4,
    packages: {
      nuVal: {
        'Element p not allowed as child of element strong in this context. (Suppressing further errors from this subtree.)': {
          variable: false,
          quality: 1,
          what: 'p element has a strong element as its parent'
        }
      }
    }
  },
  styleParentBad: {
    weight: 4,
    packages: {
      nuVal: {
        'Element style not allowed as child of element body in this context. (Suppressing further errors from this subtree.)': {
          variable: false,
          quality: 1,
          what: 'style element not allowed as a child of the body element'
        },
        'Element style not allowed as child of element div in this context. (Suppressing further errors from this subtree.)': {
          variable: false,
          quality: 1,
          what: 'style element not allowed as a child of this div element'
        },
        'Element style not allowed as child of element main in this context. (Suppressing further errors from this subtree.)': {
          variable: false,
          quality: 1,
          what: 'style element not allowed as a child of this main element'
        },
        'Element style not allowed as child of element footer in this context. (Suppressing further errors from this subtree.)': {
          variable: false,
          quality: 1,
          what: 'style element not allowed as a child of this footer element'
        }
      }
    }
  },
  inconsistentStyles: {
    weight: 1,
    packages: {
      testaro: {
        styleDiff: {
          variable: false,
          quality: 1,
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
          variable: false,
          quality: 1,
          what: 'Layering with nondefault z-index values'
        }
      }
    }
  },
  tabIndexPositive: {
    weight: 1,
    packages: {
      axe: {
        tabindex: {
          variable: false,
          quality: 1,
          what: 'Positive tabIndex risks creating a confusing focus order'
        }
      },
      wave: {
        'a:tabindex': {
          variable: false,
          quality: 1,
          what: 'tabIndex value positive'
        }
      }
    }
  },
  tabIndexBad: {
    weight: 4,
    packages: {
      nuVal: {
        '^Bad value  for attribute tabindex on element .+: The empty string is not a valid integer.*$': {
          variable: true,
          quality: 1,
          what: 'tabindex attribute has an empty value instead of an integer'
        }
      }
    }
  },
  tabIndexMissing: {
    weight: 4,
    packages: {
      continuum: {
        337: {
          variable: false,
          quality: 1,
          what: 'Enabled element with a button role has no nonpositive tabindex attribute'
        },
        356: {
          variable: false,
          quality: 1,
          what: 'Enabled element with a textbox role has no nonpositive tabindex attribute'
        }
      },
      tenon: {
        190: {
          variable: false,
          quality: 1,
          what: 'Interactive item is not natively actionable, but has no tabindex=0 attribute'
        }
      }
    }
  },
  trackNoLabel: {
    weight: 4,
    packages: {
      continuum: {
        40: {
          variable: false,
          quality: 1,
          what: 'captions track element has no label attribute set to a text value'
        },
        368: {
          variable: false,
          quality: 1,
          what: 'subtitle track element has no label attribute set to a text value'
        }
      }
    }
  },
  audioCaptionMissing: {
    weight: 4,
    packages: {
      axe: {
        'audio-caption': {
          variable: false,
          quality: 1,
          what: 'audio element has no captions track'
        }
      }
    }
  },
  videoCaptionMissing: {
    weight: 4,
    packages: {
      axe: {
        'video-caption': {
          variable: false,
          quality: 1,
          what: 'video element has no captions'
        }
      }
    }
  },
  videoCaptionRisk: {
    weight: 1,
    packages: {
      wave: {
        'a:html5_video_audio': {
          variable: false,
          quality: 1,
          what: 'video or audio element may have no or incorrect captions, transcript, or audio description'
        },
        'a:audio_video': {
          variable: false,
          quality: 1,
          what: 'audio or video file or link may have no or incorrect captions, transcript, or audio description'
        },
        'a:youtube_video': {
          variable: false,
          quality: 1,
          what: 'YouTube video may have no or incorrect captions'
        }
      }
    }
  },
  notKeyboardScrollable: {
    weight: 4,
    packages: {
      alfa: {
        r84: {
          variable: false,
          quality: 1,
          what: 'Element is scrollable but not by keyboard'
        }
      },
      axe: {
        'scrollable-region-focusable': {
          variable: false,
          quality: 1,
          what: 'Element is scrollable but has no keyboard access'
        }
      }
    }
  },
  horizontalScrolling: {
    weight: 3,
    packages: {
      tenon: {
        28: {
          variable: false,
          quality: 1,
          what: 'Layout or sizing of the page causes horizontal scrolling'
        }
      }
    }
  },
  scrollRisk: {
    weight: 1,
    packages: {
      htmlcs: {
        'w:AA.1_4_10.C32,C31,C33,C38,SCR34,G206': {
          variable: false,
          quality: 1,
          what: 'Fixed-position element may force bidirectional scrolling'
        }
      }
    }
  },
  skipRepeatedContent: {
    weight: 3,
    packages: {
      alfa: {
        'r87': {
          variable: false,
          quality: 0.5,
          what: 'First focusable element is not a link to the main content'
        }
      },
      axe: {
        'bypass': {
          variable: false,
          quality: 1,
          what: 'Page has no means to bypass repeated blocks'
        },
        'skip-link': {
          variable: false,
          quality: 1,
          what: 'Skip-link target is not focusable or does not exist'
        }
      },
      ibm: {
        WCAG20_Body_FirstASkips_Native_Host_Sematics: {
          variable: false,
          quality: 0.5,
          what: 'Page provides no way to skip directly to the main content'
        }
      },
      wave: {
        'e:link_skip_broken': {
          variable: false,
          quality: 1,
          what: 'Skip-navigation link has no target or is not keyboard accessible'
        }
      }
    }
  },
  submitButton: {
    weight: 3,
    packages: {
      htmlcs: {
        'e:AA.3_2_2.H32.2': {
          variable: false,
          quality: 1,
          what: 'Form has no submit button'
        }
      }
    }
  },
  fragmentaryNoticeRisk: {
    weight: 2,
    packages: {
      alfa: {
        r54: {
          variable: false,
          quality: 1,
          what: 'Assertive region is not atomic'
        }
      }
    }
  },
  noScriptRisk: {
    weight: 1,
    packages: {
      wave: {
        'a:noscript': {
          variable: false,
          quality: 1,
          what: 'noscript element may fail to contain an accessible equivalent or alternative'
        }
      }
    }
  },
  browserSupportRisk: {
    weight: 1,
    packages: {
      nuVal: {
        'The inputmode attribute is not supported in all browsers. Please be sure to test, and consider using a polyfill.': {
          variable: false,
          quality: 1,
          what: 'inputmode attribute may be unsupported by some browsers'
        }
      }
    }
  },
  obsolete: {
    weight: 3,
    packages: {
      alfa: {
        r70: {
          variable: false,
          quality: 1,
          what: 'Element is obsolete or deprecated'
        }
      },
      htmlcs: {
        'e:AA.1_3_1.H49.AlignAttr': {
          variable: false,
          quality: 1,
          what: 'align attribute is obsolete'
        },
        'e:AA.1_3_1.H49.Center': {
          variable: false,
          quality: 1,
          what: 'center element is obsolete'
        },
        'e:AA.1_3_1.H49.Font': {
          variable: false,
          quality: 1,
          what: 'font element is obsolete'
        }
      },
      ibm: {
        aria_attribute_deprecated: {
          variable: false,
          quality: 1,
          what: 'ARIA role or attribute is deprecated'
        },
        combobox_version: {
          variable: false,
          quality: 1,
          what: 'combobox design pattern is invalid for ARIA 1.2'
        },
        element_attribute_deprecated: {
          variable: false,
          quality: 1,
          what: 'Element or attribute is obsolete'
        }
      },
      nuVal: {
        'Obsolete doctype. Expected <!DOCTYPE html>.': {
          variable: false,
          quality: 1,
          what: 'DOCTYPE is obsolete instead of html'
        },
        'The border attribute is obsolete. Consider specifying img { border: 0; } in CSS instead.': {
          variable: false,
          quality: 1,
          what: 'border element is obsolete'
        },
        'The center element is obsolete. Use CSS instead.': {
          variable: false,
          quality: 1,
          what: 'center element is obsolete'
        },
        'The font element is obsolete. Use CSS instead.': {
          variable: false,
          quality: 1,
          what: 'font element is obsolete'
        },
        '^The .+ attribute on the .+ element is obsolete.+$': {
          variable: true,
          quality: 1,
          what: 'attribute is obsolete on its element'
        },
        'The only allowed value for the charset attribute for the script element is utf-8. (But the attribute is not needed and should be omitted altogether.)': {
          variable: false,
          quality: 1,
          what: 'charset attribute has a value other than utf-8 and is unnecessary'
        },
        'Using the meta element to specify the document-wide default language is obsolete. Consider specifying the language on the root element instead.': {
          variable: false,
          quality: 1,
          what: 'language declaration in a meta element is obsolete'
        },
        'The name attribute is obsolete. Consider putting an id attribute on the nearest container instead.': {
          variable: false,
          quality: 1,
          what: 'name attribute is obsolete'
        },
        '^CSS: Deprecated media feature .+$': {
          variable: true,
          quality: 1,
          what: 'Media feature is deprecated'
        }
      },
      wave: {
        'a:longdesc': {
          variable: false,
          quality: 1,
          what: 'longdesc attribute is obsolete'
        },
        'a:flash': {
          variable: false,
          quality: 1,
          what: 'Flash content is present'
        }
      }
    }
  },
  parseError: {
    weight: 3,
    packages: {
      ibm: {
        'Rpt_Aria_InvalidTabindexForActivedescendant': {
          variable: false,
          quality: 1,
          what: 'Element with an aria-activedescendant attribute has no nonpositive tabindex attribute'
        }
      },
      nuVal: {
        'CSS: font-size: One operand must be a number.': {
          variable: false,
          quality: 1,
          what: 'CSS font-size property has no numeric operand'
        },
        '^CSS: .+: Parse Error.*$': {
          variable: true,
          quality: 1,
          what: 'Invalid CSS'
        },
        '^CSS: .+: .+ is not a valid color 3 or 6 hexadecimals numbers.*$': {
          variable: true,
          quality: 1,
          what: 'Invalid hexadecimal color in CSS'
        },
        '^CSS: .+: .+ is not a .+ value.*$': {
          variable: true,
          quality: 1,
          what: 'Invalid value in CSS'
        },
        '^CSS: .+: Property .+ doesn\'t exist.*$': {
          variable: true,
          quality: 1,
          what: 'Invalid property in CSS'
        },
        '^CSS: .+: only 0 can be a length. You must put a unit after your number.*$': {
          variable: true,
          quality: 1,
          what: 'Length in CSS is nonzero but has no unit'
        },
        '^CSS: .+: only 0 can be a unit. You must put a unit after your number.*$': {
          variable: true,
          quality: 1,
          what: 'Number in CSS is nonzero but has no unit'
        },
        'CSS: Parse Error.': {
          variable: false,
          quality: 1,
          what: 'Invalid CSS'
        },
        '^CSS: .+: Too many values or values are not recognized.+$': {
          variable: true,
          quality: 1,
          what: 'Invalid CSS value or too many values'
        },
        '^CSS: .+: Invalid type: .+$': {
          variable: true,
          quality: 1,
          what: 'Invalid type of CSS value'
        },
        '^CSS: .+: The types are incompatible.*$': {
          variable: true,
          quality: 1,
          what: 'Incompatible types of CSS values'
        },
        '^CSS: .+: Unknown dimension.*$': {
          variable: true,
          quality: 1,
          what: 'Unknown CSS dimension'
        },
        '^CSS: .+: Character array is missing "e" notation exponential mark.*$': {
          variable: true,
          quality: 1,
          what: 'Character array has no exponent mark e'
        },
        '^CSS: .+:   is an incorrect operator.*$': {
          variable: true,
          quality: 1,
          what: 'Space is misused as a CSS operator'
        },
        '^CSS: Unknown pseudo-element or pseudo-class :.+$': {
          variable: true,
          quality: 1,
          what: 'Unknown pseudo-element or pseudo-class'
        },
        '^CSS: unrecognized media .+$': {
          variable: true,
          quality: 1,
          what: 'Unrecognized media value'
        },
        'CSS: This profile has a very specific syntax for @charset: @charset followed by exactly one space, followed by the name of the encoding in quotes, followed immediately by a semicolon.': {
          variable: false,
          quality: 1,
          what: 'CSS @charset at-rule has an invalid format'
        },
        '^The aria-hidden attribute must not be specified on the .+ element.*$': {
          variable: true,
          quality: 1,
          what: 'aria-hidden attribute is invalid for its element'
        },
        'The aria-hidden attribute must not be specified on an input element whose type attribute has the value hidden.': {
          variable: false,
          quality: 1,
          what: 'aria-hidden attribute is invalid for an input element with type="hidden"'
        },
        '^Stray start tag .+$': {
          variable: true,
          quality: 1,
          what: 'Invalid opening tag'
        },
        '^Stray end tag .+$': {
          variable: true,
          quality: 1,
          what: 'Invalid closing tag'
        },
        '^Start tag .+ seen but an element of the same type was already open.*$': {
          variable: true,
          quality: 1,
          what: 'Element is invalidly a descendant of another such element'
        },
        '^Bad start tag in .+$': {
          variable: true,
          quality: 1,
          what: 'Invalid start tag'
        },
        '^End tag .+ violates nesting rules.*$': {
          variable: true,
          quality: 1,
          what: 'End tag violates nesting rules'
        },
        '^Element .+ not allowed as child of element .+ in this context.*$': {
          variable: true,
          quality: 1,
          what: 'Element not allowed as a child of its parent here'
        },
        'Saw <!-- within a comment. Probable cause: Nested comment (not allowed).': {
          variable: false,
          quality: 1,
          what: 'Comment is nested within a comment'
        },
        'Saw < when expecting an attribute name. Probable cause: Missing > immediately before.': {
          variable: false,
          quality: 1,
          what: '< character appears where an attribute name must appear'
        },
        'The document is not mappable to XML 1.0 due to two consecutive hyphens in a comment.': {
          variable: false,
          quality: 1,
          what: 'Comment contains --'
        },
        '^Element name .+ cannot be represented as XML 1\\.0.*$': {
          variable: true,
          quality: 1,
          what: 'Invalid element name'
        },
        '^Forbidden code point U+.+$': {
          variable: true,
          quality: 1,
          what: 'Invalid Unicode code point'
        },
        '^Internal encoding declaration .+ disagrees with the actual encoding of the document.*$': {
          variable: true,
          quality: 1,
          what: 'Encoding declaration disagrees with the actual encoding of the page'
        },
        'Text run is not in Unicode Normalization Form C.': {
          variable: false,
          quality: 1,
          what: 'Text run is not in Unicode Normalization Form C.'
        },
        'Quote \" in attribute name. Probable cause: Matching quote missing somewhere earlier.': {
          variable: false,
          quality: 1,
          what: 'Attribute name includes a double quotation mark'
        },
        '^No .+ element in scope but a .+ end tag seen.*$': {
          variable: true,
          quality: 1,
          what: 'End tag for an element that is not in scope'
        },
        'Element script must not have attribute async unless attribute src is also specified or unless attribute type is specified with value module.': {
          variable: false,
          quality: 1,
          what: 'script element has an async attribute but has no src or value=module attribute'
        },
        '^Bad value .* for attribute href on element .+: Illegal character in path segment: .+ is not allowed.*$': {
          variable: true,
          quality: 1,
          what: 'href attribute path value contains an invalid character in a segment'
        },
        '^Bad value .* for attribute src on element .+: Illegal character in path segment: .+ is not allowed.*$': {
          variable: true,
          quality: 1,
          what: 'src attribute path value contains an invalid character in a segment'
        },
        '^Bad value .* for attribute href on element .+: Illegal character in query: .+ is not allowed.*$': {
          variable: true,
          quality: 1,
          what: 'href attribute query value contains an invalid character'
        },
        '^Bad value .* for attribute src on element .+: Illegal character in query: .+ is not allowed.*$': {
          variable: true,
          quality: 1,
          what: 'src attribute query value contains an invalid character'
        },
        '^Bad value .+ for attribute src on element .+: Tab, new line or carriage return found.*$': {
          variable: true,
          quality: 1,
          what: 'src attribute value contains a tab, newline, or return character'
        },
        '^Text not allowed in element .+ in this context.*$': {
          variable: true,
          quality: 1,
          what: 'Element contains text, which is not allowed here'
        },
        'Element source is missing required attribute srcset.': {
          variable: false,
          quality: 1,
          what: 'source element has no srcset attribute'
        },
        '^The .+ element must not appear as a descendant of the .+ element.*$': {
          variable: true,
          quality: 1,
          what: 'Element has an invalid ancestor'
        },
        '^The element .+ must not appear as a descendant of the .+ element.*$': {
          variable: true,
          quality: 1,
          what: 'Element has an invalid ancestor'
        },
        'The first child option element of a select element with a required attribute, and without a multiple attribute, and without a size attribute whose value is greater than 1, must have either an empty value attribute, or must have no text content. Consider either adding a placeholder option label, or adding a size attribute with a value equal to the number of option elements.': {
          variable: false,
          quality: 1,
          what: 'option element has a nonempty value'
        },
        'When the srcset attribute has any image candidate string with a width descriptor, the sizes attribute must also be present.': {
          variable: false,
          quality: 1,
          what: 'element with a srcset attribute with a width has no sizes attribute'
        },
        '^An element with role=.+ must be contained in, or owned by, an element with role=.+$': {
          variable: true,
          quality: 1,
          what: 'Element has no required container or owner'
        },
        '^The text content of element .+ was not in the required format: Expected .+ but found .+ instead.*$': {
          variable: true,
          quality: 1,
          what: 'Element has text content with invalid format'
        },
        'Element script must not have attribute charset unless attribute src is also specified.': {
          variable: false,
          quality: 1,
          what: 'script element has a charset attribute but no src attribute'
        },
        '^CSS: .+: Missing a semicolon before the .+$': {
          variable: true,
          quality: 1,
          what: 'semicolon missing in CSS'
        },
        '^java.util.concurrent.TimeoutException: Idle timeout expired: .+ ms.*$': {
          variable: true,
          quality: 1,
          what: 'Idle timeout expired'
        }
      }
    }
  },
  encodingBad: {
    weight: 4,
    packages: {
      nuVal: {
        'Document uses the Unicode Private Use Area(s), which should not be used in publicly exchanged documents. (Charmod C073)': {
          variable: false,
          quality: 1,
          what: 'Page includes a Unicode PUA character'
        }
      }
    }
  },
  fatalError: {
    weight: 50,
    packages: {
      nuVal: {
        'Cannot recover after last error. Any further errors will be ignored.': {
          variable: false,
          quality: 1,
          what: 'Testing was interrupted by a fatal error'
        }
      }
    }
  }
};

// VARIABLES

let packageDetails = {};
let groupDetails = {};
let summary = {};
let preventionScores = {};

// FUNCTIONS

// Initialize the variables.
const init = () => {
  packageDetails = {};
  groupDetails = {
    groups: {},
    solos: {}
  };
  summary = {
    total: 0,
    log: 0,
    preventions: 0,
    solos: 0,
    groups: []
  };
  preventionScores = {};
};

// Adds a score to the package details.
const addDetail = (actWhich, testID, addition = 1) => {
  if (addition) {
    if (!packageDetails[actWhich]) {
      packageDetails[actWhich] = {};
    }
    if (!packageDetails[actWhich][testID]) {
      packageDetails[actWhich][testID] = 0;
    }
    packageDetails[actWhich][testID] += Math.round(addition);
  }
};
// Scores a report.
exports.scorer = async report => {
  // Initialize the variables.
  init();
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
        if (which === 'alfa') {
          const issues = test.result && test.result.items;
          if (issues && Array.isArray(issues)) {
            issues.forEach(issue => {
              const {verdict, rule} = issue;
              if (verdict && rule) {
                const {ruleID} = rule;
                if (ruleID) {
                  // Add 4 per failure, 1 per warning (cantTell).
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
        else if (which === 'continuum') {
          const issues = test.result;
          if (issues && Array.isArray(issues)) {
            issues.forEach(issue => {
              // Add 4 per violation.
              addDetail(which, issue.engineTestId, 4);
            });
          }
        }
        else if (which === 'htmlcs') {
          const issues = test.result;
          if (issues) {
            ['Error', 'Warning'].forEach(issueClassName => {
              const classData = issues[issueClassName];
              if (classData) {
                const issueTypes = Object.keys(classData);
                issueTypes.forEach(issueTypeName => {
                  const issueArrays = Object.values(classData[issueTypeName]);
                  const issueCount = issueArrays.reduce((count, array) => count + array.length, 0);
                  const classCode = issueClassName[0].toLowerCase();
                  const code = `${classCode}:${issueTypeName}`;
                  // Add 4 per error, 1 per warning.
                  const weight = classCode === 'e' ? 4 : 1;
                  addDetail(which, code, weight * issueCount);
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
                const {ruleId, level} = issue;
                if (ruleId && level) {
                  // Add 4 per violation, 1 per warning (recommendation).
                  addDetail(which, ruleId, level === 'violation' ? 4 : 1);
                }
              });
            }
          }
        }
        else if (which === 'nuVal') {
          const issues = test.result && test.result.messages;
          if (issues) {
            issues.forEach(issue => {
              // Add 4 per error, 1 per warning.
              const weight = issue.type === 'error' ? 4 : 1;
              addDetail(which, issue.message, weight);
            });
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
                      // Add 4 per error, 3 per contrast error, 1 per warning (alert).
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
            // Add 2 per unfocusable, 0.5 per inoperable element.
            addDetail('testaro', which, 2 * noFocCount + 0.5 * noOpCount);
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
            + 0.3 * additions
            + removals
            + 0.2 * opacityChanges
            + 0.1 * opacityImpact
            + unhoverables;
            if (score) {
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
          if (totals) {
            const {total, inSet} = totals;
            const score = total - inSet || 0;
            // Add 1 per misgrouped radio button.
            addDetail('testaro', which, score);
          }
        }
        else if (which === 'role') {
          const badCount = test.result && test.result.badRoleElements || 0;
          const redundantCount = test.result && test.result.redundantRoleElements || 0;
          // Add 2 per bad role and 1 per redundant role.
          addDetail('testaro', which, 2 * badCount + redundantCount);
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
      const roundedScore = Math.round(preventionScore);
      summary.preventions = roundedScore;
      summary.total += roundedScore;
      // Reorganize the group data.
      const testGroups = {
        testaro: {},
        alfa: {},
        axe: {},
        continuum: {},
        htmlcs: {},
        ibm: {},
        nuVal: {},
        tenon: {},
        wave: {}
      };
      const testMatchers = {};
      Object.keys(groups).forEach(groupName => {
        Object.keys(groups[groupName].packages).forEach(packageName => {
          Object.keys(groups[groupName].packages[packageName]).forEach(testID => {
            testGroups[packageName][testID] = groupName;
            if (groups[groupName].packages[packageName][testID].variable) {
              if (! testMatchers[packageName]) {
                testMatchers[packageName] = [];
              }
              testMatchers[packageName].push(new RegExp(testID, 's'));
            }
          });
        });
      });
      // Populate the group details with group and solo test scores.
      // For each package with any scores:
      Object.keys(packageDetails).forEach(packageName => {
        const matchers = testMatchers[packageName];
        let testClass = '';
        // For each test with any scores in the package:
        Object.keys(packageDetails[packageName]).forEach(testID => {
          // Determine whether the test is in a group.
          let groupName = testGroups[packageName][testID];
          // If not:
          if (! groupName) {
            // Determine whether the package has test classes and the class is in a group.
            testClass = matchers && matchers.find(matcher => matcher.test(testID));
            if (testClass) {
              testID = testClass.source;
              groupName = testGroups[packageName][testID];
            }
          }
          // If the test or its class is in a group:
          if (groupName) {
            // Determine the preweighted or group-weighted score.
            if (! groupDetails.groups[groupName]) {
              groupDetails.groups[groupName] = {};
            }
            if (! groupDetails.groups[groupName][packageName]) {
              groupDetails.groups[groupName][packageName] = {};
            }
            let weightedScore = packageDetails[packageName][testID];
            if (!preWeightedPackages.includes(groupName)) {
              weightedScore *= groups[groupName].weight / 4;
            }
            // Adjust the score for the quality of the test.
            weightedScore *= groups[groupName].packages[packageName][testID].quality;
            // Round the score, but not to less than 1.
            const roundedScore = Math.max(Math.round(weightedScore), 1);
            // Add the rounded score and the test description to the group details.
            groupDetails.groups[groupName][packageName][testID] = {
              score: roundedScore,
              what: groups[groupName].packages[packageName][testID].what
            };
          }
          // Otherwise, if the package has varying test names and the test belongs to a class:
          else if (matchers && (testCode = matchers.find(matcher => matcher.test(testID)))) {

          }
          // Otherwise, i.e. if the test is solo:
          else {
            if (! groupDetails.solos[packageName]) {
              groupDetails.solos[packageName] = {};
            }
            const roundedScore = Math.round(packageDetails[packageName][testID]);
            groupDetails.solos[packageName][testID] = roundedScore;
          }
        });
      });
      // Determine the group scores and add them to the summary.
      const groupNames = Object.keys(groupDetails.groups);
      const {absolute, largest, smaller} = groupWeights;
      // For each group with any scores:
      groupNames.forEach(groupName => {
        const scores = [];
        // For each package with any scores in the group:
        const groupPackageData = Object.values(groupDetails.groups[groupName]);
        groupPackageData.forEach(packageObj => {
          // Get the sum of the scores of the tests of the package in the group.
          const scoreSum = Object.values(packageObj).reduce(
            (sum, current) => sum + current.score,
            0
          );
          // Add the sum to the list of package scores in the group.
          scores.push(scoreSum);
        });
        // Sort the scores in descending order.
        scores.sort((a, b) => b - a);
        // Compute the sum of the absolute score and the weighted largest and other scores.
        const groupScore = absolute
        + largest * scores[0]
        + smaller * scores.slice(1).reduce((sum, current) => sum + current, 0);
        const roundedGroupScore = Math.round(groupScore);
        summary.groups.push({
          groupName,
          score: roundedGroupScore
        });
        summary.total += roundedGroupScore;
      });
      summary.groups.sort((a, b) => b.score - a.score);
      // Determine the solo score and add it to the summary.
      const soloPackageNames = Object.keys(groupDetails.solos);
      soloPackageNames.forEach(packageName => {
        const testIDs = Object.keys(groupDetails.solos[packageName]);
        testIDs.forEach(testID => {
          const score = soloWeight * groupDetails.solos[packageName][testID];
          summary.solos += score;
          summary.total += score;
        });
      });
      summary.solos = Math.round(summary.solos);
      summary.total = Math.round(summary.total);
    }
  }
  // Get the log score.
  const logScore = logWeights.logCount * report.logCount
  + logWeights.logSize * report.logSize +
  + logWeights.errorLogCount * report.errorLogCount
  + logWeights.errorLogSize * report.errorLogSize
  + logWeights.prohibitedCount * report.prohibitedCount +
  + logWeights.visitTimeoutCount * report.visitTimeoutCount +
  + logWeights.visitRejectionCount * report.visitRejectionCount
  + logWeights.visitLatency * (report.visitLatency - normalLatency);
  const roundedLogScore = Math.round(logScore);
  summary.log = roundedLogScore;
  summary.total += roundedLogScore;
  // Add the score facts to the report.
  report.score = {
    scoreProcID,
    logWeights,
    soloWeight,
    groupWeights,
    preventionWeights,
    packageDetails,
    groupDetails,
    preventionScores,
    summary
  };
};
