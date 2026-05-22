"use strict";

/* Utility: Convert hex to RGB */
/* Created by Dr. Laurie Alfaro - www.lauriealfaro.com */
/* Updated 05/22/2026 */
const hexToRgb = (hex) => {
  const cleanHex = hex.replace(/^#/, '');
  const [r, g, b] = cleanHex.match(/../g).map(val => parseInt(val, 16)); // modern parsing 【4-194256】
  return { r, g, b };
};

/* Get stored color (default = white) */
const getStoredColor = () => {
  return localStorage.getItem("color") || "#ffffff";
};

/* Save color */
const setStoredColor = (color) => {
  localStorage.setItem("color", color);
};

/* Update UI */
const showColor = (hex) => {
  const { r, g, b } = hexToRgb(hex);

  const display = document.querySelector("#color_selected");
  const input = document.querySelector("#color");

  display.innerHTML = `
    Color selected: <strong>${hex}<br>rgb(${r}, ${g}, ${b})</strong>
  `;

  document.body.style.backgroundColor = hex;
  input.value = hex;
  input.focus();
};

/* Handle color change */
const handleColorChange = (e) => {
  const color = e.target.value;
  showColor(color);
  setStoredColor(color);
};

/* Initialization */
document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("#color");

  input.addEventListener("change", handleColorChange);

  const savedColor = getStoredColor();
  showColor(savedColor);
});
