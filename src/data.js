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
    fullName: "Badan Pusat Statistik Kota Pekalongan",
    address: "Jalan Singosari, Kota Pekalongan",
    websiteUrl: "https://pekalongankota.bps.go.id/id",
    mapUrl: "https://maps.app.goo.gl/kvs2njdwZxedm7ph7",
    buildingImage: "/assets/bps-kota-pekalongan.webp",
    logoImage: "/assets/logo-bps.svg",
  },

  categories: [
    {
      id: "reformasi-birokrasi",
      title: "Kegiatan Reformasi Birokrasi (RB/Zl)",
      description: "Dokumentasi kegiatan reformasi birokrasi.",
      icon: "folder",
      link: {},
      items: [
        { id: "serabi-apel-pagi", title: "Serabi/Apel Pagi", url: urlData.serabi, source: "drive" },
        { id: "say-hello", title: "Say Hello", url: urlData.sayHello, source: "drive" },
        { id: "santen", title: "Santen", url: urlData.santen, source: "drive" },
        { id: "martabak", title: "Martabak", url: urlData.martabak, source: "drive" },
        { id: "jumat-rb", title: "Jumat RB", url: urlData.jumatRb, source: "drive" },
      ],
    },
    {
      id: "rapat-dinas",
      title: "Kegiatan Rapat Dinas",
      description: "Dokumentasi rapat dan koordinasi kedinasan.",
      icon: "calendar",
      items: [{ id: "rapat-dinas", title: "Rapat Dinas", url: urlData.rapatDinas, source: "drive" }],
    },
    {
      id: "sensus-survei",
      title: "Kegiatan Sensus/Survei",
      description: "Dokumentasi pelaksanaan sensus dan survei.",
      icon: "chart-no-axes-column",
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

export function getActiveUrlCount(categories) {
  let count = 0;
  for (const cat of categories) {
    for (const item of cat.items) {
      if (isValidUrl(item.url)) count++;
    }
  }
  return count;
}

export function getCategoryCount(categories) {
  return categories.length;
}

export function getInformationCount(info) {
  return info.length;
}

export function getActiveInfoUrlCount(info) {
  return info.filter((i) => isValidUrl(i.url)).length;
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
