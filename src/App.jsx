import { useState, useRef, useEffect } from "react";

const BARAJ_VAL = -101;
const FINISH_VAL = -101;

// ─── TEMALAR ─────────────────────────────────────────────────────────────────
const THEMES = {
  gece: {
    name: "🌙 Gece",
    bg:      "#1a1f35",
    surface: "#222840",
    surf2:   "#2a3050",
    border:  "#2e3558",
    border2: "#3a4068",
    gold:    "#f0c060",
    mint:    "#60d4a0",
    coral:   "#f08080",
    white:   "#ffffff",
    muted:   "#6a7298",
    text:    "#c8d0e8",
    dealerBg:"#60d4a0",
    winBg:   "#1a2a24",
    loseBg:  "#2a1a1a",
    cezaBg:  "#1e1828",
    barajBg: "#2a3050",
  },
  antrasit: {
    name: "⬛ Antrasit",
    bg:      "#18181b",
    surface: "#222226",
    surf2:   "#2a2a30",
    border:  "#333338",
    border2: "#444450",
    gold:    "#e8c84a",
    mint:    "#70c8b0",
    coral:   "#e87878",
    white:   "#f4f4f5",
    muted:   "#71717a",
    text:    "#d4d4d8",
    dealerBg:"#70c8b0",
    winBg:   "#182420",
    loseBg:  "#281818",
    cezaBg:  "#201820",
    barajBg: "#2a2a30",
  },
  orman: {
    name: "🌲 Orman",
    bg:      "#0f1a14",
    surface: "#162010",
    surf2:   "#1e2a1a",
    border:  "#253520",
    border2: "#304028",
    gold:    "#d4b84a",
    mint:    "#78e090",
    coral:   "#e87868",
    white:   "#f0f4f0",
    muted:   "#5a7a5a",
    text:    "#b8d0b8",
    dealerBg:"#78e090",
    winBg:   "#102018",
    loseBg:  "#280f0f",
    cezaBg:  "#180f18",
    barajBg: "#1e2a1a",
  },
  kahve: {
    name: "🟤 Kahve",
    bg:      "#1e1610",
    surface: "#281e14",
    surf2:   "#32261a",
    border:  "#3e2e20",
    border2: "#4e3a28",
    gold:    "#e8c060",
    mint:    "#90c8a0",
    coral:   "#e08868",
    white:   "#f4f0e8",
    muted:   "#7a6a58",
    text:    "#d0c0a8",
    dealerBg:"#90c8a0",
    winBg:   "#102018",
    loseBg:  "#281410",
    cezaBg:  "#201018",
    barajBg: "#32261a",
  },
};

function acilmamaCeza(isEsli, isRenkli) {
  if (!isRenkli) return isEsli ? 400 : 200;
  return isEsli ? 800 : 400;
}

function themeVars(t) {
  return `
    --bg:      ${t.bg};
    --surface: ${t.surface};
    --surf2:   ${t.surf2};
    --border:  ${t.border};
    --border2: ${t.border2};
    --gold:    ${t.gold};
    --mint:    ${t.mint};
    --coral:   ${t.coral};
    --white:   ${t.white};
    --muted:   ${t.muted};
    --text:    ${t.text};
    --dealer-bg: ${t.dealerBg};
    --win-bg:  ${t.winBg};
    --lose-bg: ${t.loseBg};
    --ceza-bg: ${t.cezaBg};
    --baraj-bg:${t.barajBg};
  `;
}

