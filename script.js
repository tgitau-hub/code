const form = document.getElementById("summarizeForm");
const summaryResult = document.getElementById("summaryResult");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const url = document.getElementById("urlInput").value;

  // Show loading alert
  const alertMessage = "Summarizing, please wait...";
  const alertElement = document.createElement("div");
  alertElement.textContent = alertMessage;
  document.body.appendChild(alertElement);

  // Prepare XMLHttpRequest
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      try {
        const response = JSON.parse(this.responseText);
        summaryResult.textContent = response.summary || "Summary not available.";
      } catch (error) {
        summaryResult.textContent = "Error processing response.";
      }

      // Remove loading alert only if it exists in the DOM
      if (document.body.contains(alertElement)) {
        document.body.removeChild(alertElement);
      }
    }
  });

  // API Endpoint with Dynamic User Input
  const apiUrl = `https://article-extractor-and-summarizer.p.rapidapi.com/summarize?url=${encodeURIComponent(
    url
  )}&lang=en&engine=2`;

  xhr.open("GET", apiUrl);
  xhr.setRequestHeader(
    "x-rapidapi-key",
    "effcfe6caemsh2f846ef3d69d1f9p1f089fjsn08b252090f86"
  );
  xhr.setRequestHeader(
    "x-rapidapi-host",
    "article-extractor-and-summarizer.p.rapidapi.com"
  );

  xhr.send();
});
