self.addEventListener("install", (event) => {
  console.log("Service Worker installed");
});

self.addEventListener("fetch", (event) => {
  // basic caching later
});