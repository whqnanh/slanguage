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

// Chuyển ký tự tiếng Việt sang Telex
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

// Bỏ dấu tiếng Việt (strip diacritics)
function stripVietnameseAccents(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

// Chuyển chữ thành mã Morse
function textToMorse(text, mode = 'telex') {
  if (!text.trim()) return '';
  
  let processed = (mode === 'strip') 
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

// Dịch Morse ngược về chữ
function morseToText(morse) {
  if (!morse.trim()) return '';
  const words = morse.trim().split(/\s*\/\s*|\s{3,}/);
  return words.map(word => {
    const letters = word.trim().split(/\s+/);
    return letters.map(code => REVERSE_MORSE_MAP[code] || code).join('');
  }).join(' ');
}

// Chuyển chữ sang chuỗi nhị phân (Binary UTF-8 bytes)
function textToBinary(text) {
  if (!text) return '';
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  return Array.from(bytes)
    .map(b => b.toString(2).padStart(8, '0'))
    .join(' ');
}

// Dịch chuỗi nhị phân về chữ
function binaryToText(binaryStr) {
  const clean = binaryStr.trim().replace(/[^01]/g, '');
  if (!clean || clean.length % 8 !== 0) {
    if (clean.length > 0 && clean.length % 8 !== 0) {
      throw new Error('Số lượng bit không hợp lệ (phải là bội số của 8)');
    }
    return '';
  }
  
  const bytes = [];
  for (let i = 0; i < clean.length; i += 8) {
    bytes.push(parseInt(clean.slice(i, i + 8), 2));
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

// Base64 UTF-8 an toàn cho tiếng Việt
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

// Chuyển sang Hexadecimal (Thập lục phân)
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
      throw new Error('Số lượng ký tự Hex không hợp lệ (phải là cặp 2 ký tự)');
    }
    return '';
  }
  const bytes = [];
  for (let i = 0; i < clean.length; i += 2) {
    bytes.push(parseInt(clean.slice(i, i + 2), 16));
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

// Chuyển ngược Telex về tiếng Việt
function telexToVietnamese(text) {
  const sortedPairs = Object.entries(VIETNAMESE_TELEX_MAP).sort((a, b) => b[1].length - a[1].length);
  let res = text.toLowerCase();
  for (const [char, telex] of sortedPairs) {
    res = res.replaceAll(telex, char);
  }
  return res.toUpperCase();
}

// Tự động nhận diện định dạng mã và giải mã
function autoDetectAndDecode(rawInput) {
  const input = rawInput.trim();
  if (!input) {
    return { typeName: 'Chờ dữ liệu...', result: '' };
  }

  // 1. Mã Morse: Chỉ chứa ký tự '.', '-', '/', khoảng trắng và có ít nhất 1 dấu chấm hoặc gạch nối
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

  // 2. Nhị phân (Binary): Chuỗi chỉ chứa 0 và 1 (kèm khoảng trắng)
  const binaryClean = input.replace(/\s+/g, '');
  if (/^[01]+$/.test(binaryClean) && binaryClean.length >= 8) {
    try {
      const decoded = binaryToText(binaryClean);
      return { typeName: 'Nhị phân (Binary)', result: decoded };
    } catch (e) {
      return { typeName: 'Nhị phân (Binary)', result: `[Lỗi giải mã nhị phân: ${e.message}]` };
    }
  }

  // 3. Hex (Thập lục phân): Các cặp byte cách nhau bằng khoảng trắng hoặc chuỗi hex chẵn
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

  // 5. Thử fallback Base64 / Hex
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

  return { typeName: 'Chưa xác định', result: 'Chưa nhận diện được định dạng mã. Vui lòng kiểm tra lại nội dung.' };
}

// Trình phát âm thanh mã Morse qua Web Audio API
class MorseAudioPlayer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.abortController = null;
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

// Khởi tạo các phần tử giao diện
document.addEventListener('DOMContentLoaded', () => {
  const sourceInput = document.getElementById('sourceInput');
  const morseVietnameseMode = document.getElementById('morseVietnameseMode');
  const btnClear = document.getElementById('btnClear');
  const btnPaste = document.getElementById('btnPaste');
  const btnSample = document.getElementById('btnSample');

  const outputMorse = document.getElementById('outputMorse');
  const outputBinary = document.getElementById('outputBinary');
  const outputBase64 = document.getElementById('outputBase64');
  const outputHex = document.getElementById('outputHex');

  const btnPlayMorse = document.getElementById('btnPlayMorse');
  const btnStopMorse = document.getElementById('btnStopMorse');
  const toast = document.getElementById('toast');
  const themeToggle = document.getElementById('themeToggle');

  const decodeInput = document.getElementById('decodeInput');
  const decodeOutput = document.getElementById('decodeOutput');
  const detectedTypeBadge = document.getElementById('detectedTypeBadge');
  const btnPiP = document.getElementById('btnPiP');
  const pipCanvas = document.getElementById('pipCanvas');
  const pipVideo = document.getElementById('pipVideo');

  const player = new MorseAudioPlayer();

  function showToast(message) {
    toast.textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2000);
  }

  function setOutput(el, text, defaultText = 'Chưa có nội dung...') {
    if (text && text.trim().length > 0) {
      el.textContent = text;
      el.classList.remove('empty');
    } else {
      el.textContent = defaultText;
      el.classList.add('empty');
    }
  }

  function drawPipCanvas() {
    if (!pipCanvas) return;
    const ctx = pipCanvas.getContext('2d');
    const w = pipCanvas.width;
    const h = pipCanvas.height;

    // Dark sleek background
    ctx.fillStyle = '#0b0f17';
    ctx.fillRect(0, 0, w, h);

    // Border
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3;
    ctx.strokeRect(1, 1, w - 2, h - 2);

    // Title
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 20px "JetBrains Mono", monospace, sans-serif';
    ctx.fillText('+slanguage', 24, 38);

    ctx.fillStyle = '#64748b';
    ctx.font = '13px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('Cửa sổ nổi theo dõi mã hóa', 180, 36);

    // Separator line
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(24, 52);
    ctx.lineTo(w - 24, 52);
    ctx.stroke();

    const text = (sourceInput ? sourceInput.value.trim() : '') || '(Chưa có nội dung)';
    const morse = (outputMorse && !outputMorse.classList.contains('empty') ? outputMorse.textContent.trim() : '---');
    const binary = (outputBinary && !outputBinary.classList.contains('empty') ? outputBinary.textContent.trim() : '---');
    const b64 = (outputBase64 && !outputBase64.classList.contains('empty') ? outputBase64.textContent.trim() : '---');
    const decoded = (decodeOutput ? decodeOutput.value.trim() : '');

    let y = 88;
    function drawLine(label, val, color, font) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(label, 24, y);

      ctx.fillStyle = color;
      ctx.font = font;
      const display = val.length > 55 ? val.slice(0, 52) + '...' : val;
      ctx.fillText(display, 24, y + 22);
      y += 54;
    }

    drawLine('VĂN BẢN:', text, '#f8fafc', 'bold 15px -apple-system, BlinkMacSystemFont, sans-serif');
    drawLine('MORSE:', morse, '#38bdf8', '14px "JetBrains Mono", monospace');
    drawLine('NHỊ PHÂN:', binary, '#c084fc', '13px "JetBrains Mono", monospace');
    drawLine('BASE64:', b64, '#34d399', '14px "JetBrains Mono", monospace');

    if (decoded) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px -apple-system, sans-serif';
      const decDisplay = decoded.length > 46 ? decoded.slice(0, 43) + '...' : decoded;
      ctx.fillText('GIẢI MÃ: ' + decDisplay, 24, h - 14);
    }
  }

  let pipStream = null;
  async function togglePictureInPicture() {
    if (!pipVideo || !pipCanvas) return;

    drawPipCanvas();

    // Nếu đang ở chế độ PiP thì tắt
    if (document.pictureInPictureElement) {
      try {
        await document.exitPictureInPicture();
      } catch (e) {}
      return;
    }
    if (pipVideo.webkitPresentationMode === 'picture-in-picture') {
      try {
        pipVideo.webkitSetPresentationMode('inline');
      } catch (e) {}
      return;
    }

    if (!pipStream) {
      if (pipCanvas.captureStream) {
        pipStream = pipCanvas.captureStream(15);
      } else if (pipCanvas.mozCaptureStream) {
        pipStream = pipCanvas.mozCaptureStream(15);
      }
    }

    if (!pipStream) {
      showToast('Trình duyệt chưa hỗ trợ phát stream video PiP.');
      return;
    }

    pipVideo.srcObject = pipStream;

    try {
      await pipVideo.play();
      if (pipVideo.requestPictureInPicture) {
        await pipVideo.requestPictureInPicture();
        showToast('Đã mở cửa sổ nổi');
      } else if (pipVideo.webkitSetPresentationMode) {
        pipVideo.webkitSetPresentationMode('picture-in-picture');
        showToast('Đã mở cửa sổ nổi trên iPhone');
      } else {
        showToast('Thiết bị chưa hỗ trợ Picture-in-Picture');
      }
    } catch (err) {
      console.error('Lỗi PiP:', err);
      showToast('Không thể bật PiP: ' + (err.message || 'Hãy chạm màn hình và thử lại'));
    }
  }

  function updateEncodings() {
    const text = sourceInput.value;
    const mode = morseVietnameseMode.value;

    if (!text) {
      setOutput(outputMorse, '');
      setOutput(outputBinary, '');
      setOutput(outputBase64, '');
      setOutput(outputHex, '');
      drawPipCanvas();
      return;
    }

    try {
      setOutput(outputMorse, textToMorse(text, mode));
      setOutput(outputBinary, textToBinary(text));
      setOutput(outputBase64, textToBase64(text));
      setOutput(outputHex, textToHex(text));
      drawPipCanvas();
    } catch (err) {
      console.error('Lỗi khi mã hóa:', err);
    }
  }

  function handleDecoderInput() {
    const input = decodeInput.value;
    const { typeName, result } = autoDetectAndDecode(input);
    detectedTypeBadge.textContent = typeName;
    if (typeName !== 'Chờ dữ liệu...' && typeName !== 'Chưa xác định') {
      detectedTypeBadge.classList.add('active');
    } else {
      detectedTypeBadge.classList.remove('active');
    }
    decodeOutput.value = result;
    drawPipCanvas();
  }

  // Lắng nghe sự kiện gõ phím
  sourceInput.addEventListener('input', updateEncodings);
  morseVietnameseMode.addEventListener('change', updateEncodings);
  decodeInput.addEventListener('input', handleDecoderInput);
  if (btnPiP) {
    btnPiP.addEventListener('click', togglePictureInPicture);
  }

  // Nút tiện ích
  btnClear.addEventListener('click', () => {
    sourceInput.value = '';
    updateEncodings();
    player.stop();
    btnPlayMorse.classList.remove('hidden');
    btnStopMorse.classList.add('hidden');
    sourceInput.focus();
  });

  btnPaste.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      sourceInput.value = text;
      updateEncodings();
      showToast('Đã dán nội dung từ bộ nhớ tạm');
    } catch {
      showToast('Không thể truy cập bộ nhớ tạm. Hãy dùng Ctrl+V.');
    }
  });

  btnSample.addEventListener('click', () => {
    sourceInput.value = 'Xin chào Việt Nam! Chúc một ngày tốt lành.';
    updateEncodings();
  });

  // Sao chép
  document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', async () => {
      const targetId = button.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      const content = targetEl.value !== undefined ? targetEl.value : targetEl.textContent;
      if (!content || targetEl.classList.contains('empty')) {
        showToast('Không có nội dung để sao chép');
        return;
      }

      try {
        await navigator.clipboard.writeText(content);
        showToast('Đã sao chép vào bộ nhớ tạm');
      } catch {
        showToast('Lỗi khi sao chép');
      }
    });
  });

  // Phát âm thanh Morse
  btnPlayMorse.addEventListener('click', () => {
    const code = outputMorse.textContent;
    if (!code || outputMorse.classList.contains('empty')) {
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

  // Điền dữ liệu mẫu khởi tạo để người dùng thấy ngay
  sourceInput.value = 'Xin chào Việt Nam!';
  updateEncodings();
});
