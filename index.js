document.addEventListener("DOMContentLoaded", function () {
  var navbar = document.querySelector(".navbar");
  var hamburger = document.getElementById("hamburger-btn");
  var animatedItems = document.querySelectorAll(".anim-fade, .anim-fade-up, .anim-pop");
  var barFills = document.querySelectorAll(".bar-fill");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function updateNavbar() {
    if (!navbar) return;
    navbar.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href").slice(1);
      var target = document.getElementById(targetId);

      if (!target) return;

      e.preventDefault();

      var targetRect = target.getBoundingClientRect();
      var viewportHeight = window.innerHeight;
      var scrollTop = window.pageYOffset
        + targetRect.top
        - (viewportHeight / 2)
        + (targetRect.height / 2);

      window.scrollTo({
        top: scrollTop,
        behavior: reduceMotion ? "auto" : "smooth"
      });
    });
  });

  if (hamburger && navbar) {
    hamburger.addEventListener("click", function () {
      navbar.classList.toggle("nav-open");
    });
  }

  document.querySelectorAll(".nav-links a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (navbar) navbar.classList.remove("nav-open");
    });
  });

  barFills.forEach(function (bar) {
    var targetWidth = bar.style.width || "0%";
    bar.dataset.targetWidth = targetWidth;
    bar.style.width = reduceMotion ? targetWidth : "0%";
  });

  function fillDashboardBars() {
    barFills.forEach(function (bar) {
      bar.style.width = bar.dataset.targetWidth || "0%";
    });
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    animatedItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
    fillDashboardBars();
    return;
  }

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px"
  });

  animatedItems.forEach(function (item) {
    revealObserver.observe(item);
  });

  var preview = document.querySelector(".preview-mockup-wrap");
  if (preview) {
    var barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        fillDashboardBars();
        barObserver.unobserve(entry.target);
      });
    }, { threshold: 0.45 });

    barObserver.observe(preview);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var monthData = {
    may: {
      title: "May Dashboard",
      balance: "₱24,500",
      spent: "₱17,500",
      saved: "₱8,200",
      food: "₱5,400",
      transport: "₱2,800",
      shopping: "₱4,100",
      bars: { food: "72%", transport: "38%", shopping: "55%" },
      score: "72%",
      message: "Food is taking 31% of your spending. Try setting a ₱4,800 limit this week."
    },
    june: {
      title: "June Plan",
      balance: "₱18,900",
      spent: "₱9,300",
      saved: "₱12,000",
      food: "₱3,100",
      transport: "₱1,900",
      shopping: "₱2,200",
      bars: { food: "46%", transport: "29%", shopping: "34%" },
      score: "84%",
      message: "Nice start. June is under budget so far, and your savings goal is ahead by ₱1,200."
    }
  };

  var messages = {
    overview: "Overview shows your balance, spending, and savings in one scan.",
    budget: "Budget mode highlights categories before they get too close to the limit.",
    goals: "Goals mode keeps your emergency fund and next purchase visible.",
    balance: "Net balance updates after every income and expense entry.",
    spent: "Spent view helps you catch categories that are moving too fast.",
    saved: "Saved view tracks money you have protected from daily spending.",
    expense: "Expense added preview: Capitally would subtract it and update the chart instantly.",
    income: "Income preview: new cash raises the balance without touching your spending limits.",
    goal: "Savings goal preview: set a target and see how much to save each week.",
    food: "Jollibee is tagged as Food. Clicks like this help users understand each transaction.",
    salary: "Salary is tagged as Income, so it boosts balance and monthly cash flow."
  };

  function setMessage(mockup, text) {
    var message = mockup.querySelector("[data-message]");
    if (message) message.textContent = text;
  }

  function updateMockupMonth(mockup, month) {
    var data = monthData[month];
    if (!data) return;

    mockup.querySelector(".cap-title").textContent = data.title;
    mockup.querySelector("[data-balance]").textContent = data.balance;
    mockup.querySelector("[data-spent]").textContent = data.spent;
    mockup.querySelector("[data-saved]").textContent = data.saved;
    mockup.querySelector("[data-food]").textContent = data.food;
    mockup.querySelector("[data-transport]").textContent = data.transport;
    mockup.querySelector("[data-shopping]").textContent = data.shopping;
    mockup.querySelector("[data-bar='food']").style.width = data.bars.food;
    mockup.querySelector("[data-bar='transport']").style.width = data.bars.transport;
    mockup.querySelector("[data-bar='shopping']").style.width = data.bars.shopping;
    mockup.querySelector("[data-score]").textContent = data.score;
    mockup.querySelector(".cap-progress-ring").style.background = "conic-gradient(#22c55e " + data.score + ", #dcfce7 0)";
    setMessage(mockup, data.message);
  }

  document.querySelectorAll("[data-cap-mockup]").forEach(function (mockup) {
    mockup.querySelectorAll(".cap-month").forEach(function (button) {
      button.addEventListener("click", function () {
        mockup.querySelectorAll(".cap-month").forEach(function (item) { item.classList.remove("is-active"); });
        button.classList.add("is-active");
        updateMockupMonth(mockup, button.dataset.month);
      });
    });

    mockup.querySelectorAll(".cap-nav-item").forEach(function (button) {
      button.addEventListener("click", function () {
        mockup.querySelectorAll(".cap-nav-item").forEach(function (item) { item.classList.remove("is-active"); });
        button.classList.add("is-active");
        setMessage(mockup, messages[button.dataset.panel]);
      });
    });

    mockup.querySelectorAll(".cap-summary-card").forEach(function (button) {
      button.addEventListener("click", function () {
        mockup.querySelectorAll(".cap-summary-card").forEach(function (item) { item.classList.remove("is-active"); });
        button.classList.add("is-active");
        setMessage(mockup, messages[button.dataset.summary]);
      });
    });

    mockup.querySelectorAll("[data-action]").forEach(function (button) {
      button.addEventListener("click", function () {
        mockup.querySelectorAll("[data-action]").forEach(function (item) { item.classList.remove("is-active"); });
        button.classList.add("is-active");
        setMessage(mockup, messages[button.dataset.action]);
      });
    });

    mockup.querySelectorAll(".cap-transaction").forEach(function (button) {
      button.addEventListener("click", function () {
        mockup.querySelectorAll(".cap-transaction").forEach(function (item) { item.classList.remove("is-active"); });
        button.classList.add("is-active");
        setMessage(mockup, messages[button.dataset.transaction]);
      });
    });
  });
});