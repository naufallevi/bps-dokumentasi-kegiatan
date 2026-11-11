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
  ArrowLeft,
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
  ArrowLeft,
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
      className: "bg-white border-[3px] border-ink hard-shadow rounded-xl press-effect overflow-hidden",
      id: `cat-${cat.id}`,
    });

    const chevron = iconNode("chevron-down", 22, "text-ink shrink-0 transition-transform duration-300");
    if (isOpen) chevron.classList.add("rotate-180");

    const btn = el(
      "button",
      {
        type: "button",
        className:
          "w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 text-left cursor-pointer select-none press-effect-no-shadow shadow-none bg-white",
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
                "flex items-center gap-3 min-h-[54px] px-3 rounded-lg border-[3px] border-ink bg-white hard-shadow-sm press-effect-sm group",
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
  const grid = document.getElementById("info-flex");
  if (!grid) return;
  grid.innerHTML = "";

  const bgColors = ["bg-yellow", "bg-green-soft", "bg-pink", "bg-orange"];
  const iconBgs = ["bg-white", "bg-white", "bg-white", "bg-white"];

  for (let i = 0; i < siteData.information.length; i++) {
    const info = siteData.information[i];
    const isInternalPage = info.url === "/cara-teknik-dokumentasi";
    const hasUrl = isValidUrl(info.url) || isInternalPage;
    const bgClass = bgColors[i % bgColors.length];
    const iconBg = iconBgs[i % iconBgs.length];

    const card = el(
      "div",
      {
        className: `relative ${bgClass} border-[3px] border-ink hard-shadow rounded-xl p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1 w-full md:flex-[0_1_calc((100%-3rem)/3)]`,
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
                ...(isInternalPage ? {} : { target: "_blank", rel: "noopener noreferrer" }),
                className:
                  "inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-ink text-white font-bold text-sm border-[3px] border-ink hard-shadow-sm press-effect-sm uppercase tracking-wider",
              },
              [isInternalPage ? "BACA PANDUAN" : "BUKA LAYANAN", iconNode("arrow-up-right", 16)],
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

// ==================== Cara Teknik Dokumentasi Page ====================
function renderDocumentationGuide() {
  const content = `
    <div class="bg-ink text-yellow border-b-[3px] border-ink overflow-hidden py-1.5">
      <div class="marquee-track gap-8 text-xs font-bold uppercase tracking-widest">
        <span>★ PORTAL DOKUMENTASI DIGITAL</span>
        <span>★ BPS KOTA PEKALONGAN</span>
        <span>★ PANDUAN DOKUMENTASI KEGIATAN</span>
        <span>★ PORTAL DOKUMENTASI DIGITAL</span>
        <span>★ BPS KOTA PEKALONGAN</span>
      </div>
    </div>

    <header class="bg-navy border-b-[3px] border-ink">
      <div class="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex items-center gap-4">
        <img src="/assets/logo-bps.svg" alt="Logo BPS" class="w-14 h-14 object-contain bg-white rounded-lg border-[3px] border-ink p-1">
        <div>
          <p class="text-xs font-bold text-yellow uppercase tracking-widest mb-1">Badan Pusat Statistik</p>
          <h1 class="text-xl sm:text-2xl font-display text-white">BPS Kota Pekalongan</h1>
          <p class="text-sm text-white/80 mt-1">Pusat Dokumentasi dan Informasi Kegiatan</p>
        </div>
      </div>
    </header>

    <main class="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <a href="/" class="inline-flex items-center gap-2 bg-white border-[3px] border-ink rounded-lg px-4 py-2.5 font-bold text-sm hard-shadow-sm press-effect mb-8">
        <i data-lucide="arrow-left" class="w-4 h-4"></i>
        KEMBALI KE BERANDA
      </a>

      <section class="bg-orange border-[3px] border-ink hard-shadow rounded-xl p-6 sm:p-10 mb-10">
        <span class="sticker bg-yellow text-ink mb-4">PANDUAN MAGANG</span>
        <h2 class="text-3xl sm:text-5xl font-display leading-tight text-ink">CARA & TEKNIK DOKUMENTASI</h2>
        <p class="text-base sm:text-lg font-bold text-ink/80 mt-4">Panduan dokumentasi kegiatan BPS Kota Pekalongan</p>
        <img src="/assets/cara-teknik-dokumentasi.webp" alt="Infografis cara dan teknik dokumentasi" class="w-full max-h-[150px] object-contain bg-white border-[3px] border-ink rounded-lg mt-7 p-2">
      </section>

      <section class="bg-white border-[3px] border-ink hard-shadow rounded-xl p-6 sm:p-9">
      
        <figure class="mb-8">
          <button
            type="button"
            id="guide-image-preview"
            class="block w-full cursor-zoom-in group"
            aria-label="Perbesar infografis dokumentasi"
          >
            <img
              src="/assets/panduan-dokumentasi.jpg"
              alt="Tata Cara Dokumentasi Acara BPS Kota Pekalongan"
              class="mx-auto w-full h-auto rounded-xl border-[3px] border-ink transition-transform duration-200 group-hover:scale-[1.01] md:w-[35%]"
              loading="lazy"
            />
          </button>

          <figcaption class="text-center text-xs sm:text-sm text-text-muted font-medium mt-3">
            🔍 Klik gambar untuk memperbesar dan mengunduh
          </figcaption>
        </figure>

        <p class="text-base sm:text-lg leading-relaxed font-medium mb-6">
          Selamat pagi, teman-teman Magang BPS Kota Pekalongan. 😊
        </p>
        <p class="leading-relaxed text-text-muted mb-7">
          Untuk mendukung publikasi dan arsip kegiatan kantor, mohon setiap kegiatan didokumentasikan dengan lengkap dan rapi sesuai panduan pada infografis terlampir.
        </p>

        <h3 class="text-xl sm:text-2xl font-display mb-4">HAL YANG PERLU DIPERHATIKAN SAAT DOKUMENTASI ACARA</h3>
        <div class="space-y-4 mb-8">
          <article class="bg-yellow/40 border-[2.5px] border-ink rounded-lg p-4 sm:p-5">
            <div class="flex gap-3 items-start">
              <span class="text-2xl">📸</span>
              <div>
                <h4 class="font-bold mb-2">Ambil foto dari beberapa sudut</h4>
                <p class="text-sm text-text-muted">Ambil dokumentasi dari bagian depan, belakang, sisi kanan, dan sisi kiri agar suasana kegiatan tergambarkan secara menyeluruh.</p>
              </div>
            </div>
          </article>

          <article class="bg-blue-soft/30 border-[2.5px] border-ink rounded-lg p-4 sm:p-5">
            <div class="flex gap-3 items-start">
              <span class="text-2xl">📸</span>
              <div class="flex-1">
                <h4 class="font-bold mb-3">Dokumentasikan seluruh rangkaian kegiatan</h4>
                <ul class="list-disc pl-5 space-y-2 text-sm text-text-muted">
                  <li>Pembukaan acara.</li>
                  <li>Koordinator/MC menyampaikan prakata.</li>
                  <li>Arahan dari pimpinan.</li>
                  <li>Pemateri saat menyampaikan materi.</li>
                  <li>Peserta selama mengikuti kegiatan.</li>
                  <li>Sesi diskusi atau tanya jawab.</li>
                  <li>Penyerahan cinderamata/sertifikat (jika ada).</li>
                  <li>Foto bersama di akhir kegiatan.</li>
                </ul>
              </div>
            </div>
          </article>

          <article class="bg-green-soft/30 border-[2.5px] border-ink rounded-lg p-4 sm:p-5">
            <div class="flex gap-3 items-start">
              <span class="text-2xl">📸</span>
              <div class="flex-1">
                <h4 class="font-bold mb-3">Ambil juga foto pendukung</h4>
                <ul class="list-disc pl-5 space-y-2 text-sm text-text-muted">
                  <li>Banner/backdrop kegiatan.</li>
                  <li>Peralatan atau perlengkapan kegiatan.</li>
                  <li>Close up peserta yang sedang aktif berdiskusi atau menyimak materi.</li>
                </ul>
              </div>
            </div>
          </article>
        </div>

        <h3 class="text-xl sm:text-2xl font-display mb-4">PASTIKAN HASIL FOTO</h3>
        <ul class="space-y-3 mb-8">
          <li class="flex gap-3 items-start"><span class="text-xl">✅</span><span class="font-medium">Tidak blur dan pencahayaan cukup.</span></li>
          <li class="flex gap-3 items-start"><span class="text-xl">✅</span><span class="font-medium">Objek utama terlihat jelas.</span></li>
          <li class="flex gap-3 items-start"><span class="text-xl">✅</span><span class="font-medium">Komposisi rapi dan tidak terhalang.</span></li>
          <li class="flex gap-3 items-start"><span class="text-xl">✅</span><span class="font-medium">Menampilkan suasana kegiatan secara keseluruhan.</span></li>
        </ul>

        <div class="bg-paper border-[3px] border-ink rounded-lg p-5 sm:p-6">
          <h3 class="text-lg sm:text-xl font-display mb-3">SETELAH KEGIATAN SELESAI</h3>
          <p class="text-sm sm:text-base leading-relaxed text-text-muted">
            Setelah kegiatan selesai, mohon segera pilih foto-foto terbaik dan unggah ke folder dokumentasi yang telah disediakan dengan nama file yang rapi agar memudahkan proses publikasi dan pengarsipan.
          </p>
        </div>

        <p class="leading-relaxed font-medium mt-8">
          Terima kasih atas kerja samanya. Semoga dokumentasi yang dihasilkan semakin baik, lengkap, dan bermanfaat sebagai arsip maupun bahan publikasi BPS Kota Pekalongan. 🙏
        </p>
      </section>
    </main>

    <footer class="bg-navy-dark text-white border-t-[3px] border-ink">
      <div class="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p class="font-display">BPS KOTA PEKALONGAN</p>
        <p class="text-xs text-white/60 mt-2">PORTAL DOKUMENTASI DIGITAL • DATA • DOKUMENTASI • INFORMASI</p>
      </div>
    </footer>
  `;

  document.body.innerHTML = content;
  document.title = "Cara & Teknik Dokumentasi — BPS Kota Pekalongan";
  const description = document.querySelector('meta[name="description"]');
  if (description)
    description.setAttribute("content", "Panduan dokumentasi kegiatan untuk Magang BPS Kota Pekalongan.");

  const previewButton = document.getElementById("guide-image-preview");

  previewButton?.addEventListener("click", () => {
    const imageUrl = "/assets/panduan-dokumentasi.jpg";

    const lightbox = document.createElement("div");

    lightbox.className = "fixed inset-0 z-[100] bg-black/90 p-4 sm:p-8 flex flex-col items-center justify-center";

    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Pratinjau infografis");

    lightbox.innerHTML = `
    <div class="w-full max-w-6xl flex items-center justify-between gap-3 mb-4">
      <p class="text-white font-bold text-sm sm:text-base">
        Tata Cara Dokumentasi
      </p>

      <button
        type="button"
        id="lightbox-close"
        class="bg-white text-ink rounded-lg px-4 py-2 font-bold"
      >
        ✕ TUTUP
      </button>
    </div>

    <div class="flex-1 min-h-0 w-full flex items-center justify-center overflow-auto">
      <img
        src="${imageUrl}"
        alt="Infografis Tata Cara Dokumentasi"
        class="max-w-full max-h-full object-contain rounded-lg"
      />
    </div>

    <a
      href="${imageUrl}"
      download="Tata-Cara-Dokumentasi-BPS-Kota-Pekalongan.jpg"
      class="mt-5 bg-yellow text-ink border-[3px] border-ink rounded-lg px-6 py-3 font-bold"
    >
      ⬇ DOWNLOAD GAMBAR
    </a>
  `;

    const handleEscape = (event) => {
      if (event.key === "Escape") closeLightbox();
    };

    const closeLightbox = () => {
      lightbox.remove();
      document.removeEventListener("keydown", handleEscape);
    };

    lightbox.querySelector("#lightbox-close").addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", handleEscape);

    document.body.appendChild(lightbox);
    lightbox.querySelector("#lightbox-close").focus();
  });

  refreshIcons();
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
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
  if (currentPath === "/cara-teknik-dokumentasi") {
    renderDocumentationGuide();
    return;
  }

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
