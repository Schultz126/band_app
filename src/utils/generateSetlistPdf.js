import jsPDF from "jspdf";
import logoUrl from "../assets/NoTonesLogo.jpeg";

// jsPDF's addImage needs actual image data (a data URL, in this case), not
// just a URL string — this fetches the bundled asset and converts it once.
const loadImageAsDataUrl = (url) =>
  fetch(url)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        }),
    );

// Pulled from the band logo: black background, cream/parchment lettering.
const BRAND_BLACK = "#000000";
const BRAND_CREAM = "#efe8d8";

// Builds a setlist PDF branded to match the No Tones logo — a black header
// band with the logo in the top-left corner — and returns it as a File,
// ready to be shared (via the Web Share API) or downloaded directly.
export const generateSetlistPdf = async (ensaio, songs) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 14;

  // --- Header band ---
  const headerHeight = 32;
  doc.setFillColor(BRAND_BLACK);
  doc.rect(0, 0, pageWidth, headerHeight, "F");

  // Logo in the top-left corner. The logo's own background is already
  // black, so it blends straight into the header band with no visible edge.
  const logoSize = 22;
  try {
    const logoDataUrl = await loadImageAsDataUrl(logoUrl);
    doc.addImage(logoDataUrl, "JPEG", marginX, 5, logoSize, logoSize);
  } catch (error) {
    console.error("Failed to load logo for PDF:", error);
  }

  // Header text, to the right of the logo
  const textX = marginX + logoSize + 8;
  doc.setTextColor(BRAND_CREAM);
  doc.setFontSize(20);
  doc.setFont(undefined, "bold");

  const formattedDate = new Date(ensaio.date).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });

  doc.text(`${formattedDate}`, textX, 17);

  // --- Body ---
  doc.setTextColor(0, 0, 0);
  let y = headerHeight + 14;

  songs.forEach((song, index) => {
    // Start a new page if we're close to the bottom margin
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text(`${index + 1}. ${song.name}`, marginX, y);
    y += 6;

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(
      `${song.artist}  •  Tom: ${song.tune}  •  BPM: ${song.bpm}${song.pedal ? `  •  Pedal: ${song.pedal}` : ""}`,
      marginX + 4,
      y,
    );
    y += 8;

    if (song.obs) {
      doc.text(`Obs: ${song.obs}`, marginX + 4, y);
      y += 8;
    }
  });

  const dateSuffix = ensaio?.date ? `-${ensaio.date.slice(0, 10)}` : "";
  const fileName = `set-list-ensaio${dateSuffix}.pdf`;
  const blob = doc.output("blob");

  return new File([blob], fileName, { type: "application/pdf" });
};
