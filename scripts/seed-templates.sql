-- Seed romantic templates

INSERT INTO templates (name, description, theme, html_template, css_template, js_template, customization_fields, is_public)
VALUES
(
  'Love Letter',
  'A heartfelt love letter template with elegant typography and floating hearts animation.',
  'romantic',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{{title}}</title>
</head>
<body>
  <div class="container">
    <div class="hearts"></div>
    <div class="letter">
      <h1 class="title">{{dear_name}}</h1>
      <div class="content">
        <p class="message">{{love_message}}</p>
      </div>
      <p class="signature">{{signature}}</p>
      <div class="date">{{date}}</div>
    </div>
  </div>
</body>
</html>',
  '@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: ''Georgia'', serif;
  background: linear-gradient(135deg, #ffeef8 0%, #ffe4f0 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
}

.container {
  position: relative;
  padding: 20px;
  max-width: 800px;
  width: 100%;
}

.hearts {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.letter {
  background: white;
  padding: 60px;
  border-radius: 10px;
  box-shadow: 0 20px 60px rgba(255, 20, 147, 0.2);
  animation: fadeIn 1s ease-out;
}

.title {
  color: #ff1493;
  font-size: 3em;
  margin-bottom: 30px;
  text-align: center;
  font-weight: normal;
  animation: fadeIn 1s ease-out 0.3s both;
}

.content {
  animation: fadeIn 1s ease-out 0.6s both;
}

.message {
  color: #333;
  font-size: 1.3em;
  line-height: 1.8;
  white-space: pre-wrap;
  margin-bottom: 40px;
}

.signature {
  color: #ff1493;
  font-size: 1.5em;
  text-align: right;
  font-style: italic;
  animation: fadeIn 1s ease-out 0.9s both;
}

.date {
  color: #999;
  text-align: right;
  margin-top: 10px;
  font-size: 0.9em;
  animation: fadeIn 1s ease-out 1.2s both;
}',
  'document.addEventListener("DOMContentLoaded", function() {
  const heartsContainer = document.querySelector(".hearts");
  
  function createHeart() {
    const heart = document.createElement("div");
    heart.innerHTML = "❤️";
    heart.style.position = "absolute";
    heart.style.fontSize = Math.random() * 20 + 10 + "px";
    heart.style.left = Math.random() * 100 + "%";
    heart.style.bottom = "-50px";
    heart.style.opacity = Math.random() * 0.5 + 0.3;
    heart.style.animation = `float ${Math.random() * 3 + 3}s ease-in-out infinite`;
    heart.style.transform = `translateY(${-window.innerHeight - 100}px)`;
    heart.style.transition = `transform ${Math.random() * 5 + 5}s linear`;
    
    heartsContainer.appendChild(heart);
    
    setTimeout(() => {
      heart.style.transform = `translateY(${-window.innerHeight - 100}px)`;
    }, 100);
    
    setTimeout(() => {
      heart.remove();
    }, 10000);
  }
  
  setInterval(createHeart, 500);
});',
  '[
    {"key": "title", "label": "App Title", "type": "text", "default": "A Love Letter"},
    {"key": "dear_name", "label": "Dear...", "type": "text", "default": "My Dearest"},
    {"key": "love_message", "label": "Your Message", "type": "textarea", "default": "Write your heartfelt message here..."},
    {"key": "signature", "label": "Signature", "type": "text", "default": "Forever yours"},
    {"key": "date", "label": "Date", "type": "text", "default": "February 14, 2026"}
  ]'::JSONB,
  TRUE
),
(
  'Romantic Timeline',
  'A beautiful animated timeline showcasing your journey together with photos and memories.',
  'romantic',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{{title}}</title>
</head>
<body>
  <div class="container">
    <h1 class="main-title">{{title}}</h1>
    <p class="subtitle">{{subtitle}}</p>
    
    <div class="timeline">
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <h3>{{event1_title}}</h3>
          <p class="date">{{event1_date}}</p>
          <p>{{event1_description}}</p>
        </div>
      </div>
      
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <h3>{{event2_title}}</h3>
          <p class="date">{{event2_date}}</p>
          <p>{{event2_description}}</p>
        </div>
      </div>
      
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <h3>{{event3_title}}</h3>
          <p class="date">{{event3_date}}</p>
          <p>{{event3_description}}</p>
        </div>
      </div>
      
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <h3>{{event4_title}}</h3>
          <p class="date">{{event4_date}}</p>
          <p>{{event4_description}}</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>',
  '@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: ''Helvetica Neue'', Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 40px 20px;
  color: white;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.main-title {
  text-align: center;
  font-size: 3.5em;
  margin-bottom: 10px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  animation: slideIn 1s ease-out;
}

.subtitle {
  text-align: center;
  font-size: 1.3em;
  margin-bottom: 60px;
  opacity: 0.9;
  animation: slideIn 1s ease-out 0.3s both;
}

.timeline {
  position: relative;
  padding-left: 60px;
}

.timeline::before {
  content: "";
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: rgba(255,255,255,0.3);
}

.timeline-item {
  position: relative;
  margin-bottom: 50px;
  animation: slideIn 1s ease-out backwards;
}

.timeline-item:nth-child(1) { animation-delay: 0.6s; }
.timeline-item:nth-child(2) { animation-delay: 0.9s; }
.timeline-item:nth-child(3) { animation-delay: 1.2s; }
.timeline-item:nth-child(4) { animation-delay: 1.5s; }

.timeline-dot {
  position: absolute;
  left: -50px;
  top: 0;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 0 5px rgba(255,255,255,0.2);
  animation: pulse 2s ease-in-out infinite;
}

.timeline-content {
  background: rgba(255,255,255,0.1);
  padding: 30px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
}

.timeline-content h3 {
  font-size: 1.8em;
  margin-bottom: 10px;
}

.date {
  color: #ffd700;
  font-weight: bold;
  margin-bottom: 15px;
  font-size: 1.1em;
}

.timeline-content p {
  line-height: 1.6;
  opacity: 0.95;
}',
  'document.addEventListener("DOMContentLoaded", function() {
  const items = document.querySelectorAll(".timeline-item");
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateX(0)";
      }
    });
  }, { threshold: 0.1 });
  
  items.forEach(item => observer.observe(item));
});',
  '[
    {"key": "title", "label": "Timeline Title", "type": "text", "default": "Our Love Story"},
    {"key": "subtitle", "label": "Subtitle", "type": "text", "default": "Every moment with you is precious"},
    {"key": "event1_title", "label": "Event 1 Title", "type": "text", "default": "First Meeting"},
    {"key": "event1_date", "label": "Event 1 Date", "type": "text", "default": "January 2024"},
    {"key": "event1_description", "label": "Event 1 Description", "type": "textarea", "default": "The day our eyes met..."},
    {"key": "event2_title", "label": "Event 2 Title", "type": "text", "default": "First Date"},
    {"key": "event2_date", "label": "Event 2 Date", "type": "text", "default": "February 2024"},
    {"key": "event2_description", "label": "Event 2 Description", "type": "textarea", "default": "Coffee turned into hours of conversation..."},
    {"key": "event3_title", "label": "Event 3 Title", "type": "text", "default": "First Kiss"},
    {"key": "event3_date", "label": "Event 3 Date", "type": "text", "default": "March 2024"},
    {"key": "event3_description", "label": "Event 3 Description", "type": "textarea", "default": "Under the stars, everything felt perfect..."},
    {"key": "event4_title", "label": "Event 4 Title", "type": "text", "default": "Forever"},
    {"key": "event4_date", "label": "Event 4 Date", "type": "text", "default": "Today & Always"},
    {"key": "event4_description", "label": "Event 4 Description", "type": "textarea", "default": "Every day with you is a new adventure..."}
  ]'::JSONB,
  TRUE
),
(
  'Proposal Magic',
  'The ultimate romantic proposal template with stunning animations and a magical reveal.',
  'romantic',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{{title}}</title>

<link rel="stylesheet" href="./styles.css" />
    <script src="./app.js"></script>

</head>
<body>
  <div class="stars"></div>
  <canvas id="confetti"></canvas>
  <div class="container">
    <div class="intro-section">
      <h1 class="fade-in">{{intro_title}}</h1>
      <p class="fade-in-delay">{{intro_message}}</p>
    </div>
    
    <div class="journey-section">
      <h2>{{journey_title}}</h2>
      <p>{{journey_message}}</p>
      <img src="{{journey_image}}" alt="Journey Image" class="journey-image" />
    </div>
    
    <div class="question-section" id="questionSection">
      <div class="ring">💍</div>
      <h1 class="big-question">{{question}}</h1>
      <p class="name">{{recipient_name}}</p>
      <div class="question-buttons">
          <button class="accept-button" onclick="acceptProposal()">{{accept_button_text}}</button>
          <button class="decline-button" id="declineButton">{{decline_button_text}}</button>
      </div>
    </div>

    <div class="question-accepted fade-in-delay" id="question-accepted">
        <h1>{{accepted_message}}</h1>
    </div>
  </div>
</body>
</html>',
  '@keyframes twinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: ''Playfair Display'', serif;
  background: linear-gradient(135deg, #1a0033 0%, #330033 50%, #660066 100%);
  min-height: 100vh;
  color: white;
  overflow-x: hidden;
  position: relative;
}

.stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 20px;
}

