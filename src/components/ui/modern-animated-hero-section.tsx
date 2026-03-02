import type React from "react"
import { useState, useEffect, useCallback, useRef, useMemo } from "react"

interface Character {
  char: string
  x: number
  delay: number
  duration: number
}

class TextScramble {
  el: HTMLElement
  chars: string
  queue: Array<{
    from: string
    to: string
    start: number
    end: number
    char?: string
  }>
  frame: number
  frameRequest: number
  resolve: (value: void | PromiseLike<void>) => void

  constructor(el: HTMLElement) {
    this.el = el
    this.chars = '!<>-_\\/[]{}—=+*^?#'
    this.queue = []
    this.frame = 0
    this.frameRequest = 0
    this.resolve = () => {}
    this.update = this.update.bind(this)
  }

  setText(newText: string) {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise<void>((resolve) => this.resolve = resolve)
    this.queue = []
    
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from, to, start, end })
    }
    
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }

  update() {
    let output = ''
    let complete = 0
    
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)]
          this.queue[i].char = char
        }
        output += `<span class="text-cyan-400">${char}</span>`
      } else {
        output += from
      }
    }
    
    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }
}

interface ScrambledTitleProps {
  phrases?: string[]
  className?: string
}

const ScrambledTitle: React.FC<ScrambledTitleProps> = ({ 
  phrases = [
    'Delta7 Tecnologia',
    'Soluções em TI',
    'Segurança Digital',
    'Infraestrutura',
    'Suporte 24/7',
    'Cloud Computing'
  ],
  className = ''
}) => {
  const elementRef = useRef<HTMLSpanElement>(null)
  const scramblerRef = useRef<TextScramble | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (elementRef.current && !scramblerRef.current) {
      scramblerRef.current = new TextScramble(elementRef.current)
      setMounted(true)
    }
  }, [])

  useEffect(() => {
    if (mounted && scramblerRef.current) {
      let counter = 0
      const next = () => {
        if (scramblerRef.current) {
          scramblerRef.current.setText(phrases[counter]).then(() => {
            setTimeout(next, 2000)
          })
          counter = (counter + 1) % phrases.length
        }
      }

      next()
    }
  }, [mounted, phrases])

  return (
    <span 
      ref={elementRef} 
      className={`font-mono text-2xl md:text-4xl lg:text-5xl font-bold text-white ${className}`}
    >
      {phrases[0]}
    </span>
  )
}

interface RainingLettersProps {
  title?: string
  phrases?: string[]
  charCount?: number
  showTitle?: boolean
  className?: string
  children?: React.ReactNode
}

const RainingLetters: React.FC<RainingLettersProps> = ({
  title = "DELTA7",
  phrases,
  charCount = 150,
  showTitle = true,
  className = '',
  children
}) => {
  const allChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  
  // Generate characters once, use CSS animations for falling
  const characters = useMemo(() => {
    const chars: Character[] = []
    for (let i = 0; i < charCount; i++) {
      chars.push({
        char: allChars[Math.floor(Math.random() * allChars.length)],
        x: Math.random() * 100,
        delay: Math.random() * 15, // stagger start
        duration: 8 + Math.random() * 12, // varying fall speeds
      })
    }
    return chars
  }, [charCount])

  const isTransparent = className.includes('bg-transparent')

  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${isTransparent ? '' : 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'} ${className}`}>
      <style>{`
        @keyframes rain-fall {
          0% { transform: translateY(-5vh); opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { transform: translateY(105vh); opacity: 0; }
        }
        @keyframes rain-glow {
          0%, 100% { color: rgba(59, 130, 246, 0.3); text-shadow: none; }
          50% { color: rgba(34, 211, 238, 0.9); text-shadow: 0 0 10px rgba(34, 211, 238, 0.8); }
        }
        .rain-char {
          animation: rain-fall var(--duration) linear var(--delay) infinite;
          position: absolute;
          left: var(--x);
          top: -20px;
          font-family: monospace;
          font-size: 14px;
          color: rgba(59, 130, 246, 0.3);
          user-select: none;
          pointer-events: none;
        }
        .rain-char:nth-child(5n) {
          animation: rain-fall var(--duration) linear var(--delay) infinite, rain-glow 3s ease-in-out var(--delay) infinite;
        }
      `}</style>

      {/* Content overlay */}
      {showTitle && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white/10 tracking-widest mb-8">
            {title}
          </h1>
          <div className="pointer-events-auto">
            <ScrambledTitle phrases={phrases} />
          </div>
        </div>
      )}

      {/* Children content */}
      {children && (
        <div className="absolute inset-0 z-20">
          {children}
        </div>
      )}

      {/* Raining Characters - Pure CSS animation, no React re-renders */}
      {characters.map((char, index) => (
        <span
          key={index}
          className="rain-char"
          style={{
            '--x': `${char.x}%`,
            '--delay': `${char.delay}s`,
            '--duration': `${char.duration}s`,
          } as React.CSSProperties}
        >
          {char.char}
        </span>
      ))}
    </div>
  )
}

export { RainingLetters, ScrambledTitle }
export default RainingLetters
