import React from 'react';

type LogoMarkProps = React.SVGProps<SVGSVGElement>;

export function LogoMark({ className, ...props }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect
        x="3.5"
        y="4"
        width="12.5"
        height="9.5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect
        x="7.5"
        y="10"
        width="13"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9.2 18.2l3-3 2.4 2.4 2-2 3 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10.6" cy="13.6" r="1.1" fill="currentColor" />
      <path
        d="M18.6 5.2l.8 1.7 1.8.3-1.3 1.2.3 1.8-1.6-.9-1.6.9.3-1.8-1.3-1.2 1.8-.3.8-1.7z"
        fill="currentColor"
      />
    </svg>
  );
}
