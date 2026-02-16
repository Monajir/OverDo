import { lazy, Suspense, useMemo } from 'react';
import { motion } from 'framer-motion';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface RankBackgroundProps {
  rank: 1 | 2 | 3;
}

function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 4 + Math.random() * 6,
    delay: Math.random() * 5,
    size: 1 + Math.random() * 2,
  }));
}

const NoviceBackground = () => {
  const particles = useMemo(() => generateParticles(25), []);
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 20% 50%, hsl(var(--rank-accent) / 0.12), transparent 60%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 80% 20%, hsl(var(--rank-accent) / 0.06), transparent 50%)',
        }}
      />
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: 'hsl(var(--rank-accent) / 0.4)',
          }}
          animate={{ y: [0, -40, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

const JourneymanBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div
      className="absolute inset-0"
      style={{
        background: 'radial-gradient(ellipse at 30% 40%, hsl(var(--rank-accent) / 0.1), transparent 50%)',
      }}
    />
    <motion.div
      className="absolute rounded-full"
      style={{
        width: 400,
        height: 400,
        left: '10%',
        top: '20%',
        backgroundColor: 'hsl(var(--rank-accent) / 0.07)',
        filter: 'blur(80px)',
      }}
      animate={{ x: [0, 100, -50, 0], y: [0, -80, 50, 0], scale: [1, 1.3, 0.9, 1] }}
      transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute rounded-full"
      style={{
        width: 300,
        height: 300,
        right: '15%',
        bottom: '25%',
        backgroundColor: 'hsl(var(--rank-accent) / 0.05)',
        filter: 'blur(60px)',
      }}
      animate={{ x: [0, -60, 80, 0], y: [0, 60, -40, 0], scale: [1, 0.8, 1.2, 1] }}
      transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute rounded-full"
      style={{
        width: 200,
        height: 200,
        left: '60%',
        top: '10%',
        backgroundColor: 'hsl(var(--rank-accent) / 0.04)',
        filter: 'blur(50px)',
      }}
      animate={{ x: [0, 40, -30, 0], y: [0, 30, -50, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
    />
  </div>
);

const LegendBackground = () => (
  <div className="fixed inset-0 overflow-hidden">
    {/* Base gradient */}
    <div
      className="absolute inset-0"
      style={{
        background: `
          radial-gradient(ellipse at 25% 30%, hsl(var(--rank-accent) / 0.12), transparent 50%),
          radial-gradient(ellipse at 75% 60%, hsl(var(--rank-accent-glow) / 0.08), transparent 50%)
        `,
      }}
    />
    {/* Animated orbs */}
    <motion.div
      className="absolute rounded-full"
      style={{
        width: 500,
        height: 500,
        left: '5%',
        top: '10%',
        backgroundColor: 'hsl(var(--rank-accent) / 0.08)',
        filter: 'blur(100px)',
      }}
      animate={{ x: [0, 120, -60, 0], y: [0, -100, 60, 0], scale: [1, 1.4, 0.8, 1] }}
      transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute rounded-full"
      style={{
        width: 350,
        height: 350,
        right: '10%',
        bottom: '20%',
        backgroundColor: 'hsl(var(--rank-accent-glow) / 0.06)',
        filter: 'blur(80px)',
      }}
      animate={{ x: [0, -80, 100, 0], y: [0, 70, -50, 0], scale: [1, 0.7, 1.3, 1] }}
      transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
    />
    {/* Spline 3D overlay */}
    <Suspense fallback={null}>
      <div className="absolute inset-0 opacity-50">
        <Spline
          scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </Suspense>
  </div>
);

export const RankBackground = ({ rank }: RankBackgroundProps) => {
  switch (rank) {
    case 1:
      return <NoviceBackground />;
    case 2:
      return <JourneymanBackground />;
    case 3:
      return <LegendBackground />;
    default:
      return <NoviceBackground />;
  }
};
