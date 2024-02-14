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
  },
});
gsap.to(uniforms.iAnimProgress_1.value, {
  y: 1,
  scrollTrigger: {
    trigger: ".sectionWrap.two",
    start: "0%",
    end: "100%",
    scrub: true,
  },
});
gsap.to(uniforms.iAnimProgress_2.value, {
  y: 1,
  scrollTrigger: {
    trigger: ".sectionWrap.three",
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
  scrollSpeed: 1500,
  scrollbars: false,
  setHeights: false,
  snap: true,
  scrollSnapOffset: 0,
  easing: "easeOutSine",
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
      window.scrollY == document.querySelector(".sectionWrap.two").offsetTop
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
const sectionOne = document.querySelector(".sectionWrap.one");
const sectionOneTop = sectionOne.offsetTop;
const sectionTwo = document.querySelector(".sectionWrap.two");
const sectionTwoTop = sectionTwo.offsetTop;
const sectionThree = document.querySelector(".sectionWrap.three");
const sectionThreeTop = sectionThree.offsetTop;

const menuItem2 = document.querySelector(".menu-item-2");
const menuItem3 = document.querySelector(".menu-item-3");

$("#reachus").addClass("disabled");
sectionTwo.style.opacity = 0;
sectionThree.style.opacity = 0;

$(window).scroll(function () {
  //MENU ITEMS COLOR
    
  if (
    window.scrollY >= sectionTwoTop / 2 &&
    window.scrollY <= sectionThreeTop-(sectionTwoTop/2.0)
  ) {
    menuItem2.classList.add("red");
    menuItem2.classList.remove("white");
  } else {
    menuItem2.classList.remove("red");
    menuItem2.classList.add("white");
  }
  if (
    window.scrollY >= sectionThreeTop -(sectionTwoTop/2.0)
  ) {
    menuItem3.classList.add("red");
    menuItem3.classList.remove("white");
  } else {
    menuItem3.classList.remove("red");
    menuItem3.classList.add("white");
  }


  //ONE  - section functions based on current section

  if (window.scrollY == sectionOneTop) {
    sectionOne.style.opacity = 1;
  } else {
    sectionOne.style.opacity = 1 - window.scrollY / sectionTwoTop;
  }
  //TWO  - section functions based on current section

  var opacity = Math.max((window.scrollY / sectionTwoTop - 0.5) * 2.0, 0.0);

  if (window.scrollY <= sectionTwoTop) {
    sectionTwo.style.opacity = opacity;
  } else {
    opacity = (sectionTwoTop / window.scrollY - 0.5) * 2.0;
    sectionTwo.style.opacity = opacity;
  }

  //THREE  - section functions based on current section
  var opacityThree = Math.max(
    (window.scrollY / sectionThreeTop - 0.5) * 2.0,
    0.0
  );

  const scrollDownElement = document.querySelector(".scrollDown-wrapper");
  if (
    window.scrollY > sectionThreeTop / 2 &&
    window.scrollY <= sectionThreeTop
  ) {
    sectionThree.style.opacity = opacityThree;
    scrollDownElement.style.transform = `scaleY(-1)`;

    $("#reachus").removeClass("disabled");
  } else {
    sectionThree.style.opacity = opacityThree;
    scrollDownElement.style.transform = `scaleY(1)`;

    $("#reachus").addClass("disabled");
  }

  //scrollbar style
  var scroll = $(window).scrollTop();
  var dh = $(document).height();
  var wh = $(window).height();
  var scrollPercent = (scroll / (dh - wh)) * wh;
  $("#progressbar").css("height", scrollPercent + "px");
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
