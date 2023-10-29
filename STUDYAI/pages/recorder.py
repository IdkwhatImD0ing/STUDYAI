from typing import Any
from typing import Callable

import reflex as rx
from reflex.vars import Var

from STUDYAI.state import State
from STUDYAI.templates import template


class Recorder(rx.Component):
    """ """
    library = "../public/AutoRecorder.js"
    tag = "VoiceActivityComponent"
    is_default = True
    lib_dependencies: list[str] = ["recordrtc"]
    processing: Var[bool]
    chunk: Var[str]

    def _get_imports(self):
        """ """
        return {}

    def _get_custom_code(self):
        """


        :returns: import dynamic from "next/dynamic";
        const VoiceActivityComponent = dynamic(() => import("../public/AutoRecorder.js"), { ssr: false });

        """

    def get_event_triggers(self) -> dict[str, Any]:
        """ """
        return {
            **super().get_event_triggers(),
            "on_audio": lambda e0: [e0],
        }


recorder = Recorder.create


@template(route="/recorder", title="Recorder", image="/github.svg")
def recorderjs() -> rx.Component:
    """The recorder page.
    Yay


    :returns: The UI for the recorder page.

    """

    return rx.center(
        rx.hstack(
            rx.text("Recorder"),
            recorder(
                on_audio=lambda e: State.on_audio(e),
                chunk=State.chunk,
                processing=State.processing,
            ),
        )
    )
