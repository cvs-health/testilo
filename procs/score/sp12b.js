/*
  sp12a
  Testilo score proc 12b

  Computes scores from Testaro script tp12 and adds them to a report.
  Usage examples:
    node score sp12b 35k1r
    node score sp12b

  This proc applies specified weights to the component scores before summing them. An issue reported
  by a test is given a score. That score is determined by:
    Whether the issue is reported as an error or a warning.
    How important the issue is, if the test package is “pre-weighted” (axe, tenon, and testaro)
    Whether the test belongs to a group or is a “solo” test.
    How heavily the group is weighted, if the test package is not pre-weighted and the test belongs
      to a group

  The scores of solo tests are added together, multiplied by the soloWeight multiplier, and
    contributed to the total score.

  The scores of grouped tests are aggregated into a group score before being contributed to the
    total score. The group score is the sum of (1) an absolute score, assigned because the group has
    at least one test with a non-zero score, (2) the largest score among the tests of the group
    multiplied by a multiplier, and (3) the sum of the scores from the other tests of the group
    multiplied by a smaller multiplier. These three amounts are given by the groupWeights object.

  Browser logging produces a log score, and the prevention of tests produces a prevention score.
  They, too, are added to the total score.

  Each grouped test has a “quality” property, typically set to 1. The value of this property can be
  modified when the test is found to be higher or lower in quality than usual.
*/

// CONSTANTS

