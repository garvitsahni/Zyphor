'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Hero from '@/components/ui/animated-shader-hero';
import {
  Rocket, Brain, Target, Users, GitBranch, MonitorPlay,
  TrendingUp, Sparkles, ArrowRight, Zap, Shield, BarChart3,
  ChevronRight, Star, CheckCircle2, Play
} from 'lucide-react';

const features = [
  { icon: Brain, title: 'Idea Validator', desc: 'AI analyzes uniqueness, finds similar projects, and refines your pitch with market intelligence.', color: '#7C6FF7', bg: 'rgba(124, 111, 247, 0.08)' },
  { icon: Target, title: 'Smart Roadmap', desc: 'Auto-generated task breakdown calibrated to your team size and hackathon timeline.', color: '#00D4C8', bg: 'rgba(0, 212, 200, 0.08)' },
  { icon: BarChart3, title: 'Deadline Predictor', desc: 'Real-time completion probability using velocity tracking and risk modeling.', color: '#F5A623', bg: 'rgba(245, 166, 35, 0.08)' },
  { icon: Shield, title: 'Judge Simulator', desc: 'Get scored before you present. Identify and fix weaknesses with AI critique.', color: '#FF6B6B', bg: 'rgba(255, 107, 107, 0.08)' },
  { icon: MonitorPlay, title: 'Pitch Generator', desc: 'Slides, scripts, demo flow, and anticipated judge questions — all generated for you.', color: '#4ECDC4', bg: 'rgba(78, 205, 196, 0.08)' },
  { icon: TrendingUp, title: 'Startup Converter', desc: 'Transform your hackathon project into a real business plan with investor-ready documents.', color: '#A29BFE', bg: 'rgba(162, 155, 254, 0.08)' },
];

const stages = [
  { num: 1, label: 'Idea Validation', active: true },
  { num: 2, label: 'Planning', active: false },
  { num: 3, label: 'Development', active: false },
  { num: 4, label: 'Judging', active: false },
  { num: 5, label: 'Startup', active: false },
];

const testimonials = [
  { name: 'Sarah K.', role: 'Won HackMIT 2025', quote: 'Zyphra helped us go from scattered ideas to a clean pitch in 4 hours.', rating: 5 },
  { name: 'Arjun M.', role: 'YC Startup Founder', quote: 'We literally converted our hackathon MVP into our seed pitch using Zyphra.', rating: 5 },
  { name: 'Priya L.', role: 'Berkeley AI Hackathon', quote: 'The judge simulator found 3 critical holes in our demo before we presented.', rating: 5 },
];

const stats = [
  { value: '12,400+', label: 'Projects Built' },
  { value: '340+', label: 'Hackathons Won' },
  { value: '89', label: 'Startups Launched' },
  { value: '4.9★', label: 'Avg Rating' },
];

