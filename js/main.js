(() => {
  const D = window.DATA;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const tags = (a) => a.map((t) => `<li>${esc(t)}</li>`).join("");

  $("stats").innerHTML = D.stats.map((s) => `<li><b>${esc(s.value)}</b>${esc(s.label)}</li>`).join("");

  $("experience").innerHTML = D.experience.map((j, i) => `
    <details class="job reveal"${i === 0 ? " open" : ""}>
      <summary>
        <span class="job-co">${esc(j.company)}</span>
        <span class="job-role">${(j.roles || [j.title]).map(esc).join("<br>")}</span>
        <span class="job-when">${esc(j.duration)}<br>${esc(j.location)}</span>
      </summary>
      ${j.engagements.map((e) => `
        <article class="eng">
          <h3>${esc(e.name)} <small>${esc(e.domain)}</small></h3>
          <p>${esc(e.description)}</p>
          <ul>${e.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
          <ul class="chips">${tags(e.tech)}</ul>
        </article>`).join("")}
    </details>`).join("");

  $("projectGrid").innerHTML = D.projects.map((p) => `
    <article class="card proj reveal" tabindex="0">
      <small>${esc(p.year)}</small>
      <h3>${esc(p.name)}</h3>
      <span class="proj-tag">${esc(p.tagline)}</span>
      <div class="proj-more">
        <p>${esc(p.description)}</p>
        <em>${esc(p.role)}</em>
        <ul class="chips">${tags(p.tech)}</ul>
      </div>
    </article>`).join("");

  $("marquee").innerHTML = [0, 1].map(() =>
    `<span>${D.skills.flatMap(([, items]) => items).map(esc).join(" ✦ ")} ✦ </span>`).join("");

  $("skillGrid").innerHTML = D.skills.map(([cat, items]) => `
    <div class="reveal"><h3>${esc(cat)}</h3><ul class="chips">${tags(items)}</ul></div>`).join("");

  $("eduGrid").innerHTML = D.education.map((e) => `
    <article class="card reveal">
      <small>${esc(e.duration)}</small>
      <h3>${esc(e.course)}</h3>
      <p>${esc(e.major)} · ${esc(e.grade)}</p>
      <span class="proj-tag">${esc(e.school)}, ${esc(e.place)}</span>
    </article>`).join("");

  $("certList").innerHTML = D.certificates.map(([name, org, url, date]) =>
    `<li>${url ? `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(name)}<span class="sr-only"> (opens in new tab)</span></a>` : esc(name)}<span>${esc(org)}${date ? ` · ${esc(date)}` : ""}</span></li>`).join("");

  $("interestList").innerHTML = tags(D.interests);
  $("year").textContent = new Date().getFullYear();

  // menu overlay
  const btn = document.querySelector(".menu-btn");
  const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    btn.setAttribute("aria-expanded", open);
    btn.textContent = open ? "close" : "menu";
    document.querySelectorAll("main, footer").forEach((el) => el.toggleAttribute("inert", open));
    (open ? $("menu").querySelector("a") : btn).focus({ preventScroll: true });
  };
  btn.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  $("menu").addEventListener("click", (e) => e.target.tagName === "A" && setMenu(false));
  document.addEventListener("keydown", (e) => e.key === "Escape" && document.body.classList.contains("menu-open") && setMenu(false));

  // scroll reveal (content stays visible if IntersectionObserver is missing)
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    document.documentElement.classList.add("js-reveal");
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  }
})();
