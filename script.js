(() => {
  const screenInvite   = document.getElementById('screen-invite');
  const screenVideo    = document.getElementById('screen-video');
  const screenLocation = document.getElementById('screen-location');

  const btnOpen             = document.getElementById('btn-open');
  const video               = document.getElementById('invite-video');
  const btnUnmute           = document.getElementById('btn-unmute');
  const btnSkip             = document.getElementById('btn-skip');
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
    video.muted = true;          // المتصفحات تسمح بالتشغيل التلقائي فقط عند الكتم
    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise !== undefined){
      playPromise.catch(() => { /* سيقوم المستخدم بالضغط لتشغيل الصوت أو التخطي */ });
    }
  }

  // شاشة 1 -> تشغيل الفيديو
  btnOpen.addEventListener('click', startVideo);
  btnOpen.addEventListener('keyup', (e) => { if (e.key === 'Enter' || e.key === ' ') startVideo(); });

  // تفعيل الصوت يدويًا (متطلب المتصفحات لمنع autoplay بصوت)
  btnUnmute.addEventListener('click', () => {
    video.muted = false;
    video.play();
    btnUnmute.style.display = 'none';
  });

  // تخطي الفيديو مباشرة إلى شاشة الموقع
  btnSkip.addEventListener('click', goToLocation);

  // عند انتهاء الفيديو -> الانتقال التلقائي لشاشة الموقع
  video.addEventListener('ended', goToLocation);

  // في حال تعذر تحميل ملف الفيديو (لم يُرفع بعد مثلاً) أظهر بديلاً بدل الشاشة السوداء
  video.addEventListener('error', () => {
    videoFallback.classList.add('video-fallback--show');
    btnUnmute.style.display = 'none';
  });
  btnFallbackContinue.addEventListener('click', goToLocation);
})();