export default function LandingPage() {

  return (
    <div className="landing-page min-h-screen" style={{ fontFamily: "'Bricolage Grotesque', 'Clash Display', sans-serif" }}>
      {/* Google Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&display=swap');

        .landing-page {
          --landing-bg: #080812;
          --landing-bg-secondary: #0E0E1C;
          --landing-text: #F0F0FA;
          --landing-text-secondary: #8A8AA8;
          --landing-text-muted: #4A4A60;
          --landing-border: rgba(255,255,255,0.06);
          --border-accent: rgba(108,92,231,0.35);
          --accent-warm: #FF9F43;
          --glow: 0 0 60px rgba(108,92,231,0.2);
          background: var(--landing-bg);
          color: var(--landing-text);
          font-family: 'Bricolage Grotesque', sans-serif;
        }

        /* Mesh background */
        .landing-page .mesh-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .landing-page .mesh-bg::before {
          content: '';
          position: absolute;
          width: 800px; height: 800px;
          background: radial-gradient(ellipse, rgba(108,92,231,0.12) 0%, transparent 70%);
          top: -200px; left: -200px;
          animation: meshDrift 25s ease-in-out infinite alternate;
        }

        .landing-page .mesh-bg::after {
          content: '';
          position: absolute;
          width: 600px; height: 600px;
          background: radial-gradient(ellipse, rgba(0,206,201,0.08) 0%, transparent 70%);
          bottom: -150px; right: -100px;
          animation: meshDrift 20s ease-in-out infinite alternate-reverse;
        }

        @keyframes meshDrift {
          0% { transform: translate(0,0) scale(1); }
          100% { transform: translate(80px, 60px) scale(1.15); }
        }

        /* Noise texture overlay */
        .landing-page .noise {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          background-size: 128px;
        }

        /* Nav */
        .landing-page .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 0 2rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--landing-border);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          background: rgba(8, 8, 18, 0.7);
        }

        .landing-page .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          font-size: 1.25rem;
          letter-spacing: -0.02em;
          color: var(--landing-text);
          text-decoration: none;
        }

        .landing-page .logo-icon {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .landing-page .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
          list-style: none;
        }

        .landing-page .nav-links a {
          text-decoration: none;
          color: var(--landing-text-secondary);
          font-size: 0.875rem;
          font-weight: 500;
          transition: color 0.2s;
        }

        .landing-page .nav-links a:hover { color: var(--landing-text); }

        .landing-page .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .landing-page .btn-ghost {
          padding: 8px 20px;
          border: 1px solid var(--landing-border);
          background: transparent;
          color: var(--landing-text-secondary);
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
          font-family: inherit;
        }

        .landing-page .btn-ghost:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.12);
          color: var(--landing-text);
        }

        .landing-page .btn-primary {
          padding: 9px 22px;
          background: linear-gradient(135deg, #7C6FF7 0%, #5B4BD6 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.25s;
          position: relative;
          overflow: hidden;
          font-family: inherit;
          box-shadow: 0 2px 20px rgba(108,92,231,0.25), inset 0 1px 0 rgba(255,255,255,0.15);
        }

        .landing-page .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .landing-page .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 30px rgba(108,92,231,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
        }

        .landing-page .btn-primary:hover::after { opacity: 1; }

        /* Hero */
        .hero {
          position: relative;
          z-index: 2;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 8rem 2rem 6rem;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: rgba(108,92,231,0.1);
          border: 1px solid rgba(108,92,231,0.2);
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--primary-light);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 2rem;
        }

        .hero-title {
          font-size: clamp(3rem, 8vw, 6.5rem);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.03em;
          margin-bottom: 1.5rem;
          max-width: 900px;
        }

        .hero-title em {
          font-style: normal;
          background: linear-gradient(135deg, #A29BFE 0%, #6C5CE7 40%, #00CEC9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-sub {
          font-size: 1.125rem;
          color: var(--text-secondary);
          max-width: 540px;
          line-height: 1.7;
          margin-bottom: 2.5rem;
          font-weight: 400;
        }

        .hero-ctas {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 4rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .btn-large {
          padding: 14px 32px;
          font-size: 1rem;
          border-radius: 10px;
        }

        .btn-large-ghost {
          padding: 13px 28px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-secondary);
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          font-family: inherit;
        }

        .btn-large-ghost:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.12);
          color: var(--text-primary);
        }

        /* Pipeline */
        .pipeline {
          display: flex;
          align-items: center;
          gap: 0;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 4px;
          overflow: hidden;
        }

        .pipeline-step {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-muted);
          white-space: nowrap;
          transition: all 0.2s;
        }

        .pipeline-step.active {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
        }

        .pipeline-step-num {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
        }

        .pipeline-step.active .pipeline-step-num {
          background: rgba(255,255,255,0.2);
        }

        .pipeline-arrow {
          color: var(--text-muted);
          display: flex;
          align-items: center;
          padding: 0 2px;
        }

        /* Stats */
        .stats-bar {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: center;
          gap: 0;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          background: rgba(255,255,255,0.015);
          padding: 2rem 0;
          overflow: hidden;
        }

        .stat-item {
          flex: 1;
          max-width: 200px;
          text-align: center;
          padding: 0 2rem;
          border-right: 1px solid var(--border);
        }

        .stat-item:last-child { border-right: none; }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, var(--text-primary), var(--text-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 4px;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        /* Sections */
        .section {
          position: relative;
          z-index: 2;
          padding: 7rem 2rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .section-label {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--primary-light);
          margin-bottom: 1rem;
        }

        .section-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin-bottom: 1rem;
        }

        .section-sub {
          font-size: 1.05rem;
          color: var(--text-secondary);
          max-width: 480px;
          line-height: 1.6;
        }

        /* Feature Grid */
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          margin-top: 4rem;
        }

        .feature-card {
          background: var(--bg-secondary);
          padding: 2rem;
          transition: background 0.3s;
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .feature-card:hover {
          background: rgba(108,92,231,0.05);
        }

        .feature-card:hover::before { opacity: 1; }

        .feature-icon-wrap {
          width: 44px; height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }

        .feature-title {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          letter-spacing: -0.01em;
        }

        .feature-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.65;
        }

        /* Bento grid for features */
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-template-rows: auto;
          gap: 12px;
          margin-top: 4rem;
        }

        .bento-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.75rem;
          transition: border-color 0.3s, box-shadow 0.3s;
          position: relative;
          overflow: hidden;
        }

        .bento-card:hover {
          border-color: rgba(108,92,231,0.25);
          box-shadow: 0 8px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(108,92,231,0.08);
        }

        .bento-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 50%, transparent);
        }

        /* Testimonials */
        .testimonial-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 4rem;
        }

        .testimonial-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.75rem;
          position: relative;
        }

        .testimonial-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 50%, transparent);
        }

        .stars {
          display: flex;
          gap: 3px;
          margin-bottom: 1rem;
        }

        .quote {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.65;
          margin-bottom: 1.25rem;
        }

        .author-name {
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: -0.01em;
        }

        .author-role {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        /* CTA Section */
        .cta-section {
          position: relative;
          z-index: 2;
          padding: 5rem 2rem 7rem;
          text-align: center;
        }

        .cta-card {
          max-width: 700px;
          margin: 0 auto;
          background: var(--bg-secondary);
          border: 1px solid var(--border-accent);
          border-radius: 24px;
          padding: 4rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 80px rgba(108,92,231,0.12);
        }

        .cta-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(108,92,231,0.1) 0%, transparent 70%);
        }

        .cta-title {
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 1rem;
          position: relative;
        }

        .cta-sub {
          color: var(--text-secondary);
          font-size: 1.05rem;
          margin-bottom: 2.5rem;
          line-height: 1.6;
          position: relative;
        }

        .cta-badges {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 2rem;
          flex-wrap: wrap;
        }

        .cta-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        /* Footer */
        .footer {
          position: relative;
          z-index: 2;
          border-top: 1px solid var(--border);
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-copy {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .feature-grid { grid-template-columns: 1fr; }
          .testimonial-grid { grid-template-columns: 1fr; }
          .bento-grid { grid-template-columns: 1fr; }
          .pipeline { overflow-x: auto; border-radius: 12px; }
          .stats-bar { flex-wrap: wrap; }
          .stat-item { border-right: none; border-bottom: 1px solid var(--border); min-width: 120px; }
        }
      `}</style>

      {/* Backgrounds */}
      <div className="mesh-bg" />
      <div className="noise" />

      {/* Nav */}
      <nav className="nav">
        <a href="/" className="logo">
          <div className="logo-icon">
            <Rocket size={16} color="white" />
          </div>
          Zyphra
        </a>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#testimonials">Stories</a></li>
        </ul>
        <div className="nav-actions">
          <Link href="/login" className="btn-ghost">Log In</Link>
          <Link href="/register" className="btn-primary">
            Get Started <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <Hero
        trustBadge={{
          text: "AI-Powered Project Lifecycle",
          icons: ["⚡"]
        }}
        headline={{
          line1: "Supercharge Your Build.",
          line2: "Dominate the Hackathon."
        }}
        subtitle="Zyphra is your AI teammate that validates ideas, plans sprints, tracks progress, simulates judging, and converts projects into startups."
        buttons={{
          primary: {
            text: "Start Building Free",
            onClick: () => window.location.href = '/register'
          },
          secondary: {
            text: "See How It Works",
            onClick: () => {
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }}
        className="w-full relative z-10"
      />

      {/* Stats */}
      <motion.div
        className="stats-bar"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="stat-item"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Features */}
      <section id="features" className="section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '7rem 2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-label">Platform Features</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 className="section-title">6 AI Modules.<br />One Platform.</h2>
            <p className="section-sub">Every tool you need from idea inception to startup funding, powered by AI trained on thousands of winning hackathon projects.</p>
          </div>
        </motion.div>

        <div className="feature-grid">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="feature-card"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
            >
              <div className="feature-icon-wrap" style={{ background: f.bg }}>
                <f.icon size={20} color={f.color} />
              </div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works — Bento */}
      <section id="how-it-works" style={{ position: 'relative', zIndex: 2, padding: '0 2rem 7rem', maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-label">Built Different</div>
          <h2 className="section-title">Not Just a Project Manager.<br /><em style={{ fontStyle: 'normal', color: 'var(--primary-light)' }}>Your AI Teammate.</em></h2>
        </motion.div>

        <div className="bento-grid" style={{ marginTop: '3rem' }}>
          {/* Large card */}
          <motion.div
            className="bento-card"
            style={{ gridColumn: 'span 7', gridRow: 'span 2' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="feature-icon-wrap" style={{ background: 'rgba(108,92,231,0.1)', marginBottom: '1.5rem' }}>
              <Users size={20} color="var(--primary-light)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>Real-Time Collaboration</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.925rem' }}>
              Live presence indicators, shared task boards, activity streams, and instant notification — every team member stays perfectly aligned no matter the timezone.
            </p>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Live cursors', 'Shared roadmap', 'Activity feed', 'Instant sync'].map(tag => (
                <span key={tag} style={{ padding: '4px 12px', background: 'rgba(108,92,231,0.1)', border: '1px solid rgba(108,92,231,0.2)', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--primary-light)', fontWeight: 600 }}>{tag}</span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="bento-card"
            style={{ gridColumn: 'span 5' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="feature-icon-wrap" style={{ background: 'rgba(0,206,201,0.1)', marginBottom: '1.25rem' }}>
              <GitBranch size={20} color="var(--accent)" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>GitHub Integration</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '0.875rem' }}>Auto-sync commits, contribution heatmaps, and AI-powered task updates from your codebase.</p>
          </motion.div>

          <motion.div
            className="bento-card"
            style={{ gridColumn: 'span 5' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="feature-icon-wrap" style={{ background: 'rgba(245,166,35,0.1)', marginBottom: '1.25rem' }}>
              <Zap size={20} color="var(--accent-warm)" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Hackathon Mode</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '0.875rem' }}>Compressed timelines, stricter scoring, aggressive deadline warnings, and presentation-optimized outputs.</p>
          </motion.div>

          <motion.div
            className="bento-card"
            style={{ gridColumn: 'span 12' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '240px' }}>
                <div className="feature-icon-wrap" style={{ background: 'rgba(162,155,254,0.1)', marginBottom: '1.25rem' }}>
                  <Sparkles size={20} color="var(--primary-light)" />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Recruiter Portfolio</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '0.875rem' }}>A beautiful public showcase with your project, architecture diagrams, GitHub stats, and judge scores — ready to share with any recruiter.</p>
              </div>
              <div style={{ flex: 1, display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {['Architecture', 'GitHub Stats', 'Judge Scores', 'Tech Stack', 'Team Bios', 'Demo Video'].map((item, i) => (
                  <div key={item} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={{ position: 'relative', zIndex: 2, background: 'rgba(14,14,28,0.6)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '7rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <div className="section-label" style={{ justifyContent: 'center', display: 'flex' }}>Builder Stories</div>
            <h2 className="section-title" style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>Teams That Shipped With Zyphra</h2>
          </motion.div>

          <div className="testimonial-grid">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="testimonial-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="stars">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={13} fill="#F5A623" color="#F5A623" />
                  ))}
                </div>
                <p className="quote">"{t.quote}"</p>
                <div className="author-name">{t.name}</div>
                <div className="author-role">{t.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="cta-section">
        <motion.div
          className="cta-card"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="cta-title">Ready to Ship<br />Something Amazing?</h2>
          <p className="cta-sub">Join thousands of builders turning hackathon ideas into funded startups.</p>
          <Link href="/register" className="btn-primary btn-large" style={{ fontSize: '1rem', padding: '14px 36px' }}>
            <Rocket size={16} />
            Launch Your Project — It's Free
          </Link>
          <div className="cta-badges">
            <div className="cta-badge"><CheckCircle2 size={14} color="var(--success)" /> No credit card required</div>
            <div className="cta-badge"><CheckCircle2 size={14} color="var(--success)" /> Free forever tier</div>
            <div className="cta-badge"><CheckCircle2 size={14} color="var(--success)" /> Setup in 60 seconds</div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="logo">
          <div className="logo-icon">
            <Rocket size={14} color="white" />
          </div>
          Zyphra
        </div>
        <p className="footer-copy">© 2026 Zyphra. Built with ❤️ for builders.</p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="/login" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}>Log In</a>
          <a href="/register" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}>Sign Up</a>
        </div>
      </footer>
    </div>
  );
}