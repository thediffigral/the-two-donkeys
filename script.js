async function loadPosts() {
  const target = document.getElementById("posts");

  try {
    const response = await fetch("./posts.json");

    if (!response.ok) {
      throw new Error("Could not load posts.json");
    }

    const posts = await response.json();

    if (!posts.length) {
      target.innerHTML =
        '<div class="error">No published posts were found.</div>';
      return;
    }

    const cards = posts.map((post, index) => {
      const title = escapeHtml(post.title || "Untitled");
      const excerpt = getExcerpt(post.content || "");
      const date = formatDate(post.published);

      return `
        <article class="post-card">
          <div class="post-date">${date}</div>
          <h2>
            <a href="stories/${posts[index].slug}/">
              ${title}
            </a>
          </h2>
          <p class="post-excerpt">${escapeHtml(excerpt)}</p>
          <a class="read-more" href="stories/${posts[index].slug}/">
            Read story →
          </a>
        </article>
      `;
    }).join("");

    target.innerHTML = `<div class="posts">${cards}</div>`;

  } catch (error) {
    console.error(error);

    target.innerHTML =
      '<div class="error">The posts could not be loaded yet.</div>';
  }
}

function getExcerpt(html) {
  const div = document.createElement("div");
  div.innerHTML = html;

  const text = (div.textContent || div.innerText || "")
    .replace(/\s+/g, " ")
    .trim();

  return text.length > 220
    ? text.substring(0, 220) + "…"
    : text;
}

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));
}

loadPosts();
