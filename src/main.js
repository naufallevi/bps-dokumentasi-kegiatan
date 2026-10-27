import {
  siteData,
  isValidUrl,
  getActiveUrlCount,
  getCategoryCount,
  getInformationCount,
  normalizeString
} from './data.js';

import {
  createIcons,
  Folder, Calendar, ChartNoAxesColumn, MapPin, ExternalLink, FileText,
  Search, X, ChevronDown, Info, Archive, Phone, Building2, ArrowUpRight, Inbox,
  HardDrive, Play, Image as ImageIcon, Globe, Table2
} from 'lucide';

// ==================== Konstanta ====================

const ALL_ICONS = {
  Folder, Calendar, ChartNoAxesColumn, MapPin, ExternalLink, FileText,
  Search, X, ChevronDown, Info, Archive, Phone, Building2, ArrowUpRight, Inbox,
  HardDrive, Play, Image: ImageIcon, Globe, Table2
};

const SOURCE_ICON_MAP = {
  unknown: 'external-link',
  drive: 'hard-drive',
  youtube: 'play',
  photos: 'image',
  pdf: 'file-text',
  web: 'globe',
  image: 'image',
  spreadsheet: 'table-2'
};

// ==================== Helper ====================

function refreshIcons() {
  createIcons({ icons: ALL_ICONS });
}

function iconForSource(source) {
  return SOURCE_ICON_MAP[source] || SOURCE_ICON_MAP.unknown;
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, val] of Object.entries(attrs)) {
    if (key === 'className') node.className = val;
    else if (key === 'textContent') node.textContent = val;
    else if (key === 'innerHTML') node.innerHTML = val;
    else if (key === 'dataset') Object.assign(node.dataset, val);
    else if (
      key.startsWith('aria-') ||
      key.startsWith('data-') ||
      ['role', 'type', 'href', 'target', 'rel', 'id', 'title', 'alt', 'src', 'placeholder', 'disabled', 'loading', 'width', 'height'].includes(key)
    ) {
      node.setAttribute(key, val);
    }
  }
  for (const child of children) {
    if (child == null || child === false) continue;
    if (typeof child === 'string' || typeof child === 'number') node.appendChild(document.createTextNode(String(child)));
    else node.appendChild(child);
  }
  return node;
}

function iconNode(name, size = 20, extraClass = '') {
  const i = document.createElement('i');
  i.setAttribute('data-lucide', name);
  i.className = `inline-block w-${size / 4} h-${size / 4} ${extraClass}`.trim();
  i.setAttribute('aria-hidden', 'true');
  return i;
}

// ==================== Header ====================

function renderHeader() {
  const container = document.getElementById('header-content');
  if (!container) return;

  const inst = siteData.institution;

  const imgWrapper = el('div', { className: 'relative shrink-0' });

  const img = el('img', {
    src: inst.buildingImage,
    alt: `Gedung ${inst.fullName}`,
    className: 'w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-2xl object-cover border border-border shadow-sm',
    loading: 'eager',
    width: '128',
    height: '128'
  });

  const fallback = el('div', {
    className: 'fallback-building hidden w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-2xl bg-orange-soft border border-border items-center justify-center'
  }, [iconNode('building-2', 40, 'text-orange-bps')]);

  img.onerror = () => {
    img.style.display = 'none';
    fallback.style.display = 'flex';
  };

  imgWrapper.appendChild(img);
  imgWrapper.appendChild(fallback);
  imgWrapper.appendChild(el('div', {
    className: 'absolute -bottom-1 -right-1 w-6 h-6 bg-orange-bps rounded-full border-2 border-white'
  }));

  const addressNode = isValidUrl(inst.mapUrl)
    ? el('a', {
        href: inst.mapUrl,
        target: '_blank',
        rel: 'noopener noreferrer',
        className: 'hover:text-orange-bps underline-offset-2 hover:underline transition-colors'
      }, [inst.address])
    : el('span', { textContent: inst.address });

  const info = el('div', { className: 'min-w-0' }, [
    el('p', { className: 'text-xs font-semibold tracking-widest text-orange-bps uppercase mb-1', textContent: 'BADAN PUSAT STATISTIK' }),
    el('h1', { className: 'text-xl sm:text-2xl lg:text-3xl font-bold text-navy leading-tight', textContent: inst.name }),
    el('p', { className: 'text-sm text-text-secondary mt-1', textContent: 'Pusat dokumentasi dan informasi kegiatan' }),
    el('div', { className: 'flex items-center gap-1.5 mt-2 text-sm text-text-secondary' }, [
      iconNode('map-pin', 16, 'text-orange-bps shrink-0'),
      addressNode
    ])
  ]);

  container.appendChild(imgWrapper);
  container.appendChild(info);
}

// ==================== Summary ====================

