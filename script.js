// ===== Helper: Smoothly update active nav link on scroll =====
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");

function setActiveNavLink() {
  let currentId = "";
  const scrollPos = window.scrollY + 100;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    if (scrollPos >= top && scrollPos <= top + height) {
      currentId = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });
}

window.addEventListener("scroll", setActiveNavLink);

// ===== Mobile Menu Toggle =====
const menuToggle = document.getElementById("menuToggle");
const nav = document.querySelector(".nav");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
    });
  });
}

// ===== Theme Toggle (Light / Dark) =====
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle?.querySelector("i");

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  if (themeIcon) {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  }
}

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  if (themeIcon) {
    themeIcon.classList.toggle("fa-moon", !isDark);
    themeIcon.classList.toggle("fa-sun", isDark);
  }
});

// ===== Counters (Stats) =====
const counters = document.querySelectorAll(".counter");
let countersStarted = false;

function startCounters() {
  if (countersStarted) return;
  const triggerPoint = window.innerHeight * 0.85;

  counters.forEach((counter) => {
    const rect = counter.getBoundingClientRect();
    if (rect.top < triggerPoint) {
      animateCounter(counter);
    }
  });
}

function animateCounter(counter) {
  const target = parseInt(counter.dataset.target, 10) || 0;
  let current = 0;
  const increment = Math.max(1, Math.floor(target / 80));

  const interval = setInterval(() => {
    current += increment;
    if (current >= target) {
      counter.textContent = target;
      clearInterval(interval);
    } else {
      counter.textContent = current;
    }
  }, 20);

  countersStarted = true;
}

window.addEventListener("scroll", startCounters);
window.addEventListener("load", startCounters);

// ===== Service Filters =====
const filterButtons = document.querySelectorAll(".filter-btn");
const serviceCards = document.querySelectorAll(".service-card");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    serviceCards.forEach((card) => {
      const category = card.dataset.category;
      if (filter === "all" || category === filter) {
        card.style.display = "block";
        card.style.opacity = "1";
      } else {
        card.style.opacity = "0";
        setTimeout(() => {
          card.style.display = "none";
        }, 200);
      }
    });
  });
});

// ===== Testimonials Slider =====
const testimonialCards = document.querySelectorAll(".testimonial-card");
const prevBtn = document.querySelector(".testimonial-prev");
const nextBtn = document.querySelector(".testimonial-next");
let testimonialIndex = 0;

function showTestimonial(index) {
  testimonialCards.forEach((card, i) => {
    card.classList.toggle("active", i === index);
  });
}

prevBtn?.addEventListener("click", () => {
  testimonialIndex = (testimonialIndex - 1 + testimonialCards.length) % testimonialCards.length;
  showTestimonial(testimonialIndex);
});

nextBtn?.addEventListener("click", () => {
  testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
  showTestimonial(testimonialIndex);
});

// Auto-rotate testimonials
if (testimonialCards.length > 0) {
  setInterval(() => {
    testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
    showTestimonial(testimonialIndex);
  }, 8000);
}

// ===== FAQ Accordion =====
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");
  button.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    faqItems.forEach((i) => i.classList.remove("open"));
    if (!isOpen) {
      item.classList.add("open");
    }
  });
});

// ===== Contact Form Validation (Front-end only) =====
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

function showError(group, message) {
  group.classList.add("error");
  const errorEl = group.querySelector(".error-message");
  if (errorEl) errorEl.textContent = message;
}

function clearError(group) {
  group.classList.remove("error");
  const errorEl = group.querySelector(".error-message");
  if (errorEl) errorEl.textContent = "";
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  let valid = true;

  const nameGroup = contactForm.querySelector("#name").closest(".form-group");
  const emailGroup = contactForm.querySelector("#email").closest(".form-group");
  const serviceGroup = contactForm.querySelector("#service").closest(".form-group");
  const messageGroup = contactForm.querySelector("#message").closest(".form-group");

  const nameValue = contactForm.name.value.trim();
  const emailValue = contactForm.email.value.trim();
  const serviceValue = contactForm.service.value.trim();
  const messageValue = contactForm.message.value.trim();

  // Name
  clearError(nameGroup);
  if (!nameValue) {
    valid = false;
    showError(nameGroup, "Name is required.");
  }

  // Email
  clearError(emailGroup);
  if (!emailValue) {
    valid = false;
    showError(emailGroup, "Email is required.");
  } else if (!validateEmail(emailValue)) {
    valid = false;
    showError(emailGroup, "Please enter a valid email.");
  }

  // Service
  clearError(serviceGroup);
  if (!serviceValue) {
    valid = false;
    showError(serviceGroup, "Please select a service.");
  }

  // Message
  clearError(messageGroup);
  if (!messageValue || messageValue.length < 10) {
    valid = false;
    showError(messageGroup, "Please provide a bit more detail (at least 10 characters).");
  }

  if (!valid) {
    formStatus.textContent = "Please fix the highlighted fields.";
    formStatus.style.color = "#ef4444";
    return;
  }

  // Simulate successful submission (you can hook this to a backend or email API)
  formStatus.textContent = "Thank you! Your message has been recorded (demo only).";
  formStatus.style.color = "#16a34a";
  contactForm.reset();
});

// ===== Back To Top Button =====
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===== Year in Footer =====
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}
