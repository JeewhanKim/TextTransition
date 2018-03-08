## Text Transition with jQuery

### Requirements
- jQuery 1.7.0+
- This library built with ES5/ES6 Syntax

### Usage

```html
<script type="text/javascript" src="textTransition.js"></script>
<script>$('.textTransitionDemo').textTransition();</script>
```
### Overview

'TextTransition.js' shows the behavior how the fixed background image work in different browser's aspect ratio along with the text transitioning animation.

Each slide is viewed individually and controlled by interacting with the three dot indicator or scrolling vertically.
The browser height determines the height of the image in the viewport. Depending on the orientation of the viewport (landscape or portrait) the contents of the backgroind image may be cropped by the browser itself.

Text boxes are independent of the background image and are at a fixed centered position. The top edge of each slide will mask the text boxes and create a parallax effect, these transitions maintain a fixed center position. This is how the text box for the next slide is revealed.

