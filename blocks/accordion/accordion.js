/*
 * Accordion Block
 * Recreate an accordion
 * https://www.hlx.live/developer/block-collection/accordion
 */

import { readBlockConfig } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const config = readBlockConfig(block);

  // remove config rows (style/open) if present
  [...block.children].forEach((row) => {
    const keyCell = row.children && row.children[0];
    const key = keyCell ? keyCell.textContent.trim().toLowerCase() : '';
    if (key === 'style' || key === 'open') {
      row.remove();
    }
  });

  const detailsEls = [];
  [...block.children].forEach((row) => {
    if (!row.children || row.children.length < 2) return;
    // decorate accordion item label
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);
    // decorate accordion item body
    const body = row.children[1];
    body.className = 'accordion-item-body';
    // decorate accordion item
    const details = document.createElement('details');
    details.className = 'accordion-item';
    moveInstrumentation(row, details);
    details.append(summary, body);
    detailsEls.push(details);
    row.replaceWith(details);
  });

  // behavior: open-first or open index
  const openIndex = Number.parseInt(config.open, 10);
  if (Number.isInteger(openIndex) && openIndex > 0 && openIndex <= detailsEls.length) {
    detailsEls[openIndex - 1].setAttribute('open', '');
  } else if (config.style && `${config.style}`.includes('open-first') && detailsEls[0]) {
    detailsEls[0].setAttribute('open', '');
  }
}
