/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

import {
	Euler,
	Math as _Math,
	Quaternion,
	Vector3
} from "../../../build/three.module.js";

var DeviceOrientationControls = function ( object ) {

	var scope = this;

	this.object = object;
	this.object.rotation.reorder( 'YXZ' );

	this.enabled = true;

	this.deviceOrientation = {};
	this.screenOrientation = 0;

	this.alphaOffset = 0; // radians

	var onDeviceOrientationChangeEvent = function ( event ) {

		scope.deviceOrientation = event;

	};

	var onScreenOrientationChangeEvent = function () {

		scope.screenOrientation = window.orientation || 0;

	};

	// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

	var setObjectQuaternion = function () {

		var zee = new Vector3( 0, 0, 1 );

		var euler = new Euler();

		var q0 = new Quaternion();

		var q1 = new Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

		return function ( quaternion, alpha, beta, gamma, orient ) {

			euler.set( beta, alpha, - gamma, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us

			quaternion.setFromEuler( euler ); // orient the device

			quaternion.multiply( q1 ); // camera looks out the back of the device, not the top

			quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) ); // adjust for screen orientation

		};

	}();

	this.connect = function () {

		onScreenOrientationChangeEvent(); // run once on load

		window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

		scope.enabled = true;

	};

	this.disconnect = function () {

		window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

		scope.enabled = false;

	};

	this.update = function () {

		if ( scope.enabled === false ) return;

		var device = scope.deviceOrientation;

		if ( device ) {

			// ---------------------------- changes done here, to just allow movement in Z-Axis ----------------------------

			var alpha = device.alpha;
			var beta = device.beta;
			var gamma = device.gamma;

			switch (window.screen.orientation.type) {
				case 'portrait-primary': // make image static in portrait mode (just using sensors in landscape mode)
					// sweetspot values to see the stage
					alpha = _Math.degToRad(-90); // Z-Axis
					beta = _Math.degToRad(95); // X-Axis
					gamma = _Math.degToRad(0); // Y-Axis
					break;
				case 'landscape-primary':
					if (isMobile()) { // To differentiate between PC and phone
						if (gamma < 0 && gamma >= -90) { // to bypass 'gimbal lock' problem of Euler angles
							if (alpha < 180) {
								alpha += 180;
							} else {
								alpha -= 180;
							}
						}

						alpha = _Math.degToRad(alpha); // Movement in Z-Axis depending on phone sensor
						beta = _Math.degToRad(180); // no movement in X-Axis and flip image 180°
						gamma = _Math.degToRad(85); // 85 seems about right for the hight of the stage without allowing movement in Y-Axis
					} else { // weirdly PC's are concidered 'landscape-primary'
						// static image for PC users too, because of the missing sensor
						alpha = _Math.degToRad(-90);
						beta = _Math.degToRad(100);
						gamma = _Math.degToRad(0);
					}
					break;
				case 'landscape-secondary':
					// image is being loaded exactly in opposite direction of the stage -> +180° to fix it
					alpha += 180;

					if (gamma < 0 && gamma >= -90) { // to bypass 'gimbal lock' problem of Euler angles
						if (alpha < 180) {
							alpha += 180;
						} else {
							alpha -= 180;
						}
					}
					
					alpha = _Math.degToRad(alpha);
					beta = _Math.degToRad(0);
					gamma = _Math.degToRad(95);
					break;
				case 'portrait-secondary':
					// if phone is on its head
					break;
			}

		    // ------------------------------------------------------------------------------------------------------------

			var orient = scope.screenOrientation ? _Math.degToRad( scope.screenOrientation ) : 0; // O

			setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma, orient );

		}


	};

	this.dispose = function () {

		scope.disconnect();

	};

	this.connect();

};

// checks if user is on a mobile device
function isMobile() {
	const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
	return regex.test(navigator.userAgent);
}

export { DeviceOrientationControls };
