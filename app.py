
import streamlit as st
import streamlit.components.v1 as components
from pathlib import Path
import re

st.set_page_config(
    page_title="HEAPIFY 1.0",
    page_icon="🔷",
    layout="wide"
)

folder = Path(__file__).parent

html = (folder / "index.html").read_text(encoding="utf-8")
css = (folder / "STYLE.css").read_text(encoding="utf-8")
js = (folder / "script.js").read_text(encoding="utf-8")

# Embed CSS and JavaScript into the HTML page
html = re.sub(
    r'<link[^>]+href=["\']STYLE\.css["\'][^>]*>',
    lambda _: f"<style>{css}</style>",
    html,
    flags=re.IGNORECASE
)

html = re.sub(
    r'<script[^>]+src=["\']script\.js["\'][^>]*></script>',
    lambda _: f"<script>{js}</script>",
    html,
    flags=re.IGNORECASE
)

components.html(html, height=950, scrolling=True)
