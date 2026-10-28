import {
  siteData,
  isValidUrl,
  getCategoryCount,
  getInformationCount,
  getActiveUrlCount,
  normalizeString,
} from "./data.js";

import {
  createIcons,
  Folder,
  Calendar,
  MapPin,
  ExternalLink,
  FileText,
  Search,
  X,
  ChevronDown,
  Info,
  Archive,
  Phone,
  Building2,
  ArrowUpRight,
  Inbox,
  HardDrive,
  Play,
  Image as ImageIcon,
  Globe,
  Table2,
  Sparkles,
  Zap,
  Star,
  CircleDot,
} from "lucide";

const ALL_ICONS = {
  Folder,
  Calendar,
  MapPin,
  ExternalLink,
  FileText,
  Search,
  X,
  ChevronDown,
  Info,
  Archive,
  Phone,
  Building2,
  ArrowUpRight,
  Inbox,
  HardDrive,
  Play,
  Image: ImageIcon,
  Globe,
  Table2,
  Sparkles,
  Zap,
  Star,
  CircleDot,
};

const SOURCE_ICON_MAP = {
  unknown: "external-link",
  drive: "hard-drive",
  youtube: "play",
  photos: "image",
  pdf: "file-text",
  web: "globe",
  image: "image",
  spreadsheet: "table-2",
};

const ACCENT_BG = {
  orange: "bg-orange",
  blue: "bg-blue-soft",
  yellow: "bg-yellow",
};

function refreshIcons() {
  createIcons({ icons: ALL_ICONS });
}

function iconForSource(source) {
  return SOURCE_ICON_MAP[source] || SOURCE_ICON_MAP.unknown;
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, val] of Object.entries(attrs)) {
    if (key === "className") node.className = val;
    else if (key === "textContent") node.textContent = val;
    else if (key === "innerHTML") node.innerHTML = val;
    else if (key === "dataset") Object.assign(node.dataset, val);
    else if (
      key.startsWith("aria-") ||
      key.startsWith("data-") ||
      [
        "role",
        "type",
        "href",
        "target",
        "rel",
        "id",
        "title",
        "alt",
        "src",
        "placeholder",
        "disabled",
        "loading",
        "width",
        "height",
        "style",
      ].includes(key)
    ) {
      node.setAttribute(key, val);
    }
  }
  for (const child of children) {
    if (child == null || child === false) continue;
    if (typeof child === "string" || typeof child === "number")
      node.appendChild(document.createTextNode(String(child)));
    else node.appendChild(child);
  }
  return node;
}

function iconNode(name, size = 20, extraClass = "") {
  const i = document.createElement("i");
  i.setAttribute("data-lucide", name);
  i.className = `inline-block w-${size / 4} h-${size / 4} ${extraClass}`.trim();
  i.setAttribute("aria-hidden", "true");
  return i;
}

// ==================== Header ====================
function renderHeader() {
  const container = document.getElementById("header-content");
  if (!container) return;

  const inst = siteData.institution;
  const imgWrapper = el("div", { className: "relative shrink-0" });

  const img = el("img", {
    src: inst.buildingImage,
    alt: `Gedung ${inst.name}`,
    className: "w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border-[3px] border-ink hard-shadow-sm bg-white",
    loading: "eager",
    width: "96",
    height: "96",
  });

  const fallback = el(
    "div",
    {
      className:
        "fallback-building hidden w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-orange border-[3px] border-ink hard-shadow-sm items-center justify-center",
    },
    [iconNode("building-2", 36, "text-ink")],
  );

  img.onerror = () => {
    img.style.display = "none";
    fallback.style.display = "flex";
  };

  imgWrapper.appendChild(img);
  imgWrapper.appendChild(fallback);

  const info = el("div", { className: "min-w-0" }, [
    el("div", { className: "flex items-center gap-2 mb-2 flex-wrap" }, [
      el("span", { className: "sticker bg-yellow text-ink" }, [
        iconNode("zap", 12, "text-ink"),
        inst.label.toUpperCase(),
      ]),
    ]),
    el("h1", {
      className: "text-xl sm:text-2xl font-display text-white leading-tight",
      textContent: inst.name,
    }),
    el("p", {
      className: "text-sm text-white/80 mt-1 font-medium",
      textContent: "Pusat Dokumentasi dan Informasi Kegiatan",
    }),
    el("div", { className: "flex items-center gap-1.5 mt-2 text-sm text-white/70" }, [
      iconNode("map-pin", 14, "text-yellow shrink-0"),
      el("span", { textContent: inst.address }),
    ]),
  ]);

  container.appendChild(imgWrapper);
  container.appendChild(info);
}

