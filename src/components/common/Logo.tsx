import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'dark' | 'white' | 'gold';
  className?: string;
  showTagline?: boolean;
  linkToHome?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  className = '',
  showTagline = true,
  linkToHome = true,
}) => {
  const logoSrc =
    variant === 'white'
      ? '/images/brand/logo-white.png'
      : variant === 'gold'
      ? '/images/brand/logo-gold.png'
      : '/images/brand/logo-dark.png';

  const content = (
    <div className={`inline-flex flex-col items-start select-none ${className}`}>
      <img
        src={logoSrc}
        alt="ValyrianCrown"
        className="h-6 sm:h-7 md:h-8 w-auto object-contain"
        loading="eager"
      />
      {showTagline && (
        <span
          className={`text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-heading font-medium mt-1 ${
            variant === 'white' ? 'text-neutral-400' : 'text-[#777777]'
          }`}
        >
          Wear the Crown. Own Your Style.
        </span>
      )}
    </div>
  );

  if (linkToHome) {
    return (
      <Link to="/" aria-label="ValyrianCrown Home">
        {content}
      </Link>
    );
  }

  return content;
};
