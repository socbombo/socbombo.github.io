import { isPlanet, isVR } from "./settings.js";
var isMute = false;
var isEnglish = false;

var refrestCount = 0;

let pinImage = ["002", "007"];
let pinImage1 = [
  "008",
  "009",
  "010",
  "012",
  "013",
  "014",
  "015",
  "016",
  "017",
  "401",
  "402",
  "403",
  "404",
  "405",
  "406",
  "407",
  "408",
  "409",
  "410",
  "411",
  "412",
];
let pinImage2 = ["003"];

// let rooms = ["1", "2"];
let rooms = ["1"];
let pin360 = [
  "001",
  "030",
  "031",
  "034",
  "036",
  "037",
  "038",
  "039",
  "104",
  "105",
  // "106",
  "107",
  "108",
  "111",
  "113",
  "114",
  "119",
];
let mapUrl = "assets/images/UI/Map.png";

function getImagesListId(listIndex) {
  return `images-list-${listIndex}`;
}

function dispatchImagePinClick(detail) {
  window.dispatchEvent(new CustomEvent("imagePinClick", { detail }));
}

window.addEventListener("resize", () => {
  Resize();
});
function Resize() {
  if (homepage) {
    if (window.innerWidth / window.innerHeight < 1.18) {
      homepage.cover.style.display = "none";
    } else {
      homepage.cover.style.display = "unset";
    }
  }
  refrestCount += 1;
  if (refrestCount % 2 === 0) {
    Resize();
  }
}

var homepage;
var mappage;
var page360;
var homeButton;

var btnEng;
var btnVN;

var textsChange = [];

LoadPage();
function LoadPage() {
  const params = new URL(window.location).searchParams;
  const room = params.get("room");

  if (room == null || room == 0) {
  } else if (room == 1) {
    mapUrl = "assets/images/UI/Room1.jpeg";
    rooms = [];
    pinImage = [
      // "201",
      // // "202",
      // "203",
      // "204",
      // "205",
      // "206",
      // "207",
      // "208",
      // "209",
      // "210",
      "211",
      "212",
      "213",
      "214",
      "215",
      "216",
      "301",
      "302",
      "303",
      "304",
      "305",
      "306",
      "307",
      "308",
      "309",
      "310",
    ];
    pin360 = [
      // "032",
      // "033",
      //  "035",
      "102",
      "103",
      "110",
      "112",
      "116",
      "117",
    ];
    // CreateBackButton(true, document.body);
  } else {
    mapUrl = "assets/images/UI/Room2.jpeg";
    rooms = [];
    pinImage = ["014", "016"];
    pin360 = ["031"];
  }
  CreateMap();
  // UpdateLangue();
  // Resize();
}

