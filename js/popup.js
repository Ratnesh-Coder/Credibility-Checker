// Paste your API key here
const apiKey = "AIzaSyBabW_45sr9yXDQSfkvm3lRzxNME9HtvCQ";

document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const checkButton = document.getElementById('checkButton');
    const inputText = document.getElementById('inputText');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsDiv = document.getElementById('results');
    const scoreValue = document.getElementById('scoreValue');
    const scoreIndicator = document.getElementById('scoreIndicator');
    const analysisText = document.getElementById('analysisText');
    const sourcesList = document.getElementById('sourcesList');
    const errorMessage = document.getElementById('errorMessage');

    // Function to get the selected text from the active tab.
    const getSelectedText = () => {
      return window.getSelection().toString().trim();
    };

    // As soon as the popup opens, execute the function on the active tab
    // to get the selected text and populate the input field.
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: getSelectedText,
        },
        (results) => {
          if (results && results[0] && results[0].result) {
            inputText.value = results[0].result;
            // Now, automatically run the analysis!
            checkCredibility();
          }
        }
      );
    });

    // Function to handle API call and response
    const checkCredibility = async () => {
        const text = inputText.value.trim();
        if (!text) {
            // Using a simple message for the popup, as alert() is discouraged
            // A more robust solution would be a custom modal or inline message
            const message = "Please enter some text to analyze.";
            if (window.confirm) {
                // If a confirmation dialog is available, use it (unlikely in a popup)
                window.confirm(message);
            } else {
                console.log(message);
            }
            return;
        }

        // Show loading state and hide previous results/errors
        checkButton.disabled = true;
        loadingIndicator.classList.remove('hidden');
        resultsDiv.classList.add('hidden');
        errorMessage.classList.add('hidden');

        try {
            // The prompt for the AI model
            const prompt = `Analyze the following text for credibility. Provide a single credibility score from 0 (completely false/misleading) to 100 (highly credible). Then, provide a detailed analysis of why you gave that score, and finally, list 3-5 potential sources that would be used to cross-reference this information. Format your response as a JSON object with the following structure:
            {
              "score": number,
              "analysis": string,
              "sources": [string, string, ...]
            }
            Do not include any other text or formatting outside of the JSON.
            \n\nText to analyze: "${text}"`;

            // Configure the payload for the Gemini API call
            const payload = {
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "OBJECT",
                        properties: {
                            "score": { "type": "NUMBER" },
                            "analysis": { "type": "STRING" },
                            "sources": { "type": "ARRAY", "items": { "type": "STRING" } }
                        }
                    }
                }
            };
            
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            const jsonText = result.candidates[0].content.parts[0].text;
            const data = JSON.parse(jsonText);

            // Update the UI with the results
            updateResults(data);

        } catch (error) {
            console.error('Error during API call:', error);
            errorMessage.classList.remove('hidden');
        } finally {
            // Re-enable button and hide loading indicator
            checkButton.disabled = false;
            loadingIndicator.classList.add('hidden');
        }
    };

    // Function to update the UI with the analysis data
    const updateResults = (data) => {
        const { score, analysis, sources } = data;

        // Set score value and color
        scoreValue.textContent = `${score}/100`;
        let colorClass;
        if (score > 80) {
            colorClass = 'bg-success';
        } else if (score > 50) {
            colorClass = 'bg-warning';
        } else {
            colorClass = 'bg-danger';
        }
        scoreIndicator.className = `mt-2 h-3 rounded-full ${colorClass}`;
        scoreIndicator.style.width = `${score}%`;

        // Set analysis text
        analysisText.textContent = analysis;

        // Set sources list
        sourcesList.innerHTML = '';
        if (sources && sources.length > 0) {
            sources.forEach(source => {
                const li = document.createElement('li');
                li.textContent = source;
                sourcesList.appendChild(li);
            });
        } else {
            sourcesList.textContent = 'No specific sources found.';
        }

        // Show the results section
        resultsDiv.classList.remove('hidden');
    };

    // Add this line back to make the button work for manual input.
    checkButton.addEventListener('click', checkCredibility);
});