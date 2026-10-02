// International Morse Code Table
const MORSE_MAP = {
  'A': '.-',    'B': '-...',  'C': '-.-.',  'D': '-..',
  'E': '.',     'F': '..-.',  'G': '--.',   'H': '....',
  'I': '..',    'J': '.---',  'K': '-.-',   'L': '.-..',
  'M': '--',    'N': '-.',    'O': '---',   'P': '.--.',
  'Q': '--.-',  'R': '.-.',   'S': '...',   'T': '-',
  'U': '..-',   'V': '...-',  'W': '.--',   'X': '-..-',
  'Y': '-.--',  'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.',
  '!': '-.-.--', '/': '-..-.',  '(': '-.--.',  ')': '-.--.-',
  '&': '.-...',  ':': '---...', ';': '-.-.-.', '=': '-...-',
  '+': '.-.-.',  '-': '-....-', '_': '..--.-', '"': '.-..-.',
  '$': '...-..-', '@': '.--.-.'
};

const REVERSE_MORSE_MAP = Object.entries(MORSE_MAP).reduce((acc, [char, code]) => {
  acc[code] = char;
  return acc;
}, {});

// Vietnamese Telex Mapping for Telegraphy
const VIETNAMESE_TELEX_MAP = {
  'à': 'af', 'á': 'as', 'ả': 'ar', 'ã': 'ax', 'ạ': 'aj',
  'ă': 'aw', 'ằ': 'awf', 'ắ': 'aws', 'ẳ': 'awr', 'ẵ': 'awx', 'ặ': 'awj',
  'â': 'aa', 'ầ': 'aaf', 'ấ': 'aas', 'ẩ': 'aar', 'ẫ': 'aax', 'ậ': 'aaj',
  'đ': 'dd',
  'è': 'ef', 'é': 'es', 'ẻ': 'er', 'ẽ': 'ex', 'ẹ': 'ej',
  'ê': 'ee', 'ề': 'eef', 'ế': 'ees', 'ể': 'eer', 'ễ': 'eex', 'ệ': 'eej',
  'ì': 'if', 'í': 'is', 'ỉ': 'ir', 'ĩ': 'ix', 'ị': 'ij',
  'ò': 'of', 'ó': 'os', 'ỏ': 'or', 'õ': 'ox', 'ọ': 'oj',
  'ô': 'oo', 'ồ': 'oof', 'ố': 'oos', 'ổ': 'oor', 'ỗ': 'oox', 'ộ': 'ooj',
  'ơ': 'ow', 'ờ': 'owf', 'ớ': 'ows', 'ở': 'owr', 'ỡ': 'owx', 'ợ': 'owj',
  'ù': 'uf', 'ú': 'us', 'ủ': 'ur', 'ũ': 'ux', 'ụ': 'uj',
  'ư': 'uw', 'ừ': 'uwf', 'ứ': 'uws', 'ử': 'uwr', 'ữ': 'uwx', 'ự': 'uwj',
  'ỳ': 'yf', 'ý': 'ys', 'ỷ': 'yr', 'ỹ': 'yx', 'ỵ': 'yj'
};

function vietnameseToTelex(text) {
  let result = '';
  for (const char of text) {
    const lower = char.toLowerCase();
    if (VIETNAMESE_TELEX_MAP[lower]) {
      const telex = VIETNAMESE_TELEX_MAP[lower];
      result += (char === char.toUpperCase()) ? telex.toUpperCase() : telex;
    } else {
      result += char;
    }
  }
  return result;
}