const scoreProcID = 'sp12a';
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
const soloWeight = 2;
const groupWeights = {
  absolute: 2,
  largest: 1,
  smaller: 0.4
};
const preventionWeights = {
  testaro: 50,
  other: 100
};
const otherPackages = ['alfa', 'axe', 'htmlcs', 'ibm', 'tenon', 'wave'];
const preWeightedPackages = ['axe', 'tenon', 'testaro'];
// Define the test groups.
const groups = {
  duplicateID: {
    weight: 3,
    packages: {
      alfa: {
        r3: {
          quality: 1,
          what: 'Element id attribute value is not unique'
        }
      },
      axe: {
        'duplicate-id': {
          quality: 1,
          what: 'id attribute value is not unique'
        },
        'duplicate-id-active': {
          quality: 1,
          what: 'id attribute value of the active element is not unique'
        },
        'duplicate-id-aria': {
          quality: 1,
          what: 'id attribute used in ARIA or in a label has a value that is not unique'
        }
      },
      htmlcs: {
        'e:AA.4_1_1.F77': {
          quality: 1,
          what: 'Duplicate id attribute value'
        }
      },
      ibm: {
        RPT_Elem_UniqueId: {
          quality: 1,
          what: 'Element id attribute value is not unique within the document'
        }
      }
    }
  },
  regionNoText: {
    weight: 4,
    packages: {
      alfa: {
        r40: {
          quality: 1,
          what: 'Region has no accessible name'
        }
      }
    }
  },
  formFieldNoText: {
    weight: 4,
    packages: {
      alfa: {
        r8: {
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
          quality: 1,
          what: 'ARIA input field has no accessible name'
        }
      },
      htmlcs: {
        'e:AA.4_1_2.H91.InputText.Name': {
          quality: 1,
          what: 'Text input has no accessible name'
        },
        'e:AA.4_1_2.H91.InputEmail.Name': {
          quality: 1,
          what: 'Email input has no accessible name'
        },
        'e:AA.4_1_2.H91.InputTel.Name': {
          quality: 1,
          what: 'Telephone input has no accessible name'
        },
        'e:AA.4_1_2.H91.InputNumber.Name': {
          quality: 1,
          what: 'Number input has no accessible name'
        },
        'e:AA.4_1_2.H91.InputSearch.Name': {
          quality: 1,
          what: 'Search input has no accessible name'
        },
        'e:AA.4_1_2.H91.InputCheckbox.Name': {
          quality: 1,
          what: 'Checkbox input has no accessible name'
        }
      }
    }
  },
  imageInputNoText: {
    weight: 4,
    packages: {
      alfa: {
        r28: {
          quality: 1,
          what: 'Image input element has no accessible name'
        }
      },
      axe: {
        'input-image-alt': {
          quality: 1,
          what: 'Image button has no text alternative'
        }
      },
      htmlcs: {
        'e:H36': {
          quality: 1,
          what: 'Image submit button has no alt attribute'
        }
      },
      ibm: {
        'v:WCAG20_Input_ExplicitLabelImage': {
          quality: 1,
          what: 'Input element of type image has no text alternative'
        }
      },
      wave: {
        'e:alt_input_missing': {
          quality: 1,
          what: 'Image button missing alternative text'
        }
      }
    }
  },
  imageNoText: {
    weight: 4,
    packages: {
      alfa: {
        r2: {
          quality: 1,
          what: 'Image has no accessible name'
        }
      },
      axe: {
        'image-alt': {
          quality: 1,
          what: 'Image has no text alternative'
        }
      },
      htmlcs: {
        'e:AA.1_1_1.H37': {
          quality: 1,
          what: 'img element has no alt attribute'
        }
      },
      ibm: {
        'v:WCAG20_Img_HasAlt': {
          quality: 1,
          what: 'Image has no alt attribute conveying its meaning, or alt="" if decorative'
        }
      },
      wave: {
        'e:alt_missing': {
          quality: 1,
          what: 'Text alternative is missing'
        },
        'e:alt_spacer_missing': {
          quality: 1,
          what: 'Spacer image has no text alternative'
        }
      }
    }
  },
  imageTextBad: {
    weight: 3,
    packages: {
      alfa: {
        'r39': {
          quality: 1,
          what: 'Image text alternative is the filename instead'
        }
      }
    }
  },
  imagesSameAlt: {
    weight: 1,
    packages: {
      wave: {
        'a:alt_duplicate': {
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
          quality: 1,
          what: 'Long text alternative'
        }
      }
    }
  },
  imageTextRisk: {
    weight: 1,
    packages: {
      wave: {
        'a:alt_suspicious': {
          quality: 1,
          what: 'Image alternate text is suspicious'
        }
      }
    }
  },
  decorativeImageRisk: {
    weight: 1,
    packages: {
      htmlcs: {
        'w:AA.1_1_1.H67.2': {
          quality: 1,
          what: 'Image marked as decorative may be informative'
        }
      }
    }
  },
  decorativeElementExposed: {
    weight: 1,
    packages: {
      alfa: {
        r67: {
          quality: 1,
          what: 'Image marked as decorative is in the accessibility tree or has no none/presentation role'
        },
        r86: {
          quality: 1,
          what: 'Element marked as decorative is in the accessibility tree or has no none/presentation role'
        }
      }
    }
  },
  pageLanguage: {
    weight: 4,
    packages: {
      alfa: {
        r4: {
          quality: 1,
          what: 'Lang attribute missing, empty, or only whitespace'
        }
      },
      axe: {
        'html-has-lang': {
          quality: 1,
          what: 'html element has no lang attribute'
        }
      },
      htmlcs: {
        'e:AA.3_1_1.H57.2': {
          quality: 1,
          what: 'html element has no lang or xml:lang attribute'
        }
      },
      ibm: {
        WCAG20_Html_HasLang: {
          quality: 1,
          what: 'Page detected as HTML, but has no lang attribute'
        }
      },
      wave: {
        'e:language_missing': {
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
          quality: 1,
          what: 'lang attribute has no valid primary language tag'
        }
      },
      axe: {
        'html-lang-valid': {
          quality: 1,
          what: 'html element has no valid value for the lang attribute'
        }
      },
      htmlcs: {
        'e:AA.3_1_1.H57.3.Lang': {
          quality: 1,
          what: 'Language specified in the lang attribute of the document does not appear to be well-formed'
        }
      },
      ibm: {
        'v:WCAG20_Elem_Lang_Valid': {
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
          quality: 1,
          what: 'Language specified in the lang attribute of the element does not appear to be well-formed'
        }
      }
    }
  },
  languageChange: {
    weight: 3,
    packages: {
      alfa: {
        r7: {
          quality: 1,
          what: 'lang attribute has no valid primary language subtag'
        }
      },
      axe: {
        'valid-lang': {
          quality: 1,
          what: 'lang attribute has no valid value'
        }
      },
      htmlcs: {
        'e:WCAG2AAA.Principle3.Guideline3_1.3_1_2.H58': {
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
          quality: 1,
          what: 'ARIA dialog or alertdialog node has no accessible name'
        }
      }
    }
  },
  objectNoText: {
    weight: 4,
    packages: {
      axe: {
        'object-alt': {
          quality: 1,
          what: 'Object element has no text alternative'
        }
      },
      htmlcs: {
        'e:ARIA6+H53': {
          quality: 1,
          what: 'Object element contains no text alternative'
        }
      },
      ibm: {
        'v:WCAG20_Object_HasText': {
          quality: 1,
          what: 'Object element has no text alternative'
        }
      },
      wave: {
        'a:plugin': {
          quality: 1,
          what: 'An unidentified plugin is present'
        }
      }
    }
  },
  imageMapAreaNoText: {
    weight: 4,
    packages: {
      axe: {
        'area-alt': {
          quality: 1,
          what: 'Active area elements has no text alternative'
        }
      },
      htmlcs: {
        'e:AA.1_1_1.H24': {
          quality: 1,
          what: 'Area element in an image map missing an alt attribute'
        }
      },
      ibm: {
        'v:HAAC_Img_UsemapAlt': {
          quality: 1,
          what: 'Image map or child area has no text alternative'
        },
        'v:WCAG20_Area_HasAlt': {
          quality: 1,
          what: 'Area element in an image map has no text alternative'
        }
      },
      wave: {
        'e:alt_area_missing': {
          quality: 1,
          what: 'Image map area missing alternative text'
        }
      }
    }
  },
  eventKeyboardRisk: {
    weight: 1,
    packages: {
      htmlcs: {
        'w:AA.2_1_1.G90': {
          quality: 1,
          what: 'Event handler functionality may not be available by keyboard'
        }
      },
      wave: {
        'a:event_handler': {
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
          quality: 1,
          what: 'Internal link references a nonexistent destination'
        }
      },
      wave: {
        'a:label_orphaned': {
          quality: 1,
          what: 'Orphaned form label'
        },
        'a:link_internal_broken': {
          quality: 1,
          what: 'Broken same-page link'
        }
      }
    }
  },
  labelForWrongRisk: {
    weight: 1,
    packages: {
      htmlcs: {
        'w:AA.1_3_1.H44.NotFormControl': {
          quality: 1,
          what: 'Label for attribute may reference the wrong element, because it is not a form control'
        }
      }
    }
  },
  labelBadID: {
    weight: 4,
    packages: {
      htmlcs: {
        'w:AA.1_3_1.H44.NonExistentFragment': {
          quality: 1,
          what: 'Label for attribute references a nonexistent element'
        },
        'w:AA.1_3_1.ARIA16,ARIA9': {
          quality: 1,
          what: 'aria-labelledby attribute references a nonexistent element'
        },
        'w:AA.4_1_2.ARIA16,ARIA9': {
          quality: 1,
          what: 'aria-labelledby attribute references a nonexistent element'
        }
      },
      wave: {
        'a:label_orphaned': {
          quality: 1,
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
          quality: 1,
          what: 'Link has no accessible name'
        }
      },
      axe: {
        'link-name': {
          quality: 1,
          what: 'Link has no discernible text'
        }
      },
      htmlcs: {
        'e:AA.1_1_1.H30.2': {
          quality: 1,
          what: 'img element is the only link content but has no text alternative'
        },
        'w:AA.4_1_2.H91.A.Empty': {
          quality: 1,
          what: 'Link element has an id attribute but no href attribute or text'
        },
        'e:AA.4_1_2.H91.A.EmptyNoId': {
          quality: 1,
          what: 'Link has no name or id attribute or value'
        },
        'w:AA.4_1_2.H91.A.EmptyWithName': {
          quality: 1,
          what: 'Link has a name attribute but no href attribute or text'
        },
        'e:AA.4_1_2.H91.A.NoContent': {
          quality: 1,
          what: 'Link has an href attribute but no text'
        }
      },
      ibm: {
        'v:WCAG20_A_HasText': {
          quality: 1,
          what: 'Hyperlink has no text description'
        }
      },
      tenon: {
        57: {
          quality: 1,
          what: 'Link has no text inside it'
        },
        91: {
          quality: 1,
          what: 'Link has a background image but no text inside it'
        }
      },
      wave: {
        'e:link_empty': {
          quality: 1,
          what: 'Link contains no text'
        },
        'e:alt_link_missing': {
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
          quality: 1,
          what: 'Link has text but no href, id, or name attribute'
        }
      }
    }
  },
  pdfLink: {
    weight: 1,
    packages: {
      wave: {
        'a:link_pdf': {
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
          quality: 1,
          what: 'Link is misused as a link destination'
        }
      }
    }
  },
  textAreaNoText: {
    weight: 4,
    packages: {
      htmlcs: {
        'e:AA.4_1_2.H91.Textarea.Name': {
          quality: 1,
          what: 'textarea element has no accessible name'
        }
      }
    }
  },
  linkTextsSame: {
    weight: 2,
    packages: {
      tenon: {
        98: {
          quality: 1,
          what: 'Links have the same text but different destinations'
        }
      }
    }
  },
  linkDestinationsSame: {
    weight: 2,
    packages: {
      tenon: {
        184: {
          quality: 1,
          what: 'Adjacent links point to the same destination'
        }
      }
    }
  },
  linkConfusionRisk: {
    weight: 1,
    packages: {
      axe: {
        'identical-links-same-purpose': {
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
          quality: 1,
          what: 'Link may open in a new window without notice'
        }
      }
    }
  },
  buttonNoText: {
    weight: 4,
    packages: {
      alfa: {
        r12: {
          quality: 1,
          what: 'Button has no accessible name'
        }
      },
      axe: {
        'aria-command-name': {
          quality: 1,
          what: 'ARIA command has no accessible name'
        },
        'button-name': {
          quality: 1,
          what: 'Button has no discernible text'
        },
        'input-button-name': {
          quality: 1,
          what: 'Input button has no discernible text'
        }
      },
      htmlcs: {
        'e:AA.4_1_2.H91.A.Name': {
          quality: 1,
          what: 'Link with button role has no accessible name'
        },
        'e:AA.4_1_2.H91.Button.Name': {
          quality: 1,
          what: 'Button element has no accessible name'
        },
        'e:AA.4_1_2.H91.InputButton.Name': {
          quality: 1,
          what: 'Button input element has no accessible name'
        }
      },
      wave: {
        'e:button_empty': {
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
          quality: 1,
          what: 'Element is not owned by an element of its required context role'
        }
      },
      axe: {
        'aria-required-parent': {
          quality: 1,
          what: 'ARIA role is not contained by a required parent'
        }
      }
    }
  },
  svgImageNoText: {
    weight: 4,
    packages: {
      alfa: {
        r43: {
          quality: 1,
          what: 'SVG image element has no accessible name'
        }
      },
      axe: {
        'svg-img-alt': {
          quality: 1,
          what: 'SVG element with an img role has no text alternative'
        }
      }
    }
  },
  cssBansRotate: {
    weight: 4,
    packages: {
      axe: {
        'css-orientation-lock': {
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
          quality: 1,
          what: 'Meta element restricts zooming'
        }
      },
      axe: {
        'meta-viewport': {
          quality: 1,
          what: 'Zooming and scaling are disabled'
        },
        'meta-viewport-large': {
          quality: 1,
          what: 'User cannot zoom and scale the text up to 500%'
        }
      }
    }
  },
  childMissing: {
    weight: 4,
    packages: {
      alfa: {
        r68: {
          quality: 1,
          what: 'Element does not own an element required by its semantic role'
        }
      },
      axe: {
        'aria-required-children': {
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
          quality: 1,
          what: 'Font size is smaller than 9 pixels'
        }
      },
      tenon: {
        134: {
          quality: 1,
          what: 'Text is very small'
        }
      },
      wave: {
        'a:text_small': {
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
          quality: 1,
          what: 'Style attribute with !important prevents adjusting line height'
        }
      },
      axe: {
        'avoid-inline-spacing': {
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
          quality: 1,
          what: 'Overflow is hidden or clipped if the text is enlarged'
        }
      }
    }
  },
  iframeTitleBad: {
    weight: 4,
    packages: {
      alfa: {
        r13: {
          quality: 1,
          what: 'iframe has no accessible name'
        }
      },
      axe: {
        'frame-title': {
          quality: 1,
          what: 'Frame has no accessible name'
        },
        'frame-title-unique': {
          quality: 1,
          what: 'Frame title attribute is not unique'
        }
      },
      htmlcs: {
        'e:AA.2_4_1.H64.1': {
          quality: 1,
          what: 'iframe element has no non-empty title attribute'
        }
      },
      ibm: {
        'v:WCAG20_Frame_HasTitle': {
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
          quality: 1,
          what: 'Element does not have a valid role'
        }
      },
      axe: {
        'aria-allowed-role': {
          quality: 1,
          what: 'ARIA role is not appropriate for the element'
        }
      },
      ibm: {
        'v:aria_semantics_role': {
          quality: 1,
          what: 'ARIA role is not valid for the element to which it is assigned'
        }
      },
      testaro: {
        role: {
          quality: 1,
          what: 'Nonexistent or implicit-overriding role'
        }
      }
    }
  },
  roleMissingAttribute: {
    weight: 4,
    packages: {
      axe: {
        'aria-required-attr': {
          quality: 1,
          what: 'Required ARIA attribute is not provided'
        }
      },
      ibm: {
        'v:Rpt_Aria_RequiredProperties': {
          quality: 1,
          what: 'ARIA role on an element does not have a required attribute'
        }
      }
    }
  },
  ariaBadAttribute: {
    weight: 4,
    packages: {
      alfa: {
        r18: {
          quality: 1,
          what: 'ARIA state or property is not allowed for the element on which it is specified'
        },
        r19: {
          quality: 1,
          what: 'ARIA state or property has an invalid value'
        },
        r20: {
          quality: 1,
          what: 'ARIA attribute is not defined'
        }
      },
      axe: {
        'aria-valid-attr': {
          quality: 1,
          what: 'ARIA attribute has an invalid name'
        },
        'aria-valid-attr-value': {
          quality: 1,
          what: 'ARIA attribute has an invalid value'
        },
        'aria-allowed-attr': {
          quality: 1,
          what: 'ARIA attribute is invalid for the role of its element'
        }
      },
      ibm: {
        'v:Rpt_Aria_ValidProperty': {
          quality: 1,
          what: 'ARIA attribute is invalid for the role'
        }
      }
    }
  },
  ariaReferenceBad: {
    weight: 4,
    packages: {
      ibm: {
        'v:Rpt_Aria_ValidIdRef': {
          quality: 1,
          what: 'ARIA property does not reference the non-empty unique id of a visible element'
        }
      },
      wave: {
        'e:aria_reference_broken': {
          quality: 1,
          what: 'Broken ARIA reference'
        }
      }
    }
  },
  ariaRoleDescriptionBad: {
    weight: 3,
    packages: {
      axe: {
        'aria-roledescription': {
          quality: 1,
          what: 'aria-roledescription is on an element with no semantic role'
        }
      }
    }
  },
  autocompleteBad: {
    weight: 3,
    packages: {
      alfa: {
        r10: {
          quality: 1,
          what: 'Autocomplete attribute has no valid value'
        }
      },
      axe: {
        'autocomplete-valid': {
          quality: 1,
          what: 'Autocomplete attribute is used incorrectly'
        }
      },
      htmlcs: {
        'e:AA.1_3_5.H98': {
          quality: 1,
          what: 'Autocomplete attribute and the input type are mismatched'
        }
      },
      ibm: {
        'v:WCAG21_Input_Autocomplete': {
          quality: 1,
          what: 'Autocomplete attribute token is not appropriate for the input form field'
        }
      }
    }
  },
  autocompleteRisk: {
    weight: 1,
    packages: {
      htmlcs: {
        'w:AA.1_3_5.H98': {
          quality: 1,
          what: 'Element contains a potentially faulty value in its autocomplete attribute'
        }
      }
    }
  },
  contrastAA: {
    weight: 3,
    packages: {
      alfa: {
        r69: {
          quality: 1,
          what: 'Text outside widget has subminimum contrast'
        }
      },
      axe: {
        'color-contrast': {
          quality: 1,
          what: 'Element has insufficient color contrast'
        }
      },
      htmlcs: {
        'e:AA.1_4_3.G145.Fail': {
          quality: 1,
          what: 'Contrast between the text and its background is less than 3:1.'
        },
        'e:AA.1_4_3.G18.Fail': {
          quality: 1,
          what: 'Contrast between the text and its background is less than 4.5:1'
        }
      },
      ibm: {
        'v:IBMA_Color_Contrast_WCAG2AA': {
          quality: 1,
          what: 'Contrast ratio of text with background does not meet WCAG 2.1 AA'
        }
      },
      wave: {
        'c:contrast': {
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
          quality: 1,
          what: 'Text contrast less than AAA requires'
        }
      },
      axe: {
        'color-contrast-enhanced': {
          quality: 1,
          what: 'Element has insufficient color contrast (Level AAA)'
        }
      },
      htmlcs: {
        'e:WCAG2AAA.Principle1.Guideline1_4.1_4_3.G18': {
          quality: 1,
          what: 'Insufficient contrast'
        }
      },
      tenon: {
        95: {
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
          quality: 1,
          what: 'Inline background color may lack a complementary foreground color'
        },
        'w:AA.1_4_3_F24.F24.FGColour': {
          quality: 1,
          what: 'Inline foreground color may lack a complementary background color'
        },
        'w:AA.1_4_3.G18.Abs': {
          quality: 1,
          what: 'Contrast between the absolutely positioned text and its background may be inadequate'
        },
        'w:AA.1_4_3.G18.Alpha': {
          quality: 1,
          what: 'Contrast between the text and its background may be less than 4.5:1, given the transparency'
        },
        'w:AA.1_4_3.G145.Abs': {
          quality: 1,
          what: 'Contrast between the absolutely positioned large text and its background may be less than 3:1'
        },
        'w:AA.1_4_3.G145.Alpha': {
          quality: 1,
          what: 'Contrast between the text and its background may be less than 3:1, given the transparency'
        },
        'w:AA.1_4_3.G145.BgImage': {
          quality: 1,
          what: 'Contrast between the text and its background image may be less than 3:1'
        },
        'w:AA.1_4_3.G18.BgImage': {
          quality: 1,
          what: 'Contrast between the text and its background image may be less than 4.5:1'
        }
      }
    }
  },
  headingEmpty: {
    weight: 3,
    packages: {
      alfa: {
        r64: {
          quality: 1,
          what: 'Heading has no non-empty accessible name'
        }
      },
      axe: {
        'empty-heading': {
          quality: 1,
          what: 'Heading empty'
        }
      },
      htmlcs: {
        'e:AA.1_3_1.H42.2': {
          quality: 1,
          what: 'Heading empty'
        }
      },
      ibm: {
        'v:RPT_Header_HasContent': {
          quality: 1,
          what: 'Heading element provides no descriptive text'
        }
      },
      wave: {
        'e:heading_empty': {
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
          quality: 1,
          what: 'No content between two headings of the same level'
        }
      }
    }
  },
  imageTextRedundant: {
    weight: 1,
    packages: {
      axe: {
        'image-redundant-alt': {
          quality: 1,
          what: 'Text of a button or link is repeated in the image alternative'
        }
      },
      ibm: {
        'v:WCAG20_Img_LinkTextNotRedundant': {
          quality: 1,
          what: 'Text alternative for the image in a link repeats text of the same or an adjacent link'
        }
      },
      tenon: {
        138: {
          quality: 1,
          what: 'Image link alternative text repeats text in the link'
        }
      },
      wave: {
        'a:alt_redundant': {
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
          quality: 1,
          what: 'img element has an empty alt attribute but has a nonempty title attribute'
        }
      },
      wave: {
        'a:image_title': {
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
          quality: 1,
          what: 'Link has a title attribute that is the same as the text inside the link'
        }
      },
      wave: {
        'a:title_redundant': {
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
          quality: 0.5,
          what: 'Value of the title attribute of the form control is empty or only whitespace'
        },
        'w:AA.4_1_2.H65': {
          quality: 0.5,
          what: 'Value of the title attribute of the form control is empty or only whitespace'
        }
      }
    }
  },
  pageTitle: {
    weight: 3,
    packages: {
      alfa: {
        r1: {
          quality: 1,
          what: 'Document has no valid title element'
        }
      },
      axe: {
        'document-title': {
          quality: 1,
          what: 'Document contains no title element'
        }
      },
      htmlcs: {
        'e:AA.2_4_2.H25.1.NoTitleEl': {
          quality: 1,
          what: 'Document head element contains no non-empty title element'
        }
      },
      wave: {
        'e:title_invalid': {
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
          quality: 1,
          what: 'Heading skips one or more levels'
        }
      },
      axe: {
        'heading-order': {
          quality: 1,
          what: 'Heading levels do not increase by only one'
        }
      },
      htmlcs: {
        'w:AA.1_3_1_A.G141': {
          quality: 1,
          what: 'Heading level is incorrect'
        }
      },
      tenon: {
        155: {
          quality: 1,
          what: 'Headings are not structured in a hierarchical manner'
        }
      },
      wave: {
        'a:heading_skipped': {
          quality: 1,
          what: 'Skipped heading level'
        }
      }
    }
  },
  noHeading: {
    weight: 3,
    packages: {
      alfa: {
        r59: {
          quality: 1,
          what: 'Document has no headings'
        }
      }
    }
  },
  h1Missing: {
    weight: 2,
    packages: {
      alfa: {
        r61: {
          quality: 1,
          what: 'First heading is not h1'
        }
      },
      axe: {
        'page-has-heading-one': {
          quality: 1,
          what: 'Page contains no level-one heading'
        }
      },
      wave: {
        'a:h1_missing': {
          quality: 1,
          what: 'Missing first level heading'
        }
      }
    }
  },
  justification: {
    weight: 1,
    packages: {
      alfa: {
        r71: {
          quality: 1,
          what: 'Paragraph text is fully justified'
        }
      },
      tenon: {
        36: {
          quality: 1,
          what: 'Text is fully justified'
        }
      },
      wave: {
        'a:text_justified': {
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
          quality: 1,
          what: 'Special text is aligned nonsemantically'
        },
        'w:AA.1_3_1.H49.B': {
          quality: 1,
          what: 'Special text is bolded nonsemantically'
        },
        'w:AA.1_3_1.H49.I': {
          quality: 1,
          what: 'Special text is italicized nonsemantically'
        },
        'w:AA.1_3_1.H49.Big': {
          quality: 1,
          what: 'Special text is enlarged nonsemantically'
        },
        'w:AA.1_3_1.H49.Small': {
          quality: 1,
          what: 'Special text is made small nonsemantically'
        },
        'w:AA.1_3_1.H49.U': {
          quality: 1,
          what: 'Special text is underlined nonsemantically'
        }
      }
    }
  },
  pseudoParagraphRisk: {
    weight: 1,
    packages: {
      tenon: {
        242: {
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
          quality: 1,
          what: 'Styled p element may be misused as a heading'
        }
      },
      htmlcs: {
        'w:AA.1_3_1.H42': {
          quality: 1,
          what: 'Heading coding is not used but the element may be intended as a heading'
        }
      },
      wave: {
        'a:heading_possible': {
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
          quality: 1,
          what: 'CSS underline on text that is not a link'
        }
      },
      wave: {
        'a:underline': {
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
          quality: 1,
          what: 'List element ul or ol has a child element other than li, script, and template'
        },
        'definition-list': {
          quality: 1,
          what: 'List element dl has a child element other than properly ordered dt and dt group, script, template, and div'
        }
      }
    }
  },
  listItemOrphan: {
    weight: 4,
    packages: {
      axe: {
        listitem: {
          quality: 1,
          what: 'li element is not contained by a ul or ol element'
        }
      }
    }
  },
  pseudoOrderedListRisk: {
    weight: 1,
    packages: {
      htmlcs: {
        'w:AA.1_3_1.H48.2': {
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
          quality: 1,
          what: 'Select element has no accessible name'
        }
      },
      htmlcs: {
        'e:AA.4_1_2.H91.Select.Name': {
          quality: 1,
          what: 'Select element has no accessible name'
        },
        'w:AA.4_1_2.H91.Select.Value': {
          quality: 1,
          what: 'Select element value has no accessible name'
        }
      },
      wave: {
        'a:select_missing_label': {
          quality: 1,
          what: 'Select missing label'
        }
      }
    }
  },
  selectFlatRisk: {
    weight: 1,
    packages: {
      htmlcs: {
        'w:AA.1_3_1.H85.2': {
          quality: 1,
          what: 'Selection list may contain groups of related options that are not grouped with optgroup'
        }
      }
    }
  },
  accessKeyDuplicate: {
    weight: 3,
    packages: {
      ibm: {
        'v:WCAG20_Elem_UniqueAccessKey': {
          quality: 1,
          what: 'Accesskey attribute value on an element is not unique for the page'
        }
      },
      wave: {
        'a:accesskey': {
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
        'v:WCAG20_Input_RadioChkInFieldSet': {
          quality: 1,
          what: 'Input is in a different group than another with the name'
        }
      },
      testaro: {
        radioSet: {
          quality: 1,
          what: 'No or invalid grouping of radio buttons in fieldsets'
        }
      },
      wave: {
        'a:fieldset_missing': {
          quality: 1,
          what: 'Missing fieldset'
        }
      }
    }
  },
  fieldSetRisk: {
    weight: 1,
    packages: {
      htmlcs: {
        'w:AA.1_3_1.H71.SameName': {
          quality: 1,
          what: 'Radio buttons or check boxes may require a group description via a fieldset element'
        }
      }
    }
  },
  legendMissing: {
    weight: 2,
    packages: {
      htmlcs: {
        'e:AA.1_3_1.H71.NoLegend': {
          quality: 1,
          what: 'Fieldset has no legend element'
        }
      },
      wave: {
        'a:legend_missing': {
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
          quality: 1,
          what: 'Form-control group has no accessible name'
        }
      },
      htmlcs: {
        'e:AA.4_1_2.H91.Fieldset.Name': {
          quality: 1,
          what: 'Fieldset has no accessible name'
        }
      }
    }
  },
  layoutTable: {
    weight: 2,
    packages: {
      wave: {
        'a:table_layout': {
          quality: 1,
          what: 'Table element is misused to arrange content'
        }
      }
    }
  },
  tableCaption: {
    weight: 1,
    packages: {
      htmlcs: {
        'w:AA.1_3_1.H39.3.NoCaption': {
          quality: 1,
          what: 'Table has no caption element'
        }
      }
    }
  },
  tableCellHeaderless: {
    weight: 4,
    packages: {
      alfa: {
        r77: {
          quality: 1,
          what: 'Table cell has no header'
        }
      }
    }
  },
  TableHeaderScopeRisk: {
    weight: 1,
    packages: {
      htmlcs: {
        'e:AA.1_3_1.H63.1': {
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
          quality: 1,
          what: 'th (table header) contains no text'
        }
      }
    }
  },
  controlLabel: {
    weight: 4,
    packages: {
      axe: {
        label: {
          quality: 1,
          what: 'Form element has no label'
        }
      },
      htmlcs: {
        'e:AA.1_3_1.F68': {
          quality: 1,
          what: 'Form control has no label'
        }
      },
      wave: {
        'e:label_missing': {
          quality: 1,
          what: 'Missing form label'
        }
      }
    }
  },
  titleAsLabel: {
    weight: 3,
    packages: {
      wave: {
        'a:label_title': {
          quality: 1,
          what: 'Form control has a title but no label'
        }
      }
    }
  },
  invisibleLabel: {
    weight: 3,
    packages: {
      alfa: {
        r14: {
          quality: 1,
          what: 'Visible label is not in the accessible name'
        }
      },
      axe: {
        'label-content-name-mismatch': {
          quality: 1,
          what: 'Element visible text is not part of its accessible name'
        }
      },
      htmlcs: {
        'w:AA.2_5_3.F96': {
          quality: 1,
          what: 'Visible label is not in the accessible name'
        }
      }
    }
  },
  targetSize: {
    weight: 2,
    packages: {
      tenon: {
        152: {
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
          quality: 1,
          what: 'Interactive controls are nested'
        }
      },
      testaro: {
        embAc: {
          quality: 1,
          what: 'Active element is embedded in a link or button'
        }
      }
    }
  },
  tabFocusability: {
    weight: 3,
    packages: {
      testaro: {
        focAll: {
          quality: 1,
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
          quality: 1,
          what: 'Element in sequential focus order has no visible focus'
        }
      },
      testaro: {
        focInd: {
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
          quality: 1,
          what: 'Paragraph text is uppercased'
        }
      },
      tenon: {
        153: {
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
          quality: 1,
          what: 'Text of the paragraph is all italic'
        }
      },
      tenon: {
        154: {
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
          quality: 1,
          what: 'Perceivable text content is not included in any landmark'
        }
      },
      axe: {
        region: {
          quality: 1,
          what: 'Some page content is not contained by landmarks'
        }
      }
    }
  },
  footerTopLandmark: {
    weight: 1,
    packages: {
      axe: {
        'landmark-contentinfo-is-top-level': {
          quality: 1,
          what: 'contentinfo landmark (footer) is contained in another landmark'
        }
      }
    }
  },
  asideTopLandmark: {
    weight: 2,
    packages: {
      axe: {
        'landmark-complementary-is-top-level': {
          quality: 1,
          what: 'complementary landmark (aside) is contained in another landmark'
        }
      }
    }
  },
  mainTopLandmark: {
    weight: 2,
    packages: {
      axe: {
        'landmark-main-is-top-level': {
          quality: 1,
          what: 'main landmark is contained in another landmark'
        }
      }
    }
  },
  mainLandmark: {
    weight: 2,
    packages: {
      axe: {
        'landmark-one-main': {
          quality: 1,
          what: 'page has no main landmark'
        },
        'landmark-no-duplicate-main': {
          quality: 1,
          what: 'page has more than 1 main landmark'
        }
      }
    }
  },
  bannerLandmark: {
    weight: 2,
    packages: {
      axe: {
        'landmark-no-duplicate-banner': {
          quality: 1,
          what: 'page has more than 1 banner landmark'
        }
      }
    }
  },
  footerMultiple: {
    weight: 2,
    packages: {
      axe: {
        'landmark-no-duplicate-contentinfo': {
          quality: 1,
          what: 'page has more than 1 contentinfo landmark (footer)'
        }
      }
    }
  },
  landmarkConfusion: {
    weight: 3,
    packages: {
      axe: {
        'landmark-unique': {
          quality: 1,
          what: 'Landmark has a role and an accessible name that are identical to another'
        }
      }
    }
  },
  focusableOperable: {
    weight: 3,
    packages: {
      testaro: {
        focOp: {
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
          quality: 1,
          what: 'Tab-focusable element is or has an ancestor that is aria-hidden'
        }
      },
      axe: {
        'aria-hidden-focus': {
          quality: 1,
          what: 'ARIA hidden element is focusable or contains a focusable element'
        },
        'presentation-role-conflict': {
          quality: 1,
          what: 'Element has a none/presentation role but is focusable or has a global ARIA state or property'
        }
      },
      tenon: {
        189: {
          quality: 1,
          what: 'Element is typically used for interaction but has a presentation role'
        },
        194: {
          quality: 1,
          what: 'Visible element is focusable but has a presentation role or aria-hidden=true attribute'
        }
      }
    }
  },
  focusableDescendants: {
    weight: 4,
    packages: {
      alfa: {
        r90: {
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
          quality: 1,
          what: 'Hidden form field is needlessly labeled.'
        }
      }
    }
  },
  hiddenContentRisk: {
    weight: 1,
    packages: {
      axe: {
        'hidden-content': {
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
          quality: 0.2,
          what: 'Some content is in an iframe and therefore may not be testable for accessibility'
        }
      }
    }
  },
  hoverSurprise: {
    weight: 1,
    packages: {
      testaro: {
        hover: {
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
          quality: 1,
          what: 'Incompatible label types'
        }
      }
    }
  },
  labelEmpty: {
    weight: 3,
    packages: {
      htmlcs: {
        'w:AA.1_3_1.ARIA6': {
          quality: 1,
          what: 'Value of the aria-label attribute of the form control is empty or only whitespace'
        },
        'w:AA.4_1_2.ARIA6': {
          quality: 1,
          what: 'Value of the aria-label attribute of the form control is empty or only whitespace'
        }
      },
      wave: {
        'e:label_empty': {
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
          quality: 1,
          what: 'Suspicious link text'
        }
      }
    }
  },
  linkVague: {
    weight: 3,
    packages: {
      tenon: {
        73: {
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
          quality: 1,
          what: 'Inline link is not distinct from the surrounding text except by color'
        }
      },
      axe: {
        'link-in-text-block': {
          quality: 1,
          what: 'Link is not distinct from surrounding text without reliance on color'
        }
      },
      testaro: {
        linkUl: {
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
          quality: 1,
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
          quality: 1,
          what: 'Positive tabIndex risks creating a confusing focus order'
        }
      },
      wave: {
        'a:tabindex': {
          quality: 1,
          what: 'tabIndex value positive'
        }
      }
    }
  },
  tabIndexMissing: {
    weight: 4,
    packages: {
      tenon: {
        190: {
          quality: 1,
          what: 'Interactive item is not natively actionable, but has no tabindex=0 attribute'
        }
      }
    }
  },
  videoCaptionMissing: {
    weight: 4,
    packages: {
      axe: {
        'video-caption': {
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
          quality: 1,
          what: 'video or audio element may have no or incorrect captions, transcript, or audio description'
        },
        'a:youtube_video': {
          quality: 1,
          what: 'YouTube video may have no or incorrect captions'
        }
      }
    }
  },
  notScrollable: {
    weight: 4,
    packages: {
      alfa: {
        r84: {
          quality: 1,
          what: 'Element is scrollable but not by keyboard'
        }
      }
    }
  },
  horizontalScrolling: {
    weight: 3,
    packages: {
      tenon: {
        28: {
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
          quality: 0.5,
          what: 'First focusable element is not a link to the main content'
        }
      },
      axe: {
        'skip-link': {
          quality: 1,
          what: 'Skip-link target is not focusable or does not exist'
        }
      },
      wave: {
        'e:link_skip_broken': {
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
          quality: 1,
          what: 'noscript element may fail to contain an accessible equivalent or alternative'
        }
      }
    }
  },
  obsoleteElement: {
    weight: 1,
    packages: {
      alfa: {
        r70: {
          quality: 1,
          what: 'Element is obsolete or deprecated'
        }
      },
      htmlcs: {
        'e:AA.1_3_1.H49.Center': {
          quality: 1,
          what: 'center element is obsolete'
        },
        'e:AA.1_3_1.H49.Font': {
          quality: 1,
          what: 'font element is obsolete'
        }
      }
    }
  },
  obsoleteAttribute: {
    weight: 3,
    packages: {
      htmlcs: {
        'e:AA.1_3_1.H49.AlignAttr': {
          quality: 1,
          what: 'The align attribute is obsolete'
        }
      },
      wave: {
        'a:longdesc': {
          quality: 1,
          what: 'The longdesc attribute is obsolete'
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
                      // Add 4 per error, 3 per contrast error, 1 per warning (“alert”).
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
          const {total, inSet} = totals;
          const score = total - inSet || 0;
          // Add 1 per misgrouped radio button.
          addDetail('testaro', which, score);
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
        htmlcs: {},
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
      // Populate the group details with group and solo test scores.
      // For each package with any scores:
      Object.keys(packageDetails).forEach(packageName => {
        // For each test with any scores in the package:
        Object.keys(packageDetails[packageName]).forEach(testID => {
          // If the test is in a group:
          const groupName = testGroups[packageName][testID];
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
  + logWeights.visitRejectionCount * report.visitRejectionCount;
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
