"use client";

import { useState, useEffect, useRef, FC } from "react";
import { Play, Pause, ChevronDown } from "lucide-react";
import Image from "next/image";

interface SlideType {
  image: string;
  title: string;
}

interface SlideshowProps {
  slides: SlideType[];
  autoplay?: boolean;
  autoplaySpeed?: number;
}

const Slideshow: FC<SlideshowProps> = ({
  slides = [],
  autoplay = true,
  autoplaySpeed = 6969,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({
    0: true,
  });
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef(0);

  // Set initial state after component mounts to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    setIsAutoplayEnabled(autoplay);
  }, [autoplay]);

  // Preload the next image when a slide changes
  useEffect(() => {
    if (isMounted) {
      // Preload next image
      const nextIndex = (currentIndex + 1) % slides.length;
      setLoadedImages((prev) => ({ ...prev, [nextIndex]: true }));

      // Preload previous image
      const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      setLoadedImages((prev) => ({ ...prev, [prevIndex]: true }));
    }
  }, [currentIndex, slides.length, isMounted]);

  const showSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    const nextIndex = (currentIndex + 1) % slides.length;
    showSlide(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  };

  const goToSlide = (index: number) => {
    showSlide(index);

    // Reset autoplay when manually changing slides
    if (isAutoplayEnabled) {
      pauseAutoplay();
      startAutoplay();
    }
  };

  const startAutoplay = () => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
    }

    autoplayIntervalRef.current = setInterval(() => {
      // Force update regardless of visibility state
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, autoplaySpeed);
  };

  const pauseAutoplay = () => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
      autoplayIntervalRef.current = null;
    }
  };

  const toggleAutoplay = () => {
    setIsAutoplayEnabled((prev) => !prev);
  };

  // Handle keyboard navigation - only on client side
  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, isMounted]);

  // Handle autoplay - only on client side
  useEffect(() => {
    if (!isMounted) return;

    if (isAutoplayEnabled) {
      startAutoplay();
    } else {
      pauseAutoplay();
    }

    // Important: Clean up on unmount
    return () => {
      pauseAutoplay();
    };
  }, [isAutoplayEnabled, isMounted, autoplaySpeed]);

  // Add visibility change listener to handle tab switching
  useEffect(() => {
    if (!isMounted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is inactive, pause autoplay
        pauseAutoplay();
      } else if (isAutoplayEnabled) {
        // Tab is active again, restart autoplay
        startAutoplay();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isMounted, isAutoplayEnabled]);

  // Handle touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;

    if (touchEndX < touchStartXRef.current - 50) {
      nextSlide();
    } else if (touchEndX > touchStartXRef.current + 50) {
      prevSlide();
    }
  };

  // Handle mouse enter/leave for autoplay
  const handleMouseEnter = () => {
    if (isAutoplayEnabled) {
      pauseAutoplay();
    }
  };

  const handleMouseLeave = () => {
    if (isAutoplayEnabled) {
      startAutoplay();
    }
  };

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight - 70,
      behavior: "smooth",
    });
  };

  if (slides.length === 0) {
    return null;
  }

  // If not yet mounted, render a static first slide to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className="relative w-full max-h-screen overflow-hidden">
        <div className="w-full">
          <div className="w-full animate-fade block">
            <img
              src={slides[0].image}
              alt={slides[0].title || "Slide 1"}
              className="w-full object-cover block mt-[70px] h-[300px] sm:mt-0 sm:h-[300px] md:h-auto"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full max-h-screen overflow-hidden"
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full">
        {slides.map((slide, index) => {
          const shouldRender =
            index === currentIndex ||
            index === (currentIndex + 1) % slides.length ||
            index === (currentIndex - 1 + slides.length) % slides.length ||
            loadedImages[index];

          return (
            <div
              key={index}
              className={`w-full animate-fade ${
                index === currentIndex ? "block" : "hidden"
              }`}
            >
              {shouldRender && (
                <div className="relative w-full mt-[70px] h-[300px] sm:mt-0 sm:h-[300px] md:h-[50vh] lg:h-[100vh]">
                  <Image
                    src={slide.image}
                    alt={slide.title || `Slide ${index + 1}`}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    onLoad={() => {
                      setLoadedImages((prev) => ({ ...prev, [index]: true }));
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Text Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/5 flex items-top justify-top flex-col">
        {/* Mobile view (single line) */}
        <h1 className="md:hidden text-white text-3xl font-bold text-center mb-1 pt-24">
          Welcome to SERC
        </h1>

        {/* Desktop view (separated lines) */}
        <div className="hidden md:block text-center pt-32">
          <p className="text-white/90 text-xl md:text-2xl lg:text-4xl font-medium text-center mb-3 font-sans">
            Welcome to
          </p>
          <h1 className="text-white text-3xl md:text-3xl lg:text-6xl font-bold text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
            Software Engineering Research Centre
          </h1>
        </div>
        <div className="hidden lg:block w-40 h-2 bg-blue-500 mx-auto mt-5"></div>
      </div>

      {/* Navigation Controls */}
      <button
        className="absolute top-1/2 left-0 transform text-white border-none py-4 px-2 md:px-8 cursor-pointer text-3xl transition-colors duration-300 z-10 hover:bg-opacity-80 rounded-r"
        aria-label="Previous slide"
        onClick={prevSlide}
      >
        &#10094;
      </button>

      <button
        className="absolute top-1/2 right-0 transform text-white border-none py-4 px-2 md:px-8 cursor-pointer text-3xl transition-colors duration-300 z-10 hover:bg-opacity-80 rounded-l"
        aria-label="Next slide"
        onClick={nextSlide}
      >
        &#10095;
      </button>

      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full border-none cursor-pointer transition-colors duration-500 ${
              index === currentIndex ? "bg-white" : "bg-white bg-opacity-10"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      <button
        className="absolute bottom-5 right-5 bg-black bg-opacity-50 text-white border-none rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition-colors duration-300 z-10 hover:bg-opacity-80"
        aria-label={isAutoplayEnabled ? "Pause slideshow" : "Play slideshow"}
        onClick={toggleAutoplay}
      >
        {isAutoplayEnabled ? <Pause size={18} /> : <Play size={18} />}
      </button>

      <div className="absolute bottom-20 left-0 right-0 flex justify-center items-center z-20 hidden sm:flex">
        <div
          className="cursor-pointer animate-bounce"
          onClick={scrollToContent}
          aria-label="Scroll down for more content"
        >
          <ChevronDown size={69} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default Slideshow;
