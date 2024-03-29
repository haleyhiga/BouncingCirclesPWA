import { collideParticles } from "./collisions.js";

class Circle{
    constructor(xlow, xhigh, ylow, yhigh){ // make the circles inside these World Coordinates
        this.xlow = xlow;
        this.xhigh = xhigh;
        this.ylow = ylow;
        this.yhigh = yhigh;
        this.color = [Math.random(), Math.random(), Math.random(), 1]
        this.size = 1.0 + Math.random(); // half edge between 1.0 and 2.0
        const minx = xlow+this.size;
        const maxx = xhigh-this.size;
        this.x = minx + Math.random()*(maxx-minx);
        const miny = ylow+this.size;
        const maxy = yhigh-this.size;
        this.y = miny + Math.random()*(maxy-miny);
        this.degrees = Math.random()*90;
        this.dx = Math.random()*2+2; // 2 to 4
        if (Math.random()>.5)
            this.dx = -this.dx;
        this.dy = Math.random()*2+2;
        if (Math.random()>.5)
            this.dy = - this.dy;
    }

    update(DT, circleList, me, gravity) {  // pass in list of circles and know which circle you are

        // air friction:
        const AIR_FRICTION = 0.999;
        this.dx *= AIR_FRICTION;
        this.dy *= AIR_FRICTION;

        // gravity:
        //const GRAVITY = -0.5;
        this.dx += gravity[0]*DT*10;
        this.dy += gravity[1]*DT*10;

    }

    update2(DT, circleList, me) {
        // Ball Wall Collisions
        if(this.x+this.dx*DT +this.size > this.xhigh){
            this.dx = -Math.abs(this.dx);
        }
        if(this.x+this.dx*DT -this.size < this.xlow){
            this.dx = Math.abs(this.dx);
        }
        if(this.y+this.dy*DT +this.size > this.yhigh){
            this.dy = -Math.abs(this.dy);
        }
        if(this.y+this.dy*DT -this.size < this.ylow){
            this.dy = Math.abs(this.dy);
        }

        for (let i = me + 1; i < circleList.length; i++) { // loop through all circles after "me"
            const xdiff = circleList[me].x + circleList[me].dx * DT - (circleList[i].x + circleList[i].dx * DT); // is where im gonna be going to intersect where he's gonna be?
            // compares me and i
            const ydiff = circleList[me].y + circleList[me].dy * DT - (circleList[i].y + circleList[i].dy * DT);
            // do pythagrean theorem
            const distance = Math.sqrt(xdiff * xdiff + ydiff * ydiff);
            const sumRadius = circleList[me].size + circleList[i].size; // double check this?
            if (distance < sumRadius) {
                // if there is a collision
                collideParticles(circleList[me], circleList[i], DT, 0.9);
              }
            
        }

    }

 update3(DT, circleList, me) {
        // Ball Ball Collisions
        this.x += this.dx*DT;
        this.y += this.dy*DT;
   }

    
    draw(gl, shaderProgram){
        drawCircle(gl, shaderProgram, this.color, this.degrees, this.x, this.y, this.size);
    }
}



function CreateCircleVertices(sides) {
    const positions = [];
    positions.push(0);
    positions.push(0);
    for (let i = 0; i < sides + 1; i++) {
      const radians = i / sides * 2 * Math.PI;
      const x = Math.cos(radians);
      const y = Math.sin(radians);
      positions.push(x);
      positions.push(y);
    }
    return positions;
}

function drawCircle(gl, shaderProgram, color, degrees, x, y, size){
    //
    // Create the vertexBufferObject
    //
	const sides = 64;
	const circleVertices = CreateCircleVertices(sides);

	const circleVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, circleVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleVertices), gl.STATIC_DRAW);

	//
	// Set Vertex Attributes
	//
	const positionAttribLocation = gl.getAttribLocation(shaderProgram, 'vertPosition');
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		2, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.enableVertexAttribArray(positionAttribLocation);

	//
	// Set Uniform uColor
	//
	const colorUniformLocation = gl.getUniformLocation(shaderProgram, "uColor");
	gl.uniform4fv(colorUniformLocation, color);

	//
	// Set Uniform uModelViewMatrix
	//
    const modelViewMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [x, y, 0]);
    mat4.scale(modelViewMatrix, modelViewMatrix, [size, size, 1]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, (degrees* Math.PI / 180), [0, 0, 1]);
    gl.uniformMatrix4fv( modelViewMatrixUniformLocation, false, modelViewMatrix);	  	

    //
    // Starts the Shader Program, which draws the current object to the screen.
    //
    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, sides+2);
}

export { Circle, drawCircle };