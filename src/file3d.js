import { GetLanguageTextWithId } from "./settings.js";
CreatePopup();
function CreatePopup(){
    // Create the popup div
    const popupDiv = document.createElement("div");
    popupDiv.id = "popup";
    popupDiv.className = "hidden fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4";

    // Create the inner content container
    const contentDiv = document.createElement("div");
    contentDiv.className = "bg-card w-full max-w-md rounded-lg shadow-sm";
    contentDiv.setAttribute("role", "dialog");
    contentDiv.setAttribute("aria-modal", "true");
    contentDiv.setAttribute("aria-labelledby", "popup-title");

    // Create the header
    const headerDiv = document.createElement("div");
    headerDiv.className = "flex items-center justify-between p-6 border-b border-border";

    const title = document.createElement("h2");
    title.id = "popup-title-3d";
    title.className = "text-xl font-heading text-foreground";
    title.textContent = GetLanguageTextWithId("popup-title-3d");

    const closeButton = document.createElement("button");
    closeButton.onclick = () => popupDiv.classList.add("hidden");
    closeButton.className = "text-accent hover:text-destructive transition-colors";

    const closeIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    closeIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    closeIcon.setAttribute("width", "24");
    closeIcon.setAttribute("height", "24");
    closeIcon.setAttribute("fill", "none");
    closeIcon.setAttribute("stroke", "currentColor");
    closeIcon.setAttribute("stroke-width", "2");
    closeIcon.setAttribute("stroke-linecap", "round");
    closeIcon.setAttribute("stroke-linejoin", "round");

    const closePath1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    closePath1.setAttribute("d", "M18 6L6 18");

    const closePath2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    closePath2.setAttribute("d", "M6 6l12 12");

    closeIcon.appendChild(closePath1);
    closeIcon.appendChild(closePath2);
    closeButton.appendChild(closeIcon);

    headerDiv.appendChild(title);
    headerDiv.appendChild(closeButton);

    // Create the list
    const list = document.createElement("ul");
    list.className = "p-6 space-y-4";

    const files = [
      { l_id: "danda", d_id:"dir_danda", name: "Bộ Đàn Đá", color: "text-chart-1", src:"assets/3d/danda.glb" },
      { l_id: "congchieng", d_id:"dir_congchieng", name: "Bộ Cồng Chiêng", color: "text-chart-1", src:"assets/3d/CongChieng.glb" },
    //   { name: "character.stl", color: "text-chart-2" },
    //   { name: "landscape.3ds", color: "text-chart-3" },
    //   { name: "vehicle.fbx", color: "text-chart-4" },
    ];

    files.forEach((file) => {
      const listItem = document.createElement("li");
      listItem.className = "flex items-center space-x-4 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer";

      const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      icon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      icon.setAttribute("width", "24");
      icon.setAttribute("height", "24");
      icon.setAttribute("fill", "none");
      icon.setAttribute("stroke", "currentColor");
      icon.setAttribute("class", file.color);
      icon.setAttribute("stroke-width", "2");

      const iconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      iconPath.setAttribute("d", "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z");

      icon.appendChild(iconPath);

      const span = document.createElement("span");
      span.id = file.l_id;
      span.className = "text-foreground font-medium";
      span.textContent = GetLanguageTextWithId(file.l_id);
      listItem.addEventListener("click", () => {
        createModelViewer(
            file,
          );
      });      

      listItem.appendChild(icon);
      listItem.appendChild(span);
      list.appendChild(listItem);
    });

    // Assemble the popup
    contentDiv.appendChild(headerDiv);
    contentDiv.appendChild(list);
    popupDiv.appendChild(contentDiv);

    // Append the popup to the body
    document.body.appendChild(popupDiv);
}

function createModelViewer(file, alt='model', environmentImage = '', poster = '', shadowIntensity = 1, targetId = 'body') {
    console.log("🚀 ~ createModelViewer ~ file:", file)
    // Create the <model-viewer> element
    const modelViewer = document.createElement('model-viewer');
    modelViewer.style.zIndex = 1000;
    modelViewer.style.position = 'fixed';
    modelViewer.style.left = '0';
    modelViewer.style.top = '0';
    modelViewer.style.width = '100%';
    modelViewer.style.height = '100%';
    modelViewer.style.backgroundColor = '#333';

    // Set the required attributes
    modelViewer.setAttribute('src', file.src);
    modelViewer.setAttribute('alt', alt);
    modelViewer.setAttribute('shadow-intensity', shadowIntensity);
    modelViewer.setAttribute('camera-controls', '');
    modelViewer.setAttribute('touch-action', 'pan-y');
    modelViewer.setAttribute('ar', '');
    modelViewer.setAttribute('field-of-view', '80deg');

    // Set optional attributes if provided
    if (environmentImage) {
      modelViewer.setAttribute('environment-image', environmentImage);
    }
    if (poster) {
      modelViewer.setAttribute('poster', poster);
    }

    // Append the model viewer to the target container
    const targetContainer = document.getElementById(targetId);
    if (targetContainer) {
      targetContainer.appendChild(modelViewer);
    } else {
      document.body.appendChild(modelViewer);
    }

    const closeButton = document.createElement("button");
    closeButton.className = "close-button";
    closeButton.textContent = " X ";
    closeButton.onclick = function () {
        modelViewer.remove();
    };
    modelViewer.appendChild(closeButton);

    const annotation = document.createElement('div');
    annotation.className = 'annotation';
    let textContainer = document.createElement('div');
    textContainer.className = 'text-container';
    textContainer.style.overflowY = 'scroll';
    let text = document.createElement('p');
    text.textContent = GetLanguageTextWithId(file.d_id);
    textContainer.appendChild(text);
    annotation.appendChild(textContainer);
    

    // Append the annotation to the body
    modelViewer.appendChild(annotation);
  }