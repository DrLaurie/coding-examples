"use strict";

/* Created by Dr. Laurie Alfaro - www.lauriealfaro.com */
/* Updated 05/22/2026 */


/* Generate emoji table */
const generateEmoji = () => {
  const container = document.querySelector("#narf");

  // Create table elements instead of building HTML strings
  const table = document.createElement("table");
  const headerRow = document.createElement("tr");

  const headers = ["Emoji", "Code", "Emoji", "Code", "Emoji", "Code", "Emoji", "Code", "Emoji", "Code"];
  headers.forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });

  table.appendChild(headerRow);

  let row;

  for (let i = 1; i <= 1020; i++) {
    if ((i - 1) % 5 === 0) {
      row = document.createElement("tr");
      table.appendChild(row);
    }

    const code = 127743 + i;
    const emoji = String.fromCodePoint(code);

    // Emoji cell
    const emojiCell = document.createElement("td");
    emojiCell.textContent = emoji;

    // Code cell
    const codeCell = document.createElement("td");
    const em = document.createElement("em");
    em.textContent = `&#${code};`;

    codeCell.appendChild(em);

    row.appendChild(emojiCell);
    row.appendChild(codeCell);
  }

  container.replaceChildren(table);
};

/*  Init */
document.addEventListener("DOMContentLoaded", () => {
  generateEmoji();
});
