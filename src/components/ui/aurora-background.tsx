"use client";
import { cn } from "../../lib/utils";
import React, { ReactNode, useState } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  className?: string;
  children: ReactNode;
}

export const AuroraBackground = ({
  className,
  children,
  ...props
}: AuroraBackgroundProps) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <div
      className={cn(
        "relative w-full flex flex-col min-h-screen bg-[#F8F9FA]/80 dark:bg-[#090A0F]/80 text-slate-900 dark:text-slate-100 transition-colors duration-300",
        className
      )}
      {...props}
    >
      {/* Background Animated Video Layer with slight blur effect */}
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          className={`w-full h-full object-cover scale-105 transition-opacity duration-700 filter blur-[6px] ${
            isVideoLoaded ? "opacity-60 dark:opacity-35" : "opacity-0"
          }`}
        >
          <source 
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_051048_5ef213b5-26db-4da8-b604-7ef823760b6b.mp4" 
            type="video/mp4" 
          />
        </video>

        {/* Ambient Dark/Light Glassmorphism Tone Overlay */}
        <div className="absolute inset-0 bg-[#F8F9FA]/85 dark:bg-[#090A0F]/85 backdrop-blur-[1px]" />
        
        {/* Precision Tactical Background Grid */}
        <div className="absolute inset-0 tactical-grid opacity-30" />
      </div>

      <div className="relative z-10 w-full flex flex-col flex-1">
        {children}
      </div>
    </div>
  );
};

