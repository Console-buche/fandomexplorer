export const vertexShaderHolonavigation = `
attribute float doorPosition;
uniform bool uIsOpen;
uniform float uTime;

varying vec2 vUv;
varying float vDoorPosition;
varying float vPosY;



void main() {
    vUv = uv;
    vDoorPosition = doorPosition;

    vec4 modelPosition = modelViewMatrix * vec4(position, 1.0);
    
    if (uIsOpen) {
        modelPosition.y += doorPosition == 0. ? uTime : -uTime;
        // modelPosition.y += doorPosition == 0. ? 0.001 : -0.001;
    }
    
    gl_Position = projectionMatrix * modelPosition;
    vPosY = gl_Position.y;
}
`;

export const fragmentShaderHolonavigation = `
uniform sampler2D uTextureTop;
uniform sampler2D uTextureBottom;
uniform float uClipBot;
uniform float uClipTop;

// uniform boolean uIsOpen;
varying vec2 vUv;
varying float vDoorPosition;
varying float vPosY;



void main() {



    if ( vPosY < uClipBot || vPosY > uClipTop) {
        discard;
    }

    
    vec4 color = vDoorPosition == 0. ? texture2D(uTextureTop, vUv) :  texture2D(uTextureBottom, vUv);

   


    gl_FragColor = vec4(color);
}
`;
