//////////////////////////////THREE.JS(core)
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
    iTime: { value: 1.0 },
    iResolution: { type: "v2", value: new THREE.Vector2() },
    iMousePos: { type: "v2", value: new THREE.Vector2() },
    iAnimProgress_0: { type: "v3", value: new THREE.Vector3() },
    iAnimProgress_1: { type: "v3", value: new THREE.Vector3() },
    iAnimProgress_4: { type: "v3", value: new THREE.Vector3() },
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

//

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

// Create a timeline for the intro animation
const introTimeline = gsap.timeline();

// Add an initial state for iAnimProgress_4.z
introTimeline.from(uniforms.iAnimProgress_4.value, {
  z: 2, // Set the initial value
  duration: 3.0, // Adjust the duration as needed
});
gsap.to(uniforms.iAnimProgress_0.value, {
  z: 1,
  scrollTrigger: {
    trigger: ".sectionWrap.zero",
    start: "0%",
    end: "100%",
    scrub: true,
  },
});
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
gsap.to(uniforms.iAnimProgress_1.value, {
  z: 1,
  scrollTrigger: {
    trigger: ".sectionWrap.three",
    start: "0%",
    end: "100%",
    scrub: true,
  },
});

//***********     Other functions     ***********//

// Initialize Scrollify with mandatory snap scrolling
$.scrollify({
  section: "section",
  scrollSpeed: 900,
  scrollbars: false,
  setHeights: false,
  snap: true,
  scrollSnapOffset: 0,
  easing: "easeInSine",
});

// scroll to the first section on refresh
$(document).ready(function () {
  $.scrollify.move("#1");
});

///////////////////////////////// Initialize scrollButton

// Dark/Light mode function
const toggleSwitch = document.getElementById("toggleSwitch");
const htmlElement = document.querySelector("html");
toggleSwitch.addEventListener("change", function () {
  htmlElement.style.filter = toggleSwitch.checked
    ? "invert(0%) hue-rotate(0deg)"
    : "invert(100%) hue-rotate(180deg)";
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

// Toggle the state of the menu trigger checkbox
var menuTrigger = $("#menu_trigger");
var menuLinks = $(".menu-links li a");
menuLinks.on("click", function () {
  menuTrigger.prop("checked", !menuTrigger.prop("checked"));
});
//---LIST COUNTER---↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
let counter = 0;
let counterInterval = null;

// Start counting function
function startCounter(targetValue, speed = 2) {
  clearInterval(counterInterval); // Clear existing interval
  counterInterval = setInterval(() => {
    const step = speed;
    const direction = targetValue > counter ? 1 : -1;

    if (Math.abs(counter - targetValue) >= step) {
      counter += step * direction;

      // Update colors based on the counter value
      updateColors();
      setScrollPerc(counter);

      uniforms.iAnimTimer.value = counter;
    } else {
      // Stop the interval when reaching the target value
      counter = targetValue;
      updateColors();
      uniforms.iAnimTimer.value = counter;
      clearInterval(counterInterval);
    }
  }, 50); // Adjust the interval duration as needed
}

// Reset and stop counting function
function resetCounter() {
  clearInterval(counterInterval); // Stop the counter interval
  counterInterval = null; // Set counterInterval to null
  // Reset colors to the initial state
  updateColors();
}

// Function to check conditions and start/stop counting
function animCounter() {
  // Check if iAnimProgress_1.x is more than 0.1 and iAnimProgress_1.y is less than 0.9
  if (
    uniforms.iAnimProgress_1.value.x > 0.1 &&
    uniforms.iAnimProgress_1.value.y < 0.9
  ) {
    // Start counting if not already counting
    if (!counterInterval) {
      startCounter(400); // Set the initial target value
    }
  } else {
    // Reset and stop counting if conditions are not met
    resetCounter();
  }
}

const progress = document.querySelector(".progress");

function setScrollPerc(percentage) {
  progress.style.strokeDashoffset = 264 - (percentage / 800) * 264;
}

const playToggle = document.querySelector(".control");
playToggle.addEventListener("click", function () {
  playToggle.classList.toggle("play");
  playToggle.classList.toggle("pause");

  if (playToggle.classList.contains("play")) {
    resetCounter();
  } else {
    startCounter(400); // Set the initial target value
  }
});

// Update colors based on the counter value
function updateColors() {
  if (counter > 50 && counter <= 100) {
    listItem1.classList.add("red");
  } else {
    listItem1.classList.remove("red");
  }

  if (counter > 100 && counter <= 150) {
    listItem2.classList.add("red");
  } else {
    listItem2.classList.remove("red");
  }

  if (counter > 150 && counter <= 200) {
    listItem3.classList.add("red");
  } else {
    listItem3.classList.remove("red");
  }
  if (counter > 200 && counter <= 250) {
    listItem4.classList.add("red");
  } else {
    listItem4.classList.remove("red");
  }

  if (counter > 250 && counter <= 300) {
    listItem5.classList.add("red");
  } else {
    listItem5.classList.remove("red");
  }
  if (counter > 300 && counter <= 350) {
    listItem6.classList.add("red");
  } else {
    listItem6.classList.remove("red");
  }
  if (counter >= 399) {
    counter = 0; // Set the initial target value
  }
}

const listItem1 = document.getElementById("listItem1");
const listItem2 = document.getElementById("listItem2");
const listItem3 = document.getElementById("listItem3");
const listItem4 = document.getElementById("listItem4");
const listItem5 = document.getElementById("listItem5");
const listItem6 = document.getElementById("listItem6");
const plybtncontainer = document.querySelector(".player-box");

const mainTitle = document.getElementById("mainTitle");

// Add click event listeners to the checkboxes
mainTitle.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent default checkbox behavior
  $.scrollify.move("#1");
});
const listTitle1 = document.getElementById("listTitle1");
// Add click event listeners to the checkboxes
listTitle1.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent default checkbox behavior
  $.scrollify.move("#2");

});

