import React, { useState } from 'react'
import axios from 'axios'
import QrCodeGenerator from 'qrcode';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400&display=swap');

  :root {
    --black:   #0a0a0a;
    --green:   #00ff80;
    --dkgreen: #04ff43;
    --yellow:  #ffe600;
    --cyan:    #2ddfff;
    --red:     #ff3c3c;
    --panel:   #0d1a0d;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--black);
    font-family: 'Press Start 2P', monospace;
    color: var(--green);
    image-rendering: pixelated;
  }

  body::after {
    content: '';
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent, transparent 2px,
      rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px
    );
    pointer-events: none;
    z-index: 9999;
  }

  .page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 16px;
    background: radial-gradient(ellipse at 50% 0%, rgba(0,255,65,0.07) 0%, transparent 60%), var(--black);
  }

  .pixel-box {
    background: var(--panel);
    box-shadow: 0 0 0 4px var(--green), 6px 6px 0 0 var(--dkgreen);
  }

  .card {
    width: 100%;
    max-width: 560px;
    padding: 36px 32px;
  }

  .title-wrap { margin-bottom: 24px; text-align: center; }

  .game-title {
    font-size: 22px;
    line-height: 1.5;
    color: var(--yellow);
    text-shadow: 3px 3px 0 #7a6a00, 0 0 18px rgba(255,230,0,0.4);
  }

  .game-sub {
    font-family: 'VT323', monospace;
    font-size: 20px;
    color: var(--cyan);
    margin-top: 8px;
    letter-spacing: 0.08em;
  }

  .blink { animation: blink 1s step-end infinite; }
  @keyframes blink { 50% { opacity: 0; } }

  .px-divider {
    height: 4px;
    background: repeating-linear-gradient(90deg, var(--green) 0px, var(--green) 8px, transparent 8px, transparent 12px);
    margin: 20px 0;
  }

  .field-label {
    font-size: 10px;
    color: var(--cyan);
    margin-bottom: 10px;
    letter-spacing: 0.1em;
  }

  .pixel-input {
    width: 100%;
    padding: 12px 14px;
    background: #000;
    border: none;
    box-shadow: 0 0 0 3px var(--green), 3px 3px 0 0 var(--dkgreen);
    color: var(--green);
    font-family: 'VT323', monospace;
    font-size: 20px;
    outline: none;
    caret-color: var(--green);
    margin-bottom: 20px;
  }

  .pixel-input::placeholder { color: rgba(0,255,65,0.3); }
  .pixel-input:focus { box-shadow: 0 0 0 3px var(--yellow), 3px 3px 0 0 #7a6a00; }

  .btn-primary {
    width: 100%;
    padding: 14px 10px;
    background: var(--green);
    color: var(--black);
    font-family: 'Press Start 2P', monospace;
    font-size: 11px;
    border: none;
    box-shadow: 4px 4px 0 0 var(--dkgreen);
    cursor: pointer;
    transition: transform 0.08s, box-shadow 0.08s;
    letter-spacing: 0.04em;
  }

  .btn-primary:hover:not(:disabled) { transform: translate(2px,2px); box-shadow: 2px 2px 0 0 var(--dkgreen); }
  .btn-primary:active:not(:disabled) { transform: translate(4px,4px); box-shadow: none; }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

  .btn-secondary {
    width: 100%;
    padding: 13px 10px;
    background: transparent;
    color: var(--cyan);
    font-family: 'Press Start 2P', monospace;
    font-size: 10px;
    border: none;
    box-shadow: 0 0 0 3px var(--cyan), 3px 3px 0 0 #007a88;
    cursor: pointer;
    transition: transform 0.08s, box-shadow 0.08s;
    margin-top: 16px;
    letter-spacing: 0.04em;
  }

  .btn-secondary:hover { transform: translate(2px,2px); box-shadow: 0 0 0 3px var(--cyan), 1px 1px 0 0 #007a88; }

  .btn-small {
    padding: 8px 12px;
    background: var(--black);
    color: var(--yellow);
    font-family: 'Press Start 2P', monospace;
    font-size: 8px;
    border: none;
    box-shadow: 0 0 0 2px var(--yellow), 3px 3px 0 0 #4a6a8f;
    cursor: pointer;
    white-space: nowrap;
    transition: transform 0.08s, box-shadow 0.08s;
  }

  .btn-small:hover { transform: translate(2px,2px); box-shadow: 0 0 0 2px var(--yellow), 1px 1px 0 0 #7a6a00; }
  .btn-small.copied { color: var(--green); box-shadow: 0 0 0 2px var(--green), 3px 3px 0 0 var(--dkgreen); }

  .url-box {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    background: #000;
    box-shadow: 0 0 0 3px var(--green), 3px 3px 0 0 var(--dkgreen);
    margin-bottom: 24px;
    flex-wrap: wrap;
  }

  .url-text {
    flex: 1;
    font-family: 'VT323', monospace;
    font-size: 18px;
    color: var(--green);
    word-break: break-all;
    text-decoration: none;
    min-width: 0;
  }

  .url-text:hover { text-decoration: underline; color: var(--yellow); }

  .section-label {
    font-size: 13px;
    color: rgb(255, 230, 1);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .qr-wrapper { display: flex; flex-direction: column; align-items: center; gap: 16px; }

  .qr-frame {
    padding: 14px;
    background: #fff;
    box-shadow: 0 0 0 4px var(--green), 5px 5px 0 0 var(--dkgreen);
  }

  .error-box {
    font-family: 'VT323', monospace;
    font-size: 18px;
    color: var(--red);
    padding: 10px 14px;
    background: #1a0000;
    box-shadow: 0 0 0 2px var(--red);
    margin-bottom: 14px;
  }

  .done-tag {
    font-size: 10px;
    color: var(--black);
    background: var(--green);
    padding: 4px 10px;
    display: inline-block;
    margin-bottom: 14px;
    letter-spacing: 0.06em;
  }

  .prompt-prefix {
    font-family: 'VT323', monospace;
    font-size: 22px;
    color: var(--dkgreen);
    margin-bottom: 6px;
  }

  .spinner-wrap { display: inline-flex; align-items: center; gap: 10px; }

  .pixel-spinner {
    display: inline-block;
    width: 10px; height: 10px;
    animation: pixelspin 0.5s steps(4) infinite;
  }

  @keyframes pixelspin {
    0%   { box-shadow: 6px 0 0 0 var(--green); }
    25%  { box-shadow: 0 6px 0 0 var(--green); }
    50%  { box-shadow: -6px 0 0 0 var(--green); }
    75%  { box-shadow: 0 -6px 0 0 var(--green); }
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .slide-in { animation: slideIn 0.25s steps(5) forwards; }
`;

export default function App() {
  const [view, setView] = useState('home');
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [qrImage, setQrImage] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const normalize = (u) => u && !u.startsWith('http') ? `https://${u}` : u;

  const handleShorten = async (e) => {
    e?.preventDefault();
    if (!url.trim()) { setError('> ERROR: URL field is empty.'); return; }
    setLoading(true); setError('');
    try {
      const res = await axios.post(`${API_BASE_URL}/shorten`, { originalUrl: url });
      const short = res.data.shortUrl || '';
      setShortUrl(short);
      const qr = await QrCodeGenerator.toDataURL(normalize(short), { width: 200, margin: 1 });
      setQrImage(qr);
      setView('result');
    } catch {
      setError('> ERROR: Failed to shorten. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { setError('> ERROR: Copy failed.'); }
  };

  const handleDownloadQr = () => {
    const a = document.createElement('a');
    a.href = qrImage; a.download = 'qrcode.png'; a.click();
  };

  const handleReset = () => {
    setUrl(''); setShortUrl(''); setQrImage('');
    setCopied(false); setError(''); setView('home');
  };

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="card pixel-box">

          {view === 'home' && (
            <div className="slide-in">
              <div className="title-wrap">
                <div className="game-title">SHORTIFY<span className="blink">_</span></div>
                <div className="game-sub">URL SHORTENER + QR GENERATOR</div>
              </div>
              <div className="px-divider" />
              <form onSubmit={handleShorten}>
                <div className="prompt-prefix">&gt; ENTER LONG URL:</div>
                <div className="field-label">Paste Your Link below: </div>
                <input
                  className="pixel-input"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/long/url"
                  autoFocus
                />
                {error && <div className="error-box">{error}</div>}
                <button className="btn-primary" type="submit" disabled={loading}>
                  {loading
                    ? <span className="spinner-wrap"><span className="pixel-spinner" /> PROCESSING...</span>
                    : '[ SHORTEN + GENERATE QR ]'}
                </button>
              </form>
            </div>
          )}

          {view === 'result' && (
            <div className="slide-in">
              <div className="title-wrap">
                <div className="done-tag">✓ DONE</div>
                <div className="game-title" style={{ fontSize: 16 }}>LINK READY<span className="blink">_</span></div>
              </div>
              <div className="px-divider" />

              <div className="section-label">&gt; YOUR SHORTENED URL:</div>
              <div className="url-box">
                <a className="url-text" href={normalize(shortUrl)} target="_blank" rel="noreferrer">
                  {shortUrl}
                </a>
                <button className={`btn-small${copied ? ' copied' : ''}`} onClick={handleCopy}>
                  {copied ? '[COPIED!]' : '[COPY]'}
                </button>
              </div>

              <div className="px-divider" />

              <div className="section-label">&gt; QR CODE FOR THIS LINK:</div>
              <div className="qr-wrapper">
                {qrImage && (
                  <div className="qr-frame">
                    <img src={qrImage} alt="QR Code" width={200} height={200} style={{ imageRendering: 'pixelated' }} />
                  </div>
                )}
                <button className="btn-primary" onClick={handleDownloadQr}>
                  [ DOWNLOAD QR CODE ]
                </button>
              </div>

              <button className="btn-secondary" onClick={handleReset}>
                &lt; SHORTEN ANOTHER LINK
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}