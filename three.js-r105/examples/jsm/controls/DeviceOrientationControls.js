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

			// ------------------------- some changes done here, to just allow movement in Z-Axis -------------------------

			var beta = _Math.degToRad(0) // no movement in X-Axis and turn image 90°
		  //var beta = device.beta ? _Math.degToRad( device.beta ) : 0; // X'

			var gamma = _Math.degToRad(95) // 1.65 seems about right for the hight of the stage without allowing movement in Y-Axis
		  //var gamma = device.gamma ? _Math.degToRad( device.gamma ) : 0; // Y''

			var alphaCorrected = device.alpha;
			/*if (gamma < 0 && gamma > -90) { // to bypass 'gimbal lock' problem of Euler angles
				if (alphaCorrected < 180) {
					alphaCorrected += 180;
				} else {
					alphaCorrected -= 180;
				}
			}*/
			
			var alpha = _Math.degToRad( alphaCorrected ) + scope.alphaOffset; // Z
			console.log("alpha: " + device.alpha + " , beta: " + device.beta + " , gamma:" + device.gamma);

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

export { DeviceOrientationControls };