const listTitle2 = document.getElementById("listTitle2");
// Add click event listeners to the checkboxes
listTitle2.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent default checkbox behavior
  $.scrollify.move("#3");
});
const listTitle3 = document.getElementById("listTitle3");
// Add click event listeners to the checkboxes
listTitle3.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent default checkbox behavior
  $.scrollify.move("#4");
});

// Add click event listeners to the checkboxes
listItem1.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent default checkbox behavior
  startCounter(100, 9); // Set the initial target value and speed
  playToggle.classList.remove("play");
  playToggle.classList.add("pause");
});
// Add click event listeners to the checkboxes
listItem2.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent default checkbox behavior
  startCounter(150, 9); // Set the initial target value and speed
  playToggle.classList.remove("play");
  playToggle.classList.add("pause");
});
// Add click event listeners to the checkboxes
listItem3.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent default checkbox behavior
  startCounter(200, 9); // Set the initial target value and speed
  playToggle.classList.remove("play");
  playToggle.classList.add("pause");
});
// Add click event listeners to the checkboxes
listItem4.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent default checkbox behavior
  startCounter(250, 9); // Set the initial target value and speed
  playToggle.classList.remove("play");
  playToggle.classList.add("pause");
});
// Add click event listeners to the checkboxes
listItem5.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent default checkbox behavior
  startCounter(300, 9); // Set the initial target value and speed
  playToggle.classList.remove("play");
  playToggle.classList.add("pause");
});
// Add click event listeners to the checkboxes
listItem6.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent default checkbox behavior
  startCounter(350, 9); // Set the initial target value and speed
  playToggle.classList.remove("play");
  playToggle.classList.add("pause");
});
const checkBox1 = document.getElementById("toggle1");
const checkBox2 = document.getElementById("toggle2");
const checkBox3 = document.getElementById("toggle3");

// Add click event listeners to the checkboxes
checkBox1.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent default checkbox behavior
  $.scrollify.move("#2");
});
// Add click event listeners to the checkboxes
checkBox2.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent default checkbox behavior
  $.scrollify.move("#3");
});
// Add click event listeners to the checkboxes
checkBox3.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent default checkbox behavior
  $.scrollify.move("#4");
});