// ==================== Summary ====================
function renderSummary() {
  const grid = document.getElementById("summary-grid");
  if (!grid) return;
  grid.innerHTML = "";

  const stats = [
    {
      label: "Kategori Kegiatan",
      value: getCategoryCount(siteData.categories),
      bg: "bg-yellow",
      linkTo: "#kegiatan",
      icon: "folder",
    },
    {
      label: "Tautan Dokumentasi Aktif",
      value: getActiveUrlCount(siteData.categories),
      bg: "bg-orange",
      linkTo: "#kegiatan",
      icon: "external-link",
    },
    {
      label: "Informasi Pendukung",
      value: getInformationCount(siteData.information),
      bg: "bg-blue-soft",
      linkTo: "#informasi",
      icon: "info",
    },
  ];

  for (const s of stats) {
    grid.appendChild(
      el(
        "a",
        {
          href: s.linkTo || "#",
          className: `relative ${s.bg} border-[3px] border-ink hard-shadow rounded-xl p-5 sm:p-6 overflow-hidden press-effect`,
        },
        [
          el("div", {
            className: "absolute -right-3 -top-3 w-16 h-16 rounded-full border-[3px] border-ink bg-white/40",
            "aria-hidden": "true",
          }),
          el("div", { className: "flex items-start justify-between mb-3" }, [
            el(
              "div",
              {
                className:
                  "w-10 h-10 rounded-md bg-white border-[3px] border-ink flex items-center justify-center hard-shadow-sm",
              },
              [iconNode(s.icon, 20, "text-ink")],
            ),
          ]),
          el("p", {
            className: "text-4xl sm:text-5xl font-display text-ink tabular-nums leading-none",
            textContent: String(s.value),
          }),
          el("p", {
            className: "text-xs sm:text-sm font-bold text-ink mt-2 uppercase tracking-wider",
            textContent: s.label,
          }),
        ],
      ),
    );
  }
}

// ==================== Categories ====================
const openCategories = new Set();
let searchQuery = "";

