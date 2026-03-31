import { useEffect, useRef, useState } from 'react'
import { useI18n } from './i18n'

const DIPLOMAS_FR = [
  {
    level: 'Bac +5',
    degree: 'Master Manager en Architecture et Applications Logicielles des SI',
    school: 'CESI, Nancy',
    period: '2025 — 2027',
    tasks: ["Stratégie d'entreprise et pilotage de projets", "Architecture d'entreprise et SI", 'Communication professionnelle'],
    color: '#4f46e5',
  },
  {
    level: 'Bac +3',
    degree: "Licence Concepteur Développeur d'Applications (CDA)",
    school: 'CESI, Nancy',
    period: '2023 — 2025',
    tasks: ['Développement logiciel et bases de données', 'Méthodologies agiles', 'Docker, GitLab, Node.js, React, Flutter'],
    color: '#0ea5e9',
  },
  {
    level: 'Bac +2',
    degree: 'BTS SIO option SLAM',
    school: 'Lycée Frédéric Chopin, Nancy',
    period: '2021 — 2023',
    tasks: ['Applications C#, Python, PHP, JavaScript', 'Bases de données relationnelles'],
    color: '#10b981',
  },
  {
    level: 'Bac',
    degree: 'Bac Pro Systèmes Numériques RISC',
    school: 'Lycée Jean Prouvé, Nancy',
    period: '2018 — 2021',
    tasks: ['Mention très bien', 'Réseaux, équipements Cisco, VLAN, Arduino'],
    color: '#f59e0b',
  },
]

const DIPLOMAS_EN = [
  {
    level: 'Bac +5',
    degree: "Master's in IS Architecture & Applications",
    school: 'CESI, Nancy',
    period: '2025 — 2027',
    tasks: ['Business strategy and project management', 'Enterprise architecture and IS', 'Professional communication'],
    color: '#4f46e5',
  },
  {
    level: 'Bac +3',
    degree: 'Bachelor in Application Design & Development',
    school: 'CESI, Nancy',
    period: '2023 — 2025',
    tasks: ['Software development and databases', 'Agile methodologies', 'Docker, GitLab, Node.js, React, Flutter'],
    color: '#0ea5e9',
  },
  {
    level: 'Bac +2',
    degree: 'BTS SIO SLAM',
    school: 'Lycée Frédéric Chopin, Nancy',
    period: '2021 — 2023',
    tasks: ['C#, Python, PHP, JavaScript applications', 'Relational databases'],
    color: '#10b981',
  },
  {
    level: 'Bac',
    degree: 'Vocational Bac - Digital Systems RISC',
    school: 'Lycée Jean Prouvé, Nancy',
    period: '2018 — 2021',
    tasks: ['Highest honors', 'Networks, Cisco equipment, VLAN, Arduino'],
    color: '#f59e0b',
  },
]

