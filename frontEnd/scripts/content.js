// Function to display the transcript on the YouTube page.
function displayTranscript(transcriptData) {
  // Remove existing transcript container if present.
  const existingContainer = document.getElementById('transcript-container');
  if (existingContainer) {
      existingContainer.remove();
  }

  // Create a container for the transcript.
  const transcriptContainer = document.createElement('div');
  transcriptContainer.id = 'transcript-container';
  transcriptContainer.style.position = 'fixed';
  transcriptContainer.style.right = '20px';
  transcriptContainer.style.top = '100px';
  transcriptContainer.style.width = '300px';
  transcriptContainer.style.height = '400px';
  transcriptContainer.style.overflowY = 'auto';
  transcriptContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
  transcriptContainer.style.border = '1px solid #ccc';
  transcriptContainer.style.padding = '10px';
  transcriptContainer.style.zIndex = '10000';
  transcriptContainer.style.fontSize = '14px';
  transcriptContainer.style.fontFamily = 'Arial, sans-serif';

  // Add the transcript text to the container.
  transcriptData.forEach(entry => {
      const p = document.createElement('p');
      p.textContent = entry.text;
      transcriptContainer.appendChild(p);
  });

  // Append the container to the body.
  document.body.appendChild(transcriptContainer);
}

// Function to fetch the transcript from your backend.
async function fetchTranscript(videoUrl) {
  try {
      const response = await fetch(`http://127.0.0.1:5000/get_transcript?video_url=${encodeURIComponent(videoUrl)}`);
      if (response.ok) {
          const transcriptData = await response.json();
          displayTranscript(transcriptData);
      } else {
          console.error('Failed to fetch transcript.');
      }
  } catch (error) {
      console.error('Error fetching transcript:', error);
  }
}

// Function to get the current video URL from the YouTube page.
function getVideoUrl() {
  const videoId = new URLSearchParams(window.location.search).get('v');
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : null;
}

// Function to initialize and update transcript display.
function initializeTranscript() {
  const videoUrl = getVideoUrl();
  if (videoUrl) {
      fetchTranscript(videoUrl);
  } else {
    console.error('could not find video URL');
  }
}

// Detect URL changes to refresh the transcript.
function onUrlChange(callback) {
  let lastUrl = location.href; 
  new MutationObserver(() => {
      const currentUrl = location.href;
      if (currentUrl !== lastUrl) {
          lastUrl = currentUrl;
          callback();
      }
  }).observe(document, { subtree: true, childList: true });
}

// Initialize on load and handle YouTube navigation.
initializeTranscript();
onUrlChange(() => {
  initializeTranscript();
});

//text highlight preview and display
document.addEventListener('mouseup', function () {
  const selectedText = window.getSelection().toString().trim();
  const existingPreview = document.getElementById('text-preview');

  // Remove existing preview if no text is selected
  if (!selectedText) {
    if (existingPreview) existingPreview.remove();
    return;
  }

  // If there's already a preview, update it
  if (existingPreview) {
    existingPreview.querySelector('.preview-text').textContent = selectedText;
    return;
  }

  // Create a new preview element
  const preview = document.createElement('div');
  preview.id = 'text-preview';
  preview.style.position = 'absolute';
  preview.style.border = '1px solid #000';
  preview.style.padding = '5px';
  preview.style.backgroundColor = '#fff';
  preview.style.zIndex = '10000';
  preview.innerHTML = `
    <span class="preview-text">${selectedText}</span>
    <button id="confirm-btn">Confirm</button>
  `;

  document.body.appendChild(preview);

  // Position the preview near the cursor
  const mouseX = event.pageX;
  const mouseY = event.pageY;
  preview.style.left = `${mouseX}px`;
  preview.style.top = `${mouseY}px`;
  
  // Add click event to confirm button
  document.getElementById('confirm-btn').addEventListener('click', () => {
    chrome.storage.local.get({ pastedTexts: [] }, function (data) {
      const updatedTexts = [...data.pastedTexts, selectedText];
      chrome.storage.local.set({ pastedTexts: updatedTexts }, function () {
        // Remove the preview on confirm
        preview.remove();
      });
    });
  });
});
