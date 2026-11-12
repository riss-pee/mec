/**
 * Utility to convert numbers to their English word representations.
 * Supports up to billions/trillions.
 */

const ONES = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
];

const TENS = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];

const SCALES = [
  '', 'thousand', 'million', 'billion', 'trillion'
];

function helper(num: number): string {
  if (num === 0) return '';
  
  if (num < 20) {
    return ONES[num] + ' ';
  } else if (num < 100) {
    const tensValue = Math.floor(num / 10);
    const onesValue = num % 10;
    return TENS[tensValue] + (onesValue !== 0 ? '-' + ONES[onesValue] : '') + ' ';
  } else {
    const hundredsValue = Math.floor(num / 100);
    const remainder = num % 100;
    return ONES[hundredsValue] + ' hundred ' + (remainder !== 0 ? 'and ' + helper(remainder) : '');
  }
}

export function numberToWords(num: number): string {
  if (num === 0) return 'zero';

  let tempNum = num;
  let wordResult = '';
  let scaleIndex = 0;

  while (tempNum > 0) {
    const chunk = tempNum % 1000;
    if (chunk !== 0) {
      const chunkWords = helper(chunk);
      const scaleLabel = SCALES[scaleIndex];
      wordResult = chunkWords + (scaleLabel ? scaleLabel + ' ' : '') + wordResult;
    }
    tempNum = Math.floor(tempNum / 1000);
    scaleIndex++;
  }

  return wordResult.trim();
}
