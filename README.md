# Fake-News-Detector
A browser extension that uses the Gemini API to analyze text for credibility, providing a score, AI-powered analysis, and cross-referenced sources.

Credibility Checker Browser Extension
A browser extension that uses the Gemini API to analyze text for credibility, providing users with a score, an AI-powered analysis, and cross-referenced sources.

Features
Text Analysis: Get a credibility score from 0 to 100 on any text.

AI-Powered Analysis: Receive a detailed breakdown of why a score was given.

Source Cross-referencing: See a list of potential sources to verify the information.

Simple UI: A clean and intuitive pop-up interface for quick checks.

Getting Started
Follow these steps to load the extension in your browser.

1. Project Setup
Ensure your project folder contains the following files and folders:

manifest.json

popup.html

js/ (folder containing popup.js)

images/ (folder containing icon16.svg, icon48.svg, and icon128.svg)

2. Get an API Key
The extension requires a Google Gemini API key to function.

Go to Google AI Studio.

Create a new API key.

Open js/popup.js and replace "YOUR_API_KEY_GOES_HERE" with your new key.

3. Load the Extension in Your Browser
Open your browser and navigate to chrome://extensions.

Enable Developer mode in the top-right corner.

Click the Load unpacked button.

Select your project's main folder.

The "Credibility Checker" extension should now appear in your browser's toolbar.

How It Works
The extension sends the user-inputted text to the Gemini API, which processes the request using a structured prompt. The API's response, formatted as a JSON object, is then used to display the credibility score, analysis, and sources in the pop-up.
