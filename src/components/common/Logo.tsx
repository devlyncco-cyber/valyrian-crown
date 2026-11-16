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
        className="h-7 sm:h-8 md:h-9 w-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
        loading="eager"
      />
      {showTagline && (
        <span
          className={`text-[9px] uppercase tracking-widest font-heading font-medium mt-0.5 ${
            variant === 'white' ? 'text-gray-400' : 'text-neutral-500'
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
