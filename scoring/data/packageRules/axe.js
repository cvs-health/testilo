const rules = {
  accesskeys: {
    description: 'Ensures every accesskey attribute value is unique',
    help: 'accesskey attribute value should be unique'
  },
  'area-alt': {
    description: 'Ensures <area> elements of image maps have alternate text',
    help: 'Active <area> elements must have alternate text'
  },
  'aria-allowed-attr': {
    description: 'Ensures ARIA attributes are allowed for an element\'s role',
    help: 'Elements must only use allowed ARIA attributes'
  },
  'aria-allowed-role': {
    description: 'Ensures role attribute has an appropriate value for the element',
    help: 'ARIA role should be appropriate for the element'
  },
  'aria-command-name': {
    description: 'Ensures every ARIA button, link and menuitem has an accessible name',
    help: 'ARIA commands must have an accessible name'
  },
  'aria-dialog-name': {
    description: 'Ensures every ARIA dialog and alertdialog node has an accessible name',
    help: 'ARIA dialog and alertdialog nodes should have an accessible name'
  },
  'aria-hidden-body': {
    description: 'Ensures aria-hidden=\'true\' is not present on the document body.',
    help: 'aria-hidden=\'true\' must not be present on the document body'
  },
  'aria-hidden-focus': {
    description: 'Ensures aria-hidden elements are not focusable nor contain focusable elements',
    help: 'ARIA hidden element must not be focusable or contain focusable elements'
  },
  'aria-input-field-name': {
    description: 'Ensures every ARIA input field has an accessible name',
    help: 'ARIA input fields must have an accessible name'
  },
  'aria-meter-name': {
    description: 'Ensures every ARIA meter node has an accessible name',
    help: 'ARIA meter nodes must have an accessible name'
  },
  'aria-progressbar-name': {
    description: 'Ensures every ARIA progressbar node has an accessible name',
    help: 'ARIA progressbar nodes must have an accessible name'
  },
  'aria-required-attr': {
    description: 'Ensures elements with ARIA roles have all required ARIA attributes',
    help: 'Required ARIA attributes must be provided'
  },
  'aria-required-children': {
    description: 'Ensures elements with an ARIA role that require child roles contain them',
    help: 'Certain ARIA roles must contain particular children'
  },
  'aria-required-parent': {
    description: 'Ensures elements with an ARIA role that require parent roles are contained by them',
    help: 'Certain ARIA roles must be contained by particular parents'
  },
  'aria-roledescription': {
    description: 'Ensure aria-roledescription is only used on elements with an implicit or explicit role',
    help: 'aria-roledescription must be on elements with a semantic role'
  },
  'aria-roles': {
    description: 'Ensures all elements with a role attribute use a valid value',
    help: 'ARIA roles used must conform to valid values'
  },
  'aria-text': {
    description: 'Ensures "role=text" is used on elements with no focusable descendants',
    help: '"role=text" should have no focusable descendants'
  },
  'aria-toggle-field-name': {
    description: 'Ensures every ARIA toggle field has an accessible name',
    help: 'ARIA toggle fields must have an accessible name'
  },
  'aria-tooltip-name': {
    description: 'Ensures every ARIA tooltip node has an accessible name',
    help: 'ARIA tooltip nodes must have an accessible name'
  },
  'aria-treeitem-name': {
    description: 'Ensures every ARIA treeitem node has an accessible name',
    help: 'ARIA treeitem nodes should have an accessible name'
  },
  'aria-valid-attr-value': {
    description: 'Ensures all ARIA attributes have valid values',
    help: 'ARIA attributes must conform to valid values'
  },
  'aria-valid-attr': {
    description: 'Ensures attributes that begin with aria- are valid ARIA attributes',
    help: 'ARIA attributes must conform to valid names'
  },
  'audio-caption': {
    description: 'Ensures <audio> elements have captions',
    help: '<audio> elements must have a captions track'
  },
  'autocomplete-valid': {
    description: 'Ensure the autocomplete attribute is correct and suitable for the form field',
    help: 'autocomplete attribute must be used correctly'
  },
  'avoid-inline-spacing': {
    description: 'Ensure that text spacing set through style attributes can be adjusted with custom stylesheets',
    help: 'Inline text spacing must be adjustable with custom stylesheets'
  },
  blink: {
    description: 'Ensures <blink> elements are not used',
    help: '<blink> elements are deprecated and must not be used'
  },
  'button-name': {
    description: 'Ensures buttons have discernible text',
    help: 'Buttons must have discernible text'
  },
  bypass: {
    description: 'Ensures each page has at least one mechanism for a user to bypass navigation and jump straight to the content',
    help: 'Page must have means to bypass repeated blocks'
  },
  'color-contrast-enhanced': {
    description: 'Ensures the contrast between foreground and background colors meets WCAG 2 AAA contrast ratio thresholds',
    help: 'Elements must have sufficient color contrast'
  },
  'color-contrast': {
    description: 'Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds',
    help: 'Elements must have sufficient color contrast'
  },
  'css-orientation-lock': {
    description: 'Ensures content is not locked to any specific display orientation, and the content is operable in all display orientations',
    help: 'CSS Media queries must not lock display orientation'
  },
  'definition-list': {
    description: 'Ensures <dl> elements are structured correctly',
    help: '<dl> elements must only directly contain properly-ordered <dt> and <dd> groups, <script>, <template> or <div> elements'
  },
  dlitem: {
    description: 'Ensures <dt> and <dd> elements are contained by a <dl>',
    help: '<dt> and <dd> elements must be contained by a <dl>'
  },
  'document-title': {
    description: 'Ensures each HTML document contains a non-empty <title> element',
    help: 'Documents must have <title> element to aid in navigation'
  },
  'duplicate-id-active': {
    description: 'Ensures every id attribute value of active elements is unique',
    help: 'IDs of active elements must be unique'
  },
  'duplicate-id-aria': {
    description: 'Ensures every id attribute value used in ARIA and in labels is unique',
    help: 'IDs used in ARIA and labels must be unique'
  },
  'duplicate-id': {
    description: 'Ensures every id attribute value is unique',
    help: 'id attribute value must be unique'
  },
  'empty-heading': {
    description: 'Ensures headings have discernible text',
    help: 'Headings should not be empty'
  },
  'empty-table-header': {
    description: 'Ensures table headers have discernible text',
    help: 'Table header text must not be empty'
  },
  'focus-order-semantics': {
    description: 'Ensures elements in the focus order have a role appropriate for interactive content',
    help: 'Elements in the focus order should have an appropriate role'
  },
  'form-field-multiple-labels': {
    description: 'Ensures form field does not have multiple label elements',
    help: 'Form field must not have multiple label elements'
  },
  'frame-focusable-content': {
    description: 'Ensures <frame> and <iframe> elements with focusable content do not have tabindex=-1',
    help: 'Frames with focusable content must not have tabindex=-1'
  },
  'frame-tested': {
    description: 'Ensures <iframe> and <frame> elements contain the axe-core script',
    help: 'Frames should be tested with axe-core'
  },
  'frame-title-unique': {
    description: 'Ensures <iframe> and <frame> elements contain a unique title attribute',
    help: 'Frames should have a unique title attribute'
  },
  'frame-title': {
    description: 'Ensures <iframe> and <frame> elements have an accessible name',
    help: 'Frames must have an accessible name'
  },
  'heading-order': {
    description: 'Ensures the order of headings is semantically correct',
    help: 'Heading levels should only increase by one'
  },
  'hidden-content': {
    description: 'Informs users about hidden content.',
    help: 'Hidden content on the page should be analyzed'
  },
  'html-has-lang': {
    description: 'Ensures every HTML document has a lang attribute',
    help: '<html> element must have a lang attribute'
  },
  'html-lang-valid': {
    description: 'Ensures the lang attribute of the <html> element has a valid value',
    help: '<html> element must have a valid value for the lang attribute'
  },
  'html-xml-lang-mismatch': {
    description: 'Ensure that HTML elements with both valid lang and xml:lang attributes agree on the base language of the page',
    help: 'HTML elements with lang and xml:lang must have the same base language'
  },
  'identical-links-same-purpose': {
    description: 'Ensure that links with the same accessible name serve a similar purpose',
    help: 'Links with the same name must have a similar purpose'
  },
  'image-alt': {
    description: 'Ensures <img> elements have alternate text or a role of none or presentation',
    help: 'Images must have alternate text'
  },
  'image-redundant-alt': {
    description: 'Ensure image alternative is not repeated as text',
    help: 'Alternative text of images should not be repeated as text'
  },
  'input-button-name': {
    description: 'Ensures input buttons have discernible text',
    help: 'Input buttons must have discernible text'
  },
  'input-image-alt': {
    description: 'Ensures <input type="image"> elements have alternate text',
    help: 'Image buttons must have alternate text'
  },
  'label-content-name-mismatch': {
    description: 'Ensures that elements labelled through their content must have their visible text as part of their accessible name',
    help: 'Elements must have their visible text as part of their accessible name'
  },
  'label-title-only': {
    description: 'Ensures that every form element has a visible label and is not solely labeled using hidden labels, or the title or aria-describedby attributes',
    help: 'Form elements should have a visible label'
  },
  label: {
    description: 'Ensures every form element has a label',
    help: 'Form elements must have labels'
  },
  'landmark-banner-is-top-level': {
    description: 'Ensures the banner landmark is at top level',
    help: 'Banner landmark should not be contained in another landmark'
  },
  'landmark-complementary-is-top-level': {
    description: 'Ensures the complementary landmark or aside is at top level',
    help: 'Aside should not be contained in another landmark'
  },
  'landmark-contentinfo-is-top-level': {
    description: 'Ensures the contentinfo landmark is at top level',
    help: 'Contentinfo landmark should not be contained in another landmark'
  },
  'landmark-main-is-top-level': {
    description: 'Ensures the main landmark is at top level',
    help: 'Main landmark should not be contained in another landmark'
  },
  'landmark-no-duplicate-banner': {
    description: 'Ensures the document has at most one banner landmark',
    help: 'Document should not have more than one banner landmark'
  },
  'landmark-no-duplicate-contentinfo': {
    description: 'Ensures the document has at most one contentinfo landmark',
    help: 'Document should not have more than one contentinfo landmark'
  },
  'landmark-no-duplicate-main': {
    description: 'Ensures the document has at most one main landmark',
    help: 'Document should not have more than one main landmark'
  },
  'landmark-one-main': {
    description: 'Ensures the document has a main landmark',
    help: 'Document should have one main landmark'
  },
  'landmark-unique': {
    help: 'Ensures landmarks are unique',
    description: 'Landmarks should have a unique role or role/label/title (i.e. accessible name) combination'
  },
  'link-in-text-block': {
    description: 'Ensure links are distinguished from surrounding text in a way that does not rely on color',
    help: 'Links must be distinguishable without relying on color'
  },
  'link-name': {
    description: 'Ensures links have discernible text',
    help: 'Links must have discernible text'
  },
  list: {
    description: 'Ensures that lists are structured correctly',
    help: '<ul> and <ol> must only directly contain <li>, <script> or <template> elements'
  },
  listitem: {
    description: 'Ensures <li> elements are used semantically',
    help: '<li> elements must be contained in a <ul> or <ol>'
  },
  marquee: {
    description: 'Ensures <marquee> elements are not used',
    help: '<marquee> elements are deprecated and must not be used'
  },
  'meta-refresh': {
    description: 'Ensures <meta http-equiv="refresh"> is not used',
    help: 'Timed refresh must not exist'
  },
  'meta-viewport-large': {
    description: 'Ensures <meta name="viewport"> can scale a significant amount',
    help: 'Users should be able to zoom and scale the text up to 500%'
  },
  'meta-viewport': {
    description: 'Ensures <meta name="viewport"> does not disable text scaling and zooming',
    help: 'Zooming and scaling should not be disabled'
  },
  'nested-interactive': {
    description: 'Ensures interactive controls are not nested as they are not always announced by screen readers or can cause focus problems for assistive technologies',
    help: 'Interactive controls must not be nested'
  },
  'no-autoplay-audio': {
    description: 'Ensures <video> or <audio> elements do not autoplay audio for more than 3 seconds without a control mechanism to stop or mute the audio',
    help: '<video> or <audio> elements must not play automatically'
  },
  'object-alt': {
    description: 'Ensures <object> elements have alternate text',
    help: '<object> elements must have alternate text'
  },
  'p-as-heading': {
    description: 'Ensure bold, italic text and font-size is not used to style <p> elements as a heading',
    help: 'Styled <p> elements must not be used as headings'
  },
  'page-has-heading-one': {
    description: 'Ensure that the page, or at least one of its frames contains a level-one heading',
    help: 'Page should contain a level-one heading'
  },
  'presentation-role-conflict': {
    description: 'Flags elements whose role is none or presentation and which cause the role conflict resolution to trigger.',
    help: 'Elements of role none or presentation should be flagged'
  },
  region: {
    description: 'Ensures all page content is contained by landmarks',
    help: 'All page content should be contained by landmarks'
  },
  'role-img-alt': {
    description: 'Ensures [role=\'img\'] elements have alternate text',
    help: '[role=\'img\'] elements must have an alternative text'
  },
  'scope-attr-valid': {
    description: 'Ensures the scope attribute is used correctly on tables',
    help: 'scope attribute should be used correctly'
  },
  'scrollable-region-focusable': {
    description: 'Ensure elements that have scrollable content are accessible by keyboard',
    help: 'Scrollable region must have keyboard access'
  },
  'select-name': {
    description: 'Ensures select element has an accessible name',
    help: 'Select element must have an accessible name'
  },
  'server-side-image-map': {
    description: 'Ensures that server-side image maps are not used',
    help: 'Server-side image maps must not be used'
  },
  'skip-link': {
    description: 'Ensure all skip links have a focusable target',
    help: 'The skip-link target should exist and be focusable'
  },
  'svg-img-alt': {
    description: 'Ensures <svg> elements with an img, graphics-document or graphics-symbol role have an accessible text',
    help: '<svg> elements with an img role must have an alternative text'
  },
  tabindex: {
    description: 'Ensures tabindex attribute values are not greater than 0',
    help: 'Elements should not have tabindex greater than zero'
  },
  'table-duplicate-name': {
    description: 'Ensure the <caption> element does not contain the same text as the summary attribute',
    help: 'tables should not have the same summary and caption'
  },
  'table-fake-caption': {
    description: 'Ensure that tables with a caption use the <caption> element.',
    help: 'Data or header cells must not be used to give caption to a data table.'
  },
  'td-has-header': {
    description: 'Ensure that each non-empty data cell in a <table> larger than 3 by 3  has one or more table headers',
    help: 'Non-empty <td> elements in larger <table> must have an associated table header'
  },
  'td-headers-attr': {
    description: 'Ensure that each cell in a table that uses the headers attribute refers only to other cells in that table',
    help: 'Table cells that use the headers attribute must only refer to cells in the same table'
  },
  'th-has-data-cells': {
    description: 'Ensure that <th> elements and elements with role=columnheader/rowheader have data cells they describe',
    help: 'Table headers in a data table must refer to data cells'
  },
  'valid-lang': {
    description: 'Ensures lang attributes have valid values',
    help: 'lang attribute must have a valid value'
  },
  'video-caption': {
    description: 'Ensures <video> elements have captions',
    help: '<video> elements must have captions'
  }
};
