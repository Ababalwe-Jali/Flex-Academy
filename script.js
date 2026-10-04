"use strict";

const launchCalendar = {
  title: "How to launch an STR company",
  start: "20261015T170000",
  end: "20261015T180000",
  details: "Flex Academy free live webinar. Connect an event platform to receive your personal access link.",
};
const scaleCalendar = {
  title: "Flex Academy scale strategy call",
  details: "Flex Academy strategy call. Bring your numbers, bottlenecks, and biggest growth question.",
};

let activeFlow = null;
let activeStep = 1;
let selectedDay = 21;
let selectedTime = "13:00";
let lastFocusedElement = null;

const modalRoot = document.querySelector("#modal-root");
const pathStage = document.querySelector("#path-stage");
const pathTabs = [...document.querySelectorAll("[data-path]")];

function iconArrow() {
  return '<svg aria-hidden="true" class="icon" viewBox="0 0 20 20" fill="none"><path d="M3 10h13M11 5l5 5-5 5" stroke="currentColor" stroke-width="1.5"></path></svg>';
}

function eyebrow(text, light = false) {
  return `<div class="eyebrow${light ? " eyebrow-light" : ""}"><i></i>${text}</div>`;
}

function field(label, name, placeholder, type = "text", autocomplete = "") {
  return `<label class="field"><span>${label}</span><input name="${name}" type="${type}" placeholder="${placeholder}"${autocomplete ? ` autocomplete="${autocomplete}"` : ""} required></label>`;
}

function selectField(label, name, options) {
  return `<label class="field"><span>${label}</span><select name="${name}" required><option value="" disabled selected>Select an option</option>${options.map((option) => `<option value="${option}">${option}</option>`).join("")}</select></label>`;
}

function modalHeader() {
  return `<div class="modal-top"><div class="brand" aria-label="Flex Academy"><svg aria-hidden="true" viewBox="0 0 36 36"><path d="M4 6h28L20 18l12 12H4l12-12L4 6Z" fill="currentColor"></path></svg><span>FLEX<br>ACADEMY</span></div><button class="close" type="button" data-close aria-label="Close dialog">×</button></div>`;
}

function progressMarkup() {
  const total = activeFlow === "launch" ? 2 : 3;
  return `<div class="progress" aria-label="Step ${activeStep} of ${total}">${Array.from({ length: total }, (_, index) => `<i class="${index < activeStep ? "active" : ""}"></i>`).join("")}</div>`;
}

function calendarMarkup() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const firstDayOffset = 3;
  const dates = Array.from({ length: 31 }, (_, index) => index + 1);
  return `<div class="calendar-head"><button type="button" disabled aria-label="Previous month">←</button><b>October 2026</b><button type="button" disabled aria-label="Next month">→</button></div>
    <div class="calendar" role="group" aria-label="Available dates in October 2026">
      ${days.map((day) => `<b aria-hidden="true">${day}</b>`).join("")}
      ${Array.from({ length: firstDayOffset }, () => "<span></span>").join("")}
      ${dates.map((day) => `<button type="button" data-day="${day}" class="${day === selectedDay ? "selected" : ""}"${day < 12 ? ' disabled aria-label="October ' + day + ', unavailable"' : ' aria-pressed="' + (day === selectedDay) + '" tabindex="' + (day === selectedDay ? "0" : "-1") + '" aria-label="October ' + day + '"' }>${day}</button>`).join("")}
    </div>
    <div class="times" role="group" aria-label="Available call times">
      ${["09:30", "13:00", "16:30"].map((time) => `<button type="button" data-time="${time}" class="${time === selectedTime ? "selected" : ""}" aria-pressed="${time === selectedTime}">${time}</button>`).join("")}
    </div>`;
}

function confirmationMarkup() {
  const isLaunch = activeFlow === "launch";
  const day = isLaunch ? 15 : selectedDay;
  const title = isLaunch ? launchCalendar.title : "Scale strategy call";
  const timezone = isLaunch || day < 25 ? "BST" : "GMT";
  const schedule = isLaunch ? "18:00–19:00 BST · Live online" : `${selectedTime} ${timezone} · 25 minutes · Video call`;
  const followup = isLaunch
    ? "Prototype only: this does not submit a registration. Connect an email service to send webinar access details."
    : "Prototype only: this does not reserve the time. Connect a booking service to confirm the call and send an invite.";
  return `<div class="confirmation">
    <div class="success-mark${isLaunch ? "" : " acid"}">✓</div>
    ${eyebrow(isLaunch ? "Sample registration details" : "Sample call details", !isLaunch)}
    <h2>${isLaunch ? "Webinar details, at a glance." : "Call details, at a glance."}</h2>
    <p>${followup}</p>
    <div class="event-card${isLaunch ? "" : " dark"}">
      <div><b>${day}</b><span>OCT</span></div>
      <p><strong>${title}</strong><span>${schedule}</span></p>
    </div>
    <button class="button button-acid full" type="button" data-calendar><span>Add to calendar</span>${iconArrow()}</button>
    <button class="text-link${isLaunch ? "" : " light"}" type="button" data-close>Return to the page</button>
  </div>`;
}

