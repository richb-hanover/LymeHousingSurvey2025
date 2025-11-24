/**
 * Switching to use chart.js directly instead of mdbootstrap
 */

// Chart is loaded globally from the CDN in index.html

export function makeChart(id, type, labels, data) {
  new Chart(document.getElementById(id), {
    type,
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [...data].map(() => randomColor()),
        },
      ],
    },
  });
}

function randomColor() {
  return `hsl(${Math.random() * 360}, 70%, 60%)`;
}

// makeChart("chart1", "pie", ["Yes", "No"], [20, 80]);
