import confetti from 'canvas-confetti';

document.addEventListener('DOMContentLoaded', () => {
  const mainText = document.getElementById('main-text');
  const actionBtn = document.getElementById('action-btn');
  const dots = document.getElementById('dots');
  const mainBg = document.getElementById('main-bg');
  const bgMusic = document.getElementById('bg-music');
  const curtainsContainer = document.getElementById('curtains');
  const glassModal = document.getElementById('glass-modal');
  const bgTextLayer = document.getElementById('bg-text-layer');
  const letterLayer = document.getElementById('letter-layer');
  const galleryLayer = document.getElementById('gallery-layer');
  const memoriesBtn = document.getElementById('memories-btn');
  const memoriesContainer = document.getElementById('memories-btn-container');
  const balloonsContainer = document.getElementById('balloons-container');
  const poetryContainer = document.getElementById('poetry-text-container');
  const cursorTrail = document.getElementById('cursor-trail');
  const ambientDustContainer = document.getElementById('ambient-dust');

  // ---------- Ambient Dust Spawner ----------
  function createDust() {
    for(let i = 0; i < 30; i++) {
      let dust = document.createElement('div');
      dust.className = 'dust';
      let size = Math.random() * 4 + 1 + 'px';
      dust.style.width = size;
      dust.style.height = size;
      dust.style.left = Math.random() * 100 + 'vw';
      dust.style.top = Math.random() * 100 + 'vh';
      dust.style.animationDelay = Math.random() * 15 + 's';
      ambientDustContainer.appendChild(dust);
    }
  }
  createDust();

  // ---------- Heart Cursor Trail ----------
  document.addEventListener('mousemove', (e) => {
    // Holographic Parallax Math (tilt values between -10deg and 10deg)
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    document.documentElement.style.setProperty('--tiltX', `${xAxis}deg`);
    document.documentElement.style.setProperty('--tiltY', `${-yAxis}deg`);
    
    // Cursor Hearts
    if(Math.random() > 0.6) { // throttle a bit
      const heart = document.createElement('div');
      heart.className = 'cursor-heart';
      // Center the heart graphic directly on pointer
      heart.style.left = (e.pageX - 6) + 'px';
      heart.style.top = (e.pageY - 6) + 'px';
      cursorTrail.appendChild(heart);
      setTimeout(() => { heart.remove(); }, 800);
    }
  });

  // ---------- Typewriter Effect ----------
  const poetryLines = [
    "'You are teacher eyes shed tears for,",
    "whose moments live forever in the heart,",
    "And who stays close, even when miles pull us apart'"
  ];
  
  function typeWriter() {
    poetryContainer.innerHTML = '';
    let lineIndex = 0;
    let charIndex = 0;
    let currentLineEl = document.createElement('div');
    poetryContainer.appendChild(currentLineEl);

    function typeChar() {
      if (lineIndex < poetryLines.length) {
        if (charIndex < poetryLines[lineIndex].length) {
          currentLineEl.innerHTML += poetryLines[lineIndex].charAt(charIndex);
          charIndex++;
          setTimeout(typeChar, 40); // typing speed
        } else {
          // Finished a line
          lineIndex++;
          charIndex = 0;
          if (lineIndex < poetryLines.length) {
            currentLineEl = document.createElement('div');
            poetryContainer.appendChild(currentLineEl);
            setTimeout(typeChar, 300); // pause between lines
          } else {
            // Typing completely finished
            setTimeout(() => {
              memoriesBtn.classList.remove('hidden');
              memoriesContainer.classList.remove('fade-out');
              memoriesContainer.classList.add('fade-in');
            }, 500);
          }
        }
      }
    }
    typeChar();
  }

  // ---------- Scene Data ----------
  const scenes = [
    {
      text: "It's Your Special Day",
      btnState: "Next",
      showDots: true,
      action: () => {}
    },
    {
      text: "Have a look at madam ji 😊",
      btnState: "Next"
    },
    {
      text: "Ready for your surprise..?",
      btnState: "Next"
    },
    {
      text: "The stage is ready",
      btnState: "Turn on lights",
      action: () => {
        mainBg.classList.remove('dark-mode');
        mainBg.classList.add('lit-mode');
        mainText.classList.add('lit-text');
      }
    },
    {
      text: "Music makes it better",
      btnState: "Play music",
      action: () => {
        bgMusic.volume = 0.6;
        // Start the song from exactly 16 seconds
        bgMusic.currentTime = 16;
        bgMusic.play().catch(e => console.log('Audio error:', e));
      }
    },
    {
      text: "Let the colors fly",
      btnState: "Celebrate",
      action: () => {
        fireConfettiAndBalloons();
      }
    },
    {
      text: "Almost here...",
      btnState: "Show the message",
      action: () => {
        curtainsContainer.classList.remove('hidden');
      }
    },
    {
      text: "",
      btnState: null, // Hidden
      action: () => {
        // Hide UI and open curtains
        glassModal.classList.add('fade-out');
        bgTextLayer.classList.add('fade-out');
        // Hide ambient dust for the clean letter view
        ambientDustContainer.style.opacity = '0';
        
        setTimeout(() => {
          glassModal.classList.add('hidden');
          letterLayer.classList.remove('hidden'); 
          setTimeout(() => {
            curtainsContainer.classList.add('curtain-open');
            // Trigger typewriter 1 second after curtains open
            setTimeout(typeWriter, 1200);
          }, 100);
        }, 500);
      }
    }
  ];

  let currentStep = 0;

  // Cinematic Intro
  setTimeout(() => {
    bgTextLayer.classList.add('dimmed');
    glassModal.classList.add('appear');
    
    mainText.innerText = scenes[currentStep].text;
    actionBtn.innerText = scenes[currentStep].btnState;
    actionBtn.classList.remove('hidden');
    dots.classList.remove('hidden');
  }, 3500);

  // Sequence Button Click
  actionBtn.addEventListener('click', () => {
    if (scenes[currentStep].action) scenes[currentStep].action();
    currentStep++;

    if (currentStep < scenes.length) {
      const nextScene = scenes[currentStep];
      mainText.style.opacity = 0;
      actionBtn.style.opacity = 0;
      if (!nextScene.showDots) dots.style.opacity = 0;

      setTimeout(() => {
        mainText.innerText = nextScene.text;
        
        if (nextScene.btnState !== null) {
          actionBtn.innerText = nextScene.btnState;
          actionBtn.style.opacity = 1;
        } else {
          actionBtn.classList.add('hidden');
        }

        if (nextScene.showDots) dots.style.opacity = 1;
        else dots.classList.add('hidden');

        mainText.style.opacity = 1;
        if (nextScene.btnState === null && nextScene.action) nextScene.action();
      }, 400);
    }
  });

  // Open Polaroid Gallery
  memoriesBtn.addEventListener('click', () => {
    letterLayer.classList.add('fade-out');
    curtainsContainer.classList.add('hidden');
    setTimeout(() => {
      letterLayer.classList.add('hidden');
      mainBg.classList.remove('lit-mode'); 
      galleryLayer.classList.remove('hidden');
      
      // Scatter the Polaroids
      const polaroids = document.querySelectorAll('.polaroid-item');
      polaroids.forEach((item, index) => {
        setTimeout(() => {
          // Generate a random slight rotation (-15deg to +15deg)
          const angle = Math.floor(Math.random() * 30) - 15;
          // Note: using !important in css for hover, so we set rotation inline
          item.style.transform = `translateY(0) rotate(${angle}deg)`;
          item.classList.add('scattered');
        }, index * 200); // 200ms delay between each flying in
      });
    }, 500);
  });

  // Confetti and Balloons logic
  function fireConfettiAndBalloons() {
    var duration = 3 * 1000;
    var end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5, angle: 60, spread: 55, origin: { x: 0 },
        colors: ['#ff0000', '#ffffff', '#800000']
      });
      confetti({
        particleCount: 5, angle: 120, spread: 55, origin: { x: 1 },
        colors: ['#ff0000', '#ffffff', '#800000']
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());

    // Balloons
    balloonsContainer.classList.remove('hidden');
    const colors = ['#ff0000', '#330000', '#ffffff', '#800000'];
    
    for (let i = 0; i < 15; i++) {
      let balloon = document.createElement('div');
      balloon.className = 'balloon';
      let leftPosition = Math.floor(Math.random() * 100) + 'vw';
      let animationDuration = Math.random() * 3 + 4 + 's';
      let delay = Math.random() * 2 + 's';
      let bgCol = colors[Math.floor(Math.random() * colors.length)];

      balloon.style.left = leftPosition;
      balloon.style.animationDuration = animationDuration;
      balloon.style.animationDelay = delay;
      balloon.style.backgroundColor = bgCol;
      balloon.style.setProperty('--balloon-col', bgCol);

      balloonsContainer.appendChild(balloon);
    }
  }

  // ---------- Final Transition Logic ----------
  const finalBtn = document.getElementById('final-btn');
  const finalLayer = document.getElementById('final-layer');
  const finalUniverse = document.getElementById('final-universe');
  const finalTitle = document.getElementById('final-title');
  const finalSignature = document.getElementById('final-signature');
  const finalBg = document.getElementById('final-bg');

  const finalPhotos = [
    './photo10.png',
    './photo2.jpeg', './photo3.jpg', 
    './photo4.jpg', './photo5.jpg', './photo6.jpg',
    './photo7.jpeg', './photo8.jpg', './photo9.jpg'
  ];
  let currentPhotoIndex = 0;

  function changeBackground() {
    if (finalBg) {
      currentPhotoIndex = (currentPhotoIndex + 1) % finalPhotos.length;
      finalBg.style.backgroundImage = `url('${finalPhotos[currentPhotoIndex]}')`;
    }
  }

  if (finalBtn) {
    finalBtn.addEventListener('click', () => {
      // Bring curtains forward to cover the gallery
      curtainsContainer.style.zIndex = '150';
      curtainsContainer.classList.remove('hidden');
      
      // Close the curtains
      setTimeout(() => {
        curtainsContainer.classList.remove('curtain-open');
      }, 50);

      // Wait for curtains to fully close (approx 2s), then swap layers
      setTimeout(() => {
        galleryLayer.classList.add('hidden');
        finalLayer.classList.remove('hidden');
        
        // Start background slideshow
        setInterval(changeBackground, 3000);

        // Re-open the curtains to reveal final layer
        curtainsContainer.classList.add('curtain-open');
        
        // Trigger animations for the final text
        setTimeout(() => {
          if (finalUniverse) {
            finalUniverse.style.opacity = '1';
            finalUniverse.style.transform = 'translateY(0)';
          }
          if (finalTitle) {
            finalTitle.style.opacity = '1';
            finalTitle.style.transform = 'translateY(0)';
          }
          if (finalSignature) {
            finalSignature.style.opacity = '1';
            finalSignature.style.transform = 'translateY(0)';
          }
        }, 1500); // Wait for curtains to open halfway
      }, 2050);
    });
  }
});