function formMarkup() {
  if (activeFlow === "launch" && activeStep === 1) {
    return `<form data-step-form>
      ${eyebrow("Free live webinar · sample date")}
      <h2>Build your first STR business on solid ground.</h2>
      <p class="modal-copy">An introduction to the operating journey behind The Flex and the starting decisions for your own business.</p>
      <div class="date-chip"><b>THU, OCT 15</b><span>Sample date · 18:00 London · Online</span></div>
      <div class="form-grid">${field("Your name", "name", "Alex Morgan", "text", "name")}${field("Work email", "email", "alex@email.com", "email", "email")}${selectField("Country", "country", ["United Kingdom", "United States", "Canada", "Australia", "Other"])}</div>
      <button class="button button-dark full" type="submit"><span>Continue to preview</span>${iconArrow()}</button>
      <small>Prototype only: this form does not submit or store your details.</small>
    </form>`;
  }
  if (activeFlow === "scale" && activeStep === 1) {
    return `<form data-step-form>
      ${eyebrow("Strategy call · prototype", true)}
      <h2>Let’s understand your operation.</h2>
      <p class="modal-copy">A few details help prepare a useful 25-minute conversation.</p>
      <div class="form-grid two-col">
        ${selectField("Units today", "units", ["1", "2–5", "6–10", "11+"])}
        ${selectField("12-month target", "target", ["5 units", "10–25 units", "25–50 units", "50+ units"])}
        ${field("Primary city", "city", "e.g. Manchester")}
        ${selectField("Budget band (local currency)", "budget", ["Under 5k", "5k–15k", "15k–30k", "30k+"])}
      </div>
      <button class="button button-acid full" type="submit"><span>Continue to calendar</span>${iconArrow()}</button>
      <small>Prototype only: answers are not submitted or stored.</small>
    </form>`;
  }
  if (activeFlow === "scale" && activeStep === 2) {
    return `<form data-step-form>
      ${eyebrow("Choose a time", true)}
      <h2>25 minutes. Your operation, unpacked.</h2>
      <p class="modal-copy">Sample availability for October 2026. No live booking is connected.</p>
      ${calendarMarkup()}
      <button class="button button-acid full" type="submit"><span>Confirm ${new Date(Date.UTC(2026, 9, selectedDay)).toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" })} ${selectedDay} Oct, ${selectedTime}</span>${iconArrow()}</button>
    </form>`;
  }
  return confirmationMarkup();
}

function renderModal(focusSelector = ".close") {
  const isLaunch = activeFlow === "launch";
  modalRoot.innerHTML = `<div class="modal-wrap">
    <button class="modal-backdrop" type="button" data-close aria-label="Close dialog"></button>
    <section class="modal ${isLaunch ? "modal-launch" : "modal-scale"}" role="dialog" aria-modal="true" aria-label="${isLaunch ? "Webinar registration" : "Strategy call booking"}">
      ${modalHeader()}${progressMarkup()}${formMarkup()}
    </section>
  </div>`;
  document.body.style.overflow = "hidden";
  (modalRoot.querySelector(focusSelector) || modalRoot.querySelector(".close")).focus();
}

function keepFocusInsideDialog(event) {
  if (event.key !== "Tab" || !activeFlow) return;
  const dialog = modalRoot.querySelector('[role="dialog"]');
  const focusable = [...dialog.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])')]
    .filter((element) => element.getClientRects().length > 0);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function openFlow(flow) {
  lastFocusedElement = document.activeElement;
  activeFlow = flow;
  activeStep = 1;
  selectedDay = 21;
  selectedTime = "13:00";
  renderModal(`[data-day="${selectedDay}"]`);
}

