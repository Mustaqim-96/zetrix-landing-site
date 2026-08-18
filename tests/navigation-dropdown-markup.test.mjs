import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const navMarkup = html.match(/<nav class="nav"[\s\S]*?<\/nav>/)?.[0] ?? '';

const groups = {
  developers: [
    ['#BUIDL With Zetrix', 'Start building on the Zetrix network.', 'code-2', 'https://www.zetrix.com/buidl-zetrix/'],
    ['Bug Bounty Programme', 'Help strengthen Zetrix and earn rewards.', 'bug', 'https://www.zetrix.com/bug-bounty-programme/']
  ],
  individuals: [
    ['Zetrix Wallet', 'Manage assets and access the Zetrix ecosystem.', 'wallet-cards', 'https://www.zetrix.com/zetrix-wallet/']
  ],
  ecosystem: [
    ['Zetrix Ecosystem', 'Explore applications and partners built on Zetrix.', 'blocks', 'https://www.zetrix.com/zetrix-ecosystems/'],
    ['Zetrix Robotics', 'Discover intelligent automation solutions.', 'bot', 'https://www.zetrix.com/robotics/'],
    ['Zetrix Avatar', 'Explore Zetrix-powered digital identity experiences.', 'scan-face', 'https://www.zetrix.com/zetrix-avatar/'],
    ['AI', 'Discover the ASEAN–China AI Lab.', 'brain-circuit', 'https://www.zetrix.com/asean-china-ai-lab/'],
    ['Accelerator', 'Grow Web3 ideas with global support.', 'rocket', 'https://www.zetrix.com/global-accelerator-programme/'],
    ['Use Case: Voting', 'See blockchain-powered transparent voting.', 'vote', 'https://www.zetrix.com/miss-universe-voting/']
  ],
  tools: [
    ['Block Explorer', 'Inspect blocks, transactions, and accounts.', 'search-code', 'https://explorer.zetrix.com/'],
    ['Node Monitor', 'Monitor Zetrix network node performance.', 'activity', 'https://ds.zetrix.com/'],
    ['Smart Contract', 'Build and deploy smart contracts.', 'file-code-2', 'https://ide.zetrix.com/']
  ],
  discover: [
    ['About Zetrix', 'Learn about the Zetrix public blockchain.', 'badge-info', 'https://www.zetrix.com/about-zetrix/'],
    ['Media and community', 'Connect with Zetrix news and communities.', 'users-round', 'https://www.zetrix.com/media-and-community/'],
    ['Blog', 'Read insights, updates, and announcements.', 'newspaper', 'https://www.zetrix.com/blog/'],
    ['Careers', 'Build the future of trust with Zetrix.', 'briefcase-business', 'https://www.zetrix.com/jobs/']
  ],
  investors: [
    ['Investor Relations', 'Access the investor information centre.', 'landmark', 'https://www.zetrix.com/investor-relations/'],
    ['Corporate Information', 'Review company and leadership information.', 'building-2', 'https://www.zetrix.com/investor-relations/corporate-information/'],
    ['Financials', 'View financial results and disclosures.', 'chart-no-axes-combined', 'https://www.zetrix.com/investor-relations/financials/'],
    ['Stock Information', 'Review current stock-related information.', 'chart-candlestick', 'https://www.zetrix.com/investor-relations/stock-info/'],
    ['Corporate Governance', 'Explore governance policies and practices.', 'scale', 'https://www.zetrix.com/investor-relations/governance/'],
    ['General Meetings', 'Find notices and meeting materials.', 'users-round', 'https://www.zetrix.com/investor-relations/general-meetings/'],
    ['News', 'Read the latest investor news.', 'newspaper', 'https://www.zetrix.com/investor-relations/news/'],
    ['Reports & Presentations', 'Access reports and presentation materials.', 'presentation', 'https://www.zetrix.com/investor-relations/reports-presentations/'],
    ['News Alerts', 'Subscribe to investor news alerts.', 'bell-ring', 'https://www.zetrix.com/investor-relations/news-alerts/']
  ]
};

const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const encodeText = value => value.replaceAll('&', '&amp;');

test('primary navigation exposes six controlled categories and mobile controls', () => {
  assert.match(html, /<nav class="nav"[^>]*data-nav[^>]*aria-label="Primary"/);
  assert.match(html, /data-nav-panel[^>]*id="nav-dropdown"/);
  assert.match(html, /data-nav-mobile-toggle[^>]*aria-controls="nav-dropdown"[^>]*aria-expanded="false"/);
  assert.match(html, /data-nav-backdrop[^>]*hidden/);
  assert.doesNotMatch(navMarkup, /data-nav-backdrop/, 'the dimmer must sit behind, not inside, the translucent navbar');
  assert.match(html, /<header class="nav-wrap">\s*<button class="nav__backdrop"[^>]*data-nav-backdrop[^>]*hidden[^>]*>\s*<\/button>\s*<nav class="nav"/s);
  assert.match(html, /<noscript>[\s\S]*\.nav-dropdown[\s\S]*visibility:\s*visible\s*!important/s);

  for (const key of Object.keys(groups)) {
    assert.match(html, new RegExp(`data-nav-trigger="${key}"[^>]*aria-controls="nav-group-${key}"[^>]*aria-expanded="false"`));
    assert.match(html, new RegExp(`id="nav-group-${key}"[^>]*data-nav-group="${key}"`));
    assert.match(html, new RegExp(`data-nav-accordion-trigger="${key}"[^>]*aria-controls="nav-group-${key}-content"`));
  }
});

test('every approved Zetrix destination and description is present once', () => {
  for (const entries of Object.values(groups)) {
    for (const [title, description, icon, href] of entries) {
      assert.equal((html.match(new RegExp(`href="${escapeRegExp(href)}"`, 'g')) || []).length, 1, href);
      assert.match(html, new RegExp(`class="nav-card__title">${escapeRegExp(encodeText(title))}<`));
      assert.match(html, new RegExp(`class="nav-card__desc">${escapeRegExp(description)}<`));
      assert.match(html, new RegExp(`assets/icons/lucide/${icon}\\.svg`));
    }
  }
});

test('Lucide icons are local decorative SVGs with the pinned license', () => {
  const icons = new Set(Object.values(groups).flat().map(entry => entry[2]));
  for (const icon of icons) {
    const url = new URL(`../assets/icons/lucide/${icon}.svg`, import.meta.url);
    assert.ok(existsSync(url), `${icon}.svg is missing`);
    assert.match(readFileSync(url, 'utf8'), /<svg\b/);
  }
  assert.match(readFileSync(new URL('../assets/icons/lucide/LICENSE', import.meta.url), 'utf8'), /ISC License/);
  assert.doesNotMatch(html, /unpkg\.com|cdn\.jsdelivr\.net|lucide\.createIcons/);
});

test('navigation release uses cache-safe CSS and controller URLs', () => {
  assert.match(html, /css\/styles\.css\?v=87/);
  assert.match(html, /js\/nav-dropdown\.js\?v=2/);
});
