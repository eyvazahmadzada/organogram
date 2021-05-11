const containerEl = document.querySelector(".container");

// Add mouse down listener to the container element
containerEl.addEventListener("mousedown", mouseDown);

/** Generates and returns a random color  */
function generateColor() {
  // List of available colors
  const colorCodes = [
    "8A4F7D",
    "887880",
    "88A096",
    "BBAB8B",
    "EF8275",
    "19381F",
    "EEE82C",
    "91CB3E",
    "53A548",
    "4C934C"
  ];

  return colorCodes[Math.floor(Math.random() * colorCodes.length)];
}

/** Handles mouse press on container element  */
function mouseDown(e) {
  // Add mouse move and mouse up events on window
  window.addEventListener("mousemove", mouseMove);
  window.addEventListener("mouseup", mouseUp);

  // Store previous positions of mouse
  let prevX = e.clientX;
  let prevY = e.clientY;

  /** Handles mouse move on window */
  function mouseMove(e) {
    // Calculate current position
    let curX = prevX - e.clientX;
    let curY = prevY - e.clientY;

    // Get positions of container element
    const rect = containerEl.getBoundingClientRect();

    // Update positions on DOM
    containerEl.style.marginLeft = rect.left - curX + "px";
    containerEl.style.marginTop = rect.top - curY + "px";

    // Update previous mouse positions
    prevX = e.clientX;
    prevY = e.clientY;
  }

  /** Handles mouse release on window */
  function mouseUp() {
    // Remove event listeners on release
    window.removeEventListener("mousemove", mouseMove);
    window.removeEventListener("mouseup", mouseUp);
  }
}
