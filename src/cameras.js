/* global THREE theConfig theScene theViewport ORIGIN Z_AXIS ROT_ZY theTimeDelta */

// =============================================================================
// FIRST PERSON CAMERA =========================================================
// =============================================================================

function FirstPersonCamera ( target, eyeOffset ) {

    this.target = target;
    this.eyeOffset = eyeOffset;

    this.FOV = theConfig.gameplay.FOV;

    this.camera = new THREE.PerspectiveCamera(
        this.FOV, // Field of view
        theViewport.width / theViewport.height, // Aspect ratio
        0.01, // Near
        500 // Far
    );

    this.camera.rotation.order = 'ZYX';

    theScene.add( this.camera );

}
FirstPersonCamera.prototype.constructor = FirstPersonCamera;

// setFOV ======================================================================
// Sets the FOV of the camera to an given value
FirstPersonCamera.prototype.setFOV = function ( FOV ) {

    this.FOV = FOV;
    this.camera.fov = FOV;
    this.camera.aspect = theViewport.width / theViewport.height;
    this.camera.updateProjectionMatrix();

};

// update ======================================================================
// Called every frame
FirstPersonCamera.prototype.update = function() {

    this.camera.position.x = this.target.mesh.position.x;
    this.camera.position.y = this.target.mesh.position.y;
    this.camera.position.z = this.target.mesh.position.z + this.eyeOffset;

    this.camera.rotation.z = this.target.rotation.z;
    this.camera.rotation.x = this.target.rotation.x + (0.5 * Math.PI);

};

FirstPersonCamera.prototype.resize = function () {};



// =============================================================================
// FREE CAMERA =================================================================
// =============================================================================

function FreeCamera() {

    this.FOV = theConfig.gameplay.FOV;

    this.camera = new THREE.PerspectiveCamera(
        this.FOV, // Field of view
        theViewport.width / theViewport.height, // Aspect ratio
        0.01, // Near
        500 // Far
    );

    this.camera.rotation.order = 'ZYX';

    theScene.add(this.camera);
    
    this.moveSpeed = 100;//25; // meters per second
    this.turnSpeed = Math.PI / 2; // radians per second
    this.zoomSpeed = 50;

}
FreeCamera.prototype.constructor = FreeCamera;

FreeCamera.prototype.update = function () {};

// initialize ==================================================================
// Sets the camera to a generally workable starting position and rotation
FreeCamera.prototype.initialize = function () {
    
    this.FOV = theConfig.gameplay.FOV;
    this.camera.position.set( -20, -20, 20 );
    this.camera.rotation.z = -Math.PI / 4;
    this.camera.rotation.x = Math.PI / 4;
    
};

// Resize ======================================================================
FreeCamera.prototype.resize = function () {

    this.camera.aspect = theViewport.width / theViewport.height;
    this.camera.updateProjectionMatrix();
    
};

// Move ========================================================================
// Moves the camera
FreeCamera.prototype.move = function( moveVector ) {
    
    moveVector.applyQuaternion( ROT_ZY );
    moveVector.applyQuaternion( this.camera.quaternion );
    
    moveVector.multiplyScalar( this.moveSpeed * theTimeDelta );
    
    this.camera.position.add( moveVector );

};

// Turn ========================================================================
// Rotates the camera around the z-axis
// Direction, -1 = counter-clockwise, 1 = clockwise
FreeCamera.prototype.turn = function( turnValue ) {

  this.camera.rotation.z -= this.turnSpeed * turnValue * theTimeDelta;

  if ( this.camera.rotation.z < 0 ) {
    this.camera.rotation.z = ( 2 * Math.PI ) + this.camera.rotation.z;
  } else if ( this.camera.rotation.z > ( 2 * Math.PI ) ) {
    this.camera.rotation.z = this.camera.rotation.z - ( 2 * Math.PI );
  }

};

// tilt ========================================================================
// Rotates the camera around the x-axis
// Direction, -1 = counter-clockwise, 1 = clockwise
FreeCamera.prototype.tilt = function( tiltValue ) {

    this.camera.rotation.x -= this.turnSpeed * tiltValue * theTimeDelta;

    // Clamp up/down rotation so you can't go around backwards
    var min = 0;
    var max = Math.PI;
    if (this.camera.rotation.x < min) {
        this.camera.rotation.x = min;
    }
    if (this.camera.rotation.x > max) {
        this.camera.rotation.x = max;
    }

};

// mouseLook ===================================================================
// Accepts mouse movement event and changes it into rotation
FreeCamera.prototype.mouseLook = function ( event ) {

    var rotationVector = new THREE.Vector3(
        // Y movement in screenspace is X rotation in worldspace
        event.movementY * -0.05 * theTimeDelta * theConfig.mouse.lookSensitivity,

        0, // We don't want to use the Y worldspace rotation, it does weird stuff

        // X movement in screenspace is Z rotation in worldspace
        event.movementX * -0.05 * theTimeDelta * theConfig.mouse.lookSensitivity
    );

    this.camera.rotation.setFromVector3( this.camera.rotation.toVector3().add( rotationVector ), 'ZYX' );

    // Clamp up/down rotation so you can't go around backwards
    var min = 0;
    var max = Math.PI;
    if (this.camera.rotation.x < min) {
        this.camera.rotation.x = min;
    }
    if (this.camera.rotation.x > max) {
        this.camera.rotation.x = max;
    }

};

