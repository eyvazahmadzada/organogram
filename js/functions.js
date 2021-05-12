// UTILITY FUNCTIONS ---------------------------------------

/** Selects and returns an element with selector */
const selectOne = (selector) => document.querySelector(selector) || false;

/** Selects and returns all elements with selector */
const selectAll = (selector) => document.querySelectorAll(selector) || false;

/** Adds classes to element */
const addClass = (el, classes) => el.classList.add(classes);

/** Removes classes from element */
const removeClass = (el, classes) => el.classList.remove(classes);

/** Check if element contains class */
const containsClass = (el, classes) => el.classList.contains(classes);

/** Capitalizes a given string */
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

/** Generates and returns a random color  */
const generateColor = () => {
  // List of available colors
  const colorCodes = [
    '8A4F7D',
    '887880',
    '88A096',
    'BBAB8B',
    'EF8275',
    '19381F',
    'EEE82C',
    '91CB3E',
    '53A548',
    '4C934C'
  ];

  return '#' + colorCodes[Math.floor(Math.random() * colorCodes.length)];
};

// UTILITY FUNCTIONS END ---------------------------------------

// MAIN FUNCTIONS ---------------------------------------

/** Handles mouse press on container element  */
function mouseDown(e) {
  // Add mouse move and mouse up events on window
  window.addEventListener('mousemove', mouseMove);
  window.addEventListener('mouseup', mouseUp);

  // Store previous positions of mouse
  let prevX = e.clientX;
  let prevY = e.clientY;

  /** Handles mouse move on window */
  function mouseMove(e) {
    // Calculate current position
    let curX = prevX - e.clientX;
    let curY = prevY - e.clientY;

    // Get positions of container element
    const rect = $container.getBoundingClientRect();

    // Update positions on DOM
    $container.style.marginLeft = rect.left - curX + 'px';
    $container.style.marginTop = rect.top - curY + 'px';

    // Update previous mouse positions
    prevX = e.clientX;
    prevY = e.clientY;
  }

  /** Handles mouse release on window */
  function mouseUp() {
    // Remove event listeners on release
    window.removeEventListener('mousemove', mouseMove);
    window.removeEventListener('mouseup', mouseUp);
  }
}

/** Handles toggle of modify and confirmation buttons */
const toggleButtons = (el) => {
  const $input = el.querySelector('input');

  // Open input to name the new element
  addClass($input, 'focused');
  $input.focus();

  // Show confirmation buttons
  addClass(el.querySelector('.btn-modify'), 'd-none');
  removeClass(el.querySelector('.btn-confirmation'), 'd-none');
};

/** Closes input create or edit mode */
const close = (el) => {
  const $input = el.querySelector('input');

  // Change text color and disable input
  $input.style.color = '#fff';
  removeClass($input, 'focused');

  // Show modify buttons
  removeClass(el.querySelector('.btn-modify'), 'd-none');
  addClass(el.querySelector('.btn-confirmation'), 'd-none');

  // Clear the initial value of input
  inputInitVal = null;
};

/** Handles elements with specific instructions */
const handleActions = (options = {}) => {
  // Default function options
  const defaults = {
    clearInput: true
  };

  options = { ...defaults, ...options };

  // Handle actions using event delegation
  document.addEventListener('click', (e) => {
    const el = e.target;

    /* Handle add button */
    if (el.dataset.elAdd) {
      // Get element ID (root for the first one)
      const id = el.dataset.elAdd;

      // Get container element
      const $container = selectOne(`[data-el-container='${id}']`);

      // Get the element to be cloned and clone
      const $elCloned = $container.parentElement;
      const $newEl = $elCloned.cloneNode(true);

      // If clearInput option is provided
      if (options.clearInput) {
        $newEl.querySelectorAll('input, textarea').forEach((input) => {
          input.value = '';
        });
      }

      // Append cloned element to DOM
      $newEl.dataset.elClone = '';
      $container.appendChild($newEl);

      if ('onAdd' in options && options.onAdd instanceof Function) {
        options.onAdd.call(handleActions, $elCloned, $newEl);
      }
    }

    /* Handle edit button */
    if (el.dataset.elEdit) {
      // Get element ID (root for the first one)
      const id = el.dataset.elEdit;

      // Get element and remove
      const $el = selectOne(`[data-el-clone='${id}']`);

      if ('onEdit' in options && options.onEdit instanceof Function) {
        options.onEdit.call(handleActions, $el);
      }
    }

    /* Handle delete button */
    if (el.dataset.elDelete) {
      // Get element ID (root for the first one)
      const id = el.dataset.elDelete;

      // Get element
      const $el = selectOne(`[data-el-clone='${id}']`);

      if ('onDelete' in options && options.onDelete instanceof Function) {
        options.onDelete.call(handleActions, $el);
      }
    }

    /* Handle confirm button */
    if (el.dataset.elConfirm) {
      // Get element ID (root for the first one)
      const id = el.dataset.elConfirm;

      // Get element
      const $el = selectOne(`[data-el-clone='${id}']`);

      if ('onConfirm' in options && options.onConfirm instanceof Function) {
        options.onConfirm.call(handleActions, $el);
      }
    }

    /* Handle close button */
    if (el.dataset.elClose) {
      // Get element ID (root for the first one)
      const id = el.dataset.elClose;

      // Get element
      const $el = selectOne(`[data-el-clone='${id}']`);

      if ('onClose' in options && options.onClose instanceof Function) {
        options.onClose.call(handleActions, $el);
      }
    }
  });
};

/** Handles zoom-in and zoom-out of specific elements */
const zoom = (selector = null, target = null) => {
  // Zoom Out
  selectAll(selector ?? '[data-zoom-out]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const zoomTarget = btn.dataset.zoomOut;
      const $target = selectOne(`.${zoomTarget}`);
      const curScale = $target.getBoundingClientRect().width / $target.offsetWidth;

      // Max zoom out: 40%
      if (curScale > 0.5) {
        const newScale = curScale - 0.1;
        $target.style.transform = `scale(${newScale})`;
        selectOne(`[data-zoom-result='${zoomTarget}']`).innerHTML =
          (newScale * 100).toFixed() + '%';
      }
    });
  });

  // Zoom In
  selectAll(selector ?? '[data-zoom-in]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const zoomTarget = btn.dataset.zoomIn;
      const $target = selectOne(`.${btn.dataset.zoomIn}`);
      const curScale = $target.getBoundingClientRect().width / $target.offsetWidth;

      // Max zoom in: 200%
      if (curScale <= 2) {
        const newScale = curScale + 0.1;
        $target.style.transform = `scale(${newScale})`;
        selectOne(`[data-zoom-result='${zoomTarget}']`).innerHTML =
          (newScale * 100).toFixed() + '%';
      }
    });
  });
};

// MAIN FUNCTIONS END ---------------------------------------
