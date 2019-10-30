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
  controlButtons +=
    '<input id="enterOriginLine1" type="text" value="' +
    localStorage.OriginsLine1 +
    '" style="width: ' +
    titleLineWidth +
    'px; background-color: Ivory; border: 4px solid DarkGreen; padding: 5px; margin: 0 3px; font-size: 110%; font-weight: bold;" oninput="enterOriginText()">';
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
  window.Jimaworks = window.Jimaworks || {}; // Singleton for namespacing; avoids global variable conflicts
  window.Jimaworks.overlaysRendered =
    typeof window.overlaysRendered !== "undefined"
      ? window.overlaysRendered
      : false;
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
  var webShipImg =
    '"' +
    shopifyFilePrefix +
    localStorage.shipPic.replace("(", "_").replace(")", "_") +
    '"';
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

## 9/16, 9/17, 9/18, 9/19

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
  - Directory organization not possible. From theme CLI: `Theme files may not be stored in subfolders`.
- Every step of the wizard is a Page except the checkout page, which comes from `/theme/snippets/product-ancestor-info--pogodan.liquid`.
  - This means `theme/templates/page.initialize-jimaworks.liquid` is not called when displaying it, so we can’t handle it in the `case` statement.
  - `product-ancestor-info--pogodan` is included by `/theme/sections/product-customizable-2018.liquid`
    - The checkout page (“Accordion Page”) is stored as various products with different theme templates/sections, e.g. “RelationShips commemoration - Framed” (product ID 1872758145089) has Product template/section `product.customizable-2018`.
    - This means the Accordion-specific localStorage variables in `initialize-defaults` were being set on every Page but never being used.
    - There should be some mechanism added to the Accordion to retrieve `localStorage` variables previously set.
- URLs being auto-generated based on the initial titles of Pages, which may include testing titles, produces some odd results, e.g. `000-knownshipoptions` and `1-g-ii-jimaworks-madeshipimagery`. Should we rename these pages?
- The numbers denoting which step of the wizard you’re on don’t align with how many steps there actually are. The number presented to the user only goes up to 2, but there are actually 14 steps. While conceptually some steps are related, seems misleading from a user perspective and confusing from a developer perspective.
- There’s no rhyme or reason for whether a Page gets the `page` template or the `page.initialize-jimaworks` template.
- Setting initial localStorage variables on Preview: if user clears their browsing data and jumps straight to a step of the Wizard, missing required data.
  - Drawback of `case`/`when`?
  - Have every Page call `initializeDefaults()` first.
  - Deceiving: if the ship pic doesn’t render but `localStorage.shipPic` is set, this likely means that the image is rendering but its absolute/relative positioning is screwed up because of the Origin Text (Line 2) is missing, which pushes it into the correct spot.

## 9/19

### De-duplicate functions between define-preview-fn & initialize-shipdb

### define-preview-fn

- `numAvailTitleLines = 2` → `numAvailTitleLines = 3`

## 9/24

### [Double-check that Accordion localStorage vars are being initialized in initialize-defaults](https://trello.com/c/AlpHWqR1)

- localStorage variables _are_ being set in `page.save_and_come_back_later.liquid` and `page.ships.liquid` under `theme/templates/`, but not any of the product\* templates/sections like `product.customizable-2018.liquid`.

### Fix image 404s from undefined in URL

- `RelationShipsPreviewZ` (“RPZ”) relies on localStorage variables, which means `initializeDefaults()` needs to be called first. When RPZ was called first, `localStorage.webMapImg` was not set, which affects:

  ```js
  // 1:
  var webMapImg = shopifyFilePrefix + localStorage.webMapImg; // shopifyFilePrefix = "https://cdn.shopify.com/s/files/1/1336/0641/files/undefined`

  // 2:
  var mapImg = webMapImg;
  img.src = mapImg; // Async operation, 404s
  ```

  But! It turns out this is a rogue image that isn’t used anywhere. Deleting…

- Another 404 on `/pages/textbox1-title-line2-when-did-it-take-place-1`:
  ```js
  // 1:
  var currRegionAbbrev = localStorage.RegionOfOriginAbbrev ;

  // 2:
  // https://cdn.shopify.com/s/files/1/1336/0641/files/1600-Routes-undefined_256x256.png
  var currMapFile = shopifyPrefix + availableMapYear + "-Routes-" + currRegionAbbrev + shopifyImgSizePostfix + ".png";
  ```x`

## 9/24, 9/27, ..., 10/02

### Find minimum required localStorage variables required for proper functionality of Preview/Wizard

