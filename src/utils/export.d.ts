interface ExportAsPNGOptions {
  margin?: number;
  qualityLevel?: number;
}

export function exportAsPNG(options: ExportAsPNGOptions): string;
