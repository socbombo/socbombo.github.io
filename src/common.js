import { GetLanguageTextWithId } from "./settings.js";

document.getElementById("btnMap").addEventListener("click", function () {
  CreateMap();
});
document.getElementById("btnguide").addEventListener("click", function () {
  createInstructionsModal();
});

function CreateMap() {
  var mapDiv = document.createElement("div");
  mapDiv.id = "onlymap";
  mapDiv.classList.add("fullmap");
  document.getElementById("fullmap").appendChild(mapDiv);
  // Initialize the map and set its view
  var map = L.map("onlymap").setView([11.83931, 107.192852], 17); // Coordinates for Londongeo:11.839310,107.192852?z=17https://www.openstreetmap.org/?mlat=11.839310&mlon=107.192852#map=17/11.839310/107.192852

  // Load and display tile layers on the map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);

  // Add a marker to the map
  var marker = L.marker([11.83931, 107.194515]).addTo(map);

  marker
    .bindPopup(`<b id="map_lable">${GetLanguageTextWithId("map_lable")}</b>`)
    .openPopup();

  const closeButton = document.createElement("button");
  closeButton.className = "close-button";
  closeButton.textContent = " X ";
  closeButton.style.right = "10px";
  closeButton.style.left = "unset";
  closeButton.onclick = function () {
    mapDiv.remove();
  };
  mapDiv.appendChild(closeButton);
}

function createInstructionsModal() {
  const modal = document.createElement("div");
  modal.id = "instructionsModal";
  modal.className =
    "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50";
  modal.onclick = () => modal.classList.add("hidden");

  const content = document.createElement("div");
  content.className = "bg-white rounded-xl max-w-md w-full p-6 space-y-6";
  content.onclick = (event) => event.stopPropagation();

  const header = document.createElement("div");
  header.className = "flex justify-between items-center mb-6";

  const title = document.createElement("h1");
  title.id = "popup-instruction1";
  title.className = "text-2xl font-bold text-gray-800";
  title.textContent = GetLanguageTextWithId("popup-instruction1");

  const closeButton = document.createElement("button");
  closeButton.className =
    "text-accent hover:text-destructive transition-colors";
  closeButton.onclick = () => modal.classList.add("hidden");
  closeButton.innerHTML = '<i class="fas fa-times text-xl"></i>';

  header.appendChild(title);
  header.appendChild(closeButton);

  const instructions = [
    {
      id: "popup-rotate",
      icon: "fas fa-hand-pointer",
      text: "Drag to rotate the photo",
    },
    {
      id: "popup-zoom-in",
      icon: "fas fa-expand-arrows-alt",
      text: "Spread to zoom in",
    },
    {
      id: "popup-zoom-out",
      icon: "fas fa-compress-arrows-alt",
      text: "Pinch or pinch out to zoom out",
    },
  ];

  const instructionList = document.createElement("div");
  instructionList.className = "space-y-6";
  instructions.forEach((inst) => {
    const instructionItem = document.createElement("div");
    instructionItem.className = "flex items-center space-x-4 text-body";

    const iconDiv = document.createElement("div");
    iconDiv.className =
      "w-12 h-12 flex items-center justify-center bg-muted rounded-full text-accent";
    iconDiv.innerHTML = `<i class="${inst.icon} text-2xl"></i>`;

    const text = document.createElement("p");
    text.className = "text-foreground";
    text.textContent = GetLanguageTextWithId(inst.id) || inst.text;
    text.id = inst.id;

    instructionItem.appendChild(iconDiv);
    instructionItem.appendChild(text);
    instructionList.appendChild(instructionItem);
  });

  const footer = document.createElement("div");
  footer.className = "mt-8 text-center";
  // const gotItButton = document.createElement('button');
  // gotItButton.className = "bg-secondary text-secondary-foreground px-6 py-2 rounded-md shadow-sm hover:opacity-90 transition-opacity";
  // gotItButton.textContent = "Got it!";
  // gotItButton.onclick = () => modal.classList.add('hidden');

  // footer.appendChild(gotItButton);

  content.appendChild(header);
  content.appendChild(instructionList);
  content.appendChild(footer);
  modal.appendChild(content);

  document.body.appendChild(modal);
}

export function getSetinngs(key) {
  return localStorage.getItem(key);
}

export function setSettings(key, value) {
  localStorage.setItem(key, value);
}
