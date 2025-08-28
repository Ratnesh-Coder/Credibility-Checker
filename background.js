// Paste your API key here
const apiKey = "YOUR_API_KEY_GOES_HERE";

// This function will handle the entire API call and analysis.
const checkCredibility = async (text) => {
    try {
        // Clear old results and set status
        await chrome.storage.local.set({ analysisStatus: "analyzing" });

        const prompt = `Analyze the following text for credibility. Provide a single credibility score from 0 (completely false/misleading) to 100 (highly credible). Then, provide a detailed analysis of why you gave that score, and finally, list 3-5 potential sources that would be used to cross-reference this information. Format your response as a JSON object with the following structure:
        {
          "score": number,
          "analysis": string,
          "sources": [string, string, ...]
        }
        Do not include any other text or formatting outside of the JSON.
        \n\nText to analyze: "${text}"`;

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

        // Save the results to storage for the popup to read.
        await chrome.storage.local.set({ analysisStatus: "complete", results: data });

    } catch (error) {
        console.error('Error during API call:', error);
        await chrome.storage.local.set({ analysisStatus: "error" });
    }
};

// Create the context menu item when the extension is installed.
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "checkCredibility",
        title: "Check Credibility",
        contexts: ["selection"]
    });
});

// Handle the context menu click.
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "checkCredibility") {
        const selectedText = info.selectionText;
        if (selectedText) {
            checkCredibility(selectedText);
        }
    }
});
