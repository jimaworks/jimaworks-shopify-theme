// Handles some UI behavior for `select` and `option` elements;
// Only load on pages where these behaviors are desired:

// 1. Progressive disclosure of multiple `select` elements
// 2. User text input as an option in a `select` menu

// Execute on page load, or after visible DOM is loaded.

//--------------------------------------------------------------//



// PROGRESSIVE DISCLOSURE
// To enable, add `name` attributes to the `select` elements, and
// set the values to whatever the key for that element's
// `localStorage` pair is.
// ----------------------
document.querySelectorAll('select').forEach(item => {
  item.elem = item;
  // Hide elements for which `localStorage` var is 'Unk'
  if (localStorage.getItem(item.name) == 'Unk') {
	document.getElementsByName(item.name)[0].classList.add("hidden");
  }
  // Fire visibility toggle function on menu change
  item.addEventListener('change', event => {
	toggleSelectorVisibility(item.name);
	userSelectInput(item);
  })
})

// Remove `hidden` class on next sibling when a value is chosen
function toggleSelectorVisibility(itemName) {
	if (localStorage.getItem(itemName)) {
		var thisMenu = document.getElementsByName(itemName)[0];
		var nextMenu = thisMenu.parentElement.nextElementSibling.children[0];
		nextMenu.classList.remove("hidden");
	}
}

//--------------------------------------------------------------//


// USER TEXT INPUT OPTION
// Works with the above progressive disclosure stuff. Make sure to add the
// `user_input` class to the appropriate `option` element.
// ----------------------
function userSelectInput(item) {
	// Get reference to `select` element
	var selectEl = item;
	// Do fancy stuff when the user chooses to input data
	if (selectEl.value == "UserProvided") {
		var optionEl = selectEl.getElementsByClassName('user_input')[0];
		var optionElStartingValue = optionEl.value;
		var optionElStartingHTML = optionEl.innerHTML;
		
		// Prompt user, store input in localStorage, and pop a
		// new `option` onto the `select` based on user input
		localStorage.setItem(selectEl.name, prompt('Enter your text.'));
		optionEl.innerHTML = localStorage.getItem(selectEl.name);
		optionEl.value = localStorage.getItem(selectEl.name);
		
		// Remove this class, now that value has changed
		optionEl.classList.remove('user_input');
		
		// Create a new `option` element with the original
		// input option's value, etc.
		var newOpt = document.createElement('option');
		newOpt.value = optionElStartingValue;
		newOpt.innerHTML = optionElStartingHTML;
		newOpt.classList.add('user_input');
		selectEl.appendChild(newOpt);
		optionEl.value = localStorage.getItem(selectEl.name);
	} else {
		// Store regularly selected options to localStorage
		localStorage.setItem(selectEl.name, selectEl.value);
	}
}