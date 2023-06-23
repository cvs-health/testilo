/*
  tic26
  Testilo issue classification 26

  Classifies tests of Testaro and its dependent tools into issues.

  Issue properties:
    wcag: WCAG Principle, Guideline, Success Criterion, or Technique, if any, most closely
      associated with the issue.
    weight: weight of the issue in score computation.
    tools: tools (including Testaro) providing tests in the issue.

  Each property of tools specifies a test of that tool. Its key is the identifier of the test.
  Its value is an object with these properties:
  - variable: whether the identifier is a regular expression.
  - quality: the estimated quality of the test (normally 1).
  - what: description of the test.
*/

exports.issueClasses = {
  ignorable: {
    wcag: '',
    weight: 0,
    tools: {
      nuVal: {
        'Element mediaelementwrapper not allowed as child of element div in this context. (Suppressing further errors from this subtree.)': {
          variable: false,
          quality: 0,
          what: 'Bug in nuVal'
        }
      },
      qualWeb: {
        'QW-ACT-R52': {
          variable: false,
          quality: 1,
          what: 'video element visual-only content has no description track (description tracks and this ACT rule have been deprecated)'
        },
        'QW-ACT-R57': {
          variable: false,
          quality: 1,
          what: 'video element visual content has no description track (description tracks and this ACT rule have been deprecated)'
        },
        'QW-WCAG-T20': {
          variable: false,
          quality: 1,
          what: 'Link text is not supplemented with a title attribute'
        }
      }
    }
  },
  duplicateAttribute:{
    wcag: '4.1.1',
    weight: 2,
    tools: {
      nuVal: {
        '^Duplicate attribute.*$': {
          variable: true,
          quality: 1,
          what: 'Source code of the element contains 2 or more of the same attribute'
        }
      },
      testaro: {
        dupAtt: {
          variable: false,
          quality: 0.7,
          what: 'Source code of the element contains 2 or more of the same attribute'
        }
      }
    }
  },
  duplicateID: {
    wcag: '4.1.1',
    weight: 4,
    tools: {
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
          what: 'Element contains an id attribute set to a value that is not unique in the DOM'
        }
      },
      htmlcs: {
        'AAA.4_1_1.F77': {
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
        },
        element_id_unique: {
          variable: false,
          quality: 1,
          what: 'Element has an id attribute value that is already in use'
        }
      },
      nuVal: {
        '^Duplicate ID .+$|^The first occurrence of ID .* was here.*$': {
          variable: true,
          quality: 1,
          what: 'Duplicate id'
        }
      },
      qualWeb: {
        'QW-ACT-R18': {
          variable: false,
          quality: 1,
          what: 'id attribute value is not unique'
        }
      }
    }
  },
  componentNoText: {
    wcag: '4.1.2',
    weight: 4,
    tools: {
      ibm: {
        Rpt_Aria_WidgetLabels_Implicit: {
          variable: false,
          quality: 1,
          what: 'Interactive component has no programmatically associated name'
        },
        aria_widget_labelled: {
          variable: false,
          quality: 1,
          what: 'Interactive component has no programmatically associated name'
        }
      }
    }
  },
  regionNoText: {
    wcag: '4.1.2',
    weight: 4,
    tools: {
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
          what: 'Element with a region role has no machanism allowing an accessible name to be calculated'
        }
      },
      ibm: {
        Rpt_Aria_RegionLabel_Implicit: {
          variable: false,
          quality: 1,
          what: 'Element with a region role has no label that describes its purpose'
        },
        aria_region_labelled: {
          variable: false,
          quality: 1,
          what: 'Element with a region role has no label'
        }
      }
    }
  },
  headingImageNoText: {
    wcag: '1.1.1',
    weight: 4,
    tools: {
      qualWeb: {
        'QW-BP8': {
          variable: false,
          quality: 1,
          what: 'Heading with an image has no accessible name'
        }
      }
    }
  },
  formFieldNoText: {
    wcag: '4.1.2',
    weight: 4,
    tools: {
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
    wcag: '4.1.2',
    weight: 4,
    tools: {
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
          what: 'Text input element has no machanism allowing an accessible name to be calculated'
        },
        370: {
          variable: false,
          quality: 1,
          what: 'Search input element has no machanism allowing an accessible name to be calculated'
        },
        372: {
          variable: false,
          quality: 1,
          what: 'email input element has no machanism allowing an accessible name to be calculated'
        },
        375: {
          variable: false,
          quality: 1,
          what: 'input element with type="checkbox" has no machanism allowing an accessible name to be calculated'
        },
        376: {
          variable: false,
          quality: 1,
          what: 'input element has no machanism allowing an accessible name to be calculated'
        },
        507: {
          variable: false,
          quality: 1,
          what: 'Element with a radio role has no machanism allowing an accessible name to be calculated'
        },
        509: {
          variable: false,
          quality: 1,
          what: 'Element with a textbox role has no machanism allowing an accessible name to be calculated'
        },
        510: {
          variable: false,
          quality: 1,
          what: 'Element with a combobox role has no machanism allowing an accessible name to be calculated'
        }
      },
      htmlcs: {
        'AAA.4_1_2.H91.InputText.Name': {
          variable: false,
          quality: 1,
          what: 'Text input has no accessible name'
        },
        'AAA.4_1_2.H91.InputEmail.Name': {
          variable: false,
          quality: 1,
          what: 'Email input has no accessible name'
        },
        'AAA.4_1_2.H91.InputPhone.Name': {
          variable: false,
          quality: 1,
          what: 'Telephone input has no accessible name'
        },
        'AAA.4_1_2.H91.InputFile.Name': {
          variable: false,
          quality: 1,
          what: 'File input element has no accessible name'
        },
        'AAA.4_1_2.H91.InputTel.Name': {
          variable: false,
          quality: 1,
          what: 'Telephone input has no accessible name'
        },
        'AAA.4_1_2.H91.InputNumber.Name': {
          variable: false,
          quality: 1,
          what: 'Number input has no accessible name'
        },
        'AAA.4_1_2.H91.InputPassword.Name': {
          variable: false,
          quality: 1,
          what: 'Password input has no accessible name'
        },
        'AAA.4_1_2.H91.InputSearch.Name': {
          variable: false,
          quality: 1,
          what: 'Search input has no accessible name'
        },
        'AAA.4_1_2.H91.InputCheckbox.Name': {
          variable: false,
          quality: 1,
          what: 'Checkbox input has no accessible name'
        },
        'AAA.4_1_2.H91.InputRadio.Name': {
          variable: false,
          quality: 1,
          what: 'Radio input has no accessible name'
        }
      }
    }
  },
  inputOnlyPlaceholder: {
    wcag: '4.1.2',
    weight: 3,
    tools: {
      continuum: {
        863: {
          variable: false,
          quality: 1,
          what: 'input has an accessible name that depends on a placeholder'
        }
      }
    }
  },
  imageButtonNoText: {
    wcag: '1.1.1',
    weight: 4,
    tools: {
      axe: {
        'input-image-alt': {
          variable: false,
          quality: 1,
          what: 'Image button has no text alternative'
        }
      },
      htmlcs: {
        'H36': {
          variable: false,
          quality: 1,
          what: 'Image submit button has no alt attribute'
        },
        'AAA.1_1_1.H36': {
          variable: false,
          quality: 1,
          what: 'Image submit button has no alt attribute'
        }
      },
      qualWeb: {
        'QW-ACT-R6': {
          variable: false,
          quality: 1,
          what: 'Image button has no accessible name'
        },
        'QW-WCAG-T5': {
          variable: false,
          quality: 1,
          what: 'alt attribute not used on an image used as a submit button'
        }
      },
      wave: {
        alt_input_missing: {
          variable: false,
          quality: 1,
          what: 'Image button has no alternative text'
        }
      }
    }
  },
  imageInputNoText: {
    wcag: '1.1.1',
    weight: 4,
    tools: {
      alfa: {
        r28: {
          variable: false,
          quality: 1,
          what: 'image input element has no accessible name'
        }
      },
      continuum: {
        131: {
          variable: false,
          quality: 1,
          what: 'image input has no machanism allowing an accessible name to be calculated'
        }
      },
      htmlcs: {
        'AAA.4_1_2.H91.InputImage.Name': {
          variable: false,
          quality: 1,
          what: 'image input has no accessible name'
        }
      },
      ibm: {
        WCAG20_Input_ExplicitLabelImage: {
          variable: false,
          quality: 1,
          what: 'input element of type image has no text alternative'
        },
        imagebutton_alt_exists: {
          variable: false,
          quality: 1,
          what: 'input element of type image has no text alternative'
        }
      }
    }
  },
  figureNoText: {
    wcag: '1.1.1',
    weight: 4,
    tools: {
      ibm: {
        HAAC_Figure_label: {
          variable: false,
          quality: 1,
          what: 'figure element has no associated label'
        },
        figure_label_exists: {
          variable: false,
          quality: 1,
          what: 'figure element has no associated label'
        }
      }
    }
  },
  imageNoText: {
    wcag: '1.1.1',
    weight: 4,
    tools: {
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
          what: 'Element with an image, graphics-symbol, or graphics-document role has no mechanism to calculate an accessible name'
        },
        89: {
          variable: false,
          quality: 1,
          what: 'img element has no machanism allowing an accessible name to be calculated'
        }
      },
      htmlcs: {
        'AAA.1_1_1.H37': {
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
        aria_img_labelled: {
          variable: false,
          quality: 1,
          what: 'Element with an img role has no label or an empty label'
        },
        WCAG20_Img_HasAlt: {
          variable: false,
          quality: 1,
          what: 'Image has no alt attribute conveying its meaning, or alt="" if decorative'
        },
        img_alt_valid: {
          variable: false,
          quality: 1,
          what: 'Image has neither an alt attribute nor an ARIA label or title'
        },
        img_alt_null: {
          variable: false,
          quality: 1,
          what: 'Image has a title attribute but an empty alt attribute'
        }
      },
      nuVal: {
        'An img element must have an alt attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.': {
          variable: false,
          quality: 1,
          what: 'img element has no alt attribute'
        }
      },
      qualWeb: {
        'QW-ACT-R17': {
          variable: false,
          quality: 1,
          what: 'Image has no accessible name'
        }
      },
      wave: {
        alt_missing: {
          variable: false,
          quality: 1,
          what: 'Text alternative is missing'
        },
        alt_spacer_missing: {
          variable: false,
          quality: 1,
          what: 'Spacer image has no text alternative'
        }
      }
    }
  },
  decorativeImageAltBad: {
    wcag: '1.1.1',
    weight: 4,
    tools: {
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
    wcag: '1.1.1',
    weight: 3,
    tools: {
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
    wcag: '1.3.1',
    weight: 4,
    tools: {
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
    wcag: '1.3.1',
    weight: 4,
    tools: {
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
    wcag: '4.1',
    weight: 4,
    tools: {
      nuVal: {
        '^CSS: background: .+ is not a color value.*$': {
          variable: true,
          quality: 1,
          what: 'CSS background color is misdefined'
        },
        '^CSS: background: The .+ argument to the .+ function should be .+, not .+$': {
          variable: true,
          quality: 1,
          what: 'CSS background function has an invalid argument'
        },
        '^CSS: _background: url.+ is an incorrect URL.*$': {
          variable: true,
          quality: 1,
          what: 'CSS background URL is invalid'
        },
      }
    }
  },
  backgroundImageBad: {
    wcag: '4.1',
    weight: 4,
    tools: {
      nuVal: {
        '^CSS: background-image: .+ is not a background-image value.*$': {
          variable: true,
          quality: 1,
          what: 'CSS background image is misdefined'
        },
        '^CSS: background-image: url.+ is an incorrect URL.*$': {
          variable: true,
          quality: 1,
          what: 'CSS background image is misdefined'
        }
      }
    }
  },
  inputAlt: {
    wcag: '4.1',
    weight: 4,
    tools: {
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
    wcag: '1.1.1',
    weight: 1,
    tools: {
      wave: {
        alt_duplicate: {
          variable: false,
          quality: 1,
          what: 'Two images near each other have the same text alternative'
        }
      }
    }
  },
  imageTextLong: {
    wcag: '1.1.1',
    weight: 2,
    tools: {
      qualWeb: {
        'QW-BP2': {
          variable: false,
          quality: 1,
          what: 'image text alternative is not concise'
        }
      },
      wave: {
        alt_long: {
          variable: false,
          quality: 1,
          what: 'Long text alternative'
        }
      }
    }
  },
  titleLong: {
    wcag: '3.1.5',
    weight: 2,
    tools: {
      qualWeb: {
        'QW-BP6': {
          variable: false,
          quality: 1,
          what: 'title element is too long (more than 64 characters)'
        }
      }
    }
  },
  titleNotText: {
    wcag: '3.1.5',
    weight: 2,
    tools: {
      qualWeb: {
        'QW-BP7': {
          variable: false,
          quality: 1,
          what: 'Title element contains ASCII-art'
        }
      }
    }
  },
  textAlternativeRisk: {
    wcag: '1',
    weight: 1,
    tools: {
      continuum: {
        234: {
          variable: false,
          quality: 1,
          what: 'img element has a suspicious calculated accessible name'
        },
        235: {
          variable: false,
          quality: 1,
          what: 'Element with an img, graphics-symbol, or graphics-document role has a suspicious calculated accessible name'
        }
      },
      qualWeb: {
        'QW-WCAG-T8': {
          variable: false,
          quality: 1,
          what: 'Text alternative is not an alternative'
        }
      },
      wave: {
        alt_suspicious: {
          variable: false,
          quality: 1,
          what: 'Image text alternative is suspicious'
        }
      }
    }
  },
  decorativeImageRisk: {
    wcag: '1.1.1',
    weight: 1,
    tools: {
      htmlcs: {
        'AAA.1_1_1.H67.2': {
          variable: false,
          quality: 1,
          what: 'Image marked as decorative may be informative'
        }
      }
    }
  },
  decorativeElementExposed: {
    wcag: '1.3.1',
    weight: 2,
    tools: {
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
      },
      qualWeb: {
        'QW-ACT-R48': {
          variable: false,
          quality: 1,
          what: 'Element marked as decorative is exposed'
        }
      }
    }
  },
  pageLanguage: {
    wcag: '3.1.1',
    weight: 4,
    tools: {
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
        'AAA.3_1_1.H57.2': {
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
        },
        html_lang_exists: {
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
        '^This document appears to be written in .+ Consider .+ing lang=.+$': {
          variable: true,
          quality: 1,
          what: 'html start tag has no lang attribute to declare the language of the page'
        }
      },
      qualWeb: {
        'QW-ACT-R2': {
          variable: false,
          quality: 1,
          what: 'HTML page has no lang attribute'
        }
      },
      wave: {
        language_missing: {
          variable: false,
          quality: 1,
          what: 'Language missing or invalid'
        }
      }
    }
  },
  pageLanguageBad: {
    wcag: '3.1.1',
    weight: 4,
    tools: {
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
      continuum: {
        647: {
          variable: false,
          quality: 1,
          what: 'html element has no lang attribute starting with an IANA Language Subtag Registry language value'
        }
      },
      htmlcs: {
        'AAA.3_1_1.H57.3.Lang': {
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
      },
      qualWeb: {
        'QW-ACT-R5': {
          variable: false,
          quality: 1,
          what: 'HTML lang attribute is invalid'
        },
        'QW-ACT-R3': {
          variable: false,
          quality: 1,
          what: 'HTML lang and xml:lang do not match'
        }
      }
    }
  },
  elementLanguageBad: {
    wcag: '3.1.2',
    weight: 4,
    tools: {
      htmlcs: {
        'AAA.3_1_2.H58.1.Lang': {
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
      },
      qualWeb: {
        'QW-ACT-R22': {
          variable: false,
          quality: 1,
          what: 'Element within the body has no valid lang attribute'
        }
      }
    }
  },
  languageChange: {
    wcag: '3.1.2',
    weight: 3,
    tools: {
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
        'WCAG2AAA.Principle3.Guideline3_1.3_1_2.H58': {
          variable: false,
          quality: 1,
          what: 'Change in language is not marked'
        }
      }
    }
  },
  dialogNoText: {
    wcag: '4.1.2',
    weight: 4,
    tools: {
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
          what: 'Element with a dialog role has no machanism allowing an accessible name to be calculated'
        }
      }
    }
  },
  applicationNoText: {
    wcag: '4.1.2',
    weight: 4,
    tools: {
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
    wcag: '1.1.1',
    weight: 4,
    tools: {
      alfa: {
        r63: {
          variable: false,
          quality: 1,
          what: 'object element has no accessible name'
        }
      },
      axe: {
        'object-alt': {
          variable: false,
          quality: 1,
          what: 'object element has no text alternative'
        }
      },
      continuum: {
        249: {
          variable: false,
          quality: 1,
          what: 'object element has no machanism allowing an accessible name to be calculated'
        }
      },
      htmlcs: {
        'ARIA6+H53': {
          variable: false,
          quality: 1,
          what: 'object element contains no text alternative'
        }
      },
      ibm: {
        WCAG20_Object_HasText: {
          variable: false,
          quality: 1,
          what: 'object element has no text alternative'
        }
      },
      qualWeb: {
        'QW-ACT-R42': {
          variable: false,
          quality: 1,
          what: 'Object element has no non-empty accessible name'
        }
      },
      wave: {
        plugin: {
          variable: false,
          quality: 1,
          what: 'An unidentified plugin is present'
        }
      }
    }
  },
  appletNoText: {
    wcag: '1.1.1',
    weight: 4,
    tools: {
      qualWeb: {
        'QW-WCAG-T11': {
          variable: false,
          quality: 1,
          what: 'Text alternative not provided on an applet element'
        }
      }
    }
  },
  videoNoText: {
    wcag: '1.1.1',
    weight: 4,
    tools: {
      continuum: {
        252: {
          variable: false,
          quality: 1,
          what: 'video element has no machanism allowing an accessible name to be calculated'
        }
      }
    }
  },
  imageMapNoText: {
    wcag: '1.1.1',
    weight: 4,
    tools: {
      wave: {
        alt_map_missing: {
          variable: false,
          quality: 1,
          what: 'Image that has hot spots has no alt attribute'
        }
      }
    }
  },
  imageMapAreaNoText: {
    wcag: '1.1.1',
    weight: 4,
    tools: {
      axe: {
        'area-alt': {
          variable: false,
          quality: 1,
          what: 'Active area element has no text alternative'
        }
      },
      htmlcs: {
        'AAA.1_1_1.H24': {
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
      qualWeb: {
        'QW-WCAG-T1': {
          variable: false,
          quality: 1,
          what: 'Text alternative for an area element of an image map is not provided'
        }
      },
      wave: {
        alt_area_missing: {
          variable: false,
          quality: 1,
          what: 'Image map area has no alternative text'
        }
      }
    }
  },
  objectBlurKeyboardRisk: {
    wcag: '2.1.1',
    weight: 1,
    tools: {
      htmlcs: {
        'AAA.2_1_2.F10': {
          variable: false,
          quality: 1,
          what: 'Applet or plugin may fail to enable moving the focus away with the keyboard'
        }
      }
    }
  },
  keyboardAccess: {
    wcag: '2.1.1',
    weight: 4,
    tools: {
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
    wcag: '2.1.1',
    weight: 1,
    tools: {
      htmlcs: {
        'AAA.2_1_1.G90': {
          variable: false,
          quality: 1,
          what: 'Event handler functionality may not be available by keyboard'
        },
        'AAA.2_1_1.SCR20.MouseOut': {
          variable: false,
          quality: 1,
          what: 'Mousing-out functionality may not be available by keyboard'
        },
        'AAA.2_1_1.SCR20.MouseOver': {
          variable: false,
          quality: 1,
          what: 'Mousing-over functionality may not be available by keyboard'
        },
        'AAA.2_1_1.SCR20.MouseDown': {
          variable: false,
          quality: 1,
          what: 'Mousing-down functionality may not be available by keyboard'
        },
        'AAA.2_1_1.SCR20.MouseUp': {
          variable: false,
          quality: 1,
          what: 'Mousing-up functionality may not be available by keyboard'
        }
      },
      qualWeb: {
        'QW-WCAG-T6': {
          variable: false,
          quality: 1,
          what: 'Both keyboard and other device-specific functions are not used'
        }
      },
      wave: {
        event_handler: {
          variable: false,
          quality: 1,
          what: 'Device-dependent event handler'
        }
      }
    }
  },
  internalLinkBroken: {
    wcag: '1.3.1',
    weight: 4,
    tools: {
      htmlcs: {
        'AAA.2_4_1.G1,G123,G124.NoSuchID': {
          variable: false,
          quality: 1,
          what: 'Internal link references a nonexistent destination'
        }
      },
      wave: {
        link_internal_broken: {
          variable: false,
          quality: 1,
          what: 'Broken same-page link'
        }
      }
    }
  },
  labelForBad: {
    wcag: '1.3.1',
    weight: 3,
    tools: {
      htmlcs: {
        'AAA.1_3_1.H44.NotFormControl': {
          variable: false,
          quality: 1,
          what: 'Referent of the for attribute of the label is not a form control, so may be wrong'
        }
      },
      ibm: {
        label_ref_valid: {
          variable: false,
          quality: 1,
          what: 'Value of the for attribute of the label element is not the id of a valid input element'
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
    wcag: '1.3.1',
    weight: 1,
    tools: {
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
    wcag: '1.3.1',
    weight: 4,
    tools: {
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
  governedBadID: {
    wcag: '1.3.1',
    weight: 4,
    tools: {
      continuum: {
        85: {
          variable: false,
          quality: 1,
          what: 'aria-controls attribute references an invalid or duplicate ID'
        }
      },
      ibm: {
        combobox_popup_reference: {
          variable: false,
          quality: 1,
          what: 'aria-controls or aria-owns attribute of an expanded combobox does not reference a popup'
        }
      },
      nuVal: {
        'The aria-controls attribute must point to an element in the same document.': {
          variable: false,
          quality: 1,
          what: 'aria-controls attribute references an element not in the document'
        },
        'The aria-owns attribute must point to an element in the same document.': {
          variable: false,
          quality: 1,
          what: 'aria-owns attribute references an element not in the document'
        }
      }
    }
  },
  descriptionBadID: {
    wcag: '1.3.1',
    weight: 4,
    tools: {
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
    wcag: '3.3.2',
    weight: 1,
    tools: {
      ibm: {
        WCAG20_Input_LabelBefore: {
          variable: false,
          quality: 1,
          what: 'Text input or select element label follows the input control'
        },
        input_label_before: {
          variable: false,
          quality: 1,
          what: 'Label text is after its text input or select element'
        },
        WCAG20_Input_LabelAfter: {
          variable: false,
          quality: 1,
          what: 'Checkbox or radio button label precedes the input control'
        },
        input_label_after: {
          variable: false,
          quality: 1,
          what: 'Label text is located before its associated checkbox or radio button element'
        }
      },
      qualWeb: {
        'QW-WCAG-T17': {
          variable: false,
          quality: 1,
          what: 'label not positioned to maximize the predictability of the relationship'
        }
      }
    }
  },
  labelBadID: {
    wcag: '1.3.1',
    weight: 4,
    tools: {
      continuum: {
        95: {
          variable: false,
          quality: 1,
          what: 'Element has an aria-labelledby value that includes an invalid or duplicate id'
        }
      },
      htmlcs: {
        'AAA.1_3_1.H44.NonExistentFragment': {
          variable: false,
          quality: 1,
          what: 'Label for attribute references a nonexistent element'
        },
        'AAA.1_3_1.ARIA16,ARIA9': {
          variable: false,
          quality: 1,
          what: 'aria-labelledby attribute references a nonexistent element'
        },
        'AAA.4_1_2.ARIA16,ARIA9': {
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
        'Any input descendant of a label element with a for attribute must have an ID value that matches that for attribute.': {
          variable: false,
          quality: 1,
          what: 'input id differs from the value of the for attribute of the enclosing label element'
        },
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
        label_orphaned: {
          variable: false,
          quality: 1,
          what: 'Orphaned form label'
        }
      }
    }
  },
  haspopupBad: {
    wcag: '1.3.1',
    weight: 4,
    tools: {
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
    wcag: '1.3.1',
    weight: 4,
    tools: {
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
    wcag: '2.4.4',
    weight: 4,
    tools: {
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
          what: 'a element has no machanism allowing an accessible name value to be calculated'
        },
        238: {
          variable: false,
          quality: 1,
          what: 'Element with a link role has no machanism allowing an accessible name value to be calculated'
        }
      },
      htmlcs: {
        'AAA.1_1_1.H30.2': {
          variable: false,
          quality: 1,
          what: 'img element is the only link content but has no text alternative'
        },
        'AAA.4_1_2.H91.A.Empty': {
          variable: false,
          quality: 1,
          what: 'a element has an id attribute but no href attribute or text'
        },
        'AAA.4_1_2.H91.A.EmptyNoId': {
          variable: false,
          quality: 1,
          what: 'Link has no name or id attribute or value'
        },
        'AAA.4_1_2.H91.A.EmptyWithName': {
          variable: false,
          quality: 1,
          what: 'Link has a name attribute but no href attribute or text'
        },
        'AAA.4_1_2.H91.A.NoContent': {
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
        },
        a_text_purpose: {
          variable: false,
          quality: 1,
          what: 'Hyperlink has no link text, label, or image with a text alternative'
        }
      },
      qualWeb: {
        'QW-ACT-R12': {
          variable: false,
          quality: 1,
          what: 'Link has no accessible name'
        },
        'QW-WCAG-T21': {
          variable: false,
          quality: 1,
          what: 'Accessible name is not provided for an image which is the only content in a link'
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
        link_empty: {
          variable: false,
          quality: 1,
          what: 'Link contains no text'
        },
        alt_link_missing: {
          variable: false,
          quality: 1,
          what: 'Linked image has no text alternative'
        },
      }
    }
  },
  linkBrokenRisk: {
    wcag: '1.3.1',
    weight: 2,
    tools: {
      htmlcs: {
        'AAA.4_1_2.H91.A.Placeholder': {
          variable: false,
          quality: 1,
          what: 'Link has text but no href, id, or name attribute'
        }
      }
    }
  },
  linkElNoHref: {
    wcag: '4.1',
    weight: 3,
    tools: {
      htmlcs: {
        'AAA.2_4_8.H59.2b': {
          variable: false,
          quality: 1,
          what: 'link element is missing a non-empty href for the linked resource'
        }
      },
      nuVal: {
        'Bad value  for attribute href on element link: Must be non-empty.': {
          variable: false,
          quality: 1,
          what: 'link element has an empty href attribute'
        }
      }
    }
  },
  acronymNoTitle: {
    wcag: '3.1.4',
    weight: 4,
    tools: {
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
    wcag: '3.1.4',
    weight: 4,
    tools: {
      tenon: {
        233: {
          variable: false,
          quality: 1,
          what: 'abbr element is first for its abbreviation but has no useful title value'
        }
      },
      qualWeb: {
        'QW-WCAG-T7': {
          variable: false,
          quality: 1,
          what: 'Definition for an abbreviation not provided with an abbr element'
        }
      }
    }
  },
  pdfLink: {
    wcag: '1.3.3',
    weight: 1,
    tools: {
      wave: {
        link_pdf: {
          variable: false,
          quality: 1,
          what: 'Link to PDF document'
        }
      }
    }
  },
  destinationLink: {
    wcag: '1.3.1',
    weight: 2,
    tools: {
      htmlcs: {
        'AAA.4_1_2.H91.A.NoHref': {
          variable: false,
          quality: 1,
          what: 'Link is misused as a link destination'
        }
      },
      nuVal: {
        'Element a is missing required attribute href.': {
          variable: false,
          quality: 1,
          what: 'a element has no href attribute'
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
    wcag: '1.3.1',
    weight: 4,
    tools: {
      continuum: {
        872: {
          variable: false,
          quality: 1,
          what: 'textarea element has no accessible name, but only a placeholder attribute'
        }
      },
      htmlcs: {
        'AAA.4_1_2.H91.Textarea.Name': {
          variable: false,
          quality: 1,
          what: 'textarea element has no accessible name'
        }
      }
    }
  },
  linkAltSame: {
    wcag: '1.1.1',
    weight: 2,
    tools: {
      htmlcs: {
        'AAA.1_1_1.H2.EG3': {
          variable: false,
          quality: 1,
          what: 'alt value of the link img element duplicates the text of a link beside it'
        }
      }
    }
  },
  linkTextsSame: {
    wcag: '2.4.4',
    weight: 2,
    tools: {
      qualWeb: {
        'QW-ACT-R9': {
          variable: false,
          quality: 1,
          what: 'Links with identical accessible names have different purposes'
        },
        'QW-ACT-R44': {
          variable: false,
          quality: 1,
          what: 'Links with identical accessible names and context serve different purposes'
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
  areaDestinationsSame: {
    wcag: '2.4.4',
    weight: 2,
    tools: {
      tenon: {
        132: {
          variable: false,
          quality: 1,
          what: 'area element has the same href as another but a different alt'
        }
      }
    }
  },
  linksNoNav: {
    wcag: '1.3.1',
    weight: 2,
    tools: {
      qualWeb: {
        'QW-BP4': {
          variable: false,
          quality: 1,
          what: 'Grouped links are not within a nav element'
        }
      }
    }
  },
  linkConfusionRisk: {
    wcag: '2.4.4',
    weight: 1,
    tools: {
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
    wcag: '2.4.4',
    weight: 2,
    tools: {
      qualWeb: {
        'QW-WCAG-T10': {
          variable: false,
          quality: 1,
          what: 'Adjacent image and text links for the same resource are not combined'
        },
        'QW-BP13': {
          variable: false,
          quality: 1,
          what: 'Consecutive links have the same href and one contains an image'
        }
      },
      tenon: {
        184: {
          variable: false,
          quality: 1,
          what: 'Adjacent links point to the same destination'
        }
      },
      wave: {
        link_redundant: {
          variable: false,
          quality: 1,
          what: 'Adjacent links go to the same URL'
        }
      }
    }
  },
  pageNewWindow: {
    wcag: '3.2.5',
    weight: 3,
    tools: {
      qualWeb: {
        'QW-WCAG-T22': {
          variable: false,
          quality: 1,
          what: 'New window opens as soon as a new page is loaded'
        }
      }
    }
  },
  formNewWindow: {
    wcag: '3.2.5',
    weight: 2,
    tools: {
      tenon: {
        214: {
          variable: false,
          quality: 1,
          what: 'Form submission opens a new window'
        }
      }
    }
  },
  externalLinkSurprise: {
    wcag: '3.2.5',
    weight: 3,
    tools: {
      tenon: {
        218: {
          variable: false,
          quality: 1,
          what: 'Link opens in a new window without user control'
        }
      }
    }
  },
  externalLink: {
    wcag: '3.2.5',
    weight: 1,
    tools: {
      htmlcs: {
        'WCAG2AAA.Principle3.Guideline3_2.3_2_5.H83.3': {
          variable: false,
          quality: 1,
          what: 'Link may open in a new window without notice'
        },
        'AAA.3_2_5.H83.3': {
          variable: false,
          quality: 1,
          what: 'Link text may fail to indicate that the link will open in a new window'
        }
      },
      testaro: {
        linkExt: {
          variable: false,
          quality: 1,
          what: 'Link opens a new window or tab'
        }
      }
    }
  },
  selectNavSurpriseRisk: {
    wcag: '3.2.5',
    weight: 1,
    tools: {
      wave: {
        javascript_jumpmenu: {
          variable: false,
          quality: 1,
          what: 'selection change may navigate to another page without notice'
        }
      }
    }
  },
  buttonAlt: {
    wcag: '4.1.2',
    weight: 4,
    tools: {
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
    wcag: '4.1.2',
    weight: 4,
    tools: {
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
          what: 'input element with type=button has no machanism allowing an accessible name to be calculated'
        },
        224: {
          variable: false,
          quality: 1,
          what: 'button element has no machanism allowing an accessible name to be calculated'
        },
        511: {
          variable: false,
          quality: 1,
          what: 'Element with a button role has no machanism allowing an accessible name to be calculated'
        }
      },
      htmlcs: {
        'AAA.4_1_2.H91.A.Name': {
          variable: false,
          quality: 1,
          what: 'Link with button role has no accessible name'
        },
        'AAA.4_1_2.H91.Div.Name': {
          variable: false,
          quality: 1,
          what: 'div element with button role has no accessible name'
        },
        'AAA.4_1_2.H91.Button.Name': {
          variable: false,
          quality: 1,
          what: 'Button element has no accessible name'
        },
        'AAA.4_1_2.H91.Img.Name': {
          variable: false,
          quality: 1,
          what: 'img element with button role has no accessible name'
        },
        'AAA.4_1_2.H91.InputButton.Name': {
          variable: false,
          quality: 1,
          what: 'Button input element has no accessible name'
        },
        'AAA.4_1_2.H91.Span.Name': {
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
      qualWeb: {
        'QW-ACT-R11': {
          variable: false,
          quality: 1,
          what: 'Button has no accessible name'
        }
      },
      wave: {
        button_empty: {
          variable: false,
          quality: 1,
          what: 'Button is empty or has no value text'
        }
      }
    }
  },
  menuItemNoText: {
    wcag: '4.1.2',
    weight: 4,
    tools: {
      alfa: {
        r94: {
          variable: false,
          quality: 1,
          what: 'Element with a menuitem role has no accessible name'
        }
      },
      qualWeb: {
        'QW-ACT-R66': {
          variable: false,
          quality: 1,
          what: 'menuitem element has no non-empty accessible name'
        }
      }
    }
  },
  parentMissing: {
    wcag: '1.3.1',
    weight: 4,
    tools: {
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
      },
      nuVal: {
        '^An element with role=.+ must be contained in, or owned by, an element with role=.+$': {
          variable: true,
          quality: 1,
          what: 'Element has no required container or owner'
        }
      },
      qualWeb: {
        'QW-ACT-R33': {
          variable: false,
          quality: 1,
          what: 'Element has no ARIA required context role'
        }
      }
    }
  },
  descendantMissing: {
    wcag: '1.3.1',
    weight: 4,
    tools: {
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
      },
      qualWeb: {
        'QW-ACT-R38': {
          variable: false,
          quality: 1,
          what: 'Element has no ARIA required owned element'
        }
      }
    }
  },
  presentationChild: {
    wcag: '1.3.1',
    weight: 4,
    tools: {
      htmlcs: {
        'AAA.1_3_1.F92,ARIA4': {
          variable: false,
          quality: 1,
          what: 'Element has presentation role but semantic child'
        }
      }
    }
  },
  svgImageNoText: {
    wcag: '1.1.1',
    weight: 4,
    tools: {
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
          what: 'svg element has no machanism allowing an accessible name to be calculated'
        }
      },
      qualWeb: {
        'QW-ACT-R21': {
          variable: false,
          quality: 1,
          what: 'svg element with an explicit role has no accessible name'
        }
      }
    }
  },
  cssBansRotate: {
    wcag: '1.3.4',
    weight: 4,
    tools: {
      axe: {
        'css-orientation-lock': {
          variable: false,
          quality: 1,
          what: 'CSS media query locks display orientation'
        }
      },
      qualWeb: {
        'QW-ACT-R7': {
          variable: false,
          quality: 1,
          what: 'Orientation of the page is restricted by a CSS transform property'
        }
      }
    }
  },
  textRotated: {
    wcag: '1.4.8',
    weight: 2,
    tools: {
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
    wcag: '1.4.4',
    weight: 4,
    tools: {
      alfa: {
        r47: {
          variable: false,
          quality: 1,
          what: 'meta element restricts zooming'
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
      },
      qualWeb: {
        'QW-ACT-R14': {
          variable: false,
          quality: 1,
          what: 'meta viewport prevents zoom'
        }
      }
    }
  },
  fontSizeAbsolute: {
    wcag: '1.4.4',
    weight: 2,
    tools: {
      alfa: {
        r74: {
          variable: false,
          quality: 1,
          what: 'Paragraph text has an absolute font size'
        }
      },
      qualWeb: {
        'QW-WCAG-T28': {
          variable: false,
          quality: 1,
          what: 'Percent, em, or name is used for a font size'
        }
      }
    }
  },
  fontSmall: {
    wcag: '1.4',
    weight: 3,
    tools: {
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
        text_small: {
          variable: false,
          quality: 1,
          what: 'Text is very small'
        }
      }
    }
  },
  textSpacingFrozen: {
    wcag: '1.4.12',
    weight: 4,
    tools: {
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
      },
      qualWeb: {
        'QW-ACT-R67': {
          variable: false,
          quality: 1,
          what: 'Letter spacing in a style attribute is !important'
        },
        'QW-ACT-R68': {
          variable: false,
          quality: 1,
          what: 'Line height in a style attribute is !important'
        },
        'QW-ACT-R69': {
          variable: false,
          quality: 1,
          what: 'Word spacing in a style attribute is !important'
        }
      }
    }
  },
  leadingAbsolute: {
    wcag: '1.4.12',
    weight: 2,
    tools: {
      alfa: {
        r80: {
          variable: false,
          quality: 1,
          what: 'Paragraph text has an absolute line height'
        }
      }
    }
  },
  leadingInsufficient: {
    wcag: '1.4.8',
    weight: 2,
    tools: {
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
    wcag: '1.4.8',
    weight: 4,
    tools: {
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
    wcag: '1.4.4',
    weight: 4,
    tools: {
      alfa: {
        r83: {
          variable: false,
          quality: 1,
          what: 'Overflow is hidden or clipped if the text is enlarged'
        }
      }
    }
  },
  overflowHiddenRisk: {
    wcag: '1.4.4',
    weight: 1,
    tools: {
      qualWeb: {
        'QW-ACT-R40': {
          variable: false,
          quality: 1,
          what: 'Zoomed text node may be clipped by a CSS overflow declaration'
        }
      }
    }
  },
  boxSizeAbsolute: {
    wcag: '1.4.4',
    weight: 3,
    tools: {
      qualWeb: {
        'QW-BP14': {
          variable: false,
          quality: 1,
          what: 'Container width is specified in px'
        },
        'QW-BP15': {
          variable: false,
          quality: 1,
          what: 'Element width is specified in an absolute value'
        }
      }
    }
  },
  titleBad: {
    wcag: '1.3.1',
    weight: 4,
    tools: {
      testaro: {
        titledEl: {
          variable: false,
          quality: 1,
          what: 'title attribute belongs to an inappropriate element'
        }
      }
    }
  },
  linkElementBad: {
    wcag: '1.3.1',
    weight: 4,
    tools: {
      htmlcs: {
        'AAA.2_4_8.H59.1': {
          variable: false,
          quality: 1,
          what: 'link element is not in the document head'
        },
        'A link element with an as attribute must have a rel attribute that contains the value preload or the value modulepreload or the value prefetch.': {
          variable: false,
          quality: 1,
          what: 'link element with an as attribute has no rel attribute with preload, modulepreload, or prefetch as its value'
        }
      },
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
        },
        'A link element with an as attribute must have a rel attribute that contains the value preload or the value modulepreload.': {
          variable: false,
          quality: 1,
          what: 'link element with an as attribute has no rel attribute with preload or modulepreload as its value'
        }
      }
    }
  },
  metaBad: {
    wcag: '1.3.1',
    weight: 3,
    tools: {
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
          what: 'Attribute of a meta element has an invalid value'
        }
      }
    }
  },
  scriptElementBad: {
    wcag: '1.3.1',
    weight: 4,
    tools: {
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
    wcag: '1.3.1',
    weight: 4,
    tools: {
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
    wcag: '4.1.2',
    weight: 4,
    tools: {
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
          what: 'iframe has no machanism allowing an accessible name to be calculated'
        }
      },
      htmlcs: {
        'AAA.2_4_1.H64.1': {
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
        },
        frame_title_exists: {
          variable: false,
          quality: 1,
          what: 'Inline frame has no title attribute'
        }
      },
      qualWeb: {
        'QW-ACT-R10': {
          variable: false,
          quality: 1,
          what: 'iframe elements with identical accessible names have different purposes'
        },
        'QW-ACT-R19': {
          variable: false,
          quality: 1,
          what: 'iframe element has no accessible name'
        }
      }
    }
  },
  roleBad: {
    wcag: '4.1.2',
    weight: 3,
    tools: {
      alfa: {
        r21: {
          variable: false,
          quality: 1,
          what: 'Element does not have a valid role'
        },
        r110: {
          variable: false,
          quality: 1,
          what: 'No token in the value of the role attribute is valid'
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
        185: {
          variable: false,
          quality: 1,
          what: 'noscript element has a role attribute'
        },
        285: {
          variable: false,
          quality: 1,
          what: 'button element has a role attribute that is not allowed'
        },
        288: {
          variable: false,
          quality: 1,
          what: 'fieldset element has a role other than group and radiogroup'
        },
        294: {
          variable: false,
          quality: 1,
          what: 'form element has a role other than search and region'
        },
        297: {
          variable: false,
          quality: 1,
          what: 'iframe element has a role attribute that is not allowed'
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
        361: {
          variable: false,
          quality: 1,
          what: 'Element has an abstract ARIA role'
        },
        412: {
          variable: false,
          quality: 1,
          what: 'Element has a role attribute set to an invalid ARIA role value'
        }
      },
      ibm: {
        aria_role_valid: {
          variable: false,
          quality: 1,
          what: 'ARIA role is not valid for its element'
        },
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
        aria_contentinfo_misuse: {
          variable: false,
          quality: 1,
          what: 'Element with a contentinfo role is present without an element with a main role'
        },
        Rpt_Aria_ValidRole: {
          variable: false,
          quality: 1,
          what: 'Element has an invalid role'
        },
        aria_role_allowed: {
          variable: false,
          quality: 1,
          what: 'Element has an invalid role'
        },
        aria_eventhandler_role_valid: {
          variable: false,
          quality: 1,
          what: 'Element with an onclick, onmouseout, or onmouseover attribute has no valid ARIA role'
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
        'A figure element with a figcaption descendant must not have a role attribute.': {
          variable: false,
          quality: 1,
          what: 'figure element has a figcaption descendant but has a role attribute'
        },
        '^Discarding unrecognized token .+ from value of attribute role. Browsers ignore any token that is not a defined ARIA non-abstract role.*$': {
          variable: true,
          quality: 1,
          what: 'Invalid role'
        },
        '^The role attribute must not be used on a .+ element which has a table ancestor with no role attribute, or with a role attribute whose value is table, grid, or treegrid.*$': {
          variable: true,
          quality: 1,
          what: 'Table cell has a role attribute'
        }
      },
      qualWeb: {
        'QW-ACT-R20': {
          variable: false,
          quality: 1,
          what: 'role attribute has an invalid value'
        }
      }
    }
  },
  roleRedundant: {
    wcag: '4.1.2',
    weight: 1,
    tools: {
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
        '^Element .+ does not need a role attribute.*$': {
          variable: true,
          quality: 1,
          what: 'Element does not need a role attribute'
        },
        'The searchbox role is unnecessary for an input element that has no list attribute and whose type is search.': {
          variable: false,
          quality: 1,
          what: 'explicit role is redundant for a search-type input element without a list attribute'
        },
        'The textbox role is unnecessary for an input element that has no list attribute and whose type is text.': {
          variable: false,
          quality: 1,
          what: 'explicit role is redundant for a text-type input element without a list attribute'
        }
      },
      testaro: {
        role: {
          variable: false,
          quality: 1,
          what: 'Invalid, native-replacing, or redundant role'
        }
      }
    }
  },
  attributeBad: {
    wcag: '1.3.1',
    weight: 4,
    tools: {
      ibm: {
        Valerie_Elem_DirValid: {
          variable: false,
          quality: 1,
          what: 'dir attribute has a value other than ltr, rtl, or auto'
        },
        aria_attribute_valid: {
          variable: false,
          quality: 1,
          what: 'ARIA attribute is invalid for the role of its element'
        },
        aria_attribute_value_valid: {
          variable: false,
          quality: 1,
          what: 'Value of an attribute on the element is not valid'
        }
      },
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
          what: 'Attribute not allowed on this element'
        },
        '^Bad value .* for attribute .+ on element .+$': {
          variable: true,
          quality: 1,
          what: 'Attribute on this element has an invalid value'
        },
        '^Bad value .+ for the attribute .+$': {
          variable: true,
          quality: 1,
          what: 'Attribute has an invalid value'
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
        'A link element with a sizes attribute must have a rel attribute that contains the value icon or the value apple-touch-icon or the value apple-touch-icon-precomposed.': {
          variable: false,
          quality: 1,
          what: 'link element has a sizes attribute but no icon-type rel attribute'
        },
        'An input element with a type attribute whose value is hidden must not have any aria-* attributes.': {
          variable: false,
          quality: 1,
          what: 'hidden-type input element has an ARIA attribute'
        },
        'The sizes attribute may be specified only if the srcset attribute is also present.': {
          variable: false,
          quality: 1,
          what: 'Element has a sizes attribute but no srcset attribute'
        },
        'The sizes attribute must only be specified if the srcset attribute is also specified.': {
          variable: false,
          quality: 1,
          what: 'Element has a sizes attribute but no srcset attribute'
        },
        '^Bad value  for attribute (?:width|height) on element img: The empty string is not a valid non-negative integer.*$': {
          variable: true,
          quality: 1,
          what: 'Attribute has an empty value'
        },
        '^.+ in an unquoted attribute value. Probable causes: Attributes running together or a URL query string in an unquoted attribute value.*$': {
          variable: true,
          quality: 1,
          what: 'Attribute has a value containing invalid punctuation'
        }
      }
    }
  },
  attributeMissing: {
    wcag: '4.1.2',
    weight: 4,
    tools: {
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
        },
        aria_attribute_required: {
          variable: false,
          quality: 1,
          what: 'Element does not have the ARIA attribute required by its role'
        }
      },
      nuVal: {
        '^Element .+ is missing required attribute .+$': {
          variable: true,
          quality: 1,
          what: 'Element is missing a required attribute'
        },
        '^Element image is missing required attribute (?:height|width).*$': {
          variable: true,
          quality: 1,
          what: 'image element has no height attribute or has no width attribute'
        },
        '^Element .+ is missing one or more of the following attributes: .+$': {
          variable: true,
          quality: 1,
          what: 'Element is missing a required attribute'
        },
        'A link element with a rel attribute that contains the value preload must have an as attribute.': {
          variable: false,
          quality: 1,
          what: 'link element with rel="preload" is missing an as attribute'
        },
        'A source element that has a following sibling source element or img element with a srcset attribute must have a media attribute and/or type attribute.': {
          variable: false,
          quality: 1,
          what: 'source or img element is missing a media or type attribute'
        }
      }
    }
  },
  roleMissing: {
    wcag: '4.1.2',
    weight: 3,
    tools: {
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
    wcag: '4.1.2',
    weight: 1,
    tools: {
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
    wcag: '4.1.2',
    weight: 4,
    tools: {
      alfa: {
        r16: {
          variable: false,
          quality: 1,
          what: 'Element does not have all required states and properties'
        }
      },
      continuum: {
        1039: {
          variable: false,
          quality: 1,
          what: 'Element with a checkbox role has no aria-checked attribute'
        },
        1040: {
          variable: false,
          quality: 1,
          what: 'Element with a combobox role has no aria-controls or no aria-expanded attribute'
        },
        1042: {
          variable: false,
          quality: 1,
          what: 'Element with an option role has no aria-selected attribute'
        },
        1043: {
          variable: false,
          quality: 1,
          what: 'Element with a radio role has no aria-checked attribute'
        }
      },
      nuVal: {
        '^Element .+ is missing required attribute aria-.+$': {
          variable: true,
          quality: 1,
          what: 'Element is missing a required ARIA attribute'
        }
      },
      qualWeb: {
        'QW-ACT-R28': {
          variable: false,
          quality: 1,
          what: 'Element with a role attribute does not have the required states and properties'
        }
      }
    }
  },
  ariaBadAttribute: {
    wcag: '4.1.2',
    weight: 4,
    tools: {
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
        261: {
          variable: false,
          quality: 1,
          what: 'Element has an aria-multiselectable attribute, which is not allowed'
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
        278: {
          variable: false,
          quality: 1,
          what: 'Element has an aria-modal attribute, which is not allowed'
        },
        279: {
          variable: false,
          quality: 1,
          what: 'Element has an aria-posinset attribute without having a compatible role'
        },
        280: {
          variable: false,
          quality: 1,
          what: 'Element has aria-posinset and aria-setsize attributes without having a compatible role'
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
        610: {
          variable: false,
          quality: 1,
          what: 'Element has an aria-setsize attribute without having a compatible role'
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
        'The aria-checked attribute should not be used on an input element which has a type attribute whose value is radio.': {
          variable: false,
          quality: 1,
          what: 'input element with type="radio" has an aria-checked attribute'
        },
        'Attribute aria-activedescendant value should either refer to a descendant element, or should be accompanied by attribute aria-owns.': {
          variable: false,
          quality: 1,
          what: 'Element has no aria-owns attribute but its aria-activedescendant attribute references a non-descendant'
        },
        '^Bad value  for attribute .+ on element .+: Must be non-empty.*$': {
          variable: true,
          quality: 1,
          what: 'Attribute value is empty'
        },
        '^Bad value  for attribute aria-hidden on element .+$': {
          variable: true,
          quality: 1,
          what: 'aria-hidden attribute has an empty value'
        },
        'The form attribute must refer to a form element.': {
          variable: false,
          quality: 1,
          what: 'form attribute does not reference a form element'
        },
        'The aria-checked attribute should not be used on an input element which has a type attribute whose value is checkbox.': {
          variable: false,
          quality: 1,
          what: 'input element with type checkbox has an aria-checked attribute'
        },
        'The aria-checked attribute must not be used on an input element which has a type attribute whose value is checkbox.': {
          variable: false,
          quality: 1,
          what: 'input element with type checkbox has an aria-checked attribute'
        },
        'An img element with no alt attribute must not have any aria-* attributes other than aria-hidden.': {
          variable: false,
          quality: 1,
          what: 'img element has no alt attribute but has an ARIA attribute other than aria-hidden'
        },
        'An input element with a type attribute whose value is checkbox and with a role attribute whose value is button must have an aria-pressed attribute whose value is true.': {
          variable: false,
          quality: 1,
          what: 'input element with a button role and type="checkbox" has no aria-pressed="true"'
        }
      },
      qualWeb: {
        'QW-ACT-R25': {
          variable: false,
          quality: 1,
          what: 'ARIA state or property is not permitted'
        },
        'QW-ACT-R27': {
          variable: false,
          quality: 1,
          what: 'aria- attribute is not defined in ARIA 1.1'
        },
        'QW-ACT-R34': {
          variable: false,
          quality: 1,
          what: 'ARIA state or property has an invalid value'
        }
      }
    }
  },
  ariaRedundant: {
    wcag: '4.1.2',
    weight: 1,
    tools: {
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
    wcag: '1.3.1',
    weight: 4,
    tools: {
      ibm: {
        Rpt_Aria_ValidIdRef: {
          variable: false,
          quality: 1,
          what: 'ARIA property does not reference the non-empty unique id of a visible element'
        },
        aria_id_unique: {
          variable: false,
          quality: 1,
          what: 'ARIA attribute has an invalid or duplicated id as its value'
        }
      },
      wave: {
        aria_reference_broken: {
          variable: false,
          quality: 1,
          what: 'Broken ARIA reference'
        }
      }
    }
  },
  autocompleteBad: {
    wcag: '1.3.5',
    weight: 3,
    tools: {
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
        'AAA.1_3_5.H98': {
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
        },
        input_autocomplete_valid: {
          variable: false,
          quality: 1,
          what: 'autocomplete attribute has an incorrect value'
        }
      },
      nuVal: {
        'Bad value  for attribute autocomplete on element input: Must not be empty.': {
          variable: false,
          quality: 1,
          what: 'autocomplete attribute has an empty value'
        },
        'An input element with a type attribute whose value is hidden must not have an autocomplete attribute whose value is on or off.': {
          variable: false,
          quality: 1,
          what: 'autocomplete attribute belongs to a hidden element but has an on or off value'
        }
      },
      qualWeb: {
        'QW-ACT-R24': {
          variable: false,
          quality: 1,
          what: 'autocomplete attribute has no valid value'
        }
      }
    }
  },
  autocompleteNone: {
    wcag: '1.3.5',
    weight: 1,
    tools: {
      testaro: {
        autocomplete: {
          variable: false,
          quality: 1,
          what: 'Name or email input is missing its required autocomplete attribute'
        }
      }
    }
  },
  autocompleteRisk: {
    wcag: '1.3.5',
    weight: 1,
    tools: {
      htmlcs: {
        'AAA.1_3_5.H98': {
          variable: false,
          quality: 1,
          what: 'Element contains a potentially faulty value in its autocomplete attribute'
        }
      }
    }
  },
  textContrastAA: {
    wcag: '1.4.3',
    weight: 4,
    tools: {
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
        'AAA.1_4_3.G145.Fail': {
          variable: false,
          quality: 1,
          what: 'Contrast between the text and its background is less than 3:1.'
        },
        'AAA.1_4_3.G18.Fail': {
          variable: false,
          quality: 1,
          what: 'Contrast between the text and its background is less than 4.5:1'
        },
        'AAA.1_4_6.G18.Fail': {
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
        },
        text_contrast_sufficient: {
          variable: false,
          quality: 1,
          what: 'Text has a contrast with its background less than the WCAG AA minimum for its size and weight'
        }
      },
      qualWeb: {
        'QW-ACT-R37': {
          variable: false,
          quality: 1,
          what: 'Text has less than the minimum contrast'
        }
      },
      wave: {
        contrast: {
          variable: false,
          quality: 1,
          what: 'Very low contrast'
        }
      }
    }
  },
  colorMissing: {
    wcag: '1.4.3',
    weight: 4,
    tools: {
      qualWeb: {
        'QW-WCAG-T31': {
          variable: false,
          quality: 1,
          what: 'Foreground or background color is specified but not both'
        }
      }
    }
  },
  contrastAAA: {
    wcag: '1.4.6',
    weight: 1,
    tools: {
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
        'WCAG2AAA.Principle1.Guideline1_4.1_4_3.G18': {
          variable: false,
          quality: 1,
          what: 'Insufficient contrast'
        },
        'AAA.1_4_6.G17.Fail': {
          variable: false,
          quality: 1,
          what: 'Text has insufficient contrast'
        }
      },
      qualWeb: {
        'QW-ACT-R76': {
          variable: false,
          quality: 1,
          what: 'Text has less than the enhanced minimum contrast'
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
    wcag: '1.4.3',
    weight: 1,
    tools: {
      htmlcs: {
        'AAA.1_4_3_F24.F24.BGColour': {
          variable: false,
          quality: 1,
          what: 'Inline background color may lack a complementary foreground color'
        },
        'AAA.1_4_6.G18.BgImage': {
          variable: false,
          quality: 1,
          what: 'Contrast between the text and the background image may be less than 4.5:1'
        },
        'AAA.1_4_3_F24.F24.FGColour': {
          variable: false,
          quality: 1,
          what: 'Inline foreground color may lack a complementary background color'
        },
        'AAA.1_4_3.G18.Abs': {
          variable: false,
          quality: 1,
          what: 'Contrast between the absolutely positioned text and its background may be inadequate'
        },
        'AAA.1_4_6.G18.Abs': {
          variable: false,
          quality: 1,
          what: 'Contrast between the absolutely positioned text and its background may be less than 4.5:1'
        },
        'AAA.1_4_3.G18.Alpha': {
          variable: false,
          quality: 1,
          what: 'Contrast between the text and its background may be less than 4.5:1, given the transparency'
        },
        'AAA.1_4_3.G145.Abs': {
          variable: false,
          quality: 1,
          what: 'Contrast between the absolutely positioned large text and its background may be less than 3:1'
        },
        'AAA.1_4_3.G145.Alpha': {
          variable: false,
          quality: 1,
          what: 'Contrast between the text and its background may be less than 3:1, given the transparency'
        },
        'AAA.1_4_3.G145.BgImage': {
          variable: false,
          quality: 1,
          what: 'Contrast between the text and its background image may be less than 3:1'
        },
        'AAA.1_4_3.G18.BgImage': {
          variable: false,
          quality: 1,
          what: 'Contrast between the text and its background image may be less than 4.5:1'
        },
        'AAA.1_4_6.G17.Abs': {
          variable: false,
          quality: 1,
          what: 'Contrast between the absolutely positioned text and its background may be less than 7:1'
        },
        'AAA.1_4_6.G17.BgImage': {
          variable: false,
          quality: 1,
          what: 'Contrast between the text and its background image may be less than 7:1'
        }
      }
    }
  },
  idEmpty: {
    wcag: '1.3.1',
    weight: 4,
    tools: {
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
    wcag: '1.3.1',
    weight: 4,
    tools: {
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
    wcag: '2.4.6',
    weight: 3,
    tools: {
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
        'AAA.1_3_1.H42.2': {
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
        },
        heading_content_exists: {
          variable: false,
          quality: 1,
          what: 'Heading element has no descriptive content'
        }
      },
      nuVal: {
        'Empty heading.': {
          variable: false,
          quality: 1,
          what: 'Empty heading'
        }
      },
      qualWeb: {
        'QW-ACT-R35': {
          variable: false,
          quality: 1,
          what: 'Heading has no accessible name'
        }
      },
      wave: {
        heading_empty: {
          variable: false,
          quality: 1,
          what: 'Empty heading'
        }
      }
    }
  },
  headingOfNothing: {
    wcag: '1.3.1',
    weight: 2,
    tools: {
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
    wcag: '1.3.1',
    weight: 1,
    tools: {
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
    wcag: '1.1.1',
    weight: 1,
    tools: {
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
        alt_redundant: {
          variable: false,
          quality: 1,
          what: 'Redundant text alternative'
        }
      }
    }
  },
  decorativeTitle: {
    wcag: '1.3.1',
    weight: 1,
    tools: {
      htmlcs: {
        'AAA.1_1_1.H67.1': {
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
        image_title: {
          variable: false,
          quality: 1,
          what: 'Image has a title attribute value but no alt value'
        }
      }
    }
  },
  titleRedundant: {
    wcag: '1.3.1',
    weight: 1,
    tools: {
      qualWeb: {
        'QW-BP3': {
          variable: false,
          quality: 1,
          what: 'Link text content is equal to the title attribute'
        }
      },
      tenon: {
        79: {
          variable: false,
          quality: 1,
          what: 'Link has a title attribute that is the same as the text inside the link'
        }
      },
      wave: {
        title_redundant: {
          variable: false,
          quality: 1,
          what: 'Title attribute text is the same as text or alternative text'
        }
      }
    }
  },
  titleEmpty: {
    wcag: '1.3.1',
    weight: 1,
    tools: {
      continuum: {
        152: {
          variable: false,
          quality: 1,
          what: 'title attribute is empty'
        }
      },
      htmlcs: {
        'AAA.1_3_1.H65': {
          variable: false,
          quality: 0.5,
          what: 'title attribute of the form control is empty or only whitespace'
        },
        'AAA.4_1_2.H65': {
          variable: false,
          quality: 0.5,
          what: 'title attribute of the form control is empty or only whitespace'
        }
      },
      nuVal: {
        'Element title must not be empty.': {
          variable: false,
          quality: 1,
          what: 'Element has an empty title attribute'
        }
      }
    }
  },
  docType: {
    wcag: '1.3.1',
    weight: 10,
    tools: {
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
          what: 'document has no valid doctype property'
        }
      }
    }
  },
  pageTitle: {
    wcag: '2.4.2',
    weight: 10,
    tools: {
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
        'AAA.2_4_2.H25.1.NoTitleEl': {
          variable: false,
          quality: 1,
          what: 'Document head element contains no title element'
        },
        'AAA.2_4_2.H25.1.EmptyTitle': {
          variable: false,
          quality: 1,
          what: 'Document head element contains an empty title element'
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
      qualWeb: {
        'QW-ACT-R1': {
          variable: false,
          quality: 1,
          what: 'HTML page has no title'
        }
      },
      wave: {
        title_invalid: {
          variable: false,
          quality: 1,
          what: 'Missing or uninformative page title'
        }
      }
    }
  },
  headingLevelSkip: {
    wcag: '1.3.1',
    weight: 2,
    tools: {
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
      wave: {
        heading_skipped: {
          variable: false,
          quality: 1,
          what: 'Skipped heading level'
        }
      }
    }
  },
  headingStructure: {
    wcag: '1.3.1',
    weight: 2,
    tools: {
      htmlcs: {
        'AAA.1_3_1_AAA.G141': {
          variable: false,
          quality: 1,
          what: 'Heading level is incorrect'
        }
      },
      tenon: {
        155: {
          variable: false,
          quality: 1,
          what: 'Headings are not structured in a hierarchical manner'
        }
      }
    }
  },
  headingLevelless: {
    wcag: '1.3.1',
    weight: 1,
    tools: {
      continuum: {
        71: {
          variable: false,
          quality: 1,
          what: 'Element with a heading role has no aria-level attribute'
        }
      }
    }
  },
  noHeading: {
    wcag: '1.3.1',
    weight: 3,
    tools: {
      alfa: {
        r59: {
          variable: false,
          quality: 1,
          what: 'Document has no headings'
        }
      },
      qualWeb: {
        'QW-BP1': {
          variable: false,
          quality: 1,
          what: 'h1-h6 not used to identify headings'
        }
      },
      wave: {
        heading_missing: {
          variable: false,
          quality: 1,
          what: 'Page has no headings'
        }
      }
    }
  },
  h1Multiple: {
    wcag: '1.3.1',
    weight: 2,
    tools: {
      nuVal: {
        'Consider using the h1 element as a top-level heading only (all h1 elements are treated as top-level headings by many screen readers and other tools).': {
          variable: false,
          quality: 1,
          what: 'Page contains more than 1 h1 element'
        }
      }
    }
  },
  h1Missing: {
    wcag: '1.3.1',
    weight: 3,
    tools: {
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
        'h1_missing': {
          variable: false,
          quality: 1,
          what: 'Missing first level heading'
        }
      }
    }
  },
  articleHeadingless: {
    wcag: '1.3.1',
    weight: 1,
    tools: {
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
    wcag: '1.3.1',
    weight: 1,
    tools: {
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
      },
      qualWeb: {
        'QW-WCAG-T9': {
          variable: false,
          quality: 1,
          what: 'Page is not organized using headings'
        }
      }
    }
  },
  justification: {
    wcag: '1.4.8',
    weight: 2,
    tools: {
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
      qualWeb: {
        'QW-WCAG-T27': {
          variable: false,
          quality: 1,
          what: 'Text is justified (aligned to both the left and the right margins)'
        }
      },
      wave: {
        text_justified: {
          variable: false,
          quality: 1,
          what: 'Text is justified'
        }
      }
    }
  },
  justificationRisk: {
    wcag: '1.4.8',
    weight: 1,
    tools: {
      qualWeb: {
        'QW-WCAG-T29': {
          variable: false,
          quality: 1,
          what: 'Alignment either to the left or right is not specified in CSS'
        }
      }
    }
  },
  nonSemanticText: {
    wcag: '1.3.1',
    weight: 2,
    tools: {
      htmlcs: {
        'AAA.1_3_1.H49.AlignAttr': {
          variable: false,
          quality: 1,
          what: 'Special text is aligned nonsemantically'
        },
        'AAA.1_3_1.H49.B': {
          variable: false,
          quality: 1,
          what: 'Special text is bolded nonsemantically'
        },
        'AAA.1_3_1.H49.I': {
          variable: false,
          quality: 1,
          what: 'Special text is italicized nonsemantically'
        },
        'AAA.1_3_1.H49.Big': {
          variable: false,
          quality: 1,
          what: 'Special text is enlarged nonsemantically'
        },
        'AAA.1_3_1.H49.Small': {
          variable: false,
          quality: 1,
          what: 'Special text is made small nonsemantically'
        },
        'AAA.1_3_1.H49.U': {
          variable: false,
          quality: 1,
          what: 'Special text is underlined nonsemantically'
        },
        'AAA.1_3_1.H49.Center': {
          variable: false,
          quality: 1,
          what: 'Special text is centered nonsemantically'
        },
        'AAA.1_3_1.H49.Font': {
          variable: false,
          quality: 1,
          what: 'Special text is designated nonsemantically with a (deprecated) font element'
        }
      }
    }
  },
  pseudoParagraphRisk: {
    wcag: '1.3.1',
    weight: 1,
    tools: {
      tenon: {
        242: {
          variable: false,
          quality: 1,
          what: 'Multiple consecutive br elements may simulate paragraphs'
        }
      }
    }
  },
  pseudoList: {
    wcag: '1.3.1',
    weight: 1,
    tools: {
      qualWeb: {
        'QW-BP11': {
          variable: false,
          quality: 1,
          what: 'br is used to make a list'
        }
      }
    }
  },
  pseudoCodeRisk: {
    wcag: '1.3.1',
    weight: 1,
    tools: {
      alfa: {
        r79: {
          variable: false,
          quality: 1,
          what: 'pre element is not used for a figure or for code, kbd, and samp elements'
        }
      }
    }
  },
  pseudoHeadingRisk: {
    wcag: '1.3.1',
    weight: 1,
    tools: {
      axe: {
        'p-as-heading': {
          variable: false,
          quality: 1,
          what: 'Styled p element may be misused as a heading'
        }
      },
      htmlcs: {
        'AAA.1_3_1.H42': {
          variable: false,
          quality: 1,
          what: 'Heading coding is not used but the element may be intended as a heading'
        }
      },
      wave: {
        heading_possible: {
          variable: false,
          quality: 1,
          what: 'Possible heading'
        }
      }
    }
  },
  pseudoLinkRisk: {
    wcag: '1.3.1',
    weight: 1,
    tools: {
      tenon: {
        129: {
          variable: false,
          quality: 1,
          what: 'CSS underline on text that is not a link'
        }
      },
      wave: {
        underline: {
          variable: false,
          quality: 1,
          what: 'CSS underline on text that is not a link'
        }
      }
    }
  },
  listChild: {
    wcag: '1.3.1',
    weight: 4,
    tools: {
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
        245: {
          variable: false,
          quality: 1,
          what: 'ol element does not contain only li, script, template, or listitem-role elements as direct child elements'
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
          what: 'dl element has no child element'
        }
      },
      qualWeb: {
        'QW-BP24': {
          variable: false,
          quality: 1,
          what: 'ul or ol element has a child other than li, script, or template'
        }
      }
    }
  },
  listItemOrphan: {
    wcag: '1.3.1',
    weight: 4,
    tools: {
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
      }
    }
  },
  pseudoListRisk: {
    wcag: '1.3.1',
    weight: 1,
    tools: {
      qualWeb: {
        'QW-BP23': {
          variable: false,
          quality: 1,
          what: 'List item is used nonsemantically'
        }
      },
      wave: {
        list_possible: {
          variable: false,
          quality: 1,
          what: 'List may fail to be coded as such'
        }
      }
    }
  },
  pseudoOrderedListRisk: {
    wcag: '1.3.1',
    weight: 1,
    tools: {
      htmlcs: {
        'AAA.1_3_1.H48.2': {
          variable: false,
          quality: 1,
          what: 'Ordered list may fail to be coded as such'
        }
      }
    }
  },
  pseudoNavList: {
    wcag: '1.3.1',
    weight: 2,
    tools: {
      htmlcs: {
        'AAA.1_3_1.H48': {
          variable: false,
          quality: 1,
          what: 'Navigation links are not coded as a list'
        }
      },
      qualWeb: {
        'QW-WCAG-T32': {
          variable: false,
          quality: 1,
          what: 'ol, ul or dl is not used for a list or group of links'
        }
      }
    }
  },
  selectNoText: {
    wcag: '4.1.2',
    weight: 3,
    tools: {
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
          what: 'select element has no machanism allowing an accessible name to be calculated'
        }
      },
      htmlcs: {
        'AAA.4_1_2.H91.Select.Name': {
          variable: false,
          quality: 1,
          what: 'Select element has no accessible name'
        },
        'AAA.4_1_2.H91.Select.Value': {
          variable: false,
          quality: 1,
          what: 'Select element value has no accessible name'
        }
      },
      wave: {
        select_missing_label: {
          variable: false,
          quality: 1,
          what: 'Select element has no label'
        }
      }
    }
  },
  optionNoText: {
    wcag: '4.1.2',
    weight: 4,
    tools: {
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
    wcag: '1.3.1',
    weight: 1,
    tools: {
      htmlcs: {
        'AAA.1_3_1.H85.2': {
          variable: false,
          quality: 1,
          what: 'Selection list may contain groups of related options that are not grouped with optgroup'
        }
      }
    }
  },
  noOptionFocusable: {
    wcag: '2.1.1',
    weight: 1,
    tools: {
      ibm: {
        aria_child_tabbable: {
          variable: false,
          quality: 1,
          what: 'No descendent element with an option role is tabbable'
        }
      }
    }
  },
  accessKeyDuplicate: {
    wcag: '1.3.1',
    weight: 3,
    tools: {
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
        accesskey: {
          variable: false,
          quality: 1,
          what: 'Accesskey'
        }
      }
    }
  },
  fieldSetMissing: {
    wcag: '1.3.1',
    weight: 2,
    tools: {
      ibm: {
        WCAG20_Input_RadioChkInFieldSet: {
          variable: false,
          quality: 1,
          what: 'Input is in a different group than another with the name'
        },
        input_checkboxes_grouped: {
          variable: false,
          quality: 1,
          what: 'checkbox input is not grouped with others with the same name'
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
        fieldset_missing: {
          variable: false,
          quality: 1,
          what: 'fieldset element is missing'
        }
      }
    }
  },
  fieldSetRisk: {
    wcag: '1.3.1',
    weight: 1,
    tools: {
      htmlcs: {
        'AAA.1_3_1.H71.SameName': {
          variable: false,
          quality: 1,
          what: 'Radio buttons or check boxes may require a group description via a fieldset element'
        }
      }
    }
  },
  legendMisplaced: {
    wcag: '4.1.2',
    weight: 4,
    tools: {
      continuum: {
        738: {
          variable: false,
          quality: 1,
          what: 'legend element is not the first child of its fieldset element'
        }
      }
    }
  },
  legendMissing: {
    wcag: '4.1.2',
    weight: 2,
    tools: {
      continuum: {
        221: {
          variable: false,
          quality: 1,
          what: 'Element with a radiogroup role has no machanism allowing an accessible name to be calculated'
        }
      },
      htmlcs: {
        'AAA.1_3_1.H71.NoLegend': {
          variable: false,
          quality: 1,
          what: 'fieldset has no legend element'
        }
      },
      ibm: {
        WCAG20_Fieldset_HasLegend: {
          variable: false,
          quality: 1,
          what: 'fieldset element has no single, non-empty legend element as a label'
        },
        fieldset_legend_valid: {
          variable: false,
          quality: 1,
          what: 'fieldset element does not have a legend element'
        }
      },
      qualWeb: {
        'QW-WCAG-T3': {
          variable: false,
          quality: 1,
          what: 'Description for a group of form controls using fieldset and legend elements is not provided'
        }
      },
      wave: {
        legend_missing: {
          variable: false,
          quality: 1,
          what: 'fieldset has no legend element'
        }
      }
    }
  },
  groupName: {
    wcag: '4.1.2',
    weight: 3,
    tools: {
      alfa: {
        r60: {
          variable: false,
          quality: 1,
          what: 'Form-control group has no accessible name'
        }
      },
      htmlcs: {
        'AAA.4_1_2.H91.Fieldset.Name': {
          variable: false,
          quality: 1,
          what: 'Fieldset has no accessible name'
        }
      },
      ibm: {
        group_withInputs_hasName: {
          variable: false,
          quality: 1,
          what: 'Groups with nested inputs has no unique accessible name'
        },
        fieldset_label_valid: {
          variable: false,
          quality: 1,
          what: 'Group or fieldset has no accessible name'
        }
      }
    }
  },
  layoutTable: {
    wcag: '1.3.1',
    weight: 2,
    tools: {
      qualWeb: {
        'QW-WCAG-T12': {
          variable: false,
          quality: 1,
          what: 'th or caption element or non-empty summary attribute used in a layout table'
        },
        'QW-BP9': {
          variable: false,
          quality: 1,
          what: 'Table element without header cells has a caption'
        }
      },
      testaro: {
        nonTable: {
          variable: false,
          quality: 1,
          what: 'table element fails the structural requirements for tabular data'
        }
      },
      wave: {
        table_layout: {
          variable: false,
          quality: 1,
          what: 'table element is misused to arrange content'
        }
      }
    }
  },
  tabularTableless: {
    wcag: '1.3.1',
    weight: 3,
    tools: {
      qualWeb: {
        'QW-WCAG-T18': {
          variable: false,
          quality: 1,
          what: 'Table markup not used to present tabular information'
        }
      }
    }
  },
  tableNoSummary: {
    wcag: '1.3.1',
    weight: 2,
    tools: {
      qualWeb: {
        'QW-WCAG-T4': {
          variable: false,
          quality: 1,
          what: 'summary attribute is not used to give an overview of a data table'
        }
      }
    }
  },
  tableColumnsVary: {
    wcag: '1.3.1',
    weight: 3,
    tools: {
      nuVal: {
        '^A table row was .+ columns wide, which is less than the column count established by the first row.*$': {
          variable: true,
          quality: 1,
          what: 'Table row has a column count smaller than that of the first row'
        },
        '^A table row was .+ columns wide and exceeded the column count established by the first row.*$': {
          variable: true,
          quality: 1,
          what: 'Table row has a column count larger than that of the first row'
        }
      }
    }
  },
  tableCaption: {
    wcag: '1.3.1',
    weight: 1,
    tools: {
      axe: {
        'table-fake-caption': {
          variable: false,
          quality: 1,
          what: 'Data or header cells are used for a table caption instead of a caption element'
        }
      },
      htmlcs: {
        'AAA.1_3_1.H39.3.NoCaption': {
          variable: false,
          quality: 1,
          what: 'Table has no caption element'
        }
      },
      qualWeb: {
        'QW-WCAG-T2': {
          variable: false,
          quality: 1,
          what: 'caption element not used to associate a caption with a data table'
        }
      }
    }
  },
  cellHeadersNotInferrable: {
    wcag: '1.3.1',
    weight: 4,
    tools: {
      htmlcs: {
        'AAA.1_3_1.H43.HeadersRequired': {
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
  cellHeadersOutsideTable: {
    wcag: '1.3.1',
    weight: 4,
    tools: {
      qualWeb: {
        'QW-ACT-R36': {
          variable: false,
          quality: 1,
          what: 'Headers attribute does not refer to a cell in the same table element'
        }
      },
    }
  },
  cellHeadersAmbiguityRisk: {
    wcag: '1.3.1',
    weight: 2,
    tools: {
      htmlcs: {
        'AAA.1_3_1.H43.ScopeAmbiguous': {
          variable: false,
          quality: 1,
          what: 'Complex table requires headers attributes of cells instead of header scopes'
        }
      },
      qualWeb: {
        'QW-WCAG-T14': {
          variable: false,
          quality: 1,
          what: 'id and headers attributes not used to associate data cells with header cells in a data table'
        },
        'QW-WCAG-T25': {
          variable: false,
          quality: 1,
          what: 'scope attribute not used to associate header cells and data cells in a data table'
        },
        'QW-BP12': {
          variable: false,
          quality: 1,
          what: 'scope col and row are not used'
        }
      }
    }
  },
  tableHeaderless: {
    wcag: '1.3.1',
    weight: 3,
    tools: {
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
    wcag: '1.3.1',
    weight: 3,
    tools: {
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
    wcag: '1.3.1',
    weight: 4,
    tools: {
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
      },
      qualWeb: {
        'QW-ACT-R39': {
          variable: false,
          quality: 1,
          what: 'Table header cell has no assigned data cell'
        }
      }
    }
  },
  TableHeaderScopeRisk: {
    wcag: '1.3.1',
    weight: 1,
    tools: {
      htmlcs: {
        'AAA.1_3_1.H63.1': {
          variable: false,
          quality: 1,
          what: 'Not all th elements in the table have a scope attribute, so an inferred scope may be incorrect'
        }
      }
    }
  },
  tableHeaderEmpty: {
    wcag: '1.3.1',
    weight: 2,
    tools: {
      wave: {
        th_empty: {
          variable: false,
          quality: 1,
          what: 'th (table header) contains no text'
        }
      }
    }
  },
  tableEmbedded: {
    wcag: '1.3.1',
    weight: 2,
    tools: {
      qualWeb: {
        'QW-BP5': {
          variable: false,
          quality: 1,
          what: 'table element is inside another table element'
        }
      }
    }
  },
  controlNoText: {
    wcag: '4.1.2',
    weight: 4,
    tools: {
      axe: {
        label: {
          variable: false,
          quality: 1,
          what: 'Form element has no label'
        }
      },
      htmlcs: {
        'AAA.1_3_1.F68': {
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
        },
        input_label_exists: {
          variable: false,
          quality: 1,
          what: 'Element with the role of a form control has no associated label'
        }
      },
      qualWeb: {
        'QW-ACT-R16': {
          variable: false,
          quality: 1,
          what: 'Form control has no accessible name'
        }
      },
      wave: {
        label_missing: {
          variable: false,
          quality: 1,
          what: 'form element has no label'
        }
      }
    }
  },
  controlLabelInvisible: {
    wcag: '2.4.6',
    weight: 4,
    tools: {
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
    wcag: '2.4.6',
    weight: 3,
    tools: {
      wave: {
        label_title: {
          variable: false,
          quality: 1,
          what: 'Form control has a title but no label'
        }
      }
    }
  },
  visibleLabelNotName: {
    wcag: '2.5.3',
    weight: 3,
    tools: {
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
        'AAA.2_5_3.F96': {
          variable: false,
          quality: 1,
          what: 'Visible label is not in the accessible name'
        }
      },
      ibm: {
        label_name_visible: {
          variable: false,
          quality: 1,
          what: 'Accessible name does not match or contain the visible label text'
        },
        WCAG21_Label_Accessible: {
          variable: false,
          quality: 1,
          what: 'Accessible name does not match or contain the visible label text'
        }
      },
      qualWeb: {
        'QW-ACT-R30': {
          variable: false,
          quality: 1,
          what: 'Visible label is not part of the accessible name'
        }
      }
    }
  },
  targetSize: {
    wcag: '2.5.5',
    weight: 3,
    tools: {
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
    wcag: '2.4',
    weight: 1,
    tools: {
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
    wcag: '2.5.5',
    weight: 3,
    tools: {
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
        'An element with the attribute role=button must not appear as a descendant of the a element.': {
          variable: false,
          quality: 1,
          what: 'Element with a button role is a descendant of an a element'
        },
        'The element button must not appear as a descendant of an element with the attribute role=button.': {
          variable: false,
          quality: 1,
          what: 'button element is a descendant of an element with a button role'
        },
        'The element label must not appear as a descendant of an element with the attribute role=button.': {
          variable: false,
          quality: 1,
          what: 'label element is a descendant of an element with a button role'
        },
        'The element select must not appear as a descendant of an element with the attribute role=button.': {
          variable: false,
          quality: 1,
          what: 'select element is a descendant of an element with a button role'
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
        'An element with the attribute role=menuitem must not appear as a descendant of the a element.': {
          variable: false,
          quality: 1,
          what: 'Element with a menuitem role is a descendant of an a element'
        },
        'An element with the attribute role=option must not appear as a descendant of the a element.': {
          variable: false,
          quality: 1,
          what: 'Element with an option role is a descendant of an a element'
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
    wcag: '2.1.1',
    weight: 4,
    tools: {
      alfa: {
        r95: {
          variable: false,
          quality: 1,
          what: 'iframe element with a negative tabindex attribute contains an interactive element'
        }
      },
      ibm: {
        Rpt_Aria_MissingFocusableChild: {
          variable: false,
          quality: 1,
          what: 'UI component has no focusable child element for keyboard access'
        }
      },
      qualWeb: {
        'QW-ACT-R70': {
          variable: false,
          quality: 1,
          what: 'iframe with negative tabindex has interactive elements'
        },
        'QW-WCAG-T24': {
          variable: false,
          quality: 1,
          what: 'Script removes the focus when focus is received'
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
    wcag: '2.4.7',
    weight: 4,
    tools: {
      alfa: {
        r65: {
          variable: false,
          quality: 1,
          what: 'Element in the sequential focus order has no visible focus'
        }
      },
      qualWeb: {
        'QW-ACT-R62': {
          variable: false,
          quality: 1,
          what: 'Element in the sequential focus order has no visible focus'
        }
      },
      testaro: {
        focInd: {
          variable: false,
          quality: 1,
          what: 'Focused element displays a nonstandard or no focus indicator'
        }
      }
    }
  },
  allCaps: {
    wcag: '3.1.5',
    weight: 1,
    tools: {
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
    wcag: '3.1.5',
    weight: 1,
    tools: {
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
    wcag: '1.3.6',
    weight: 2,
    tools: {
      wave: {
        region_missing: {
          variable: false,
          quality: 1,
          what: 'Page has no regions or ARIA landmarks'
        }
      }
    }
  },
  contentBeyondLandmarks: {
    wcag: '1.3.6',
    weight: 2,
    tools: {
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
        },
        aria_content_in_landmark: {
          variable: false,
          quality: 1,
          what: 'Content is not within a landmark element'
        }
      }
    }
  },
  footerTopLandmark: {
    wcag: '1.3.6',
    weight: 1,
    tools: {
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
    wcag: '1.3.6',
    weight: 2,
    tools: {
      axe: {
        'landmark-complementary-is-top-level': {
          variable: false,
          quality: 1,
          what: 'complementary landmark (aside) is contained in another landmark'
        }
      },
      qualWeb: {
        'QW-BP25': {
          variable: false,
          quality: 1,
          what: 'complementary landmark is not at the top level'
        },
        'QW-BP26': {
          variable: false,
          quality: 1,
          what: 'complementary landmark is not at the top level'
        }
      }
    }
  },
  mainNotTop: {
    wcag: '1.3.6',
    weight: 2,
    tools: {
      axe: {
        'landmark-main-is-top-level': {
          variable: false,
          quality: 1,
          what: 'main landmark is contained in another landmark'
        }
      },
      qualWeb: {
        'QW-BP27': {
          variable: false,
          quality: 1,
          what: 'main landmark is not at the top level'
        }
      }
    }
  },
  mainConfusion: {
    wcag: '1.3.6',
    weight: 3,
    tools: {
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
  mainNone: {
    wcag: '1.3.6',
    weight: 2,
    tools: {
      axe: {
        'landmark-one-main': {
          variable: false,
          quality: 1,
          what: 'page has no main landmark'
        }
      },
      qualWeb: {
        'QW-ACT-R63': {
          variable: false,
          quality: 1,
          what: 'Document has no landmark with non-repeated content'
        }
      }
    }
  },
  mainMultiple: {
    wcag: '1.3.6',
    weight: 2,
    tools: {
      axe: {
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
      },
      nuVal: {
        'A document must not include more than one visible main element.': {
          variable: false,
          quality: 1,
          what: 'Page includes more than 1 visible main element'
        }
      }
    }
  },
  bannerNot1: {
    wcag: '1.3.6',
    weight: 2,
    tools: {
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
        },
        aria_banner_single: {
          variable: false,
          quality: 1,
          what: 'More than one element with a banner role is on the page'
        }
      },
      qualWeb: {
        'QW-BP20': {
          variable: false,
          quality: 1,
          what: 'Document has more than 1 banner landmark'
        }
      }
    }
  },
  bannerNotTop: {
    wcag: '1.3.6',
    weight: 2,
    tools: {
      axe: {
        'landmark-banner-is-top-level': {
          variable: false,
          quality: 1,
          what: 'banner landmark is contained in another landmark'
        }
      },
      qualWeb: {
        'QW-BP19': {
          variable: false,
          quality: 1,
          what: 'banner landmark is not at the top level'
        }
      }
    }
  },
  footerConfusion: {
    wcag: '1.3.6',
    weight: 3,
    tools: {
      ibm: {
        Rpt_Aria_MultipleContentinfoLandmarks_Implicit: {
          variable: false,
          quality: 1,
          what: 'Element with a contentinfo role has no unique purpose label among the contentinfo-role elements'
        },
        aria_contentinfo_label_unique: {
          variable: false,
          quality: 1,
          what: 'Multiple elements with a contentinfo role have no unique labels'
        }
      }
    }
  },
  footerNot1: {
    wcag: '1.3.6',
    weight: 2,
    tools: {
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
        },
        aria_contentinfo_single: {
          variable: false,
          quality: 1,
          what: 'Multiple elements with a contentinfo role are on the page'
        }
      },
      qualWeb: {
        'QW-BP21': {
          variable: false,
          quality: 0.5,
          what: 'There are multiple contentinfo or banner landmarks'
        }
      }
    }
  },
  landmarkConfusion: {
    wcag: '1.3.6',
    weight: 3,
    tools: {
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
        },
        aria_landmark_name_unique: {
          variable: false,
          quality: 1,
          what: 'Multiple landmarks with the same parent region are not distinguished from one another'
        }
      }
    }
  },
  articleConfusion: {
    wcag: '1.3.6',
    weight: 3,
    tools: {
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
    wcag: '1.3.6',
    weight: 3,
    tools: {
      ibm: {
        Rpt_Aria_MultipleFormLandmarks_Implicit: {
          variable: false,
          quality: 1,
          what: 'Element with a form role has no unique purpose label among the form-role elements'
        },
        aria_form_label_unique: {
          variable: false,
          quality: 1,
          what: 'Multiple elements with a form role do not have unique labels'
        }
      }
    }
  },
  applicationConfusion: {
    wcag: '1.3.6',
    weight: 3,
    tools: {
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
    wcag: '1.3.6',
    weight: 3,
    tools: {
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
        },
        aria_complementary_label_unique: {
          variable: false,
          quality: 1,
          what: 'Multiple elements with a complementary role have no unique labels'
        }
      }
    }
  },
  bannerConfusion: {
    wcag: '1.3.6',
    weight: 3,
    tools: {
      ibm: {
        Rpt_Aria_MultipleBannerLandmarks_Implicit: {
          variable: false,
          quality: 1,
          what: 'Element with a banner role has no unique purpose label among the banner-role elements'
        },
        aria_banner_label_unique: {
          variable: false,
          quality: 1,
          what: 'Multiple elements with a banner role have no unique labels'
        }
      }
    }
  },
  navConfusion: {
    wcag: '1.3.6',
    weight: 3,
    tools: {
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
        },
        aria_navigation_label_unique: {
          variable: false,
          quality: 1,
          what: 'Multiple elements with the navigation role do not have unique labels'
        }
      }
    }
  },
  regionConfusion: {
    wcag: '1.3.6',
    weight: 3,
    tools: {
      ibm: {
        Rpt_Aria_MultipleRegionsUniqueLabel_Implicit: {
          variable: false,
          quality: 1,
          what: 'Element with a region role has no unique label among the region-role elements'
        },
        aria_region_label_unique: {
          variable: false,
          quality: 1,
          what: 'Multiple elements with a region role do not have unique labels'
        }
      }
    }
  },
  searchConfusion: {
    wcag: '1.3.6',
    weight: 3,
    tools: {
      ibm: {
        Rpt_Aria_MultipleSearchLandmarks: {
          variable: false,
          quality: 1,
          what: 'Element with a search role has no unique purpose label among the search-role elements'
        },
        aria_search_label_unique: {
          variable: false,
          quality: 1,
          what: 'Multiple elements with the search role do not have unique labels'
        }
      }
    }
  },
  asideNoText: {
    wcag: '1.3.6',
    weight: 3,
    tools: {
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
    wcag: '1.3.6',
    weight: 1,
    tools: {
      ibm: {
        Rpt_Aria_ComplementaryRequiredLabel_Implicit: {
          variable: false,
          quality: 1,
          what: 'Element with a complementary role has no label'
        },
        aria_complementary_labelled: {
          variable: false,
          quality: 1,
          what: 'Element with a complementary role has no label'
        },
        Rpt_Aria_ComplementaryLandmarkLabel_Implicit: {
          variable: false,
          quality: 1,
          what: 'Element with a complementary role has no visible purpose label'
        },
        aria_complementary_label_visible: {
          variable: false,
          quality: 1,
          what: 'Element with a complementary role has no visible label'
        }
      }
    }
  },
  navNoText: {
    wcag: '1.3.6',
    weight: 3,
    tools: {
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
    wcag: '1.3.1',
    weight: 4,
    tools: {
      ibm: {
        Valerie_Label_HasContent: {
          variable: false,
          quality: 1,
          what: 'label element has no non-empty purpose-descriptive text'
        },
        label_content_exists: {
          variable: false,
          quality: 1,
          what: 'label element has no descriptive text identifying the expected input'
        }
      }
    }
  },
  focusableOperable: {
    wcag: '2.1.1',
    weight: 3,
    tools: {
      testaro: {
        focOp: {
          variable: false,
          quality: 1,
          what: 'Tab-focusable elements that are inoperable or operable elements that are not focusable'
        }
      }
    }
  },
  focusableRole: {
    wcag: '4.1.2',
    weight: 3,
    tools: {
      axe: {
        'focus-order-semantics': {
          variable: false,
          quality: 1,
          what: 'Focusable element has no active role'
        }
      },
      qualWeb: {
        'QW-WCAG-T26': {
          variable: false,
          quality: 1,
          what: 'Script makes a div or span a user interface control without providing a role for the control'
        }
      }
    }
  },
  focusableHidden: {
    wcag: '4.1.2',
    weight: 4,
    tools: {
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
        },
        aria_hidden_nontabbable: {
          variable: false,
          quality: 1,
          what: 'Element has an ancestor with a true aria-hidden attribute but is focusable'
        }
      },
      qualWeb: {
        'QW-ACT-R13': {
          variable: false,
          quality: 1,
          what: 'Element with aria-hidden has focusable content'
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
    wcag: '1.4.10',
    weight: 3,
    tools: {
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
    wcag: '4.1.2',
    weight: 4,
    tools: {
      alfa: {
        r90: {
          variable: false,
          quality: 1,
          what: 'Element has a role making its children presentational but contains a focusable element'
        }
      },
      qualWeb: {
        'QW-ACT-R65': {
          variable: false,
          quality: 1,
          what: 'Element with presentational children has focusable content'
        }
      }
    }
  },
  multipleLabelees: {
    wcag: '1.3.1',
    weight: 4,
    tools: {
      nuVal: {
        'The label element may contain at most one button, input, meter, output, progress, select, or textarea descendant.': {
          variable: false,
          quality: 1,
          what: 'label element has more than 1 labelable descendant.'
        },
        'label element with multiple labelable descendants.': {
          variable: false,
          quality: 1,
          what: 'label element has multiple labelable descendants.'
        }
      }
    }
  },
  labeledHidden: {
    wcag: '1.3.1',
    weight: 2,
    tools: {
      htmlcs: {
        'AAA.1_3_1.F68.Hidden': {
          variable: false,
          quality: 1,
          what: 'Hidden form field is needlessly labeled.'
        },
        'AAA.1_3_1.F68.HiddenAttr': {
          variable: false,
          quality: 1,
          what: 'Form field with a hidden attribute is needlessly labeled.'
        }
      }
    }
  },
  contentHidden: {
    wcag: '2.4.7',
    weight: 10,
    tools: {
      testaro: {
        allHidden: {
          variable: false,
          quality: 1,
          what: 'Content is entirely or mainly hidden'
        }
      }
    }
  },
  hiddenContentRisk: {
    wcag: '4.1',
    weight: 1,
    tools: {
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
    wcag: '4.1',
    weight: 1,
    tools: {
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
    wcag: '4.1',
    weight: 2,
    tools: {
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
    wcag: '1.4.13',
    weight: 2,
    tools: {
      testaro: {
        hover: {
          variable: false,
          quality: 1,
          what: 'Hovering is impossible or mis-indicated or changes content'
        }
      }
    }
  },
  labelClash: {
    wcag: '1.3.1',
    weight: 2,
    tools: {
      axe: {
        'form-field-multiple-labels': {
          variable: false,
          quality: 1,
          what: 'Form field has multiple label elements'
        }
      },
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
        },
        form_label_unique: {
          variable: false,
          quality: 1,
          what: 'Form control has more than one label'
        }
      },
      wave: {
        label_multiple: {
          variable: false,
          quality: 1,
          what: 'Form control has more than one label associated with it'
        }
      }
    }
  },
  labelEmpty: {
    wcag: '1.3.1',
    weight: 3,
    tools: {
      htmlcs: {
        'AAA.1_3_1.ARIA6': {
          variable: false,
          quality: 1,
          what: 'Value of the aria-label attribute of the form control is empty or only whitespace'
        },
        'AAA.4_1_2.ARIA6': {
          variable: false,
          quality: 1,
          what: 'Value of the aria-label attribute of the form control is empty or only whitespace'
        }
      },
      wave: {
        label_empty: {
          variable: false,
          quality: 1,
          what: 'Empty form label'
        }
      }
    }
  },
  linkComprehensionRisk: {
    wcag: '2.4.4',
    weight: 1,
    tools: {
      wave: {
        link_suspicious: {
          variable: false,
          quality: 1,
          what: 'Suspicious link text'
        }
      }
    }
  },
  nonWebLink: {
    wcag: '1.3.3',
    weight: 1,
    tools: {
      continuum: {
        141: {
          variable: false,
          quality: 1,
          what: 'a element has an href attribute set to an image file reference'
        }
      },
      wave: {
        link_excel: {
          variable: false,
          quality: 1,
          what: 'Link to Microsoft Excel workbook'
        },
        link_word: {
          variable: false,
          quality: 1,
          what: 'Link to Microsoft Word document'
        }
      }
    }
  },
  linkVague: {
    wcag: '2.4.4',
    weight: 3,
    tools: {
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
    wcag: '1.3.3',
    weight: 2,
    tools: {
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
    wcag: '2.1.1',
    weight: 2,
    tools: {
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
    wcag: '1.3.1',
    weight: 4,
    tools: {
      wave: {
        aria_menu_broken: {
          variable: false,
          quality: 1,
          what: 'ARIA menu does not contain required menu items'
        }
      }
    }
  },
  tabNavigation: {
    wcag: '2.1.1',
    weight: 2,
    tools: {
      testaro: {
        tabNav: {
          variable: false,
          quality: 1,
          what: 'Nonstandard keyboard navigation among tabs'
        }
      }
    }
  },
  siteNavigation: {
    wcag: '2.4',
    weight: 1,
    tools: {
      qualWeb: {
        'QW-WCAG-T15': {
          variable: false,
          quality: 1,
          what: 'link element and navigation tools not used'
        }
      }
    }
  },
  spontaneousMotion: {
    wcag: '2.2.2',
    weight: 2,
    tools: {
      testaro: {
        motion: {
          variable: false,
          quality: 1,
          what: 'Change of visible content not requested by user'
        }
      }
    }
  },
  blink: {
    wcag: '2.2.2',
    weight: 4,
    tools: {
      qualWeb: {
        'QW-WCAG-T13': {
          variable: false,
          quality: 1,
          what: 'blink element used'
        },
        'QW-WCAG-T30': {
          variable: false,
          quality: 1,
          what: 'text-decoration:blink is used without a mechanism to stop it in less than five seconds'
        }
      }
    }
  },
  autoplay: {
    wcag: '1.4.2',
    weight: 2,
    tools: {
      axe: {
        'no-autoplay-audio': {
          variable: false,
          quality: 1,
          what: 'video or audio element plays automatically'
        }
      },
      qualWeb: {
        'QW-ACT-R15': {
          variable: false,
          quality: 1,
          what: 'audio or video has audio that plays automatically'
        }
      }
    }
  },
  autoplayLong: {
    wcag: '1.4.2',
    weight: 2,
    tools: {
      qualWeb: {
        'QW-ACT-R49': {
          variable: false,
          quality: 1,
          what: 'audio or video that plays automatically has audio lasting more than 3 seconds'
        }
      }
    }
  },
  autoplayControl: {
    wcag: '1.4.2',
    weight: 2,
    tools: {
      qualWeb: {
        'QW-ACT-R50': {
          variable: false,
          quality: 1,
          what: 'audio or video that plays automatically has no control mechanism'
        }
      }
    }
  },
  refresh: {
    wcag: '2.2.1',
    weight: 3,
    tools: {
      qualWeb: {
        'QW-ACT-R4': {
          variable: false,
          quality: 1,
          what: 'meta element refreshes or redirects with delay'
        },
        'QW-ACT-R71': {
          variable: false,
          quality: 1,
          what: 'meta element has a refresh delay (no exception)'
        }
      }
    }
  },
  parentBad: {
    wcag: '1.3.1',
    weight: 4,
    tools: {
      ibm: {
        aria_parent_required: {
          variable: true,
          quality: 1,
          what: 'Element is not contained in or owned by an element with a required role'
        }
      },
      nuVal: {
        '^Element .+ not allowed as child of element .+ in this context.*$': {
          variable: true,
          quality: 1,
          what: 'Element has an invalid parent'
        }
      }
    }
  },
  inconsistentStyles: {
    wcag: '3.2.4',
    weight: 1,
    tools: {
      testaro: {
        styleDiff: {
          variable: false,
          quality: 1,
          what: 'Heading, link, and button style inconsistencies'
        }
      }
    }
  },
  filterStyle: {
    wcag: '4.1',
    weight: 1,
    tools: {
      testaro: {
        filterStyle: {
          variable: false,
          quality: 1,
          what: 'Element styles include filter'
        }
      }
    }
  },
  zIndexNotZero: {
    wcag: '1.4',
    weight: 1,
    tools: {
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
    wcag: '2.4.3',
    weight: 1,
    tools: {
      axe: {
        tabindex: {
          variable: false,
          quality: 1,
          what: 'Positive tabIndex risks creating a confusing focus order'
        }
      },
      wave: {
        tabindex: {
          variable: false,
          quality: 1,
          what: 'tabIndex value positive'
        }
      }
    }
  },
  tabIndexBad: {
    wcag: '1.3.1',
    weight: 4,
    tools: {
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
    wcag: '2.1.1',
    weight: 4,
    tools: {
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
    wcag: '4.1.2',
    weight: 4,
    tools: {
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
  trackNoSource: {
    wcag: '1.3.1',
    weight: 4,
    tools: {
      continuum: {
        485: {
          variable: false,
          quality: 1,
          what: 'track element has no src attribute set to a text value'
        }
      }
    }
  },
  audioContentNoText: {
    wcag: '1.2.1',
    weight: 4,
    tools: {
      axe: {
        'audio-caption': {
          variable: false,
          quality: 1,
          what: 'audio element has no captions track'
        }
      },
      qualWeb: {
        'QW-ACT-R26': {
          variable: false,
          quality: 1,
          what: 'video element auditory content has no accessible alternative'
        },
        'QW-ACT-R29': {
          variable: false,
          quality: 1,
          what: 'audio element content has no text alternative'
        },
        'QW-ACT-R58': {
          variable: false,
          quality: 1,
          what: 'audio element content has no transcript'
        },
        'QW-ACT-R59': {
          variable: false,
          quality: 1,
          what: 'audio element content is not a media alternative for text'
        },
        'QW-ACT-R60': {
          variable: false,
          quality: 1,
          what: 'video element auditory content has no captions'
        }
      }
    }
  },
  videoContentNoText: {
    wcag: '1.2.2',
    weight: 4,
    tools: {
      axe: {
        'video-caption': {
          variable: false,
          quality: 1,
          what: 'video element has no captions'
        }
      },
      qualWeb: {
        'QW-ACT-R23': {
          variable: false,
          quality: 1,
          what: 'video element visual content has no accessible alternative'
        },
        'QW-ACT-R31': {
          variable: false,
          quality: 1,
          what: 'video element visual-only content has no accessible alternative'
        },
        'QW-ACT-R32': {
          variable: false,
          quality: 1,
          what: 'video element visual-only content has no strict accessible alternative'
        },
        'QW-ACT-R51': {
          variable: false,
          quality: 1,
          what: 'video element visual-only content is not a media alternative for text'
        },
        'QW-ACT-R56': {
          variable: false,
          quality: 1,
          what: 'video element content is not a media alternative for text'
        },
        'QW-ACT-R61': {
          variable: false,
          quality: 1,
          what: 'video element visual content has no transcript'
        }
      }
    }
  },
  videoContentNoTranscript: {
    wcag: '1.2.2',
    weight: 4,
    tools: {
      qualWeb: {
        'QW-ACT-R53': {
          variable: false,
          quality: 1,
          what: 'video element visual-only content has no transcript'
        }
      }
    }
  },
  videoCaptionRisk: {
    wcag: '1.2.2',
    weight: 1,
    tools: {
      wave: {
        'html5_video_audio': {
          variable: false,
          quality: 1,
          what: 'video or audio element may have no or incorrect captions, transcript, or audio description'
        },
        audio_video: {
          variable: false,
          quality: 1,
          what: 'audio or video file or link may have no or incorrect captions, transcript, or audio description'
        },
        youtube_video: {
          variable: false,
          quality: 1,
          what: 'YouTube video may have no or incorrect captions'
        }
      }
    }
  },
  videoNoAudioDescription: {
    wcag: '1.2.1',
    weight: 4,
    tools: {
      qualWeb: {
        'QW-ACT-R55': {
          variable: false,
          quality: 1,
          what: 'video element visual content has no audio description'
        }
      }
    }
  },
  videoNoAudioTrack: {
    wcag: '1.2.1',
    weight: 4,
    tools: {
      qualWeb: {
        'QW-ACT-R54': {
          variable: false,
          quality: 1,
          what: 'video element visual-only content has no audio track alternative'
        }
      }
    }
  },
  notKeyboardScrollable: {
    wcag: '2.1.1',
    weight: 4,
    tools: {
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
      },
      qualWeb: {
        'QW-ACT-R43': {
          variable: false,
          quality: 1,
          what: 'Scrollable element is not keyboard accessible'
        }
      }
    }
  },
  horizontalScrolling: {
    wcag: '1.4.10',
    weight: 3,
    tools: {
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
    wcag: '1.4.10',
    weight: 1,
    tools: {
      htmlcs: {
        'AAA.1_4_10.C32,C31,C33,C38,SCR34,G206': {
          variable: false,
          quality: 1,
          what: 'Fixed-position element may force bidirectional scrolling'
        }
      },
      qualWeb: {
        'QW-BP18': {
          variable: false,
          quality: 1,
          what: 'Percentage is not used in CSS for a container size'
        }
      }
    }
  },
  skipRepeatedContent: {
    wcag: '2.4.1',
    weight: 3,
    tools: {
      axe: {
        bypass: {
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
        },
        skip_main_exists: {
          variable: false,
          quality: 0.5,
          what: 'Page provides no way to quickly navigate to the main content'
        }
      },
      qualWeb: {
        'QW-ACT-R64': {
          variable: false,
          quality: 1,
          what: 'Document has no heading for non-repeated content'
        },
        'QW-ACT-R75': {
          variable: false,
          quality: 1,
          what: 'Blocks of repeated content cannot be bypassed'
        }
      },
      wave: {
        link_skip_broken: {
          variable: false,
          quality: 1,
          what: 'Skip-navigation link has no target or is not keyboard accessible'
        }
      }
    }
  },
  repeatedContentRisk: {
    wcag: '2.4.1',
    weight: 1,
    tools: {
      alfa: {
        'r87': {
          variable: false,
          quality: 0.5,
          what: 'First focusable element is not a link to the main content'
        }
      },
      qualWeb: {
        'QW-ACT-R72': {
          variable: false,
          quality: 1,
          what: 'First focusable element is not a link to the non-repeated content'
        },
        'QW-ACT-R73': {
          variable: false,
          quality: 1,
          what: 'Block of repeated content is not collapsible'
        },
        'QW-ACT-R74': {
          variable: false,
          quality: 1,
          what: 'Document has no instrument to move focus to non-repeated content'
        },
        'QW-WCAG-T23': {
          variable: false,
          quality: 1,
          what: 'No link at the top of the page that goes directly to the main content area'
        },
        'QW-BP17': {
          variable: false,
          quality: 1,
          what: 'No link at the beginning of a block of repeated content goes to the end of the block'
        }
      }
    }
  },
  submitButton: {
    wcag: '2.5.6',
    weight: 3,
    tools: {
      htmlcs: {
        'AAA.3_2_2.H32.2': {
          variable: false,
          quality: 1,
          what: 'Form has no submit button'
        }
      },
      qualWeb: {
        'QW-WCAG-T19': {
          variable: false,
          quality: 1,
          what: 'Submit button not provided'
        }
      }
    }
  },
  fragmentaryNoticeRisk: {
    wcag: '4.1.3',
    weight: 2,
    tools: {
      alfa: {
        r54: {
          variable: false,
          quality: 1,
          what: 'Assertive region is not atomic'
        }
      }
    }
  },
  errorReferenceBad: {
    wcag: '3.3.1',
    weight: 4,
    tools: {
      qualWeb: {
        'QW-ACT-R41': {
          variable: false,
          quality: 1,
          what: 'Error message describes no invalid form field value'
        }
      }
    }
  },
  noScriptRisk: {
    wcag: '4.1',
    weight: 1,
    tools: {
      wave: {
        noscript: {
          variable: false,
          quality: 1,
          what: 'noscript element may fail to contain an accessible equivalent or alternative'
        }
      }
    }
  },
  browserSupportRisk: {
    wcag: '4.1',
    weight: 1,
    tools: {
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
    wcag: '4.1',
    weight: 3,
    tools: {
      alfa: {
        r70: {
          variable: false,
          quality: 1,
          what: 'Element is obsolete or deprecated'
        }
      },
      htmlcs: {
        'AAA.1_3_1.H49.AlignAttr': {
          variable: false,
          quality: 1,
          what: 'align attribute is obsolete'
        },
        'AAA.1_3_1.H49.Center': {
          variable: false,
          quality: 1,
          what: 'center element is obsolete'
        },
        'AAA.1_3_1.H63.2': {
          variable: false,
          quality: 1,
          what: 'scope attribute on a td element, instead of a th element, is obsolete'
        },
        'AAA.1_3_1.H49.Font': {
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
          what: 'Attribute is obsolete on its element'
        },
        'The only allowed value for the charset attribute for the script element is utf-8. (But the attribute is not needed and should be omitted altogether.)': {
          variable: false,
          quality: 1,
          what: 'charset attribute has a value other than utf-8 and is unnecessary'
        },
        'Using the meta element to specify the document-wide default language is obsolete. Consider specifying the language on the root element instead.': {
          variable: false,
          quality: 1,
          what: 'Language declaration in a meta element is obsolete'
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
        },
        '^Potentially bad value .+ for attribute .+ on element .+: The language subtag .+ is deprecated.+$': {
          variable: true,
          quality: 1,
          what: 'Attribute value is a deprecated language subtag'
        }
      },
      qualWeb: {
        'QW-BP10': {
          variable: false,
          quality: 1,
          what: 'HTML element is used to control the visual presentation of content'
        }
      },
      wave: {
        longdesc: {
          variable: false,
          quality: 1,
          what: 'longdesc attribute is obsolete'
        },
        flash: {
          variable: false,
          quality: 1,
          what: 'Flash content is present'
        }
      }
    }
  },
  cssInvalid: {
    wcag: '4.1',
    weight: 3,
    tools: {
      nuVal: {
        'CSS: z-index: This number should be an integer.': {
          variable: false,
          quality: 1,
          what: 'z-index style property has a non-integer value'
        },
        '^CSS: .+: Character .+ is neither a decimal digit number.*$': {
          variable: true,
          quality: 1,
          what: 'Nonnumeric character in a numeric style property'
        },
        'CSS: Parse Error. Style sheets should not include HTML syntax.': {
          variable: false,
          quality: 1,
          what: 'CSS style sheet includes HTML syntax'
        },
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
        '^CSS: .+ is not a :lang.+ value.*$': {
          variable: true,
          quality: 1,
          what: 'CSS pseudo-class :lang() has an invalid value'
        },
        '^CSS: .+: Missing a semicolon before the .+$': {
          variable: true,
          quality: 1,
          what: 'semicolon missing in CSS'
        },
        'CSS: The @charset rule may only occur at the start of the style sheet. Please check that there are no spaces before it.': {
          variable: false,
          quality: 1,
          what: 'CSS @charset at-rule is not at the start of its style sheet'
        },
        '^CSS: perspective: .+ is not valid, only values greater than 0 allowed.*$': {
          variable: true,
          quality: 0.5,
          what: 'CSS perspective property has a nonpositive value'
        },
        '^CSS: .+: Lexical error at line .+, column .+ Encountered: .+$': {
          variable: true,
          quality: 1,
          what: 'CSS property has a value with a lexical error'
        },
        '^CSS: transition: .+ is not valid, only values lower than or equal to 1.0 are allowed.*$': {
          variable: true,
          quality: 0.5,
          what: 'CSS transition property has a value greater than 1'
        },
        '^CSS: In CSS1, a class name could start with a digit .+, unless it was a dimension .+ In CSS2, such classes are parsed as unknown dimensions .+ To make .+ a valid class, CSS2 requires the first digit to be escaped: .+$': {
          variable: true,
          quality: 0.5,
          what: 'CSS class name starts with an unescaped digit'
        }
      }
    }
  },
  elementClosure: {
    wcag: '4.1.1',
    weight: 3,
    tools: {
      nuVal: {
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
        '^End tag for .+ seen, but there were unclosed elements.*$': {
          variable: true,
          quality: 1,
          what: 'Element is closed while an element within it is unclosed'
        },
        '^End tag .+ seen, but there were open elements.*$': {
          variable: true,
          quality: 1,
          what: 'Element is closed while an element within it is unclosed'
        },
        '^End tag .+ implied, but there were open elements.*$': {
          variable: true,
          quality: 1,
          what: 'Element is implicitly closed while an element within it is unclosed'
        },
        '^Unclosed element .+$': {
          variable: true,
          quality: 1,
          what: 'Element is unclosed'
        },
        '^No .+ element in scope but a .+ end tag seen.*$': {
          variable: true,
          quality: 1,
          what: 'End tag for an element that is not in scope'
        }
      }
    }
  },
  nestingBad: {
    wcag: '4.1.1',
    weight: 3,
    tools: {
      nuVal: {
        '^End tag .+ violates nesting rules.*$': {
          variable: true,
          quality: 1,
          what: 'End tag violates nesting rules'
        }
      }
    }
  },
  parseError: {
    wcag: '4.1',
    weight: 3,
    tools: {
      ibm: {
        aria_child_valid: {
          variable: false,
          quality: 1,
          what: 'Child element has a role not allowed for the role of the parent'
        },
        Rpt_Aria_InvalidTabindexForActivedescendant: {
          variable: false,
          quality: 1,
          what: 'Element with an aria-activedescendant attribute has no nonpositive tabindex attribute'
        }
      },
      nuVal: {
        'End tag clippath did not match the name of the current open element (path).': {
          variable: false,
          quality: 1,
          what: 'End tag clippath conflicts with the current open element.'
        },
        '^Self-closing syntax .+ used on a non-void HTML element.*$': {
          variable: true,
          quality: 1,
          what: 'Self-closing syntax used on a non-void element'
        },
        'No space between attributes.': {
          variable: true,
          quality: 1,
          what: 'No space between attributes'
        },
        '^Bad value [^\ufffd]+ Tab, new line or carriage return found.*$': {
          variable: true,
          quality: 1,
          what: 'Attribute value contains an illegal spacing character'
        },
        'Saw <?. Probable cause: Attempt to use an XML processing instruction in HTML. (XML processing instructions are not supported in HTML.)': {
          variable: false,
          quality: 1,
          what: 'Left angle bracket is followed by a question mark'
        },
        'Almost standards mode doctype. Expected <!DOCTYPE html>.': {
          variable: false,
          quality: 1,
          what: 'document type declaration differs from <!DOCTYPE html>'
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
        '^Bad start tag in .+$': {
          variable: true,
          quality: 1,
          what: 'Invalid start tag'
        },
        '^Element .+ is missing a required instance of child element .+$': {
          variable: true,
          quality: 1,
          what: 'Element is missing a required child'
        },
        'Saw <!-- within a comment. Probable cause: Nested comment (not allowed).': {
          variable: false,
          quality: 1,
          what: 'Comment is nested within a comment'
        },
        '^Saw .+ when expecting an attribute name. Probable cause: (?:.+ missing|Missing .+) immediately before.*$': {
          variable: true,
          quality: 1,
          what: 'Invalid character appears where an attribute name must appear'
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
          what: 'Element with a srcset attribute with a width has no sizes attribute'
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
        'The text content of element time was not in the required format: The literal did not satisfy the time-datetime format.': {
          variable: false,
          quality: 1,
          what: 'time element has text content that is not in the time-datetime format'
        },
        'A script element with a defer attribute must not have a type attribute with the value module.': {
          variable: false,
          quality: 1,
          what: 'script element with a defer attribute has type="module"'
        },
        'Non-space character inside noscript inside head.': {
          variable: false,
          quality: 1,
          what: 'noscript element inside the head element has a nonspace text-node child'
        },
        '^java.util.concurrent.TimeoutException: Idle timeout expired: .+ ms.*$': {
          variable: true,
          quality: 1,
          what: 'Idle timeout expired'
        }
      },
      qualWeb: {
        'QW-WCAG-T16': {
          variable: false,
          quality: 1,
          what: 'HTML is not used according to spec'
        }
      },
      wave: {
        longdesc_invalid: {
          variable: false,
          quality: 1,
          what: 'longdesc attribute has a value that is not a URL (and is obsolete)'
        }
      },
    }
  },
  slashParseRisk: {
    wcag: '4.1',
    weight: 1,
    tools: {
      nuVal: {
        'Trailing slash on void elements has no effect and interacts badly with unquoted attribute values.': {
          variable: false,
          quality: 1,
          what: 'Void element has a useless trailing slash.'
        }
      }
    }
  },
  encodingBad: {
    wcag: '3.1.3',
    weight: 4,
    tools: {
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
    wcag: '4.1',
    weight: 50,
    tools: {
      nuVal: {
        'Cannot recover after last error. Any further errors will be ignored.': {
          variable: false,
          quality: 1,
          what: 'Testing was interrupted by a fatal error'
        },
        'Too many messages.': {
          variable: false,
          quality: 1,
          what: 'Testing was interrupted by a fatal excess of the message count'
        }
      }
    }
  },
  notValidatable: {
    wcag: '4.1',
    weight: 1,
    tools: {
      nuVal: {
        'Unsupported SVG version specified. This validator only supports SVG 1.1. The recommended way to suppress this warning is to remove the version attribute altogether.': {
          variable: false,
          quality: 1,
          what: 'SVG version specified is not 1.1 and so nuVal cannot validate it'
        }
      }
    }
  }
};
