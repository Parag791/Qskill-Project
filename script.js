document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("contactForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  document.getElementById("formMessage").textContent =
    `Thanks, ${name}! This demo form is working. Connect an email service to receive messages.`;
  this.reset();
});
