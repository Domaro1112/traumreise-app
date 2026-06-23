'use client';

/**
 * Shared shell for all landing-page fullscreen heroes.
 *
 * Standardises:
 *   • min-height: clamp(520px, 70vh, 760px)
 *   • background-image, backgroundPosition, backgroundRepeat, backgroundSize
 *   • overlay gradient (desktop + optional mobile override)
 *   • single @media 768px breakpoint for background-position + overlay
 *
 * Content padding / layout is left to each hero component so they stay
 * flexible (some have a form card, some just text + CTA).
 */
export default function LandingPageHero({
  backgroundImage,
  backgroundPosition        = 'center center',
  mobileBackgroundPosition,
  overlayGradient           = 'rgba(15,23,42,0.50)',
  mobileOverlayGradient,
  children,
}) {
  const mobilePos     = mobileBackgroundPosition ?? backgroundPosition;
  const mobileOverlay = mobileOverlayGradient    ?? overlayGradient;

  return (
    <>
      <style>{`
        .lp-hero {
          min-height: clamp(520px, 70vh, 760px);
          background-image: url(${backgroundImage});
          background-size: cover;
          background-position: ${backgroundPosition};
          background-repeat: no-repeat;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
        }
        .lp-hero-overlay {
          position: absolute;
          inset: 0;
          background: ${overlayGradient};
          pointer-events: none;
        }
        @media (max-width: 768px) {
          .lp-hero {
            background-position: ${mobilePos};
          }
          .lp-hero-overlay {
            background: ${mobileOverlay};
          }
        }
      `}</style>

      <section className="lp-hero">
        <div aria-hidden="true" className="lp-hero-overlay" />
        {children}
      </section>
    </>
  );
}