// ─── SETUP ────────────────────────────────────────────────────────────────────
function SetupScreen({ onStart }) {
  const [s, setS] = useState({
    isimler: ["", "", "", ""],
    isEsli: false,
    elSayisi: "",
    isRenkli: false,
    sabitCeza: true,
    barajli: true,
    kumulatif: false,
    fontSize: "normal",
    tema: "gece",
  });
  const set = (k, v) => setS((p) => ({ ...p, [k]: v }));
  const ready = s.elSayisi >= 1 && s.isimler.some((n) => n.trim().length > 0);
  const t = THEMES[s.tema];

  const handleStart = () => {
    const names = s.isimler.map((n, i) => n.trim() || `Oyuncu ${i + 1}`);
    onStart({ ...s, isimler: names, elSayisi: parseInt(s.elSayisi) });
  };

  const Toggle = ({ label, sub0, sub1, val, onChange }) => (
    <div className="toggle-row">
      <span className="toggle-label">{label}</span>
      <div className="toggle-group">
        <button className={`tgl ${!val ? "on" : ""}`} onClick={() => onChange(false)}>{sub0}</button>
        <button className={`tgl ${val ? "on" : ""}`} onClick={() => onChange(true)}>{sub1}</button>
      </div>
    </div>
  );

  return (
    <div className="setup-screen" style={{background:`radial-gradient(ellipse at 50% 0%, ${t.surface} 0%, ${t.bg} 70%)`}}>
      <div className="app-logo" style={{color:t.white}}>OKEY <span style={{color:t.gold}}>[ 101+ ]</span></div>
      <div className="setup-card" style={{background:t.surface, borderColor:t.border}}>

        <div className="sec-title" style={{color:t.gold}}>OYUNCULAR</div>
        {s.isEsli && <div className="team-hint" style={{color:t.muted}}>🟢 1 &amp; 3 Takım · 🔵 2 &amp; 4 Takım</div>}
        <div className="player-grid">
          {[0,1,2,3].map(i => (
            <div key={i} className="player-field">
              <span className="pf-badge" style={{color:t.gold}}>
                {s.isEsli ? (i===0||i===2 ? "🟢" : "🔵") : `${i+1}`}
              </span>
              <input
                className="pf-input"
                style={{background:t.bg, borderColor:t.border, color:t.white}}
                placeholder={`Oyuncu ${i+1}`}
                value={s.isimler[i]}
                onChange={e => { const a=[...s.isimler]; a[i]=e.target.value; set("isimler",a); }}
              />
            </div>
          ))}
        </div>

        <div className="divider" style={{background:t.border}}/>

        <Toggle label="Oyun Tipi"  sub0="Tekli"      sub1="Eşli"      val={s.isEsli}     onChange={v=>set("isEsli",v)}/>
        <Toggle label="Taş Rengi"  sub0="⬜ Renksiz" sub1="🟥 Renkli" val={s.isRenkli}   onChange={v=>set("isRenkli",v)}/>
        <Toggle label="Ceza Tipi"  sub0="Sabit −101" sub1="Değişken"  val={!s.sabitCeza} onChange={v=>set("sabitCeza",!v)}/>
        <Toggle label="Baraj"      sub0="Barajsız"   sub1="Barajlı"   val={s.barajli}    onChange={v=>set("barajli",v)}/>
        <Toggle label="Toplam"     sub0="Son El"     sub1="Kümülatif" val={s.kumulatif}  onChange={v=>set("kumulatif",v)}/>

        <div className="divider" style={{background:t.border}}/>

        <div className="toggle-row">
          <span className="toggle-label" style={{color:t.muted}}>Kaç El?</span>
          <input
            className="el-count-input"
            style={{background:t.bg, borderColor:t.border, color:t.white}}
            type="number" min="1" max="50" placeholder="8"
            value={s.elSayisi} onChange={e=>set("elSayisi",e.target.value)}
          />
        </div>

        <div className="divider" style={{background:t.border}}/>

        <div className="sec-title" style={{color:t.gold}}>TEMA</div>
        <div className="tema-grid">
          {Object.entries(THEMES).map(([key, theme]) => (
            <button
              key={key}
              className={`tema-btn ${s.tema===key?"on":""}`}
              style={{
                background: s.tema===key ? theme.gold : theme.bg,
                borderColor: s.tema===key ? theme.gold : theme.border,
                color: s.tema===key ? theme.bg : theme.muted,
              }}
              onClick={()=>set("tema",key)}
            >
              {theme.name}
            </button>
          ))}
        </div>

        <div className="divider" style={{background:t.border}}/>

        <div className="sec-title" style={{color:t.gold}}>GÖRÜNÜM BOYUTU</div>
        <div className="font-size-row">
          {["small","normal","large"].map(sz => (
            <button key={sz}
              className="fsz-btn"
              style={{
                background: s.fontSize===sz ? t.gold : t.bg,
                borderColor: s.fontSize===sz ? t.gold : t.border,
                color: s.fontSize===sz ? t.bg : t.muted,
              }}
              onClick={()=>set("fontSize",sz)}
            >
              {sz==="small" ? "Küçük" : sz==="normal" ? "Normal" : "Büyük"}
            </button>
          ))}
        </div>

        <div className="setup-summary" style={{color:t.muted}}>
          Açılamama cezası: <span style={{color:t.gold}}>{acilmamaCeza(s.isEsli,s.isRenkli)}</span>
        </div>

        <button className="start-btn"
          style={{background:t.gold, color:t.bg}}
          disabled={!ready} onClick={handleStart}>
          Oyunu Başlat →
        </button>
      </div>
    </div>
  );
}