function stripVietnameseAccents(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

function textToMorse(text, mode = 'telex') {
  if (!text || !text.trim()) return '';
  const processed = (mode === 'strip') 
    ? stripVietnameseAccents(text)
    : vietnameseToTelex(text);
  
  const words = processed.trim().split(/\s+/);
  return words.map(word => {
    return word.split('').map(ch => {
      const upper = ch.toUpperCase();
      return MORSE_MAP[upper] || ch;
    }).join(' ');
  }).join(' / ');
}

function morseToText(morse) {
  if (!morse || !morse.trim()) return '';
  const words = morse.trim().split(/\s*\/\s*|\s{3,}/);
  return words.map(word => {
    const letters = word.trim().split(/\s+/);
    return letters.map(code => REVERSE_MORSE_MAP[code] || code).join('');
  }).join(' ');
}

function textToBinary(text) {
  if (!text) return '';
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  return Array.from(bytes)
    .map(b => b.toString(2).padStart(8, '0'))
    .join(' ');
}

function binaryToText(binaryStr) {
  const clean = binaryStr.trim().replace(/[^01]/g, '');
  if (!clean || clean.length % 8 !== 0) {
    if (clean.length > 0 && clean.length % 8 !== 0) {
      throw new Error('Bit count must be a multiple of 8');
    }
    return '';
  }
  const bytes = [];
  for (let i = 0; i < clean.length; i += 8) {
    bytes.push(parseInt(clean.slice(i, i + 8), 2));
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

function textToBase64(text) {
  if (!text) return '';
  const bytes = new TextEncoder().encode(text);
  const binString = Array.from(bytes, (b) => String.fromCodePoint(b)).join('');
  return btoa(binString);
}

function base64ToText(b64) {
  const clean = b64.trim();
  if (!clean) return '';
  const binString = atob(clean);
  const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0));
  return new TextDecoder().decode(bytes);
}

function textToHex(text) {
  if (!text) return '';
  const bytes = new TextEncoder().encode(text);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0').toUpperCase())
    .join(' ');
}

function hexToText(hexStr) {
  const clean = hexStr.trim().replace(/0x/gi, '').replace(/[^0-9a-fA-F]/g, '');
  if (!clean || clean.length % 2 !== 0) {
    if (clean.length > 0 && clean.length % 2 !== 0) {
      throw new Error('Hex string must have an even number of characters');
    }
    return '';
  }
  const bytes = [];
  for (let i = 0; i < clean.length; i += 2) {
    bytes.push(parseInt(clean.slice(i, i + 2), 16));
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

// ==========================================
// Custom Alien Enchantment Table Cipher
// (Invented Non-Standard Astral Translation)
// ==========================================
const ALIEN_CHAR_MAP = {
  // Latin Alphabet (Original cosmic mapping)
  'A': '⍜',  'B': 'ᒲ',  'C': '⌰',  'D': '⊐',
  'E': 'ᓭ',  'F': '⍙',  'G': '⨅',  'H': '⍑',
  'I': '⋮',  'J': 'ᔦ',  'K': '⌖',  'L': '⊏',
  'M': '⍝',  'N': '⟍',  'O': 'ᗝ',  'P': 'ᖱ',
  'Q': '⎓',  'R': '∷',  'S': 'ᓵ',  'T': 'ℸ',
  'U': '⚍',  'V': '⍊',  'W': '∴',  'X': 'ꖌ',
  'Y': 'ꖎ',  'Z': 'ʖ',

  // Ancient Galactic Numerals (0-9)
  '0': '⍿',  '1': 'ᔑ',  '2': 'ᒷ',  '3': 'ᑑ',  '4': '⊣',
  '5': 'ᔓ',  '6': 'ᔥ',  '7': 'ꖌ',  '8': '⌏',  '9': '⌑',

  // Mystical Celestial Punctuation
  '.': '✦',  ',': '፥',  '!': '᠅',  '?': '⍰',
  ':': '⁝',  ';': '፤',  '-': '╌',  '_': '‗',
  '+': '⍭',  '=': '⩵',  '/': '⟋',  '(': '⦕',
  ')': '⦖',  '[': '⟦',  ']': '⟧'
};

// Vietnamese Astral Tone & Diacritic Harmonization
const ALIEN_VIETNAMESE_VOWELS = {
  'à': '⍜ᐠ', 'á': '⍜ᐟ', 'ả': '⍜ᐝ', 'ã': '⍜ᐞ', 'ạ': '⍜⬝',
  'ă': '⍜˘', 'ằ': '⍜˘ᐠ', 'ắ': '⍜˘ᐟ', 'ẳ': '⍜˘ᐝ', 'ẵ': '⍜˘ᐞ', 'ặ': '⍜˘⬝',
  'â': '⍜ˆ', 'ầ': '⍜ˆᐠ', 'ấ': '⍜ˆᐟ', 'ẩ': '⍜ˆᐝ', 'ẫ': '⍜ˆᐞ', 'ậ': '⍜ˆ⬝',
  'đ': '⊐ᐟ',
  'è': 'ᓭᐠ', 'é': 'ᓭᐟ', 'ẻ': 'ᓭᐝ', 'ẽ': 'ᓭᐞ', 'ẹ': 'ᓭ⬝',
  'ê': 'ᓭˆ', 'ề': 'ᓭˆᐠ', 'ế': 'ᓭˆᐟ', 'ể': 'ᓭˆᐝ', 'ễ': 'ᓭˆᐞ', 'ệ': 'ᓭˆ⬝',
  'ì': '⋮ᐠ', 'í': '⋮ᐟ', 'ỉ': '⋮ᐝ', 'ĩ': '⋮ᐞ', 'ị': '⋮⬝',
  'ò': 'ᗝᐠ', 'ó': 'ᗝᐟ', 'ỏ': 'ᗝᐝ', 'õ': 'ᗝᐞ', 'ọ': 'ᗝ⬝',
  'ô': 'ᗝˆ', 'ồ': 'ᗝˆᐠ', 'ố': 'ᗝˆᐟ', 'ổ': 'ᗝˆᐝ', 'ỗ': 'ᗝˆᐞ', 'ộ': 'ᗝˆ⬝',
  'ơ': 'ᗝˇ', 'ờ': 'ᗝˇᐠ', 'ớ': 'ᗝˇᐟ', 'ở': 'ᗝˇᐝ', 'ỡ': 'ᗝˇᐞ', 'ợ': 'ᗝˇ⬝',
  'ù': '⚍ᐠ', 'ú': '⚍ᐟ', 'ủ': '⚍ᐝ', 'ũ': '⚍ᐞ', 'ụ': '⚍⬝',
  'ư': '⚍ˇ', 'ừ': '⚍ˇᐠ', 'ứ': '⚍ˇᐟ', 'ử': '⚍ˇᐝ', 'ữ': '⚍ˇᐞ', 'ự': '⚍ˇ⬝',
  'ỳ': 'ꖎᐠ', 'ý': 'ꖎᐟ', 'ỷ': 'ꖎᐝ', 'ỹ': 'ꖎᐞ', 'ỵ': 'ꖎ⬝'
};

// Build reverse dictionary sorted by token length descending
const REVERSE_ALIEN_MAP = (() => {
  const map = new Map();
  for (const [char, rune] of Object.entries(ALIEN_VIETNAMESE_VOWELS)) {
    map.set(rune, char.toUpperCase());
  }
  for (const [char, rune] of Object.entries(ALIEN_CHAR_MAP)) {
    map.set(rune, char);
  }
  return Array.from(map.entries()).sort((a, b) => b[0].length - a[0].length);
})();

function textToAlien(text) {
  if (!text) return '';
  const lines = text.split('\n');
  return lines.map(line => {
    if (!line.trim()) return '';
    const words = line.trim().split(/\s+/);
    return words.map(word => {
      let alienWord = '';
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const lower = char.toLowerCase();
        const upper = char.toUpperCase();

        if (ALIEN_VIETNAMESE_VOWELS[lower]) {
          alienWord += ALIEN_VIETNAMESE_VOWELS[lower];
        } else if (ALIEN_CHAR_MAP[upper]) {
          alienWord += ALIEN_CHAR_MAP[upper];
        } else {
          alienWord += char;
        }
      }
      return alienWord;
    }).join(' • ');
  }).join('\n');
}

function alienToText(alienStr) {
  if (!alienStr) return '';
  const lines = alienStr.split('\n');
  return lines.map(line => {
    let normalized = line.replace(/\s*•\s*/g, ' ');
    for (const [rune, char] of REVERSE_ALIEN_MAP) {
      normalized = normalized.replaceAll(rune, char);
    }
    return normalized;
  }).join('\n');
}

function telexToVietnamese(text) {
  const sortedPairs = Object.entries(VIETNAMESE_TELEX_MAP).sort((a, b) => b[1].length - a[1].length);
  let res = text.toLowerCase();
  for (const [char, telex] of sortedPairs) {
    res = res.replaceAll(telex, char);
  }
  return res.toUpperCase();
}

// Auto-detect format and decode
function autoDetectAndDecode(rawInput) {
  const input = rawInput.trim();
  if (!input) {
    return { typeName: 'Waiting for input...', result: '' };
  }

  // 1. Alien (Enchantment) Language detection
  const ALIEN_RUNE_REGEX = /[⍜ᒲ⌰⊐ᓭ⍙⨅⍑⋮ᔦ⌖⊏⍝⟍ᗝᖱ⎓∷ᓵℸ⚍⍊∴ꖌꖎʖ⍿ᔑᒷᑑ⊣ᔓᔥ⌏⌑•]/;
  if (ALIEN_RUNE_REGEX.test(input)) {
    try {
      const decoded = alienToText(input);
      if (decoded && decoded.trim().length > 0) {
        return { typeName: 'Alien (Enchantment)', result: decoded };
      }
    } catch (e) {
      return { typeName: 'Alien (Enchantment)', result: `[Alien decode error: ${e.message}]` };
    }
  }

  // 2. Morse Code: Only dots, dashes, slashes, spaces, underscores
  if (/^[.\-\s/_]+$/.test(input) && /[.\-]/.test(input)) {
    try {
      const decodedMorse = morseToText(input);
      const isVietnameseTelex = /(?:dd|ee|aa|oo|ow|uw|aw|[aeiouy][frxj])/i.test(decodedMorse);
      if (isVietnameseTelex) {
        const convertedVi = telexToVietnamese(decodedMorse);
        return { typeName: 'Morse Code', result: `${convertedVi}\n(Raw: ${decodedMorse})` };
      }
      return { typeName: 'Morse Code', result: decodedMorse };
    } catch (e) {
      return { typeName: 'Morse Code', result: `[Morse decode error: ${e.message}]` };
    }
  }

  // 3. Binary: Only 0 and 1
  const binaryClean = input.replace(/\s+/g, '');
  if (/^[01]+$/.test(binaryClean) && binaryClean.length >= 8) {
    try {
      const decoded = binaryToText(binaryClean);
      return { typeName: 'Binary', result: decoded };
    } catch (e) {
      return { typeName: 'Binary', result: `[Binary decode error: ${e.message}]` };
    }
  }

  // 4. Hex: Byte pairs with spaces or even hex characters
  const cleanHex = input.replace(/0x/gi, '').replace(/\s+/g, '');
  const isHexOnly = /^[0-9a-fA-F]+$/.test(cleanHex);
  const hasHexSpacing = /^([0-9a-fA-F]{2}[\s]+)+[0-9a-fA-F]{2}$/.test(input);

  if (hasHexSpacing || (isHexOnly && cleanHex.length % 2 === 0 && (input.includes(' ') || cleanHex.length <= 16))) {
    try {
      const decoded = hexToText(cleanHex);
      if (decoded && !/[\uFFFD]/.test(decoded)) {
        return { typeName: 'Hex', result: decoded };
      }
    } catch (e) {}
  }

  // 5. Base64
  const cleanB64 = input.replace(/\s+/g, '');
  if (/^[A-Za-z0-9+/=]+$/.test(cleanB64) && cleanB64.length % 4 === 0) {
    try {
      const decoded = base64ToText(cleanB64);
      if (decoded && !/[\uFFFD]/.test(decoded)) {
        return { typeName: 'Base64', result: decoded };
      }
    } catch (e) {}
  }

  // 6. Fallback attempts
  try {
    const decodedB64 = base64ToText(cleanB64);
    if (decodedB64 && !/[\uFFFD]/.test(decodedB64)) {
      return { typeName: 'Base64', result: decodedB64 };
    }
  } catch (e) {}

  if (isHexOnly && cleanHex.length % 2 === 0) {
    try {
      const decodedHex = hexToText(cleanHex);
      if (decodedHex && !/[\uFFFD]/.test(decodedHex)) {
        return { typeName: 'Hex', result: decodedHex };
      }
    } catch (e) {}
  }

  return { typeName: 'Unknown format', result: 'Unable to recognize code format. Please check your input.' };
}

// Web Audio API Morse Player
class MorseAudioPlayer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.dotDuration = 60; // ms
    this.frequency = 650;  // Hz
  }

  unlock() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(duration, customFreq = null) {
    return new Promise((resolve) => {
      if (!this.isPlaying || !this.ctx) return resolve();
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(customFreq || this.frequency, this.ctx.currentTime);

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.005);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + (duration / 1000) - 0.005);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + (duration / 1000));

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + (duration / 1000));

        setTimeout(resolve, duration);
      } catch (e) {
        resolve();
      }
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async play(morseCode, onFinish) {
    this.stop();
    this.unlock();
    this.isPlaying = true;

    const chars = morseCode.split('');
    for (let i = 0; i < chars.length; i++) {
      if (!this.isPlaying) break;
      const c = chars[i];

      if (c === '.') {
        await this.playTone(this.dotDuration);
        await this.sleep(this.dotDuration);
      } else if (c === '-') {
        await this.playTone(this.dotDuration * 3);
        await this.sleep(this.dotDuration);
      } else if (c === ' ') {
        await this.sleep(this.dotDuration * 2);
      } else if (c === '/') {
        await this.sleep(this.dotDuration * 5);
      }
    }

    this.isPlaying = false;
    if (onFinish) onFinish();
  }

  async playAlien(alienText, onFinish) {
    this.stop();
    this.unlock();
    this.isPlaying = true;

    // Filter runes ignoring spaces and word separators
    const runes = Array.from(alienText).filter(c => c !== ' ' && c !== '•' && c !== '\n');
    // Cosmic Pentatonic scale in Hz
    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];

    for (let i = 0; i < runes.length; i++) {
      if (!this.isPlaying) break;
      const runeCode = runes[i].codePointAt(0);
      const freq = scale[runeCode % scale.length];
      await this.playTone(75, freq);
      await this.sleep(25);
    }

    this.isPlaying = false;
    if (onFinish) onFinish();
  }

  stop() {
    this.isPlaying = false;
  }
}

