// Bảng mã Morse Quốc Tế
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

// Bản đồ chuyển tiếng Việt sang Telex chuẩn viễn thông
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
      throw new Error('Số lượng bit phải là bội số của 8');
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
  const clean = hexStr.trim().replace(/[^0-9a-fA-F]/g, '');
  if (!clean || clean.length % 2 !== 0) {
    if (clean.length > 0 && clean.length % 2 !== 0) {
      throw new Error('Ký tự Hex phải là các cặp 2 ký tự');
    }
    return '';
  }
  const bytes = [];
  for (let i = 0; i < clean.length; i += 2) {
    bytes.push(parseInt(clean.slice(i, i + 2), 16));
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

function telexToVietnamese(text) {
  const sortedPairs = Object.entries(VIETNAMESE_TELEX_MAP).sort((a, b) => b[1].length - a[1].length);
  let res = text.toLowerCase();
  for (const [char, telex] of sortedPairs) {
    res = res.replaceAll(telex, char);
  }
  return res.toUpperCase();
}

function autoDetectAndDecode(rawInput) {
  const input = rawInput.trim();
  if (!input) {
    return { typeName: 'Chờ dữ liệu...', result: '' };
  }

  // 1. Mã Morse
  if (/^[.\-\s/_]+$/.test(input) && /[.\-]/.test(input)) {
    try {
      const decodedMorse = morseToText(input);
      const convertedVi = telexToVietnamese(decodedMorse);
      const displayText = (convertedVi && convertedVi !== decodedMorse)
        ? `${convertedVi}\n(Dạng thô: ${decodedMorse})`
        : decodedMorse;
      return { typeName: 'Mã Morse', result: displayText };
    } catch (e) {
      return { typeName: 'Mã Morse', result: `[Lỗi giải mã Morse: ${e.message}]` };
    }
  }

  // 2. Nhị phân (Binary)
  const binaryClean = input.replace(/\s+/g, '');
  if (/^[01]+$/.test(binaryClean) && binaryClean.length >= 8) {
    try {
      const decoded = binaryToText(binaryClean);
      return { typeName: 'Nhị phân (Binary)', result: decoded };
    } catch (e) {
      return { typeName: 'Nhị phân (Binary)', result: `[Lỗi giải mã nhị phân: ${e.message}]` };
    }
  }

  // 3. Hex (Thập lục phân)
  const cleanHex = input.replace(/\s+/g, '');
  const isHexOnly = /^[0-9a-fA-F]+$/.test(cleanHex);
  const hasHexSpacing = /^([0-9a-fA-F]{2}[\s]+)+[0-9a-fA-F]{2}$/.test(input);

  if (hasHexSpacing || (isHexOnly && cleanHex.length % 2 === 0 && (input.includes(' ') || cleanHex.length <= 16))) {
    try {
      const decoded = hexToText(cleanHex);
      if (decoded && !/[\uFFFD]/.test(decoded)) {
        return { typeName: 'Thập lục phân (Hex)', result: decoded };
      }
    } catch (e) {}
  }

  // 4. Base64
  const cleanB64 = input.replace(/\s+/g, '');
  if (/^[A-Za-z0-9+/=]+$/.test(cleanB64) && cleanB64.length % 4 === 0) {
    try {
      const decoded = base64ToText(cleanB64);
      if (decoded && !/[\uFFFD]/.test(decoded)) {
        return { typeName: 'Base64', result: decoded };
      }
    } catch (e) {}
  }

  // 5. Fallback
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
        return { typeName: 'Thập lục phân (Hex)', result: decodedHex };
      }
    } catch (e) {}
  }

  return { typeName: 'Chưa xác định', result: 'Chưa nhận diện được định dạng mã. Vui lòng kiểm tra lại.' };
}

// Trình phát âm thanh mã Morse
class MorseAudioPlayer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.dotDuration = 60; // ms
    this.frequency = 650;  // Hz
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(duration) {
    return new Promise((resolve) => {
      if (!this.isPlaying) return resolve();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(this.frequency, this.ctx.currentTime);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.005);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime + (duration / 1000) - 0.005);
      gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + (duration / 1000));

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + (duration / 1000));

      setTimeout(resolve, duration);
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async play(morseCode, onFinish) {
    this.stop();
    this.initContext();
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

  stop() {
    this.isPlaying = false;
  }
}