// Zoom ========================================================================
// Adjusts the FOV to zoom in or out
// Direction, -1 = zoom in, 1 = zoom out
FreeCamera.prototype.zoom = function( zoomValue ) {

    var newFov = this.FOV + this.zoomSpeed * zoomValue * theTimeDelta;
    
    if ( newFov < 10 ) { newFov = 10; }
    else if ( newFov > 120 ) { newFov = 120; }

    this.setFOV( newFov );

};


// setFOV ======================================================================
// Sets the FOV of the camera to an given value
FreeCamera.prototype.setFOV = function( FOV ) {

    this.FOV = FOV;
    this.camera.fov = FOV;
    this.camera.aspect = theViewport.width / theViewport.height;
    this.camera.updateProjectionMatrix();

};



// =============================================================================
// ORTHOGRAPHIC CAMERA =========================================================
// =============================================================================

function OrthoCamera() {
    
    this.orthographicScale = 10;

    this.camera = new THREE.OrthographicCamera(
        -theViewport.width * ( 0.5 / this.orthographicScale ),  // Left
        theViewport.width * ( 0.5 / this.orthographicScale ),   // Right
        theViewport.height * ( 0.5 / this.orthographicScale ),  // Top
        -theViewport.height * ( 0.5 / this.orthographicScale ), // Bottom
        -1000, // Near
        1000   // Far
    );

    this.camera.rotation.order = 'ZYX';

    this.initialize();
    
    theScene.add(this.camera);
    
    this.moveSpeed = 25; // meters per second
    this.scaleSpeed = 10; // units per second
    this.turnSpeed = Math.PI / 2; // radians per second

}
OrthoCamera.prototype.constructor = FreeCamera;

OrthoCamera.prototype.update = function () {};

OrthoCamera.prototype.initialize = function () {
    
    this.setScale( 10 );
    this.camera.position.set( 0, 0, 0 );
    this.camera.rotation.z = -Math.PI / 4;
    this.camera.rotation.x = Math.atan( 1 / Math.sqrt( 2 ) );
    
};

// Move ========================================================================
// Moves the camera
OrthoCamera.prototype.move = function( moveVector ) {

    if ( moveVector.z !== 0 ) {
        this.setScale( this.orthographicScale + ( moveVector.z * this.scaleSpeed * theTimeDelta ) );
        if ( this.orthographicScale < 1 ) { this.orthographicScale = 1; }
    } else {

        moveVector.applyAxisAngle( Z_AXIS, this.camera.rotation.z );
        moveVector.multiplyScalar( this.moveSpeed * theTimeDelta );
        
        this.camera.position.add( moveVector );
    }

};

// turn ========================================================================
// Rotates the camera around the z-axis
// Direction, -1 = counter-clockwise, 1 = clockwise
OrthoCamera.prototype.turn = function( turnValue ) {

    this.camera.rotation.z -= this.turnSpeed * turnValue * theTimeDelta;
    
    if ( this.camera.rotation.z < 0 ) {
        this.camera.rotation.z = ( 2 * Math.PI ) + this.camera.rotation.z;
    } else if ( this.camera.rotation.z > ( 2 * Math.PI ) ) {
        this.camera.rotation.z = this.camera.rotation.z - ( 2 * Math.PI );
    }

};

// tilt ========================================================================
// Rotates the camera around the x-axis
// Direction, -1 = counter-clockwise, 1 = clockwise
OrthoCamera.prototype.tilt = function( tiltValue ) {

    this.camera.rotation.x -= this.turnSpeed * tiltValue * theTimeDelta;

    // Clamp up/down rotation so you can't go around backwards
    var min = 0;
    var max = Math.PI;
    if (this.camera.rotation.x < min) {
        this.camera.rotation.x = min;
    }
    if (this.camera.rotation.x > max) {
        this.camera.rotation.x = max;
    }

};

// mouseLook ===================================================================
// Accepts mouse movement event and changes it into rotation
OrthoCamera.prototype.mouseLook = function ( event ) {

    var rotationVector = new THREE.Vector3(
        // Y movement in screenspace is X rotation in worldspace
        event.movementY * -0.05 * theTimeDelta * theConfig.mouse.lookSensitivity,

        0, // We don't want to use the Y worldspace rotation, it does weird stuff

        // X movement in screenspace is Z rotation in worldspace
        event.movementX * -0.05 * theTimeDelta * theConfig.mouse.lookSensitivity
    );

    this.camera.rotation.setFromVector3( this.camera.rotation.toVector3().add( rotationVector ), 'ZYX' );

    // Clamp up/down rotation so you can't go around backwards
    var min = 0;
    var max = Math.PI;
    if (this.camera.rotation.x < min) {
        this.camera.rotation.x = min;
    }
    if (this.camera.rotation.x > max) {
        this.camera.rotation.x = max;
    }

};

// Zoom ========================================================================
// Adjusts the orthgraphic scale to zoom in or out
// Direction, -1 = counter-clockwise, 1 = clockwise
OrthoCamera.prototype.zoom = function( scaleValue ) {

    var newScale = this.orthographicScale - this.scaleSpeed * scaleValue * theTimeDelta;
    if ( newScale < 1 ) { newScale = 1; }
    this.setScale( newScale );

};

OrthoCamera.prototype.setScale = function ( scale ) {
    
    this.orthographicScale = scale;
    this.resize( theViewport.width, theViewport.height );
    
};

OrthoCamera.prototype.resize = function ( width, height ) {
    
    this.camera.left = -width * ( 0.5 / this.orthographicScale );
    this.camera.right = width * ( 0.5 / this.orthographicScale );
    this.camera.top = height * ( 0.5 / this.orthographicScale );
    this.camera.bottom = -height * ( 0.5 / this.orthographicScale );
    this.camera.updateProjectionMatrix();
    
};