import jsPDF from "jspdf";

export const imagesToPDF = async (images: string[]): Promise<Uint8Array> => {
    return new Promise((resolve) => {
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        let loadedImages = 0;

        images.forEach((imgSrc, index) => {
            const img = new Image();
            img.src = imgSrc;
            img.onload = () => {
                if (index > 0) {
                    pdf.addPage();
                }

                const ratio = img.width / img.height;
                const width = pageWidth;
                const height = width / ratio;

                let y = 0;
                if (height < pageHeight) {
                    y = (pageHeight - height) / 2;
                }

                pdf.addImage(img, "JPEG", 0, y, width, height);

                loadedImages++;
                if (loadedImages === images.length) {
                    const buffer = pdf.output("arraybuffer");
                    resolve(new Uint8Array(buffer));
                }
            };
        });
    });
};

export const downloadPDF = (bytes: Uint8Array, filename: string) => {
    const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
