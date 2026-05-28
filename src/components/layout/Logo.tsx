interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * Procvička logo — stylizovaná otevřená kniha s jiskrou.
 * Používá gradient v barvách sekcí (matematika → pravopis → slovník).
 */
export const Logo = ({ className = "", size = 44 }: LogoProps) => {
  return (
    <div
      className={`relative flex items-center justify-center rounded-xl shadow-md overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        background:
          "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(142 71% 45%) 55%, hsl(262 83% 58%) 100%)",
      }}
      aria-label="Procvička logo"
    >
      <svg
        viewBox="0 0 48 48"
        width={size * 0.62}
        height={size * 0.62}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Otevřená kniha — dvě strany */}
        <path
          d="M6 12 C 6 11, 7 10, 8 10 L 22 11 C 23 11, 24 12, 24 13 L 24 38 C 24 37, 23 36, 22 36 L 8 35 C 7 35, 6 35, 6 36 Z"
          fill="white"
          fillOpacity="0.96"
        />
        <path
          d="M42 12 C 42 11, 41 10, 40 10 L 26 11 C 25 11, 24 12, 24 13 L 24 38 C 24 37, 25 36, 26 36 L 40 35 C 41 35, 42 35, 42 36 Z"
          fill="white"
          fillOpacity="0.96"
        />
        {/* Linky textu */}
        <line x1="10" y1="17" x2="20" y2="17.5" stroke="hsl(217 91% 60%)" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
        <line x1="10" y1="21" x2="19" y2="21.5" stroke="hsl(217 91% 60%)" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
        <line x1="28" y1="17.5" x2="38" y2="17" stroke="hsl(262 83% 58%)" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
        <line x1="29" y1="21.5" x2="38" y2="21" stroke="hsl(262 83% 58%)" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
        {/* Jiskra */}
        <path
          d="M24 27 L25.2 30.2 L28.4 31.4 L25.2 32.6 L24 35.8 L22.8 32.6 L19.6 31.4 L22.8 30.2 Z"
          fill="hsl(48 96% 60%)"
        />
      </svg>
    </div>
  );
};

export default Logo;
