import React from 'react';
import { useApp } from '../../context/AppContext';

interface ZynexLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  collapsed?: boolean;
  lightText?: boolean;
  variant?: 'black-white' | 'brand';
}

export const ZynexLogo: React.FC<ZynexLogoProps> = ({
  className = '',
  size = 'md',
  collapsed = false,
  lightText = true,
  variant,
}) => {
  // Try to read themeMode from AppContext safely
  let isMonochrome = false;
  try {
    const appContext = useApp();
    if (appContext?.settings?.themeMode === 'black-white') {
      isMonochrome = true;
    }
  } catch {
    // If rendered outside AppContext
    isMonochrome = false;
  }

  if (variant === 'black-white') isMonochrome = true;
  if (variant === 'brand') isMonochrome = false;

  const height = size === 'sm' ? 28 : size === 'lg' ? 44 : 34;

  if (collapsed) {
    // Just the mark: Roof + stylized Z Cart with wheels and arrow
    return (
      <svg
        viewBox="0 0 100 90"
        height={height}
        className={`shrink-0 ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Roof */}
        <path
          d="M15 36L48 10L80 36"
          stroke={isMonochrome ? '#FFFFFF' : '#FF7A00'}
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Window in roof */}
        <rect x="42" y="19" width="5" height="5" fill={isMonochrome ? '#FFFFFF' : '#FF7A00'} rx="1" />
        <rect x="49" y="19" width="5" height="5" fill={isMonochrome ? '#FFFFFF' : '#FF7A00'} rx="1" />
        <rect x="42" y="26" width="5" height="5" fill={isMonochrome ? '#FFFFFF' : '#FF7A00'} rx="1" />
        <rect x="49" y="26" width="5" height="5" fill={isMonochrome ? '#FFFFFF' : '#FF7A00'} rx="1" />

        {/* Zynex 'Z' ribbon */}
        <path
          d="M26 42H74L30 76H74"
          stroke={isMonochrome ? '#FFFFFF' : '#003B82'}
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26 42H70L32 74H74"
          stroke={isMonochrome ? '#E4E4E7' : '#0A2540'}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={isMonochrome ? '0.9' : '0.8'}
        />

        {/* Wheels */}
        <circle cx="34" cy="84" r="5" fill={isMonochrome ? '#FFFFFF' : '#FF7A00'} />
        <circle cx="56" cy="84" r="5" fill={isMonochrome ? '#FFFFFF' : '#FF7A00'} />

        {/* Swoosh arrow */}
        <path
          d="M48 83C66 84 82 78 92 68"
          stroke={isMonochrome ? '#FFFFFF' : '#FF7A00'}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <polygon points="90,64 96,68 91,73" fill={isMonochrome ? '#FFFFFF' : '#FF7A00'} />
      </svg>
    );
  }

  // Full brand lockup: Icon + "ZynexCart" with underline swoop arrow
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <svg
        viewBox="0 0 270 78"
        height={height}
        className="w-auto shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="zynexBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#004DA8" />
            <stop offset="100%" stopColor="#001F54" />
          </linearGradient>
          <linearGradient id="zynexOrangeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF8C00" />
            <stop offset="100%" stopColor="#FF6600" />
          </linearGradient>
          <linearGradient id="zynexMonoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E4E4E7" />
          </linearGradient>
        </defs>

        {/* Roof icon on top of Z */}
        <path
          d="M12 28L36 9L60 28"
          stroke={isMonochrome ? '#FFFFFF' : 'url(#zynexOrangeGrad)'}
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Window panes */}
        <rect x="31" y="16" width="4" height="4" fill={isMonochrome ? '#FFFFFF' : '#FF7A00'} rx="0.5" />
        <rect x="37" y="16" width="4" height="4" fill={isMonochrome ? '#FFFFFF' : '#FF7A00'} rx="0.5" />
        <rect x="31" y="22" width="4" height="4" fill={isMonochrome ? '#FFFFFF' : '#FF7A00'} rx="0.5" />
        <rect x="37" y="22" width="4" height="4" fill={isMonochrome ? '#FFFFFF' : '#FF7A00'} rx="0.5" />

        {/* Large stylized 'Z' (ribbon shopping cart front) */}
        <path
          d="M21 34H61L25 64H63"
          stroke={isMonochrome ? 'url(#zynexMonoGrad)' : 'url(#zynexBlueGrad)'}
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 2 Cart Wheels */}
        <circle cx="28" cy="71" r="4.2" fill={isMonochrome ? '#FFFFFF' : '#FF7A00'} />
        <circle cx="48" cy="71" r="4.2" fill={isMonochrome ? '#FFFFFF' : '#FF7A00'} />

        {/* Swooping Cart Arrow reaching all the way under Cart */}
        <path
          d="M48 68C85 78 150 78 195 56"
          stroke={isMonochrome ? '#FFFFFF' : 'url(#zynexOrangeGrad)'}
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M188 54L199 54L194 63Z"
          fill={isMonochrome ? '#FFFFFF' : '#FF7A00'}
        />

        {/* Text "ynex" */}
        <text
          x="68"
          y="56"
          fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
          fontWeight="800"
          fontSize="36"
          letterSpacing="-0.8px"
          fill={lightText ? '#FFFFFF' : isMonochrome ? '#18181B' : '#002147'}
        >
          <tspan fill={isMonochrome ? '#FFFFFF' : '#3B82F6'}>y</tspan>
          <tspan fill={lightText ? '#FFFFFF' : isMonochrome ? '#27272A' : '#002B66'}>nex</tspan>
        </text>

        {/* Text "Cart" */}
        <text
          x="162"
          y="56"
          fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
          fontWeight="900"
          fontSize="37"
          letterSpacing="-0.5px"
          fill={isMonochrome ? '#FFFFFF' : 'url(#zynexOrangeGrad)'}
        >
          Cart
        </text>
      </svg>
    </div>
  );
};