// ─── CEZA ITEM ────────────────────────────────────────────────────────────────
function CezaItem({ elNo, sabitCeza, onSave, onRemove, t }) {
  const [val, setVal] = useState("");
  const [saved, setSaved] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => { if (!saved && inputRef.current) inputRef.current.focus(); }, [saved]);

  const displayVal = () => {
    const v = val.trim();
    if (v === "-") return sabitCeza ? "+101" : "−";
    return v;
  };

  const save = () => {
    if (val.trim() === "") { onRemove(); return; }
    setSaved(true);
    onSave(val.trim());
  };

  if (saved) {
    return (
      <div className="ceza-saved" onClick={onRemove} title="Sil">
        <span className="ceza-saved-elno" style={{color:t.muted}}>{elNo}</span>
        <span className="ceza-saved-val" style={{color:t.coral}}>{displayVal()}</span>
      </div>
    );
  }
  return (
    <input
      ref={inputRef}
      className="ceza-live-input"
      style={{background:t.loseBg, borderColor:t.coral, color:t.coral}}
      type="text" inputMode="decimal"
      placeholder={sabitCeza ? "− / sayı" : "sayı"}
      value={val}
      onChange={e => setVal(e.target.value)}
      onBlur={save}
      onKeyDown={e => { if (e.key==="Enter") save(); if (e.key==="Escape") onRemove(); }}
    />
  );
}

