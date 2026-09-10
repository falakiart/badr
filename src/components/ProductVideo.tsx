import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Repeat, Sparkles, CheckCircle2, ShoppingBag, Video, Edit3, ShieldCheck } from 'lucide-react';
import { Language, ThemeConfig } from '../types';

interface ProductVideoProps {
  language: Language;
  theme: ThemeConfig;
  onScrollToOrder: () => void;
  onOpenAdmin?: () => void;
}

// Function to detect whether the URL is YouTube, Vimeo, or direct HTML5 video (MP4)
export function parseVideoUrl(
  url: string, 
  loop = true, 
  autoplay = true,
  showcaseMode = true
): { type: 'youtube' | 'vimeo' | 'html5' | 'empty'; src: string; rawId?: string } {
  if (!url || !url.trim()) {
    return { type: 'empty', src: '' };
  }

  const cleanUrl = url.trim();

  // YouTube match (supports standard, youtu.be, embed, shorts)
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
  const ytMatch = cleanUrl.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    const loopParam = loop ? `&loop=1&playlist=${videoId}` : '';
    const autoplayParam = autoplay ? '&autoplay=1&mute=1&playsinline=1' : '';
    // If showcaseMode: hide controls, annotations, fullscreen button and keyboard shortcuts for a clean presentation
    const controlsParam = showcaseMode ? '&controls=0&disablekb=1&iv_load_policy=3&fs=0' : '&controls=1';
    return {
      type: 'youtube',
      rawId: videoId,
      src: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1${controlsParam}${loopParam}${autoplayParam}`,
    };
  }

  // Vimeo match
  const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/i;
  const vimeoMatch = cleanUrl.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[3]) {
    const vimeoId = vimeoMatch[3];
    const loopParam = loop ? '&loop=1' : '';
    const autoplayParam = autoplay ? '&autoplay=1&muted=1' : '';
    const controlsParam = showcaseMode ? '&controls=0&badge=0&title=0&byline=0&portrait=0' : '&title=0&byline=0&portrait=0';
    return {
      type: 'vimeo',
      rawId: vimeoId,
      src: `https://player.vimeo.com/video/${vimeoId}?${controlsParam}${loopParam}${autoplayParam}`,
    };
  }

  // Direct MP4 / WebM video file
  return {
    type: 'html5',
    src: cleanUrl,
  };
}

