# DeleteLast

## 9/1

- Line 405: single ampersand might not be what is desired

- ```
  your-relationships-project:3687 Uncaught TypeError: Cannot set property 'innerHTML' of null
      at enterDestinationText (your-relationships-project:3687)
      at HTMLInputElement.oninput (your-relationships-project:1)
  ```
  - Relevant line: `document.getElementById("destinationTextBoxL1").innerHTML = destinationTextBoxEntry1;`
  - Element with id `destinationTextBoxL1` is an empty `<scan>` tag, which doesn’t exist in HTML. Was it supposed to be `<span>`?
  - `localStorage.DestinyLine1 = destinationTextBoxEntry1;` – Modifying localStorage directly works, but we may want to stick to the API and use `setItem` for clarity. [Details](https://stackoverflow.com/a/15439059/214325)
  - `<scan id="DestinationTextBoxL1">` won’t be found by `document.getElementById("destinationTextBoxL1")` — different capitalization

## 9/2

### Fix Origins Text Boxes Undefined

- `enterOriginLine1` & `enterOriginLine2` show text `undefined`.
- `<span id="OriginTextBoxL1"></span>` vs. `document.getElementById("originTextBoxL1")` - same issue as above
- `initialize-shipdb.liquid` is a red herring. Has a lot of the same code as `define-preview-fn.liquid` but is not used by `/pages/your-relationships-project`.
- `localStorage.OriginsLine1` & `localStorage.OriginsLine2` are the cause of the `undefined`s:
  ```js
  controlButtons += '<input id="enterOriginLine1" type="text" value="' + localStorage.OriginsLine1 + '" style="width: ' + titleLineWidth + 'px; background-color: Ivory; border: 4px solid DarkGreen; padding: 5px; margin: 0 3px; font-size: 110%; font-weight: bold;" oninput="enterOriginText()">';
  ```
  (`initialize-shipdb.liquid` Line 1276)
- Different:
  - `localStorage.OriginsLine1` (used to build inputs in `define-preview-fn.liquid`)
  - `localStorage.originsTextBoxL1Default`, `localStorage.originsTextBoxL1` (set in `initialize-defaults.liquid`)
  - May be for different things
  - `localStorage.OriginsLine1` is never set; `localStorage.originsTextBoxL1` is.
- Too confusingly named: `span#OriginTextBoxL1`. Not a text box; shows the output of what is entered into `input#enterOriginLine1`.
- ```js
  if (previewRole == "editPlaque") {
      localStoreNamePrefix = "PlaqueLine";
      numTxtBoxLines = 8;
  }
  ```
  — `localStoreNamePrefix` set but not used. (`define-preview-fn.liquid` Line 380)
- `OriginsLine` (i.e. `currentOriginLine = localStorage[OriginsLine + i]`) is not defined.

### Replace use of eval

- Starting with `define-preview-fn.liquid`.
  - Before:
    ```js
    if (eval(localStoragePlaqueLineStr + ' !== undefined') & eval(localStoragePlaqueLineStr + ' !== "undefined"')) {
    ```
  - After:
    ```js
    if (
        (localStoragePlaqueLineStr !== undefined)
        & (localStoragePlaqueLineStr !== "undefined")
    ) {
    ```
- Evals were hiding undefined errors for the following variables:
  - <del>`PlaqueLine`</del>
  - <del>`TitleLine`</del>
  - Had quotes; accidentally removed. should be `localStorage['PlaqueLine' + i]`, not `localStorage[PlaqueLine + i]`.
- `document.getElementById("DisplayOverlays")` returns `null` (element not found), but it works in Chrome console. Race condition?
  - Moving to `DOMContentLoaded` fixed, but there are 3 separate invocations:
    - `define-preview-fn.liquid`
    - `initialize-shipdb.liquid`
    - `product-ancestor-info--pogodan.liquid`
- Edit button is now broken: `GET https://jimaworks-dev.myshopify.com/pages/%22https://cdn.shopify.com/s/files/1/1336/0641/files/EuM-Liner-Pari.png%22 404`.
  - `%22` = `"`
  - Image sources don’t need to be quoted.

### Fix errors to bring in line with production

- `var all_routes = {{ shop.metafields.automatik.routes }};` → `var all_routes = ;`
- Metafields are supported as shop data but there is no way to modify in the Admin UI, so no native way to export to dev site.
- Have to manually recreate using Metafields Guru.
- Existing Metafields have JSON-like data but the value type for all is "String" (options are: String, Integer, JSON String)
- 

## 9/3

### Fix broken preview buttons

- Race condition. Was attempting to set `innerHTML` before the `DisplayOverlays` element was loaded into the DOM.

  Added:
  ```js
  /*
    Generally speaking we should avoid global variables & side-effects,
    but in this case we need to make sure the variable is not being reset
    each time the function is called.

    On first invocation, the overlay rendering will occur inside the
    `DOMContentLoaded` event listener, so we can be sure
    `document.getElementById("DisplayOverlays")` will be non-null, and
    can therefore set `innerHTML` without issue.

    The `DOMContentLoaded` event only occurs once though, so we need
    to flip `overlaysRendered` to `true` after the first render, and then
    subsequent renders will call `innerHTML` outside of the event.

    See bottom of `RelationShipsPreviewZ` for implementation.
  */
    window.Jimaworks = ( window.Jimaworks || {} ); // Singleton for namespacing; avoids global variable conflicts
    window.Jimaworks.overlaysRendered = (
      ( typeof window.overlaysRendered !== "undefined" )
      ? window.overlaysRendered
      : false
    );
  ```

### Fix DeleteLast Functionality

- `removeLastLine()` erroneously used `previewRole` (e.g. `editOrigin`) instead of `localStoreNamePrefix` (e.g. `originsTextBoxL`), which went unused.
  - Before:
    ```js
    else if (previewRole == "editOrigin") {
      localStoreNamePrefix = "originsTextBoxL";
      numTxtBoxLines = 2;
    }
    // ...
    localStorage[previewRole + lastFilledLine] = undefined;
    ```
  - After:
    ```js
    // ...
    localStorage[localStoreNamePrefix + lastFilledLine] = undefined;
    ```
- Additionally, setting localStorage.foo to undefined will fill in the input field with the text “undefined”. We want `localStorage.setItem(foo, '')` (to clear the value only—what I went with), or `localStorage.removeItem()` (to delete the key/value pair entirely) instead.

### Fix Preview Console Errors

- `https://cdn.shopify.com/s/files/1/1336/0641/t/17/assets/popup-modals.css?935 net::ERR_ABORTED 404`
  - Commented out: `{{ 'popup-modals.css' | asset_url | stylesheet_tag }}` in `theme.liquid`
- `GET https://jimaworks.com/resources/demos/style.css net::ERR_ABORTED 404`
  - Commented out: `<link rel="stylesheet" href="/resources/demos/style.css">`

### No Outline with Transparent Ship Backgrounds

- <del>Typo: `localStorage.shipImgTransparentBackground` (not set) vs. `localStorage.shipImageTransparentBackground` (set)</del> Incorrect assessment; `shipImgTransparentBackground` is a local variable that `localStorage.shipImageTransparentBackground` gets assigned to.
- The answer is already in the code:
  ```js
  // ### transparent... shouldn't the value here be "transparent" instead of "t"? ###
    var shipImageTransparentBackgroundDefault = "t";
  ```

### Missing “ShipInfo” Text on Map

- 

### Fix webShipImg / localStorage.shipPic undefined error

- Encountered while working on ShipInfo issue; not sure if related.
  ```
  Uncaught TypeError: Cannot read property 'replace' of undefined
  at RelationShipsPreviewZ (your-relationships-project:2943)
  at your-relationships-project:3516
  ```
  ↓
  ```js
  var webShipImg = '\"' + shopifyFilePrefix + localStorage.shipPic.replace("(", "_").replace(")", "_") + '\"';
  ```
  - On a fresh page load, runs twice. First pass `localStorage.shipPic` is `undefined`; second pass it’s `jimaworksStPaul640.png`. Might be enough just to ternary guard it?
  - Made edits in `define-preview-fn` but identical code in `initialize-shipdb` is generating the errors.
  - Might not be two passes but rather the dual definition.
  - Solved by doing `var shipPic = ( localStorage.getItem('shipPic') || '' );` in both places. Should de-dupe these in the future.
  - `webShipImg2` seems redundant. <del>Possibly a separate attempt since `webShipImg` was not working.</del> `webShipImg` is the same as `webShipImg2` but enclosed in quote characters.
- Not related to ShipInfo.

### Fix missing Plaque text & inputs

- `EditPlaqueButton = "yup" // or "nope"`
- `function editPlaqueTextBox` from `define-preview-fn` is taking precedence.
- `numFilledPlaqueLines >= thisLineNum` → `0 >= 1` = `false`
  - `numFilledPlaqueLines` is only incremented if there are existing Plaque lines in localStorage.

### Plaque Text loses alignment when scale up

- Moving from separate plaque image to background-image for text. This way, can’t escape past the plaque bounds.
- `webPlaqueDivStyle`, `webPlaqueTextBoxDivStyle` from `define-preview-fn` is taking precedence.
  - Overridden multiple times within each file, so confusing which edits will take.
- Commented out `webPlaqueDivStyle` to make `webPlaqueTextBoxDivStyle` the sole concern.

## 9/10

### Plaque Background loses alignment also

- Swapping in plaque-less background image.
  - Naming of supplied image breaks convention:
    - No `72ppi`. Adding in.
    - Uses `BlkWalnut` instead of `Walnut`. No use of `BlkWalnut` anywhere in the existing code.
  - No ability to rename files in Shopify. Annoying.
  - Code for image URL assembly relies on Prod, not Dev. Have to make relative.
  - <del>No need to hard-code Shopify file URL prefix; can just use Liquid, e.g. (`{{ 'logo.png' | file_img_url: '1024x768' }}`)</del> Can’t interpolate JavaScript variables into Liquid calls since Liquid is parsed first.

## 9/11

### Ideas about button styles?

- [Describe the five Text Boxes] → changes the right-hand side buttons, which call an `alert()`. Does not call `alert()` directly!
- [ ] Should move this info out of alerts
- [x] And also take the section buttons out of the right-hand side and turned them into plain links under a “More Info” section.
- Changed “Describe the five Text Boxes” etc. to ”About the five Text Boxes”
- Styled “Skip to Project” to look like a link and distinguish from description buttons
- Changed “Click here to start building your story” to “Start building your story”

## 9/16, 9/17

### [Relocate/consolidate localStorage variables](https://trello.com/c/JttMoG5b)

- Tried to find instances of localStorage variables being initialized outside of `initialize-defaults` but found none.
  - Copied some missing defaults over from Jim’s local version of `initialize-defaults`:
    - `DestinyLine1Default`
    - `DestinyLine2Default`
    - `ShipInfoLine1Default`
    - `ShipInfoLine2Default`
    - `PlaqueLine1` – `PlaqueLine3`
  - Still missing defaults for the following:
    - `TitleLine3Default`
    - `PlaqueLine4` – `PlaqueLine7`
- Thinking about better ways to deal with this data:
  - `localStorage` vs. `sessionStorage`
    - “Save & Continue Later” functionality benefits from `localStorage`; saving for later is in fact automatic as currently coded.
      - Eliminates the need for an e-mail being sent with a unique link.
        - E-mail may still be useful for marketing purposes.
        - Unique link may still be useful for passing a configuration off to a relative to fill in details or complete the purchase.
  - Many vars vs. serialized JSON string as single var
    - Many vars - Pros:
      - Don’t have to constantly convert to/from JSON strings
      - Data is mostly (entirely?) strings so no need for boolean, number, etc. from JSON
    - Many vars - Cons:
      - Data is spread out and ad-hoc; not easy to get a sense of overall structure or package for use elsewhere.
    - JSON string - Pros:
      - Related data can be grouped and represented in a hierarchy
    - JSON string - Cons:
      - Have to constantly convert to/from
  - Organize by page/functionality? E.g. `localStorage.Preview.DestinyLine1Default`, `localStorage.Cart`
    - JSON hierarchy outweighs cons of converting to/from string; JSON wins
  - Create “middleware” utility function for converting to/from JSON string
  - `initialize-defaults` currently covers all the variables needed by every page. Should be modularized.
  - 
