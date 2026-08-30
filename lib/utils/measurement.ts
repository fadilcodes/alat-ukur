// Measurement calculation helpers for Vernier Caliper & Micrometer

/**
 * Vernier Caliper:
 * Main scale pitch: 1 mm per main line
 * Vernier scale: 20 divisions = 0.05 mm precision
 * Max value: 150.00 mm
 */
export function calculateVernierReading(sliderX: number, maxSliderXPixels: number = 1000, maxMm: number = 150): {
  totalMm: number;
  mainScaleMm: number;
  vernierScaleMm: number;
  displayValue: string;
} {
  const clampedX = Math.max(0, Math.min(sliderX, maxSliderXPixels));
  const rawMm = (clampedX / maxSliderXPixels) * maxMm;
  
  // Snap to 0.05 mm precision
  const snappedMm = Math.round(rawMm / 0.05) * 0.05;
  const mainScaleMm = Math.floor(snappedMm);
  const vernierScaleMm = Math.round((snappedMm - mainScaleMm) * 100) / 100;
  
  return {
    totalMm: Number(snappedMm.toFixed(2)),
    mainScaleMm,
    vernierScaleMm,
    displayValue: `${snappedMm.toFixed(2)} mm`,
  };
}

/**
 * Micrometer:
 * Sleeve main scale: 1 mm increments top, 0.5 mm increments bottom
 * Thimble scale: 50 divisions = 0.01 mm per division (0.50 mm per full 360 deg turn)
 * Max value: 25.00 mm
 */
export function calculateMicrometerReading(thimbleX: number, maxThimbleXPixels: number = 800, maxMm: number = 25): {
  totalMm: number;
  sleeveMainMm: number;
  sleeveHalfMm: number;
  thimbleValueMm: number;
  thimbleDivision: number;
  displayValue: string;
} {
  const clampedX = Math.max(0, Math.min(thimbleX, maxThimbleXPixels));
  const rawMm = (clampedX / maxThimbleXPixels) * maxMm;
  
  // Snap to 0.01 mm precision
  const snappedMm = Math.round(rawMm / 0.01) * 0.01;
  
  const sleeveMainMm = Math.floor(snappedMm);
  const hasHalfMm = (snappedMm - sleeveMainMm) >= 0.5;
  const sleeveHalfMm = hasHalfMm ? 0.5 : 0;
  
  const remainder = snappedMm - (sleeveMainMm + sleeveHalfMm);
  const thimbleDivision = Math.round(remainder / 0.01) % 50;
  const thimbleValueMm = Math.round(thimbleDivision * 0.01 * 100) / 100;

  return {
    totalMm: Number(snappedMm.toFixed(2)),
    sleeveMainMm,
    sleeveHalfMm,
    thimbleValueMm,
    thimbleDivision,
    displayValue: `${snappedMm.toFixed(2)} mm`,
  };
}
