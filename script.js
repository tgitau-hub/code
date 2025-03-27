const form = document.getElementById("summarizeForm");
const summaryResult = document.getElementById("summaryResult");
const fileInput = document.getElementById("fileInput");
const textInput = document.getElementById("textInput");
const urlInput = document.getElementById("urlInput");

let alertElement; // Global alert element

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const url = urlInput.value.trim();
  const text = textInput.value.trim();
  const file = fileInput.files[0];

  showLoadingMessage("Summarizing, please wait...");

  if (file) {
    processPDF(file);
  } else if (text) {
    summarizeText(text);
  } else if (url) {
    summarizeURL(url);
  } else {
    summaryResult.textContent = "Please provide a URL, text, or upload a PDF.";
    removeAlert();
  }
});

// Function to summarize a URL
function summarizeURL(url) {
  const apiUrl = `https://article-extractor-and-summarizer.p.rapidapi.com/summarize?url=${encodeURIComponent(url)}&lang=en&engine=2`;
  fetchData(apiUrl);
}

// Function to summarize direct text input
function summarizeText(text) {
  const apiUrl = "https://article-extractor-and-summarizer.p.rapidapi.com/summarize-text";

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "x-rapidapi-key": "effcfe6caemsh2f846ef3d69d1f9p1f089fjsn08b252090f86",
      "x-rapidapi-host": "article-extractor-and-summarizer.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  })
    .then((response) => response.json())
    .then((data) => {
      const summary = data.summary || "Summary not available.";
      summaryResult.textContent = summary;
      saveSummaryToFirestore(summary);
      resetForm();
      removeAlert();
    })
    .catch(() => {
      summaryResult.textContent = "Error processing response.";
      removeAlert();
    });
}

// Function to process PDF file and extract text
function processPDF(file) {
  const reader = new FileReader();

  reader.onload = function () {
    const typedArray = new Uint8Array(reader.result);

    pdfjsLib.getDocument(typedArray).promise.then((pdf) => {
      let textContent = "";
      let promises = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        promises.push(
          pdf.getPage(i).then((page) =>
            page.getTextContent().then((text) => {
              text.items.forEach((item) => {
                textContent += item.str + " ";
              });
            })
          )
        );
      }

      Promise.all(promises).then(() => summarizeText(textContent));
    });
  };

  reader.readAsArrayBuffer(file);
}

// Function to fetch data from the API (for URL-based summarization)
function fetchData(apiUrl) {
  fetch(apiUrl, {
    method: "GET",
    headers: {
      "x-rapidapi-key": "effcfe6caemsh2f846ef3d69d1f9p1f089fjsn08b252090f86",
      "x-rapidapi-host": "article-extractor-and-summarizer.p.rapidapi.com",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const summary = data.summary || "Summary not available.";
      summaryResult.textContent = summary;
      saveSummaryToFirestore(summary);
      resetForm();
      removeAlert();
    })
    .catch(() => {
      summaryResult.textContent = "Error processing response.";
      removeAlert();
    });
}

// Function to show a loading message
function showLoadingMessage(message) {
  alertElement = document.createElement("div");
  alertElement.textContent = message;
  alertElement.style.padding = "10px";
  alertElement.style.marginTop = "10px";
  alertElement.style.backgroundColor = "#ffeb3b";
  alertElement.style.textAlign = "center";
  document.body.appendChild(alertElement);
}

// Function to remove the loading message
function removeAlert() {
  if (alertElement && document.body.contains(alertElement)) {
    document.body.removeChild(alertElement);
  }
}

// Function to reset form fields properly while keeping them active
function resetForm() {
  urlInput.value = "";
  textInput.value = "";
  fileInput.value = "";

  urlInput.disabled = false;
  textInput.disabled = false;
  fileInput.disabled = false;
}

// Function to save the summary to Firestore under the user's document
function saveSummaryToFirestore(summary) {
  // Ensure a user is logged in
  const user = auth.currentUser;
  if (user) {
    // Initialize Firestore (make sure to include firebase-firestore-compat.js in your HTML)
    const db = firebase.firestore();
    // Save the summary in the "Summarizes" subcollection under the user's document
    db.collection("users")
      .doc(user.uid)
      .collection("Summarizes")
      .add({
        text: summary,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        console.log("Summary successfully saved to Firestore");
      })
      .catch((error) => {
        console.error("Error saving summary to Firestore:", error);
      });
  } else {
    console.log("No user is logged in; summary not saved.");
  }
}
