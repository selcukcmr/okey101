import { useState, useRef, useEffect } from "react";

const BARAJ_VAL = -101;
const FINISH_VAL = -101;

function acilmamaCeza(isEsli, isRenkli) {
  if (!isRenkli) return isEsli ? 400 : 200;
  return isEsli ? 800 : 400;
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
  });
  const set = (k, v) => setS((p) => ({ ...p, [k]: v }));
  const ready = s.elSayisi >= 1 && s.isimler.some((n) => n.trim().length > 0);

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
    <div className="setup-screen">
      <div className="app-logo">OKEY <span className="gold">[ 101+ ]</span></div>
      <div className="setup-card">
        <div className="sec-title">OYUNCULAR</div>
        {s.isEsli && <div className="team-hint">🟢 1 &amp; 3 Takım · 🔵 2 &amp; 4 Takım</div>}
        <div className="player-grid">
          {[0,1,2,3].map(i => (
            <div key={i} className="player-field">
              <span className="pf-badge">
                {s.isEsli ? (i===0||i===2 ? "🟢" : "🔵") : `${i+1}`}
              </span>
              <input
                className="pf-input"
                placeholder={`Oyuncu ${i+1}`}
                value={s.isimler[i]}
                onChange={e => { const a=[...s.isimler]; a[i]=e.target.value; set("isimler",a); }}
              />
            </div>
          ))}
        </div>
        <div className="divider"/>
        <Toggle label="Oyun Tipi"  sub0="Tekli"      sub1="Eşli"      val={s.isEsli}     onChange={v=>set("isEsli",v)}/>
        <Toggle label="Taş Rengi"  sub0="⬜ Renksiz" sub1="🟥 Renkli" val={s.isRenkli}   onChange={v=>set("isRenkli",v)}/>
        <Toggle label="Ceza Tipi"  sub0="Sabit −101" sub1="Değişken"  val={!s.sabitCeza} onChange={v=>set("sabitCeza",!v)}/>
        <Toggle label="Baraj"      sub0="Barajsız"   sub1="Barajlı"   val={s.barajli}    onChange={v=>set("barajli",v)}/>
        <Toggle label="Toplam"     sub0="Son El"     sub1="Kümülatif" val={s.kumulatif}  onChange={v=>set("kumulatif",v)}/>
        <div className="divider"/>
        <div className="toggle-row">
          <span className="toggle-label">Kaç El?</span>
          <input
            className="el-count-input" type="number" min="1" max="50" placeholder="8"
            value={s.elSayisi} onChange={e=>set("elSayisi",e.target.value)}
          />
        </div>
        <div className="divider"/>
        <div className="sec-title">GÖRÜNÜM BOYUTU</div>
        <div className="font-size-row">
          {["small","normal","large"].map(sz => (
            <button key={sz} className={`fsz-btn ${s.fontSize===sz?"on":""}`} onClick={()=>set("fontSize",sz)}>
              {sz==="small" ? "Küçük" : sz==="normal" ? "Normal" : "Büyük"}
            </button>
          ))}
        </div>
        <div className="setup-summary">
          Açılamama cezası: <span className="gold">{acilmamaCeza(s.isEsli,s.isRenkli)}</span>
        </div>
        <button className="start-btn" disabled={!ready} onClick={handleStart}>
          Oyunu Başlat →
        </button>
      </div>
    </div>
  );
}