- Dev/Prod Wizard URLs are out of sync (“UI mix-up”)
  1. Dev:<br>
     **URL:** `/pages/your-relationships-project`<br>
     **Title:** Your Relationships Project<br>
     **Content:** Preview<br>
     Prod: Same
  2. Dev:<br>
     **URL:** `/pages/textbox0-set-the-stage-in-what-part-of-the-world-did-this-story-start`<br>
     **Title:** Set the Stage. In What Part of the World did this Story Start?<br>
     **Content:** Region Picker<br>
     Prod:<br>
  3. Same
  4. URL & Title: Same<br>
     Content: Different. Dev: Region Picker. Prod: Preview editor. Not sure which is correct.
  5. 
- UI mix-up solved by removing the early return from `RelationShipsPreviewZ` if `initializeDefaults` hasn’t been called yet.

#### `textbox3-destination-where-did-they-land`
Title: 3. American Destiny. Where did they land?
- `Uncaught ReferenceError: regionList is not defined`
  - Attempts to set `regionList.selectedIndex = i;` (inside of `ChangeAreasRegionsList()`) but `regionList` is defined in a different function (`UpdateAreaRegionsList()`) and is thus out of scope. Has nothing to do with localStorage.
- `Uncaught ReferenceError: AcceptCurrentDeparture is not defined`
  - `AcceptCurrentDeparture()` is defined in `textbox2-origins-from-where-did-they-depart.html`.
  - May be from UI mix-up?
    - Yes, ReferenceErrors go away after solving UI mix-up
- 

#### `textbox3-destination-where-did-they-end-up`
Title: 3: Destination: Where did they end up?
- Clicking on “Unknown” for County or City/Town in the dropdown menus cause a redirect. This is likely an unexpected behavior that will confuse or frustrate the user as they might think they’ve just lost their place in the Wizard.

#### `000-knownshipoptions`
- Tawk is throwing errors: `Cannot read property 'appendChild' of null`, `this.getBrowserData is not a function`. Not under our direct control; skipping.
- `TypeError: Cannot read property 'replace' of undefined`
  ```js
  var shopifiedShipImg = '\"' + shopifyFilePreFix + webShipImg.replace("(", "_").replace(")", "_") + '\"';
  ```
- `Uncaught ReferenceError: initializeDefaults is not defined`
  - Template: `page` → `page.initialize-jimaworks`. Technically doesn’t need any localStorage vars? But trying to get rid of all errors.
    - Fixed errors but ended up replacing the UI with the standard Preview editor when this is supposed to be a ship-specific editor.
    - Does need some localStorage vars; just expects them to already be set by previous pages.
  - Reverted to regular `page` template; initializeDefaults() doesn’t get defined so init includes won’t work here. Have to set “backup default” for localStorage.shipPic[Default]

#### `textbox4-tripinfo-how-did-they-get-here`
- Also uses `page` template.
  - Should we add `initializeDefaults` to regular `page` template?
- With all localStorage vars from previous steps:
  - `Uncaught TypeError: Cannot read property '0' of undefined at textbox4-tripinfo-how-did-they-get-here:1361`:
    ```js
    console.log('Added: '+newShipArray[4][0]+' with '+newShipArray[0][1]+'= '+newShipArray[4][1]) ;
    ```
  - `Uncaught TypeError: Cannot read property '0' of undefined at textbox4-tripinfo-how-did-they-get-here:1413`
    ```js
    console.log('Added: '+newShipArray[15][0]+' with '+newShipArray[0][1]+'= '+newShipArray[15][1]) ;
    ```
- Without localStorage vars (hard refresh):
  - `Uncaught TypeError: Cannot read property 'replace' of undefined at displayCurrentShip (textbox4-tripinfo-how-did-they-get-here:688)`
    ```js
    var shopifiedShipImg = '\"' + shopifyFilePreFix + webShipImg.replace("(", "_").replace(")", "_") + '\"'; 
    ```
    - This is the same issue as in `000-knownshipoptions`.
  - `Uncaught TypeError: Cannot read property '1' of undefined at getMostLikelyShipForTimeAndPlace (textbox4-tripinfo-how-did-they-get-here:1897)`
    ```js
    thisShipsName = thisShipInfo[nameIndex]; 
    ```
    - Since `getMostLikelyShipForTimeAndPlace` is defined at runtime, it can’t know about `newShipArray`, which is defined at compile time.
      - Before: `getMostLikelyShipForTimeAndPlace() ;`
      - After: `getMostLikelyShipForTimeAndPlace(newShipArray) ;`
      - This sets off a chain reaction of things being undefined:
        - `getMostLikelyShipForTimeAndPlace()`
           1. `var processedShipsArray = newShipArray.slice(1) ;`
           2. `processedShipsArray=processedShipsArray.filter(filterByYearInterval) ;`
    - When localStorage is not set, `filterByYearInterval()` did not return correctly.
      - Before:
        ```js
        var EarliestPossYr = Number(localStorage.EarliestPossibleYearOfCrossing) ;
        var LatestPossYr = Number(localStorage.LatestPossibleYearOfCrossing) ;
        ```
      - After:
        ```js
        var EarliestPossibleYearOfCrossing = (
          localStorage.getItem("EarliestPossibleYearOfCrossing")
          || localStorage.getItem("EarliestPossibleYearOfCrossingDefault")
          || 1607
        );
        var EarliestPossYr = Number(EarliestPossibleYearOfCrossing) ;
        ```

