//---THREE.JS---↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
let camera, scene, renderer, uniforms, scrollProgress;

init();
animate();

function init() {
  const container = document.getElementById("webGLID");

  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  scene = new THREE.Scene();

  const geometry = new THREE.PlaneGeometry(2, 2);

  uniforms = {
    iAnimTimer: { value: 0.0 },
    iClick: { value: 1.0 },
    iTime: { value: 1.0 },
    iResolution: { type: "v2", value: new THREE.Vector2() },
    iMousePos: { type: "v2", value: new THREE.Vector2() },
    iAnimProgress_1: { type: "v3", value: new THREE.Vector3() },
    iAnimProgress_2: { type: "v3", value: new THREE.Vector3() },
  };

  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShader").textContent,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  uniforms.iResolution.value.x = window.innerWidth * window.devicePixelRatio;
  uniforms.iResolution.value.y = window.innerHeight * window.devicePixelRatio;

  renderer.setSize(window.innerWidth, window.innerHeight);
}
// Update mouse position uniform
function handleMouseMove(event) {
  uniforms.iMousePos.value.x = event.clientX;
  uniforms.iMousePos.value.y = window.innerHeight - event.clientY;
}

function animate() {
  requestAnimationFrame(animate);

  // Update time
  uniforms["iTime"].value = performance.now() / 1000;

  // Update resolution if needed
  uniforms.iResolution.value.x = window.innerWidth * window.devicePixelRatio;
  uniforms.iResolution.value.y = window.innerHeight * window.devicePixelRatio;

  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.render(scene, camera);
}
//---THREE.JS---↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

//---GSAP---↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
let counter = 0;
let counterInterval = null;

// Start counting function

// Start counting function
function startCounter() {
  counterInterval = setInterval(() => {
    if (counter <= 400) {
      counter += 1;

      // Update colors based on the counter value
      updateColors();

      uniforms.iAnimTimer.value = counter;
    } else {
      // Reset the counter to 0 when it reaches 500
      counter = 0;

      uniforms.iAnimTimer.value = counter;
    }
  }, 50); // Adjust the interval duration as needed
}

// Reset and stop counting function
function resetCounter() {
  clearInterval(counterInterval); // Stop the counter interval
  counterInterval = null; // Set counterInterval to null
  counter = 0; // Reset the counter to 0

  // Reset colors to the initial state
  updateColors();
}
// Check conditions using ScrollTrigger
gsap.to(uniforms.iAnimProgress_1.value, {
  x: 1,
  scrollTrigger: {
    trigger: ".sectionWrap.one",
    start: "0%",
    end: "100%",
    scrub: true,
    onUpdate: animCounter,
  },
});

gsap.to(uniforms.iAnimProgress_1.value, {
  y: 1,
  scrollTrigger: {
    trigger: ".sectionWrap.two",
    start: "0%",
    end: "100%",
    scrub: true,
    onUpdate: animCounter,
  },
});

// Function to check conditions and start/stop counting
// Function to check conditions and start/stop counting
function animCounter() {
  // Check if iAnimProgress_1.x is more than 0.1 and iAnimProgress_1.y is less than 0.9
  if (
    uniforms.iAnimProgress_1.value.x > 0.1 &&
    uniforms.iAnimProgress_1.value.y < 0.9
  ) {
    // Start counting if not already counting
    if (!counterInterval) {
      startCounter();
    }
  } else {
    // Reset and stop counting if conditions are not met
    resetCounter();
  }
}
// Function to update colors based on the counter value
function updateColors() {
  const colorList = document.getElementById("colorList");
  const items = colorList.getElementsByTagName("li");

  // Reset all items to blue
  for (let i = 0; i < items.length; i++) {
    items[i].className = "blue";
  }

  // Update colors based on the counter value
  if (counter >= 50 && counter < 100) {
    items[0].className = "red";
  } else if (counter >= 100 && counter < 150) {
    items[1].className = "red";
  } else if (counter >= 150 && counter < 200) {
    items[2].className = "red";
  } else if (counter >= 200 && counter < 250) {
    items[3].className = "red";
  } else if (counter >= 250 && counter < 300) {
    items[4].className = "red";
  } else if (counter >= 300 && counter <= 350) {
    items[5].className = "red";
  }
}

gsap.to(uniforms.iAnimProgress_1.value, {
  z: 1,
  scrollTrigger: {
    trigger: ".sectionWrap.three",
    start: "0%",
    end: "100%",
    scrub: true,
  },
});

gsap.to(uniforms.iAnimProgress_2.value, {
  x: 1,
  scrollTrigger: {
    trigger: ".sectionWrap.four",
    start: "0%",
    end: "100%",
    scrub: true,
  },
});
gsap.to(uniforms.iAnimProgress_2.value, {
  y: 1,
  scrollTrigger: {
    trigger: ".sectionWrap.five",
    start: "0%",
    end: "100%",
    scrub: true,
  },
});

// Intro animation timeline
const introTimeline = gsap.timeline();
introTimeline.from(uniforms.iAnimProgress_2.value, {
  z: 2,
  duration: 3.0,
});
//---GSAP---↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
//---SCROLLIFY---↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