// Khởi tạo giao diện
document.addEventListener('DOMContentLoaded', () => {
  const sourceInput = document.getElementById('sourceInput');
  const morseVietnameseMode = document.getElementById('morseVietnameseMode');
  const btnClear = document.getElementById('btnClear');
  const btnPaste = document.getElementById('btnPaste');
  const btnSample = document.getElementById('btnSample');

  const activeOutput = document.getElementById('activeOutput');
  const outputFormatDesc = document.getElementById('outputFormatDesc');
  const btnCopyActive = document.getElementById('btnCopyActive');
  const btnPlayMorse = document.getElementById('btnPlayMorse');
  const btnStopMorse = document.getElementById('btnStopMorse');
  const tabButtons = document.querySelectorAll('.tab-btn');

  const decodeInput = document.getElementById('decodeInput');
  const decodeOutput = document.getElementById('decodeOutput');
  const detectedTypeBadge = document.getElementById('detectedTypeBadge');
  const btnDecodePaste = document.getElementById('btnDecodePaste');
  const btnDecodeClear = document.getElementById('btnDecodeClear');
  const btnDecodeCopy = document.getElementById('btnDecodeCopy');

  const toast = document.getElementById('toast');
  const themeToggle = document.getElementById('themeToggle');

  const player = new MorseAudioPlayer();

  // Định dạng hiện tại được chọn ('morse' | 'binary' | 'base64' | 'hex')
  let currentFormat = 'morse';

  const FORMAT_DESCS = {
    morse: 'Quy chuẩn viễn thông quốc tế & Telex',
    binary: 'Mã hóa byte UTF-8 chuẩn 8-bit',
    base64: 'Chuỗi RFC 4648 hỗ trợ tiếng Việt có dấu',
    hex: 'Hệ 16 định dạng byte UTF-8'
  };

  function showToast(message) {
    toast.textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2000);
  }

  function setOutputText(text, defaultText = 'Chưa có nội dung...') {
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
    const mode = morseVietnameseMode.value;

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
      }
      setOutputText(result);
    } catch (err) {
      console.error('Lỗi khi mã hóa:', err);
    }
  }

  // Chuyển tab định dạng (thu gọn kiểu mới hiện)
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

      if (outputFormatDesc) {
        outputFormatDesc.textContent = FORMAT_DESCS[type] || '';
      }

      // Hiện nút phát âm thanh khi ở tab morse
      if (type === 'morse') {
        btnPlayMorse.classList.remove('hidden');
      } else {
        btnPlayMorse.classList.add('hidden');
        btnStopMorse.classList.add('hidden');
        player.stop();
      }

      updateActiveOutput();
    });
  });

  // Sao chép kết quả chuyển đổi hiện tại
  btnCopyActive.addEventListener('click', async () => {
    const content = activeOutput.textContent;
    if (!content || activeOutput.classList.contains('empty')) {
      showToast('Không có nội dung để sao chép');
      return;
    }
    try {
      await navigator.clipboard.writeText(content);
      showToast('Đã sao chép kết quả');
    } catch {
      showToast('Lỗi khi sao chép');
    }
  });

  // Giải mã ngược
  function runDecoder() {
    const input = decodeInput.value;
    const { typeName, result } = autoDetectAndDecode(input);
    detectedTypeBadge.textContent = typeName;
    if (typeName !== 'Chờ dữ liệu...' && typeName !== 'Chưa xác định') {
      detectedTypeBadge.classList.add('active');
    } else {
      detectedTypeBadge.classList.remove('active');
    }
    decodeOutput.value = result;
  }

  // Nút Dán và Xóa cho phần dịch (giải mã)
  btnDecodePaste.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      decodeInput.value = text;
      runDecoder();
      showToast('Đã dán mã cần giải');
    } catch {
      showToast('Không đọc được bộ nhớ tạm. Hãy dùng Ctrl+V hoặc chạm giữ để dán.');
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
      showToast('Không có kết quả để sao chép');
      return;
    }
    try {
      await navigator.clipboard.writeText(content);
      showToast('Đã sao chép kết quả dịch');
    } catch {
      showToast('Lỗi khi sao chép');
    }
  });

  // Lắng nghe sự kiện
  sourceInput.addEventListener('input', updateActiveOutput);
  morseVietnameseMode.addEventListener('change', updateActiveOutput);
  decodeInput.addEventListener('input', runDecoder);

  // Nút bảng nhập nguồn
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
      showToast('Đã dán nội dung từ bộ nhớ tạm');
    } catch {
      showToast('Không thể truy cập bộ nhớ tạm. Hãy dùng Ctrl+V.');
    }
  });

  btnSample.addEventListener('click', () => {
    sourceInput.value = 'Xin chào Việt Nam! Chúc một ngày tốt lành.';
    updateActiveOutput();
  });

  // Phát âm thanh Morse
  btnPlayMorse.addEventListener('click', () => {
    const code = textToMorse(sourceInput.value, morseVietnameseMode.value);
    if (!code || !code.trim()) {
      showToast('Chưa có mã Morse để phát');
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

  // Giao diện Sáng/Tối
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

  // Dữ liệu mẫu khởi tạo
  sourceInput.value = 'Xin chào Việt Nam!';
  updateActiveOutput();
});