#### `1-g-ii-jimaworks-madeshipimagery`
- Duplicates code from `textbox4-tripinfo-how-did-they-get-here`. Implementing same fixes.

#### `1-c-map-background`
- `Uncaught TypeError: Cannot read property 'replace' of undefined at 1-c-map-background:739`
  ```js
  var currShipImgFile =  "https://cdn.shopify.com/s/files/1/1336/0641/files/"
                         + currShipImg.replace(" ","_").replace("(","_").replace(")","_") ;
  ```
  - Comes from `var currShipImg = localStorage.shipPic;`
- `matchArrayString` can not know about `matchTarget` yet, which makes var `findIndex()` return -1.
  - Before:
    ```js
    /* define "matchTarget" in the local environment... */
    function matchArrayString(element) {
      return element == matchTarget;
    }
    // ...
    var matchTarget = currOrigChoice ;  /* Creating a "local global" for matchArrayString...*/
    var origsIndex = origsArray.findIndex(matchArrayString);
    ```
  - After:
    ```js
    var matchTarget = currOrigChoice ;  /* Creating a "local global" for matchArrayString...*/
    var matchArrayString = function (element) {
      return element == matchTarget;
    }
    var origsIndex = origsArray.findIndex(matchArrayString);
    ```

#### `choose-a-format-for-your-relationships-delivery`
- Frame border not showing up
  - `RelationShipsPreviewZ("mockup", "noFrame");` – duh!
- Duplicate rendering of shipInfoTextBoxL1-2
  - Turns out this is on every invocation of the Preview; not unique to this page.

#### `2-the-frame`
- `Uncaught TypeError: Cannot read property 'replace' of undefined at 2-the-frame:601`
  ```js
  var currShipImgFile =  "https://cdn.shopify.com/s/files/1/1336/0641/files/"
                         + currShipImg.replace(" ","_").replace("(","_").replace(")","_") ;
  ```
  - Same as `1-c-map-background`. Duplicates code; implementing same fixes.

### [Fix RelationShipsPreviewZ Departure UI clobbering](https://trello.com/c/oXUWJ6sC)

### [Narrow down localStorage usage to only essential data](https://trello.com/c/JdAidCgb)
- Looking at what vars the Accordion page needs as a reference
- Accordion functionality comes from jQuery UI
  - Disabling because we don’t really have a limited amount of space. Hiding all but one section at a time prevents scannability.

### [Prototype new Accordion w/live preview builder](https://trello.com/c/y0s2vPUz)
- Forking existing templates:
  - `sections/product-customizable-2018.liquid` → `sections/product-customizable-2019.liquid`
    - Did not automatically show up in the relevant dropdown menu in the Product editor
      - Needed `theme/templates/product.customizable-2019.liquid` to include it
  - `snippets/product-ancestor-info--pogodan.liquid` → `snippets/product-ancestor-info--hugh.liquid`
- Starting with `genericrelationshipsproduct-framed`, but needs to be done for every variant.
- Including init.* scripts and `RelationShipsPreviewZ` generates preview in relevant div but page alignment is off.
  - 14 Errors
  - Placing `DisplayOverlays` in the right-hand column “fixes” but alignment is still screwy because of absolute/relative positioning.
    - Should just remake `RelationShipsPreviewZ`?
      - Not yet. First, use existing preview and make it follow the user down the page.
      - How hard would it be to at least do a skeleton HTML?

### [Fix UI crowding caused by 8 PlaqueLine inputs](https://trello.com/c/nNr5XN85)
- Reverted calculation of `font-size` to previous version (Math based on the number of filled in lines and the dimensions of the plaque)
- `webPlaqueTextBoxDiv`
  - Made line height permanently 1.5
- `webPlaqueTextBoxDivContent`
  - Made flexbox with dual-axis centering
  - Increased padding to `5px 10px 7.5px` @ 0.8 zoom level
- `span#plaqueTextBoxL1 + br` et al.
  - Made TextBoxes over #3 (and their corresponding line breaks) `hidden` by default
    - When lines are added, the corresponding elements are un-`hidden`
    - When lines are deleted, the corresponding elements are re-`hidden`
    - This makes it so the text is always vertically centered regardless of how many lines there are.
