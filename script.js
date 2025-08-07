document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");

  fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
    .then((res) => res.json())
    .then((data) => {
      const postList = document.createElement("div");
      postList.innerHTML = "<h2>Latest Posts</h2>";
      data.forEach((post) => {
        const item = document.createElement("div");
        item.style.marginBottom = "1rem";
        item.innerHTML = `
          <h3>${post.title}</h3>
          <p>${post.body}</p>
        `;
        postList.appendChild(item);
      });
      main.appendChild(postList);
    })
    .catch((err) => {
      const msg = document.createElement("p");
      msg.textContent = "You are offline or API failed.";
      main.appendChild(msg);
    });
});
