/* global THREE */

var camera, scene, renderer;
var cameraControls;
var teapotSize = 400;

var materialColor = new THREE.Color();
materialColor.setRGB( 1.0, 1.0, 1.0 );

var skyplaneHeight = 125000;
var skyplaneWidth = 250000;
var skyboxDistance = 125000;
var skyboxTexture = new THREE.TextureLoader().load( 'backdrop.png' );
skyboxTexture.wrapS = THREE.RepeatWrapping;
var skyboxGeometry = new THREE.PlaneGeometry(skyplaneWidth, skyplaneHeight);
var skyboxMaterial = new THREE.MeshBasicMaterial( {
	map: skyboxTexture
});

var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
skybox.position.z = -skyboxDistance;

var container = document.getElementById( 'container' );

var frustumFarDistance = 150000;
camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, frustumFarDistance);
camera.position.set( -600, 550, 1300 );
camera.target = new THREE.Vector3( 0, 0, 0 );
camera.add(skybox);
scene = new THREE.Scene();

renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );

// TODO: enable rolling ability with something like TrackballControls
cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
cameraControls.target.set( 0, 0, 0 );

cameraControls.addEventListener( 'change', render );

var	ambientLight = new THREE.AmbientLight( 0x333333 );
var light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
light.position.x = light.position.y = light.position.z = 0.025;
scene.add(ambientLight);
scene.add(light);

var teapot = new THREE.Mesh(
	new THREE.TeapotBufferGeometry( teapotSize, 15, true, true, true, false, true),
	new THREE.MeshPhongMaterial( { color: materialColor, shading: THREE.SmoothShading, side: THREE.DoubleSide } ));
scene.add( teapot );

scene.add(camera);

function render() {
	skybox.rotation.x = -camera.rotation.x;
	skyboxTexture.offset.x = -camera.rotation.y;
	skyboxTexture.offset.y = camera.rotation.x / 2;
	renderer.render( scene, camera );
}

window.addEventListener('resize',			function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	render();
});
