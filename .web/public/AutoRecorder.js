import React, {useEffect, useRef} from 'react'
import RecordRTC from 'recordrtc'

const VoiceActivityComponent = (props) => {
  const recordingRef = useRef(false)
  const recorder = useRef(null)
  const microphone = useRef(null)
  const audioContextRef = useRef(null)

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({audio: true})
      .then((stream) => {
        microphone.current = stream

        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext()
        }
        const audioContext = audioContextRef.current
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
            // voiceProcessorNode.connect(audioContext.destination)

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

  useEffect(() => {
    if (!props.chunk || props.chunk.length === 0) return

    const promises = props.chunk.map(async (base64) => {
      const decoded = atob(base64)
      const arrayBuffer = new ArrayBuffer(decoded.length)
      const bufferView = new Uint8Array(arrayBuffer)
      for (let i = 0; i < decoded.length; i++) {
        bufferView[i] = decoded.charCodeAt(i)
      }
      return await audioContextRef.current.decodeAudioData(arrayBuffer)
    })

    Promise.all(promises).then((audioBuffers) => {
      let totalLength = 0
      for (const audioBuffer of audioBuffers) {
        totalLength += audioBuffer.length
      }

      const outputBuffer = audioContextRef.current.createBuffer(
        1,
        totalLength,
        audioContextRef.current.sampleRate,
      )

      let offset = 0
      const outputData = outputBuffer.getChannelData(0)
      for (const audioBuffer of audioBuffers) {
        outputData.set(audioBuffer.getChannelData(0), offset)
        offset += audioBuffer.length
      }

      playAudio(outputBuffer)
    })
  }, [props.chunk])

  const playAudio = (audioBuffer) => {
    if (!audioContextRef.current) {
      return
    }

    const source = audioContextRef.current.createBufferSource()
    source.buffer = audioBuffer
    source.connect(audioContextRef.current.destination)
    source.start()
  }

  const startRecording = () => {
    if (props.processing) {
      return
    }
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
    if (props.processing) {
      return
    }
    if (recordingRef.current) {
      recordingRef.current = false
      console.log('Stop Recording')
      recorder.current.stopRecording(() => {
        const audioBlob = recorder.current.getBlob()

        const reader = new FileReader()
        reader.readAsDataURL(audioBlob)
        reader.onloadend = () => {
          const base64Audio = reader.result
          // Print type of newAudio
          console.log(props.onAudio)
          props.onAudio(base64Audio)
        }
      })
    }
  }

  return <div>Autonomous Voice Activity Component</div>
}

export default VoiceActivityComponent