- <del>Added `onchange` to relevant `inputs` that duplicates the existing `oninput` handlers. This is to cover e.g. copy & paste.</del> onChange only fires after losing focus so this did nothing.

## 10/04

### Deploy dev changes to production

#### `/pages/textbox3-destination-where-did-they-land`
```
Uncaught ReferenceError: chooseTypicalPort is not defined
    at RecordNewPortChoice (textbox3-destination-where-did-they-land:3358)
    at ChangeCountryPortsList (textbox3-destination-where-did-they-land:1306)
    at HTMLSelectElement.onchange (textbox3-destination-where-did-they-land:689)
```

#### `/products/genericrelationshipsproduct-framed`
```
Uncaught TypeError: Cannot set property 'value' of null
    at genericrelationshipsproduct-framed:1050
```
↓
```js
document.getElementById("seascape").value = localStorage.seascape ;
```
**Reason**: `localStorage.seascape` is never set anywhere.

## 10/08

### Transition to Accordion-based builder

- There are at least 157 localStorage variables initialized throughout Wizard.
- Of these, Jim has identified 

From Jim:
> Here is (what I believe to be) the complete set of variables:
- [ ] Title Textbox (3 lines)
- [ ] Origins Textbox (2 lines)
- [ ] Destination Textbox (2 lines)
- [ ] Ship Info Textbox (3 lines)
- [ ] Plaque Textbox (8 lines)
- [ ] Addl Origin info (3 geo elements)
- [ ] Addl Destination info (3 geo elements)
- [ ] Ship Choice (just the name and tart-of-service date)
- [ ] Date info (3 date elements)
- [ ] Map style (Shopify?)
- [ ] Size (Shopify)
- [ ] Frame (Shopify)

## 10/11

### [Investigate broken Submit button](https://trello.com/c/jmTXFzd8)

- `/products/genericrelationshipsproduct-framed`
- Need to eliminate other JS errors to rule out halted runtime
  - Dev has more errors than Prod
  - `Uncaught TypeError: Cannot set property 'value' of null at genericrelationshipsproduct-framed:1077` → `document.getElementById("seascape").value = localStorage.seascape ;`
    - No such variable
    - No such node
    - Commenting out
  - `Uncaught ReferenceError: CommemorationTimePeriodStart is not defined at genericrelationshipsproduct-framed:1852`
    ↓
    ```js
    document.write( /* shipping-line-5... */
      '<input type=\"hidden\" id=\"'
          + 'shipping-line-5' + '\" class=\"member\" name=\"properties['
          + 'CommemorationTimePeriodStart]\" value=' + CommemorationTimePeriodStart + '>' ) ;
    ```
    - Solution:
      ```js
      document.write( /* shipping-line-5... */
        '<input type=\"hidden\" id=\"'
            + 'shipping-line-5' + '\" class=\"member\" name=\"properties['
            + 'CommemorationTimePeriodStart]\" value=' + ( localStorage.getItem("CommemorationTimePeriodStart") || '' ) + '>' ) ;
      ```
  - `Uncaught ReferenceError: Passage is not defined at genericrelationshipsproduct-framed:1862`
    ```js
    document.write( /* shipping-line-5... */
      '<input type=\"hidden\" id=\"'
          + 'shipping-line-5' + '\" class=\"member\" name=\"properties['
          + 'Passage]\" value=' + Passage + '>' ) ;
    ```
    - Neither `Passage` nor `localStorage.Passage` is defined anywhere; commenting out.
  - At this point we are seeing code on the page…
  - `Uncaught ReferenceError: TransportCraft is not defined at genericrelationshipsproduct-framed:1870`
    ↓
    ```js
    document.write(
        '<input type=\"hidden\"'
            + ' id=\"shipping-line-4\"'
            + ' class=\"member\"'
            + ' name=\"properties[TransportCraft]\"'
            + ' value='
            + TransportCraft
            + '>' 
    ) ;
    ```
  - `ReferenceError: shipPic is not defined at genericrelationshipsproduct-framed:1888`
  - After prev fix, no more code on page.
  - `Uncaught ReferenceError: shippingLine is not defined at genericrelationshipsproduct-framed:1897`
  - … `shipCareerStart`, `shipCareerEnd`, `shipTotPsgrVolume`
  - `Uncaught TypeError: Cannot set property 'value' of null at genericrelationshipsproduct-framed:1194`
    ↓
    ```js
    document.getElementById("trailer-line-1").value = originsTextBoxL1;
    ```
    - `trailer-line-1` is generated by `generateShipInfoLines2` (under certain conditions), which is never called.
      - Wrapping in if statement.
  - All errors solved. Submit button still not available.
    - There was never a problem. You have to select from the “Size and Extras” section.