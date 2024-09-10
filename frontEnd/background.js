
// Clears stored text on page refresh
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ pastedTexts: [] });
});
