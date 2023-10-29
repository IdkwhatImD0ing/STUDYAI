from STUDYAI.templates import template

import reflex as rx

class Recorder(rx.Component):

    library = "../public/AutoRecorder.js"
    tag = "VoiceActivityComponent"
    is_default = True


recorder = Recorder.create

@template(route="/recorder", title="Recorder", image="/github.svg")
def recorderjs() -> rx.Component:
    """The recorder page.

    Returns:
        The UI for the recorder page.
    """

    return rx.center(
        rx.hstack(
            rx.text("Recorder"),
            recorder()
        )
    )
    