.intro-section, .journey-section, .question-section, .question-accepted {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 40px;
}

.fade-in {
  animation: fadeIn 2s ease-out;
}

.fade-in-delay {
  animation: fadeIn 2s ease-out 0.5s both;
}

.intro-section h1 {
  font-size: 4em;
  margin-bottom: 30px;
  text-shadow: 0 0 20px rgba(255,255,255,0.5);
}

.intro-section p {
  font-size: 1.5em;
  line-height: 1.8;
  max-width: 600px;
}

.journey-section {
  position: relative;
}

.journey-section h2 {
  font-size: 3em;
  margin-bottom: 30px;
  color: #ffb6c1;
}

.journey-section p {
  font-size: 1.3em;
  line-height: 1.8;
  white-space: pre-wrap;
}

.journey-image {
  margin-top: 30px;
  max-width: 100%;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(255,182,193,0.5);
  position: absolute;
  top: 50%;
  left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    height: 50vh;
    width: auto;
}

.question-section {
  position: relative;
}

.ring {
  font-size: 8em;
  animation: rotate 10s linear infinite, bounce 2s ease-in-out infinite;
  margin-bottom: 40px;
  filter: drop-shadow(0 0 30px gold);
}

.big-question {
  font-size: 4.5em;
  margin-bottom: 20px;
  color: #ffd700;
  text-shadow: 0 0 30px rgba(255,215,0,0.8);
  animation: fadeIn 2s ease-out 1s both;
}

