document.addEventListener('DOMContentLoaded', () => {
    // === MUSIC PLAYER LOGIC ===
    const musicBtn = document.getElementById('music-toggle');
    const bgm = document.getElementById('bgm');
    const musicDisc = document.getElementById('music-disc');
    const musicIcon = musicBtn.querySelector('i');
    const musicTitle = document.querySelector('.music-title');

    let isPlaying = false;

    // Error Handling for Audio
    bgm.addEventListener('error', (e) => {
        console.error("Audio Error:", bgm.error);
        musicTitle.textContent = "音乐加载失败";
        musicTitle.style.color = "red";
        alert("背景音乐加载失败，可能是因为版权限制或网络问题。\n建议您下载 '一生所爱.mp3' 到本地，并修改 index.html 中的音频路径。");
    });

    bgm.addEventListener('waiting', () => {
        musicTitle.textContent = "缓冲中...";
    });

    bgm.addEventListener('canplay', () => {
        if(!isPlaying) musicTitle.textContent = "一生所爱 - 点击播放";
    });

    bgm.addEventListener('play', () => {
        musicTitle.textContent = "正在播放: 一生所爱";
    });

    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgm.pause();
            musicDisc.classList.remove('playing');
            musicIcon.className = 'fas fa-play';
        } else {
            const playPromise = bgm.play();
            
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    // Automatic playback started!
                    musicDisc.classList.add('playing');
                    musicIcon.className = 'fas fa-pause';
                })
                .catch(error => {
                    console.log("Audio play failed:", error);
                    musicDisc.classList.remove('playing');
                    musicIcon.className = 'fas fa-play';
                    isPlaying = false; 
                    alert("无法播放音乐。请尝试：\n1. 检查网络连接\n2. 浏览器可能阻止了自动播放，请手动多次点击按钮\n3. 链接可能已失效");
                });
            }
        }
        isPlaying = !isPlaying;
    });

    // Set volume
    bgm.volume = 0.5;


    // === MATH CHALLENGE LOGIC ===
    const mathModal = document.getElementById('math-modal');
    const num1El = document.getElementById('num1');
    const num2El = document.getElementById('num2');
    const mathAnswerEl = document.getElementById('math-answer');
    const submitMathBtn = document.getElementById('submit-math');
    const errorMsgEl = document.getElementById('error-msg');

    // Generate random numbers (1-20)
    const n1 = Math.floor(Math.random() * 20) + 1;
    const n2 = Math.floor(Math.random() * 20) + 1;
    const correctAnswer = n1 + n2;

    num1El.textContent = n1;
    num2El.textContent = n2;

    // Prevent scrolling while modal is open
    document.body.style.overflow = 'hidden';

    const checkAnswer = () => {
        const userAnswer = parseInt(mathAnswerEl.value);
        if (userAnswer === correctAnswer) {
            // Correct Answer
            mathModal.style.opacity = '0';
            mathModal.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                mathModal.remove();
                document.body.style.overflow = 'auto'; // Restore scrolling
                // Start typing effect after modal closes
                startTypingEffect();
                
                // Try to auto-play music (often blocked, but worth a try)
                // bgm.play().catch(() => console.log("Autoplay blocked"));
                
            }, 500);
        } else {
            // Wrong Answer
            errorMsgEl.textContent = "算错了！请重试！(You failed the test!)";
            mathAnswerEl.value = '';
            mathAnswerEl.focus();
            // Shake animation
            const modalContent = document.querySelector('.modal-content');
            modalContent.style.animation = 'none';
            modalContent.offsetHeight; /* trigger reflow */
            modalContent.style.animation = 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both';
        }
    };

    submitMathBtn.addEventListener('click', checkAnswer);

    mathAnswerEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    // Add shake keyframes dynamically
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
        }
    `;
    document.head.appendChild(styleSheet);


    // === ORIGINAL SITE LOGIC ===
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    // Mobile Menu Toggle
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80; // Updated header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Navbar background change on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
            navbar.style.background = "rgba(255, 255, 255, 0.98)";
        } else {
            navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.05)";
            navbar.style.background = "rgba(255, 255, 255, 0.95)";
        }
    });

    // Typing Effect Function (Called after modal closes)
    function startTypingEffect() {
        const textElement = document.querySelector('.typing-effect');
        if (textElement) {
            const text = textElement.getAttribute('data-text') || textElement.textContent;
            // Save text in data attribute if not already
            if (!textElement.getAttribute('data-text')) {
                textElement.setAttribute('data-text', text);
            }
            
            textElement.textContent = '';
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    textElement.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            };
            setTimeout(typeWriter, 200);
        }
    }

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-el');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden-el');
    hiddenElements.forEach((el) => observer.observe(el));
});
