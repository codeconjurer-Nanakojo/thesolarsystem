document.addEventListener('DOMContentLoaded', () => {
  // Planet information data
  const planetInfo = {
    sun: { title: "The Sun", details: "Diameter: 1.4M km<br>Temperature: 5,500°C<br>Mass: 330,000 Earths" },
    mercury: { title: "Mercury", details: "Diameter: 4,880 km<br>Orbit: 88 days<br>Surface Temp: -173°C to 427°C" },
    venus: { title: "Venus", details: "Diameter: 12,104 km<br>Orbit: 225 days<br>Surface Temp: 462°C" },
    earth: { title: "Earth", details: "Diameter: 12,742 km<br>Orbit: 365.25 days<br>Surface Temp: -88°C to 58°C" },
    mars: { title: "Mars", details: "Diameter: 6,779 km<br>Orbit: 687 days<br>Surface Temp: -153°C to 20°C" },
    jupiter: { title: "Jupiter", details: "Diameter: 139,820 km<br>Orbit: 11.9 years<br>Moons: 79 known" },
    saturn: { title: "Saturn", details: "Diameter: 116,460 km<br>Orbit: 29.5 years<br>Rings: 7 main" },
    uranus: { title: "Uranus", details: "Diameter: 50,724 km<br>Orbit: 84 years<br>Axial tilt: 98°" },
    neptune: { title: "Neptune", details: "Diameter: 49,244 km<br>Orbit: 165 years<br>Winds: 2,100 km/h" }
  };

  // Handle planet clicks
  document.querySelectorAll('.clickable').forEach(planet => {
    planet.addEventListener('click', (e) => {
      e.stopPropagation();
      const info = planetInfo[planet.id];
      if (!info) return;
      
      // Update info panel
      const panel = document.getElementById('info-panel');
      const title = document.getElementById('info-title');
      const details = document.getElementById('info-details');
      
      title.textContent = info.title;
      details.innerHTML = info.details;
      
      panel.style.opacity = 0;
      panel.style.display = 'block';
      setTimeout(() => panel.style.opacity = 1, 10);
      
      // Move camera
      const camera = document.getElementById('camera');
      const planetPos = new THREE.Vector3();
      planet.object3D.getWorldPosition(planetPos);
      
      const cameraPos = new THREE.Vector3();
      camera.object3D.getWorldPosition(cameraPos);
      
      const direction = new THREE.Vector3()
        .subVectors(cameraPos, planetPos)
        .normalize();
      
      const distance = (planet.getAttribute('radius') || 1) * 5;
      const newPos = {
        x: planetPos.x + (direction.x * distance),
        y: planetPos.y + (distance * 0.3),  // Slightly elevated view
        z: planetPos.z + (direction.z * distance)
      };
      
      camera.setAttribute('animation', {
        property: 'position',
        to: `${newPos.x} ${newPos.y} ${newPos.z}`,
        dur: 800,
        easing: 'easeOutQuad'
      });
      
      camera.setAttribute('look-at', planet);
    });
  });

  // Close panel when clicking background
  document.querySelector('a-scene').addEventListener('click', (e) => {
    if (!e.target.classList.contains('clickable') && !e.target.closest('.clickable')) {
      const panel = document.getElementById('info-panel');
      if (panel) {
        panel.style.opacity = 0;
        setTimeout(() => panel.style.display = 'none', 300);
      }
      const camera = document.getElementById('camera');
      if (camera) camera.removeAttribute('look-at');
    }
  });
});