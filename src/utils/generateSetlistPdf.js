import jsPDF from "jspdf";

// Builds a simple one-page(ish) PDF listing the rehearsal's songs and
// returns it as a File, ready to be shared (via the Web Share API) or
// downloaded directly.
export const generateSetlistPdf = (ensaio, songs) => {
  const doc = new jsPDF();
  const marginX = 14;
  let y = 20;

  doc.setFontSize(16);
  doc.setFont(undefined, "bold");
  doc.text("No Tones — Set List do Ensaio", marginX, y);
  y += 8;

  if (ensaio?.date) {
    const formattedDate = new Date(ensaio.date).toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
    doc.text(`Data: ${formattedDate}`, marginX, y);
    y += 8;
  }

  y += 4;

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
      `${song.artist}  •  Tom: ${song.tune}  •  BPM: ${song.bpm}`,
      marginX + 4,
      y,
    );
    y += 8;
  });

  const dateSuffix = ensaio?.date ? `-${ensaio.date.slice(0, 10)}` : "";
  const fileName = `set-list-ensaio${dateSuffix}.pdf`;
  const blob = doc.output("blob");

  return new File([blob], fileName, { type: "application/pdf" });
};
