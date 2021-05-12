const $container = document.querySelector('.container');

// Add mouse down listener to the container element
$container.addEventListener('mousedown', mouseDown);

// Store the initial value of edit input
let inputInitVal = null;

// Add, edit, delete items
handleActions({
  onAdd: ($elCloned, $newEl) => {
    // Delete children and root styling from newly created element
    $newEl.querySelector('.level-wrapper').innerHTML = '';
    removeClass($newEl.querySelector('.level-wrapper'), 'has-child');
    removeClass($newEl, 'root');
    $newEl.style.transform = '';

    // Generate a random ID and assign to selectors for newly created element
    const randId = Math.floor(Math.random() * 10000);
    const selectorsUpdated = ['add', 'edit', 'delete', 'confirm', 'close', 'container'];
    // Iterate through the selectors and update id of each
    selectorsUpdated.forEach(
      (selector) =>
        ($newEl.querySelector(`[data-el-${selector}]`).dataset[`el${capitalize(selector)}`] =
          randId)
    );
    $newEl.dataset.elClone = randId;

    // Add hierarchy lines
    addClass($elCloned.querySelector('.box-content'), 'has-child');
    addClass($elCloned.querySelector('.level-wrapper'), 'has-child');
    addClass($newEl.querySelector('.box-content'), 'has-parent');

    toggleButtons($newEl);
  },
  onEdit: ($el) => {
    inputInitVal = $el.querySelector('input').value;

    toggleButtons($el);
  },
  onDelete: ($el) => {
    // Don't delete root element
    if (!containsClass($el, 'root')) {
      $el.remove();
    }
  },
  onConfirm: ($el) => {
    // If not edit mode ()
    if (inputInitVal == null) {
      $el.querySelector('input').style.backgroundColor = generateColor();
    }

    close($el);
  },
  onClose: ($el) => {
    // If edit mode
    if (inputInitVal != null) {
      $el.querySelector('input').value = inputInitVal;
    } else {
      // Don't delete root element
      if (!containsClass($el, 'root')) {
        $el.remove();
      }
    }

    close($el);
  }
});

// Handle chart zoom
zoom();
