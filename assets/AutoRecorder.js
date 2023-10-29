import React, {useEffect} from 'react'
import RecordRTC from 'recordrtc'

const VoiceActivityComponent = () => {
  const [recording, setRecording] = useState(false)
  const recorder = useRef(null)
  const microphone = useRef(null)

  const startRecording = () => {
    console.log('Start Recording')
    if (!recording) {
      recorder.current.startRecording()
      setRecording(true)
    }
  }

  const stopRecording = () => {
    console.log('Stop Recording')
    if (recording) {
      recorder.current.stopRecording(() => {
        const audioBlob = recorder.current.getBlob()
        setRecording(false)

        const reader = new FileReader()
        reader.readAsDataURL(audioBlob)
        reader.onloadend = () => {
          const base64Audio = reader.result
          console.log(base64Audio)
          // sendAudioToServer(base64Audio);
        }
      })
    }
  }

  const initializeAudio = () => {
    navigator.mediaDevices
      .getUserMedia({audio: true})
      .then((stream) => {
        microphone.current = stream

        const options = {
          type: 'audio',
          recorderType: RecordRTC.StereoAudioRecorder,
          desiredSampRate: 16000,
          numberOfAudioChannels: 1,
        }

        recorder.current = RecordRTC(stream, options)

        const audioContext = new AudioContext()
        const mediaStreamSource = audioContext.createMediaStreamSource(stream)

        // Load the worklet processor
        audioContext.audioWorklet
          .addModule('/voice-processor.js')
          .then(() => {
            const voiceProcessorNode = new AudioWorkletNode(
              audioContext,
              'voice-processor',
            )
            mediaStreamSource.connect(voiceProcessorNode)
            voiceProcessorNode.connect(audioContext.destination)

            voiceProcessorNode.port.onmessage = (event) => {
              if (event.data === 'start') {
                startRecording()
              } else if (event.data === 'stop') {
                stopRecording()
              }
            }
          })
          .catch((err) => {
            console.error(`Failed to add audio worklet: ${err}`)
          })
      })
      .catch((err) => {
        console.error(`Failed to get user media: ${err}`)
      })
  }

  return <button onClick={initializeAudio}>Initialize</button>
}

export default VoiceActivityComponent
