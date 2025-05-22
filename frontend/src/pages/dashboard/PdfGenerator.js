import { jsPDF } from 'jspdf';

// Compute statistical summary for numerical columns
export const computeDataSummary = (fullData, columns) => {
  if (!fullData || fullData.length === 0 || !columns) return {};

  const summary = {};
  columns.forEach(column => {
    const values = fullData
      .map(row => parseFloat(row[column]))
      .filter(val => !isNaN(val));

    if (values.length > 0) {
      const count = values.length;
      const mean = values.reduce((sum, val) => sum + val, 0) / count;
      const min = Math.min(...values);
      const max = Math.max(...values);
      summary[column] = { count, mean: mean.toFixed(2), min, max };
    }
  });
  return summary;
};

// Function to capture chart as base64 image
const captureChartAsBase64 = (chartId, chartRefs) => {
  const chartInstance = chartRefs.current[chartId];
  if (chartInstance && chartInstance.canvas) {
    const canvas = chartInstance.canvas;
    const renderedWidth = canvas.offsetWidth;
    const renderedHeight = canvas.offsetHeight;
    const pixelRatio = window.devicePixelRatio || 1;
    const padding = 40;
    const downloadWidth = (renderedWidth + padding * 2) * pixelRatio;
    const downloadHeight = (renderedHeight + padding * 2) * pixelRatio;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = downloadWidth;
    tempCanvas.height = downloadHeight;
    const tempCtx = tempCanvas.getContext('2d');

    tempCtx.scale(pixelRatio, pixelRatio);
    tempCtx.fillStyle = '#ffffff';
    tempCtx.fillRect(0, 0, downloadWidth / pixelRatio, downloadHeight / pixelRatio);
    tempCtx.drawImage(canvas, padding, padding, renderedWidth, renderedHeight);

    return tempCanvas.toDataURL('image/png');
  }
  return null;
};

