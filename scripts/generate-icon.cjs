const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // SVG content from src/components/icons/CrabCademyIcon.vue
    // Excluding the <script> and template tags, just the <svg> content
    const svgContent = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 160 128"
    style="width: 100%; height: 100%;"
  >
    <defs>
      <linearGradient id="cc-shell" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f97316" />
        <stop offset="100%" stop-color="#dc2626" />
      </linearGradient>
      <linearGradient id="cc-claw" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fb923c" />
        <stop offset="100%" stop-color="#ea580c" />
      </linearGradient>
      <linearGradient id="cc-board" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#166534" />
        <stop offset="100%" stop-color="#14532d" />
      </linearGradient>
    </defs>

    <!-- Chalkboard frame -->
    <rect x="4" y="8" width="100" height="68" rx="3" fill="#78350f" stroke="#92400e" stroke-width="2" />
    <!-- Chalkboard surface -->
    <rect x="10" y="14" width="88" height="56" rx="1.5" fill="url(#cc-board)" />
    <!-- Board shine -->
    <rect x="10" y="14" width="88" height="28" rx="1.5" fill="#22c55e" opacity="0.08" />

    <!-- Chalk writing on board -->
    <text x="18" y="32" font-family="serif" font-size="10" fill="#e2e8f0" opacity="0.9">fn main() {</text>
    <text x="24" y="44" font-family="serif" font-size="9" fill="#fbbf24" opacity="0.85">println!("🦀");</text>
    <text x="18" y="56" font-family="serif" font-size="10" fill="#e2e8f0" opacity="0.9">}</text>

    <!-- Chalk tray -->
    <rect x="8" y="76" width="92" height="5" rx="1" fill="#92400e" stroke="#78350f" stroke-width="0.8" />
    <!-- Chalk pieces -->
    <rect x="16" y="76.5" width="14" height="3.5" rx="1.5" fill="#f1f5f9" opacity="0.9" />
    <rect x="34" y="76.5" width="10" height="3.5" rx="1.5" fill="#fbbf24" opacity="0.85" />
    <rect x="48" y="76.5" width="8" height="3.5" rx="1.5" fill="#fb7185" opacity="0.8" />

    <!-- === CRAB PROFESSOR === -->

    <!-- Legs -->
    <path d="M128 88 Q138 92 148 98" stroke="#ea580c" stroke-width="3" stroke-linecap="round" fill="none" />
    <path d="M126 94 Q136 100 144 108" stroke="#ea580c" stroke-width="3" stroke-linecap="round" fill="none" />
    <path d="M126 99 Q134 106 140 116" stroke="#ea580c" stroke-width="3" stroke-linecap="round" fill="none" />
    <path d="M112 88 Q102 92 94 98" stroke="#ea580c" stroke-width="3" stroke-linecap="round" fill="none" />
    <path d="M114 94 Q106 100 100 108" stroke="#ea580c" stroke-width="3" stroke-linecap="round" fill="none" />
    <path d="M114 99 Q108 106 104 116" stroke="#ea580c" stroke-width="3" stroke-linecap="round" fill="none" />

    <!-- Left claw arm (pointing at board, connects below eye stalks) -->
    <path d="M110 76 Q102 70 94 62 Q90 58 94 56 Q98 54 100 58 Q104 64 110 70 Z"
          fill="url(#cc-claw)" stroke="#c2410c" stroke-width="1" />
    <!-- Left pincer — big cartoonish open claw -->
    <path d="M94 62 Q86 52 78 44 Q74 40 76 36 Q78 34 82 38 Q88 46 94 56 Z"
          fill="url(#cc-claw)" stroke="#c2410c" stroke-width="1" />
    <path d="M94 62 Q84 60 76 56 Q72 54 74 50 Q76 48 80 52 Q86 56 94 60 Z"
          fill="url(#cc-claw)" stroke="#c2410c" stroke-width="1" />

    <!-- Right claw arm (holding chalk, connects below eye stalks) -->
    <path d="M132 76 Q140 68 146 58 Q148 54 146 52 Q144 50 142 54 Q138 62 132 70 Z"
          fill="url(#cc-claw)" stroke="#c2410c" stroke-width="1" />
    <!-- Right pincer — big cartoonish gripping claw -->
    <path d="M146 58 Q150 48 154 40 Q156 36 154 34 Q152 33 150 36 Q146 44 144 52 Z"
          fill="url(#cc-claw)" stroke="#c2410c" stroke-width="1" />
    <path d="M146 58 Q152 52 156 44 Q158 40 156 38 Q154 37 152 40 Q148 48 146 54 Z"
          fill="url(#cc-claw)" stroke="#c2410c" stroke-width="1" />
    <!-- Chalk in claw -->
    <rect x="148" y="30" width="14" height="4" rx="2" fill="#f1f5f9" transform="rotate(-30, 155, 32)" stroke="#cbd5e1" stroke-width="0.6" />

    <!-- Body / shell -->
    <ellipse cx="120" cy="86" rx="22" ry="18" fill="url(#cc-shell)" stroke="#c2410c" stroke-width="1.5" />
    <ellipse cx="116" cy="81" rx="11" ry="8" fill="#fb923c" opacity="0.3" />

    <!-- Shell segments -->
    <path d="M120 68 L120 104" stroke="#c2410c" stroke-width="0.8" opacity="0.3" />
    <path d="M106 73 Q120 86 134 73" stroke="#c2410c" stroke-width="0.8" opacity="0.25" fill="none" />

    <!-- Eye stalks -->
    <path d="M112 72 Q110 62 108 58" stroke="#ea580c" stroke-width="2.5" stroke-linecap="round" fill="none" />
    <path d="M130 72 Q132 62 134 58" stroke="#ea580c" stroke-width="2.5" stroke-linecap="round" fill="none" />

    <!-- Eyes (looking toward board) -->
    <circle cx="107" cy="56" r="5" fill="#fef3c7" stroke="#c2410c" stroke-width="1.2" />
    <circle cx="135" cy="56" r="5" fill="#fef3c7" stroke="#c2410c" stroke-width="1.2" />
    <circle cx="105.5" cy="55.5" r="2.5" fill="#1c1917" />
    <circle cx="133.5" cy="55.5" r="2.5" fill="#1c1917" />
    <circle cx="105" cy="54.5" r="0.8" fill="white" />
    <circle cx="133" cy="54.5" r="0.8" fill="white" />

    <!-- Mouth -->
    <path d="M116 94 Q120 98 124 94" stroke="#991b1b" stroke-width="1.5" stroke-linecap="round" fill="none" />
  </svg>
  `;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; padding: 0; background: transparent; display: flex; justify-content: center; align-items: center; height: 100vh; width: 100vw; }
        #icon-container { width: 1024px; height: 1024px; display: flex; justify-content: center; align-items: center; }
      </style>
    </head>
    <body>
      <div id="icon-container">
        ${svgContent}
      </div>
    </body>
    </html>
  `;

    await page.setContent(html);
    const element = await page.$('#icon-container');

    // Save directly to the current directory where we will run tauri icon command
    await element.screenshot({ path: 'app-icon.png', omitBackground: true });

    await browser.close();
    console.log('Icon generated: app-icon.png');
})();
