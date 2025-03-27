
document.addEventListener('DOMContentLoaded', () => {
    // All event listeners here

        // Audio context unlock handler
        let audioUnlocked = false;
        const unlockAudio = () => {
        if (audioUnlocked) return;
        
        const clickSound = document.getElementById('click-sound');
        clickSound.play().then(() => {
            clickSound.pause();
            clickSound.currentTime = 0;
            audioUnlocked = true;
            document.getElementById('audio-unlock').style.display = 'none';
        }).catch(e => {
            console.warn("Audio unlock failed:", e);
        });
        };

        // Set up audio unlock
        document.addEventListener('click', unlockAudio, { once: true });
        document.querySelector('a-scene').addEventListener('click', unlockAudio, { once: true });

        // Planet information data
        const planetInfo = {
        sun: {
            title: "The Sun",
            details: "Diameter: 1.4M km<br>Temperature: 5,500°C<br>Mass: 330,000 Earths"
        },
        mercury: {
            title: "Mercury",
            details: "Diameter: 4,880 km<br>Orbit: 88 days<br>Surface Temp: -173°C to 427°C"
        },
        venus: {
            title: "Venus",
            details: "Diameter: 12,104 km<br>Orbit: 225 days<br>Surface Temp: 462°C"
        },
        earth: {
            title: "Earth",
            details: "Diameter: 12,742 km<br>Orbit: 365.25 days<br>Surface Temp: -88°C to 58°C"
        },
        mars: {
            title: "Mars",
            details: "Diameter: 6,779 km<br>Orbit: 687 days<br>Surface Temp: -153°C to 20°C"
        },
        jupiter: {
            title: "Jupiter",
            details: "Diameter: 139,820 km<br>Orbit: 11.9 years<br>Moons: 79 known"
        },
        saturn: {
            title: "Saturn",
            details: "Diameter: 116,460 km<br>Orbit: 29.5 years<br>Rings: 7 main"
        },
        uranus: {
            title: "Uranus",
            details: "Diameter: 50,724 km<br>Orbit: 84 years<br>Axial tilt: 98°"
        },
        neptune: {
            title: "Neptune",
            details: "Diameter: 49,244 km<br>Orbit: 165 years<br>Winds: 2,100 km/h"
        }
        };

        // Planet click handler
        document.querySelectorAll('.clickable').forEach(planet => {
        planet.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const planetId = planet.id;
            const info = planetInfo[planetId];
            if (!info) return;
            
            // Update info panel
            document.getElementById('info-title').textContent = info.title;
            document.getElementById('info-details').innerHTML = info.details;
            
            const panel = document.getElementById('info-panel');
            panel.style.opacity = 0;
            panel.style.display = 'block';
            setTimeout(() => panel.style.opacity = 1, 10);
            
            // Play sound if audio is unlocked
            if (audioUnlocked) {
            document.getElementById('click-sound').play().catch(console.log);
            }
            
            // Position camera
            const camera = document.getElementById('camera');
            const planetObj = planet.object3D;
            const planetRadius = planet.getAttribute('radius') || 1;
            const distance = planetRadius * 5;
            
            const direction = new THREE.Vector3();
            direction.subVectors(camera.object3D.position, planetObj.position).normalize();
            
            const newPos = {
            x: planetObj.position.x + (direction.x * distance),
            y: planetObj.position.y + (distance * 0.3),
            z: planetObj.position.z + (direction.z * distance)
            };
            
            camera.setAttribute('animation', {
            property: 'position',
            to: `${newPos.x} ${newPos.y} ${newPos.z}`,
            dur: 1000,
            easing: 'easeInOutQuad'
            });
            
            camera.setAttribute('look-at', planet);
        });
        });

        // Close panel when clicking elsewhere
        document.querySelector('a-scene').addEventListener('click', (e) => {
        if (!e.target.classList.contains('clickable') && !e.target.closest('.clickable')) {
            const panel = document.getElementById('info-panel');
            if (panel) {
            panel.style.opacity = 0;
            setTimeout(() => panel.style.display = 'none', 300);
            }
            document.getElementById('camera').removeAttribute('look-at');
        }
        });

//   later added?
function setupLOD() {
    const planets = {
      'sun': { highRes: '#sun', lowRes: '#sun-lowres', swapDistance: 30 },
      'earth': { highRes: '#earth', lowRes: '#earth-lowres', swapDistance: 20 }
    };
  
    document.addEventListener('camera-set-active', ({ detail }) => {
      const camera = detail.camera;
      setInterval(() => {
        Object.entries(planets).forEach(([id, { highRes, lowRes, swapDistance }]) => {
          const planet = document.getElementById(id);
          const distance = planet.object3D.position.distanceTo(camera.position);
          planet.setAttribute('material', 'src', distance > swapDistance ? lowRes : highRes);
        });
      }, 500); // Check every 500ms
    });
  }

//   loading screen 
// Replace your existing loading code with this:
function setupLoadingSystem() {
    const scene = document.querySelector('a-scene');
    const loadingScreen = document.getElementById('loading-screen');
    const loadingBar = document.getElementById('loading-bar');
    const loadingText = document.getElementById('loading-text');
    
    // Show loading screen immediately
    loadingScreen.style.display = 'flex';
    
    // Real loading progress tracker
    let assetsLoaded = 0;
    const totalAssets = document.querySelectorAll('a-assets > *').length;
    
    // Update progress function
    function updateProgress() {
      assetsLoaded++;
      const percent = Math.floor((assetsLoaded / totalAssets) * 100);
      loadingBar.style.width = `${percent}%`;
      loadingText.textContent = `Loading Solar System... ${percent}%`;
      
      if (percent >= 100) {
        setTimeout(() => {
          loadingScreen.style.opacity = '0';
          setTimeout(() => loadingScreen.remove(), 500);
        }, 300);
      }
    }
    
    // Listen for when each asset loads
    document.querySelectorAll('a-assets > *').forEach(asset => {
      asset.addEventListener('loaded', updateProgress);
      asset.addEventListener('error', updateProgress); // Count even if error
    });
    
    // Fallback in case some assets don't trigger events
    setTimeout(() => {
      if (assetsLoaded < totalAssets * 0.9) { // If less than 90% loaded
        loadingText.textContent = "Almost there...";
        loadingBar.style.width = "95%";
        setTimeout(() => loadingScreen.remove(), 1000);
      }
    }, 10000); // 10 second timeout
  }
  
  // Call this at the end of your script.js
  document.addEventListener('DOMContentLoaded', setupLoadingSystem);
 });

