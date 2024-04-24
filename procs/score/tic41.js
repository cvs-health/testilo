/*
  tic41
  Testilo issue classification 41

  Classifies about 990 rules of the tools of Testaro into about 310 issues.

  Issue properties:
    summary: minimal description
    why: expected impact on a user
    wcag: most relevant WCAG Principle, Guideline, Success Criterion, or Technique
    weight: weight of the issue in score computation
    max?: maximum possible count of instances if finite
    tools: tools (including Testaro) defining rules for the issue

  Each property of tools is data about one of the tools that test for the issue. The key is the name
  of the tool. The value is an object containing data about the rules of the tool that pertain to
  the issue. Each property of that object is data about one of those rules. The key is the
  identifier of the rule, and the value is an object with these properties:
    variable: whether the key is a regular expression
    quality: the estimated quality of the test for the rule (normally 1)
    what: description of a rule violation
*/

exports.issues = {
  ignorable: {
    summary: 'ignorable',
    why: 'No known impact, because the test is unreliable or invalid',
    wcag: '',
    weight: 0,
    tools: {
      aslint: {
        color_contrast_aa: {
          variable: false,
          quality: 0,
          what: 'Text has contrast less than 4.5:1 [speculative]'
        },
        css_images_convey_information: {
          variable: false,
          quality: 1,
          what: 'Background image may be informative [speculative]'
        },
        flickering: {
          variable: false,
          quality: 0,
          what: 'Excessive flashing may exist [speculative]'
        },
        links_language_destination: {
          variable: false,
          quality: 1,
          what: 'Link destination has a named host and may be in an unexpected language [speculative]'
        },
        meaningful_content_sequence: {
          variable: false,
          quality: 0,
          what: 'The content sequence may fail to be meaningful [speculative]'
        },
        motion_actuation: {
          variable: false,
          quality: 0,
          what: 'Document listens for device motion or rotation [speculative]'
        },
        overlay: {
          variable: false,
          quality: 0,
          what: 'Document contains a commercial overlay modifier that may fail or invalidate test results [unreliable]'
        },
        object_missing_body: {
          variable: false,
          quality: 0,
          what: 'object element has no body to act as a text alternative [invalid]'
        },
        reflow: {
          variable: false,
          quality: 0,
          what: 'Page may require horizontal scrolling [speculative]'
        },
        text_color_convey_information: {
          variable: false,
          quality: 1,
          what: 'Color may give information not given also by text [speculative]'
        }
      },
      axe: {
        'css-orientation-lock': {
          variable: false,
          quality: 0,
          what: 'CSS media query locks display orientation [unreliable]'
        },
        'frame-tested': {
          variable: false,
          quality: 0,
          what: 'Some content is in an iframe and so may not be testable for accessibility [speculative]'
        },
        'hidden-content': {
          variable: false,
          quality: 0,
          what: 'Some content is hidden and so may not be testable for accessibility [speculative]'
        }
      },
      ed11y: {
        altNull: {
          variable: false,
          quality: 0,
          what: 'img element not inside a link has an empty alt attribute [speculative]'
        },
        altPartOfLinkWithText: {
          variable: false,
          quality: 0,
          what: 'Name of the link enclosing the img element includes its alt attribute, so may be unclear [speculative]'
        },
        embedAudio: {
          variable: false,
          quality: 0,
          what: 'Element is audio, so may lack an accurate transcript [speculative]'
        },
        embedCustom: {
          variable: false,
          quality: 0,
          what: 'Embedded custom element may fail to be accessible [speculative]'
        },
        embedTwitter: {
          variable: false,
          quality: 0,
          what: 'Element is a Twitter feed, so may add many items on scroll and thus be impractical to exit by keyboard [speculative]'
        },
        embedVideo: {
          variable: false,
          quality: 0,
          what: 'Element is video, so may lack captions [speculative]'
        },
        embedVisualization: {
          variable: false,
          quality: 0,
          what: 'Element is a visualization, so may lack a nonvisual equivalent [speculative]'
        }
      },
      nuVal: {
        'Element head is missing a required instance of child element title.': {
          variable: false,
          quality: 1,
          what: 'head element has no child title element [invalid]'
        },
        'Element mediaelementwrapper not allowed as child of element div in this context. (Suppressing further errors from this subtree.)': {
          variable: false,
          quality: 0,
          what: 'Element contains a prohibited mediaelementwrapper element [invalid]'
        }
      },
      qualWeb: {
        'QW-ACT-R52': {
          variable: false,
          quality: 0,
          what: 'video element visual-only content has no description track [description tracks and this ACT rule have been deprecated]'
        },
        'QW-ACT-R57': {
          variable: false,
          quality: 0,
          what: 'video element visual content has no description track [description tracks and this ACT rule have been deprecated]'
        },
        'QW-ACT-R62': {
          variable: false,
          quality: 0,
          what: 'Element in the sequential focus order may have no visible focus [speculative]'
        },
        'QW-ACT-R63': {
          variable: false,
          quality: 0,
          what: 'Document has no landmark with non-repeated content [invalid]'
        },
        'QW-ACT-R64': {
          variable: false,
          quality: 0,
          what: 'Document has no heading for non-repeated content [invalid]'
        },
        'QW-ACT-R73': {
          variable: false,
          quality: 0,
          what: 'Block of repeated content is not collapsible [invalid]'
        },
        'QW-ACT-R74': {
          variable: false,
          quality: 0,
          what: 'Document has no instrument to move focus to non-repeated content [invalid]'
        },
        'QW-ACT-R75': {
          variable: false,
          quality: 0,
          what: 'Blocks of repeated content cannot be bypassed [invalid]'
        },
        'QW-BP1': {
          variable: false,
          quality: 0,
          what: 'h1-h6 not used to identify headings [invalid]'
        },
        'QW-BP17': {
          variable: false,
          quality: 1,
          what: 'No link at the beginning of a block of repeated content goes to the end of the block [invalid]'
        },
        'QW-BP20': {
          variable: false,
          quality: 1,
          what: 'Document has more than 1 banner landmark [invalid; counts hidden elements]'
        },
        'QW-BP22': {
          variable: false,
          quality: 1,
          what: 'Document has more than 1 element with a main role [invalid]'
        },
        'QW-BP23': {
          variable: false,
          quality: 0.1,
          what: 'Element is not in a true list [invalid]'
        },
        'QW-BP24': {
          variable: false,
          quality: 1,
          what: 'ul or ol element has a child other than li, script, or template [invalid]'
        },
        'QW-BP28': {
          variable: false,
          quality: 1,
          what: 'h1 element missing or used more than once [invalid]'
        },
        'QW-BP29': {
          variable: false,
          quality: 0,
          what: 'lang and xml:lang attribute of html element differ [invalid]'
        },
        'QW-WCAG-T4': {
          variable: false,
          quality: 0,
          what: 'summary attribute is not used to give an overview of a data table [invalid]'
        },
        'QW-WCAG-T9': {
          variable: false,
          quality: 0,
          what: 'Page may fail to be organized using headings [speculative]'
        },
        'QW-WCAG-T15': {
          variable: false,
          quality: 0,
          what: 'link element may be used for navigation but not in the head [invalid]'
        },
        'QW-WCAG-T20': {
          variable: false,
          quality: 0,
          what: 'Link title may fail to describe the link correctly [speculative]'
        },
        'QW-WCAG-T23': {
          variable: false,
          quality: 0,
          what: 'No link at the top of the page goes directly to the main content area [invalid]'
        }
      }
    }
  },
  duplicateAttribute: {
    summary: 'duplicate attribute',
    why: 'Browser processes the document improperly',
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
    summary: 'ID not unique',
    why: 'User may be pointed to the wrong item',
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
      aslint: {
        duplicated_id_attribute: {
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
      htmlcs: {
        'AAA.4_1_1.F77': {
          variable: false,
          quality: 1,
          what: 'Duplicate id attribute value'
        }
      },
      ibm: {
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
        },
        'QW-WCAG-T35': {
          variable: false,
          quality: 1,
          what: 'Several elements have this id attribute value'
        }
      }
    }
  },
  roleNoText: {
    summary: 'no role-required name',
    why: 'User cannot get help understanding an item',
    wcag: '4.1.2',
    weight: 4,
    tools: {
      ibm: {
        aria_accessiblename_exists: {
          variable: false,
          quality: 1,
          what: 'Element has no accessible name, although its role requires one'
        }
      }
    }
  },
  componentNoText: {
    summary: 'interactive component not named',
    why: 'User cannot get help understanding a custom item',
    wcag: '4.1.2',
    weight: 4,
    tools: {
      ibm: {
        aria_widget_labelled: {
          variable: false,
          quality: 1,
          what: 'Interactive component has no programmatically associated name'
        }
      }
    }
  },
  regionNoText: {
    summary: 'region not named',
    why: 'User cannot get help surveying the parts of the document',
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
      ibm: {
        aria_region_labelled: {
          variable: false,
          quality: 1,
          what: 'Element with a region role has no label'
        }
      }
    }
  },
  headingImageNoText: {
    summary: 'heading image not named',
    why: 'User cannot get help understanding an image used as a heading',
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
  inputNoText: {
    summary: 'input not named',
    why: 'User cannot get help on what information to enter in a form item',
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
    summary: 'input has placeholder instead of name',
    why: 'User cannot get reliable help on what information to enter in a form item',
    wcag: '4.1.2',
    weight: 3,
    tools: {
      testaro: {
        phOnly: {
          variable: false,
          quality: 1,
          what: 'input element has a placeholder but no accessible name'
        }
      }
    }
  },
  imageButtonNoText: {
    summary: 'image button not named',
    why: 'User cannot get help understanding an image used as a button',
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
    summary: 'image input not named',
    why: 'User cannot get help understanding an image used as a submission button',
    wcag: '1.1.1',
    weight: 4,
    tools: {
      alfa: {
        r28: {
          variable: false,
          quality: 1,
          what: 'Element is an image input but has no accessible name'
        }
      },
      aslint: {
        input_image_missing_alt: {
          variable: false,
          quality: 1,
          what: 'Element is an image input but its text alternative is missing or empty'
        }
      },
      htmlcs: {
        'AAA.4_1_2.H91.InputImage.Name': {
          variable: false,
          quality: 1,
          what: 'Element is an image input but has no accessible name'
        }
      },
      ibm: {
        imagebutton_alt_exists: {
          variable: false,
          quality: 1,
          what: 'Element is an input of type image but has no text alternative'
        }
      }
    }
  },
  figureNoText: {
    summary: 'figure not named',
    why: 'User cannot get help on the topic of a figure',
    wcag: '1.1.1',
    weight: 4,
    tools: {
      ibm: {
        figure_label_exists: {
          variable: false,
          quality: 1,
          what: 'figure element has no associated label'
        }
      }
    }
  },
  imageNoText: {
    summary: 'image not named',
    why: 'User cannot get help to know what is in an image',
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
      aslint: {
        missing_alt_attribute: {
          variable: false,
          quality: 1,
          what: 'Image has no alt attribute'
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
      ed11y: {
        altMissing: {
          variable: false,
          quality: 1,
          what: 'img element has no alt attribute'
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
        aria_img_labelled: {
          variable: false,
          quality: 1,
          what: 'Element with an img role has no label or an empty label'
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
  imageTextSpaces: {
    summary: 'image name contains only spacing characters',
    why: 'User cannot get help understanding an image',
    wcag: '1.1.1',
    weight: 4,
    tools: {
      ed11y: {
        altDeadspace: {
          variable: false,
          quality: 1,
          what: 'alt attribute of the element contains only spacing characters'
        }
      }
    }
  },
  imageTextImage: {
    summary: 'image name contains image',
    why: 'User is redundantly told an image is an image',
    wcag: '1.1.1',
    weight: 1,
    tools: {
      ed11y: {
        altImageOf: {
          variable: false,
          quality: 1,
          what: 'alt attribute of the element states the image is an image'
        }
      }
    }
  },
  imageTextBad: {
    summary: 'image named with filename',
    why: 'Helper gives a user the filename of an image instead of describing it',
    wcag: '1.1.1',
    weight: 3,
    tools: {
      alfa: {
        r39: {
          variable: false,
          quality: 1,
          what: 'Image text alternative is the filename instead'
        }
      },
      aslint: {
        alt_text_include_filename: {
          variable: false,
          quality: 1,
          what: 'Image text alternative includes a filename'
        }
      },
      ed11y: {
        altURL: {
          variable: false,
          quality: 1,
          what: 'Image text alternative is a URL instead'
        }
      },
    }
  },
  imageTextRisk: {
    summary: 'image dubiously named',
    why: 'Helper may describe an image inadequately',
    wcag: '1.1.1',
    weight: 1,
    tools: {
      aslint: {
        general_alt: {
          variable: false,
          quality: 1,
          what: 'Image may be better described by a revised text alternative and an aria-label attribute'
        },
        alt_color_convey_information: {
          variable: false,
          quality: 1,
          what: 'Text alternative may fail to give information provided by colors'
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
  imageNoSource: {
    summary: 'image has no src',
    why: 'Image to be shown cannot be found',
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
    summary: 'src empty',
    why: 'Image, audio, or video to be shown cannot be found',
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
    summary: 'CSS background invalid',
    why: 'Background is displayed improperly',
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
    summary: 'background image invalid',
    why: 'Background image is displayed improperly',
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
  imagesSameAlt: {
    summary: 'nearby images have same alt',
    why: 'User cannot get help differentiating two adjacent images',
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
    summary: 'image alt long',
    why: 'Helper gives a user an overly verbose explanation of an image',
    wcag: '1.1.1',
    weight: 2,
    tools: {
      ed11y: {
        altLong: {
          variable: false,
          quality: 1,
          what: 'img alt value longer than 160 characters'
        },
        altLongLinked: {
          variable: false,
          quality: 1,
          what: 'Linked img alt value longer than 160 characters'
        }
      },
      qualWeb: {
        'QW-BP2': {
          variable: false,
          quality: 1,
          what: 'Image text alternative is not concise'
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
    summary: 'title long',
    why: 'Hovering makes an overly verbose explanation pop up',
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
    summary: 'title contains ASCII art',
    why: 'Hovering makes a hard-to-understand explanation pop up',
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
  decorativeImageRisk: {
    summary: 'image dubiously marked decorative',
    why: 'Helper ignores an image that is apparently informative',
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
    summary: 'decorative element exposed',
    why: 'Helper alerts a user to an uninformative image',
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
    summary: 'page language missing',
    why: 'Speaking helper may mispronounce the document text',
    wcag: '3.1.1',
    weight: 4,
    max: 1,
    tools: {
      alfa: {
        r4: {
          variable: false,
          quality: 1,
          what: 'lang attribute missing, empty, or only whitespace'
        }
      },
      aslint: {
        html_lang_attrN: {
          variable: false,
          quality: 1,
          what: 'lang attribute missing from the html element'
        },
        html_lang_attrE: {
          variable: false,
          quality: 1,
          what: 'lang attribute of the html element is empty'
        }
      },
      axe: {
        'html-has-lang': {
          variable: false,
          quality: 1,
          what: 'html element has no lang attribute'
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
    summary: 'page language invalid',
    why: 'Speaking helper may mispronounce the document text',
    wcag: '3.1.1',
    weight: 4,
    max: 1,
    tools: {
      alfa: {
        r5: {
          variable: false,
          quality: 1,
          what: 'lang attribute has no valid primary language tag'
        }
      },
      aslint: {
        html_lang_attrP: {
          variable: false,
          quality: 1,
          what: 'value of the lang attribute of the html element has too many segments'
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
        'AAA.3_1_1.H57.3.Lang': {
          variable: false,
          quality: 1,
          what: 'Language specified in the lang attribute of the document does not appear to be well-formed'
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
    summary: 'element language invalid',
    why: 'Speaking helper may mispronounce the text of an item',
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
    summary: 'language change invalid',
    why: 'Speaking helper may mispronounce the text of an item',
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
    summary: 'dialog not named',
    why: 'User cannot get help explaining a pop-up window',
    wcag: '4.1.2',
    weight: 4,
    tools: {
      aslint: {
        aria_role_dialog: {
          variable: false,
          quality: 1,
          what: 'Element has a dialog role but has no accessible name'
        }
      },
      axe: {
        'aria-dialog-name': {
          variable: false,
          quality: 1,
          what: 'ARIA dialog or alertdialog node has no accessible name'
        }
      }
    }
  },
  objectNoText: {
    summary: 'object not named',
    why: 'User cannot get help explaining a custom item',
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
      htmlcs: {
        'ARIA6+H53': {
          variable: false,
          quality: 1,
          what: 'object element contains no text alternative'
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
  objectTextRisk: {
    summary: 'object dubiously named',
    why: 'Helper may explain a custom item inadequately',
    wcag: '1.1.1',
    weight: 1,
    tools: {
      aslint: {
        object_general_alt: {
          variable: false,
          quality: 1,
          what: 'Text of the object may better explain it if revised'
        }
      }
    }
  },
  objectAudioRisk: {
    summary: 'non-audio element possibly plays audio',
    why: 'User may get inadequate help consuming audio content',
    wcag: '1.1.1',
    weight: 1,
    tools: {
      aslint: {
        audio_alternative: {
          variable: false,
          quality: 1,
          what: 'Element is inferior to an audio element if it plays audio'
        }
      }
    }
  },
  appletNoText: {
    summary: 'applet not named',
    why: 'User cannot get help on how to use a custom item',
    wcag: '1.1.1',
    weight: 4,
    tools: {
      aslint: {
        applet_missing_alt: {
          variable: false,
          quality: 1,
          what: 'Text alternative of the applet is missing or empty'
        },
        applet_missing_body: {
          variable: false,
          quality: 1,
          what: 'Content of the applet is missing or empty'
        }
      },
      qualWeb: {
        'QW-WCAG-T11': {
          variable: false,
          quality: 1,
          what: 'Text alternative not provided on an applet element'
        }
      }
    }
  },
  imageMapNoText: {
    summary: 'image map not named',
    why: 'User cannot get help on the topic of an interactive image',
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
    summary: 'image map area not named',
    why: 'User cannot get help on how to use an interactive image',
    wcag: '1.1.1',
    weight: 4,
    tools: {
      aslint: {
        a_area_missing_alt: {
          variable: false,
          quality: 1,
          what: 'Text alternative of the element is missing or empty'
        }
      },
      axe: {
        'area-alt': {
          variable: false,
          quality: 1,
          what: 'Element is an active area element but has no text alternative'
        }
      },
      htmlcs: {
        'AAA.1_1_1.H24': {
          variable: false,
          quality: 1,
          what: 'Element is an area in an image map but has no alt attribute'
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
  customKeyboardRisk: {
    summary: 'custom button possibly keyboard-inoperable',
    why: 'Custom item may prevent a keyboard-only user from operating it',
    wcag: '2.1.1',
    weight: 1,
    tools: {
      aslint: {
        link_button_space_key: {
          variable: false,
          quality: 1,
          what: 'Element has a button role but may fail to be keyboard-operable'
        }
      }
    }
  },
  objectBlurKeyboardRisk: {
    summary: 'object possibly not keyboard-blurrable',
    why: 'Custom item may trap a keyboard-only user',
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
  eventKeyboardRisk: {
    summary: 'event possibly not keyboard-triggerable',
    why: 'Keyboard-only user may be unable to perform an action',
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
    summary: 'internal link broken',
    why: 'User cannot reach a promised document location',
    wcag: '1.3.1',
    weight: 4,
    tools: {
      aslint: {
        broken_same_page_link: {
          variable: false,
          quality: 1,
          what: 'Same-page destination of the link does not exist'
        }
      },
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
    summary: 'label referent ineligible',
    why: 'User cannot get help understanding an item in a form',
    wcag: '1.3.1',
    weight: 4,
    tools: {
      aslint: {
        label_inappropriate_associationN: {
          variable: false,
          quality: 1,
          what: 'Element referenced by the for attribute is not a form control'
        }
      },
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
  controlIDInLabelBad: {
    summary: 'label contains control with nonmatching ID',
    why: 'User cannot get help understanding an item in a form',
    wcag: '1.3.1',
    weight: 4,
    tools: {
      nuVal: {
        '^Any .+ descendant of a label element with a for attribute must have an ID value that matches that for attribute.*$': {
          variable: true,
          quality: 1,
          what: 'label element has a labelable descendant whose ID differs from the for attribute of the label'
        }
      }
    }
  },
  ariaLabelWrongRisk: {
    summary: 'dubious aria-label',
    why: 'User may fail to get help understanding an item in a form',
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
    summary: 'aria-activedescendant invalid',
    why: 'Keyboard-only user cannot reach an item in a menu',
    wcag: '1.3.1',
    weight: 4,
    tools: {
      ibm: {
        aria_activedescendant_valid: {
          variable: false,
          quality: 1,
          what: 'aria-activedescendant property does not reference the id of a non-empty, non-hidden active child element'
        }
      },
      nuVal: {
        'Attribute aria-activedescendant value should either refer to a descendant element, or should be accompanied by attribute aria-owns.': {
          variable: false,
          quality: 1,
          what: 'Element has no aria-owns attribute but its aria-activedescendant attribute references a non-descendant'
        }
      }
    }
  },
  governedBadID: {
    summary: 'aria-controls or -owns invalid',
    why: 'Keyboard-only user cannot reach an item',
    wcag: '1.3.1',
    weight: 4,
    tools: {
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
    summary: 'aria-describedby invalid',
    why: 'User cannot get help understanding an item in detail',
    wcag: '1.3.1',
    weight: 4,
    tools: {
      aslint: {
        aria_describedby_association: {
          variable: false,
          quality: 1,
          what: 'aria-describedby attribute references a missing or empty element'
        }
      },
      nuVal: {
        'The aria-describedby attribute must point to an element in the same document.': {
          variable: false,
          quality: 1,
          what: 'aria-describedby attribute references an element not in the document'
        }
      },
      testaro: {
        adbID: {
          variable: false,
          quality: 1,
          what: 'aria-describedby attribute references an invalid or duplicate ID'
        }
      }
    }
  },
  labelConfusionRisk: {
    summary: 'label location dubious',
    why: 'User may fail to notice the explanation of an item in a form',
    wcag: '3.3.2',
    weight: 1,
    tools: {
      aslint: {
        incorrect_label_placement: {
          variable: false,
          quality: 1,
          what: 'label element precedes the labeled radio button or checkbox'
        }
      },
      ibm: {
        input_label_before: {
          variable: false,
          quality: 1,
          what: 'Label text is after its text input or select element'
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
    summary: 'label reference invalid',
    why: 'User cannot get help understanding an item in a form',
    wcag: '1.3.1',
    weight: 4,
    tools: {
      aslint: {
        label_inappropriate_associationM: {
          variable: false,
          quality: 1,
          what: 'Element referenced by the for attribute is missing'
        },
        aria_labelledby_associationN: {
          variable: false,
          quality: 1,
          what: 'Element referenced by the aria-labelledby attribute is missing'
        },
        aria_labelledby_associationE: {
          variable: false,
          quality: 1,
          what: 'aria-labelledby attribute refers to no element'
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
    summary: 'aria-haspopup invalid',
    why: 'Keyboard-only user cannot operate a custom tool',
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
  applicationRisk: {
    summary: 'dubious application role',
    why: 'User actions may have unexpected effects',
    wcag: '1.3.1',
    weight: 1,
    tools: {
      aslint: {
        role_application: {
          variable: false,
          quality: 1,
          what: 'Element has an application role'
        }
      }
    }
  },
  directionRisk: {
    summary: 'dubious direction',
    why: 'Item may behave incorrectly',
    wcag: '1.3.2',
    weight: 1,
    tools: {
      aslint: {
        rtl_content: {
          variable: false,
          quality: 1,
          what: 'Direction specified as right to left'
        }
      }
    }
  },
  clickOnly: {
    summary: 'name dubiously mouse-specific',
    why: 'User may misunderstand how to activate a link',
    wcag: '2.4.4',
    weight: 1,
    tools: {
      aslint: {
        click_verb: {
          variable: false,
          quality: 1,
          what: 'Mouse-specific word click is in the element text'
        }
      }
    }
  },
  linkNoText: {
    summary: 'link not named',
    why: 'User cannot get help understanding what a link points to',
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
      aslint: {
        img_empty_alt_in_link: {
          variable: false,
          quality: 1,
          what: 'Element is an image in a link but has no text alternative'
        },
        empty_link_element: {
          variable: false,
          quality: 1,
          what: 'Element has no visible and accessible name'
        }
      },
      axe: {
        'link-name': {
          variable: false,
          quality: 1,
          what: 'Link has no discernible text'
        }
      },
      ed11y: {
        altEmptyLinked: {
          variable: false,
          quality: 1,
          what: 'Link name is only an image with no text alternative'
        },
        linkNoText: {
          variable: false,
          quality: 1,
          what: 'Link has no text'
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
          what: 'Link has an href attribute but not named'
        }
      },
      ibm: {
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
      wave: {
        link_empty: {
          variable: false,
          quality: 1,
          what: 'Link contains not named'
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
    summary: 'link incomplete',
    why: 'User may fail to reach a promised location',
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
    summary: 'link element href missing',
    why: 'User cannot reach a promised location',
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
  linkElNoSource: {
    summary: 'link element href or imagesrcset missing',
    why: 'User cannot reach a promised location',
    wcag: '4.1',
    weight: 3,
    tools: {
      nuVal: {
        'A link element must have an href or imagesrcset attribute, or both.': {
          variable: false,
          quality: 1,
          what: 'link element has neither an href nor an imagesrcset attribute'
        }
      }
    }
  },
  destinationNotURL: {
    summary: 'link destination not URL',
    why: 'Helper cannot properly explain a link to a user',
    wcag: '1.3.1',
    weight: 1,
    tools: {
      aslint: {
        unclear_anchor_uri: {
          variable: false,
          quality: 1,
          what: 'Link destination is #, a script, or empty'
        },
        unclear_uri_on_a: {
          variable: false,
          quality: 1,
          what: 'Link destination is #, a script, or empty'
        }
      }
    }
  },
  destinationLink: {
    summary: 'link href missing',
    why: 'Helper cannot properly explain a link to a user',
    wcag: '1.3.1',
    weight: 2,
    tools: {
      aslint: {
        missing_href_on_a: {
          variable: false,
          quality: 1,
          what: 'Link has no href attribute'
        }
      },
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
  emailLinkBad: {
    summary: 'Microsoft will bounce email from link',
    why: 'User cannot send email',
    wcag: '2.4.4',
    weight: 4,
    tools: {
      ed11y: {
        safeLinks: {
          variable: false,
          quality: 1,
          what: 'Email link addresses messages that Microsoft will bounce'
        }
      }
    }
  },
  abbreviationNoTitle: {
    summary: 'abbr title missing',
    why: 'User cannot get help understanding an abbreviation',
    wcag: '3.1.4',
    weight: 4,
    tools: {
      aslint: {
        title_for_abbr: {
          variable: false,
          quality: 1,
          what: 'Element is an abbr but its defining title attribute is missing or empty'
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
  editableHow: {
    summary: 'contenteditable element incomplete',
    why: 'User cannot get help on how to edit editable content',
    wcag: '1.3.1',
    weight: 3,
    tools: {
      aslint: {
        content_editable_missing_attributes: {
          variable: false,
          quality: 1,
          what: 'Element has a true contenteditable attribute but no aria-multiline or labeling attribute'
        }
      }
    }
  },
  textAreaNoText: {
    summary: 'text area not named',
    why: 'User cannot get help on what information to enter in a form item',
    wcag: '1.3.1',
    weight: 4,
    tools: {
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
    summary: 'link image alt duplicative',
    why: 'Helper repeats the explanation of a link',
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
    summary: 'links named identically',
    why: 'User cannot get help differentiating links',
    wcag: '2.4.4',
    weight: 2,
    tools: {
      aslint: {
        links_same_content_different_url: {
          variable: false,
          quality: 1,
          what: 'Links with the same text content have different destination URLs'
        }
      },
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
      testaro: {
        linkAmb: {
          variable: false,
          quality: 1,
          what: 'Links with the same text content have different destinations'
        }
      }
    }
  },
  linkConfusionRisk: {
    summary: 'links dubiously share name',
    why: 'User may be unable to get help differentiating links',
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
  linksNoNav: {
    summary: 'links not grouped as nav',
    why: 'User cannot get help identifying links as a navigation tool',
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
  linkPair: {
    summary: 'text and image link not combined',
    why: 'Keyboard-only user expends extra effort to skip a link',
    wcag: '2.4.4',
    weight: 2,
    tools: {
      aslint: {
        img_adjacent_duplicate_text_link: {
          variable: false,
          quality: 1,
          what: 'Link and an adjacent link are logically 1 link but are not combined'
        }
      },
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
      wave: {
        link_redundant: {
          variable: false,
          quality: 1,
          what: 'Adjacent links go to the same URL'
        }
      }
    }
  },
  linkPairRisk: {
    summary: 'text and image link may merit combination',
    why: 'Keyboard-only user may expend extra effort to skip a link',
    wcag: '2.4.4',
    weight: 1,
    tools: {
      htmlcs: {
        'AAA.1_1_1.H2.EG4': {
          variable: false,
          quality: 1,
          what: 'Adjacent links, one with text and the other with a textless image, may merit combination'
        }
      }
    }
  },
  pageNewWindow: {
    summary: 'page immediately opens window',
    why: 'User promised a document gets another document, too',
    wcag: '3.2.5',
    weight: 3,
    max: 1,
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
  newTabSurprise: {
    summary: 'tab-opening link action unstated',
    why: 'Following a link opens a new window, surprising a user',
    wcag: '3.2.5',
    weight: 3,
    tools: {
      ed11y: {
        linkNewWindow: {
          variable: false,
          quality: 0.5,
          what: 'Link opens a new window or tab without prior notice'
        }
      }
    }
  },
  newTabSurpriseRisk: {
    summary: 'tab-opening link action possibly unstated',
    why: 'Following a link opens a new window, possibly surprising a user',
    wcag: '3.2.5',
    weight: 1,
    tools: {
      aslint: {
        links_new_window_mark: {
          variable: false,
          quality: 1,
          what: 'Indicator that the link opens a new window or tab may be missing'
        }
      },
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
    summary: 'navigating selection-change action possibly unstated',
    why: 'Changing a selected option opens a new window, possibly surprising a user',
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
  preselectedOption: {
    summary: 'no default option',
    why: 'User may risk erroneously submitting a form',
    wcag: '4.1.2',
    weight: 1,
    tools: {
      aslint: {
        select_initial_option: {
          variable: false,
          quality: 1,
          what: 'No option has been made the default with a selected attribute'
        }
      }
    }
  },
  buttonAlt: {
    summary: 'button has alt',
    why: 'User cannot get help explaing a button',
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
    summary: 'button not named',
    why: 'User cannot get help explaing a button',
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
      aslint: {
        empty_button_description: {
          variable: false,
          quality: 1,
          what: 'Button has no visible accessible name'
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
    summary: 'menu item not named',
    why: 'User cannot get help explaing a menu item',
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
    summary: 'parent missing',
    why: 'Keyboard-only user cannot operate a custom tool',
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
    summary: 'descendant missing',
    why: 'Keyboard-only user cannot operate a custom tool',
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
    summary: 'presentation element has child',
    why: 'Keyboard-only user cannot reach an item intended to be reachable',
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
    summary: 'svg image not named',
    why: 'User cannot get help understanding an image',
    wcag: '1.1.1',
    weight: 4,
    tools: {
      alfa: {
        r43: {
          variable: false,
          quality: 1,
          what: 'Element has no accessible name'
        }
      },
      aslint: {
        accessible_svg: {
          variable: false,
          quality: 1,
          what: 'Element has no title, description, text, attribute label, or role description'
        }
      },
      axe: {
        'svg-img-alt': {
          variable: false,
          quality: 1,
          what: 'Element with an img role has no text alternative'
        }
      },
      qualWeb: {
        'QW-ACT-R21': {
          variable: false,
          quality: 1,
          what: 'Element with an explicit role has no accessible name'
        }
      }
    }
  },
  svgLabelID: {
    summary: 'svg label referent invalid',
    why: 'User cannot get help understanding an image',
    wcag: '1.1.1',
    weight: 4,
    tools: {
      aslint: {
        accessible_svgI: {
          variable: false,
          quality: 1,
          what: 'Element references a nonexisting element as its label'
        }
      }
    }
  },
  cssBansPageRotate: {
    summary: 'CSS bans page rotation',
    why: 'User must read sideways after rotating a device',
    wcag: '1.3.4',
    weight: 4,
    tools: {
      aslint: {
        orientation: {
          variable: false,
          quality: 1,
          what: 'CSS media query specifies an orientation'
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
  cssBansElementRotate: {
    summary: 'CSS bans element rotation',
    why: 'User must read sideways after rotating a device',
    wcag: '1.3.4',
    weight: 4,
    tools: {
      ibm: {
        element_orientation_unlocked: {
          variable: false,
          quality: 1,
          what: 'Element orientation is restricted by a CSS transform'
        }
      }
    }
  },
  orientationRisk: {
    summary: 'orientation issues not testable',
    why: 'User may need to read sideways after rotating a device',
    wcag: '1.3.4',
    weight: 1,
    max: 1,
    tools: {
      aslint: {
        orientationT: {
          variable: false,
          quality: 1,
          what: 'Failure to read a stylesheet prevents testing for orientation violations'
        }
      }
    }
  },
  metaBansZoom: {
    summary: 'meta bans zoom',
    why: 'User cannot adjust the document size for readability',
    wcag: '1.4.4',
    weight: 4,
    max: 1,
    tools: {
      alfa: {
        r47: {
          variable: false,
          quality: 1,
          what: 'Element restricts zooming'
        }
      },
      aslint: {
        zoom_disabled: {
          variable: false,
          quality: 1,
          what: 'Element specifies a minimum or maximum scale or prohibits zooming'
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
    summary: 'font size absolute',
    why: 'User cannot adjust the text size for readability',
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
    summary: 'font small',
    why: 'Text is difficult to read',
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
      aslint: {
        minimum_font_size: {
          variable: false,
          quality: 1,
          what: 'Font size is smaller than 10 pixels'
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
    summary: 'text spacing frozen',
    why: 'User cannot adjust the text spacing for readability',
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
  lineHeightAbsolute: {
    summary: 'line height absolute',
    why: 'User cannot adjust the line height of text for readability',
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
  lineHeightLow: {
    summary: 'line height low',
    why: 'Text is difficult to read',
    wcag: '1.4.8',
    weight: 2,
    tools: {
      alfa: {
        r73: {
          variable: false,
          quality: 1,
          what: 'Text line height is not at least 1.5'
        }
      },
      testaro: {
        lineHeight: {
          variable: false,
          quality: 1,
          what: 'Text has a line height less than 1.5 times its font size'
        }
      }
    }
  },
  overflowHidden: {
    summary: 'overflow hidden',
    why: 'User cannot enlarge the text for readability',
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
    summary: 'overflow possibly hidden',
    why: 'User may be unable to enlarge the text for readability',
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
    summary: 'box size absolute',
    why: 'User cannot enlarge the content of an item for readability',
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
    summary: 'title attribute invalid',
    why: 'User cannot hover to get help explaining an item',
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
    summary: 'link element invalid',
    why: 'Document fails to get a needed external resource',
    wcag: '1.3.1',
    weight: 4,
    tools: {
      htmlcs: {
        'AAA.2_4_8.H59.1': {
          variable: false,
          quality: 1,
          what: 'Element is not in the document head'
        },
        'AAA.2_4_8.H59.2a': {
          variable: false,
          quality: 1,
          what: 'Element has no nonempty rel attribute for the type'
        },
        'A link element with an as attribute must have a rel attribute that contains the value preload or the value modulepreload or the value prefetch.': {
          variable: false,
          quality: 1,
          what: 'Element with an as attribute has no rel attribute with preload, modulepreload, or prefetch as its value'
        }
      },
      nuVal: {
        'A link element must not appear as a descendant of a body element unless the link element has an itemprop attribute or has a rel attribute whose value contains dns-prefetch, modulepreload, pingback, preconnect, prefetch, preload, prerender, or stylesheet.': {
          variable: false,
          quality: 1,
          what: 'Element has a body ancestor but no itemprop or valid rel attribute'
        },
        'A link element with an as attribute must have a rel attribute that contains the value preload or the value modulepreload or the value prefetch.': {
          variable: false,
          quality: 1,
          what: 'Element has an as attribute but no rel attribute with preload, modulepreload, or prefetch as its value'
        },
        'A link element with an as attribute must have a rel attribute that contains the value preload or the value modulepreload.': {
          variable: false,
          quality: 1,
          what: 'Element has an as attribute but no rel attribute with preload or modulepreload as its value'
        }
      }
    }
  },
  metaBad: {
    summary: 'meta invalid',
    why: 'Document fails to include needed data',
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
          what: 'Element is missing a required attribute'
        },
        'A document must not include more than one meta element with its name attribute set to the value description.': {
          variable: false,
          quality: 1,
          what: 'Element with name="description" is not the only meta element with that name'
        },
        'A document must not include both a meta element with an http-equiv attribute whose value is content-type, and a meta element with a charset attribute.': {
          variable: false,
          quality: 1,
          what: 'Element with http-equiv="content-type" is incompatible with the meta element with a charset attribute'
        },
        'A document must not include more than one meta element with a http-equiv attribute whose value is content-type.': {
          variable: false,
          quality: 1,
          what: 'Page has more than 1 meta element with http-equiv="content-type"'
        },
        'A meta element with an http-equiv attribute whose value is X-UA-Compatible must have a content attribute with the value IE=edge.': {
          variable: false,
          quality: 1,
          what: 'Element with http-equiv="X-UA-Compatible" has no content="IE=edge"'
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
    summary: 'script element invalid',
    why: 'Browser processes the document improperly',
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
  itemIDBad: {
    summary: 'itemid invalid',
    why: 'User cannot get help to identify a referent',
    wcag: '1.3.1',
    weight: 4,
    tools: {
      nuVal: {
        'The itemid attribute must not be specified on elements that do not have both an itemscope attribute and an itemtype attribute specified.': {
          variable: false,
          quality: 1,
          what: 'Element has an itemid attribute without both an itemscope and an itemtype attribute'
        }
      }
    }
  },
  itemTypeBad: {
    summary: 'itemtype invalid',
    why: 'User cannot get help on the definition of a term',
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
    summary: 'iframe not named',
    why: 'User cannot get help on the topic of an embedded document',
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
      aslint: {
        title_iframe: {
          variable: false,
          quality: 1,
          what: 'Element is an iframe or object but its title attribute is missing or empty'
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
      htmlcs: {
        'AAA.2_4_1.H64.1': {
          variable: false,
          quality: 1,
          what: 'iframe element has no non-empty title attribute'
        }
      },
      ibm: {
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
    summary: 'role invalid',
    why: 'User cannot get help on the nature of an item',
    wcag: '4.1.2',
    weight: 3,
    tools: {
      alfa: {
        r21: {
          variable: false,
          quality: 1,
          what: 'Element has no valid role'
        },
        r110: {
          variable: false,
          quality: 1,
          what: 'No token in the value of the role attribute is valid'
        }
      },
      aslint: {
        unsupported_role_on_element: {
          variable: false,
          quality: 1,
          what: 'Element has a role that is not valid for it'
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
        },
        aria_child_valid: {
          variable: false,
          quality: 1,
          what: 'Child element has a role not allowed for the role of the parent'
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
    summary: 'role redundant',
    why: 'Document includes unnecessary code',
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
  dirBad: {
    summary: 'dir invalid',
    why: 'Item may behave improperly',
    wcag: '4.1.2',
    weight: 1,
    tools: {
      aslint: {
        invalid_attribute_dir_value: {
          variable: true,
          quality: 1,
          what: 'Element has a dir attribute with a value other than rtl, ltr, or auto'
        }
      }
    }
  },
  attributeBad: {
    summary: 'attribute invalid',
    why: 'Item behaves improperly',
    wcag: '1.3.1',
    weight: 4,
    tools: {
      aslint: {
        misused_input_attribute: {
          variable: false,
          quality: 1,
          what: 'Element has an attribute that is not valid for input elements'
        }
      },
      axe: {
        'aria-prohibited-attr': {
          variable: false,
          quality: 1,
          what: 'Element has an attribute that is not valid for the role of the element'
        }
      },
      ibm: {
        aria_attribute_valid: {
          variable: false,
          quality: 1,
          what: 'ARIA attribute is invalid for the role of its element'
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
        'When the srcset attribute has any image candidate string with a width descriptor, the sizes attribute must also be present.': {
          variable: false,
          quality: 1,
          what: 'Element with a srcset attribute with a width has no sizes attribute'
        },
        'When the srcset attribute has any image candidate string with a width descriptor, the sizes attribute must also be specified.': {
          variable: false,
          quality: 1,
          what: 'Element with a srcset attribute with a width has no valid sizes attribute'
        }
      }
    }
  },
  attributeValueBad: {
    summary: 'attribute value invalid',
    why: 'Item behaves improperly',
    wcag: '1.3.1',
    weight: 4,
    tools: {
      ibm: {
        aria_attribute_value_valid: {
          variable: false,
          quality: 1,
          what: 'Value of an attribute on the element is not valid'
        }
      },
      nuVal: {
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
        '^Bad value  for attribute .+ on element .+: Must not be empty.*$': {
          variable: true,
          quality: 1,
          what: 'Attribute has an invalidly empty value'
        },
        '^Bad value  for attribute (?:width|height) on element img: The empty string is not a valid non-negative integer.*$': {
          variable: true,
          quality: 1,
          what: 'Attribute has an empty value'
        },
        'A script element with a defer attribute must not have a type attribute with the value module.': {
          variable: false,
          quality: 1,
          what: 'script element with a defer attribute has type="module"'
        }
      }
    }
  },
  attributeMissing: {
    summary: 'attribute missing',
    why: 'Item behaves improperly',
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
        aria_attribute_required: {
          variable: false,
          quality: 1,
          what: 'Element does not have the ARIA attribute required by its role'
        }
      },
      nuVal: {
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
        },
        '^Element .+ is missing required attribute .+$': {
          variable: true,
          quality: 1,
          what: 'Element is missing a required attribute'
        }
      }
    }
  },
  roleMissing: {
    summary: 'role missing',
    why: 'Item behaves improperly',
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
    summary: 'role possibly missing',
    why: 'Item may behave improperly',
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
    summary: 'aria attribute missing',
    why: 'Item behaves improperly',
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
  ariaMissingRisk: {
    summary: 'aria attribute possibly missing',
    why: 'Item may behave improperly',
    wcag: '4.1.2',
    weight: 2,
    tools: {
      testaro: {
        optRoleSel: {
          variable: false,
          quality: 1,
          what: 'Non-option element with an explicit option role has no aria-selected attribute'
        }
      }
    }
  },
  ariaAttributeBad: {
    summary: 'aria attribute invalid',
    why: 'Item behavior violates user expectations',
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
        aria_attribute_allowed: {
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
    summary: 'aria attribute redundant',
    why: 'Document includes unnecessary code',
    wcag: '4.1.2',
    weight: 1,
    tools: {
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
    summary: 'aria reference invalid',
    why: 'Item behavior violates user expectations',
    wcag: '1.3.1',
    weight: 4,
    tools: {
      ibm: {
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
    summary: 'autocomplete invalid',
    why: 'User cannot get help entering personal information in a form item',
    wcag: '1.3.5',
    weight: 3,
    tools: {
      alfa: {
        r10: {
          variable: false,
          quality: 1,
          what: 'autocomplete attribute has no valid value'
        }
      },
      aslint: {
        identify_input_purpose: {
          variable: false,
          quality: 1,
          what: 'autocomplete attribute has an invalid value'
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
    summary: 'autocomplete missing',
    why: 'User cannot get help entering personal information in a form',
    wcag: '1.3.5',
    weight: 4,
    tools: {
      testaro: {
        autocomplete: {
          variable: false,
          quality: 0.5,
          what: 'Name or email input is missing its required autocomplete attribute'
        }
      }
    }
  },
  autocompleteRisk: {
    summary: 'autocomplete dubious',
    why: 'User may fail to get help entering personal information in a form item',
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
  requirementBad: {
    summary: 'requirement invalid',
    why: 'User may fail to get help determining whether a form item must be completed',
    wcag: '1.3.5',
    weight: 4,
    tools: {
      aslint: {
        misused_required_attribute: {
          variable: false,
          quality: 1,
          what: 'Requirement status of the element is invalid'
        }
      }
    }
  },
  requirementRedundant: {
    summary: 'requirement redundant',
    why: 'Help determining whether a form item must be completed is at risk of corruption',
    wcag: '1.3.5',
    weight: 1,
    tools: {
      aslint: {
        misused_required_attributeR: {
          variable: false,
          quality: 1,
          what: 'Requirement status of the element is stated twice'
        }
      }
    }
  },
  textContrastAA: {
    summary: 'text contrast poor',
    why: 'Text is difficult to read',
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
      aslint: {
        'color_contrast_state_pseudo_classes_abstract3': {
          variable: false,
          quality: 1,
          what: 'Text has contrast less than 3:1'
        },
        'color_contrast_state_pseudo_classes_abstract4': {
          variable: false,
          quality: 1,
          what: 'Text has contrast less than 4.5:1'
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
    summary: 'color missing',
    why: 'Content is impossible to perceive under some conditions',
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
  colorNamedRisk: {
    summary: 'color perception possibly required',
    why: 'Content is impossible to perceive under some conditions',
    wcag: '1.4.1',
    weight: 1,
    tools: {
      qualWeb: {
        'text-color-convey-information': {
          variable: false,
          quality: 1,
          what: 'Text naming a color may require the ability to distinguish colors'
        }
      }
    }
  },
  contrastAAA: {
    summary: 'text contrast improvable',
    why: 'Text is difficult to read',
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
      aslint: {
        'color_contrast_aaa': {
          variable: false,
          quality: 1,
          what: 'Text contrast may be less than enhanced but the element is invisible'
        },
        'color_contrast_aaa4': {
          variable: false,
          quality: 1,
          what: 'Text has contrast less than 4.5:1'
        },
        'color_contrast_aaa7': {
          variable: false,
          quality: 1,
          what: 'Text has contrast less than 7:1'
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
      }
    }
  },
  contrastRisk: {
    summary: 'text contrast not testable',
    why: 'Text may be difficult to read',
    wcag: '1.4.3',
    weight: 1,
    tools: {
      alfa: {
        cantTellTextContrast: {
          variable: false,
          quality: 1,
          what: 'Test of text contrast could not give a conclusive result'
        }
      },
      aslint: {
        color_contrast_state_pseudo_classes_abstractF: {
          variable: false,
          quality: 1,
          what: 'Fixed position of the element prevents contrast measurement'
        },
        color_contrast_state_pseudo_classes_abstractB: {
          variable: false,
          quality: 1,
          what: 'Transparent background color of the element prevents contrast measurement'
        },
        color_contrast_aaaB: {
          variable: false,
          quality: 1,
          what: 'Transparent background color of the element prevents contrast measurement'
        }
      },
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
    summary: 'ID empty',
    why: 'Item behaves improperly',
    wcag: '1.3.1',
    weight: 4,
    tools: {
      nuVal: {
        '^Bad value  for attribute .+ on element .+: An ID must not be the empty string.*$': {
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
    summary: 'target empty',
    why: 'Item is displayed improperly',
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
    summary: 'heading empty',
    why: 'User cannot get help on the topic of a part of the document',
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
      aslint: {
        empty_heading: {
          variable: false,
          quality: 1,
          what: 'Element is a heading but is empty'
        }
      },
      axe: {
        'empty-heading': {
          variable: false,
          quality: 1,
          what: 'Heading is empty'
        }
      },
      ed11y: {
        headingEmpty: {
          variable: false,
          quality: 1,
          what: 'Heading is empty'
        }
      },
      htmlcs: {
        'AAA.1_3_1.H42.2': {
          variable: false,
          quality: 1,
          what: 'Heading is empty'
        }
      },
      ibm: {
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
    summary: 'heading heads nothing',
    why: 'Helper misdescribes the document',
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
  typeBad: {
    summary: 'type invalid',
    why: 'Document styles are at risk of corruption',
    wcag: '1.3.1',
    weight: 4,
    tools: {
      nuVal: {
        'The only allowed value for the type attribute for the style element is text/css (with no parameters). (But the attribute is not needed and should be omitted altogether.)': {
          variable: false,
          quality: 1,
          what: 'type attribute is invalid'
        }
      }
    }
  },
  typeRedundant: {
    summary: 'type redundant',
    why: 'Document includes unnecessary code',
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
    summary: 'image name redundant',
    why: 'Helper repeats the explanation of an image',
    wcag: '1.1.1',
    weight: 1,
    tools: {
      aslint: {
        img_alt_duplicate_text_link: {
          variable: false,
          quality: 1,
          what: 'Text alternative of the image duplicates the text of the enclosing link'
        }
      },
      axe: {
        'image-redundant-alt': {
          variable: false,
          quality: 1,
          what: 'Text of a button or link is repeated in the image alternative'
        }
      },
      ibm: {
        img_alt_redundant: {
          variable: false,
          quality: 1,
          what: 'Text alternative of the link image duplicates text in the same or an adjacent link'
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
    summary: 'decorative element has title',
    why: 'Hovering-produced information is denied to a keyboard-only user',
    wcag: '1.3.1',
    weight: 1,
    tools: {
      aslint: {
        img_empty_alt_with_empty_title: {
          variable: false,
          quality: 1,
          what: 'Element has an empty alt attribute but a nonempty title attribute'
        }
      },
      htmlcs: {
        'AAA.1_1_1.H67.1': {
          variable: false,
          quality: 1,
          what: 'Element has an empty alt attribute but has a nonempty title attribute'
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
    summary: 'title attribute redundant',
    why: 'Helper repeats the explanation of an item',
    wcag: '1.3.1',
    weight: 1,
    tools: {
      aslint: {
        label_duplicated_content_title: {
          variable: false,
          quality: 1,
          what: 'Element has an accessible name identical to the value of its title attribute'
        }
      },
      qualWeb: {
        'QW-BP3': {
          variable: false,
          quality: 1,
          what: 'Link text content is equal to the title attribute'
        }
      },
      testaro: {
        linkTitle: {
          variable: false,
          quality: 1,
          what: 'Link title value is also contained in the link text'
        }
      },
      wave: {
        title_redundant: {
          variable: false,
          quality: 1,
          what: 'Title attribute text is the same as the text or alternative text'
        }
      }
    }
  },
  titleEmpty: {
    summary: 'title attribute empty',
    why: 'Hovering does not get the promised explanation of an item',
    wcag: '1.3.1',
    weight: 1,
    tools: {
      aslint: {
        empty_title_attribute: {
          variable: false,
          quality: 0.5,
          what: 'title attribute of the element is empty or only whitespace'
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
  docTypeMissing: {
    summary: 'DOCTYPE missing',
    why: 'Browser processes the document improperly',
    wcag: '1.3.1',
    weight: 4,
    max: 1,
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
  docTypeMisplaced: {
    summary: 'DOCTYPE in invalid location',
    why: 'Browser processes the document improperly',
    wcag: '1.3.1',
    weight: 4,
    max: 1,
    tools: {
      nuVal: {
        'Stray doctype.': {
          variable: false,
          quality: 1,
          what: 'DOCTYPE is in an invalid location'
        }
      }
    }
  },
  docTypeBad: {
    summary: 'DOCTYPE invalid',
    why: 'Browser processes the document improperly',
    wcag: '1.3.1',
    weight: 3,
    max: 1,
    tools: {
      nuVal: {
        'Almost standards mode doctype. Expected <!DOCTYPE html>.': {
          variable: false,
          quality: 1,
          what: 'document type declaration differs from <!DOCTYPE html>'
        }
      }
    }
  },
  pageTitleBad: {
    summary: 'page title invalid',
    why: 'Browser processes the document improperly',
    wcag: '1.3.1',
    weight: 3,
    max: 1,
    tools: {
      aslint: {
        page_titleU: {
          variable: false,
          quality: 1,
          what: 'Page title does not identify the contents or purpose of the page'
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
  pageTitle: {
    summary: 'page title missing',
    why: 'User is not informed of the topic of the document',
    wcag: '2.4.2',
    weight: 4,
    max: 1,
    tools: {
      alfa: {
        r1: {
          variable: false,
          quality: 1,
          what: 'Document has no valid title element'
        }
      },
      aslint: {
        page_titleN: {
          variable: false,
          quality: 1,
          what: 'Page title is missing or empty'
        }
      },
      axe: {
        'document-title': {
          variable: false,
          quality: 1,
          what: 'Document contains no title element'
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
        'page_title_exists': {
          variable: false,
          quality: 1,
          what: 'Page has no title'
        }
      },
      qualWeb: {
        'QW-ACT-R1': {
          variable: false,
          quality: 1,
          what: 'HTML page has no title'
        }
      }
    }
  },
  headElementsBad: {
    summary: 'element in head invalid',
    why: 'Browser processes the document improperly',
    wcag: '4.1.1',
    weight: 3,
    tools: {
      aslint: {
        elements_not_allowed_in_head: {
          variable: false,
          quality: 1,
          what: 'Elements in the head are not allowed there'
        }
      },
      testaro: {
        headEl: {
          variable: false,
          quality: 1,
          what: 'Elements in the head are not allowed there'
        }
      }
    }
  },
  headingLevelSkip: {
    summary: 'heading level skipped',
    why: 'Helper misdescribes the document',
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
      ed11y: {
        headingLevelSkipped: {
          variable: false,
          quality: 1,
          what: 'Heading level is more than 1 greater than that of the previous heading'
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
    summary: 'heading structure illogical',
    why: 'Helper misdescribes the document',
    wcag: '1.3.1',
    weight: 2,
    tools: {
      aslint: {
        headings_hierarchy: {
          variable: false,
          quality: 1,
          what: 'Heading level is illogical in its context'
        }
      },
      htmlcs: {
        'AAA.1_3_1_AAA.G141': {
          variable: false,
          quality: 1,
          what: 'Heading level is incorrect'
        }
      }
    }
  },
  headingConfusion: {
    summary: 'heading names repeated',
    why: 'User cannot differentiate parts of the document',
    wcag: '1.3.1',
    weight: 2,
    tools: {
      aslint: {
        headings_sibling_unique: {
          variable: false,
          quality: 1,
          what: 'Sibling headings have the same accessible name'
        }
      },
      testaro: {
        headingAmb: {
          variable: false,
          quality: 1,
          what: 'Heading has the same text as a previous sibling heading at the same level'
        }
      }
    }
  },
  headingNone: {
    summary: 'headings missing',
    why: 'User cannot survey parts of the document',
    wcag: '1.3.1',
    weight: 3,
    max: 1,
    tools: {
      alfa: {
        r59: {
          variable: false,
          quality: 1,
          what: 'Document has no headings'
        }
      },
      aslint: {
        no_headings: {
          variable: false,
          quality: 1,
          what: 'Document has no headings'
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
  h1Not1: {
    summary: 'not exactly 1 h1 heading',
    why: 'User cannot understand the topic of the document',
    wcag: '1.3.1',
    weight: 2,
    max: 1,
    tools: {
      aslint: {
        'h1_must_be': {
          variable: false,
          quality: 1,
          what: 'Page contains no h1 element'
        }
      },
      axe: {
        'page-has-heading-one': {
          variable: false,
          quality: 1,
          what: 'Document contains no level-one heading'
        }
      },
      nuVal: {
        'Consider using the h1 element as a top-level heading only (all h1 elements are treated as top-level headings by many screen readers and other tools).': {
          variable: false,
          quality: 1,
          what: 'Page contains more than 1 h1 element'
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
  h1Not1st: {
    summary: 'h1 not 1st heading',
    why: 'User cannot understand the topic of the document',
    wcag: '1.3.1',
    weight: 3,
    max: 1,
    tools: {
      alfa: {
        r61: {
          variable: false,
          quality: 1,
          what: 'First heading is not h1'
        }
      }
    }
  },
  articleHeadingless: {
    summary: 'article heading missing',
    why: 'User cannot understand the topic of a part of the document',
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
    summary: 'section heading missing',
    why: 'User cannot understand the topic of a part of the document',
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
      }
    }
  },
  headingLength: {
    summary: 'heading abnormally long',
    why: 'User has difficulty understanding the topic of a part of the document',
    wcag: '1.3.1',
    weight: 1,
    tools: {
      ed11y: {
        headingIsLong: {
          variable: false,
          quality: 1,
          what: 'Heading is longer than 160 characters'
        }
      }
    }
  },
  justification: {
    summary: 'text fully justified',
    why: 'Text is difficult to read',
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
    summary: 'justification possibly undefined',
    why: 'Text may be difficult to read',
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
    summary: 'semantic properties represented with styles',
    why: 'User cannot get help to fully understand the text',
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
  hrConfusionRisk: {
    summary: 'hr misused',
    why: 'User cannot get help on the nature of segments of the document',
    wcag: '1.3.1',
    weight: 1,
    tools: {
      aslint: {
        horizontal_rule: {
          variable: false,
          quality: 1,
          what: 'hr element has neither a true aria-hidden attribute nor a presentation role'
        }
      },
      testaro: {
        hr: {
          variable: false,
          quality: 1,
          what: 'hr instead of styles is used for vertical segmentation'
        }
      }
    }
  },
  pseudoCodeRisk: {
    summary: 'pre use dubious',
    why: 'User may be unable to get help to fully understand the text',
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
  pseudoParagraphRisk: {
    summary: 'double br use dubious',
    why: 'User may be unable to get help to fully understand the text',
    wcag: '1.3.1',
    weight: 1,
    tools: {
      testaro: {
        pseudoP: {
          variable: false,
          quality: 1,
          what: 'Element contains sequential br elements instead of p'
        }
      }
    }
  },
  pseudoHeadingRisk: {
    summary: 'heading-like styles dubious',
    why: 'User may be unable to understand the topic of a part of the document',
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
      ed11y: {
        textPossibleHeading: {
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
    summary: 'underlining dubious',
    why: 'User may be misled into believing some text is a link',
    wcag: '1.3.1',
    weight: 1,
    tools: {
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
    summary: 'list child invalid',
    why: 'User cannot get help on which items are in a list',
    wcag: '1.3.1',
    weight: 4,
    tools: {
      axe: {
        list: {
          variable: false,
          quality: 1,
          what: 'List element ul or ol has a child element other than li, script, or template'
        },
        'definition-list': {
          variable: false,
          quality: 1,
          what: 'List element dl has a child element other than properly ordered dt or dt group, script, template, or div'
        }
      },
      nuVal: {
        'Element dl is missing a required child element.': {
          variable: false,
          quality: 1,
          what: 'dl element has no child element'
        }
      }
    }
  },
  listItemOrphan: {
    summary: 'list item orphan',
    why: 'User cannot get help on whether an item is in a list',
    wcag: '1.3.1',
    weight: 4,
    tools: {
      axe: {
        listitem: {
          variable: false,
          quality: 1,
          what: 'Element is not contained by a ul or ol element'
        }
      }
    }
  },
  descriptionOrphan: {
    summary: 'description list orphan',
    why: 'User cannot get help on whether an item is in a list',
    wcag: '1.3.1',
    weight: 4,
    tools: {
      qualWeb: {
        'QW-WCAG-T33': {
          variable: false,
          quality: 1,
          what: 'Element is not contained by a valid dl element'
        }
      }
    }
  },
  pseudoList: {
    summary: 'list-like br use dubious',
    why: 'User cannot get help recognizing a list of items',
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
  pseudoListRisk: {
    summary: 'list possibly not marked as such',
    why: 'User may be unable to get help on which items are in lists',
    wcag: '1.3.1',
    weight: 1,
    tools: {
      ed11y: {
        textPossibleList: {
          variable: false,
          quality: 1,
          what: 'List may be miscoded as a paragraph sequence'
        }
      },
      htmlcs: {
        'AAA.1_3_1.H48.1': {
          variable: false,
          quality: 1,
          what: 'Content seems to simulate an unordered list without a ul'
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
    summary: 'list unordered type dubious',
    why: 'User may be unable to get help on whether a list is ordered',
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
    summary: 'nav links not list',
    why: 'User cannot get help recognizing a list of navigation links',
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
    summary: 'select not named',
    why: 'User cannot get help on the topic of a list of options',
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
    summary: 'option not named',
    why: 'User cannot get help to understand an option',
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
    summary: 'option groups possibly not marked',
    why: 'User may be unable to get help recognizing groups of options',
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
    summary: 'no option focusable',
    why: 'Keyboard-only user cannot choose an option',
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
    summary: 'duplicate access key',
    why: 'Keyboard shortcut does not reliably trigger the intended action',
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
    summary: 'fieldset missing',
    why: 'User cannot get help recognizing a group of related form items',
    wcag: '1.3.1',
    weight: 2,
    tools: {
      ibm: {
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
    summary: 'fieldset possibly missing',
    why: 'User may be unable to get help recognizing a group of related form items',
    wcag: '1.3.1',
    weight: 1,
    tools: {
      aslint: {
        group_elements_name_attribute: {
          variable: false,
          quality: 1,
          what: 'Element is an input with a name attribute but has no fieldset parent'
        }
      },
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
    summary: 'legend location invalid',
    why: 'User cannot get help on the topic of a group of form items',
    wcag: '4.1.2',
    weight: 4,
    tools: {
      testaro: {
        legendLoc: {
          variable: false,
          quality: 1,
          what: 'legend element is not the first child of its fieldset element'
        }
      }
    }
  },
  legendMissing: {
    summary: 'legend missing',
    why: 'User cannot get help on the topic of a group of form items',
    wcag: '4.1.2',
    weight: 2,
    tools: {
      aslint: {
        fieldset_no_legend: {
          variable: false,
          quality: 1,
          what: 'First child element of the element is not a legend'
        },
        legend_first_child_of_fieldset: {
          variable: false,
          quality: 1,
          what: 'First child element of the element is not a legend'
        }
      },
      htmlcs: {
        'AAA.1_3_1.H71.NoLegend': {
          variable: false,
          quality: 1,
          what: 'Element has no legend element'
        }
      },
      ibm: {
        fieldset_legend_valid: {
          variable: false,
          quality: 1,
          what: 'Element has no legend element'
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
          what: 'Element has no legend element'
        }
      }
    }
  },
  groupName: {
    summary: 'group not named',
    why: 'User cannot get help on the topic of a group of form items',
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
    summary: 'table misused',
    why: 'Helper misinforms a user about whether items are cells of a table',
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
    summary: 'table not marked as such',
    why: 'Helper misinforms a user about whether items are cells of a table',
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
  tableColumnsVary: {
    summary: 'table column counts vary',
    why: 'User cannot get help on the dimensions of a table',
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
    summary: 'table caption missing',
    why: 'User cannot get help on the topic of a table',
    wcag: '1.3.1',
    weight: 1,
    tools: {
      aslint: {
        table_missing_descriptionC: {
          variable: false,
          quality: 1,
          what: 'Element contains no caption element'
        },
        table_missing_descriptionE: {
          variable: false,
          quality: 1,
          what: 'Element contains a caption element, but it is empty'
        }
      },
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
          what: 'Element contains no caption element'
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
  tableCaptionLoc: {
    summary: 'table caption location invalid',
    why: 'User cannot get help on the topic of a table',
    wcag: '1.3.1',
    weight: 3,
    tools: {
      testaro: {
        captionLoc: {
          variable: false,
          quality: 1,
          what: 'caption element is not the first child of a table element'
        }
      }
    }
  },
  tableCapSum: {
    summary: 'table summary duplicative',
    why: 'Helper informs a user repetitively about the topic of a table',
    wcag: '1.3.1',
    weight: 2,
    tools: {
      aslint: {
        table_caption_summary_identical: {
          variable: false,
          quality: 1,
          what: 'Element has a summary attribute identical to its caption element'
        }
      }
    }
  },
  tableSum: {
    summary: 'table summary empty',
    why: 'User cannot get help summarizing a table',
    wcag: '1.3.1',
    weight: 4,
    tools: {
      aslint: {
        table_missing_descriptionS: {
          variable: false,
          quality: 1,
          what: 'Element has a summary attribute, but it is empty'
        }
      }
    }
  },
  tableLabelID: {
    summary: 'table aria-labelledby invalid',
    why: 'User cannot get help on the topic of a table',
    wcag: '1.3.1',
    weight: 4,
    tools: {
      aslint: {
        table_missing_descriptionLM: {
          variable: false,
          quality: 1,
          what: 'Element has a broken aria-labelledby ID'
        },
        table_missing_descriptionLE: {
          variable: false,
          quality: 1,
          what: 'Element has an aria-labelledby attribute, but it is empty'
        }
      }
    }
  },
  tableDescriptionID: {
    summary: 'table aria-describedby invalid',
    why: 'User cannot get help on the topic of a table',
    wcag: '1.3.1',
    weight: 4,
    tools: {
      aslint: {
        table_missing_descriptionDM: {
          variable: false,
          quality: 1,
          what: 'Element has a broken aria-describedby ID'
        },
        table_missing_descriptionDE: {
          variable: false,
          quality: 1,
          what: 'Element has an aria-describedby attribute, but it is empty'
        }
      }
    }
  },
  cellHeadersNotInferrable: {
    summary: 'cell headers not inferrable',
    why: 'User cannot get help on relationships in a table',
    wcag: '1.3.1',
    weight: 4,
    tools: {
      htmlcs: {
        'AAA.1_3_1.H43.HeadersRequired': {
          variable: false,
          quality: 1,
          what: 'Complex table is missing headers attributes of cells'
        }
      }
    }
  },
  cellHeadersOutsideTable: {
    summary: 'cell headers outside table',
    why: 'User cannot get help on relationships in a table',
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
    summary: 'cell headers possibly ambiguous',
    why: 'User may be unable to get help on relationships in a table',
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
    summary: 'table headers missing',
    why: 'User cannot get help on relationships in a table',
    wcag: '1.3.1',
    weight: 3,
    tools: {
      aslint: {
        table_row_and_column_headersRC: {
          variable: false,
          quality: 1,
          what: 'None of the cells in the table is a header'
        }
      },
      ed11y: {
        tableNoHeaderCells: {
          variable: false,
          quality: 1,
          what: 'None of the cells in the table is a th element'
        }
      },
      ibm: {
        table_headers_exists: {
          variable: false,
          quality: 1,
          what: 'No cell in the table is a th element or has a scope or headers attribute'
        }
      }
    }
  },
  tableCellHeaderless: {
    summary: 'table-cell header missing',
    why: 'User cannot get help on the topic of a table cell',
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
  tableHeaderCellless: {
    summary: 'table-header cell missing',
    why: 'User cannot get help on relationships in a table',
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
    summary: 'Table scope possibly ambiguous',
    why: 'User may be unable to get help on relationships in a table',
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
    summary: 'table header empty',
    why: 'User cannot get help on relationships in a table',
    wcag: '1.3.1',
    weight: 2,
    tools: {
      ed11y: {
        tableEmptyHeaderCell: {
          variable: false,
          quality: 1,
          what: 'Element is a table header but has no text'
        }
      },
      wave: {
        th_empty: {
          variable: false,
          quality: 1,
          what: 'Element not named'
        }
      }
    }
  },
  tableHead: {
    summary: 'thead missing',
    why: 'User cannot get help on parts of a table',
    wcag: '1.3.1',
    weight: 1,
    tools: {
      aslint: {
        table_row_and_column_headersH: {
          variable: false,
          quality: 1,
          what: 'Element does not contain a thead element'
        }
      }
    }
  },
  tableBody: {
    summary: 'tbody missing',
    why: 'User cannot get help on parts of a table',
    wcag: '1.3.1',
    weight: 1,
    tools: {
      aslint: {
        table_row_and_column_headersB: {
          variable: false,
          quality: 1,
          what: 'Element does not contain a tbody element'
        }
      }
    }
  },
  tableEmbedded: {
    summary: 'table embedded in table',
    why: 'User cannot get help on relationships in a table',
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
  tableHeading: {
    summary: 'heading located in table',
    why: 'Complex relationships in a table may confuse a user',
    wcag: '1.3.1',
    weight: 1,
    tools: {
      ed11y: {
        tableContainsContentHeading: {
          variable: false,
          quality: 1,
          what: 'element is a heading within a cell of a table'
        }
      }
    }
  },
  controlNoText: {
    summary: 'control not named',
    why: 'User cannot get help on how to operate a form item',
    wcag: '4.1.2',
    weight: 4,
    tools: {
      alfa: {
        r8: {
          variable: false,
          quality: 1,
          what: 'Form field has no accessible name'
        }
      },
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
    summary: 'control label invisible',
    why: 'User cannot understand how to operate a form item',
    wcag: '2.4.6',
    weight: 4,
    tools: {
      aslint: {
        label_visually_hidden_only: {
          variable: false,
          quality: 1,
          what: 'Form control has a label but it is not visible'
        }
      },
      axe: {
        'label-title-only': {
          variable: false,
          quality: 1,
          what: 'Form control has no visible label'
        }
      }
    }
  },
  titleAsLabel: {
    summary: 'control has title instead of label',
    why: 'User cannot get help on how to operate a form item',
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
  visibleLabelNotInName: {
    summary: 'visible label not in name',
    why: 'User cannot get help choosing a form control to operate',
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
    summary: 'target small',
    why: 'User cannot reliably choose an item to click or tap',
    wcag: '2.5.5',
    weight: 3,
    tools: {
      alfa: {
        r111: {
          variable: false,
          quality: 1,
          what: 'Target size is substandard'
        }
      },
      testaro: {
        targetSize: {
          variable: false,
          quality: 1,
          what: 'Button, input, or non-inline link is smaller than 44 px wide and high'
        }
      }
    }
  },
  visibleBulk: {
    summary: 'large visible-element count',
    why: 'User cannot easily find items in the document',
    wcag: '2.4',
    weight: 1,
    max: 1,
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
    summary: 'control child of link or button',
    why: 'User cannot reliably choose an item to click or tap',
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
        'An element with the attribute tabindex must not appear as a descendant of the button element.': {
          variable: false,
          quality: 1,
          what: 'descendant of a button element has a tabindex attribute'
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
    summary: 'element not focusable',
    why: 'Keyboard-only user cannot choose an item to operate',
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
    summary: 'focus indication poor',
    why: 'Keyboard-only user cannot choose an item to operate',
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
      aslint: {
        outline_zero: {
          variable: false,
          quality: 1,
          what: 'Element may get invisibly focused because its outline has no thickness'
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
    summary: 'all-capital text',
    why: 'Text is difficult to read',
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
      aslint: {
        capital_letters_words: {
          variable: false,
          quality: 1,
          what: 'Element or its title has entirely upper-case words'
        }
      },
      ed11y: {
        textUppercase: {
          variable: false,
          quality: 1,
          what: 'Element contains more than 4 consecutive upper-case words'
        }
      },
      testaro: {
        allCaps: {
          variable: false,
          quality: 1,
          what: 'Element has a text substring of at least 8 upper-case characters'
        }
      }
    }
  },
  allItalics: {
    summary: 'all-italic text',
    why: 'Text is difficult to read',
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
      aslint: {
        font_style_italic: {
          variable: false,
          quality: 1,
          what: 'Text longer than 80 characters has an italic font style'
        }
      },
      testaro: {
        allSlanted: {
          variable: false,
          quality: 1,
          what: 'Element has a text substring of at least 40 italic or oblique characters'
        }
      }
    }
  },
  textDistortion: {
    summary: 'text distortion',
    why: 'Text is difficult to read',
    wcag: '3.1.5',
    weight: 1,
    tools: {
      testaro: {
        distortion: {
          variable: false,
          quality: 1,
          what: 'Element text is distorted by a transform style property'
        }
      }
    }
  },
  noLandmarks: {
    summary: 'no landmarks',
    why: 'User cannot get help on how the document is organized',
    wcag: '1.3.6',
    weight: 2,
    max: 1,
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
    summary: 'content beyond landmarks',
    why: 'User cannot get help on how some of the document is organized',
    wcag: '1.3.6',
    weight: 1,
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
        aria_content_in_landmark: {
          variable: false,
          quality: 1,
          what: 'Content is not within a landmark element'
        }
      }
    }
  },
  footerNotTop: {
    summary: 'footer child of landmark',
    why: 'User cannot get help on how some of the document is organized',
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
    summary: 'aside child of landmark',
    why: 'User cannot get help on how some of the document is organized',
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
    summary: 'main child of landmark',
    why: 'User cannot get help on how some of the document is organized',
    wcag: '1.3.6',
    weight: 2,
    tools: {
      aslint: {
        main_landmark_must_be_top_level: {
          variable: false,
          quality: 1,
          what: 'Element with a main role is not at the top level'
        }
      },
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
    summary: 'mains not distinctly named',
    why: 'User cannot get help on how some of the document is organized',
    wcag: '1.3.6',
    weight: 3,
    tools: {
      ibm: {
        aria_main_label_visible: {
          variable: false,
          quality: 1,
          what: 'Element with a main role has no unique visible label among the main-role elements'
        },
        aria_main_label_unique: {
          variable: false,
          quality: 1,
          what: 'Element with a main role has no unique label among the main-role elements'
        }
      }
    }
  },
  mainNone: {
    summary: 'main missing',
    why: 'User cannot get help on how some of the document is organized',
    wcag: '1.3.6',
    weight: 2,
    max: 1,
    tools: {
      axe: {
        'landmark-one-main': {
          variable: false,
          quality: 1,
          what: 'page has no main landmark'
        }
      }
    }
  },
  mainNot1: {
    summary: 'multiple mains',
    why: 'User cannot get help on how some of the document is organized',
    wcag: '1.3.6',
    weight: 2,
    max: 1,
    tools: {
      aslint: {
        main_element_only_one: {
          variable: false,
          quality: 1,
          what: 'Document has more than 1 main landmark'
        }
      },
      axe: {
        'landmark-no-duplicate-main': {
          variable: false,
          quality: 1,
          what: 'Page has more than 1 main landmark'
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
    summary: 'multiple banners',
    why: 'User cannot get help on how some of the document is organized',
    wcag: '1.3.6',
    weight: 2,
    max: 1,
    tools: {
      axe: {
        'landmark-no-duplicate-banner': {
          variable: false,
          quality: 1,
          what: 'Page has more than 1 banner landmark'
        }
      },
      ibm: {
        aria_banner_single: {
          variable: false,
          quality: 1,
          what: 'More than one element with a banner role is on the page'
        }
      }
    }
  },
  bannerNotTop: {
    summary: 'banner child of landmark',
    why: 'User cannot get help on how some of the document is organized',
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
    summary: 'contentinfos not distinctly named',
    why: 'User cannot get help on how some of the document is organized',
    wcag: '1.3.6',
    weight: 3,
    tools: {
      ibm: {
        aria_contentinfo_label_unique: {
          variable: false,
          quality: 1,
          what: 'Multiple elements with a contentinfo role have no unique labels'
        }
      }
    }
  },
  footerNot1: {
    summary: 'multiple contentinfos',
    why: 'User cannot get help on how some of the document is organized',
    wcag: '1.3.6',
    weight: 2,
    max: 1,
    tools: {
      aslint: {
        contentinfo_landmark_only_one: {
          variable: false,
          quality: 1,
          what: 'Page has more than 1 contentinfo landmark (footer)'
        }
      },
      axe: {
        'landmark-no-duplicate-contentinfo': {
          variable: false,
          quality: 1,
          what: 'Page has more than 1 contentinfo landmark (footer)'
        }
      },
      ibm: {
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
    summary: 'landmarks not distinctly named',
    why: 'User cannot get help on how some of the document is organized',
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
  documentConfusion: {
    summary: 'document elements not distinctly named',
    why: 'User cannot get help on how some of the document is organized',
    wcag: '1.3.6',
    weight: 3,
    tools: {
      ibm: {
        aria_document_label_unique: {
          variable: false,
          quality: 1,
          what: 'Multiple elements with a document role have no unique labels'
        }
      }
    }
  },
  formsNested: {
    summary: 'form nested in another form',
    why: 'User cannot predict effect of actions in a form',
    wcag: '4.1',
    weight: 4,
    tools: {
      nuVal: {
        'Saw a form start tag, but there was already an active form element. Nested forms are not allowed. Ignoring the tag.': {
          variable: false,
          quality: 1,
          what: 'form element nested within another form element'
        }
      }
    }
  },
  formConfusion: {
    summary: 'forms not distinctly named',
    why: 'User cannot get help on how some of the document is organized',
    wcag: '1.3.6',
    weight: 3,
    tools: {
      ibm: {
        aria_form_label_unique: {
          variable: false,
          quality: 1,
          what: 'Multiple elements with a form role do not have unique labels'
        }
      }
    }
  },
  applicationConfusion: {
    summary: 'applications not distinctly named',
    why: 'User cannot get help on how some of the document is organized',
    wcag: '1.3.6',
    weight: 3,
    tools: {
      ibm: {
        aria_application_label_unique: {
          variable: false,
          quality: 1,
          what: 'Element with an application role has no unique purpose label among the application-role elements'
        }
      }
    }
  },
  asideConfusion: {
    summary: 'asides not distinctly named',
    why: 'User cannot get help on how some of the document is organized',
    wcag: '1.3.6',
    weight: 3,
    tools: {
      ibm: {
        aria_complementary_label_unique: {
          variable: false,
          quality: 1,
          what: 'Multiple elements with a complementary role have no unique labels'
        }
      }
    }
  },
  bannerConfusion: {
    summary: 'banners not distinctly named',
    why: 'User cannot get help on how some of the document is organized',
    wcag: '1.3.6',
    weight: 3,
    tools: {
      ibm: {
        aria_banner_label_unique: {
          variable: false,
          quality: 1,
          what: 'Multiple elements with a banner role have no unique labels'
        }
      }
    }
  },
  navConfusion: {
    summary: 'navigations not distinctly named',
    why: 'User cannot get help on how some of the document is organized',
    wcag: '1.3.6',
    weight: 3,
    tools: {
      ibm: {
        aria_navigation_label_unique: {
          variable: false,
          quality: 1,
          what: 'Multiple elements with the navigation role do not have unique labels'
        }
      }
    }
  },
  landmarkInNav: {
    summary: 'invalid landmark child of navigation role',
    why: 'User cannot get help on how some of the document is organized',
    wcag: '1.3.6',
    weight: 4,
    tools: {
      aslint: {
        navigation_landmark_restrictions: {
          variable: false,
          quality: 1,
          what: 'Element with a navigation role contains a landmark other than region and search'
        }
      }
    }
  },
  regionConfusion: {
    summary: 'regions not distinctly named',
    why: 'User cannot get help on how some of the document is organized',
    wcag: '1.3.6',
    weight: 3,
    tools: {
      ibm: {
        aria_region_label_unique: {
          variable: false,
          quality: 1,
          what: 'Multiple elements with a region role do not have unique labels'
        }
      }
    }
  },
  searchConfusion: {
    summary: 'searches not distinctly named',
    why: 'User cannot get help on how some of the document is organized',
    wcag: '1.3.6',
    weight: 3,
    tools: {
      ibm: {
        aria_search_label_unique: {
          variable: false,
          quality: 1,
          what: 'Multiple elements with the search role do not have unique labels'
        }
      }
    }
  },
  complementaryNoText: {
    summary: 'complementary not named',
    why: 'User cannot get help on how some of the document is organized',
    wcag: '1.3.6',
    weight: 1,
    tools: {
      ibm: {
        aria_complementary_labelled: {
          variable: false,
          quality: 1,
          what: 'Element with a complementary role has no label'
        },
        aria_complementary_label_visible: {
          variable: false,
          quality: 1,
          what: 'Element with a complementary role has no visible label'
        }
      }
    }
  },
  labelNoText: {
    summary: 'label not named',
    why: 'User cannot get help on the topic of a form item',
    wcag: '1.3.1',
    weight: 4,
    tools: {
      ibm: {
        label_content_exists: {
          variable: false,
          quality: 1,
          what: 'label element has no descriptive text identifying the expected input'
        }
      }
    }
  },
  focusableOperable: {
    summary: 'focusable element inoperable',
    why: 'Inoperability of an item violates a user expectation',
    wcag: '2.1.1',
    weight: 2,
    tools: {
      testaro: {
        focOp: {
          variable: false,
          quality: 1,
          what: 'Tab-focusable element is inoperable'
        }
      }
    }
  },
  operableFocusable: {
    summary: 'operable element not focusable',
    why: 'Keyboard-only user cannot navigate properly to an operable item',
    wcag: '2.1.1',
    weight: 4,
    tools: {
      testaro: {
        opFoc: {
          variable: false,
          quality: 1,
          what: 'Operable element is not Tab-focusable'
        }
      }
    }
  },
  focusableRole: {
    summary: 'focusable element not active',
    why: 'Keyboard-only user cannot navigate properly to the operable items',
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
    summary: 'focusable element hidden',
    why: 'Keyboard-only user cannot navigate properly to the operable items',
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
      aslint: {
        misused_aria_on_focusable_element: {
          variable: false,
          quality: 1,
          what: 'Visible focusable element has a true aria-hidden attribute or a presentation role'
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
      }
    }
  },
  focusedAway: {
    summary: 'element beyond display when focused',
    why: 'Keyboard-only user cannot navigate properly to the operable items',
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
    summary: 'presentational child focusable',
    why: 'Keyboard-only user cannot navigate properly to the operable items',
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
    summary: 'labeled element ambiguous',
    why: 'User cannot get help on the topic of a form item',
    wcag: '1.3.1',
    weight: 4,
    tools: {
      aslint: {
        label_implicitly_associatedM: {
          variable: false,
          quality: 1,
          what: 'Element contains more than 1 labelable element.'
        }
      },
      nuVal: {
        'The label element may contain at most one button, input, meter, output, progress, select, or textarea descendant.': {
          variable: false,
          quality: 1,
          what: 'Element has more than 1 labelable descendant.'
        },
        'label element with multiple labelable descendants.': {
          variable: false,
          quality: 1,
          what: 'Element has multiple labelable descendants.'
        }
      }
    }
  },
  labeledHidden: {
    summary: 'control hidden but labeled',
    why: 'Document includes unnecessary code',
    wcag: '1.3.1',
    weight: 1,
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
    summary: 'page hidden',
    why: 'User cannot get the document content',
    wcag: '2.4.7',
    weight: 4,
    max: 1,
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
  hideFailureRisk: {
    summary: 'false aria-hidden value risky',
    why: 'User may be misled by erroneously hidden or revealed document content',
    wcag: '2.4.6',
    weight: 0,
    tools: {
      aslint: {
        aria_hidden: {
          variable: false,
          quality: 1,
          what: 'aria-hidden attribute has the value false'
        },
        aria_hidden_false: {
          variable: false,
          quality: 1,
          what: 'aria-hidden attribute has the value false'
        }
      }
    }
  },
  negativeIndent: {
    summary: 'negative text-indent',
    why: 'Helper may hide content from a user',
    wcag: '4.1',
    weight: 3,
    tools: {
      aslint: {
        incorrect_technique_for_hiding_content: {
          variable: false,
          quality: 1,
          what: 'Element has a text-indent style with a negative value'
        }
      }
    }
  },
  frameSandboxRisk: {
    summary: 'iframe sandbox attributes risky',
    why: 'Document may be unsafe to use',
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
  hoverIndication: {
    summary: 'hover indication poor',
    why: 'User cannot explore the document reliably with a mouse',
    wcag: '3.3.2',
    weight: 3,
    tools: {
      testaro: {
        hovInd: {
          variable: false,
          quality: 1,
          what: 'Hovering is unclearly indicated'
        }
      }
    }
  },
  hoverSurprise: {
    summary: 'hovering changes content',
    why: 'User cannot explore the document reliably with a mouse',
    wcag: '3.2.5',
    weight: 1,
    tools: {
      testaro: {
        hover: {
          variable: false,
          quality: 1,
          what: 'Hovering changes the page content'
        }
      }
    }
  },
  labelClash: {
    summary: 'label types incompatible',
    why: 'User cannot get reliable help on the topics of form items',
    wcag: '1.3.1',
    weight: 2,
    tools: {
      testaro: {
        labClash: {
          variable: false,
          quality: 1,
          what: 'Incompatible label types'
        }
      }
    }
  },
  labelNot1: {
    summary: 'element referenced by multiple labels',
    why: 'User cannot get reliable help on the topics of form items',
    wcag: '1.3.1',
    weight: 1,
    tools: {
      aslint: {
        duplicated_for_attribute: {
          variable: false,
          quality: 1,
          what: 'More than 1 label element has the same for attribute'
        },
        missing_labelM: {
          variable: false,
          quality: 1,
          what: 'More than 1 label element refers to the element'
        }
      },
      axe: {
        'form-field-multiple-labels': {
          variable: false,
          quality: 1,
          what: 'Form field has multiple label elements'
        }
      },
      ibm: {
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
    summary: 'label empty',
    why: 'User cannot get help on the topics of form items',
    wcag: '1.3.1',
    weight: 3,
    tools: {
      aslint: {
        empty_label_element: {
          variable: false,
          quality: 1,
          what: 'Element has no content'
        },
        label_implicitly_associatedW: {
          variable: false,
          quality: 1,
          what: 'Element has no labeling content except whitespace'
        },
        aria_labelledby_association_empty_element: {
          variable: false,
          quality: 1,
          what: 'Referenced label has no content'
        }
      },
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
  labelRisk: {
    summary: 'labeling risky',
    why: 'User may misunderstand a form control',
    wcag: '3.3.2',
    weight: 1,
    tools: {
      aslint: {
        missing_label: {
          variable: false,
          quality: 1,
          what: 'Element has no explicit label and may have no other accessible name'
        },
        missing_labelI: {
          variable: false,
          quality: 1,
          what: 'Element has no id attribute for an explicit label to reference'
        },
        missing_labelN: {
          variable: false,
          quality: 1,
          what: 'Element has an id attribute but no explicit label references it'
        }
      }
    }
  },
  linkVaguenessRisk: {
    summary: 'link name vague',
    why: 'User may misunderstand what a link points to',
    wcag: '2.4.4',
    weight: 1,
    tools: {
      aslint: {
        link_with_unclear_purpose: {
          variable: false,
          quality: 1,
          what: 'Element is a link but has vague or generic content'
        }
      },
      ed11y: {
        linkTextIsGeneric: {
          variable: false,
          quality: 1,
          what: 'Element is a link but has generic content'
        }
      },
      wave: {
        link_suspicious: {
          variable: false,
          quality: 1,
          what: 'Suspicious link text'
        }
      }
    }
  },
  linkFileName: {
    summary: 'link names a file instead of a purpose',
    why: 'User may fail to understand what a link points to',
    wcag: '2.4.4',
    weight: 1,
    tools: {
      ed11y: {
        linkTextIsURL: {
          variable: false,
          quality: 1,
          what: 'Name of the element is a file reference instead of a link purpose'
        }
      }
    }
  },
  nonWebLink: {
    summary: 'link to non-web resource',
    why: 'Document points to harder-to-use resources',
    wcag: '1.3.3',
    weight: 1,
    tools: {
      testaro: {
        imageLink: {
          variable: false,
          quality: 1,
          what: 'Element has an href attribute set to an image file reference'
        }
      },
      ed11y: {
        linkDocument: {
          variable: false,
          quality: 1,
          what: 'Element links to a PDF, Word, PowerPoint, or Google Docs document'
        }
      },
      wave: {
        link_excel: {
          variable: false,
          quality: 1,
          what: 'Link to Microsoft Excel workbook'
        },
        link_pdf: {
          variable: false,
          quality: 1,
          what: 'Link to PDF document'
        },
        link_word: {
          variable: false,
          quality: 1,
          what: 'Link to Microsoft Word document'
        }
      }
    }
  },
  linkIndication: {
    summary: 'link indication poor',
    why: 'User cannot differentiate a link from plain text',
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
      aslint: {
        links_not_visually_evident_without_color_vision: {
          variable: false,
          quality: 1,
          what: 'Element is a link, but its style properties do not differentiate it from its parent'
        }
      },
      axe: {
        'link-in-text-block': {
          variable: false,
          quality: 1,
          what: 'Element is not distinct from surrounding text without reliance on color'
        }
      },
      testaro: {
        linkUl: {
          variable: false,
          quality: 1,
          what: 'Inline links are not underlined'
        }
      }
    }
  },
  menuNavigation: {
    summary: 'menu navigation nonstandard',
    why: 'Menus behave improperly for a keyboard-only user',
    wcag: '2.1.1',
    weight: 2,
    tools: {
      testaro: {
        buttonMenu: {
          variable: false,
          quality: 1,
          what: 'Menu buttons and menus behave nonstandardly'
        }
      }
    }
  },
  menuItemless: {
    summary: 'menu items missing',
    why: 'User cannot reach promised menu items',
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
    summary: 'tablist navigation nonstandard',
    why: 'Tablist items behave improperly for a keyboard-only user',
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
  spontaneousMotion: {
    summary: 'page content moves spontaneously',
    why: 'Motion-sensitive user may suffer harm',
    wcag: '2.2.2',
    weight: 2,
    max: 1,
    tools: {
      aslint: {
        animationM: {
          variable: false,
          quality: 1,
          what: 'Animation may fail to give user a pause, stop, or hide mechanism'
        }
      },
      testaro: {
        motion: {
          variable: false,
          quality: 1,
          what: 'Change of visible content not requested by user'
        }
      }
    }
  },
  animationLong: {
    summary: 'animation long or repetitive',
    why: 'Motion-sensitive user may suffer harm',
    wcag: '2.2.2',
    weight: 3,
    tools: {
      aslint: {
        animationD: {
          variable: false,
          quality: 1,
          what: 'Animation lasts more than 5 seconds'
        },
        animationI: {
          variable: false,
          quality: 1,
          what: 'Animation is repetitive'
        }
      }
    }
  },
  blink: {
    summary: 'blink element',
    why: 'Motion-sensitive user may suffer harm',
    wcag: '2.2.2',
    weight: 4,
    tools: {
      aslint: {
        blink_element: {
          variable: false,
          quality: 1,
          what: 'Element is blink'
        }
      },
      qualWeb: {
        'QW-WCAG-T13': {
          variable: false,
          quality: 1,
          what: 'Element is blink'
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
    summary: 'autoplay',
    why: 'Motion- or noise-sensitive user may suffer harm',
    wcag: '1.4.2',
    weight: 2,
    tools: {
      aslint: {
        autoplay_audio_video: {
          variable: false,
          quality: 1,
          what: 'Element plays automatically'
        }
      },
      axe: {
        'no-autoplay-audio': {
          variable: false,
          quality: 1,
          what: 'Element plays automatically'
        }
      },
      qualWeb: {
        'QW-ACT-R15': {
          variable: false,
          quality: 1,
          what: 'Element has audio that plays automatically'
        }
      }
    }
  },
  autoplayLong: {
    summary: 'autoplay long',
    why: 'Motion- or noise-sensitive user may suffer harm',
    wcag: '1.4.2',
    weight: 2,
    tools: {
      qualWeb: {
        'QW-ACT-R49': {
          variable: false,
          quality: 1,
          what: 'Element that plays automatically has audio lasting more than 3 seconds'
        }
      }
    }
  },
  autoplayControl: {
    summary: 'autoplay control',
    why: 'Motion- or noise-sensitive user may suffer harm',
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
    summary: 'element reloads or redirects',
    why: 'Document change may surprise a user',
    wcag: '2.2.1',
    weight: 3,
    tools: {
      aslint: {
        no_meta_http_equiv_refresh: {
          variable: false,
          quality: 1,
          what: 'Element forces a page reload'
        }
      },
      qualWeb: {
        'QW-ACT-R4': {
          variable: false,
          quality: 1,
          what: 'Element refreshes or redirects with delay'
        },
        'QW-ACT-R71': {
          variable: false,
          quality: 1,
          what: 'Element has a refresh delay (no exception)'
        }
      }
    }
  },
  parentBad: {
    summary: 'parent invalid',
    why: 'User cannot properly operate an item',
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
    summary: 'inconsistent heading, link, or button styles',
    why: 'User cannot easily distinguish items of different types',
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
    summary: 'filter style',
    why: 'Item is too distorted for understandability',
    wcag: '4.1',
    weight: 1,
    tools: {
      testaro: {
        filter: {
          variable: false,
          quality: 1,
          what: 'Element styles include filter'
        }
      }
    }
  },
  zIndexNotZero: {
    summary: 'z-index not zero',
    why: 'User cannot predict the effect of clicking',
    wcag: '1.4',
    weight: 1,
    tools: {
      testaro: {
        zIndex: {
          variable: false,
          quality: 1,
          what: 'Element has a nondefault z-index value'
        }
      }
    }
  },
  tabIndexPositive: {
    summary: 'tabindex positive',
    why: 'Keyboard-only user cannot predict the navigation sequence',
    wcag: '2.4.3',
    weight: 1,
    tools: {
      aslint: {
        positive_tabindex: {
          variable: false,
          quality: 1,
          what: 'Element has a positive tabIndex value'
        }
      },
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
  tabIndexEmpty: {
    summary: 'tabindex empty',
    why: 'Keyboard-only user cannot follow the intended navigation sequence',
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
  tabIndexInt: {
    summary: 'tabindex not integer',
    why: 'Keyboard-only user cannot follow the intended navigation sequence',
    wcag: '1.3.1',
    weight: 4,
    tools: {
      aslint: {
        accessible_svgT: {
          variable: true,
          quality: 1,
          what: 'Element has a non-integer tabindex attribute'
        }
      }
    }
  },
  tabIndexExtra: {
    summary: 'tabindex redundant',
    why: 'Revision risks interfering with navigation by a keyboard-only user',
    wcag: '1.3.1',
    weight: 1,
    tools: {
      aslint: {
        misused_tabindex_attribute: {
          variable: true,
          quality: 1,
          what: 'Element has an implicit tabIndex value 0, but also has a tabindex attribute'
        }
      }
    }
  },
  avNoText: {
    summary: 'audio or video caption track missing',
    why: 'User cannot get help reading speech as text',
    wcag: '1.2.1',
    weight: 4,
    tools: {
      aslint: {
        audio_video_captions: {
          variable: false,
          quality: 1,
          what: 'Element is audio or video but contains no caption track element'
        }
      }
    }
  },
  audioNoText: {
    summary: 'audio track missing',
    why: 'User cannot get help reading speech as text',
    wcag: '1.2.1',
    weight: 4,
    tools: {
      aslint: {
        audio_alternativeT: {
          variable: false,
          quality: 1,
          what: 'Element contains no track element'
        }
      },
      axe: {
        'audio-caption': {
          variable: false,
          quality: 1,
          what: 'Element has no captions track'
        }
      },
      qualWeb: {
        'QW-ACT-R26': {
          variable: false,
          quality: 1,
          what: 'Auditory content of the element has no accessible alternative'
        },
        'QW-ACT-R29': {
          variable: false,
          quality: 1,
          what: 'Content of the element has no text alternative'
        },
        'QW-ACT-R58': {
          variable: false,
          quality: 1,
          what: 'Content of the element has no transcript'
        },
        'QW-ACT-R59': {
          variable: false,
          quality: 1,
          what: 'Element content is not a media alternative for text'
        },
        'QW-ACT-R60': {
          variable: false,
          quality: 1,
          what: 'Auditory content of the element has no captions'
        }
      }
    }
  },
  audioTextRisk: {
    summary: 'audio possibly not named',
    why: 'User may be unable to get help reading speech as text',
    wcag: '1.2.1',
    weight: 1,
    tools: {
      aslint: {
        audio_alternativeA: {
          variable: false,
          quality: 1,
          what: 'Referenced description or another text alternative may be missing'
        }
      }
    }
  },
  videoNoText: {
    summary: 'video not named',
    why: 'User cannot get help reading video content as text',
    wcag: '1.2.2',
    weight: 4,
    tools: {
      axe: {
        'video-caption': {
          variable: false,
          quality: 1,
          what: 'Element has no captions'
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
  videoNoTranscript: {
    summary: 'video transcript missing',
    why: 'User cannot get help reading video content as text',
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
    summary: 'audio or video alternatives possibly missing',
    why: 'User may be unable to get help reading video content as text',
    wcag: '1.2.2',
    weight: 1,
    tools: {
      wave: {
        html5_video_audio: {
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
    summary: 'video audio description missing',
    why: 'User cannot get help hearing video content as speech',
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
    summary: 'video audio track missing',
    why: 'User cannot get help hearing video content as speech',
    wcag: '1.2.1',
    weight: 4,
    tools: {
      qualWeb: {
        'QW-ACT-R54': {
          variable: false,
          quality: 1,
          what: 'Visual-only content of the element has no audio track alternative'
        }
      }
    }
  },
  videoAlternative: {
    summary: 'video alternative missing',
    why: 'User cannot get help consuming a video recording as text or speech',
    wcag: '1.2.1',
    weight: 4,
    tools: {
      aslint: {
        video_audio_descriptions: {
          variable: false,
          quality: 1,
          what: 'Element has neither an audio source nor a description track'
        }
      }
    }
  },
  keyboardScroll: {
    summary: 'element not scrollable',
    why: 'Keyboard-only user cannot scroll an item',
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
  positionSticky: {
    summary: 'position sticky',
    why: 'User may be unable to see needed content or may be forced to scroll in both dimensions',
    wcag: '1.4.10',
    weight: 1,
    tools: {
      aslint: {
        position_sticky: {
          variable: false,
          quality: 1,
          what: 'Element has a sticky position'
        }
      },
      htmlcs: {
        'AAA.1_4_10.C32,C31,C33,C38,SCR34,G206': {
          variable: false,
          quality: 1,
          what: 'Fixed-position element may force bidirectional scrolling'
        }
      }
    }
  },
  scrollFocus: {
    summary: 'scrollable element and its children not focusable',
    why: 'User may be unable to see all of an item without scrolling in both dimensions',
    wcag: '2.1.1',
    weight: 3,
    tools: {
      ibm: {
        element_scrollable_tabbable: {
          variable: false,
          quality: 1,
          what: 'Element and its children are not focusable, but the element is scrollable'
        }
      }
    }
  },
  scrollRisk: {
    summary: 'container size unit not percentage',
    why: 'User may be unable to see all of an item without scrolling in both dimensions',
    wcag: '1.4.10',
    weight: 1,
    tools: {
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
    summary: 'skip method missing or invalid',
    why: 'Keyboard-only user cannot easily reach the specific content of the document',
    wcag: '2.4.1',
    weight: 3,
    max: 2,
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
        skip_main_exists: {
          variable: false,
          quality: 0.5,
          what: 'Page provides no way to quickly navigate to the main content'
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
    summary: 'skip method possibly missing or invalid',
    why: 'Keyboard-only user may be unable easily to reach the specific content of the document',
    wcag: '2.4.1',
    weight: 1,
    max: 2,
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
        }
      }
    }
  },
  submitButton: {
    summary: 'form submission button missing',
    why: 'User cannot easily submit a form',
    wcag: '3.2.2',
    weight: 3,
    tools: {
      aslint: {
        missing_submit_button: {
          variable: false,
          quality: 1,
          what: 'Element is a form but contains no input or button element for submission'
        }
      },
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
    summary: 'assertive region not atomic',
    why: 'User may be unable to get help on what content has changed',
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
    summary: 'error reference invalid',
    why: 'User cannot correct a form error',
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
    summary: 'noscript element possibly not equivalent',
    why: 'User who has disabled JavaScript may be denied some content',
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
  flash: {
    summary: 'flash content',
    why: 'Document includes code that may not work and may jeopardize user security',
    wcag: '4.1',
    weight: 1,
    max: 1,
    tools: {
      aslint: {
        flash_content: {
          variable: false,
          quality: 1,
          what: 'Document contains Adobe Flash content'
        }
      },
      wave: {
        flash: {
          variable: false,
          quality: 1,
          what: 'Flash content is present'
        }
      }
    }
  },
  browserSupportRisk: {
    summary: 'inputmode attribute',
    why: 'Document may include code that the browser cannot process',
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
  attributeObsolete: {
    summary: 'attribute obsolete',
    why: 'Document includes obsolete code that the browser may fail to process',
    wcag: '4.1',
    weight: 3,
    tools: {
      aslint: {
        obsolete_html_attributes: {
          variable: false,
          quality: 1,
          what: 'Element has an obsolete attribute'
        }
      },
      htmlcs: {
        'AAA.1_3_1.H49.AlignAttr': {
          variable: false,
          quality: 1,
          what: 'align attribute is obsolete'
        },
        'AAA.1_3_1.H63.2': {
          variable: false,
          quality: 1,
          what: 'scope attribute on a td element, instead of a th element, is obsolete'
        }
      },
      ibm: {
        aria_attribute_deprecated: {
          variable: false,
          quality: 1,
          what: 'ARIA role or attribute is deprecated'
        }
      },
      nuVal: {
        'The border attribute is obsolete. Consider specifying img { border: 0; } in CSS instead.': {
          variable: false,
          quality: 1,
          what: 'border element is obsolete'
        },
        '^The .+ attribute on the .+ element is obsolete.*$': {
          variable: true,
          quality: 1,
          what: 'Attribute is obsolete on its element'
        },
        'The only allowed value for the charset attribute for the script element is utf-8. (But the attribute is not needed and should be omitted altogether.)': {
          variable: false,
          quality: 1,
          what: 'charset attribute has a value other than utf-8 and is unnecessary'
        },
        'The name attribute is obsolete. Consider putting an id attribute on the nearest container instead.': {
          variable: false,
          quality: 1,
          what: 'name attribute is obsolete'
        },
        '^Potentially bad value .+ for attribute .+ on element .+: The language subtag .+ is deprecated.*$': {
          variable: true,
          quality: 1,
          what: 'Attribute value is a deprecated language subtag'
        }
      },
      testaro: {
        linkOldAtt: {
          variable: false,
          quality: 1,
          what: 'Element has a deprecated attribute'
        }
      },
      wave: {
        longdesc: {
          variable: false,
          quality: 1,
          what: 'longdesc attribute is obsolete'
        }
      }
    }
  },
  elementObsolete: {
    summary: 'element obsolete',
    why: 'Document includes obsolete code that the browser may fail to process',
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
      aslint: {
        obsolete_html_elements: {
          variable: false,
          quality: 1,
          what: 'Element is obsolete'
        },
        audio_alternativeB: {
          variable: false,
          quality: 1,
          what: 'Element is obsolete and inferior to an audio element'
        }
      },
      htmlcs: {
        'AAA.1_3_1.H49.Center': {
          variable: false,
          quality: 1,
          what: 'center element is obsolete'
        },
        'AAA.1_3_1.H49.Font': {
          variable: false,
          quality: 1,
          what: 'font element is obsolete'
        }
      },
      nuVal: {
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
        'Using the meta element to specify the document-wide default language is obsolete. Consider specifying the language on the root element instead.': {
          variable: false,
          quality: 1,
          what: 'Language declaration in a meta element is obsolete'
        }
      },
      qualWeb: {
        'QW-BP10': {
          variable: false,
          quality: 1,
          what: 'HTML element is used to control the visual presentation of content'
        }
      }
    }
  },
  obsolete: {
    summary: 'code obsolete',
    why: 'Document contains code that is no longer standard',
    wcag: '4.1',
    weight: 3,
    tools: {
      ibm: {
        combobox_design_valid: {
          variable: false,
          quality: 1,
          what: 'combobox design pattern is ARIA 1.1, not allowed by ARIA 1.2'
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
        'Legacy doctype. Expected <!DOCTYPE html>.': {
          variable: false,
          quality: 1,
          what: 'doctype is obsolete'
        },
        'Obsolete doctype. Expected <!DOCTYPE html>.': {
          variable: false,
          quality: 1,
          what: 'DOCTYPE is obsolete instead of html'
        },
        '^CSS: Deprecated media feature .+$': {
          variable: true,
          quality: 1,
          what: 'Media feature is deprecated'
        }
      }
    }
  },
  cssInvalid: {
    summary: 'CSS invalid',
    why: 'Document cannot be properly displayed',
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
        '^CSS: column-count: .+ is not valid, only values greater than 0 allowed.*$': {
          variable: true,
          quality: 1,
          what: 'CSS column-count property has a nonpositive value'
        },
        'CSS: font-size: One operand must be a number.': {
          variable: false,
          quality: 1,
          what: 'CSS font-size property has no numeric operand'
        },
        '^CSS: font-weight: .+ is not valid, only values greater than or equal to 1.0 are allowed.*$': {
          variable: true,
          quality: 1,
          what: 'CSS font-weight property has a value smaller than 1'
        },
        '^CSS: font-weight: .+ is not valid, only values lower than or equal to 1000.0 are allowed.*$': {
          variable: true,
          quality: 1,
          what: 'CSS font-weight property has a value greater than 1000'
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
        '^CSS: .*only 0 can be a unit. You must put a unit after your number.*$': {
          variable: true,
          quality: 1,
          what: 'Number in CSS is nonzero but has no unit'
        },
        'CSS: Parse Error.': {
          variable: false,
          quality: 1,
          what: 'Invalid CSS'
        },
        '^CSS: .+: Too many values or values are not recognized.*$': {
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
        'CSS: @import are not allowed after any valid statement other than @charset and @import.': {
          variable: false,
          quality: 1,
          what: 'CSS @import at-rule is after an at-rule other than @charset or @import'
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
    summary: 'element closure invalid',
    why: 'Document contains invalid code',
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
    summary: 'nesting invalid',
    why: 'Document contains invalid code',
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
  characterBad: {
    summary: 'invalid character',
    why: 'Invalid character makes the document behave incorrectly',
    wcag: '4.1',
    weight: 3,
    tools: {
      nuVal: {
        '^Bad value [^\ufffd]+ Tab, new line or carriage return found.*$': {
          variable: true,
          quality: 1,
          what: 'Attribute value contains an illegal spacing character'
        },
        '^Bad character . after <. Probable cause: Unescaped <. Try escaping it as &lt;.*$': {
          variable: true,
          quality: 1,
          what: 'Left angle bracket is followed by an invalid character'
        },
        '^Saw .+ when expecting an attribute name. Probable cause: (?:.+ missing|Missing .+) immediately before.*$': {
          variable: true,
          quality: 1,
          what: 'Invalid character appears where an attribute name must appear'
        },
        '^Bad element name .*: Code point .* is not allowed*$': {
          variable: true,
          quality: 1,
          what: 'Element name contains an invalid character'
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
        'Non-space character inside noscript inside head.': {
          variable: false,
          quality: 1,
          what: 'noscript element inside the head element has a nonspace text-node child'
        },
        '^.+ in an unquoted attribute value. Probable causes: Attributes running together or a URL query string in an unquoted attribute value.*$': {
          variable: true,
          quality: 1,
          what: 'Attribute has a value containing invalid punctuation'
        },
        'A numeric character reference expanded to carriage return.': {
          variable: false,
          quality: 1,
          what: 'Numeric character entity represents a carriage return'
        }
      }
    }
  },
  textContentBad: {
    summary: 'element text content invalid',
    why: 'User may be unable to read all the document text',
    wcag: '4.1',
    weight: 3,
    tools: {
      nuVal: {
        '^The text content of element .+ was not in the required format: Expected .+ but found .+ instead.*$': {
          variable: true,
          quality: 1,
          what: 'Element has text content with invalid format'
        },
        'The text content of element time was not in the required format: The literal did not satisfy the time-datetime format.': {
          variable: false,
          quality: 1,
          what: 'time element has text content that is not in the time-datetime format'
        }
      }
    }
  },
  parseError: {
    summary: 'code invalid',
    why: 'Invalid code in the document may prevent a helper from working',
    wcag: '4.1',
    weight: 3,
    tools: {
      nuVal: {
        '^End tag .+ did not match the name of the current open element (.+).*$': {
          variable: true,
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
        'Saw <?. Probable cause: Attempt to use an XML processing instruction in HTML. (XML processing instructions are not supported in HTML.)': {
          variable: false,
          quality: 1,
          what: 'Left angle bracket is followed by a question mark'
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
        'The document is not mappable to XML 1.0 due to two consecutive hyphens in a comment.': {
          variable: false,
          quality: 1,
          what: 'Comment contains --'
        },
        'The document is not mappable to XML 1.0 due to a trailing hyphen in a comment.': {
          variable: false,
          quality: 1,
          what: 'Comment ends with -'
        },
        'Bogus comment.': {
          variable: false,
          quality: 1,
          what: 'Comment is missing a valid termination'
        },
        '^Element name .+ cannot be represented as XML 1\\.0.*$': {
          variable: true,
          quality: 1,
          what: 'Invalid element name'
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
        '^Text not allowed in element .+ in this context.*$': {
          variable: true,
          quality: 1,
          what: 'Element contains text, which is not allowed here'
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
        'Element script must not have attribute charset unless attribute src is also specified.': {
          variable: false,
          quality: 1,
          what: 'script element has a charset attribute but no src attribute'
        },
        '^java.util.concurrent.TimeoutException: Idle timeout expired: .+ ms.*$': {
          variable: true,
          quality: 1,
          what: 'Idle timeout expired'
        },
        'style element between head and body.': {
          variable: false,
          quality: 1,
          what: 'style element exists between the head and the body elements'
        },
        '^HTML start tag .+ in a foreign namespace context.*$': {
          variable: true,
          quality: 1,
          what: 'Element is invalid because its namespace is not HTML'
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
      }
    }
  },
  slashParseRisk: {
    summary: 'void element has trailing slash',
    why: 'Document contains invalid code',
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
  encodingMisdeclared: {
    summary: 'text not Unicode-compliant',
    why: 'User cannot read all of the text',
    wcag: '3.1.3',
    weight: 4,
    max: 1,
    tools: {
      nuVal: {
        '^Internal encoding declaration .+ disagrees with the actual encoding of the document.*$': {
          variable: true,
          quality: 1,
          what: 'Encoding declaration disagrees with the actual encoding of the page'
        }
      }
    }
  },
  encodingBad: {
    summary: 'text not Unicode-compliant',
    why: 'User cannot read all of the text',
    wcag: '3.1.3',
    weight: 4,
    tools: {
      nuVal: {
        'Text run is not in Unicode Normalization Form C.': {
          variable: false,
          quality: 1,
          what: 'Text run is not in Unicode Normalization Form C.'
        },
        '^The value of attribute .+ on element .+ from namespace .+ is not in Unicode Normalization Form C.*$': {
          variable: true,
          quality: 1,
          what: 'Value of attribute is not in Unicode Normalization Form C.'
        },
        '^Forbidden code point U+.*$': {
          variable: true,
          quality: 1,
          what: 'Invalid Unicode code point'
        }
      }
    }
  },
  encodingPrivate: {
    summary: 'text in Private Use Area',
    why: 'User cannot read all of the text',
    wcag: '3.1.3',
    weight: 4,
    max: 1,
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
  captcha2: {
    summary: 'captcha2',
    why: 'User is prevented from consuming the document',
    wcag: '1.1.1',
    weight: 1,
    max: 1,
    tools: {
      aslint: {
        captcha_google: {
          variable: false,
          quality: 1,
          what: 'Document employs Google CAPTCHA version 2'
        }
      }
    }
  },
  fatalError: {
    summary: 'fatal error',
    why: 'Document prevents testing for accessibility',
    wcag: '4.1',
    weight: 4,
    max: 1,
    tools: {
      nuVal: {
        'Cannot recover after last error. Any further errors will be ignored.': {
          variable: false,
          quality: 1,
          what: 'Testing was interrupted by a fatal error'
        },
        'Oops. That was not supposed to happen. A bug manifested itself in the application internals. Unable to continue. Sorry. The admin was notified.': {
          variable: false,
          quality: 1,
          what: 'Testing was interrupted by a fatal application-internal error'
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
    summary: 'item makes testing inconclusive',
    why: 'Item prevents a conclusive accessibility test',
    wcag: '4.1',
    weight: 1,
    tools: {
      alfa: {
        cantTell: {
          variable: false,
          quality: 1,
          what: 'Test could not give a conclusive result'
        }
      }
    }
  },
  svgNotValidatable: {
    summary: 'SVG version not 1.1',
    why: 'Item prevents testing image for accessibility',
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
