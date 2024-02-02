import './player.css'
import * as React from 'react'
import { useRef, useState, useEffect } from 'react'
import { FaBackward, FaForward, FaPause, FaPlay } from 'react-icons/fa6'

export interface PlayerProps {
  className?: string
}

const snowStorm2 = '#eceff4'
const HIDE_MOUSE_AFTER = 5000

export const Player: React.FC<PlayerProps> = ({ className = '' }) => {
  const [playing, setPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const [progress, setProgress] = useState(0)
  const [mouseHidden, setMouseHidden] = useState(false)
  const timeout = useRef<string | number | NodeJS.Timeout | null>(null)

  useEffect(() => {
    timeout.current = setTimeout(() => {
      setMouseHidden(true)
    }, HIDE_MOUSE_AFTER)
    return () => {
      if (timeout.current) clearTimeout(timeout.current)
    }
  }, [mouseHidden])

  const handlePlaying = (): void => {
    setPlaying((p) => {
      if (videoRef.current) {
        p ? videoRef.current.pause() : videoRef.current.play()
        return !p
      }
      return p
    })
  }

  const seekBackward = (): void => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10
    }
  }

  const seekForward = (): void => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10
    }
  }

  return (
    <div className={`${className} video-container`}>
      <div
        ref={overlayRef}
        className={`video-overlay ${mouseHidden ? 'inactive' : ''}`}
        onMouseMove={() => setMouseHidden(false)}
        onMouseDown={() => setMouseHidden(false)}
      >
        <div className="controls-backward" onClick={seekBackward}>
          <FaBackward className="controls-button" color="#eceff4" size={30} />
        </div>
        <div className="controls-play" onClick={handlePlaying}>
          {playing ? (
            <FaPause className="controls-button" color={snowStorm2} size={60} />
          ) : (
            <FaPlay className="controls-button" color={snowStorm2} size={60} />
          )}
        </div>
        <div className="controls-forward" onClick={seekForward}>
          <FaForward className="controls-button" color={snowStorm2} size={30} />
        </div>
        <div className="controls-bottom">
          <div className="controls-bottom-play" onClick={handlePlaying}>
            {playing ? (
              <FaPause className="controls-button" color={snowStorm2} size={30} />
            ) : (
              <FaPlay className="controls-button" color={snowStorm2} size={30} />
            )}
          </div>
          {/* @ts-ignore setting the --progress css variable */}
          <div style={{ '--progress': `${progress}%` }} className="controls-bottom-bar">
            <span className="progress-track"></span>
            <span className="progress-bar"></span>
            <span
              className="thumb"
              onMouseDown={(e) => console.log(e.clientX)}
              onMouseMove={(e) => console.log(e.clientX)}
              onMouseUp={(e) => console.log(e.clientX)}
            ></span>
          </div>
        </div>
      </div>
      <video
        autoPlay
        src="https://wixplosives.github.io/codux-assets-storage/add-panel/video-placeholder.mp4"
        className="video"
        ref={videoRef}
        onTimeUpdate={() => {
          if (videoRef.current) {
            setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100)
          }
        }}
      />
    </div>
  )
}
