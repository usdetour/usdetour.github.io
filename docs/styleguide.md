# Style Guide

Hypertext writing conventions for U.S. Detour.

## HTML

The HyperText Markup Language was originally specified by Tim Berners-Lee in 1993.
U.S. Detour currently consists of only a single web page, expressed in HTML: `index.html`.

### Elements

Elements are the fundamental pieces of hypertext documents (i.e. web pages).
Let's only use a limited subset of the standard elements in HTML5,
conveying semantics via attributes instead.

Elements are written in angle-brackets:

`<element></element>`

Specific elements are commonly referred to as "tags" (e.g. "the `a` tag"),
or more formally by the semantic element name (e.g. "the anchor element").

#### Blocks

Block-level elements are set apart on their own line.

##### p: Paragraph

The only block used.

TODO Since p tags can't be nested, switch to divs?

#### Inline

Inline elements are included on the same line.

#### a: Anchor

Hyperlinks, for referral to external or other internal pages,
and to specific sections within a page.

#### b: Basic

Inline (generally textual) content.

#### img: Image

Photos and icons.

### Attributes

Attributes are properties of elements: `<element attribute="value">`

* class: Semantic classification, recommended for all elements
* id: Unique name, only needed for linking to specific elements

### Entities

Entities are encodings of characters that are non-standard, or otherwise difficult/problematic to type directly.

* `&amp;`: Ampersand
* `&rsquo;`: Right single quote
* `&deg;`: Degrees
* `&frac12;`: One half
* `&frac13;`: One third

The ampersand needs to be given as `&amp;` because it's used for denoting entities;
all other characters that can be typed directly, should be (e.g. $, %, ^).

(Note: Apostrophes and quotes should be given as `&rsquo;` and `&rdquo;`/`&ldquo;`, respectively.)

### Unit Conventions

U.S. Detour is all-American, and sticks exclusively (and unabashedly) to our Standard Units. 
No i18n or metric system here.

* Weight: `lb` and `oz`
* Volume: `fl oz`, `cups`, `pints`, `quarts`, and `gallons` (TODO Could go entirely with `fl oz` or customary units)
* Distance: `'` (feet) and `''` (inches)
* Temperature: `&deg;` (degrees Fahrenheit)
* Power: `HP` (horsepower)

Wherever possible, fractions should be used over decimals (see fractical entities above).

### Colors

Coloration is applied by adding a color class.
Color class names can be found (and added to) in `styles/colors.css`

## CSS

The standard styling for `index.html` can be found in `styles/catalog.css`.
An alternative, list-style, table-of-contents rendition is in `styles/list.css`.