// ─── CEZA ITEM ────────────────────────────────────────────────────────────────
function CezaItem({ elNo, sabitCeza, onSave, onRemove }) {
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
        <span className="ceza-saved-elno">{elNo}</span>
        <span className="ceza-saved-val">{displayVal()}</span>
      </div>
    );
  }
  return (
    <input
      ref={inputRef}
      className="ceza-live-input"
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
  const { isimler, isEsli, elSayisi, isRenkli, sabitCeza, barajli, kumulatif, fontSize } = config;
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
  // Toplam göster: kümülatif ise her zaman, değilse sadece son elde
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

  // ── Parse ──
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

  // ── Totals ──
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

  // ── Setters ──
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

  return (
    <div className="game-screen" style={{fontSize:`${fScale}rem`}}>

      {/* ── HEADER ── */}
      <div className="g-header">
        <div className="g-logo">OKEY <span className="gold">[ 101+ ]</span></div>
        <div className="g-meta">
          {isEsli?"Eşli":"Tekli"} · {elSayisi} El · {isRenkli?"🟥":"⬜"} · <span className="gold">{ceza0}</span>
        </div>
        <button className="reset-btn" onClick={()=>setShowReset(true)}>⟳</button>
      </div>

      {isSonEl && (
        <div className="last-el-bar">
          ⚠️ Son El!
          {sonElFark!==null && <span className="fark-text"> · Fark: <b>{sonElFark}</b></span>}
        </div>
      )}

      {/* ══ SABİT ÜST: BARAJ + İSİMLER + GENEL TOPLAM ══ */}
      <div className="fixed-top">
        <table className="main-table">
          <tbody>

            {/* BARAJ */}
            {barajli && (
              <tr className="baraj-row">
                <td className="side-lbl mint-text">BARAJ</td>
                {Array.from({length:cols},(_,c)=>(
                  <td key={c} className="baraj-cell">
                    <div className="chip-area">
                      {barajlar[c].map(b=>(
                        <span key={b.id} className="baraj-chip" onClick={()=>removeBaraj(c,b.id)}>
                          <sup className="chip-sup">{b.elNo}</sup>
                          <span className="chip-minus">−</span>
                        </span>
                      ))}
                      <button className="add-btn mint-btn" onClick={()=>addBaraj(c)}>
                        +{showTotals && barajlar[c].length>0
                          ? <span className="btn-total">{barajToplam(c)}</span>
                          : null
                        }
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            )}

            {/* İSİMLER */}
            <tr className="name-row">
              <td className="th-el"/>
              {Array.from({length:cols},(_,c)=>(
                <td key={c} className={`th-player ${isDanger(c)?"danger":""} ${isWinner(c)?"winner":""}`}>
                  {!isEsli ? (
                    dealerIdx===c
                      ? <span className="dealer-bubble">{isimler[c]}</span>
                      : <span className="plain-name">{isimler[c]}</span>
                  ) : (
                    <div className="esli-name-wrap">
                      {(c===0?[0,2]:[1,3]).map(mi=>(
                        <span key={mi} className={dealerIdx===mi?"dealer-bubble":"plain-name"}>
                          {isimler[mi]}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
              ))}
            </tr>

            {/* GENEL TOPLAM — sadece showTotals ise göster */}
            {showTotals && (
              <tr className="genel-row">
                <td className="genel-lbl">TOP</td>
                {Array.from({length:cols},(_,c)=>(
                  <td key={c}
                    className={`genel-val ${isWinner(c)?"win":""} ${isDanger(c)?"lose":""}`}
                    style={{fontSize:`${1.3*fScale}rem`}}>
                    {genelToplam(c)}
                  </td>
                ))}
              </tr>
            )}

          </tbody>
        </table>
      </div>

      {/* ══ SCROLL: EL SATIRLARI ══ */}
      <div className="scroll-area">
        <table className="main-table">
          <tbody>
            {Array.from({length:elSayisi},(_,el)=>(
              <tr key={el} className={`el-row ${el===currentEl?"active-el":""} ${el%2===0?"even":"odd"}`}>
                <td className="td-el-num">{el+1}</td>
                {Array.from({length:cols},(_,c)=>(
                  <td key={c} className="td-el-input">
                    {isEsli ? (
                      esliLocked[el][c] ? (
                        <div className="esli-locked" onClick={()=>unlockEsli(el,c)}
                          style={{fontSize:`${1.05*fScale}rem`}}>
                          {esliRowTotal(el,c)||"—"}
                        </div>
                      ) : (
                        <div className="esli-inputs">
                          <div className="esli-sub-row">
                            {[0,1].map(si=>(
                              <input key={si} className="el-sub-input"
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
                            <div className="esli-preview">{esliRowTotal(el,c)}</div>
                          )}
                        </div>
                      )
                    ) : (
                      <input className="el-input-field"
                        type="text" inputMode="decimal" placeholder="—"
                        value={elPuanlari[el][c]}
                        onChange={e=>setElVal(el,c,0,e.target.value)}
                        style={{fontSize:`${1.05*fScale}rem`}}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ══ SABİT ALT: EL TOP + CEZA ══ */}
      <div className="fixed-bottom">
        <table className="main-table">
          <tbody>

            {/* El toplam — sadece showTotals */}
            {showTotals && (
              <tr className="subtotal-row">
                <td className="std-lbl">El</td>
                {Array.from({length:cols},(_,c)=>(
                  <td key={c} className="std-val" style={{fontSize:`${1.05*fScale}rem`}}>
                    {elToplam(c)}
                  </td>
                ))}
              </tr>
            )}

            {/* CEZA — her zaman görünür (giriş için), toplam sadece showTotals */}
            <tr className="ceza-row">
              <td className="side-lbl coral-text">CEZA</td>
              {Array.from({length:cols},(_,c)=>(
                <td key={c} className="ceza-cell">
                  <div className="chip-area">
                    {cezalar[c].map(cz=>(
                      <CezaItem key={cz.id} elNo={cz.elNo} sabitCeza={sabitCeza}
                        onSave={val=>saveCeza(c,cz.id,val)}
                        onRemove={()=>removeCeza(c,cz.id)}
                      />
                    ))}
                    <button className="add-btn coral-btn" onClick={()=>addCeza(c)}>
                      +{showTotals && cezaToplam(c)!==0
                        ? <span className="btn-total">{cezaToplam(c)}</span>
                        : null
                      }
                    </button>
                  </div>
                </td>
              ))}
            </tr>

          </tbody>
        </table>
      </div>

      {/* ── EL NAV ── */}
      <div className="el-nav">
        <button className="nav-btn" disabled={currentEl===0} onClick={()=>setCurrentEl(e=>e-1)}>◀</button>
        <div className="el-nav-center">
          <span className="el-nav-num">El {currentEl+1} / {elSayisi}</span>
          <span className="dealer-name">🃏 {isimler[dealerIdx]}</span>
        </div>
        <button className="nav-btn" disabled={currentEl>=elSayisi-1} onClick={()=>setCurrentEl(e=>e+1)}>▶</button>
      </div>

      {/* ── RESET MODAL ── */}
      {showReset && (
        <div className="modal-overlay" onClick={()=>setShowReset(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">Oyunu Sıfırla</div>
            <div className="modal-sub">Tüm puanlar silinecek. Emin misin?</div>
            <div className="modal-btns">
              <button className="modal-cancel" onClick={()=>setShowReset(false)}>İptal</button>
              <button className="modal-confirm" onClick={onReset}>Sıfırla</button>
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

        :root {
          --bg:      #1a1f35;
          --surface: #222840;
          --surf2:   #2a3050;
          --border:  #2e3558;
          --border2: #3a4068;
          --gold:    #f0c060;
          --mint:    #60d4a0;
          --coral:   #f08080;
          --white:   #ffffff;
          --muted:   #6a7298;
          --text:    #c8d0e8;
        }

        body{font-family:'Sora',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;}
        .gold{color:var(--gold);}
        .mint-text{color:var(--mint);}
        .coral-text{color:var(--coral);}

        /* ── SETUP ── */
        .setup-screen{
          min-height:100vh;display:flex;flex-direction:column;align-items:center;
          padding:36px 16px 48px;
          background:radial-gradient(ellipse at 50% 0%,#1e2545 0%,var(--bg) 70%);
        }
        .app-logo{font-size:26px;font-weight:800;letter-spacing:5px;color:var(--white);margin-bottom:28px;}
        .setup-card{
          width:100%;max-width:420px;background:var(--surface);border:1px solid var(--border);
          border-radius:20px;padding:24px 18px;display:flex;flex-direction:column;gap:14px;
        }
        .sec-title{font-size:10px;font-weight:700;letter-spacing:2px;color:var(--gold);}
        .team-hint{font-size:11px;color:var(--muted);margin-top:-6px;}
        .player-grid{display:flex;flex-direction:column;gap:8px;}
        .player-field{display:flex;align-items:center;gap:10px;}
        .pf-badge{width:28px;font-size:12px;font-weight:700;color:var(--gold);text-align:center;flex-shrink:0;}
        .pf-input{
          flex:1;background:var(--bg);border:1.5px solid var(--border);border-radius:10px;
          color:var(--white);font-family:'Sora',sans-serif;font-size:14px;font-weight:600;
          padding:10px 14px;outline:none;transition:border-color 0.18s;
        }
        .pf-input:focus{border-color:var(--gold);}
        .divider{height:1px;background:var(--border);margin:2px 0;}
        .toggle-row{display:flex;align-items:center;justify-content:space-between;gap:12px;}
        .toggle-label{font-size:13px;font-weight:600;color:var(--muted);flex:1;}
        .toggle-group{display:flex;border-radius:10px;overflow:hidden;border:1.5px solid var(--border);flex-shrink:0;}
        .tgl{
          background:var(--bg);border:none;color:var(--muted);
          font-family:'Sora',sans-serif;font-size:11px;font-weight:600;
          padding:8px 12px;cursor:pointer;transition:all 0.18s;white-space:nowrap;
        }
        .tgl.on{background:var(--gold);color:var(--bg);}
        .el-count-input{
          background:var(--bg);border:1.5px solid var(--border);border-radius:10px;
          color:var(--white);font-family:'JetBrains Mono',monospace;
          font-size:16px;font-weight:700;padding:8px 14px;width:80px;text-align:center;outline:none;
        }
        .el-count-input:focus{border-color:var(--gold);}
        .font-size-row{display:flex;gap:8px;}
        .fsz-btn{
          flex:1;background:var(--bg);border:1.5px solid var(--border);border-radius:10px;
          color:var(--muted);font-family:'Sora',sans-serif;font-size:12px;font-weight:600;
          padding:9px 6px;cursor:pointer;transition:all 0.18s;
        }
        .fsz-btn.on{background:var(--gold);color:var(--bg);border-color:var(--gold);}
        .setup-summary{font-size:12px;color:var(--muted);text-align:center;}
        .start-btn{
          background:var(--gold);border:none;border-radius:12px;color:var(--bg);
          font-family:'Sora',sans-serif;font-size:15px;font-weight:800;padding:14px;
          cursor:pointer;letter-spacing:1px;transition:opacity 0.18s;
        }
        .start-btn:disabled{opacity:0.35;cursor:not-allowed;}

        /* ── GAME LAYOUT ── */
        .game-screen{height:100vh;display:flex;flex-direction:column;background:var(--bg);overflow:hidden;}
        .g-header{
          background:var(--surface);border-bottom:1px solid var(--border);
          padding:10px 14px;display:flex;align-items:center;gap:10px;flex-shrink:0;
        }
        .g-logo{font-size:14px;font-weight:800;letter-spacing:3px;color:var(--white);flex:1;}
        .g-meta{font-size:10px;color:var(--muted);}
        .reset-btn{
          background:var(--surf2);border:1px solid var(--border);border-radius:8px;
          color:var(--muted);font-size:16px;width:30px;height:30px;cursor:pointer;
          display:flex;align-items:center;justify-content:center;flex-shrink:0;
        }
        .last-el-bar{
          background:#2a1e1e;border-bottom:1px solid #4a2a2a;
          padding:6px 14px;font-size:12px;color:var(--coral);font-weight:600;flex-shrink:0;
        }
        .fark-text{color:var(--gold);}

        .fixed-top{flex-shrink:0;border-bottom:2px solid var(--border2);}
        .fixed-bottom{flex-shrink:0;border-top:2px solid var(--border2);}
        .scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;}

        .main-table{width:100%;border-collapse:collapse;}
        .main-table td{border:1px solid var(--border);}

        /* Baraj */
        .baraj-row{background:var(--surf2);}
        .side-lbl{
          font-size:7px;font-weight:700;letter-spacing:1px;text-align:center;
          padding:4px 2px;vertical-align:middle;width:28px;writing-mode:vertical-rl;
        }
        .baraj-cell,.ceza-cell{padding:4px 6px;vertical-align:middle;}
        .chip-area{display:flex;flex-wrap:wrap;gap:3px;align-items:center;min-height:22px;}

        .baraj-chip{position:relative;display:inline-flex;align-items:center;cursor:pointer;user-select:none;}
        .chip-sup{
          position:absolute;top:-3px;left:0;
          font-size:7px;font-weight:700;color:var(--mint);
          font-family:'JetBrains Mono',monospace;line-height:1;
        }
        .chip-minus{
          font-size:17px;font-weight:700;color:var(--mint);
          font-family:'JetBrains Mono',monospace;padding-left:7px;line-height:1;
        }

        .add-btn{
          display:inline-flex;align-items:center;gap:4px;
          border-radius:6px;font-size:11px;font-weight:700;
          padding:2px 7px;cursor:pointer;border:1px dashed;white-space:nowrap;
          font-family:'JetBrains Mono',monospace;
        }
        .mint-btn{background:#1a2e28;border-color:#2a6a50;color:var(--mint);}
        .coral-btn{background:#2e1a1a;border-color:#6a2a2a;color:var(--coral);}
        .btn-total{
          font-size:11px;font-weight:800;
          padding:0 4px;border-radius:4px;
          background:rgba(255,255,255,0.08);
        }

        /* İsim satırı */
        .name-row{background:var(--surface);}
        .th-el{width:28px;background:var(--surface);}
        .th-player{
          background:var(--surface);font-size:11px;font-weight:700;
          padding:7px 4px;text-align:center;
        }
        .th-player.danger{background:#2a1e1e;color:var(--coral);}
        .th-player.winner{background:#1a2a24;color:var(--mint);}
        .esli-name-wrap{display:flex;gap:4px;justify-content:center;flex-wrap:wrap;}
        .plain-name{font-size:11px;font-weight:700;color:var(--white);}
        .dealer-bubble{
          background:var(--mint);color:var(--bg);border-radius:20px;
          padding:2px 8px;font-size:10px;font-weight:800;display:inline-block;
        }

        /* Genel toplam */
        .genel-row{background:var(--surf2);}
        .genel-lbl{font-size:8px;font-weight:800;color:var(--gold);text-align:center;padding:6px 2px;letter-spacing:1px;}
        .genel-val{
          font-family:'JetBrains Mono',monospace;font-weight:800;
          text-align:center;padding:6px 4px;color:var(--white);
        }
        .genel-val.win{color:var(--mint);background:#1a2a24;}
        .genel-val.lose{color:var(--coral);background:#2a1a1a;}

        /* El satırları */
        .el-row.even{background:var(--bg);}
        .el-row.odd{background:var(--surface);}
        .el-row.active-el{background:#1e2440;}
        .td-el-num{
          font-size:9px;font-weight:700;color:var(--border2);text-align:center;
          padding:3px 2px;font-family:'JetBrains Mono',monospace;vertical-align:middle;width:28px;
        }
        .el-row.active-el .td-el-num{color:var(--gold);}
        .td-el-input{padding:2px 3px;vertical-align:middle;}
        .el-input-field{
          width:100%;background:transparent;border:none;color:var(--gold);
          font-family:'JetBrains Mono',monospace;font-weight:700;
          text-align:center;padding:6px 2px;outline:none;
        }
        .el-input-field:focus{background:var(--surf2);border-radius:5px;}
        .el-input-field::placeholder{color:var(--border2);}

        /* Eşli */
        .esli-inputs{display:flex;flex-direction:column;gap:2px;padding:2px;}
        .esli-sub-row{display:flex;gap:2px;}
        .el-sub-input{
          flex:1;background:var(--surf2);border:1px solid var(--border);border-radius:4px;
          color:var(--gold);font-family:'JetBrains Mono',monospace;
          font-size:11px;font-weight:700;text-align:center;padding:3px 1px;outline:none;min-width:0;
        }
        .el-sub-input:focus{border-color:var(--gold);}
        .el-sub-input::placeholder{color:var(--border2);font-size:8px;}
        .esli-preview{
          text-align:center;font-family:'JetBrains Mono',monospace;
          font-size:11px;font-weight:800;color:var(--gold);opacity:0.5;
        }
        .esli-locked{
          text-align:center;font-family:'JetBrains Mono',monospace;
          font-weight:800;color:var(--gold);padding:5px 2px;cursor:pointer;
        }

        /* Subtotals */
        .subtotal-row{background:var(--surf2);}
        .std-lbl{font-size:8px;font-weight:700;color:var(--muted);text-align:center;padding:5px 2px;}
        .std-val{font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--muted);text-align:center;padding:5px 4px;}

        /* Ceza */
        .ceza-row{background:#1e1828;}
        .ceza-live-input{
          background:#2e1a1e;border:1.5px solid var(--coral);border-radius:6px;
          color:var(--coral);font-family:'JetBrains Mono',monospace;
          font-size:13px;font-weight:700;width:64px;padding:3px 6px;
          text-align:center;outline:none;
        }
        .ceza-saved{
          position:relative;display:inline-flex;flex-direction:column;
          align-items:center;cursor:pointer;margin:0 2px;
        }
        .ceza-saved-elno{
          font-size:7px;font-weight:700;color:var(--muted);
          font-family:'JetBrains Mono',monospace;line-height:1;align-self:flex-start;
        }
        .ceza-saved-val{
          font-size:14px;font-weight:700;color:var(--coral);
          font-family:'JetBrains Mono',monospace;line-height:1.2;
        }
        .ceza-saved:active{opacity:0.5;}

        /* El nav */
        .el-nav{
          display:flex;align-items:center;justify-content:space-between;
          padding:10px 16px;background:var(--surface);border-top:1px solid var(--border);
          flex-shrink:0;gap:12px;
        }
        .nav-btn{
          background:var(--surf2);border:1.5px solid var(--border);border-radius:10px;
          color:var(--gold);font-size:16px;width:42px;height:42px;cursor:pointer;
          display:flex;align-items:center;justify-content:center;transition:all 0.15s;
        }
        .nav-btn:hover:not(:disabled){border-color:var(--gold);}
        .nav-btn:disabled{opacity:0.25;cursor:not-allowed;}
        .el-nav-center{display:flex;flex-direction:column;align-items:center;gap:2px;}
        .el-nav-num{font-size:13px;font-weight:700;color:var(--muted);font-family:'JetBrains Mono',monospace;}
        .dealer-name{font-size:11px;color:var(--mint);font-weight:600;}

        /* Modal */
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:100;}
        .modal-box{
          background:var(--surface);border:1px solid var(--border);border-radius:18px;
          padding:28px 24px;max-width:300px;width:90%;display:flex;flex-direction:column;gap:12px;
        }
        .modal-title{font-size:18px;font-weight:800;color:var(--white);}
        .modal-sub{font-size:13px;color:var(--muted);}
        .modal-btns{display:flex;gap:10px;margin-top:6px;}
        .modal-cancel{
          flex:1;background:var(--surf2);border:1.5px solid var(--border);border-radius:10px;
          color:var(--muted);font-family:'Sora',sans-serif;font-size:14px;font-weight:600;padding:11px;cursor:pointer;
        }
        .modal-confirm{
          flex:1;background:var(--coral);border:none;border-radius:10px;color:var(--white);
          font-family:'Sora',sans-serif;font-size:14px;font-weight:700;padding:11px;cursor:pointer;
        }
      `}</style>

      {!config
        ? <SetupScreen onStart={setConfig}/>
        : <GameScreen config={config} onReset={()=>setConfig(null)}/>
      }
    </>
  );
}
