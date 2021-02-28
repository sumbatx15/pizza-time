import { repeat, rand, createElementFromHTML } from "./modules/utils.js";
import { service } from "./modules/service.js";

const elApp = document.querySelector("#app");
const elSpinner = document.querySelector("#spinner");
const elTitle = document.querySelector(".title");
const elSubTitle = document.querySelector(".sub-title");

const createRainDrop = () => {
  const degree = rand(0, 35);
  const fontSize = rand(10, 55);
  const top = rand(0, 100);
  const left = rand(0, 100);
  const width = rand(20, 80);
  const height = rand(20, 50);
  const opacity = rand(40, 100) / 100;
  const blur = opacity < 0.9 ? (1 / opacity) * 0.8 : 0;
  const zIndex = blur ? 0 : 1;

  const style = `
    z-index: ${zIndex};
    width: ${width}px;
    height: ${height}px;
    top: ${top}%;
    left: ${left}%;
    opacity: ${opacity};
    font-size: ${fontSize}px;
    transform:rotate(${degree}deg);
    filter: blur(${blur}px)
    `;
  return createElementFromHTML(
    `<div class="rain-drop" style="${style}">
      <img src="assets/pizza-icon.png">
    </div>`
  );
};

const animateLoading = (isLoading) => {
  return anime({
    targets: elSpinner,
    opacity: isLoading ? [0, 1] : [1, 0],
    scale: isLoading ? [0, 1] : [1, 0],
  });
};

const getMinutesLeft = () => {
  return rand(30, 360);
};

const animatePizzaGauge = ({ startDelay, percent }) => {
  const degree = (percent / 100) * 180;
  return anime
    .timeline()
    .add({
      delay: 500 + startDelay,
      targets: ".pizza",
      bottom: [-350, 0],
      duration: 500,
    })
    .add({
      targets: ".pizza",
      boxShadow: ["0 0 0px rgba(0, 0, 0, 0.445)", "0 0 100px rgba(0, 0, 0, 1)"],
      duration: 500,
    })
    .add({
      targets: ".pizza .arrow-container",
      scaleX: [0, 1],
      duration: 300,
    })
    .add({
      targets: ".pizza .arrow-container",
      rotate: degree,
      duration: 3000,
      easing: "easeInOutQuad",
      complete: () => {
        if (percent < 50) return;
        repeat(
          () =>
            confetti({
              particleCount: 200,
              spread: rand(70, 180),
              origin: { y: 1 },
            }),
          { times: 3, delay: 200 }
        );
      },
    })
    .add({
      targets: ".report-container",
      // backdropFilter: ["blur(0px)", "blur(3px)"],
      opacity: [0, 1],
      duration: 1000,
      delay: 500,
      easing: "easeInOutQuad",
    })
    .add({
      targets: ".report",
      opacity: [0, 1],
      duration: 100,
      easing: "easeInOutQuad",
    })
    .add({
      targets: elTitle,
      opacity: [0, 1],
      translateY: [-30, 0],
    })
    .add(
      {
        targets: elSubTitle,
        opacity: [0, 1],
        translateY: [30, 0],
      },
      "-=500"
    );
};

const updateResultMessage = ({ percent, bugs, minutesLeft }) => {
  elTitle.innerText = `Rainy with ${percent}% chance for Pizza🍕`;
  elSubTitle.innerText = `${bugs} bugs found and ${minutesLeft} minutes until 17:00`;
};

function renderRainDrops({
  target = elApp,
  count,
  staggerSpeed,
  maxDisplayCount,
}) {
  return Array.from({ length: Math.min(count, maxDisplayCount) }, (_, i) => {
    const elDrop = createRainDrop();
    target.appendChild(elDrop);
    anime({
      targets: elDrop,
      scale: [0, 1],
      delay: i * staggerSpeed,
    });
    return elDrop;
  });
}

function getPizzaChance({ bugs, minutesLeft }) {
  const chance = Math.floor((bugs / minutesLeft) * 300);
  return Math.min(chance, 100);
}

async function render(target = elApp) {
  const bugs = await service.getBugsCount();
  animateLoading(false);

  const staggerSpeed = (1 / bugs) * 1500;
  const gaugeStartDelay = bugs * staggerSpeed;
  const minutesLeft = getMinutesLeft();
  const pizzaChance = getPizzaChance({ bugs, minutesLeft });

  renderRainDrops({ target, count: bugs, staggerSpeed, maxDisplayCount: 100 });
  animatePizzaGauge({ startDelay: gaugeStartDelay, percent: pizzaChance });
  updateResultMessage({
    bugs,
    minutesLeft,
    percent: pizzaChance,
  });
}

render();