// Initialize Scrollify with mandatory snap scrolling
$.scrollify({
  section: "section",
  scrollSpeed: 2000,
  scrollbars: false,
  setHeights: false,
  snap: true,
  scrollSnapOffset: 0,
  easing: "easeOutSine",
});

// scroll to the first section on refresh
$(document).ready(function () {
  $.scrollify.move("#1");
});

// Dark/Light mode function
const toggleSwitch = document.getElementById("toggleSwitch");
const htmlElement = document.querySelector("html");
toggleSwitch.addEventListener("change", function () {
  htmlElement.style.filter = toggleSwitch.checked
    ? "invert(0%) hue-rotate(0deg)"
    : "invert(100%) hue-rotate(180deg)";
});
// Scrollify Scroll Down button function with debounce
$("#scrollDownID").on(
  "click",
  debounce(function () {
    if (
      window.scrollY == document.querySelector(".sectionWrap.five").offsetTop
    ) {
      $.scrollify.move("#1");
    } else {
      $.scrollify.next();
    }
  }, 500) // Adjust the delay (in milliseconds) as needed
);
// Debounce function to delay execution of the click function
function debounce(func, delay) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      func.apply(context, args);
    }, delay);
  };
}
// Toggle the state of the menu trigger checkbox
var menuTrigger = $("#menu_trigger");
var menuLinks = $(".menu-links li a");
menuLinks.on("click", function () {
  menuTrigger.prop("checked", !menuTrigger.prop("checked"));
});

// Set up smooth scroll effect for anchor links
$('a[href^="#"]').on("click", function (event) {
  event.preventDefault();
  let targetId = $(this).attr("href");
  let target = $(targetId);

  if (target.length) {
    // Get the index of the target section based on its ID
    let index = $("section").index(target);

    // Scroll to the target section using Scrollify
    $.scrollify.move(index);
  }
});
//---SCROLLIFY---↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

//---SCROLLFUNCTIONS---↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
$("#reachus").addClass("disabled");
$(window).scroll(function () {
  //scroll down icon invertion
  const scrollDownElement = document.querySelector(".scrollDown-wrapper");
  const sectionFive = document.querySelector(".sectionWrap.five").offsetTop;
  if (window.scrollY == sectionFive) {
    scrollDownElement.style.transform = `scaleY(-1)`;
    $("#reachus").removeClass("disabled");
  } else {
    scrollDownElement.style.transform = `scaleY(1)`;
    $("#reachus").addClass("disabled");
  }

  //scrollbar style
  var scroll = $(window).scrollTop();
  var dh = $(document).height();
  var wh = $(window).height();
  var scrollPercent = (scroll / (dh - wh)) * wh;
  $("#progressbar").css("height", scrollPercent + "px");

  //caption text visibility
  const sections = document.querySelectorAll(".sectionWrap");
  const texts = document.querySelectorAll(".box__text");

  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    const isVisible =
      rect.top <= window.innerHeight / 2 &&
      rect.bottom >= window.innerHeight / 2;
    if (isVisible) {
      const opacity =
        1 - Math.max(0, Math.min(1, Math.abs(rect.top) / window.innerHeight));
      texts[index].style.opacity = opacity;
    } else {
      texts[index].style.opacity = 0;
    }
  });

  const scrollPosition = $(this).scrollTop();
  // Highlight current section in menu on scroll
  $("section").each(function () {
    var sectionTop = $(this).offset().top;
    var sectionHeight = $(this).outerHeight();
    var sectionId = $(this).attr("id");

    // Check if the middle of the section is in the viewport
    if (
      scrollPosition + window.innerHeight / 2 >= sectionTop &&
      scrollPosition + window.innerHeight / 2 < sectionTop + sectionHeight
    ) {
      $(".menu__item").removeClass("menu__item--current");
      $(".menu__link[href='#" + sectionId + "']")
        .parent()
        .addClass("menu__item--current");
    }
  });
});
//---SCROLLFUNCTIONS---↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

//---ROLLDOWNTEXT---↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

const changingWords = [
  "CRYPTOS",
  "COMMODITIES",
  "AGREEMENTS",
  "FUTURES",
  "TRADING",
  "OPTIONS",
  "DERIVATIVES",
  "PERPETUALS",
  "BONDS",
  "STOCKS",
];

// Index to keep track of the current word
let currentIndex = 0;

// Function to update the changing word with an animation
function updateChangingWord() {
  const changingWordElement = document.getElementById("changingWord");
  const textContainerElement = document.getElementById("rollingTextContainer");

  textContainerElement.style.width = `${changingWordElement.offsetWidth}px`; // Set the width to the current word's width

  changingWordElement.classList.remove("fade-in");
  changingWordElement.classList.add("fade-out");

  setTimeout(() => {
    changingWordElement.textContent = changingWords[currentIndex];
    changingWordElement.classList.remove("fade-out");
    changingWordElement.classList.add("fade-in");

    // Update the container width after changing the word
    textContainerElement.style.width = `${changingWordElement.offsetWidth}px`;

    currentIndex = (currentIndex + 1) % changingWords.length;
  }, 500); // Adjust the duration as needed
}

// Initial call to start the animation
updateChangingWord();

// Set up a timer to change the word at intervals
setInterval(updateChangingWord, 3000); // Change the word every 3 seconds, adjust as needed
//---ROLLDOWNTEXT---↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