$(window).scroll(function () {
  const sectionZero = document.querySelector(".sectionWrap.zero").offsetTop;
  const sectionOne = document.querySelector(".sectionWrap.one").offsetTop;
  const sectionTwo = document.querySelector(".sectionWrap.two").offsetTop;
  const sectionThree = document.querySelector(".sectionWrap.three").offsetTop;
  const halfPage = sectionOne / 2;

  //ZERO  - section functions based on current section
  if (window.scrollY > sectionZero && window.scrollY < sectionOne - halfPage) {
    checkBox1.checked = true; // Collapse the checkbox
    checkBox2.checked = true; // Collapse the checkbox
    checkBox3.checked = true; // Collapse the checkbox
    listTitle1.classList.remove("red");
    listTitle2.classList.remove("red");
    listTitle3.classList.remove("red");
    //ONE  - section functions based on current section
  }
  if (
    window.scrollY >= sectionOne - halfPage &&
    window.scrollY < sectionTwo - halfPage
  ) {
    startCounter(400); // Set the initial target value
    playToggle.classList.remove("play");
    playToggle.classList.add("pause");
    plybtncontainer.style.opacity = 1.0;

    checkBox1.checked = false; // Collapse the checkbox
    checkBox2.checked = true; // Collapse the checkbox
    checkBox3.checked = true; // Collapse the checkboxlistTitle1.classList.add("red");
    listTitle1.classList.add("red");
    listTitle2.classList.remove("red");
    listTitle3.classList.remove("red");
  } else {
    plybtncontainer.style.opacity = 0.0;
    counter = 0; // Set the initial target value

  }

  //TWO  - section functions based on current section
  if (
    window.scrollY >= sectionTwo - halfPage &&
    window.scrollY < sectionThree - halfPage
  ) {
    checkBox1.checked = true; // Collapse the checkbox
    checkBox2.checked = false; // Collapse the checkbox
    checkBox3.checked = true; // Collapse the checkbox listTitle1.classList.remove("red");
    listTitle1.classList.remove("red");
    listTitle2.classList.add("red");
    listTitle3.classList.remove("red");
  }

  //THREE  - section functions based on current section
  if (window.scrollY >= sectionThree - halfPage) {
    checkBox1.checked = true; // Collapse the checkbox
    checkBox2.checked = true; // Collapse the checkbox
    checkBox3.checked = false; // Collapse the checkbox
    listTitle1.classList.remove("red");
    listTitle2.classList.remove("red");
    listTitle3.classList.add("red");
  }

  /*
  //ONE  - section functions based on current section
  const sectionOne = document.querySelector(".sectionWrap.one").offsetTop;
  
  if (window.scrollY == sectionOne) {
    scrollColorElementOne.classList.add("red");
    console.log("one reached")

    checkBox1.checked = false; // Expand the checkbox
    checkBox2.checked = true; // Collapse the checkbox
    checkBox3.checked = true; // Collapse the checkbox
  } else {
  }
  //TWO  - section functions based on current section
  const scrollColorElementTwo = document.querySelector(".list-title2");
  const sectionTwo = document.querySelector(".sectionWrap.two").offsetTop;
  if (window.scrollY == sectionTwo) {
    scrollColorElementTwo.classList.add("red");
    checkBox1.checked = true; // Collapse the checkbox
    checkBox2.checked = false; // Expand the checkbox
    checkBox3.checked = true; // Collapse the checkbox
  } else {
    scrollColorElementTwo.classList.remove("red");
  }
  //scroll down icon selector
  const scrollDownElement = document.querySelector(".scrollDown-wrapper");
  //THREE  - section functions based on current section
  const scrollColorElementThree = document.querySelector(".list-title3");
  const sectionThree = document.querySelector(".sectionWrap.three").offsetTop;
  if (window.scrollY == sectionThree) {
    scrollColorElementThree.classList.add("red");
    scrollDownElement.style.transform = `scaleY(-1)`;
    checkBox1.checked = true; // Collapse the checkbox
    checkBox2.checked = true; // Collapse the checkbox
    checkBox3.checked = false; // Expand the checkbox
    playToggle.classList.remove("pause");
    playToggle.classList.add("play");
    clearInterval(autoScrollInterval);
    playToggle.addEventListener("click", function () {
  if (window.scrollY == sectionThree) {
        $.scrollify.move("#1");
  }
    });
  } else {
    scrollColorElementThree.classList.remove("red");
    scrollDownElement.style.transform = `scaleY(1)`;
  }
*/
  //scrollbar style
  var scroll = $(window).scrollTop();
  var dh = $(window).height();
  var wh = $(window).height();
  var scrollPercent = (scroll / (dh - wh)) * wh;
  $("#progressbar").css("height", scrollPercent + "px");

  //caption text visibility
  const toggleSwitch = document.querySelector(".minimal-switch");

  var scrollThreshold = window.innerHeight * 0.2;
  if (window.scrollY >= scrollThreshold) {
    toggleSwitch.style.opacity = 0.0;
  } else {
    toggleSwitch.style.opacity = 1.0;
  }

  // Highlight current section in menu on scroll
  $("section").each(function () {
    var sectionTop = $(this).offset().top;
    var sectionHeight = $(this).outerHeight();
    var sectionId = $(this).attr("id");

    // Check if the middle of the section is in the viewport
    if (
      window.scrollY + window.innerHeight / 2 >= sectionTop &&
      window.scrollY + window.innerHeight / 2 < sectionTop + sectionHeight
    ) {
      $(".menu__item").removeClass("menu__item--current");
      $(".menu__link[href='#" + sectionId + "']")
        .parent()
        .addClass("menu__item--current");
    }
  });
});
