import React, { useState } from "react";

interface VideoBackgroundProps {
  videoUrl?: string;
  blurIntensity?: "light" | "medium" | "heavy";
  overlayOpacity?: string;
  className?: string;
  children?: React.ReactNode;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  videoUrl = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_051048_5ef213b5-26db-4da8-b604-7ef823760b6b.mp4",
  blurIntensity = "medium",
  overlayOpacity,
  className = "",
  children
}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const getBlurClass = () => {
    switch (blurIntensity) {
      case "light":
        return "blur-[4px]";
      case "heavy":
        return "blur-[12px]";
      case "medium":
      default:
        return "blur-[6px]";
    }
  };

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Background Animated Video Layer */}
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          title="Ambient background animation"
          preload="metadata"
          onLoadedData={() => setIsVideoLoaded(true)}
          className={`w-full h-full object-cover scale-105 transition-opacity duration-700 ${getBlurClass()} ${
            isVideoLoaded ? "opacity-60 dark:opacity-40" : "opacity-0"
          }`}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>

        {/* Sophisticated Tint Overlays for Contrast & Readability */}
        <div 
          className={`absolute inset-0 bg-[#F8F9FA]/75 dark:bg-[#090A0F]/80 backdrop-blur-[2px] transition-colors duration-300 ${
            overlayOpacity || ""
          }`} 
        />

        {/* Tactical Sub-grid overlay */}
        <div className="absolute inset-0 tactical-grid opacity-30 pointer-events-none" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};
