from STUDYAI.templates import template

import reflex as rx
from STUDYAI.state import State


class Recorder(rx.Component):

    library = "../public/AutoRecorder.js"
    tag = "VoiceActivityComponent"
    is_default = True
    lib_dependencies: list[str] = ["recordrtc"]
    processing = State.processing
    newAudio = State.newAudio
    chunks = State.streamChunks

    def _get_imports(self):
        return {}

    def _get_custom_code(self):
        return """
        import dynamic from "next/dynamic";
        const VoiceActivityComponent = dynamic(() => import("../public/AutoRecorder.js"), { ssr: false }); 
        """


recorder = Recorder.create


@template(route="/recorder", title="Recorder", image="/github.svg")
def recorderjs() -> rx.Component:
    """The recorder page.

    Returns:
        The UI for the recorder page.
    """

    return rx.center(rx.hstack(rx.text("Recorder"), recorder()))
