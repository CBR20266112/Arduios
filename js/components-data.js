/* ==========================================================================
   Component Data Definitions (components-data.js)
   ========================================================================== */

const COMPONENT_DEFINITIONS = [
  {
    id: 'arduino_uno',
    nameKo: '아두이노 UNO',
    nameEn: 'Arduino UNO',
    icon: '🟦',
    width: 140,
    height: 100,
    pins: [
      { id: '5V', label: '5V', xRel: 58, yRel: 86 },
      { id: 'GND', label: 'GND', xRel: 72, yRel: 86 },
      { id: 'D13', label: 'D13', xRel: 116, yRel: 14 },
      { id: 'D12', label: 'D12', xRel: 108, yRel: 14 },
      { id: 'D11', label: 'D11', xRel: 100, yRel: 14 }
    ],
    renderSvg: `
      <svg width="140" height="100" viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="140" height="100" rx="8" fill="#0077B6"/>
        <rect x="8" y="30" width="30" height="40" rx="2" fill="#C0C0C0"/>
        <rect x="45" y="8" width="85" height="12" rx="2" fill="#2B2D42"/>
        <rect x="45" y="80" width="85" height="12" rx="2" fill="#2B2D42"/>
        <text x="70" y="55" fill="white" font-size="14" font-weight="bold" font-family="sans-serif">UNO</text>
        <circle cx="12" cy="12" r="3" fill="#D9D9D9"/>
        <circle cx="128" cy="12" r="3" fill="#D9D9D9"/>
        <circle cx="128" cy="88" r="3" fill="#D9D9D9"/>
        <circle cx="12" cy="88" r="3" fill="#D9D9D9"/>
      </svg>
    `
  },
  {
    id: 'breadboard',
    nameKo: '브레드보드',
    nameEn: 'Breadboard',
    icon: '⬜',
    width: 120,
    height: 140,
    pins: [
      { id: 'plus', label: '+', xRel: 12, yRel: 20 },
      { id: 'minus', label: '-', xRel: 108, yRel: 20 },
      { id: 'row_a_10', label: 'A10', xRel: 30, yRel: 60 },
      { id: 'row_j_10', label: 'J10', xRel: 90, yRel: 60 },
      { id: 'row_a_20', label: 'A20', xRel: 30, yRel: 100 },
      { id: 'row_j_20', label: 'J20', xRel: 90, yRel: 100 }
    ],
    renderSvg: `
      <svg width="120" height="140" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="140" rx="6" fill="#F8F9FA" stroke="#D1D5DB" stroke-width="2"/>
        <line x1="12" y1="10" x2="12" y2="130" stroke="#E63946" stroke-width="2"/>
        <line x1="108" y1="10" x2="108" y2="130" stroke="#0077B6" stroke-width="2"/>
        <g fill="#9CA3AF">
          <circle cx="30" cy="20" r="1.5"/><circle cx="45" cy="20" r="1.5"/><circle cx="60" cy="20" r="1.5"/><circle cx="75" cy="20" r="1.5"/><circle cx="90" cy="20" r="1.5"/>
          <circle cx="30" cy="40" r="1.5"/><circle cx="45" cy="40" r="1.5"/><circle cx="60" cy="40" r="1.5"/><circle cx="75" cy="40" r="1.5"/><circle cx="90" cy="40" r="1.5"/>
          <circle cx="30" cy="60" r="1.5"/><circle cx="45" cy="60" r="1.5"/><circle cx="60" cy="60" r="1.5"/><circle cx="75" cy="60" r="1.5"/><circle cx="90" cy="60" r="1.5"/>
          <circle cx="30" cy="80" r="1.5"/><circle cx="45" cy="80" r="1.5"/><circle cx="60" cy="80" r="1.5"/><circle cx="75" cy="80" r="1.5"/><circle cx="90" cy="80" r="1.5"/>
          <circle cx="30" cy="100" r="1.5"/><circle cx="45" cy="100" r="1.5"/><circle cx="60" cy="100" r="1.5"/><circle cx="75" cy="100" r="1.5"/><circle cx="90" cy="100" r="1.5"/>
        </g>
      </svg>
    `
  },
  {
    id: 'led_red',
    nameKo: 'LED (적색)',
    nameEn: 'LED (Red)',
    icon: '🔴',
    width: 40,
    height: 60,
    pins: [
      { id: 'anode', label: '+', xRel: 16, yRel: 56 },
      { id: 'cathode', label: '-', xRel: 24, yRel: 54 }
    ],
    renderSvg: `
      <svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 20C12 10 28 10 28 20V32H12V20Z" fill="#E63946"/>
        <rect x="10" y="32" width="20" height="4" fill="#B71C1C"/>
        <line x1="16" y1="36" x2="16" y2="58" stroke="#9E9E9E" stroke-width="2"/>
        <line x1="24" y1="36" x2="24" y2="54" stroke="#9E9E9E" stroke-width="2"/>
      </svg>
    `
  },
  {
    id: 'resistor',
    nameKo: '저항 (220Ω)',
    nameEn: 'Resistor (220Ω)',
    icon: '🌰',
    width: 30,
    height: 70,
    pins: [
      { id: 'pin_1', label: '1', xRel: 15, yRel: 5 },
      { id: 'pin_2', label: '2', xRel: 15, yRel: 65 }
    ],
    renderSvg: `
      <svg width="30" height="70" viewBox="0 0 30 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="15" y1="0" x2="15" y2="70" stroke="#9E9E9E" stroke-width="2"/>
        <rect x="8" y="20" width="14" height="30" rx="4" fill="#F5E6CA"/>
        <rect x="8" y="24" width="14" height="3" fill="#E63946"/>
        <rect x="8" y="30" width="14" height="3" fill="#E63946"/>
        <rect x="8" y="36" width="14" height="3" fill="#B71C1C"/>
        <rect x="8" y="42" width="14" height="3" fill="#D4AF37"/>
      </svg>
    `
  },
  {
    id: 'jumper_wire',
    nameKo: '점퍼선',
    nameEn: 'Jumper Wire',
    icon: '🔌',
    width: 50,
    height: 80,
    pins: [
      { id: 'pin_1', label: 'A', xRel: 10, yRel: 10 },
      { id: 'pin_2', label: 'B', xRel: 40, yRel: 10 }
    ],
    renderSvg: `
      <svg width="50" height="80" viewBox="0 0 50 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 10 Q 25 70, 40 10" stroke="#E63946" stroke-width="4" fill="none"/>
        <circle cx="10" cy="10" r="4" fill="#2B2D42"/>
        <circle cx="40" cy="10" r="4" fill="#2B2D42"/>
      </svg>
    `
  },
  {
    id: 'button',
    nameKo: '푸시 버튼',
    nameEn: 'Push Button',
    icon: '🔘',
    width: 50,
    height: 50,
    pins: [
      { id: 'pin_1', label: '1', xRel: 4, yRel: 14 },
      { id: 'pin_2', label: '2', xRel: 46, yRel: 14 }
    ],
    renderSvg: `
      <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="50" height="50" rx="8" fill="#4A5568"/>
        <circle cx="25" cy="25" r="14" fill="#1A202C"/>
        <circle cx="25" cy="25" r="10" fill="#E63946"/>
        <rect x="2" y="10" width="4" height="8" fill="#CBD5E0"/>
        <rect x="2" y="32" width="4" height="8" fill="#CBD5E0"/>
        <rect x="44" y="10" width="4" height="8" fill="#CBD5E0"/>
        <rect x="44" y="32" width="4" height="8" fill="#CBD5E0"/>
      </svg>
    `
  },
  {
    id: 'sensor',
    nameKo: '조도 센서',
    nameEn: 'Light Sensor',
    icon: '☀️',
    width: 40,
    height: 60,
    pins: [
      { id: 'pin_1', label: '1', xRel: 15, yRel: 56 },
      { id: 'pin_2', label: '2', xRel: 25, yRel: 56 }
    ],
    renderSvg: `
      <svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="14" fill="#E53E3E"/>
        <path d="M12 20 Q 20 12, 28 20 Q 20 28, 12 20" stroke="#FFD700" stroke-width="2" fill="none"/>
        <line x1="15" y1="34" x2="15" y2="58" stroke="#9E9E9E" stroke-width="2"/>
        <line x1="25" y1="34" x2="25" y2="58" stroke="#9E9E9E" stroke-width="2"/>
      </svg>
    `
  }
];

window.COMPONENT_DEFINITIONS = COMPONENT_DEFINITIONS;
