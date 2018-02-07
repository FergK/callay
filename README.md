# Callay

![Callay Screenshot](http://fergk.github.io/callay/screenshot.png)

## [Latest Working Version](http://fergk.github.io/callay/)

[GitHub](https://github.com/FergK/callay)

An experiment with [ThreeJS](https://github.com/mrdoob/three.js/) to do abstract terrain generation using noise functions.

#### Goals

##### Version 000

- **Rendering framework**
  - [x] Viewport
  - [x] Rendering loop
  - [x] Cuboidal geometry

##### Version 001

- **Cameras**
  - [x] Perspective camera with free movement
  - [x] Orthographic camera
- **Input**
  - [x] Keyboard
  - [x] Mouse
  - [x] Gamepad
- [x] Now fetches ThreeJS from a CDN
- [x] Noise-based geometry generation

##### Version 002

- **Boring Stuff**
- [x] Get rid of versioning in files and use git properly
- [ ] Clean up the main file
- **Basic UI**
  - [ ] Introduction
  - [ ] FPS display
  - [ ] Information about controls
  - [ ] Browser feature error messages (WebGL, pointer lock, gamepad, etc...)
  - [ ] Simple options (half-size rendering)
- **Interaction**
  - [x] Rudimentary first person camera
  - [x] Player object with terrain collision detection
  - [ ] User alterable geometry and geometry color
- [x] Smoothed geometry option with appropriate normals for lighting
- [x] Pseudo-infinite terrain generation using simplex noise
- [x] Set up on github.io: [fergk.github.io/callay](http://fergk.github.io/callay/)
- [x] Added [Logify.js](http://futurecensus.github.io/logify.js/) to aid with debugging
- [x] Added [seedrandom](ttps://github.com/davidbau/seedrandom) for seeded terrain generation


##### Future
- [ ] Look into using typed arrays and BufferGeometry for performance

##### TODOs
- Pointer lock is broken in firefox