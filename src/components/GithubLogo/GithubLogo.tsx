import { useEffect, useRef } from 'react'
import './GithubLogo.scss'

export function GithubLogo() {
  const aRef = useRef<HTMLAnchorElement>(null)

  function spawnStar() {
    const star = document.createElement('div')
    star.className = 'star'
    star.style.top = `${25 + Math.random() * 50}%`
    star.style.left = `${25 + Math.random() * 50}%`
    aRef.current?.appendChild(star)
    setTimeout(() => {
      star.remove()
    }, 4 * 1000)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeout(() => {
        spawnStar()
      }, Math.random() * 4 * 1000)
    }, 4 * 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <a
      href="https://github.com/jeronimoek/color-translate-web"
      target="_blank"
      rel="noreferrer"
      className="logo"
      ref={aRef}
    >
      <img
        alt="github"
        src="https://static-00.iconduck.com/assets.00/github-icon-2048x1988-jzvzcf2t.png"
      />
    </a>
  )
}
