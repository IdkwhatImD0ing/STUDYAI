"""Base state for the app."""

import reflex as rx


class State(rx.State):
    """Base state for the app.

    The base state is used to store general vars used throughout the app.
    """

    view: str

    youtubeLink: str
    text: str
    image: str

    def setView(self, view: str):
        self.view = view

    def setYoutubeLink(self, youtubeLink: str):
        self.youtubeLink = youtubeLink

    def setText(self, text: str):
        self.text = text
    
    def setImage(self, image: str):
        self.image = image
