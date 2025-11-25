import { marked } from "marked";
import readmeContent from "../README.md?raw";

async function loadTabPartials() {
  const containers = Array.from(document.querySelectorAll("[data-partial]"));
  const loaders = containers.map(async (container) => {
    const path = container.getAttribute("data-partial");
    if (!path) {
      return;
    }
    const resp = await fetch(path);
    if (!resp.ok) {
      throw new Error(`Failed to load ${path} (${resp.status})`);
    }
    container.innerHTML = await resp.text();
  });
  await Promise.all(loaders);
}

function loadReadme() {
  const target = document.getElementById("readme-content");
  if (!target) {
    return;
  }
  target.innerHTML = marked.parse(readmeContent);
}

async function init() {
  try {
    await loadTabPartials();
    loadReadme();
    await import("./app.js");
  } catch (err) {
    console.error("Initialization error", err);
  }
}

init();