function renderSummary() {
  const grid = document.getElementById('summary-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const stats = [
    { label: 'Kategori Kegiatan', value: getCategoryCount(siteData.categories) },
    { label: 'Tautan Dokumentasi Aktif', value: getActiveUrlCount(siteData.categories) },
    { label: 'Informasi Pendukung', value: getInformationCount(siteData.information) }
  ];

  for (const s of stats) {
    grid.appendChild(el('div', {
      className: 'bg-surface rounded-xl border border-border p-4 sm:p-5 text-center shadow-sm'
    }, [
      el('p', { className: 'text-2xl sm:text-3xl font-bold text-navy tabular-nums', textContent: String(s.value) }),
      el('p', { className: 'text-xs sm:text-sm text-text-secondary mt-1', textContent: s.label })
    ]));
  }
}

// ==================== Categories ====================

const openCategories = new Set();
let searchQuery = '';

function renderCategories() {
  const container = document.getElementById('category-list');
  if (!container) return;
  container.innerHTML = '';

  const normalizedQuery = normalizeString(searchQuery);
  let hasAnyVisible = false;

  for (const cat of siteData.categories) {
    const catTitleNorm = normalizeString(cat.title);
    const catDescNorm = normalizeString(cat.description || '');
    const catMatches = normalizedQuery && (catTitleNorm.includes(normalizedQuery) || catDescNorm.includes(normalizedQuery));

    const matchingItems = normalizedQuery
      ? cat.items.filter(item => normalizeString(item.title).includes(normalizedQuery))
      : cat.items;

    if (normalizedQuery && !catMatches && matchingItems.length === 0) continue;

    hasAnyVisible = true;

    if (normalizedQuery) openCategories.add(cat.id);

    const isOpen = openCategories.has(cat.id);
    const displayItems = (normalizedQuery && !catMatches) ? matchingItems : cat.items;
    const activeCount = cat.items.filter(i => isValidUrl(i.url)).length;

    const article = el('article', {
      className: 'bg-surface rounded-2xl border border-border shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md',
      id: `cat-${cat.id}`
    });

    // --- Header button ---
    const chevron = iconNode('chevron-down', 20, 'text-text-secondary shrink-0 transition-transform duration-200');
    if (isOpen) chevron.classList.add('rotate-180');

    const btn = el('button', {
      type: 'button',
      className: 'w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 text-left cursor-pointer select-none',
      'aria-expanded': String(isOpen),
      'aria-controls': `panel-${cat.id}`
    }, [
      el('div', {
        className: 'shrink-0 w-10 h-10 rounded-xl bg-orange-soft flex items-center justify-center text-orange-bps'
      }, [iconNode(cat.icon, 20)]),
      el('div', { className: 'flex-1 min-w-0' }, [
        el('h3', { className: 'text-base sm:text-lg font-semibold text-navy leading-snug', textContent: cat.title }),
        el('p', { className: 'text-xs sm:text-sm text-text-secondary mt-0.5 line-clamp-2', textContent: cat.description }),
        el('p', { className: 'text-xs text-text-secondary mt-1.5 flex items-center gap-1' }, [
          iconNode('file-text', 12, 'text-orange-bps'),
          `${cat.items.length} dokumentasi · ${activeCount} tautan aktif`
        ])
      ]),
      chevron
    ]);

    // --- Panel ---
    const panelOuter = el('div', {
      className: 'accordion-panel',
      'data-open': String(isOpen),
      id: `panel-${cat.id}`,
      role: 'region',
      'aria-labelledby': `cat-${cat.id}`
    });

    const panelInner = document.createElement('div');
    const list = el('ul', { className: 'px-4 sm:px-5 pb-4 sm:pb-5 space-y-1.5 border-t border-border pt-3' });

    if (displayItems.length === 0) {
      list.appendChild(el('li', {
        className: 'text-sm text-text-secondary py-4 text-center',
        textContent: 'Tidak ada kegiatan yang cocok.'
      }));
    } else {
      for (const item of displayItems) {
        const hasUrl = isValidUrl(item.url);
        let itemEl;

        if (hasUrl) {
          itemEl = el('a', {
            href: item.url,
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'flex items-center gap-3 min-h-[52px] px-3 rounded-xl border border-transparent hover:border-orange-bps/30 hover:bg-orange-soft/40 transition-colors duration-150 group'
          }, [
            iconNode(iconForSource(item.source), 18, 'text-orange-bps shrink-0'),
            el('span', { className: 'flex-1 text-sm font-medium text-navy group-hover:text-blue-accent truncate', textContent: item.title }),
            iconNode('arrow-up-right', 14, 'text-text-secondary shrink-0 opacity-60 group-hover:opacity-100')
          ]);
        } else {
          itemEl = el('div', {
            className: 'flex items-center gap-3 min-h-[52px] px-3 rounded-xl bg-bg-main/50 cursor-default'
          }, [
            iconNode(iconForSource(item.source), 18, 'text-text-secondary/40 shrink-0'),
            el('div', { className: 'flex-1 min-w-0' }, [
              el('span', { className: 'block text-sm text-text-secondary truncate', textContent: item.title }),
              el('span', { className: 'block text-[11px] text-text-secondary/60 mt-0.5', textContent: 'Tautan belum ditambahkan' })
            ])
          ]);
        }

        list.appendChild(el('li', {}, [itemEl]));
      }
    }

    panelInner.appendChild(list);
    panelOuter.appendChild(panelInner);

    btn.addEventListener('click', () => {
      const nowOpen = !openCategories.has(cat.id);
      if (nowOpen) openCategories.add(cat.id);
      else openCategories.delete(cat.id);

      btn.setAttribute('aria-expanded', String(nowOpen));
      panelOuter.setAttribute('data-open', String(nowOpen));
      chevron.classList.toggle('rotate-180', nowOpen);
    });

    article.appendChild(btn);
    article.appendChild(panelOuter);
    container.appendChild(article);
  }

  const emptyMsg = document.getElementById('empty-state');
  if (emptyMsg) emptyMsg.style.display = hasAnyVisible ? 'none' : 'block';

  updateSearchStatus(hasAnyVisible);
  refreshIcons();
}