.name {
  font-size: 2em;
  color: #ffb6c1;
  animation: fadeIn 2s ease-out 1.5s both;
}

.question-buttons {
  margin-top: 30px;
  display: flex;
    gap: 20px;
}

.accept-button {
  background-color: #226832;
  color: white;
}

.decline-button {
  background-color: #722d34;
  color: white;
}

.accept-button, .decline-button {
  font-size: 1.2em;
  padding: 15px 30px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, top 0.2s ease, left 0.2s ease, position 0.2s ease;
}

.accept-button:hover {
  transform: scale(1.1);
  box-shadow: 0 0 15px #226832;
  cursor: url("data:image/svg+xml;utf8,<svg xmlns=''http://www.w3.org/2000/svg''  width=''40'' height=''48'' viewport=''0 0 100 100'' style=''fill:black;font-size:24px;''><text y=''50%''>❤️</text></svg>")
      16 0,
    auto;
}
.decline-button:hover {
  cursor: url("data:image/svg+xml;utf8,<svg xmlns=''http://www.w3.org/2000/svg''  width=''40'' height=''48'' viewport=''0 0 100 100'' style=''fill:black;font-size:24px;''><text y=''50%''>💔</text></svg>")
      16 0,
    auto;
}

.question-accepted {
  display: none;
}

