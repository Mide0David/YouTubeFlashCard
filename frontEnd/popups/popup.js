document.addEventListener('DOMContentLoaded', function () {
  const textList = document.getElementById('text-list');

  chrome.storage.local.get({ pastedTexts: [] }, function (data) {
    data.pastedTexts.reverse().forEach((text, index) => {
      const li = document.createElement('li');
      li.textContent = `${index + 1}. ${text}`;
      textList.appendChild(li);
    });
  });
});
