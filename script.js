(() => {
  const screenInvite   = document.getElementById('screen-invite');
  const screenVideo    = document.getElementById('screen-video');
  const screenLocation = document.getElementById('screen-location');

  const btnOpen             = document.getElementById('btn-open');
  const video               = document.getElementById('invite-video');
  const btnUnmute           = document.getElementById('btn-unmute');
  const videoFallback       = document.getElementById('video-fallback');
  const btnFallbackContinue = document.getElementById('btn-fallback-continue');

  function showScreen(el){
    [screenInvite, screenVideo, screenLocation].forEach(s => s.classList.remove('screen--active'));
    el.classList.add('screen--active');
  }

  function goToLocation(){
    video.pause();
    showScreen(screenLocation);
  }

  function startVideo(){
    showScreen(screenVideo);
    video.currentTime = 0;
    
    // Start playing with sound after user interaction
    const playPromise = video.play();
    
    if (playPromise !== undefined){
      playPromise
        .then(() => {
          // Video started playing
          video.muted = false;
          console.log('Video playing with audio');
        })
        .catch((error) => {
          // If autoplay fails, try muted first
          console.log('Autoplay failed, trying muted:', error);
          video.muted = true;
          video.play().catch(() => {
            console.log('Video play failed completely');
          });
        });
    }
  }

  // شاشة 1 -> تشغيل الفيديو
  btnOpen.addEventListener('click', startVideo);
  btnOpen.addEventListener('keyup', (e) => { if (e.key === 'Enter' || e.key === ' ') startVideo(); });

  // Unmute button - click to enable sound
  btnUnmute.addEventListener('click', () => {
    video.muted = false;
    video.play();
    btnUnmute.style.display = 'none';
  });

  // عند انتهاء الفيديو -> الانتقال التلقائي لشاشة الموقع
  video.addEventListener('ended', goToLocation);

  // Debug: Log when video loads
  video.addEventListener('loadedmetadata', () => {
    console.log('Video loaded. Duration:', video.duration, 'Has audio:', video.audioTracks.length > 0);
  });

  // If audio doesn't play automatically, show unmute button
  setTimeout(() => {
    if (video.paused === false && video.muted === true) {
      console.log('Audio autoplay blocked, showing unmute button');
      btnUnmute.style.display = 'flex';
    }
  }, 500);

  // في حال تعذر تحميل ملف الفيديو (لم يُرفع بعد مثلاً) أظهر بديلاً بدل الشاشة السوداء
  video.addEventListener('error', (e) => {
    console.error('Video error:', e);
    videoFallback.classList.add('video-fallback--show');
    btnUnmute.style.display = 'none';
  });
  btnFallbackContinue.addEventListener('click', goToLocation);
})();
