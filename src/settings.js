import { setSettings, getSetinngs } from "./common.js";
import SoundManager from "./sounds.js";

let textsChange = {};
export let currentLanguage = "vn";
export let isVR = false;
export let isSound = true;
export let isPlanet = false;
export let isLittlePlanetProjection = false;

const soundManager = new SoundManager();
soundManager.enableUserInteraction();
window.playbgMusicTimeout = null;

var sounds = {
  background: "gioithieu.mp3",
  music: "tiengchaytrensocbombo.mp3",
};

function LoadSettings() {
  if (getSetinngs("isVR")) isVR = getSetinngs("isVR") === "true";

  if (getSetinngs("isSound")) isSound = getSetinngs("isSound") === "true";

  if (getSetinngs("isPlanet")) isPlanet = getSetinngs("isPlanet") === "true";

  if (getSetinngs("isLittlePlanetProjection"))
    isLittlePlanetProjection =
      getSetinngs("isLittlePlanetProjection") === "true";

  currentLanguage = getSetinngs("currentLanguage") ?? "vn";

  console.log("Load settings", isVR, isSound, isPlanet, currentLanguage);

  if (location.href.includes("index.html")) {
    soundManager.play(sounds.background, "en-" + sounds.background, 0.5, false);
  }
  else{
    soundManager.play(sounds.music, sounds.music, 0.2, true);

  }
}

LoadSettings();
await LoadTextData();

// Function to create the settings modal
function createSettingsModal() {
  // Create the outer modal div
  const modal = document.createElement("div");
  modal.id = "settings-modal";
  modal.className =
    "hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50";

  // Create the inner content div
  const content = document.createElement("div");
  content.className = "bg-white rounded-xl max-w-md w-full p-6 space-y-6";

  // Create the header
  const header = document.createElement("div");
  header.className = "flex justify-between items-center";
  const title = document.createElement("h2");
  title.id = "popup-title-settings";
  title.className = "text-2xl font-bold text-gray-800";
  title.textContent = GetLanguageTextWithId("popup-title-settings");
  const closeButton = document.createElement("button");
  closeButton.className = "text-gray-500 hover:text-gray-700 transition-colors";
  closeButton.innerHTML = '<i class="fas fa-times text-xl"></i>';
  closeButton.onclick = () => modal.classList.add("hidden");
  header.append(title, closeButton);
  content.appendChild(header);

  // Create the settings options
  const options = [
    {
      id: "o_language",
      l_id: "l_language",
      icon: "fas fa-globe",
      label: "Language",
      type: "select",
      options: [
        { value: "vn", text: "Tiếng Việt" },
        { value: "en", text: "English" },
      ],
      value: currentLanguage,
    },
    {
      id: "o_sound",
      l_id: "l_sound",
      icon: "fas fa-volume-up",
      label: "Sound",
      type: "checkbox",
      checked: isSound,
    },
    {
      id: "o_vr",
      l_id: "l_vr",
      icon: "fas fa-vr-cardboard",
      label: "VR Mode",
      type: "checkbox",
      checked: isVR,
      inputId: "vr_input",
    },
    {
      id: "o_planet",
      l_id: "l_planet",
      icon: "fas fa-globe-americas",
      label: "Planet View",
      type: "checkbox",
      checked: isPlanet,
      inputId: "planet_input",
    },
  ];
  console.log("🚀 ~ createSettingsModal ~ options:", options);

  options.forEach((option) => {
    const optionDiv = document.createElement("div");
    optionDiv.className = "flex items-center justify-between";
    optionDiv.id = option.id;

    const label = document.createElement("label");
    label.className = "flex items-center text-gray-700";
    label.innerHTML = `<i class="${
      option.icon
    } mr-3 text-blue-500"></i ><p id=${option.l_id}>${GetLanguageTextWithId(
      option.l_id
    )}</p>`;

    if (option.type === "select") {
      const select = document.createElement("select");
      select.className =
        "bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5";
      select.onchange = () => {
        // Call the change function
        console.log(select.value, option.id);
        onOptionChange(select.value, option.id);
      };
      option.options.forEach((opt) => {
        const optElement = document.createElement("option");
        optElement.value = opt.value;
        optElement.textContent = opt.text;
        select.appendChild(optElement);
      });
      select.value = option.value;
      optionDiv.append(label, select);
    } else {
      const checkboxLabel = document.createElement("label");
      checkboxLabel.className =
        "relative inline-flex items-center cursor-pointer";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.className = "sr-only peer";
      if (option.inputId) input.id = option.inputId;
      if (option.checked) {
        input.checked = option.checked;
        console.log("🚀 ~ options.forEach ~ checked:", option.checked);
      }
      input.onchange = () => {
        // Call the change function
        console.log(input.checked, option.id);
        onOptionChange(input.checked, option.id);
      };

      const slider = document.createElement("div");
      slider.className =
        "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500";
      checkboxLabel.append(input, slider);
      optionDiv.append(label, checkboxLabel);
    }

    content.appendChild(optionDiv);
  });

  // Create action buttons
  const actionDiv = document.createElement("div");
  actionDiv.className = "flex space-x-4";

  const shareButton = document.createElement("button");
  shareButton.className =
    "flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center justify-center";
  shareButton.innerHTML = `<i class="fas fa-share-alt mr-2"></i><p id="l_share">${GetLanguageTextWithId(
    "l_share"
  )}</p>`;
  shareButton.onclick = () => {
    function isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    }
    if (!isMobile()) {
      const shareUrl =
        "https://www.facebook.com/sharer/sharer.php?u=" +
        encodeURIComponent(window.location.href);
      window.open(shareUrl, "_blank");
    } else {
      window.open(
        "fb://faceweb/f?href=" +
          encodeURIComponent(
            "https://m.facebook.com/sharer.php?u=" +
              encodeURIComponent(window.location.href)
          )
      );
    }
  };

  const fullScreenButton = document.createElement("button");
  fullScreenButton.className =
    "flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center justify-center";
  fullScreenButton.innerHTML = `<i class="fas fa-expand mr-2"></i><p id="l_fullscreen">${GetLanguageTextWithId(
    "l_fullscreen"
  )}</p>`;
  fullScreenButton.onclick = toggleFullScreen;
  actionDiv.append(shareButton, fullScreenButton);
  content.appendChild(actionDiv);

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  // Append content to modal
  modal.appendChild(content);

  // Append modal to body
  document.body.appendChild(modal);
}