function renderCategories() {
  const container = document.getElementById("category-list");
  if (!container) return;
  container.innerHTML = "";

  const normalizedQuery = normalizeString(searchQuery);
  let hasAnyVisible = false;
  let totalResults = 0;

  for (const cat of siteData.categories) {
    const catTitleNorm = normalizeString(cat.title);
    const catDescNorm = normalizeString(cat.description || "");
    const catMatches =
      normalizedQuery && (catTitleNorm.includes(normalizedQuery) || catDescNorm.includes(normalizedQuery));

    const matchingItems = normalizedQuery
      ? cat.items.filter((item) => normalizeString(item.title).includes(normalizedQuery))
      : cat.items;

    if (normalizedQuery && !catMatches && matchingItems.length === 0) continue;

    hasAnyVisible = true;
    totalResults += matchingItems.length;

    if (normalizedQuery) openCategories.add(cat.id);

    const isOpen = openCategories.has(cat.id);
    const displayItems = normalizedQuery && !catMatches ? matchingItems : cat.items;
    const activeCount = cat.items.filter((i) => isValidUrl(i.url)).length;
    const accentBg = ACCENT_BG[cat.accent] || "bg-orange";

    const article = el("article", {
      className: "bg-white border-[3px] border-ink hard-shadow rounded-xl overflow-hidden",
      id: `cat-${cat.id}`,
    });

    const chevron = iconNode("chevron-down", 22, "text-ink shrink-0 transition-transform duration-300");
    if (isOpen) chevron.classList.add("rotate-180");

    const btn = el(
      "button",
      {
        type: "button",
        className:
          "w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 text-left cursor-pointer select-none press-effect bg-white",
        "aria-expanded": String(isOpen),
        "aria-controls": `panel-${cat.id}`,
      },
      [
        el(
          "div",
          {
            className: `shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg ${accentBg} border-[3px] border-ink flex items-center justify-center font-display text-2xl sm:text-3xl text-ink hard-shadow-sm`,
          },
          [cat.number],
        ),
        el("div", { className: "flex-1 min-w-0" }, [
          el("h3", { className: "text-base sm:text-lg font-display text-ink leading-snug", textContent: cat.title }),
          el("p", {
            className: "text-xs sm:text-sm text-text-muted mt-1 line-clamp-2 font-medium",
            textContent: cat.description,
          }),
          el("div", { className: "flex items-center gap-2 mt-2 flex-wrap" }, [
            el("span", { className: "sticker bg-paper text-ink text-[10px]" }, [
              iconNode("file-text", 11, "text-ink"),
              `${cat.items.length} DOK`,
            ]),
            el(
              "span",
              { className: `sticker ${activeCount > 0 ? "bg-green" : "bg-gray-muted"} text-ink text-[10px]` },
              [iconNode("circle-dot", 11, "text-ink"), `${activeCount} AKTIF`],
            ),
          ]),
        ]),
        chevron,
      ],
    );

    const panelOuter = el("div", {
      className: "accordion-panel",
      "data-open": String(isOpen),
      id: `panel-${cat.id}`,
      role: "region",
      "aria-labelledby": `cat-${cat.id}`,
    });

    const panelInner = document.createElement("div");
    const list = el("ul", {
      className: "px-3 sm:px-4 pb-4 sm:pb-5 space-y-2.5 border-t-[3px] border-ink pt-4 bg-paper/50",
    });

    if (displayItems.length === 0) {
      list.appendChild(
        el("li", {
          className: "text-sm text-text-muted py-6 text-center font-bold uppercase tracking-wider",
          textContent: "Tidak ada kegiatan yang cocok.",
        }),
      );
    } else {
      for (const item of displayItems) {
        const hasUrl = isValidUrl(item.url);
        let itemEl;

        if (hasUrl) {
          itemEl = el(
            "a",
            {
              href: item.url,
              target: "_blank",
              rel: "noopener noreferrer",
              className:
                "flex items-center gap-3 min-h-[54px] px-3 rounded-lg border-[3px] border-ink bg-white hard-shadow-sm press-effect group",
            },
            [
              el(
                "div",
                {
                  className:
                    "w-9 h-9 rounded-md bg-yellow border-[2.5px] border-ink flex items-center justify-center shrink-0",
                },
                [iconNode(iconForSource(item.source), 16, "text-ink")],
              ),
              el("span", { className: "flex-1 text-sm font-bold text-ink truncate", textContent: item.title }),
              el("div", { className: "w-8 h-8 rounded-md bg-ink flex items-center justify-center shrink-0" }, [
                iconNode("arrow-up-right", 16, "text-yellow"),
              ]),
            ],
          );
        } else {
          itemEl = el(
            "div",
            {
              className:
                "flex items-center gap-3 min-h-[54px] px-3 rounded-lg border-[3px] border-ink/40 bg-gray-muted/40 cursor-default",
            },
            [
              el(
                "div",
                {
                  className:
                    "w-9 h-9 rounded-md bg-gray-muted border-[2.5px] border-ink/30 flex items-center justify-center shrink-0",
                },
                [iconNode(iconForSource(item.source), 16, "text-text-muted/50")],
              ),
              el("div", { className: "flex-1 min-w-0" }, [
                el("span", { className: "block text-sm font-bold text-text-muted truncate", textContent: item.title }),
                el("span", {
                  className: "block text-[10px] text-text-muted/70 font-bold uppercase tracking-wider mt-0.5",
                  textContent: "TAUTAN BELUM TERSEDIA",
                }),
              ]),
            ],
          );
        }
        list.appendChild(el("li", {}, [itemEl]));
      }
    }

    panelInner.appendChild(list);
    panelOuter.appendChild(panelInner);

    btn.addEventListener("click", () => {
      const nowOpen = !openCategories.has(cat.id);
      if (nowOpen) openCategories.add(cat.id);
      else openCategories.delete(cat.id);
      btn.setAttribute("aria-expanded", String(nowOpen));
      panelOuter.setAttribute("data-open", String(nowOpen));
      chevron.classList.toggle("rotate-180", nowOpen);
    });

    article.appendChild(btn);
    article.appendChild(panelOuter);
    container.appendChild(article);
  }

  const emptyMsg = document.getElementById("empty-state");
  if (emptyMsg) emptyMsg.style.display = hasAnyVisible ? "none" : "block";
  updateSearchStatus(hasAnyVisible, totalResults);
  refreshIcons();
}

function updateSearchStatus(hasResults, totalResults) {
  const status = document.getElementById("search-status");
  if (!status) return;

  if (!searchQuery.trim()) {
    status.textContent = "";
    status.className = "text-sm font-bold text-text-muted mt-3 min-h-[1.25rem] uppercase tracking-wider";
    return;
  }

  status.textContent = hasResults
    ? `Menampilkan ${totalResults} hasil untuk "${searchQuery}"`
    : `Tidak ditemukan hasil untuk "${searchQuery}"`;
  status.className = `text-sm font-bold mt-3 min-h-[1.25rem] uppercase tracking-wider ${hasResults ? "text-text-muted" : "text-error"}`;
}