#confetti {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}',
  'document.addEventListener("DOMContentLoaded", function() {
  const starsContainer = document.querySelector(".stars");
  
  for (let i = 0; i < 200; i++) {
    const star = document.createElement("div");
    star.style.position = "absolute";
    star.style.width = Math.random() * 3 + 1 + "px";
    star.style.height = star.style.width;
    star.style.background = "white";
    star.style.borderRadius = "50%";
    star.style.top = Math.random() * 100 + "%";
    star.style.left = Math.random() * 100 + "%";
    star.style.animation = `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`;
    star.style.animationDelay = Math.random() * 3 + "s";
    starsContainer.appendChild(star);
  }
  
  // Smooth scroll through sections
  let currentSection = 0;
  const sections = document.querySelectorAll(".intro-section, .journey-section, .question-section");
  
  document.addEventListener("wheel", function(e) {
    if (e.deltaY > 0 && currentSection < sections.length - 1) {
      currentSection++;
      sections[currentSection].scrollIntoView({ behavior: "smooth" });
    } else if (e.deltaY < 0 && currentSection > 0) {
      currentSection--;
      sections[currentSection].scrollIntoView({ behavior: "smooth" });
    }
  }, { passive: true });

  
    document.getElementById("declineButton").addEventListener("mouseover", function() {
        const questionSection = document.getElementById("questionSection");
        const rect = questionSection.getBoundingClientRect();
        const randomX = Math.random() * (rect.width - this.offsetWidth);
        const randomY = Math.random() * (rect.height - this.offsetHeight);
        this.style.position = "absolute";
        this.style.left = randomX + "px";
        this.style.top = randomY + "px";
    });
});


function animateConfetti() {
    const confettiCanvas = document.getElementById("confetti");
    const confetti = confettiCanvas ? confettiCanvas.getContext("2d") : null;
    
    if (!confetti) return;
    
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    
    const colors = ["#ff0a54", "#ff477e", "#ff85a1", "#fbb1b1", "#f9bec7"];
    const confettiPieces = [];
    
    // Create confetti pieces once
    for (let i = 0; i < 100; i++) {
        confettiPieces.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 5 + 5,
            speed: Math.random() * 3 + 2,
            angle: Math.random() * 360
        });
    }
    
    function animate() {
        confetti.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        let stillAnimating = false;
        confettiPieces.forEach(piece => {
            piece.y += piece.speed;
            piece.x += Math.sin(piece.angle) * 2;
            piece.angle += 0.1;
            
            // Only draw if still on screen
            if (piece.y < confettiCanvas.height) {
                confetti.fillStyle = piece.color;
                confetti.fillRect(piece.x, piece.y, piece.size, piece.size);
                stillAnimating = true;
            }
        });
        
        // Continue animation only if confetti is still on screen
        if (stillAnimating) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

function acceptProposal() {
    document.querySelector("#questionSection").style.display = "none";
    document.querySelector("#question-accepted").style.display = "flex";
    animateConfetti();
}
',
  '[
    {"key": "title", "label": "Page Title", "type": "text", "default": "Will You Marry Me?"},
    {"key": "intro_title", "label": "Opening Title", "type": "text", "default": "From The Moment I Met You"},
    {"key": "intro_message", "label": "Opening Message", "type": "textarea", "default": "My life changed forever..."},
    {"key": "journey_title", "label": "Journey Title", "type": "text", "default": "Our Beautiful Journey"},
    {"key": "journey_message", "label": "Journey Message", "type": "textarea", "default": "Every laugh, every tear, every moment has led us here..."},
    {"key": "journey_image", "label": "Journey Image", "type": "image", "default": ""},
    {"key": "question", "label": "The Big Question", "type": "text", "default": "Will You Marry Me?"},
    {"key": "recipient_name", "label": "Their Name", "type": "text", "default": "My Love"},
    {"key": "accept_button_text", "label": "Accept Buttun Text", "type": "text", "default": "Yes"},
    {"key": "decline_button_text", "label": "Decline Buttun Text", "type": "text", "default": "No"},
    {"key": "accepted_message", "label": "Post Accepted Message", "type": "text", "default": "Thank yo for accepting the proposal!"}
  ]'::JSONB,
  TRUE
);