export default function EducationSection() {
  const { lang, t } = useI18n()
  const diplomas = lang === 'fr' ? DIPLOMAS_FR : DIPLOMAS_EN

  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [rotation, setRotation] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Detect section visibility
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setIsVisible(e.isIntersecting),
      { threshold: 0.1 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  // Scroll handler — advance card every ~200px of scroll inside the section
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const sectionTop = window.scrollY + rect.top
      const scrolled = window.scrollY - sectionTop
      const step = 220
      const raw = Math.floor(scrolled / step)
      const idx = Math.max(0, Math.min(diplomas.length - 1, raw))
      setActiveIndex(idx)
      setRotation(idx * -90)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [diplomas.length])

  const RADIUS = 160
  const CX = 200
  const CY = 200

  // Cards are placed at 0°, 90°, 180°, 270° on the circle
  // 0° = top, 90° = right, 180° = bottom, 270° = left
  const angles = [270, 0, 90, 180] // start at left so first item comes to top

  return (
    <section
      id="education"
      className="section section--tinted edu-wheel-section"
      ref={sectionRef}
      style={{ minHeight: `calc(100vh + ${diplomas.length * 220}px)` }}
    >
      <div
        className="edu-wheel-sticky"
        style={{ position: 'sticky', top: '80px', padding: '40px 0' }}
      >
        <div className="container">
          <h2 className="section-heading" style={{ marginBottom: '48px' }}>
            {t.education.title}
          </h2>

          <div className="edu-wheel-layout">
            {/* Left: the circle rail */}
            <div className="edu-wheel-circle-wrap">
              <svg
                width="400"
                height="400"
                viewBox="0 0 400 400"
                style={{ overflow: 'visible' }}
              >
                {/* Circle rail */}
                <circle
                  cx={CX}
                  cy={CY}
                  r={RADIUS}
                  fill="none"
                  stroke="var(--border-med)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                />

                {/* Center dot */}
                <circle cx={CX} cy={CY} r="6" fill="var(--accent)" opacity="0.4" />

                {/* Cards on the circle */}
                {diplomas.map((d, i) => {
                  const angleDeg = angles[i] + rotation
                  const angleRad = (angleDeg * Math.PI) / 180
                  const x = CX + RADIUS * Math.cos(angleRad)
                  const y = CY + RADIUS * Math.sin(angleRad)
                  const isActive = i === activeIndex

                  // Card dimensions
                  const cw = isActive ? 160 : 120
                  const ch = isActive ? 70 : 48

                  return (
                    <g
                      key={i}
                      style={{
                        transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                      }}
                      onClick={() => setActiveIndex(i)}
                    >
                      {/* Line from center to card */}
                      <line
                        x1={CX}
                        y1={CY}
                        x2={x}
                        y2={y}
                        stroke={d.color}
                        strokeWidth={isActive ? 2 : 0.8}
                        strokeDasharray={isActive ? 'none' : '3 3'}
                        opacity={isActive ? 0.6 : 0.2}
                        style={{ transition: 'all 0.7s ease' }}
                      />
                      {/* Card rect */}
                      <rect
                        x={x - cw / 2}
                        y={y - ch / 2}
                        width={cw}
                        height={ch}
                        rx="10"
                        fill={isActive ? d.color : 'var(--surface)'}
                        stroke={d.color}
                        strokeWidth={isActive ? 0 : 1.5}
                        opacity={isActive ? 1 : 0.7}
                        style={{ transition: 'all 0.7s cubic-bezier(0.4,0,0.2,1)' }}
                      />
                      {/* Level */}
                      <text
                        x={x}
                        y={isActive ? y - 10 : y - 6}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={isActive ? 15 : 12}
                        fontWeight="700"
                        fontFamily="var(--font)"
                        fill={isActive ? 'white' : d.color}
                        style={{ transition: 'all 0.7s ease' }}
                      >
                        {d.level}
                      </text>
                      {/* Period */}
                      <text
                        x={x}
                        y={isActive ? y + 10 : y + 9}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={isActive ? 11 : 10}
                        fontFamily="var(--font)"
                        fill={isActive ? 'rgba(255,255,255,0.85)' : 'var(--ink-3)'}
                        style={{ transition: 'all 0.7s ease' }}
                      >
                        {d.period}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Right: active diploma detail */}
            <div
              className="edu-wheel-detail"
              key={activeIndex}
            >
              <div
                className="edu-wheel-level"
                style={{ background: diplomas[activeIndex].color }}
              >
                {diplomas[activeIndex].level}
              </div>
              <h3 className="edu-wheel-degree">
                {diplomas[activeIndex].degree}
              </h3>
              <p className="edu-wheel-school">
                {diplomas[activeIndex].school}
              </p>
              <p className="edu-wheel-period">
                {diplomas[activeIndex].period}
              </p>
              <ul className="edu-wheel-tasks">
                {diplomas[activeIndex].tasks.map((task, j) => (
                  <li key={j}>{task}</li>
                ))}
              </ul>

              {/* Dots navigation */}
              <div className="edu-wheel-dots">
                {diplomas.map((d, i) => (
                  <button
                    key={i}
                    className="edu-wheel-dot"
                    style={{
                      background: i === activeIndex ? d.color : 'var(--border-med)',
                      transform: i === activeIndex ? 'scale(1.4)' : 'scale(1)',
                    }}
                    onClick={() => setActiveIndex(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