// ─── GAME ─────────────────────────────────────────────────────────────────────
function GameScreen({ config, onReset }) {
  const { isimler, isEsli, elSayisi, isRenkli, sabitCeza, barajli, kumulatif, fontSize, tema } = config;
  const t = THEMES[tema];
  const ceza0 = acilmamaCeza(isEsli, isRenkli);
  const cols = isEsli ? 2 : 4;

  const colNames = isEsli
    ? [`${isimler[0]} & ${isimler[2]}`, `${isimler[1]} & ${isimler[3]}`]
    : isimler;
  const subNames = isEsli
    ? [[isimler[0], isimler[2]], [isimler[1], isimler[3]]]
    : null;

  const [currentEl, setCurrentEl] = useState(0);
  const dealerIdx = currentEl % 4;
  const isSonEl = currentEl >= elSayisi - 1;
  const showTotals = kumulatif || isSonEl;

  const [elPuanlari, setElPuanlari] = useState(() =>
    Array.from({length:elSayisi}, () =>
      Array.from({length:cols}, () => isEsli ? ["",""] : "")
    )
  );
  const [esliLocked, setEsliLocked] = useState(() =>
    Array.from({length:elSayisi}, () => Array(cols).fill(false))
  );
  const [barajlar, setBarajlar] = useState(() => Array.from({length:cols},()=>[]));
  const barajId = useRef(0);
  const [cezalar, setCezalar] = useState(() => Array.from({length:cols},()=>[]));
  const cezaId = useRef(0);
  const [showReset, setShowReset] = useState(false);

  const fScale = fontSize==="small" ? 0.82 : fontSize==="large" ? 1.22 : 1;

  const parseEl = (v) => {
    if (!v && v!==0) return 0;
    const s = v.toString().trim();
    if (s==="") return 0;
    if (s==="-") return FINISH_VAL;
    const n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  };
  const parseCeza = (v) => {
    if (!v) return 0;
    const s = v.toString().trim();
    if (s==="") return 0;
    if (s==="-") return sabitCeza ? 101 : 0;
    const n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  };

  const elToplam = (col) =>
    elPuanlari.reduce((sum, row) => {
      if (isEsli) return sum + parseEl(row[col][0]) + parseEl(row[col][1]);
      return sum + parseEl(row[col]);
    }, 0);
  const barajToplam = (col) => barajlar[col].length * BARAJ_VAL;
  const cezaToplam  = (col) => cezalar[col].reduce((s,c)=>s+parseCeza(c.val),0);
  const genelToplam = (col) => elToplam(col) + barajToplam(col) + cezaToplam(col);

  const allTotals = Array.from({length:cols},(_,c)=>genelToplam(c));
  const minTotal  = Math.min(...allTotals);
  const maxTotal  = Math.max(...allTotals);
  const sorted    = [...allTotals].sort((a,b)=>b-a);

  const isDanger = (col) => {
    if (!isSonEl) return false;
    if (isEsli) return allTotals[col]===maxTotal;
    return allTotals[col] >= (sorted[1]??sorted[0]);
  };
  const isWinner = (col) => allTotals[col]===minTotal;
  const sonElFark = !isEsli && isSonEl && sorted.length>=2 ? sorted[0]-sorted[1] : null;

  const setElVal = (el, col, subIdx, val) => {
    setElPuanlari(prev => {
      const n = prev.map(r => r.map(c => isEsli ? [...c] : c));
      if (isEsli) n[el][col][subIdx] = val;
      else n[el][col] = val;
      return n;
    });
  };
  const lockEsli = (el, col) => {
    setEsliLocked(prev => { const n=prev.map(r=>[...r]); n[el][col]=true; return n; });
  };
  const unlockEsli = (el, col) => {
    setEsliLocked(prev => { const n=prev.map(r=>[...r]); n[el][col]=false; return n; });
  };
  const esliRowTotal = (el, col) =>
    parseEl(elPuanlari[el][col][0]) + parseEl(elPuanlari[el][col][1]);

  const addBaraj = (col) => {
    setBarajlar(prev => {
      const n=prev.map(r=>[...r]);
      n[col]=[...n[col],{elNo:currentEl+1,id:barajId.current++}];
      return n;
    });
  };
  const removeBaraj = (col,id) => {
    setBarajlar(prev=>{const n=prev.map(r=>[...r]);n[col]=n[col].filter(b=>b.id!==id);return n;});
  };
  const addCeza = (col) => {
    setCezalar(prev=>{
      const n=prev.map(r=>[...r]);
      n[col]=[...n[col],{elNo:currentEl+1,val:"",id:cezaId.current++}];
      return n;
    });
  };
  const saveCeza = (col,id,val) => {
    setCezalar(prev=>{const n=prev.map(r=>[...r]);n[col]=n[col].map(c=>c.id===id?{...c,val}:c);return n;});
  };
  const removeCeza = (col,id) => {
    setCezalar(prev=>{const n=prev.map(r=>[...r]);n[col]=n[col].filter(c=>c.id!==id);return n;});
  };

  const S = (styles) => styles; // inline style helper

  return (
    <div className="game-screen" style={{fontSize:`${fScale}rem`, background:t.bg, color:t.text}}>

      <div className="g-header" style={{background:t.surface, borderColor:t.border}}>
        <div className="g-logo" style={{color:t.white}}>OKEY <span style={{color:t.gold}}>[ 101+ ]</span></div>
        <div className="g-meta" style={{color:t.muted}}>
          {isEsli?"Eşli":"Tekli"} · {elSayisi} El · {isRenkli?"🟥":"⬜"} · <span style={{color:t.gold}}>{ceza0}</span>
        </div>
        <button className="reset-btn" style={{background:t.surf2, borderColor:t.border, color:t.muted}} onClick={()=>setShowReset(true)}>⟳</button>
      </div>

      {isSonEl && (
        <div className="last-el-bar" style={{background:t.loseBg, borderColor:t.coral, color:t.coral}}>
          ⚠️ Son El!
          {sonElFark!==null && <span style={{color:t.gold}}> · Fark: <b>{sonElFark}</b></span>}
        </div>
      )}

      {/* SABİT ÜST */}
      <div className="fixed-top" style={{borderColor:t.border2}}>
        <table className="main-table">
          <tbody>
            {barajli && (
              <tr style={{background:t.barajBg}}>
                <td className="side-lbl" style={{color:t.mint}}>BARAJ</td>
                {Array.from({length:cols},(_,c)=>(
                  <td key={c} className="baraj-cell">
                    <div className="chip-area">
                      {barajlar[c].map(b=>(
                        <span key={b.id} className="baraj-chip" onClick={()=>removeBaraj(c,b.id)}>
                          <sup className="chip-sup" style={{color:t.mint}}>{b.elNo}</sup>
                          <span className="chip-minus" style={{color:t.mint}}>−</span>
                        </span>
                      ))}
                      <button className="add-btn" style={{background:t.winBg, borderColor:t.mint, color:t.mint}} onClick={()=>addBaraj(c)}>
                        +{showTotals && barajlar[c].length>0 && <span className="btn-total">{barajToplam(c)}</span>}
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            )}

            <tr style={{background:t.surface}}>
              <td className="th-el" style={{background:t.surface}}/>
              {Array.from({length:cols},(_,c)=>(
                <td key={c} className="th-player"
                  style={{
                    background: isDanger(c) ? t.loseBg : isWinner(c) ? t.winBg : t.surface,
                    color: isDanger(c) ? t.coral : isWinner(c) ? t.mint : t.white,
                  }}>
                  {!isEsli ? (
                    dealerIdx===c
                      ? <span className="dealer-bubble" style={{background:t.mint, color:t.bg}}>{isimler[c]}</span>
                      : <span style={{color:t.white, fontSize:"11px", fontWeight:700}}>{isimler[c]}</span>
                  ) : (
                    <div className="esli-name-wrap">
                      {(c===0?[0,2]:[1,3]).map(mi=>(
                        dealerIdx===mi
                          ? <span key={mi} className="dealer-bubble" style={{background:t.mint, color:t.bg}}>{isimler[mi]}</span>
                          : <span key={mi} style={{color:t.white, fontSize:"11px", fontWeight:700}}>{isimler[mi]}</span>
                      ))}
                    </div>
                  )}
                </td>
              ))}
            </tr>

            {showTotals && (
              <tr style={{background:t.surf2}}>
                <td className="genel-lbl" style={{color:t.gold}}>TOP</td>
                {Array.from({length:cols},(_,c)=>(
                  <td key={c} className="genel-val"
                    style={{
                      fontSize:`${1.3*fScale}rem`,
                      color: isWinner(c) ? t.mint : isDanger(c) ? t.coral : t.white,
                      background: isWinner(c) ? t.winBg : isDanger(c) ? t.loseBg : t.surf2,
                    }}>
                    {genelToplam(c)}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* SCROLL: EL SATIRLARI */}
      <div className="scroll-area">
        <table className="main-table">
          <tbody>
            {Array.from({length:elSayisi},(_,el)=>(
              <tr key={el} style={{background: el===currentEl ? t.surf2 : el%2===0 ? t.bg : t.surface}}>
                <td className="td-el-num" style={{color: el===currentEl ? t.gold : t.border2}}>{el+1}</td>
                {Array.from({length:cols},(_,c)=>(
                  <td key={c} className="td-el-input">
                    {isEsli ? (
                      esliLocked[el][c] ? (
                        <div className="esli-locked" style={{color:t.gold, fontSize:`${1.05*fScale}rem`}} onClick={()=>unlockEsli(el,c)}>
                          {esliRowTotal(el,c)||"—"}
                        </div>
                      ) : (
                        <div className="esli-inputs">
                          <div className="esli-sub-row">
                            {[0,1].map(si=>(
                              <input key={si} className="el-sub-input"
                                style={{background:t.surf2, borderColor:t.border, color:t.gold}}
                                type="text" inputMode="decimal"
                                placeholder={subNames[c][si].substring(0,4)}
                                value={elPuanlari[el][c][si]}
                                onChange={e=>setElVal(el,c,si,e.target.value)}
                                onBlur={()=>{
                                  const v0=elPuanlari[el][c][0];
                                  const v1=elPuanlari[el][c][1];
                                  if(v0.trim()!==""&&v1.trim()!=="")
                                    setTimeout(()=>lockEsli(el,c),150);
                                }}
                              />
                            ))}
                          </div>
                          {(elPuanlari[el][c][0]||elPuanlari[el][c][1]) && (
                            <div className="esli-preview" style={{color:t.gold}}>{esliRowTotal(el,c)}</div>
                          )}
                        </div>
                      )
                    ) : (
                      <input className="el-input-field"
                        style={{color:t.gold, fontSize:`${1.05*fScale}rem`}}
                        type="text" inputMode="decimal" placeholder="—"
                        value={elPuanlari[el][c]}
                        onChange={e=>setElVal(el,c,0,e.target.value)}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SABİT ALT */}
      <div className="fixed-bottom" style={{borderColor:t.border2}}>
        <table className="main-table">
          <tbody>
            {showTotals && (
              <tr style={{background:t.surf2}}>
                <td className="std-lbl" style={{color:t.muted}}>El</td>
                {Array.from({length:cols},(_,c)=>(
                  <td key={c} className="std-val" style={{color:t.muted, fontSize:`${1.05*fScale}rem`}}>{elToplam(c)}</td>
                ))}
              </tr>
            )}

            <tr style={{background:t.cezaBg}}>
              <td className="side-lbl" style={{color:t.coral}}>CEZA</td>
              {Array.from({length:cols},(_,c)=>(
                <td key={c} className="ceza-cell">
                  <div className="chip-area">
                    {cezalar[c].map(cz=>(
                      <CezaItem key={cz.id} elNo={cz.elNo} sabitCeza={sabitCeza} t={t}
                        onSave={val=>saveCeza(c,cz.id,val)}
                        onRemove={()=>removeCeza(c,cz.id)}
                      />
                    ))}
                    <button className="add-btn"
                      style={{background:t.loseBg, borderColor:t.coral, color:t.coral}}
                      onClick={()=>addCeza(c)}>
                      +{showTotals && cezaToplam(c)!==0 && <span className="btn-total">{cezaToplam(c)}</span>}
                    </button>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* EL NAV */}
      <div className="el-nav" style={{background:t.surface, borderColor:t.border}}>
        <button className="nav-btn" style={{background:t.surf2, borderColor:t.border, color:t.gold}}
          disabled={currentEl===0} onClick={()=>setCurrentEl(e=>e-1)}>◀</button>
        <div className="el-nav-center">
          <span className="el-nav-num" style={{color:t.muted}}>El {currentEl+1} / {elSayisi}</span>
          <span style={{fontSize:"11px", color:t.mint, fontWeight:600}}>🃏 {isimler[dealerIdx]}</span>
        </div>
        <button className="nav-btn" style={{background:t.surf2, borderColor:t.border, color:t.gold}}
          disabled={currentEl>=elSayisi-1} onClick={()=>setCurrentEl(e=>e+1)}>▶</button>
      </div>

      {/* RESET MODAL */}
      {showReset && (
        <div className="modal-overlay" onClick={()=>setShowReset(false)}>
          <div className="modal-box" style={{background:t.surface, borderColor:t.border}} onClick={e=>e.stopPropagation()}>
            <div className="modal-title" style={{color:t.white}}>Oyunu Sıfırla</div>
            <div className="modal-sub" style={{color:t.muted}}>Tüm puanlar silinecek. Emin misin?</div>
            <div className="modal-btns">
              <button className="modal-cancel" style={{background:t.surf2, borderColor:t.border, color:t.muted}}
                onClick={()=>setShowReset(false)}>İptal</button>
              <button className="modal-confirm" style={{background:t.coral, color:t.white}}
                onClick={onReset}>Sıfırla</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [config, setConfig] = useState(null);
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Sora',sans-serif;min-height:100vh;}

        .setup-screen{min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:36px 16px 48px;}
        .app-logo{font-size:26px;font-weight:800;letter-spacing:5px;margin-bottom:28px;}
        .setup-card{width:100%;max-width:420px;border:1px solid;border-radius:20px;padding:24px 18px;display:flex;flex-direction:column;gap:14px;}
        .sec-title{font-size:10px;font-weight:700;letter-spacing:2px;}
        .team-hint{font-size:11px;margin-top:-6px;}
        .player-grid{display:flex;flex-direction:column;gap:8px;}
        .player-field{display:flex;align-items:center;gap:10px;}
        .pf-badge{width:28px;font-size:12px;font-weight:700;text-align:center;flex-shrink:0;}
        .pf-input{flex:1;border:1.5px solid;border-radius:10px;font-family:'Sora',sans-serif;font-size:14px;font-weight:600;padding:10px 14px;outline:none;}
        .divider{height:1px;margin:2px 0;}
        .toggle-row{display:flex;align-items:center;justify-content:space-between;gap:12px;}
        .toggle-label{font-size:13px;font-weight:600;flex:1;}
        .toggle-group{display:flex;border-radius:10px;overflow:hidden;border:1.5px solid #333;flex-shrink:0;}
        .tgl{background:#111;border:none;color:#666;font-family:'Sora',sans-serif;font-size:11px;font-weight:600;padding:8px 12px;cursor:pointer;transition:all 0.18s;white-space:nowrap;}
        .tgl.on{background:#f0c060;color:#111;}
        .el-count-input{border:1.5px solid;border-radius:10px;font-family:'JetBrains Mono',monospace;font-size:16px;font-weight:700;padding:8px 14px;width:80px;text-align:center;outline:none;}

        .tema-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
        .tema-btn{border:1.5px solid;border-radius:10px;font-family:'Sora',sans-serif;font-size:12px;font-weight:600;padding:10px 8px;cursor:pointer;transition:all 0.18s;}

        .font-size-row{display:flex;gap:8px;}
        .fsz-btn{flex:1;border:1.5px solid;border-radius:10px;font-family:'Sora',sans-serif;font-size:12px;font-weight:600;padding:9px 6px;cursor:pointer;}
        .setup-summary{font-size:12px;text-align:center;}
        .start-btn{border:none;border-radius:12px;font-family:'Sora',sans-serif;font-size:15px;font-weight:800;padding:14px;cursor:pointer;letter-spacing:1px;}
        .start-btn:disabled{opacity:0.35;cursor:not-allowed;}

        .game-screen{height:100vh;display:flex;flex-direction:column;overflow:hidden;}
        .g-header{border-bottom:1px solid;padding:10px 14px;display:flex;align-items:center;gap:10px;flex-shrink:0;}
        .g-logo{font-size:14px;font-weight:800;letter-spacing:3px;flex:1;}
        .g-meta{font-size:10px;}
        .reset-btn{border:1px solid;border-radius:8px;font-size:16px;width:30px;height:30px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .last-el-bar{border-bottom:1px solid;padding:6px 14px;font-size:12px;font-weight:600;flex-shrink:0;}
        .fixed-top{flex-shrink:0;border-bottom:2px solid;}
        .fixed-bottom{flex-shrink:0;border-top:2px solid;}
        .scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;}
        .main-table{width:100%;border-collapse:collapse;}
        .main-table td{border:1px solid #2e3558;}

        .side-lbl{font-size:7px;font-weight:700;letter-spacing:1px;text-align:center;padding:4px 2px;vertical-align:middle;width:28px;writing-mode:vertical-rl;}
        .baraj-cell,.ceza-cell{padding:4px 6px;vertical-align:middle;}
        .chip-area{display:flex;flex-wrap:wrap;gap:3px;align-items:center;min-height:22px;}
        .baraj-chip{position:relative;display:inline-flex;align-items:center;cursor:pointer;user-select:none;}
        .chip-sup{position:absolute;top:-3px;left:0;font-size:7px;font-weight:700;font-family:'JetBrains Mono',monospace;line-height:1;}
        .chip-minus{font-size:17px;font-weight:700;font-family:'JetBrains Mono',monospace;padding-left:7px;line-height:1;}
        .add-btn{display:inline-flex;align-items:center;gap:4px;border-radius:6px;font-size:11px;font-weight:700;padding:2px 7px;cursor:pointer;border:1px dashed;white-space:nowrap;font-family:'JetBrains Mono',monospace;}
        .btn-total{font-size:11px;font-weight:800;padding:0 4px;border-radius:4px;background:rgba(255,255,255,0.08);}

        .th-el{width:28px;}
        .th-player{font-size:11px;font-weight:700;padding:7px 4px;text-align:center;}
        .esli-name-wrap{display:flex;gap:4px;justify-content:center;flex-wrap:wrap;}
        .dealer-bubble{border-radius:20px;padding:2px 8px;font-size:10px;font-weight:800;display:inline-block;}

        .genel-lbl{font-size:8px;font-weight:800;text-align:center;padding:6px 2px;letter-spacing:1px;}
        .genel-val{font-family:'JetBrains Mono',monospace;font-weight:800;text-align:center;padding:6px 4px;}

        .td-el-num{font-size:9px;font-weight:700;text-align:center;padding:3px 2px;font-family:'JetBrains Mono',monospace;vertical-align:middle;width:28px;}
        .td-el-input{padding:2px 3px;vertical-align:middle;}
        .el-input-field{width:100%;background:transparent;border:none;font-family:'JetBrains Mono',monospace;font-weight:700;text-align:center;padding:6px 2px;outline:none;}
        .el-input-field::placeholder{color:#333;}

        .esli-inputs{display:flex;flex-direction:column;gap:2px;padding:2px;}
        .esli-sub-row{display:flex;gap:2px;}
        .el-sub-input{flex:1;border:1px solid;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;text-align:center;padding:3px 1px;outline:none;min-width:0;}
        .el-sub-input::placeholder{font-size:8px;}
        .esli-preview{text-align:center;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:800;opacity:0.5;}
        .esli-locked{text-align:center;font-family:'JetBrains Mono',monospace;font-weight:800;padding:5px 2px;cursor:pointer;}

        .std-lbl{font-size:8px;font-weight:700;text-align:center;padding:5px 2px;}
        .std-val{font-family:'JetBrains Mono',monospace;font-weight:700;text-align:center;padding:5px 4px;}

        .ceza-live-input{border:1.5px solid;border-radius:6px;font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;width:64px;padding:3px 6px;text-align:center;outline:none;}
        .ceza-saved{position:relative;display:inline-flex;flex-direction:column;align-items:center;cursor:pointer;margin:0 2px;}
        .ceza-saved-elno{font-size:7px;font-weight:700;font-family:'JetBrains Mono',monospace;line-height:1;align-self:flex-start;}
        .ceza-saved-val{font-size:14px;font-weight:700;font-family:'JetBrains Mono',monospace;line-height:1.2;}
        .ceza-saved:active{opacity:0.5;}

        .el-nav{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-top:1px solid;flex-shrink:0;gap:12px;}
        .nav-btn{border:1.5px solid;border-radius:10px;font-size:16px;width:42px;height:42px;cursor:pointer;display:flex;align-items:center;justify-content:center;}
        .nav-btn:disabled{opacity:0.25;cursor:not-allowed;}
        .el-nav-center{display:flex;flex-direction:column;align-items:center;gap:2px;}
        .el-nav-num{font-size:13px;font-weight:700;font-family:'JetBrains Mono',monospace;}

        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:100;}
        .modal-box{border:1px solid;border-radius:18px;padding:28px 24px;max-width:300px;width:90%;display:flex;flex-direction:column;gap:12px;}
        .modal-title{font-size:18px;font-weight:800;}
        .modal-sub{font-size:13px;}
        .modal-btns{display:flex;gap:10px;margin-top:6px;}
        .modal-cancel{flex:1;border:1.5px solid;border-radius:10px;font-family:'Sora',sans-serif;font-size:14px;font-weight:600;padding:11px;cursor:pointer;}
        .modal-confirm{flex:1;border:none;border-radius:10px;font-family:'Sora',sans-serif;font-size:14px;font-weight:700;padding:11px;cursor:pointer;}
      `}</style>

      {!config
        ? <SetupScreen onStart={setConfig}/>
        : <GameScreen config={config} onReset={()=>setConfig(null)}/>
      }
    </>
  );
}