function closeFlow() {
  activeFlow = null;
  modalRoot.innerHTML = "";
  document.body.style.overflow = "";
  if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

function updatePath(path) {
  const isLaunch = path === "launch";
  pathTabs.forEach((tab) => {
    const selected = tab.dataset.path === path;
    tab.classList.toggle("active", selected);
    tab.classList.toggle("launch-tab", selected && isLaunch);
    tab.classList.toggle("scale-tab", selected && !isLaunch);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  const launch = {
    number: "01",
    eyebrow: "For the 9-to-5 leaver",
    heading: "Turn ambition into your first operating system.",
    copy: "Ready to leave the 9-to-5 and build income you own? Start with a clear sequence for finding, launching and operating your first units.",
    cta: "Register for the free webinar",
    steps: [["01", "FIND", "Know where and what to launch"], ["02", "OPEN", "Secure and prepare the right units"], ["03", "OPERATE", "Deliver without chaos"]],
  };
  const scale = {
    number: "02",
    eyebrow: "For the early operator",
    heading: "Turn a busy operation into a scalable company.",
    copy: "Already running a few units? Build the people, processes and systems to manage the manual work and make room to grow.",
    cta: "Book a free strategy call",
    steps: [["01", "SYSTEMISE", "Make repeatable work consistent"], ["02", "UNDERSTAND", "Get closer to the numbers"], ["03", "GROW", "Build capacity for the next stage"]],
  };
  const content = isLaunch ? launch : scale;
  pathStage.className = `path-stage ${path}`;
  pathStage.setAttribute("aria-labelledby", `${path}-tab`);
  pathStage.innerHTML = `<div class="path-number">${content.number}</div>
    <div class="path-story">${eyebrow(content.eyebrow, true)}<h3>${content.heading}</h3><p>${content.copy}</p>
      <button class="button button-${isLaunch ? "acid" : "light"}" type="button" data-flow="${path}"><span>${content.cta}</span>${iconArrow()}</button>
    </div>
    <div class="path-map">${content.steps.map(([number, title, copy]) => `<div><span>${number}</span><p><b>${title}</b>${copy}</p></div>`).join("")}</div>`;
}

function addCalendarEvent() {
  const event = activeFlow === "launch" ? launchCalendar : scaleCalendar;
  const startTime = selectedTime.split(":").map(Number);
  const endMinutes = startTime[0] * 60 + startTime[1] + 25;
  const day = activeFlow === "launch" ? 15 : selectedDay;
  const eventStart = activeFlow === "launch"
    ? event.start
    : `202610${String(day).padStart(2, "0")}T${String(startTime[0]).padStart(2, "0")}${String(startTime[1]).padStart(2, "0")}00`;
  const eventEnd = activeFlow === "launch"
    ? event.end
    : `202610${String(day).padStart(2, "0")}T${String(Math.floor(endMinutes / 60)).padStart(2, "0")}${String(endMinutes % 60).padStart(2, "0")}00`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Flex Academy//Landing Page//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}@flexacademy`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    `DTSTART;TZID=Europe/London:${eventStart}`,
    `DTEND;TZID=Europe/London:${eventEnd}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.details}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const download = document.createElement("a");
  download.href = url;
  download.download = "flex-academy-event.ics";
  document.body.append(download);
  download.click();
  download.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

document.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  const flowButton = target.closest("[data-flow]");
  if (flowButton) {
    openFlow(flowButton.dataset.flow);
    return;
  }
  const pathTab = target.closest("[data-path]");
  if (pathTab) {
    updatePath(pathTab.dataset.path);
    return;
  }
  const closeButton = target.closest("[data-close]");
  if (closeButton) {
    closeFlow();
    return;
  }
  const dayButton = target.closest("[data-day]");
  if (dayButton && !dayButton.disabled) {
    selectedDay = Number(dayButton.dataset.day);
    renderModal(`[data-day="${selectedDay}"]`);
    return;
  }
  const timeButton = target.closest("[data-time]");
  if (timeButton) {
    selectedTime = timeButton.dataset.time;
    renderModal(`[data-time="${selectedTime}"]`);
    return;
  }
  if (target.closest("[data-calendar]")) addCalendarEvent();
});

document.addEventListener("submit", (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  if (form.id === "checklist-form") {
    event.preventDefault();
    if (!form.reportValidity()) return;
    form.hidden = true;
    document.querySelector(".checklist-note").hidden = true;
    document.querySelector("#check-success").hidden = false;
    return;
  }
  if (!form.matches("[data-step-form]")) return;
  event.preventDefault();
  if (!form.reportValidity()) return;
  activeStep += 1;
  renderModal(activeFlow === "scale" && activeStep === 2 ? `[data-day="${selectedDay}"]` : ".close");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && activeFlow) closeFlow();
  const dayButton = event.target instanceof Element ? event.target.closest("[data-day]") : null;
  if (dayButton && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
    event.preventDefault();
    const offset = event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : event.key === "ArrowUp" ? -7 : 7;
    let nextDay = selectedDay + offset;
    while (nextDay >= 12 && nextDay <= 31) {
      if (nextDay !== selectedDay) {
        selectedDay = nextDay;
        renderModal(`[data-day="${selectedDay}"]`);
        return;
      }
      nextDay += offset;
    }
  }
  keepFocusInsideDialog(event);
});

pathTabs.forEach((tab) => {
  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const nextPath = tab.dataset.path === "launch" ? "scale" : "launch";
    updatePath(nextPath);
    document.querySelector(`[data-path="${nextPath}"]`).focus();
  });
});