// Resilient Clipboard Copy Helper
async function copyToClipboard(text) {
  if (!text) return false;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {}
  }
  // Fallback for older iOS / in-app browsers
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.setAttribute('readonly', '');
    document.body.appendChild(ta);
    ta.select();
    const success = document.execCommand('copy');
    document.body.removeChild(ta);
    return success;
  } catch (e) {
    return false;
  }
}

// UI Initialization
document.addEventListener('DOMContentLoaded', () => {
  const sourceInput = document.getElementById('sourceInput');
  const morseVietnameseMode = document.getElementById('morseVietnameseMode');
  const btnClear = document.getElementById('btnClear');
  const btnPaste = document.getElementById('btnPaste');

  const activeOutput = document.getElementById('activeOutput');
  const btnCopyActive = document.getElementById('btnCopyActive');
  const btnPlayMorse = document.getElementById('btnPlayMorse');
  const btnStopMorse = document.getElementById('btnStopMorse');
  const tabButtons = document.querySelectorAll('.tab-btn');

  const decodeInput = document.getElementById('decodeInput');
  const decodeOutput = document.getElementById('decodeOutput');
  const btnDecodePaste = document.getElementById('btnDecodePaste');
  const btnDecodeClear = document.getElementById('btnDecodeClear');
  const btnDecodeCopy = document.getElementById('btnDecodeCopy');

  const toast = document.getElementById('toast');
  const themeToggle = document.getElementById('themeToggle');

  const player = new MorseAudioPlayer();

  let currentFormat = 'alien';

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2000);
  }

  function setOutputText(text, defaultText = 'Converted output will appear here...') {
    if (text && text.trim().length > 0) {
      activeOutput.textContent = text;
      activeOutput.classList.remove('empty');
    } else {
      activeOutput.textContent = defaultText;
      activeOutput.classList.add('empty');
    }
  }

  function updateActiveOutput() {
    const text = sourceInput.value;
    const mode = morseVietnameseMode ? morseVietnameseMode.value : 'telex';

    if (!text || !text.trim()) {
      setOutputText('');
      return;
    }

    try {
      let result = '';
      if (currentFormat === 'morse') {
        result = textToMorse(text, mode);
      } else if (currentFormat === 'binary') {
        result = textToBinary(text);
      } else if (currentFormat === 'base64') {
        result = textToBase64(text);
      } else if (currentFormat === 'hex') {
        result = textToHex(text);
      } else if (currentFormat === 'alien') {
        result = textToAlien(text);
      }
      setOutputText(result);
    } catch (err) {
      console.error('Encoding error:', err);
    }
  }

  // Switch format tabs
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      currentFormat = type;

      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      if (type === 'morse') {
        btnPlayMorse.classList.remove('hidden');
        btnPlayMorse.textContent = 'Play Morse';
      } else if (type === 'alien') {
        btnPlayMorse.classList.remove('hidden');
        btnPlayMorse.textContent = 'Play Chant';
      } else {
        btnPlayMorse.classList.add('hidden');
        btnStopMorse.classList.add('hidden');
        player.stop();
      }

      updateActiveOutput();
    });
  });

  // Copy converted output
  btnCopyActive.addEventListener('click', async () => {
    const content = activeOutput.textContent;
    if (!content || activeOutput.classList.contains('empty')) {
      showToast('Nothing to copy');
      return;
    }
    const success = await copyToClipboard(content);
    showToast(success ? 'Copied to clipboard' : 'Copy failed');
  });

  // Run Auto Decoder
  function runDecoder() {
    const input = decodeInput.value;
    const { result } = autoDetectAndDecode(input);
    if (decodeOutput) {
      decodeOutput.value = result;
    }
  }

  // Decoder Paste & Clear & Copy
  btnDecodePaste.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      decodeInput.value = text;
      runDecoder();
      showToast('Pasted from clipboard');
    } catch {
      decodeInput.focus();
      showToast('Tap & hold in the box to paste');
    }
  });

  btnDecodeClear.addEventListener('click', () => {
    decodeInput.value = '';
    runDecoder();
    decodeInput.focus();
  });

  btnDecodeCopy.addEventListener('click', async () => {
    const content = decodeOutput.value;
    if (!content || !content.trim()) {
      showToast('Nothing to copy');
      return;
    }
    const success = await copyToClipboard(content);
    showToast(success ? 'Copied to clipboard' : 'Copy failed');
  });

  // Input listeners
  sourceInput.addEventListener('input', updateActiveOutput);
  if (morseVietnameseMode) {
    morseVietnameseMode.addEventListener('change', updateActiveOutput);
  }
  decodeInput.addEventListener('input', runDecoder);

  // Clear & Paste buttons for Input
  btnClear.addEventListener('click', () => {
    sourceInput.value = '';
    updateActiveOutput();
    player.stop();
    btnPlayMorse.classList.remove('hidden');
    btnStopMorse.classList.add('hidden');
    sourceInput.focus();
  });

  btnPaste.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      sourceInput.value = text;
      updateActiveOutput();
      showToast('Pasted from clipboard');
    } catch {
      sourceInput.focus();
      showToast('Tap & hold in the box to paste');
    }
  });

  // Play Sound (Morse / Alien)
  btnPlayMorse.addEventListener('click', () => {
    player.unlock();

    if (currentFormat === 'alien') {
      const alienCode = textToAlien(sourceInput.value);
      if (!alienCode || !alienCode.trim()) {
        showToast('No Alien text to play');
        return;
      }
      btnPlayMorse.classList.add('hidden');
      btnStopMorse.classList.remove('hidden');
      player.playAlien(alienCode, () => {
        btnPlayMorse.classList.remove('hidden');
        btnStopMorse.classList.add('hidden');
      });
      return;
    }

    const code = textToMorse(sourceInput.value, morseVietnameseMode ? morseVietnameseMode.value : 'telex');
    if (!code || !code.trim()) {
      showToast('No Morse code to play');
      return;
    }

    btnPlayMorse.classList.add('hidden');
    btnStopMorse.classList.remove('hidden');

    player.play(code, () => {
      btnPlayMorse.classList.remove('hidden');
      btnStopMorse.classList.add('hidden');
    });
  });

  btnStopMorse.addEventListener('click', () => {
    player.stop();
    btnPlayMorse.classList.remove('hidden');
    btnStopMorse.classList.add('hidden');
  });

  // Theme Toggle (Dark / Light)
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', newTheme);
  });

  // Start with clean empty input
  sourceInput.value = '';
  updateActiveOutput();
});