// Generate PDF content using jsPDF
export const generatePDFContent = (project, dataPreview, charts, dataSummary, chartRefs) => {
  const doc = new jsPDF('p', 'pt', 'a4');
  let yPosition = 40;

  // Colors and styles to match the page
  const gray900 = '#1F2937'; // text-gray-900
  const gray700 = '#374151'; // text-gray-700
  const gray500 = '#6B7280'; // text-gray-500
  const indigo50 = '#EEF2FF'; // from-indigo-50
  const indigo100 = '#E0E7FF'; // to-indigo-100
  const borderGray100 = '#F3F4F6'; // border-gray-100

  // Set font to mimic page style (Inter-like font, using Helvetica as a fallback)
  doc.setFont('Helvetica');

  // Title
  doc.setFontSize(24);
  doc.setTextColor(gray900);
  doc.text(project?.name || 'Project Summary', 40, yPosition);
  yPosition += 30;

  // Date
  doc.setFontSize(12);
  doc.setTextColor(gray500);
  doc.text(
    new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    40,
    yPosition
  );
  yPosition += 40;

  // Section: Project Details
  doc.setFontSize(16);
  doc.setTextColor(gray900);
  doc.text('Project Details', 40, yPosition);
  yPosition += 20;

  doc.setFontSize(12);
  doc.setTextColor(gray700);
  doc.text(`Project Title: ${project?.name || 'N/A'}`, 40, yPosition);
  yPosition += 15;
  doc.text(`File Name: ${project?.file?.originalName || 'N/A'}`, 40, yPosition);
  yPosition += 30;

  // Section: Data Preview (First 5 Rows)
  doc.setFontSize(16);
  doc.setTextColor(gray900);
  doc.text('Data Preview (First 5 Rows)', 40, yPosition);
  yPosition += 20;

  if (dataPreview.length > 0 && project?.file?.columns) {
    const columns = project.file.columns;
    const tableData = dataPreview.map(row => columns.map(col => row[col]?.toString() || ''));

    // Table header
    doc.setFillColor(indigo50);
    doc.setDrawColor(borderGray100);
    doc.setLineWidth(1);
    doc.rect(40, yPosition - 5, 515, 20, 'F');
    doc.setFontSize(12);
    doc.setTextColor(gray700);
    columns.forEach((col, index) => {
      doc.text(col, 45 + index * (515 / columns.length), yPosition + 5);
    });
    yPosition += 20;

    // Table rows
    tableData.forEach((row, rowIndex) => {
      const fillColor = rowIndex % 2 === 0 ? '#FFFFFF' : '#F9FAFB'; // Mimic hover:bg-indigo-50
      doc.setFillColor(fillColor);
      doc.rect(40, yPosition - 5, 515, 20, 'F');
      doc.setDrawColor(borderGray100);
      doc.line(40, yPosition + 15, 555, yPosition + 15); // Bottom border
      doc.setTextColor(gray700);
      row.forEach((cell, colIndex) => {
        doc.text(cell, 45 + colIndex * (515 / columns.length), yPosition + 5);
      });
      yPosition += 20;
    });

    yPosition += 20;
  } else {
    doc.setFontSize(12);
    doc.setTextColor(gray500);
    doc.text('No data available to preview.', 40, yPosition);
    yPosition += 20;
  }

  // Section: Charts
  doc.setFontSize(16);
  doc.setTextColor(gray900);
  doc.text('Charts', 40, yPosition);
  yPosition += 20;

  if (charts.length === 0) {
    doc.setFontSize(12);
    doc.setTextColor(gray500);
    doc.text('No charts available in this project.', 40, yPosition);
    yPosition += 20;
  } else {
    charts.forEach((chart, index) => {
      // Check if a new page is needed
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 40;
      }

      // Chart title
      doc.setFontSize(14);
      doc.setTextColor(gray900);
      doc.text(`Chart ${index + 1}: ${chart.title || `${chart.type} Chart`}`, 40, yPosition);
      yPosition += 15;

      // Chart details
      doc.setFontSize(12);
      doc.setTextColor(gray700);
      doc.text(`Type: ${chart.type}`, 40, yPosition);
      yPosition += 15;

      if (chart.type === 'pie') {
        doc.text(`Data Column: ${chart.dataColumn || 'N/A'}`, 40, yPosition);
        yPosition += 15;
      } else {
        doc.text(`X-Axis: ${chart.xAxis || 'N/A'}`, 40, yPosition);
        yPosition += 15;
        doc.text(`Y-Axis: ${chart.yAxis || 'N/A'}`, 40, yPosition);
        yPosition += 15;
        if (chart.type.includes('3d')) {
          doc.text(`Z-Axis: ${chart.zAxis || 'N/A'}`, 40, yPosition);
          yPosition += 15;
        }
      }

      // Embed chart image (only for 2D charts)
      if (!chart.type.includes('3d')) {
        const chartImage = captureChartAsBase64(chart._id, chartRefs);
        if (chartImage) {
          try {
            // Check if a new page is needed for the image
            if (yPosition + 300 > 800) {
              doc.addPage();
              yPosition = 40;
            }

            // Add the chart image (scaled to fit within page width)
            const imgProps = doc.getImageProperties(chartImage);
            const maxWidth = 515; // Page width minus margins
            const maxHeight = 300;
            const imgWidth = Math.min(imgProps.width, maxWidth);
            const imgHeight = (imgWidth / imgProps.width) * imgProps.height;
            const finalHeight = Math.min(imgHeight, maxHeight);

            doc.addImage(chartImage, 'PNG', 40, yPosition, imgWidth, finalHeight);
            yPosition += finalHeight + 20;
          } catch (error) {
            console.error('Failed to add chart image to PDF:', error);
            doc.setFontSize(12);
            doc.setTextColor(gray500);
            doc.text('Unable to load chart image.', 40, yPosition);
            yPosition += 20;
          }
        } else {
          doc.setFontSize(12);
          doc.setTextColor(gray500);
          doc.text('Chart image not available.', 40, yPosition);
          yPosition += 20;
        }
      } else {
        doc.setFontSize(12);
        doc.setTextColor(gray500);
        doc.text('3D charts cannot be displayed in the PDF.', 40, yPosition);
        yPosition += 20;
      }

      yPosition += 10;
    });
  }

  // Section: Data Summary
  if (yPosition > 700) {
    doc.addPage();
    yPosition = 40;
  }

  doc.setFontSize(16);
  doc.setTextColor(gray900);
  doc.text('Data Summary', 40, yPosition);
  yPosition += 20;

  if (Object.keys(dataSummary).length === 0) {
    doc.setFontSize(12);
    doc.setTextColor(gray500);
    doc.text('No numerical data available for summary.', 40, yPosition);
    yPosition += 20;
  } else {
    Object.entries(dataSummary).forEach(([column, stats]) => {
      if (yPosition > 750) {
        doc.addPage();
        yPosition = 40;
      }

      doc.setFontSize(12);
      doc.setTextColor(gray900);
      doc.text(`${column}:`, 40, yPosition);
      yPosition += 15;

      doc.setTextColor(gray700);
      doc.text(`- Count: ${stats.count}`, 50, yPosition);
      yPosition += 15;
      doc.text(`- Mean: ${stats.mean}`, 50, yPosition);
      yPosition += 15;
      doc.text(`- Min: ${stats.min}`, 50, yPosition);
      yPosition += 15;
      doc.text(`- Max: ${stats.max}`, 50, yPosition);
      yPosition += 15;
    });
  }

  return doc;
};