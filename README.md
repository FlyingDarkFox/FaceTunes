# FaceTunes

FaceTunes is a web application that uses advanced emotion recognition technology to analyze your mood and recommend music playlists. 

## Features

- **Real-time Emotion Recognition**: Utilizes webcam input to analyze facial expressions and determine the user's emotional state.
- **Personalized Music Recommendations**: Based on detected emotions, FaceTunes recommends Spotify playlists that match the user's mood.
- **Interactive User Interface**: Simple and intuitive design makes it easy for users to capture their mood and enjoy personalized music recommendations.

## Technologies Used

- **Frontend**: React.js, TypeScript, Tailwind CSS
- **Backend**: Python, Flask
- **API Integration**: Spotify API for music recommendations
- **Emotion Recognition**: Deepface for real-time emotion detection

## Usage

- **Capture Your Mood**: Click on "Capture Your Mood" to open the camera. Capture your facial expression to analyze your mood.
- **Discover Music**: Based on your mood analysis, FaceTunes will recommend Spotify playlists that match your emotions.
- **Re-Capture**: If needed, click on "Re-Capture" to try again.

## Getting Started

### Prerequisites

- **Python 3.6+**: Ensure Python 3.6 or higher is installed on your system.
- **Pipenv**: Install pipenv if you haven't already. It will manage dependencies and virtual environments for your project.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/FlyingDarkFox/FaceTunes.git
cd Facetunes
```

2. Install dependencies:

```
// Install frontend dependencies

npm install

// Install backend dependencies

cd server
pipenv install
pipenv shell
```

This command will create a virtual environment and install all dependencies specified in your Pipfile and Pipfile.lock.

## Set up environment variables:

### 1. Create a Spotify Developer Account

- Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and log in or create an account.

### 2. Create a New App & Retrieve Client ID and Client Secret

- After creating your app, you will see your Client ID and Client Secret displayed on the app's dashboard.

### 3. Create a .env file in the root directory and add the following:

```
CLIENT_ID=<your-spotify-client-id>
CLIENT_SECRET=<your-spotify-client-secret>
FLASK_PORT=5001
```

## Run the application:

```
// Start the backend server (from the server directory)

flask run

# Start the frontend development server (from the root directory)

npm run dev
```

The application will be available at http://localhost:5173.



























## You can also add helpline function when user sad or anger they can connect with your teams member.


# this will add in this file :- src/components/CaptureImage/CaptureImage.tsx

```bash
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
  const [showHelpline, setShowHelpline] = useState<boolean>(false)

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

  const capture = () => {
    setErrors('')
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      setImageSrc(imageSrc)
    }
  }

  const getAlbums = async (highestEmotion: string) => {
    const data = await fetch(`api/albums/${highestEmotion}`)
    if (data.ok) {
      const response = await data.json()
      setIsLoading(true)
      setAlbums(response)
    }
  }

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

    // Show helpline if the emotion is sad or angry
    if (highestEmotion === 'sad' || highestEmotion === 'angry') {
      setShowHelpline(true)
      setTimeout(() => {
        setShowHelpline(false)
      }, 5000) // Show for 5 seconds
    }
    return
  }

  const handleSave = async () => {
    if (!imageSrc) return
    setErrors('')
    setIsGenerating(true)
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
      {showHelpline && (
        <div className='text-center text-red-500 font-bold'>
          Helpline: +91999999999
        </div>
      )}
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
```


##Thanks to our teams member 
FlyingDarkFox
@gauravyad12
FlyingDarkDev
DarkDev
