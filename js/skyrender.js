//https://threejs.org/examples/#webgl_shaders_sky
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

			var container;

			var camera, controls, scene, renderer;

			var sky, sunSphere;

			var SPEED = 0.001;

			init();
			render();

			function initSky() {

				// Add Sky Mesh
				sky = new THREE.Sky();
				scene.add( sky.mesh );

				// Add Sun Helper
				sunSphere = new THREE.Mesh(
					new THREE.SphereBufferGeometry( 20000, 16, 8 ),
					new THREE.MeshBasicMaterial( { color: 0xffffff } )
				);
				sunSphere.position.y = - 700000;
				sunSphere.visible = false;
				scene.add( sunSphere );

				/// GUI

				var effectController  = {
					turbidity: 20,
					reileigh: 2.775,
					mieCoefficient: 0.017,
					mieDirectionalG: 0.8,
					luminance: 0.9,
					inclination: 0.4986, // elevation / inclination
					azimuth: 0.25, // Facing front,
					sun: ! true
				};

				var distance = 400000;

				function guiChanged() {

					var uniforms = sky.uniforms;
					uniforms.turbidity.value = effectController.turbidity;
					uniforms.reileigh.value = effectController.reileigh;
					uniforms.luminance.value = effectController.luminance;
					uniforms.mieCoefficient.value = effectController.mieCoefficient;
					uniforms.mieDirectionalG.value = effectController.mieDirectionalG;

					var theta = Math.PI * ( effectController.inclination - 0.5 );
					var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );

					sunSphere.position.x = distance * Math.cos( phi );
					sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
					sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );

					sunSphere.visible = effectController.sun;

					sky.uniforms.sunPosition.value.copy( sunSphere.position );

					renderer.render( scene, camera );

				}

				guiChanged();

			}

			function init() {
				var width = document.getElementById('skytron').offsetWidth;
				var height = document.getElementById('skytron').offsetHeight;
				camera = new THREE.PerspectiveCamera( 60, width / height, 100, 2000000 );
				camera.position.set( 0, 100, 2000 );

				//camera.setLens(20);

				scene = new THREE.Scene();

				

				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( width, height);
				document.getElementById('skytron').appendChild( renderer.domElement );
				renderer.domElement.className += " skytron";
				controls = new THREE.OrbitControls( camera, renderer.domElement );
				controls.addEventListener( 'change', render );
				//controls.maxPolarAngle = Math.PI / 2;
				controls.enableZoom = false;
				controls.enablePan = false;

				initSky();

				document.getElementById('skytron').addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {
				var width = document.getElementById('skytron').offsetWidth;
				var height = document.getElementById('skytron').offsetHeight;
				camera.aspect = width / height;
				camera.updateProjectionMatrix();

				renderer.setSize( width, height );

				render();

			}

			function rotateCube() {
    
    camera.rotation.y -= SPEED ;
}


			function render() {
				requestAnimationFrame(render);
    rotateCube();
				renderer.render( scene, camera );

			}
