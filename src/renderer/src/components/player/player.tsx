import './player.css'
import * as React from 'react'
import { useRef, useState, useEffect, useCallback } from 'react'
import {
  FaBackward,
  FaForward,
  FaPause,
  FaPlay,
  FaVolumeLow,
  FaVolumeXmark,
  FaVolumeHigh,
  FaComments
} from 'react-icons/fa6'
import { Chat } from '../chat/chat'

export interface PlayerProps {
  className?: string
}

const snowStorm2 = '#eceff4'
const HIDE_MOUSE_AFTER = 5000

export const Player: React.FC<PlayerProps> = ({ className = '' }) => {
  const [playing, setPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const chatRef = useRef<HTMLDivElement | null>(null)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1.0)
  const [mouseHidden, setMouseHidden] = useState(false)
  const [showRemaining, setShowRemaining] = useState(false)
  const hideCursorTimeout = useRef<string | number | NodeJS.Timeout | null>(null)
  const [showChat, setShowChat] = useState(true)

  useEffect(() => {
    hideCursorTimeout.current = setTimeout(() => {
      if (playing) setMouseHidden(true)
    }, HIDE_MOUSE_AFTER)
    return () => {
      if (hideCursorTimeout.current) clearTimeout(hideCursorTimeout.current)
    }
  }, [playing, mouseHidden])

  const handlePlaying = (): void => {
    setPlaying((p) => {
      if (videoRef.current) {
        p ? videoRef.current.pause() : videoRef.current.play()
        return !p
      }
      return p
    })
  }

  const seekBackward = useCallback((): void => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10
    }
  }, [])

  const seekForward = useCallback((): void => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10
    }
  }, [])

  useEffect(() => {
    const listener = (e: KeyboardEvent): void => {
      if (e.code === 'Space')
        setPlaying((p) => {
          p ? videoRef.current?.pause() : videoRef.current?.play()
          return !p
        })
      if (e.code === 'ArrowRight') seekForward()
      if (e.code === 'ArrowLeft') seekBackward()
    }
    const chatListener = (e: KeyboardEvent): void => {
      if (e.code === 'Enter') setShowChat((s) => !s)
    }
    window.addEventListener('keydown', chatListener)
    if (!showChat) window.addEventListener('keydown', listener)
    return () => {
      window.removeEventListener('keydown', listener)
      window.removeEventListener('keydown', chatListener)
    }
  }, [showChat, seekBackward, seekForward])

  const toggleMute = (): void => {
    setVolume((v) => {
      if (videoRef.current) {
        if (v === 0.0) {
          videoRef.current.volume = 1.0
          return 1.0
        } else {
          videoRef.current.volume = 0.0
          return 0.0
        }
      }
      return v
    })
  }

  const secondsToHms = (secs): string => {
    const d = Number(secs)
    const h = Math.floor(d / 3600)
    const m = Math.floor((d % 3600) / 60)
    const s = Math.floor((d % 3600) % 60)

    const hDisplay = h > 0 ? h + ':' : ''
    const mDisplay = (m < 10 ? '0' + m : m) + ':'
    const sDisplay = s < 10 ? '0' + s : s
    return hDisplay + mDisplay + sDisplay
  }

  return (
    <div className="container">
      {showChat && (
        <>
          <div ref={chatRef} className="chat">
            <Chat />
          </div>
          <div
            onMouseDown={() => {
              const move = (e: MouseEvent): void => {
                e.preventDefault()
                if (chatRef.current) {
                  chatRef.current.style.width = e.clientX + 'px'
                }
              }
              window.addEventListener('mousemove', move)
              window.addEventListener('mouseup', () =>
                window.removeEventListener('mousemove', move)
              )
            }}
            style={{
              width: '10px',
              height: '100%',
              backgroundColor: '#2e3440',
              cursor: 'col-resize'
            }}
          />
        </>
      )}
      <div className={`${className} video-container`}>
        <div
          ref={overlayRef}
          className={`video-overlay ${mouseHidden ? 'inactive' : ''}`}
          onMouseMove={() => setMouseHidden(false)}
          onMouseDown={() => setMouseHidden(false)}
        >
          <div className="show-chat" onClick={() => setShowChat((s) => !s)}>
            <FaComments className="controls-button" color={snowStorm2} size={30} />
          </div>
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
            <div className="controls-bottom-audio">
              <input
                type="range"
                step="any"
                min={0.0}
                max={1.0}
                value={volume}
                onChange={(e) => {
                  if (videoRef.current) {
                    videoRef.current.volume = parseFloat(e.target.value)
                    setVolume(videoRef.current.volume)
                  }
                }}
                className="audio-slider"
              />
              {volume === 0.0 && (
                <FaVolumeXmark
                  className="controls-button"
                  color={snowStorm2}
                  size={30}
                  onClick={toggleMute}
                />
              )}
              {volume > 0.0 && volume <= 0.5 && (
                <FaVolumeLow
                  className="controls-button"
                  color={snowStorm2}
                  size={30}
                  onClick={toggleMute}
                />
              )}
              {volume > 0.5 && (
                <FaVolumeHigh
                  className="controls-button"
                  color={snowStorm2}
                  size={30}
                  onClick={toggleMute}
                />
              )}
            </div>
            <div className="controls-bottom-bar">
              <input
                type="range"
                min={0}
                max={videoRef.current?.duration}
                step="any"
                value={progress}
                onChange={(e) => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = parseFloat(e.target.value)
                    setProgress(videoRef.current.currentTime)
                  }
                }}
              />
              <span
                className="progress"
                style={{
                  width: `${videoRef.current ? (progress / videoRef.current.duration) * 100 : 0}%`
                }}
              />
            </div>
            <div className="time-tracker" onClick={() => setShowRemaining((s) => !s)}>
              {!showRemaining && (videoRef.current ? secondsToHms(progress) : '00:00')}
              {showRemaining &&
                (videoRef.current
                  ? '-' + secondsToHms(videoRef.current.duration - progress)
                  : '0:0')}
            </div>
          </div>
        </div>
        <video
          autoPlay
          src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          className="video"
          ref={videoRef}
          onVolumeChange={() => {
            if (videoRef.current) {
              setVolume(videoRef.current.volume)
            }
          }}
          onTimeUpdate={() => {
            if (videoRef.current) {
              setProgress(videoRef.current.currentTime)
            }
          }}
        />
      </div>
    </div>
  )
}
