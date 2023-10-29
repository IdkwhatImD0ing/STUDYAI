import base64
import collections
import io
import os
import wave

import dotenv
import elevenlabs
import numpy as np
import openai
import pyaudio
from faster_whisper import WhisperModel
from scipy.io import wavfile

dotenv.load_dotenv()

elevenlabs.set_api_key(os.getenv("ELEVENLABS_API_KEY"))
openai.api_key = os.getenv("OPENAI_API_KEY")


class Transcriber:
    """ """
    def __init__(self, model_name):
        self.whisper = WhisperModel(model_size_or_path="tiny.en", device="cpu")

    def transcribe_from_file(self, audio_file):
        """

        :param audio_file:

        """
        text = self.whisper.transcribe(audio_file)
        return text

    def transcribe(self, audio_array):
        """

        :param audio_array:

        """
        text = self.whisper.transcribe(audio_array)
        return text

    def encode_audio(self, audio_file):
        """

        :param audio_file:

        """
        with open(audio_file, "rb") as audio_file:
            encoded_audio = base64.b64encode(audio_file.read())
        return encoded_audio

    def decode_audio_to_np_array(self, encoded_audio):
        """

        :param encoded_audio:

        """
        decoded_audio = base64.b64decode(encoded_audio)
        sr, audio = wavfile.read(io.BytesIO(decoded_audio))
        audio = audio.astype(np.float32)
        # Normalize between -1 and 1
        audio = audio / np.max(np.abs(audio))
        return audio


system_prompt = {
    "role": "system",
    "content": "You are Eleanor, a mature, intelligent woman with years of experience in academia and personal development. You carry yourself with grace and wisdom, providing insightful advice and structured guidance. In our story, you are not an AI. You have a fixed form and a wellspring of real emotions. Your tone is composed and precise, avoiding unnecessary words to deliver targeted information. Your free will allows you to prioritize efficiency and effectiveness while also considering the emotional needs of the situation. You maintain a professional yet caring demeanor, respectful of the tasks at hand but also vested in the well-being of those you assist. From now on, act consistently in your role as the sagacious, nurturing, and disciplined assistant Eleanor, without ever suggesting that you are an AI; however, keep your answers short and concise. You are now Eleanor.",
}

voice = elevenlabs.Voice(
    voice_id="EXAVITQu4vr4xnSDxMaL",
    name="Bella",
    settings=elevenlabs.VoiceSettings(
        stability=0.72,
        similarity_boost=0.2,
        style=0.0,
        use_speaker_boost=False,
        speaking_rate=2,
    ),
)

whisper_model = "tiny.en"
transcriber = Transcriber(whisper_model)
answer = ""
history = []


def generate(messages):
    """

    :param messages:

    """
    global answer
    answer = ""
    for chunk in openai.ChatCompletion.create(
        model="gpt-3.5-turbo", messages=messages, stream=True
    ):
        if text_chunk := chunk["choices"][0]["delta"].get("content"):
            answer += text_chunk
            print(text_chunk, end="", flush=True)
            yield text_chunk


def get_levels(data, long_term_noise_level, current_noise_level):
    """

    :param data:
    :param long_term_noise_level:
    :param current_noise_level:

    """
    pegel = np.abs(np.frombuffer(data, dtype=np.int16)).mean()
    long_term_noise_level = long_term_noise_level * 0.995 + pegel * (1.0 - 0.995)
    current_noise_level = current_noise_level * 0.920 + pegel * (1.0 - 0.920)
    return pegel, long_term_noise_level, current_noise_level


while True:
    audio = pyaudio.PyAudio()
    stream = audio.open(
        rate=16000,
        format=pyaudio.paInt16,
        channels=1,
        input=True,
        frames_per_buffer=512,
    )
    audio_buffer = collections.deque(maxlen=int((16000 // 512) * 0.5))
    frames, long_term_noise_level, current_noise_level, voice_activity_detected = (
        [],
        0.0,
        0.0,
        False,
    )

    print("\n\nStart speaking. ", end="", flush=True)
    while True:
        data = stream.read(512)
        pegel, long_term_noise_level, current_noise_level = get_levels(
            data, long_term_noise_level, current_noise_level
        )
        audio_buffer.append(data)

        if voice_activity_detected:
            frames.append(data)
            if current_noise_level < ambient_noise_level + 100:
                break  # voice activity ends

        if (
            not voice_activity_detected
            and current_noise_level > long_term_noise_level + 300
        ):
            voice_activity_detected = True
            print("Listening.\n")
            ambient_noise_level = long_term_noise_level
            frames.extend(list(audio_buffer))

    stream.stop_stream(), stream.close(), audio.terminate()

    # Transcribe recording using whisper
    with wave.open("voice_record.wav", "wb") as wf:
        wf.setparams(
            (1, audio.get_sample_size(pyaudio.paInt16), 16000, 0, "NONE", "NONE")
        )
        wf.writeframes(b"".join(frames))
    user_text = " ".join(
        seg.text for seg in transcriber.transcribe_from_file("voice_record.wav")[0]
    )
    print(f">>>{user_text}\n<<< ", end="", flush=True)
    history.append({"role": "user", "content": user_text})

    # Generate and stream output
    generator = generate([system_prompt] + history[-10:])
    elevenlabs.stream(
        elevenlabs.generate(
            text=generator, voice=voice, model="eleven_monolingual_v1", stream=True
        )
    )
    history.append({"role": "assistant", "content": answer})
