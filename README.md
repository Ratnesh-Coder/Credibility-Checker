# Credibility-Checker
A browser extension that uses the Gemini API to analyse text for credibility, providing a score, AI-powered analysis, and cross-referenced sources.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?logo=google-chrome&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Made with Gemini API](https://img.shields.io/badge/Made%20with-Gemini%20API-orange?logo=google)

# 🔎 Credibility Checker (Fake News Detector)

A Chrome extension that helps users evaluate the **credibility of online text**.  
It uses the **Google Gemini API** to provide a **credibility score, AI-powered analysis, and cross-referenced sources**, making it easier to spot misinformation.

---

## ✨ Features
- ✅ **Credibility Score (0–100)** – Quickly see how reliable the text is.  
- 🧠 **AI-Powered Analysis** – Get explanations for why a score was assigned.  
- 📚 **Cross-referenced Sources** – Suggested references for fact-checking.  
- 🖱️ **Highlight or Paste Text** – Analyze text directly from web pages.  
- 🎨 **Clean UI** – Lightweight, simple popup design.  

---

## 🛠️ Tech Stack
- **Manifest V3** (Chrome Extensions API)  
- **HTML, CSS, JavaScript**  
- **Google Gemini API** for text analysis  

---

## 🚀 Getting Started

### 1. Clone the Repository
Git Bash
```git clone https://github.com/your-username/credibility-checker.git```
```cd credibility-checker```

### 2. Project Structure
credibility-checker
│── manifest.json
│── popup.html
│── content.js
│── js/
│   └── popup.js
│── images/
│   ├── icon16.svg
│   ├── icon48.svg
│   └── icon128.svg

### 3. Get a Gemini API Key
Go to Google AI Studio
Generate a new API key
Open js/popup.js and replace:
const API_KEY = "YOUR_API_KEY_GOES_HERE";

### 4. Load the Extension in Chrome
Open chrome://extensions
Enable Developer mode (top right)
Click Load unpacked
Select the project folder
The extension will appear in your browser toolbar 🎉

🖼️ Screenshots
(Optional – add screenshots of the popup UI here for better presentation.)

⚙️ How It Works
1. User highlights or pastes text into the extension popup.
2. The text is sent to the Gemini API with a structured request.
3. The API responds with:
    Credibility Score
    AI Analysis (reasoning)
    Suggested Sources
4. Results are displayed instantly in the popup UI.

📜 License
This project is licensed under the MIT License – feel free to use, modify, and distribute it.

👨‍💻 Author
Developed by Ratnesh ✨
If you find this project useful, please ⭐ star the repository!
>>>>>>> de24ebabe3dc3805a97894cd84b71bca3c5cc055
