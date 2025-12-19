/* ============================================
   MILAN FAMILY EXPERIENCE — Cooperativo
   Feedback con GIFs (acierto / error)
   + 10 Pistas culturales avanzadas
============================================ */

document.addEventListener("DOMContentLoaded", () => {
  const $  = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const steps        = $$(".step");
  const progressBar  = $("#progress-bar");
  const toast        = $("#toast");
  const timerEl      = $("#global-timer");
  const feedbackBox  = $("#feedback-visual");

  let currentStep = 0;
  let secondsLeft = 20 * 60; // 20 minutos

  // GIFs proporcionados
  const GIF_OK  = "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGc3Z3gzaWhybHdnN2RscHFjb2Y3eng4amQ2N3dyaWQwd2U2bzAxeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ukmZRuEqc2Rbi/giphy.gif";
  const GIF_BAD = "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGxrMTBtOHB3anU5eDNnYW5zZDg4ajd2dGRpbzR3enJvdjRsZGd5ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wID3zXURLH1jrjCcZy/giphy.gif";

  // Respuestas correctas por grupo (donde queremos feedback)
  const correctAnswers = {
    hobby_mama:    "Coser",
    cantante_papa: "Rosalía",
    regalo_nene:   "Un perrete",
    comida_elisa:  "Sushi y croquetas",

    cg1: "Koala",
    cg2: "Suiza",
    cg3: "Chino mandarín",
    cg4: "Patatas fritas",
    cg5: "Elefante",
    cg6: "Italia",
    cg7: "Antártida",

    adv1:  "Renacimiento",
    adv2:  "Catedral gótica",
    adv3:  "Semana de la Moda",
    adv4:  "Una silla",
    adv5:  "Parmesano",
    adv6:  "Sfumato",
    adv7:  "Moda y diseño industrial",
    adv8:  "Tren de alta velocidad",
    adv9:  "Museo del diseño",
    adv10: "Pasear por galerías comerciales cubiertas",

    pais:     "Italia",
    fama:     "Moda y diseño",
    leonardo: "La Última Cena"
  };

  // Qué grupos de respuesta se usan en cada step para feedback con GIF
  // (índices corresponden al orden de las secciones .step)
  const feedbackConfig = {
    2:  ["hobby_mama"],
    3:  ["cantante_papa"],
    4:  ["regalo_nene"],
    5:  ["comida_elisa"],

    6:  ["cg1"],
    7:  ["cg2"],
    8:  ["cg3"],
    9:  ["cg4"],
    10: ["cg5"],
    11: ["cg6"],
    12: ["cg7"],

    13: ["adv1"],
    14: ["adv2"],
    15: ["adv3"],
    16: ["adv4"],
    17: ["adv5"],
    18: ["adv6"],
    19: ["adv7"],
    20: ["adv8"],
    21: ["adv9"],
    22: ["adv10"],

    23: ["pais", "fama", "leonardo"]
  };

  /* ==============================
     TEMPORIZADOR
  ============================== */
  function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  if (timerEl) {
    timerEl.textContent = formatTime(secondsLeft);
    setInterval(() => {
      if (secondsLeft <= 0) return;
      secondsLeft--;
      timerEl.textContent = formatTime(secondsLeft);
      if (secondsLeft <= 5 * 60) timerEl.classList.add("red");
    }, 1000);
  }

  /* ==============================
     TOAST
  ============================== */
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1800);
  }

  /* ==============================
     CHIPS (RADIO)
  ============================== */
  $$(".chip input").forEach((input) => {
    input.addEventListener("change", () => {
      const chip = input.closest(".chip");
      chip.parentElement
        .querySelectorAll(".chip")
        .forEach((c) => c.classList.remove("selected"));
      if (input.checked) chip.classList.add("selected");
    });
  });

  /* ==============================
     FEEDBACK VISUAL (GIFs)
  ============================== */
  function clearFeedback() {
    if (feedbackBox) {
      feedbackBox.innerHTML = "";
    }
  }

  function checkCorrect(groups) {
    let allCorrect = true;
    for (const name of groups) {
      const selected = document.querySelector(`input[name="${name}"]:checked`);
      const expected = correctAnswers[name];
      if (!selected || !expected || selected.value !== expected) {
        allCorrect = false;
      }
    }
    return allCorrect;
  }

  function showFeedback(isCorrect, onDone) {
    if (!feedbackBox) {
      onDone();
      return;
    }

    const img = document.createElement("img");
    img.src = isCorrect ? GIF_OK : GIF_BAD;
    img.alt = isCorrect ? "Hemos acertado" : "Nos hemos equivocado";
    img.className = "feedback-gif";

    feedbackBox.innerHTML = "";
    feedbackBox.appendChild(img);

    const msg = document.createElement("p");
    msg.className = "feedback-text";
    msg.textContent = isCorrect
      ? "¡Lo hemos clavado!"
      : "Esta no la hemos acertado… pero seguimos jugando juntos.";
    feedbackBox.appendChild(msg);

    setTimeout(() => {
      clearFeedback();
      onDone();
    }, 1600);
  }

  /* ==============================
     NAVEGACIÓN ENTRE PASOS
  ============================== */
  function showStep(i) {
    steps.forEach((s) => s.classList.remove("active"));
    steps[i].classList.add("active");
    currentStep = i;

    const maxIndex = steps.length - 1;
    const pct = Math.round((i / maxIndex) * 100);
    if (progressBar) progressBar.style.width = pct + "%";

    clearFeedback();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  $$("[data-next]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!validate(currentStep)) return;

      const next = Math.min(currentStep + 1, steps.length - 1);
      const groups = feedbackConfig[currentStep];

      // Si en este paso hay feedback (pregunta objetiva), mostramos GIF
      if (groups && groups.length) {
        const isCorrect = checkCorrect(groups);
        showFeedback(isCorrect, () => showStep(next));
      } else {
        showStep(next);
      }
    });
  });

  $$("[data-prev]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const prev = Math.max(currentStep - 1, 0);
      showStep(prev);
    });
  });

  /* ==============================
     VALIDACIONES
  ============================== */
  function validate(stepIndex) {
    const mapping = {
      1:  "navidad",
      2:  "hobby_mama",
      3:  "cantante_papa",
      4:  "regalo_nene",
      5:  "comida_elisa",
      6:  "cg1",
      7:  "cg2",
      8:  "cg3",
      9:  "cg4",
      10: "cg5",
      11: "cg6",
      12: "cg7",
      13: "adv1",
      14: "adv2",
      15: "adv3",
      16: "adv4",
      17: "adv5",
      18: "adv6",
      19: "adv7",
      20: "adv8",
      21: "adv9",
      22: "adv10",
      23: "pais,fama,leonardo"
    };

    const required = mapping[stepIndex];
    if (!required) return true;

    const groups = required.split(",");
    for (const group of groups) {
      if (!document.querySelector(`input[name="${group}"]:checked`)) {
        showToast("Tenemos que elegir una opción antes de seguir.");
        return false;
      }
    }

    return true;
  }

  /* ==============================
     INICIO
  ============================== */
  showStep(0);
});
