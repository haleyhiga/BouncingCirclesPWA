import { Circle } from "./circle.js";
import {initShaderProgram} from "./shader.js";

main();
async function main() {
	console.log('This is working');

	const gravity = [0,-1]

 	if (!(window.DeviceOrientationEvent == undefined)) {
		window.addEventListener("deviceorientation", handleOrientation);
		}
	 

		
	function handleOrientation(event) {
		let x = event.beta; // In degree in the range [-180,180)
		let y = event.gamma; // In degree in the range [-90,90)

		if (x==null || y==null){
			gravity[0] = 0;
			gravity[1] = -1;
		}
		else{
			// Because we don't want to have the device upside down
			// We constrain the x value to the range [-90,90]
			if (x > 90) {
			x = 90;
			}
			if (x < -90) {
			x = -90;
			}

			gravity[0] = y/90; // -1 to +1
			gravity[1] = -x/90; // flip y upside down.
		}
	} 

		// As of iOS 13 beta 2, we need to call DeviceOrientationEvent and request permission for accelerometer
		if (
			DeviceOrientationEvent &&
			typeof DeviceMotionEvent.requestPermission === "function"
		) {
			const button = document.createElement("button");
			button.innerText = "Enable Device Orientation";
			document.body.appendChild(button);
	
			button.addEventListener("click", function () {
				DeviceOrientationEvent.requestPermission()
				.then((permissionState) => {
					if (permissionState === "granted") {
						window.addEventListener("deviceorientation", handleOrientation, true);
						button.style.display = "none";
					} else {
						alert("Device orientation permission not granted");
					}
				})
				.catch(console.error);
		});
	} else {
		window.addEventListener("deviceorientation", handleOrientation, true);
	}

	//
	// Init gl
	// 
	const canvas = document.getElementById('glcanvas');
	const gl = canvas.getContext('webgl');

	if (!gl) {
		alert('Your browser does not support WebGL');
	}

	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//
	// Create shaderProgram
	// 
	const vertexShaderText = await (await fetch("simple.vs")).text();
    const fragmentShaderText = await (await fetch("simple.fs")).text();
	let shaderProgram = initShaderProgram(gl, vertexShaderText, fragmentShaderText);
	gl.useProgram(shaderProgram);


	//
	// Set Uniform uProjectionMatrix
	//	
	const projectionMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
	const aspect = canvas.clientWidth / canvas.clientHeight;
	const projectionMatrix = mat4.create();
	const yhigh = 10;
	const ylow = -yhigh;
	const xlow = ylow * aspect;
	const xhigh = yhigh * aspect;
	mat4.ortho(projectionMatrix, xlow, xhigh, ylow, yhigh, -1, 1);
	gl.uniformMatrix4fv(
		projectionMatrixUniformLocation,
		false,
		projectionMatrix
	);

	//
	// Create the objects in the scene:
	//
	// while circleList.length < NUM_CIRCLES, make new circle and compare that circle to the previous
	// circle and see if they intercept, if they do, you wont use that circle, if doesnt
	// intercept then add to circle list

	const NUM_CIRCLES = 5;
	const circleList = []


	while (circleList.length < NUM_CIRCLES) {
		let r = new Circle(xlow, xhigh, ylow, yhigh);
		// push first circle to list
		if (circleList.length === 0) {
			circleList.push(r);
		
		} else {
			
			let isIntersecting = false;
	
			// checking for intersection between previous circles
			for (let i = 0; i < circleList.length; i++) {
				const prevCircle = circleList[i];
	
				// check if intersecting with previous circles
				const xdiff = r.x - prevCircle.x;
				const ydiff = r.y - prevCircle.y;
				const distance = Math.sqrt(xdiff * xdiff + ydiff * ydiff);
				const sumRadius = r.size + prevCircle.size;
	
				if (distance < sumRadius) {
					// if circles are intersecting
					isIntersecting = true;
					break;
				}
			}
	
			// if not intersecting, add to list
			if (!isIntersecting) {
				circleList.push(r);
			}
		}
	}

	//
	// Main render loop
	//
	let previousTime = 0;
	function redraw(currentTime) {
		currentTime*= .001; // milliseconds to seconds
		let DT = currentTime - previousTime;
		previousTime = currentTime;
		if(DT > .1){
			DT = .1;
		}
	
		// Clear the canvas before we start drawing on it.
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// Update the scene
		for (let i = 0; i < NUM_CIRCLES; i++) {
			circleList[i].update(DT, circleList, i, gravity);
		}

		for (let i = 0; i < NUM_CIRCLES; i++) {
			for (let j = 0; j < NUM_CIRCLES; j++) {
				circleList[i].update2(DT, circleList, j);
			}
		}

		for (let i = 0; i < NUM_CIRCLES; i++) {
			circleList[i].update3(DT, circleList, i);
		}

		// Draw the scene
		for (let i = 0; i < NUM_CIRCLES; i++) {
			//circleList[i].draw(gl, shaderProgram, 0,0, gravity[0], gravity[1]);
			circleList[i].draw(gl, shaderProgram);
		}
	   
	
		requestAnimationFrame(redraw);
	  }	
	  requestAnimationFrame(redraw);
};

