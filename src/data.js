const urlData = {
  serabi: "https://drive.google.com/drive/folders/1WrcsIYGsyGA2-xiJaqq2ON6tnC7-9664",
  sayHello: "https://drive.google.com/drive/folders/1a7Msg9s0ev-z6DQy922KM-MfNl5ZPTOL",
  santen: "https://drive.google.com/drive/folders/18YFwkjB9JV1wj11LO1fNzm3xX4CHNgqS",
  martabak: "https://drive.google.com/drive/folders/1MZJwhosbuIjkwkjq8lKglnvAN3yA4sfQ",
  jumatRb: "https://drive.google.com/drive/folders/1OS0EJlQYQKSQLwwg31EV5NZO9Fjdq2w5",
  rapatDinas: "https://drive.google.com/drive/folders/1uWam58U1Q8iSJ-ggm853YVeX048YXHMN",
  sensusSurvei: "https://drive.google.com/drive/folders/13DiTn354iAztdGyRsqiNZkDfpNvfVa3a",
};

export const siteData = {
  institution: {
    name: "BPS Kota Pekalongan",
    label: "Badan Pusat Statistik",
    address: "Jalan Singosari, Kota Pekalongan",
    websiteUrl: "https://pekalongankota.bps.go.id/id",
    mapUrl: "https://maps.app.goo.gl/kvs2njdwZxedm7ph7",
    buildingImage: "/assets/bps-kota-pekalongan.webp",
    logoImage: "/assets/logo-bps.svg",
  },

  directoryYear: new Date().getFullYear(),

  categories: [
    {
      id: "reformasi-birokrasi",
      number: "01",
      title: "Kegiatan Reformasi Birokrasi (RB/Zl)",
      description: "Dokumentasi kegiatan reformasi birokrasi dan aktivitas internal terkait.",
      accent: "orange",
      items: [
        { id: "serbagi-apel-pagi", title: "Serbagi/Apel Pagi", url: urlData.serabi, source: "drive" },
        { id: "say-hello", title: "Say Hello", url: urlData.sayHello, source: "drive" },
        { id: "santen", title: "Santen", url: urlData.santen, source: "drive" },
        { id: "martabak", title: "Martabak", url: urlData.martabak, source: "drive" },
        { id: "jumat-rb", title: "Jumat RB", url: urlData.jumatRb, source: "drive" },
      ],
    },
    {
      id: "rapat-dinas",
      number: "02",
      title: "Kegiatan Rapat Dinas",
      description: "Arsip rapat, koordinasi, dan kegiatan kedinasan.",
      accent: "blue",
      items: [{ id: "rapat-dinas", title: "Rapat Dinas", url: urlData.rapatDinas, source: "drive" }],
    },
    {
      id: "sensus-survei",
      number: "03",
      title: "Kegiatan Sensus/Survei",
      description: "Dokumentasi pelaksanaan kegiatan sensus dan survei statistik.",
      accent: "yellow",
      items: [{ id: "sensus-survei", title: "Sensus/Survei", url: urlData.sensusSurvei, source: "drive" }],
    },
  ],

  information: [
    {
      id: "kelengkapan-dokumen",
      title: "Kelengkapan Dokumen",
      description: "Akses dokumentasi dan kelengkapan arsip digital kegiatan.",
      image: "/assets/kelengkapan-dokumen.webp",
      url: "",
    },
    {
      id: "agenda-kegiatan",
      title: "Agenda Kegiatan",
      description: "Informasi jadwal dan agenda kegiatan.",
      image: "/assets/jadwal.webp",
      url: "",
    },
    {
      id: "kontak-bantuan",
      title: "Kontak dan Bantuan",
      description: "Informasi kontak dan layanan bantuan.",
      image: "/assets/contact-person.webp",
      url: "",
    },
  ],
};

// ==================== Validation & Utility ====================

export function isValidUrl(url) {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    return ["https:", "http:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function getCategoryCount(categories) {
  return categories.length;
}

export function getInformationCount(info) {
  return info.length;
}

export function getDocumentationCount(categories) {
  return categories.reduce((sum, cat) => sum + cat.items.length, 0);
}

export function getActiveUrlCount(categories) {
  let count = 0;
  for (const cat of categories) {
    for (const item of cat.items) {
      if (isValidUrl(item.url)) count++;
    }
  }
  return count;
}

export function normalizeString(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
