const apiKey = "your-prayer-api-key";

function fetchPrayerTimes(city) {
  fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Egypt&method=5`)
    .then(res => res.json())
    .then(data => {
      const times = data.data.timings;
      const list = document.getElementById("times-list");
      list.innerHTML = "";
      for (const [name, time] of Object.entries(times)) {
        const li = document.createElement("li");
        li.textContent = `${name} : ${time}`;
        list.appendChild(li);
      }
    });
}

document.getElementById("city-select").addEventListener("change", e => {
  fetchPrayerTimes(e.target.value);
});
fetchPrayerTimes("Cairo");

function addTask() {
  const input = document.getElementById("task-input");
  if (input.value.trim()) {
    const li = document.createElement("li");
    li.textContent = input.value;
    document.getElementById("task-list").appendChild(li);
    input.value = "";
  }
}

function startVoiceTask() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "ar-EG";
  recognition.start();
  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById("task-input").value = transcript;
    addTask();
  };
}

const azkar = {
  morning: ["أصبحنا وأصبح الملك لله...", "اللهم بك أصبحنا..."],
  evening: ["أمسينا وأمسى الملك لله...", "اللهم بك أمسينا..."],
  afterPrayer: ["أستغفر الله", "اللهم أنت السلام..."]
};

function showAzkar(type) {
  const list = document.getElementById("azkar-list");
  list.innerHTML = "";
  azkar[type].forEach(zk => {
    const li = document.createElement("li");
    li.textContent = zk;
    list.appendChild(li);
  });
}

function sendMessage() {
  const input = document.getElementById("user-input").value.trim();
  const box = document.getElementById("chat-box");
  if (input) {
    const q = document.createElement("div");
    q.textContent = "🧑‍💻: " + input;
    box.appendChild(q);
    // simulate AI response
    const r = document.createElement("div");
    r.textContent = "🤖: يتم البحث عن إجابة من مصادر موثوقة...";
    box.appendChild(r);
    document.getElementById("user-input").value = "";
  }
}

function toggleLanguage() {
  alert("🚧 لم يتم بعد دعم الإنجليزية بالكامل، سيتم إضافته قريبًا.");
}