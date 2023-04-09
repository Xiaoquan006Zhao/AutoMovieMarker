import * as DB from "../utils/accessDB.js";

const publishableKey =
  "pk_test_Y3VubmluZy1yaGluby01NS5jbGVyay5hY2NvdW50cy5kZXYk";

// Load accessToken and availableUtil from session storage
export let accessToken = sessionStorage.getItem("accessToken");
export let availableUtil = sessionStorage.getItem("availableUtil");

const startClerk = async () => {
  const Clerk = window.Clerk;

  try {
    // Load Clerk environment and session if available
    await Clerk.load();

    const userButton = document.getElementById("user-button");
    const authLinks = document.getElementById("auth-links");

    Clerk.addListener(async ({ user }) => {
      // Display links conditionally based on user state
      authLinks.style.display = user ? "none" : "block";
      if (user) {
        const now = new Date().toISOString();

        if ((availableUtil && now > availableUtil) || !accessToken) {
          const response = await DB.getNewAccessToken(user.id, now);
          accessToken = response.token;
          availableUtil = response.availableUtil;

          // Store accessToken and availableUtil in session storage
          sessionStorage.setItem("accessToken", accessToken);
          sessionStorage.setItem("availableUtil", availableUtil);

          console.log(accessToken);
        }
      } else {
        accessToken = null;
        availableUtil = null;

        // Clear accessToken and availableUtil from session storage
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("availableUtil");

        console.log("Not Admin");
      }
    });

    if (Clerk.user) {
      // Mount user button component
      Clerk.mountUserButton(userButton);
      userButton.style.margin = "auto";
    }
  } catch (err) {
    console.error("Error starting Clerk: ", err);
  }
};

(() => {
  const script = document.createElement("script");
  script.setAttribute("data-clerk-publishable-key", publishableKey);
  script.async = true;
  script.src = `https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js`;
  script.crossOrigin = "anonymous";
  script.addEventListener("load", startClerk);
  script.addEventListener("error", () => {
    document.getElementById("no-frontend-api-warning").hidden = false;
  });
  document.body.appendChild(script);
})();
