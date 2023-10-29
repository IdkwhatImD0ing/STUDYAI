import React, {useEffect} from 'react'

const VoiceActivityComponent = () => {
  const startRecording = () => {
    console.log('Start Recording')
  }

  const stopRecording = () => {
    console.log('Stop Recording')
  }

  const initializeAudio = () => {
    navigator.mediaDevices
      .getUserMedia({audio: true})
      .then((stream) => {
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