function CreateMap(room) {
  if (mappage) {
    mappage.style.display = "unset";
    mappage.backButton.style.display = "unset";
  } else {
    // Create the main map div
    const mapDiv = document.createElement("div");
    mapDiv.className = "map";

    // Create the image element
    const img = document.createElement("img");
    let english = getCookie("isEnglish") | false;
    if (english) {
      img.src = mapUrl;
    } else {
      img.src = mapUrl;
    }
    img.alt = "Map";
    mapDiv.appendChild(img);
    img.addEventListener("load", () => {
      Resize();
    });
    mapDiv.map = img;

    // Create pin links for each city
    pin360.forEach((id) => {
      CreatePin(id, mapDiv);
    });
    pinImage.forEach((id, imageIndex) => {
      CreatePin(id, mapDiv, true, imageIndex, 0);
    });

    // Optional second image list (pinImage1)
    if (Array.isArray(pinImage1) && pinImage1.length) {
      pinImage1.forEach((id, imageIndex) => {
        CreatePin(id, mapDiv, true, imageIndex, 1);
      });
    }
    if (Array.isArray(pinImage2) && pinImage2.length) {
      pinImage2.forEach((id, imageIndex) => {
        CreatePin(id, mapDiv, true, imageIndex, 2);
      });
    }

    rooms.forEach((id) => {
      CreateDoor(id, mapDiv, true);
    });

    // Append the mapDiv to the body or a specific container
    document.body.appendChild(mapDiv);

    CreateImagesLists([pinImage, pinImage1, pinImage2]);
    mappage = mapDiv;
  }
}
function CreatePin(id, parent, isImage, imageIndex, listIndex = 0) {
  const pin = document.createElement("a");
  pin.id = id;
  pin.className = `rpin code-${id}`;

  if (isImage) {
    pin.style.background =
      "url('/assets/images/UI/PinImage.png') no-repeat center center";
    pin.style.backgroundSize = "contain";
    pin.addEventListener("pointerdown", (e) => {
      const listId = getImagesListId(listIndex);
      const listEl = document.getElementById(listId);
      if (!listEl) {
        console.warn("Image list not found:", listId);
        return;
      }

      dispatchImagePinClick({ listIndex, imageIndex, id });
      console.log("imagePinClick", { listIndex, imageIndex, id });

      var viewer = new Viewer(listEl, {
        hidden: function () {
          viewer.destroy();
        },
      });
      viewer.show();
      viewer.view(imageIndex);
    });
  } else {
    pin.addEventListener("pointerdown", (e) => {
      const viewer360Div = Load360();
      try {
        const loadingPlugin = new View360.LoadingSpinner();
        const barPlugin = new View360.ControlBar({
          gyroButton: {
            position: View360.ControlBar.POSITION.TOP_RIGHT,
            order: 0,
            onchange: () => {
              console.log("gyroButton");
              alert("gyroButton");
            },
          },
          vrButton: {
            position: View360.ControlBar.POSITION.TOP_RIGHT,
            order: 0,
          },
          autoHide: {
            initialDelay: 1000,
            delay: 100,
            idleDelay: 1000,
          },
        });

        let source;
        console.log("isPlanet", isPlanet);
        if (isPlanet) {
          source = new View360.LittlePlanetProjection({
            src: "./assets/images/360/" + id + ".jpg",
            video: false,
          });
        } else {
          source = new View360.EquirectProjection({
            src: "./assets/images/360/" + id + ".jpg",
            video: false,
          });
        }
        const viewer = new View360("#viewer360", {
          plugins: [loadingPlugin, barPlugin],
          hotspot: {
            zoom: true,
          },
          disableContextMenu: false,
          projection: source,
        });

        if (isVR) {
          viewer.vr.enter();
        }
        console.log(View360.VR_START);
        function isIOSPlatform() {
          return (
            [
              "iPad Simulator",
              "iPhone Simulator",
              "iPod Simulator",
              "iPad",
              "iPhone",
              "iPod",
            ].includes(navigator.platform) ||
            (navigator.userAgent.includes("Mac") && "ontouchend" in document)
          );
        }

        if (!isIOSPlatform()) {
          viewer.on("vrStart", (evt) => {
            console.log("VR_START", evt);
            let vrCover = document.createElement("img");
            vrCover.src = "./assets/images/UI/VR_Cover.png";
            vrCover.style.position = "fixed";
            vrCover.style.top = "0";
            vrCover.style.left = "0";
            vrCover.style.width = "100%";
            vrCover.style.height = "100%";
            vrCover.style.zIndex = "999";
            vrCover.style.pointerEvents = "none";
            vrCover.id = "vrCover";
            viewer360Div.appendChild(vrCover);
          });
          viewer.on("vrEnd", (evt) => {
            viewer360Div.removeChild(document.getElementById("vrCover"));
            console.log("vrEnd", evt);
          });
        }
      } catch (err) {
        console.error(err);
        if (
          err instanceof View360Error &&
          err.code === ERROR_CODES.ELEMENT_NOT_FOUND
        ) {
          // No element corresponding to "#wrapper" was found.
        }
      }
      console.log("Pin clicked:", id);
    });
  }
  parent.appendChild(pin);
}

function CreateDoor(id, parent) {
  const pin = document.createElement("a");
  pin.id = "room" + id;
  pin.className = `rpin room-${id}`;

  pin.style.background =
    "url('/assets/images/UI/Enter.png') no-repeat center center";
  pin.style.backgroundSize = "contain";
  pin.addEventListener("pointerdown", (e) => {
    window.location.href = "map360.html?room=" + id;
  });

  parent.appendChild(pin);
}

function CreateImagesList(listIndex, images) {
  const containerId = `images-list-container-${listIndex}`;
  const existing = document.getElementById(containerId);
  if (existing) existing.remove();

  const div = document.createElement("div");
  div.id = containerId;
  div.style.display = "none";

  const ul = document.createElement("ul");
  ul.id = getImagesListId(listIndex);
  div.appendChild(ul);

  (images || []).forEach((id) => {
    const li = document.createElement("li");
    const img = document.createElement("img");
    img.id = `image-${listIndex}-${id}`;
    img.src = "assets/images/360/" + id + ".jpg";
    img.alt = "Picture";
    li.appendChild(img);
    ul.appendChild(li);
  });

  document.body.appendChild(div);
}

function CreateImagesLists(lists) {
  (lists || []).forEach((images, listIndex) => {
    if (Array.isArray(images) && images.length) {
      CreateImagesList(listIndex, images);
    }
  });
}

function Load360(img) {
  const viewer360 = document.createElement("div");
  viewer360.id = "viewer360";
  viewer360.className = "view360-container";
  viewer360.style.width = "100vw";
  viewer360.style.height = "100vh";
  viewer360.style.zIndex = 100;

  const canvas = document.createElement("canvas");
  canvas.className = "view360-canvas";

  viewer360.appendChild(canvas);

  const closeButton = document.createElement("button");
  closeButton.className = "close-button";
  closeButton.textContent = " X ";
  closeButton.onclick = function () {
    viewer360.remove();
  };
  viewer360.appendChild(closeButton);
  document.body.appendChild(viewer360);
  return viewer360;
}
function CreateBackButton(isHome = false, parent) {
  const backButton = document.createElement("button");
  backButton.className = "back-button";
  backButton.textContent = "Back";
  textsChange.push({ element: backButton, vn: "Trở lại", en: "Back" });
  if (!isHome) {
    backButton.onclick = function () {
      window.history.pushState(
        "map",
        "Bản đồ",
        window.location.pathname + "?img=-1"
      );
      LoadPage();
    };
  } else {
    backButton.onclick = function () {
      window.history.pushState("map", "Home", window.location.pathname);
      LoadPage();
    };
  }
  parent.appendChild(backButton);
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
