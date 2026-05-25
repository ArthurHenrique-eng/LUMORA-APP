(function initHomeCounters() {
  const counters = document.querySelectorAll("[data-target]");
  if (!counters.length) return;

  counters.forEach((counter) => {
    const target = Number(counter.getAttribute("data-target")) || 0;
    const duration = 1200;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });
})();
