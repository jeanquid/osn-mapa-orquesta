import { useState, useMemo, useCallback, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════════════
   DATA — 105 cargos exactos de la OSN (Decreto 669/22)
   ═══════════════════════════════════════════════════ */
const CARGOS = [
  // ── ROL 1 (2) ──
  { id:1, cargo:"1er. 1er. Violín (Concertino A)", rol:1, familia:"Cuerdas", grupo:"1ros. Violines" },
  { id:2, cargo:"2do. 1er. Violín (Concertino B)", rol:1, familia:"Cuerdas", grupo:"1ros. Violines" },
  // ── ROL 2 — Cuerdas (10) ──
  { id:3, cargo:"3er. 1er. Violín (Suplente de Concertino)", rol:2, familia:"Cuerdas", grupo:"1ros. Violines" },
  { id:4, cargo:"4to. 1er. Violín (Suplente de Concertino)", rol:2, familia:"Cuerdas", grupo:"1ros. Violines" },
  { id:5, cargo:"1er. 2do. Violín (Solista A)", rol:2, familia:"Cuerdas", grupo:"2dos. Violines" },
  { id:6, cargo:"2do. 2do. Violín (Solista B)", rol:2, familia:"Cuerdas", grupo:"2dos. Violines" },
  { id:7, cargo:"1ra. Viola (Solista A)", rol:2, familia:"Cuerdas", grupo:"Violas" },
  { id:8, cargo:"2da. Viola (Solista B)", rol:2, familia:"Cuerdas", grupo:"Violas" },
  { id:9, cargo:"1er. Violoncelo (Solista A)", rol:2, familia:"Cuerdas", grupo:"Violoncelos" },
  { id:10, cargo:"2do. Violoncelo (Solista B)", rol:2, familia:"Cuerdas", grupo:"Violoncelos" },
  { id:11, cargo:"1er. Contrabajo (Solista A)", rol:2, familia:"Cuerdas", grupo:"Contrabajos" },
  { id:12, cargo:"2do. Contrabajo (Solista B)", rol:2, familia:"Cuerdas", grupo:"Contrabajos" },
  // ── ROL 2 — Maderas (8) ──
  { id:13, cargo:"1ra. Flauta (Solista A)", rol:2, familia:"Maderas", grupo:"Flautas" },
  { id:14, cargo:"3ra. Flauta (Solista B), Flauta en sol y 2do. suplente de 2da. Flauta", rol:2, familia:"Maderas", grupo:"Flautas" },
  { id:15, cargo:"1er. Oboe (Solista A)", rol:2, familia:"Maderas", grupo:"Oboes" },
  { id:16, cargo:"3er. Oboe (Solista B y 2do. Suplente de 2do. Oboe)", rol:2, familia:"Maderas", grupo:"Oboes" },
  { id:17, cargo:"1er. Clarinete (Solista A)", rol:2, familia:"Maderas", grupo:"Clarinetes" },
  { id:18, cargo:"3er. Clarinete (Solista B) 1er. Clarinete Pícolo y 2do. suplente del 2do.", rol:2, familia:"Maderas", grupo:"Clarinetes" },
  { id:19, cargo:"1er. Fagot (Solista A)", rol:2, familia:"Maderas", grupo:"Fagotes" },
  { id:20, cargo:"3er. Fagot (Solista B)", rol:2, familia:"Maderas", grupo:"Fagotes" },
  // ── ROL 2 — Metales (7) ──
  { id:21, cargo:"1er. Corno (Solista A)", rol:2, familia:"Metales", grupo:"Cornos" },
  { id:22, cargo:"5to. Corno (Solista B y Suplente del 3er. Corno)", rol:2, familia:"Metales", grupo:"Cornos" },
  { id:23, cargo:"1ra. Trompeta (Solista A)", rol:2, familia:"Metales", grupo:"Trompetas" },
  { id:24, cargo:"3ra. Trompeta (Solista B y 2do. suplente de la 2da. Trompeta)", rol:2, familia:"Metales", grupo:"Trompetas" },
  { id:25, cargo:"1er. Trombón (Solista A - Alto y Tenor)", rol:2, familia:"Metales", grupo:"Trombones" },
  { id:26, cargo:"4to. Trombón (Solista B - Alto y Tenor - y suplente del 2do. Trombón)", rol:2, familia:"Metales", grupo:"Trombones" },
  { id:27, cargo:"Tuba, Tuba Bajo y Tuba Contrabajo", rol:2, familia:"Metales", grupo:"Trombones" },
  // ── ROL 2 — Percusión (5) ──
  { id:28, cargo:"1er. Timbal (Solista A)", rol:2, familia:"Percusión", grupo:"Timbales" },
  { id:29, cargo:"2do. Timbal (Solista B) y Accesorios", rol:2, familia:"Percusión", grupo:"Timbales" },
  { id:30, cargo:"Piano y Celesta", rol:2, familia:"Percusión", grupo:"Teclas" },
  { id:31, cargo:"1er. Arpa (Solista A)", rol:2, familia:"Percusión", grupo:"Arpas" },
  { id:32, cargo:"2da. Arpa (Solista B)", rol:2, familia:"Percusión", grupo:"Arpas" },
  // ── ROL 3 — Cuerdas (10) ──
  { id:33, cargo:"5to. 1er. Violín", rol:3, familia:"Cuerdas", grupo:"1ros. Violines" },
  { id:34, cargo:"6to. 1er. Violín", rol:3, familia:"Cuerdas", grupo:"1ros. Violines" },
  { id:35, cargo:"3er. 2do. Violín (Suplente de Solista)", rol:3, familia:"Cuerdas", grupo:"2dos. Violines" },
  { id:36, cargo:"4to. 2do. Violín (Suplente de Solista)", rol:3, familia:"Cuerdas", grupo:"2dos. Violines" },
  { id:37, cargo:"3ra. Viola (Suplente de Solista)", rol:3, familia:"Cuerdas", grupo:"Violas" },
  { id:38, cargo:"4ta. Viola (Suplente de Solista)", rol:3, familia:"Cuerdas", grupo:"Violas" },
  { id:39, cargo:"3er. Violoncelo (Suplente de Solista)", rol:3, familia:"Cuerdas", grupo:"Violoncelos" },
  { id:40, cargo:"4to. Violoncelo (Suplente de Solista)", rol:3, familia:"Cuerdas", grupo:"Violoncelos" },
  { id:41, cargo:"3er. Contrabajo (Suplente de Solista)", rol:3, familia:"Cuerdas", grupo:"Contrabajos" },
  { id:42, cargo:"4to. Contrabajo (Suplente de Solista)", rol:3, familia:"Cuerdas", grupo:"Contrabajos" },
  // ── ROL 3 — Maderas (8) ──
  { id:43, cargo:"2da. Flauta y 2da. Flauta Pícolo (Suplente de 1ra. Pícolo)", rol:3, familia:"Maderas", grupo:"Flautas" },
  { id:44, cargo:"4ta. Flauta y 1ra. Flauta Pícolo (Suplente de 2da. y 3ra. Flauta)", rol:3, familia:"Maderas", grupo:"Flautas" },
  { id:45, cargo:"2do. Oboe y 2do. Corno Inglés (Suplente de 1er. Corno Inglés)", rol:3, familia:"Maderas", grupo:"Oboes" },
  { id:46, cargo:"4to. Oboe y 1er. Corno Inglés (Suplente de 2do. y 3er. Oboe)", rol:3, familia:"Maderas", grupo:"Oboes" },
  { id:47, cargo:"2do. Clarinete y 2do. Clarinete Pícolo (Suplente de 1er. Clarinete Pícolo)", rol:3, familia:"Maderas", grupo:"Clarinetes" },
  { id:48, cargo:"4to. Clarinete y Clarinete Bajo (suplente de 2do.)", rol:3, familia:"Maderas", grupo:"Clarinetes" },
  { id:49, cargo:"2do. Fagot y 2do. Contrafagot (Suplente de 1er. Contrafagot)", rol:3, familia:"Maderas", grupo:"Fagotes" },
  { id:50, cargo:"4to. Fagot y 1er. Contrafagot (Suplente de 2do. y 3ro. Contrafagot)", rol:3, familia:"Maderas", grupo:"Fagotes" },
  // ── ROL 3 — Metales (8) ──
  { id:51, cargo:"2do. Corno", rol:3, familia:"Metales", grupo:"Cornos" },
  { id:52, cargo:"3er. Corno (2do Suplente de Solista)", rol:3, familia:"Metales", grupo:"Cornos" },
  { id:53, cargo:"4to. Corno y Suplente del 2do. Corno", rol:3, familia:"Metales", grupo:"Cornos" },
  { id:54, cargo:"6to. Corno, Suplente del 4to. Corno y 2do. Suplente del 2do. Corno", rol:3, familia:"Metales", grupo:"Cornos" },
  { id:55, cargo:"2da. Trompeta suplente de pícolo (b)", rol:3, familia:"Metales", grupo:"Trompetas" },
  { id:56, cargo:"4ta. Trompeta, Trompeta Pícola y Auxiliar de 1ra. Trompeta", rol:3, familia:"Metales", grupo:"Trompetas" },
  { id:57, cargo:"2do. Trombón, Tuba Tenor y Suplente de 3er. Trombón", rol:3, familia:"Metales", grupo:"Trombones" },
  { id:58, cargo:"3er. Trombón, Trombón Bajo (2do. Suplente del 2do. Trombón)", rol:3, familia:"Metales", grupo:"Trombones" },
  // ── ROL 3 — Percusión (2) ──
  { id:59, cargo:"Tambor y Accesorios", rol:3, familia:"Percusión", grupo:"Timbales" },
  { id:60, cargo:"Placas y Accesorios", rol:3, familia:"Percusión", grupo:"Timbales" },
  // ── ROL 4 — 1ros Violines (11) ──
  ...Array.from({length:11},(_, i)=>({ id:61+i, cargo:`${["7mo","8vo","9no","10mo","11mo","12mo","13er","14to","15to","16to","17mo"][i]}. 1er. Violín`, rol:4, familia:"Cuerdas", grupo:"1ros. Violines" })),
  // ── ROL 4 — 2dos Violines (12) ──
  ...Array.from({length:12},(_, i)=>({ id:72+i, cargo:`${["5to","6to","7mo","8vo","9no","10mo","11mo","12mo","13er","14to","15to","16to"][i]}. 2do. Violín`, rol:4, familia:"Cuerdas", grupo:"2dos. Violines" })),
  // ── ROL 4 — Violas (8) ──
  ...Array.from({length:8},(_, i)=>({ id:84+i, cargo:`${["5ta","6ta","7ma","8va","9na","10ma","11er","12da"][i]}. Viola`, rol:4, familia:"Cuerdas", grupo:"Violas" })),
  // ── ROL 4 — Violoncelos (7) ──
  ...Array.from({length:7},(_, i)=>({ id:92+i, cargo:`${["5to","6to","7mo","8vo","9no","10mo","11er"][i]}. Violoncelo`, rol:4, familia:"Cuerdas", grupo:"Violoncelos" })),
  // ── ROL 4 — Contrabajos (5) ──
  ...Array.from({length:5},(_, i)=>({ id:99+i, cargo:`${["5to","6to","7mo","8vo","9no"][i]}. Contrabajo`, rol:4, familia:"Cuerdas", grupo:"Contrabajos" })),
  // ── ROL 4 — Percusión (2) ──
  { id:104, cargo:"Bombo, Accesorios, Suplente de Tambor y 2do. Tambor", rol:4, familia:"Percusión", grupo:"Timbales" },
  { id:105, cargo:"Platillos, 3er. Timbal, Accesorios y 2do. Placas (Suplente de Placas)", rol:4, familia:"Percusión", grupo:"Timbales" },
];

const ROL = {
  1:{ label:"Concertino", full:"Rol 1 — Concertino", c:"var(--color-role1)", tx:"#fff" },
  2:{ label:"Solista",    full:"Rol 2 — Solista",    c:"var(--color-role2)", tx:"#fff" },
  3:{ label:"Suplente",   full:"Rol 3 — Suplente",   c:"var(--color-role3)", tx:"#fff" },
  4:{ label:"Fila",       full:"Rol 4 — Fila",       c:"var(--color-role4)", tx:"#fff" },
};

const FAMILIAS = {
  Cuerdas:   { c:"var(--color-cuerdas)", icon:"🎻" },
  Maderas:   { c:"var(--color-maderas)", icon:"🪈" },
  Metales:   { c:"var(--color-metales)", icon:"🎺" },
  Percusión: { c:"var(--color-percusion)", icon:"🥁" },
};

/* ═══════════════════════════════════════════════════
   LAYOUT — posiciones en semicírculo (Versión Expandida)
   ═══════════════════════════════════════════════════ */
function seatPositions() {
  const pos = {};
  const place = (grupo, cx, cy, cols, dx, dy) => {
    const items = CARGOS.filter(c => c.grupo === grupo).sort((a,b)=>a.rol-b.rol||a.id-b.id);
    items.forEach((item, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const colsInRow = Math.min(cols, items.length - row * cols);
      pos[item.id] = {
        x: cx + (col - (colsInRow-1)/2) * dx,
        y: cy - row * dy,
      };
    });
  };
  // Coordenadas expandidas para un viewBox de 900x600
  place("1ros. Violines", 240, 520, 6, 28, 28);
  place("2dos. Violines", 660, 520, 6, 28, 28);
  place("Violas", 360, 420, 5, 26, 26);
  place("Violoncelos", 540, 420, 5, 26, 26);
  place("Contrabajos", 720, 240, 5, 24, 24);
  place("Flautas", 360, 240, 2, 26, 26);
  place("Oboes", 420, 240, 2, 26, 26);
  place("Clarinetes", 480, 240, 2, 26, 26);
  place("Fagotes", 540, 240, 2, 26, 26);
  place("Cornos", 260, 160, 4, 26, 26);
  place("Trompetas", 420, 140, 2, 26, 26);
  place("Trombones", 540, 140, 3, 26, 26);
  place("Timbales", 680, 130, 3, 24, 24);
  place("Teclas", 180, 200, 1, 24, 24);
  place("Arpas", 180, 140, 2, 28, 26);
  return pos;
}

/* ═══════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════ */
function FilterPill({ children, active, color, onClick }) {
  return (
    <button 
      className={`pill ${active ? 'active' : ''}`}
      onClick={onClick}
      style={{ '--pill-color': color, '--pill-bg': `${color}33` }}
    >
      {children}
    </button>
  );
}

function CargoCard({ cargo, selected, onSelect }) {
  const r = ROL[cargo.rol];
  const isSelected = selected === cargo.id;
  return (
    <div 
      className={`cargo-card glass ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(cargo.id)}
      data-id={cargo.id}
      style={{ '--card-bg': `${r.c}22`, '--card-accent': r.c }}
    >
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
        <div>
          <div style={{ fontSize:14, fontWeight:isSelected?600:500, color:isSelected?r.c:'#fff' }}>{cargo.cargo}</div>
          <div style={{ fontSize:11, color:"var(--text-dim)", marginTop:4 }}>{cargo.familia} • {cargo.grupo}</div>
        </div>
        <span style={{ fontSize:10, padding:"3px 8px", borderRadius:12, background:r.c, color:"#fff", fontWeight:700 }}>
          {r.label}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════ */
export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [rolFilter, setRolFilter] = useState(null);
  const [familiaFilter, setFamiliaFilter] = useState(null);
  const [search, setSearch] = useState("");
  const [showList, setShowList] = useState(false);
  const listRef = useRef(null);
  const positions = useMemo(seatPositions, []);

  const filtered = useMemo(() => {
    let list = CARGOS;
    if (rolFilter) list = list.filter(c => c.rol === rolFilter);
    if (familiaFilter) list = list.filter(c => c.familia === familiaFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c => c.cargo.toLowerCase().includes(q) || c.grupo.toLowerCase().includes(q));
    }
    return list;
  }, [rolFilter, familiaFilter, search]);

  const filteredIds = useMemo(() => new Set(filtered.map(c => c.id)), [filtered]);
  const selectedCargo = CARGOS.find(c => c.id === selectedId);

  const handleSelect = useCallback((id) => {
    setSelectedId(prev => prev === id ? null : id);
  }, []);

  useEffect(() => {
    if (selectedId && listRef.current && showList) {
      const el = listRef.current.querySelector(`[data-id="${selectedId}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedId, showList]);

  return (
    <div className="app-container animate-fade-in">
      <header className="header">
        <div className="header-label">Decreto 669/2022 • Argentina</div>
        <h1 className="header-title">Orquesta Sinfónica Nacional</h1>
        <p className="header-subtitle">Mapa Interactivo de Cargos Artísticos</p>
      </header>

      <section className="search-container glass">
        <div className="search-input-wrapper">
          <span className="search-icon">⌕</span>
          <input
            type="text" 
            className="search-input"
            value={search} 
            onChange={e => { setSearch(e.target.value); setShowList(true); }}
            placeholder="Buscar por cargo o instrumento..."
          />
        </div>
        
        <div className="filters-row">
          {Object.entries(ROL).map(([k, v]) => (
            <FilterPill key={k} active={rolFilter===+k} color={v.c} onClick={() => setRolFilter(rolFilter===+k ? null : +k)}>
              {v.label}
            </FilterPill>
          ))}
          <div style={{ width:1, background:"var(--glass-border)", margin:"4px 8px" }} />
          {Object.entries(FAMILIAS).map(([k, v]) => (
            <FilterPill key={k} active={familiaFilter===k} color={v.c} onClick={() => setFamiliaFilter(familiaFilter===k ? null : k)}>
              {v.icon} {k}
            </FilterPill>
          ))}
        </div>
      </section>

      <div style={{ display:'grid', gridTemplateColumns: showList ? '1fr 350px' : '1fr', gap:30, alignItems:'start', transition:'all 0.5s ease' }}>
        <main className="map-container" style={{ maxWidth: '1000px' }}>
          {/* Selected Cargo Overlay */}
          {selectedCargo && (
            <div className="glass" style={{
              position:'absolute', top:20, left:'50%', transform:'translateX(-50%)',
              zIndex:10, padding:'20px 30px', borderRadius:24, width:'min(450px, 90%)',
              borderTop:`6px solid ${ROL[selectedCargo.rol].c}`,
              animation: 'fadeIn 0.3s ease-out',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}>
              <button onClick={() => setSelectedId(null)} style={{ position:'absolute', top:12, right:12, background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer', fontSize:20 }}>×</button>
              <div style={{ fontSize:12, textTransform:'uppercase', letterSpacing:2, color:ROL[selectedCargo.rol].c, fontWeight:700, marginBottom:4 }}>{ROL[selectedCargo.rol].full}</div>
              <div style={{ fontSize:20, fontWeight:600, lineHeight:1.3 }}>{selectedCargo.cargo}</div>
              <div style={{ fontSize:13, color:'var(--text-dim)', marginTop:8 }}>{FAMILIAS[selectedCargo.familia].icon} {selectedCargo.familia} • {selectedCargo.grupo}</div>
            </div>
          )}

          <svg className="map-svg" viewBox="0 0 900 600">
            <defs>
              <radialGradient id="stageGrad" cx="50%" cy="100%" r="100%" fx="50%" fy="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>
            
            {/* Stage Floor */}
            <path d="M50 580 Q50 20 450 15 Q850 20 850 580" fill="url(#stageGrad)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="8 6"/>
            
            {/* Dots */}
            {CARGOS.map(c => {
              const p = positions[c.id];
              if (!p) return null;
              const isSelected = selectedId === c.id;
              const inFilter = filteredIds.has(c.id);
              const r = ROL[c.rol];
              // Tamaños aumentados significativamente
              const baseR = c.rol === 1 ? 12 : c.rol === 2 ? 10 : c.rol === 3 ? 8 : 7.5;
              
              return (
                <g key={c.id} className="seat-node" onClick={() => handleSelect(c.id)}>
                  {isSelected && (
                    <circle cx={p.x} cy={p.y} r={baseR + 12} fill="none" stroke={r.c} strokeWidth="2" opacity="0.6">
                      <animate attributeName="r" from={baseR} to={baseR+18} dur="1.2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.8" to="0" dur="1.2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    cx={p.x} cy={p.y}
                    r={isSelected ? baseR + 4 : baseR}
                    fill={inFilter ? r.c : "rgba(255,255,255,0.12)"}
                    filter={isSelected ? `drop-shadow(0 0 12px ${r.c})` : 'none'}
                    opacity={inFilter ? 1 : 0.25}
                    style={{ transition:'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />
                </g>
              );
            })}

            {/* Labels Expandidas */}
            <g fontSize="11" fontWeight="600" fill="var(--text-dim)" opacity="0.7" style={{ pointerEvents:'none' }}>
              <text x="240" y="580" textAnchor="middle">1ros Violines</text>
              <text x="660" y="580" textAnchor="middle">2dos Violines</text>
              <text x="360" y="470" textAnchor="middle">Violas</text>
              <text x="540" y="470" textAnchor="middle">Cellos</text>
              <text x="740" y="270" textAnchor="middle">Contrabajos</text>
              <text x="450" y="285" textAnchor="middle" fill="var(--color-maderas)" fontSize="12">MADERAS</text>
              <text x="450" y="100" textAnchor="middle" fill="var(--color-metales)" fontSize="12">METALES</text>
              <text x="180" y="240" textAnchor="middle">Piano / Arpas</text>
            </g>

            {/* Director Podium Expandido */}
            <rect x="420" y="560" width="60" height="30" rx="6" fill="#fff" opacity="0.15" />
            <text x="450" y="580" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="700">DIRECTOR</text>
          </svg>

          <div style={{ textAlign:'center', marginTop:20 }}>
             <button className="pill" onClick={() => setShowList(!showList)} style={{ border:'1px solid var(--glass-border)' }}>
               {showList ? 'Ocultar Listado' : 'Ver Listado Completo'} {showList ? '→' : '↓'}
             </button>
          </div>
        </main>

        {showList && (
          <aside className="glass animate-fade-in" style={{ padding:20, borderRadius:24, maxHeight:'70vh', overflowY:'auto', scrollbarWidth:'thin' }}>
            <div style={{ fontSize:12, color:'var(--text-dim)', marginBottom:16, display:'flex', justifyContent:'space-between' }}>
              <span>{filtered.length} CARGOS FILTRADOS</span>
              <button onClick={() => {setRolFilter(null); setFamiliaFilter(null); setSearch("");}} style={{ background:'none', border:'none', color: 'var(--color-role2)', fontSize:11, cursor:'pointer' }}>Limpiar</button>
            </div>
            <div ref={listRef}>
              {filtered.map(c => (
                <CargoCard key={c.id} cargo={c} selected={selectedId} onSelect={handleSelect} />
              ))}
              {filtered.length === 0 && (
                <div style={{ textAlign:'center', padding:'40px 0', color:'var(--text-muted)' }}>
                  No se encontraron resultados
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      <footer className="footer-stats glass animate-fade-in" style={{ marginTop: showList ? 40 : 80 }}>
        {Object.entries(ROL).map(([k, v]) => (
          <div key={k} className="stat-item">
            <div className="stat-value" style={{ color: v.c }}>
              {CARGOS.filter(c => c.rol === +k).length}
            </div>
            <div className="stat-label">{v.label}</div>
          </div>
        ))}
        <div className="stat-item">
          <div className="stat-value" style={{ color: '#fff' }}>105</div>
          <div className="stat-label">Total Cargos</div>
        </div>
      </footer>
      
      <div style={{ textAlign:'center', padding:'40px 0', fontSize:11, color:'var(--text-muted)', letterSpacing:1 }}>
        SISTEMA DE GESTIÓN DE PLANTEL ARTÍSTICO • OSN ARGENTINA
      </div>
    </div>
  );
}
