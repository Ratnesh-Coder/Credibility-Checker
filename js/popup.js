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

    // Function to handle the credibility check
    const checkCredibility = async () => {
        const text = inputText.value.trim();
        if (!text) {
            const message = "Please enter some text to analyze.";
            if (window.confirm) {
                window.confirm(message);
            } else {
                console.log(message);
            }
            return;
        }

        // Show loading state and hide previous results/errors
        checkButton.disabled = true;
        inputText.disabled = true;
        loadingIndicator.classList.remove('hidden');
        resultsDiv.classList.add('hidden');
        errorMessage.classList.add('hidden');

        try {
            // Send a message to the service worker to perform the check
            const response = await chrome.runtime.sendMessage({ action: 'check_credibility', text: text });
            
            if (response && response.error) {
                throw new Error(response.error);
            }

            // Update the UI with the results
            updateResults(response.data);

        } catch (error) {
            console.error('Error during API call:', error);
            errorMessage.textContent = 'An error occurred. Please try again later.';
            errorMessage.classList.remove('hidden');
        } finally {
            // Re-enable button and hide loading indicator
            checkButton.disabled = false;
            inputText.disabled = false;
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