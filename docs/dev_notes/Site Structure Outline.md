## Overview
The site is broken into theses sections, from the top of the site to the bottom:
1. Top Menu
2. Hero Section
3. Body Sections
4. Break Sections
5. Footer


## Key features:
- The UI is always perfectly functional and responsive on mobile and web. This means that every section must be designed such that it looks good in both cases.
- The 2. Hero Section and 3. Body Sections can all be opened as their own stand-alone pages. For example, given a Body Section about corn on www.examplesite.com, that body section can be viewed as a standalone page at www.examplesite.com/corn (for example).
- The Config Paradigm (CRITICAL) - All values, such as URLs, addresses, token lists, feature flags, thresholds, UI strings, must live in `config/*.ts` as exported const objects. Source files import and reference these values via variables. Never write a literal value directly in component or logic code. When adding a new value:
1. Add it to the appropriate config file
2. Export it
3. Import it at the usage site

## Below is a description of each of these section types.

### 1. Top Menu
The Top Menu contains key links and basic site navigation.


### 2. Hero Section
The Hero Section contains a compelling and exciting banner, which is potentially interactive. It should have cool designs and animations that look good. It also contains the most important copy for the reader to read, so that they understand the purpose of the business, and are interested in it.


### 3. Body Sections
The body sections are roughly the height of one's screen. They contain mixtures of images, diagrams, and copy that is important for the reader to read so they understand what the business does, and why it is great. They should get users interested. They should have cool designs and animations that look good.

### 4. Break Sections
The break sections are shorter than body sections, and work as breaks between body sections. Their designs and animations are overall less "heavy" than body sections. There will never be two consecutive break sections. Break sections cross the screen horizontally, and contain mixtures of images, diagrams, and copy that is important for the reader to read so they understand what the business does, and why it is great. They should get users interested. They should have cool designs and animations that look good. That said, the designs should be simpler patterns than body sections.

### 5. Footer

The footer section is a simple informational area that contains key links and other business information, such as the privacy policy. They should look nice, but have no animations or other special graphical effects.