// Call the function to create the modal
createSettingsModal();

async function LoadTextData() {
  try {
    const response = await fetch("assets/data/text.json");
    const data = await response.json();
    textsChange = data;
    console.log("🚀 ~ .then ~ textsChange:", textsChange);
    ChangeLanguage(currentLanguage);
  } catch (error) {
    console.error("Error fetching text data:", error);
  }
}

function onOptionChange(value, id) {
  switch (id) {
    case "o_language":
      ChangeLanguage(value);
      break;
    case "o_sound":
      ChangeSound(value);
      break;
    case "o_vr":
      ChangeVR(value);
      break;
    case "o_planet":
      ChangePlanetView(value);
      break;
  }
  console.log("Option change:", value, id);
}

function ChangePlanetView(value) {
  isPlanet = value;
  setSettings("isPlanet", value);
  if (value) {
    let inputVR = document.getElementById("vr_input");
    inputVR.checked = false;
    ChangeVR(false);
  }
}
function ChangeSound(value) {
  isSound = value;
  setSettings("isSound", value);
  soundManager.mute(!value);
}

function ChangeVR(value) {
  isVR = value;
  setSettings("isVR", value);
  if (value) {
    let inputPlanet = document.getElementById("planet_input");
    inputPlanet.checked = false;
    ChangePlanetView(false);
  }
}
function ChangeLanguage(lang) {
  currentLanguage = lang;
  setSettings("currentLanguage", lang);
  if (lang == "vn") {
    textsChange.forEach((text) => {
      const element = document.getElementById(text.id);
      if (element) element.textContent = text.vn;
    });
  } else {
    textsChange.forEach((text) => {
      const element = document.getElementById(text.id);
      if (element) element.textContent = text.en;
    });
  }
  console.log("Change language to", lang);
  if (soundManager.isPlaying()) {
    soundManager.changeSound();

  }
}

export function GetLanguageTextWithId(id) {
  let text = textsChange.find((text) => text.id == id);
  if (text) {
    if (currentLanguage == "vn") return text.vn;
    else return text.en;
  }
  console.warn("Text with id", id, "not found in language data");
  return "";
}