function updateSearchStatus(hasResults) {
  const status = document.getElementById('search-status');
  if (!status) return;

  if (!searchQuery.trim()) {
    status.textContent = '';
    status.className = 'text-sm text-text-secondary mt-3 min-h-[1.25rem]';
    return;
  }

  status.textContent = hasResults
    ? `Menampilkan hasil untuk "${searchQuery}"`
    : `Tidak ditemukan hasil untuk "${searchQuery}"`;
  status.className = `text-sm mt-3 min-h-[1.25rem] ${hasResults ? 'text-text-secondary' : 'text-orange-bps font-medium'}`;
}

// ==================== Information ====================

function renderInformation() {
  const grid = document.getElementById('info-grid');
  if (!grid) return;
  grid.innerHTML = '';

  for (const info of siteData.information) {
    const hasUrl = isValidUrl(info.url);
    
    // Container Card
    const card = el('div', {
      className: 'bg-surface rounded-[2rem] border-2 border-orange-bps/30 p-6 pt-8 shadow-sm hover:border-orange-bps hover:shadow-lg transition-all flex flex-col items-center text-center group'
    }, [
      // Render Gambar Ilustrasi
      el('div', {
        className: 'w-28 h-28 mb-5 flex items-center justify-center transition-transform duration-300 group-hover:scale-105'
      }, [
        el('img', {
          src: info.image,
          alt: info.title,
          className: 'w-full h-full object-contain',
          loading: 'lazy',
          width: '112',
          height: '112'
        })
      ]),
      
      el('h3', { className: 'text-xl font-bold text-navy mb-2', textContent: info.title }),
      el('p', { className: 'text-sm text-text-secondary leading-relaxed flex-1 mb-4', textContent: info.description }),
      
      hasUrl
        ? el('a', {
            href: info.url,
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-bps text-white text-sm font-semibold hover:bg-orange-600 transition-colors'
          }, ['Buka Layanan', iconNode('arrow-up-right', 16)])
        : el('span', {
            className: 'inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-text-secondary bg-bg-main rounded-xl'
          }, [iconNode('info', 14), 'Belum tersedia'])
    ]);

    grid.appendChild(card);
  }

  refreshIcons();
}

// ==================== Search & Controls ====================

function initSearch() {
  const input = document.getElementById('search-input');
  const clearBtn = document.getElementById('search-clear');
  if (!input) return;

  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = input.value;
      renderCategories();
      if (clearBtn) clearBtn.style.display = searchQuery ? 'flex' : 'none';
    }, 200);
  });

  if (clearBtn) {
    clearBtn.style.display = 'none';
    clearBtn.addEventListener('click', () => {
      input.value = '';
      searchQuery = '';
      clearBtn.style.display = 'none';
      renderCategories();
      input.focus();
    });
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      input.value = '';
      searchQuery = '';
      if (clearBtn) clearBtn.style.display = 'none';
      renderCategories();
    }
  });
}

function initExpandCollapseAll() {
  const openAll = document.getElementById('open-all');
  const closeAll = document.getElementById('close-all');

  openAll?.addEventListener('click', () => {
    for (const cat of siteData.categories) openCategories.add(cat.id);
    renderCategories();
  });

  closeAll?.addEventListener('click', () => {
    openCategories.clear();
    renderCategories();
  });
}

// ==================== Footer ====================

function renderFooter() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const nameEl = document.getElementById('footer-name');
  if (nameEl) nameEl.textContent = siteData.institution.fullName;

  const addrEl = document.getElementById('footer-address');
  if (addrEl) addrEl.textContent = siteData.institution.address;

  const webLink = document.getElementById('footer-website');
  if (!webLink) return;

  if (isValidUrl(siteData.institution.websiteUrl)) {
    webLink.href = siteData.institution.websiteUrl;
    webLink.target = '_blank';
    webLink.rel = 'noopener noreferrer';
    webLink.style.display = 'inline-flex';
  } else {
    webLink.style.display = 'none';
  }
}

// ==================== Init ====================

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

document.addEventListener('DOMContentLoaded', init);