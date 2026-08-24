const BLOG = "https://thetwodonkeys.blogspot.com";
const FEED = BLOG + "/feeds/posts/default?alt=json-in-script&max-results=50&callback=renderBloggerFeed";

function cleanText(html) {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  return (div.textContent || div.innerText || "").replace(/\s+/g, " ").trim();
}

function getLink(entry) {
  const links = entry.link || [];
  const alternate = links.find(x => x.rel === "alternate");
  return alternate ? alternate.href : "#";
}

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric", month: "long", day: "numeric"
  }).format(d);
}

function renderBloggerFeed(data) {
  const target = document.getElementById("posts");
  const entries = data?.feed?.entry || [];

  if (!entries.length) {
    target.innerHTML = '<div class="error">No published posts were returned by Blogger yet.</div>';
    return;
  }

  const cards = entries.map(entry => {
    const title = entry.title?.$t || "Untitled";
    const html = entry.content?.$t || entry.summary?.$t || "";
    const excerpt = cleanText(html).slice(0, 220);
    const link = getLink(entry);
    const date = formatDate(entry.published?.$t || entry.updated?.$t);

    return `
      <article class="post-card">
        <div class="post-date">${date}</div>
        <h2><a href="${link}" target="_blank" rel="noopener">${escapeHtml(title)}</a></h2>
        <p class="post-excerpt">${escapeHtml(excerpt)}${excerpt.length >= 220 ? "…" : ""}</p>
        <a class="read-more" href="${link}" target="_blank" rel="noopener">Read story →</a>
      </article>`;
  }).join("");

  target.innerHTML = `<div class="posts">${cards}</div>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[ch]));
}

const script = document.createElement("script");
script.src = FEED;
script.onerror = () => {
  document.getElementById("posts").innerHTML =
    '<div class="error">Blogger could not be reached. The site itself is working; we will handle the Blogger connection during the next setup step.</div>';
};
document.body.appendChild(script);
