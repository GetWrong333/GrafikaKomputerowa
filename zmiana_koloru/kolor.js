let gl, program, colorLocation;
let currentColor = [0.0, 0.0, 0.0, 1.0]; // kolor poczatkowy

function main() {
    const canvas = document.getElementById('canvas');
    gl = canvas.getContext('webgl');

    if (!gl) {
        console.error('WebGL nie jest wspierany.');
        return;
    }

  
    const vertices = new Float32Array([
        0.0,  0.5,  
       -0.5, -0.5,  
        0.5, -0.5   
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

   
    const vertexShaderSource = `
        attribute vec2 aPosition;
        void main() {
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
    `;

    const fragmentShaderSource = `
        precision mediump float;
        uniform vec4 uColor;
        void main() {
            gl_FragColor = uColor;
        }
    `;

 
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  
    program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

 
    const positionLocation = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    
    colorLocation = gl.getUniformLocation(program, 'uColor');


    drawTriangle();

    // Podłączanie funkcji zmiany koloru do przycisku
    const button = document.getElementById('colorButton');
    button.addEventListener('click', changeColor);
}


function changeColor() {
    // Losowe generowanie oprocz ostatniego, zeby figura byla zawsze widoczna
    currentColor = [Math.random(), Math.random(), Math.random(), 1.0];
    drawTriangle();
}


function drawTriangle() {
  
    gl.uniform4fv(colorLocation, currentColor);

   
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}


function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Błąd kompilacji shadera:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}


function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Błąd linkowania programu:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }

    return program;
}

window.onload = main;
