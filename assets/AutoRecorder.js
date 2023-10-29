import React, {useEffect, useRef} from 'react'
import RecordRTC from 'recordrtc'

const VoiceActivityComponent = () => {
  const recordingRef = useRef(false)
  const recorder = useRef(null)
  const microphone = useRef(null)

  const startRecording = () => {
    if (!recordingRef.current) {
      console.log('Start Recording')
      const options = {
        type: 'audio',
        recorderType: RecordRTC.StereoAudioRecorder,
        desiredSampRate: 16000,
        numberOfAudioChannels: 1,
      }

      recorder.current = RecordRTC(microphone.current, options)
      recorder.current.startRecording()
      recordingRef.current = true
    }
  }

  const stopRecording = () => {
    if (recordingRef.current) {
      recordingRef.current = false
      console.log('Stop Recording')
      recorder.current.stopRecording(() => {
        const audioBlob = recorder.current.getBlob()

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

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({audio: true})
      .then((stream) => {
        microphone.current = stream

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
  }, [])

  return <div>Autonomous Voice Activity Component</div>
}

export default VoiceActivityComponent
