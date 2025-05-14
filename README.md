# Bouncing Circles PWA

A WebGL-powered progressive web application that simulates bouncing circles with real-time physics and collision detection, using GLSL shaders and JavaScript.

---

## Features

- Circle objects with realistic bouncing and collision behavior
- Customizable shader-based rendering using WebGL
- Progressive Web App (PWA) support with offline caching via service workers
- Modular JavaScript for physics (`collisions.js`), drawing (`circle.js`), and rendering (`shader.js`)

---

## Technologies Used

- **WebGL** for hardware-accelerated graphics
- **GLSL** for vertex and fragment shaders
- **JavaScript** for animation and interactivity
- **HTML5** for structure
- **PWA** standards for service workers and manifest support

---

## Project Structure

```
BouncingCirclesPWA/
├── index.html               # Entry point
├── main.js                  # Main loop and app logic
├── circle.js                # Circle drawing and animation
├── collisions.js            # Physics and collision logic
├── shader.js                # Shader utility functions
├── simple.vs / simple.fs    # GLSL vertex and fragment shaders
├── service-worker.js        # PWA offline support
├── manifest.json            # PWA manifest
├── icons/                   # Icons for PWA and favicon
```

---

## How to Use

1. Clone or download the repository.
2. Open `index.html` in any modern WebGL-compatible browser (Chrome or Firefox recommended).

---