export const ProductVideo: React.FC<ProductVideoProps> = ({
  language,
  theme,
  onScrollToOrder,
  onOpenAdmin,
}) => {
  // If explicitly hidden by theme config, don't render
  if (theme.showVideoSection === false) {
    return null;
  }

  const isLoop = theme.videoLoop !== false; // Default to true
  const isAutoplay = theme.videoAutoplay !== false; // Default to true
  const isShowcase = theme.videoShowcaseMode !== false; // Default to true for showcase reel (ghir ist3radi)

  // Default demonstration video URL if none is configured yet
  const activeVideoUrl = theme.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-woman-brushing-her-long-shiny-hair-41126-large.mp4';
  const parsed = parseVideoUrl(activeVideoUrl, isLoop, isAutoplay, isShowcase);

  const [isPlaying, setIsPlaying] = useState(isAutoplay);
  const [isMuted, setIsMuted] = useState(true); // Always start muted for seamless showcase autoplay loop
  const [showPlayPulse, setShowPlayPulse] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Autoplay attempt on mount / video source change
  useEffect(() => {
    if (parsed.type === 'html5' && videoRef.current) {
      if (isAutoplay) {
        videoRef.current.muted = true;
        setIsMuted(true);
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay was blocked by browser policy until user gesture
            setIsPlaying(false);
          });
      }
    }
  }, [parsed.src, isAutoplay]);

  const handlePlayToggle = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
          setShowPlayPulse(true);
          setTimeout(() => setShowPlayPulse(false), 800);
        }).catch(() => {});
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowPlayPulse(true);
        setTimeout(() => setShowPlayPulse(false), 800);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  // Multilingual content text
  const isArabic = language === 'AR';
  const isFrench = language === 'FR';

  const badgeText = isShowcase 
    ? (isArabic ? 'فيديو استعراضي للمنتج' : isFrench ? 'Showcase Vidéo Produit' : 'Product Showcase Reel')
    : (isArabic ? 'فيديو توضيحي مباشر' : isFrench ? 'Démonstration Vidéo' : 'Live Product Demonstration');

  const titleText = theme.videoTitle || (
    isArabic
      ? 'شاهد روعة المنتج والنتيجة الفورية على الشعر'
      : isFrench
      ? 'Découvrez le produit en vidéo et les résultats'
      : 'Watch How It Works & Instant Hair Transformation'
  );
  const subtitleText = theme.videoSubtitle || (
    isArabic
      ? 'شاهدي كيف تمنح رغوة الماوس بزيت الصبار والألوفيرا ترطيباً عميقاً ولمعاناً حريرياً بدون دهون في أقل من دقيقة واحدة.'
      : isFrench
      ? 'Regardez comment notre mousse sans rinçage hydrate, élimine les frisottis et fait briller les cheveux sans effet gras.'
      : 'See how our lightweight leave-in foam tames frizz, locks in moisture, and restores radiant shine in under a minute.'
  );

  const feature1 = isArabic ? 'تطبيق سريع وسهل بدون شطف' : isFrench ? 'Sans rinçage en 1 minute' : 'Quick leave-in, no rinse';
  const feature2 = isArabic ? 'خالٍ من الزيوت الثقيلة والقشرة' : isFrench ? 'Zero effet gras ni collant' : 'Zero grease, zero crunch';
  const feature3 = isArabic ? 'نتيجة طبيعية ولمعان فوري' : isFrench ? 'Brillance soyeuse naturelle' : 'Silky natural shine';
  const orderButtonText = isArabic ? 'اطلب الآن - الدفع عند الاستلام' : isFrench ? 'Commander Maintenant (Paiement à la livraison)' : 'Order Now (Cash on Delivery)';

  return (
    <section id="product-video-section" className="py-12 sm:py-16 px-4 max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl p-5 sm:p-10 border border-slate-200/80 shadow-lg relative overflow-hidden">
        
        {/* Subtle background ambient tint */}
        <div 
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ backgroundColor: theme.accentColor || '#8AA48A' }}
        />
        <div 
          className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ backgroundColor: theme.primaryColor || '#2F3E30' }}
        />

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8 relative z-10">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span 
              className="inline-flex items-center gap-1.5 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider text-white shadow-sm"
              style={{ backgroundColor: theme.primaryColor || '#2F3E30' }}
            >
              <Video className="w-3.5 h-3.5" /> {badgeText}
            </span>

            {isLoop && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-200/70 px-2.5 py-1 rounded-full">
                <Repeat className="w-3 h-3 text-emerald-600 animate-spin-slow" />
                <span>{isArabic ? 'تكرار مستمر تلقائي' : 'Boucle continue (Loop)'}</span>
              </span>
            )}

            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full transition"
                title="تعديل رابط الفيديو وإعدادات Loop من لوحة التحكم"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isArabic ? 'تغيير الفيديو' : 'Modifier vidéo'}</span>
              </button>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {titleText}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {subtitleText}
          </p>
        </div>

        {/* Video Player Container with 16:9 Aspect Ratio */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-950 border-4 border-slate-900/10 aspect-video group">
            
            {/* Top Loop indicator badge overlay */}
            {isLoop && (
              <div className="absolute top-3 left-3 z-20 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-bold border border-white/10 shadow-sm">
                <Repeat className="w-3 h-3 text-emerald-400" />
                <span>LOOP</span>
              </div>
            )}

            {/* 1. YouTube Video Embed (with Loop & Autoplay parameters) */}
            {parsed.type === 'youtube' && (
              <iframe
                src={parsed.src}
                title="Product Video Demo"
                className="w-full h-full border-0 absolute inset-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}

            {/* 2. Vimeo Video Embed (with Loop & Autoplay parameters) */}
            {parsed.type === 'vimeo' && (
              <iframe
                src={parsed.src}
                title="Product Video Demo"
                className="w-full h-full border-0 absolute inset-0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            )}

            {/* 3. Direct HTML5 Video (MP4/WebM) with continuous loop */}
            {parsed.type === 'html5' && (
              <div className="relative w-full h-full flex items-center justify-center bg-black select-none">
                <video
                  ref={videoRef}
                  src={parsed.src}
                  controls={!isShowcase}
                  loop={isLoop}
                  autoPlay={isAutoplay}
                  muted={isMuted}
                  playsInline
                  preload="auto"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => {
                    // Extra guarantee for continuous seamless loop
                    if (isLoop && videoRef.current) {
                      videoRef.current.currentTime = 0;
                      videoRef.current.play().catch(() => {});
                    }
                  }}
                  className="w-full h-full object-cover sm:object-contain cursor-pointer"
                  onClick={handlePlayToggle}
                />

                {/* Pulse feedback indicator when clicking to play/pause */}
                {showPlayPulse && (
                  <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/70 text-white flex items-center justify-center pointer-events-none animate-ping z-30">
                    {isPlaying ? <Play className="w-8 h-8 fill-current ml-1" /> : <Pause className="w-8 h-8 fill-current" />}
                  </div>
                )}

                {/* Subtle Floating Bottom Showcase Bar */}
                <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
                  {/* Left: Quick Play/Pause & Showcase badge */}
                  <div className="pointer-events-auto flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayToggle();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 transition border border-white/10 shadow-lg"
                      title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span className="hidden sm:inline">{isArabic ? 'إيقاف' : 'Pause'}</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          <span className="hidden sm:inline">{isArabic ? 'تشغيل' : 'Lecture'}</span>
                        </>
                      )}
                    </button>

                    <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/40 backdrop-blur-md text-white/80 text-[10px] font-semibold border border-white/5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{isArabic ? 'عرض استعراضي' : 'Showcase'}</span>
                    </div>
                  </div>

                  {/* Right: Sound Mute/Unmute Toggle Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    className="pointer-events-auto px-3.5 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition shadow-lg border border-white/10"
                    title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
                  >
                    {isMuted ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isArabic ? 'تشغيل الصوت' : 'Activer le son'}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isArabic ? 'كتم الصوت' : 'Couper le son'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Big Floating Play Button Overlay only when video is paused */}
                {!isPlaying && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayToggle();
                    }}
                    aria-label="Play video"
                    className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl transition transform hover:scale-110 active:scale-95 z-20"
                  >
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </button>
                )}
              </div>
            )}

            {/* 4. Empty / Fallback if invalid */}
            {parsed.type === 'empty' && (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-300 space-y-3">
                <Video className="w-12 h-12 text-slate-500" />
                <p className="text-sm font-bold">
                  {isArabic ? 'لم يتم وضع رابط فيديو بعد' : 'Aucune vidéo configurée'}
                </p>
                <p className="text-xs text-slate-400 max-w-sm">
                  {isArabic 
                    ? 'يمكنك وضع رابط الفيديو (YouTube أو MP4) من لوحة التحكم الخاصة بالموقع'
                    : 'Vous pouvez ajouter le lien de votre vidéo (YouTube ou MP4) depuis le panneau d\'administration.'}
                </p>
                {onOpenAdmin && (
                  <button
                    onClick={onOpenAdmin}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition"
                  >
                    {isArabic ? 'أضف رابط الفيديو الآن' : 'Ajouter une vidéo'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick Highlight Badges beneath Video */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="text-xs font-bold">{feature1}</span>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
              <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span className="text-xs font-bold">{feature2}</span>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="text-xs font-bold">{feature3}</span>
            </div>
          </div>

          {/* Call To Action Button */}
          <div className="mt-8 text-center">
            <button
              onClick={onScrollToOrder}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm sm:text-base font-extrabold shadow-xl hover:shadow-2xl transition transform active:scale-95 inline-flex items-center justify-center gap-2.5"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{orderButtonText}</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
