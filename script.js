document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas to full window size
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight / 2; // Bottom half of the screen
    }
    
    // Initialize canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Light blue wave parameters
    const waves = [
      {
        color: 'rgba(173, 216, 230, 0.8)', // Light Blue
        amplitude: 30,
        frequency: 0.02,
        speed: 0.05,
        phase: 0
      },
      {
        color: 'rgba(135, 206, 235, 0.7)', // Sky Blue
        amplitude: 25,
        frequency: 0.03,
        speed: 0.07,
        phase: 2
      },
      {
        color: 'rgba(176, 224, 230, 0.6)', // Powder Blue
        amplitude: 20,
        frequency: 0.01,
        speed: 0.03,
        phase: 4
      },
      {
        color: 'rgba(127, 205, 255, 0.5)', // Baby Blue
        amplitude: 15,
        frequency: 0.04,
        speed: 0.06,
        phase: 6
      }
    ];
    
    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      waves.forEach((wave, index) => {
        drawWave(wave, index);
        wave.phase += wave.speed;
      });
      
      requestAnimationFrame(animate);
    }
    
    // Draw wave function
    function drawWave(waveParams, waveIndex) {
      const { color, amplitude, frequency, phase } = waveParams;
      const height = canvas.height;
      
      ctx.beginPath();
      ctx.moveTo(0, height);
      
      for (let x = 0; x <= canvas.width; x++) {
        // Calculate y position with multiple sine waves for more natural movement
        let y = amplitude * Math.sin(x * frequency + phase);
        y += amplitude * 0.5 * Math.sin(x * frequency * 2 + phase * 1.5);
        y += amplitude * 0.3 * Math.cos(x * frequency * 0.5 + phase * 0.7);
        
        // Position waves from bottom with overlapping
        const basePosition = height - 50 - waveIndex * 20;
        ctx.lineTo(x, basePosition + y);
      }
      
      // Complete the wave shape by drawing to bottom corners
      ctx.lineTo(canvas.width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      
      // Fill with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      const baseColor = color.replace(/[^,]+\)/, '1)'); // Full opacity version
      gradient.addColorStop(0, baseColor);
      gradient.addColorStop(1, color);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
    
    // Start animation
    animate();
    
    // Add interactive effect - waves respond to mouse/touch movement
    canvas.addEventListener('mousemove', function(e) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Adjust wave parameters based on mouse position
      waves.forEach(wave => {
        // Mouse X position affects frequency
        wave.frequency = 0.01 + (mouseX / canvas.width) * 0.03;
        
        // Mouse Y position affects amplitude
        const relativeY = mouseY / window.innerHeight;
        wave.amplitude = 15 + relativeY * 30;
      });
    });
  
    // Touch support for mobile devices
    canvas.addEventListener('touchmove', function(e) {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseX = touch.clientX;
      const mouseY = touch.clientY;
      
      // Adjust wave parameters based on touch position
      waves.forEach(wave => {
        wave.frequency = 0.01 + (mouseX / canvas.width) * 0.03;
        const relativeY = mouseY / window.innerHeight;
        wave.amplitude = 15 + relativeY * 30;
      });
    }, { passive: false });
  });