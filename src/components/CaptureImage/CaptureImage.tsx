import Webcam from 'react-webcam'
import React, { useRef, useState, useEffect } from 'react'
import { Emotion } from '../types'
import { CaptureImageProps } from '../types'
import { SyncLoader } from 'react-spinners'

const CaptureImage: React.FC<CaptureImageProps> = ({
  closeModal,
  setAlbums,
  setEmotions,
  setIsLoading
}) => {
  const webcamRef = useRef<Webcam>(null)
  const [imageSrc, setImageSrc] = useState<string | null>()
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>()
  const [errors, setErrors] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  useEffect(() => {
    const getDevices = async () => {
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(
        device => device.kind === 'videoinput'
      )
      setDevices(videoDevices)
      if (videoDevices.length > 0) {
        setSelectedDeviceId(videoDevices[0].deviceId)
      }
    }
    getDevices()
  }, [])

  // cature user's image
  const capture = () => {
    setErrors('')
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      setImageSrc(imageSrc)
    }
  }

  // get recommended albums based on the dominant emotion
  const getAlbums = async (highestEmotion: string) => {
    const data = await fetch(`api/albums/${highestEmotion}`)
    if (data.ok) {
      const response = await data.json()
      setIsLoading(true)
      setAlbums(response)
    }
  }

  // find the dominant emotion
  const findDominantEmotion = async (emotions: Emotion) => {
    let highestEmotion = ''
    let highestValue = -Infinity
    for (const emo in emotions) {
      if (emotions[emo] > highestValue) {
        highestValue = emotions[emo]
        highestEmotion = emo
      }
    }
    await getAlbums(highestEmotion)
    return
  }

  const handleSave = async () => {
    if (!imageSrc) return
    setErrors('')
    setIsGenerating(true)
    // Send a POST request to the 'api/images' endpoint with the captured image
    const response = await fetch('api/images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image: imageSrc })
    })
    if (response.ok) {
      const data = await response.json()
      setIsLoading(true)
      setEmotions(data)
      findDominantEmotion(data)
      closeModal()
    } else {
      setErrors(
        "Oops! We couldn't find your face. Try adjusting the lighting or moving closer to the camera"
      )
      setIsGenerating(false)
    }
  }

  return (
    <div className='p-4 space-y-4'>
      {imageSrc ? (
        <div className='space-y-4'>
          <img
            src={imageSrc}
            alt='Your Picture'
            className='mx-auto border-2 border-gray-200 rounded'
          />
          {errors && <div className='text-red-500 text-center'>{errors}</div>}
          <div className='flex justify-center space-x-4'>
            <button
              className='bg-blue-500 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded'
              onClick={handleSave}
              disabled={errors.length > 0}
            >
              Generate Music
            </button>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
              onClick={() => {
                setImageSrc('')
                setEmotions({})
              }}
            >
              Re-Capture
            </button>
          </div>
          {isGenerating && (
            <div className='text-center'>
              <SyncLoader color='#36d7b7' />
            </div>
          )}
        </div>
      ) : (
        <div className='space-y-4'>
          <label
            htmlFor='cameraSelect'
            className='block text-center font-semibold text-gray-700'
          >
            Choose your camera:{' '}
          </label>
          <select
            id='cameraSelect'
            className='block w-full border border-gray-300 rounded-md py-2 px-3 text-base leading-6'
            onChange={e => setSelectedDeviceId(e.target.value)}
            value={selectedDeviceId || ''}
          >
            {devices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId}`}
              </option>
            ))}
          </select>
          {selectedDeviceId && (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat='image/jpeg'
              videoConstraints={{ deviceId: selectedDeviceId }}
              width={370}
              height={240}
              className='mx-auto border-2 border-gray-200 rounded'
            />
          )}
          <div className='flex justify-center'>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
              onClick={capture}
            >
              Take a picture
            </button>
          </div>
        </div>
      )}
      <div className='flex justify-center'>
        <button
          className='mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
          onClick={closeModal}
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default CaptureImage