// ==================== Information ====================
function renderInformation() {
  const grid = document.getElementById("info-grid");
  if (!grid) return;
  grid.innerHTML = "";

  const bgColors = ["bg-yellow", "bg-green-soft", "bg-pink"];
  const iconBgs = ["bg-white", "bg-white", "bg-white"];

  for (let i = 0; i < siteData.information.length; i++) {
    const info = siteData.information[i];
    const hasUrl = isValidUrl(info.url);
    const bgClass = bgColors[i % bgColors.length];
    const iconBg = iconBgs[i % iconBgs.length];

    const card = el(
      "div",
      {
        className: `relative ${bgClass} border-[3px] border-ink hard-shadow rounded-xl p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1`,
      },
      [
        el(
          "div",
          {
            className:
              "absolute -top-3 -right-3 w-10 h-10 rounded-full border-[3px] border-ink bg-white flex items-center justify-center",
            "aria-hidden": "true",
          },
          [iconNode("star", 18, "text-orange")],
        ),
        el(
          "div",
          {
            className: `w-24 h-24 rounded-full ${iconBg} border-[3px] border-ink flex items-center justify-center mb-4 hard-shadow-sm`,
          },
          [
            el("img", {
              src: info.image,
              alt: info.title,
              className: "w-16 h-16 object-contain",
              loading: "lazy",
              width: "64",
              height: "64",
            }),
          ],
        ),
        el("h3", { className: "text-lg font-display text-ink mb-2", textContent: info.title }),
        el("p", {
          className: "text-sm text-ink/80 leading-relaxed flex-1 mb-4 font-medium",
          textContent: info.description,
        }),
        hasUrl
          ? el(
              "a",
              {
                href: info.url,
                target: "_blank",
                rel: "noopener noreferrer",
                className:
                  "inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-ink text-white font-bold text-sm border-[3px] border-ink hard-shadow-sm press-effect uppercase tracking-wider",
              },
              ["BUKA LAYANAN", iconNode("arrow-up-right", 16)],
            )
          : el(
              "span",
              {
                className:
                  "inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-ink/60 bg-white/60 border-[2.5px] border-ink/40 rounded-lg w-fit uppercase tracking-wider",
              },
              [iconNode("info", 14), "Belum tersedia"],
            ),
      ],
    );
    grid.appendChild(card);
  }
  refreshIcons();
}

// ==================== Search & Controls ====================
function initSearch() {
  const input = document.getElementById("search-input");
  const clearBtn = document.getElementById("search-clear");
  if (!input) return;

  let debounceTimer;
  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = input.value;
      renderCategories();
      if (clearBtn) clearBtn.style.display = searchQuery ? "flex" : "none";
    }, 200);
  });

  if (clearBtn) {
    clearBtn.style.display = "none";
    clearBtn.addEventListener("click", () => {
      input.value = "";
      searchQuery = "";
      clearBtn.style.display = "none";
      renderCategories();
      input.focus();
    });
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      input.value = "";
      searchQuery = "";
      if (clearBtn) clearBtn.style.display = "none";
      renderCategories();
    }
  });
}

function initExpandCollapseAll() {
  const openAll = document.getElementById("open-all");
  const closeAll = document.getElementById("close-all");

  openAll?.addEventListener("click", () => {
    for (const cat of siteData.categories) openCategories.add(cat.id);
    renderCategories();
  });

  closeAll?.addEventListener("click", () => {
    openCategories.clear();
    renderCategories();
  });
}

// ==================== Footer ====================
function renderFooter() {
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = String(siteData.directoryYear);
  const yearCopyEl = document.getElementById("footer-year-copy");
  if (yearCopyEl) yearCopyEl.textContent = String(siteData.directoryYear);

  const nameEl = document.getElementById("footer-name");
  if (nameEl) nameEl.textContent = siteData.institution.name;
  const addrEl = document.getElementById("footer-address");
  if (addrEl) addrEl.textContent = siteData.institution.address;

  const webLink = document.getElementById("footer-website");
  if (!webLink) return;

  if (isValidUrl(siteData.institution.websiteUrl)) {
    webLink.href = siteData.institution.websiteUrl;
    webLink.target = "_blank";
    webLink.rel = "noopener noreferrer";
    webLink.style.display = "inline-flex";
  } else {
    webLink.style.display = "none";
  }
}

function init() {
  renderHeader();
  renderSummary();
  renderCategories();
  renderInformation();
  initSearch();
  initExpandCollapseAll();
  renderFooter();
  setTimeout(refreshIcons, 0);
}

document.addEventListener("DOMContentLoaded", init);
