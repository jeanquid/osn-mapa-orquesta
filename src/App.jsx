import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { PLANTA } from "./data/planta";

/* ═══════════════════════════════════════════════════
   CONFIG — Constantes y Estilos
   ═══════════════════════════════════════════════════ */
const ROL = {
  1:{ label:"Concertino", full:"Rol 1 — Concertino", c:"#7C4DFF" },
  2:{ label:"Solista",    full:"Rol 2 — Solista",    c:"#2979FF" },
  3:{ label:"Suplente",   full:"Rol 3 — Suplente",   c:"#00BFA5" },
  4:{ label:"Fila",       full:"Rol 4 — Fila",       c:"#FF8F00" },
};

const FAMILIAS = {
  Cuerdas:   { c:"#A1887F", icon:"🎻" },
  Maderas:   { c:"#81C784", icon:"🪈" },
  Metales:   { c:"#FFD54F", icon:"🎺" },
  Percusión: { c:"#9575CD", icon:"🥁" },
};

const CONTRATO_COLORS = {
  "Planta Permanente": { bg: "rgba(46, 125, 50, 0.15)", color: "#81C784" },
  "Contrato Decreto 669/22": { bg: "rgba(13, 71, 161, 0.2)", color: "#64B5F6" },
  "ART 9°": { bg: "rgba(230, 81, 0, 0.2)", color: "#FFB74D" },
  "Contrato Locación Obra Anual": { bg: "rgba(136, 14, 79, 0.2)", color: "#F06292" },
  "default": { bg: "rgba(255, 255, 255, 0.05)", color: "#aaa" }
};

/* ═══════════════════════════════════════════════════
   LAYOUT — posiciones en semicírculo
   ═══════════════════════════════════════════════════ */
function seatPositions() {
  const pos = {};
  const place = (grupo, cx, cy, cols, dx, dy) => {
    const items = PLANTA.filter(c => c.grupo === grupo).sort((a,b)=>a.rol-b.rol||a.id-b.id);
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
  const isVacant = cargo.estado === "V";
  
  return (
    <div 
      className={`cargo-card glass ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(cargo.id)}
      data-id={cargo.id}
      style={{ '--card-bg': isVacant ? 'rgba(198, 40, 40, 0.1)' : `${r.c}22`, '--card-accent': isVacant ? '#C62828' : r.c }}
    >
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"start", gap:12 }}>
        <div>
          <div style={{ fontSize:14, fontWeight:600, color: isVacant ? '#FF5252' : isSelected ? r.c : '#fff' }}>
            {isVacant ? "VACANTE" : cargo.nombre}
          </div>
          <div style={{ fontSize:11, fontWeight:500, color:"var(--text-dim)", marginTop:4 }}>{cargo.cargo}</div>
        </div>
        <span style={{ fontSize:9, padding:"3px 8px", borderRadius:12, background: isVacant ? '#C62828' : r.c, color:"#fff", fontWeight:700, whiteSpace:'nowrap' }}>
          {isVacant ? "VACANTE" : r.label}
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
    let list = PLANTA;
    if (rolFilter) list = list.filter(c => c.rol === rolFilter);
    if (familiaFilter) list = list.filter(c => c.familia === familiaFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c => 
        c.cargo.toLowerCase().includes(q) || 
        c.grupo.toLowerCase().includes(q) ||
        (c.nombre && c.nombre.toLowerCase().includes(q))
      );
    }
    return list;
  }, [rolFilter, familiaFilter, search]);

  const filteredIds = useMemo(() => new Set(filtered.map(c => c.id)), [filtered]);
  const selectedCargo = PLANTA.find(c => c.id === selectedId);

  const handleSelect = useCallback((id) => {
    setSelectedId(prev => prev === id ? null : id);
  }, []);

  useEffect(() => {
    if (selectedId && listRef.current && showList) {
      const el = listRef.current.querySelector(`[data-id="${selectedId}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedId, showList]);

  // Estadísticas
  const stats = useMemo(() => {
    const total = PLANTA.length;
    const cubiertos = PLANTA.filter(c => c.estado === "C").length;
    const vacantes = PLANTA.filter(c => c.estado === "V").length;
    const cobertura = ((cubiertos / total) * 100).toFixed(1);
    return { total, cubiertos, vacantes, cobertura };
  }, []);

  return (
    <div className="app-container animate-fade-in">
      <header className="header">
        <div className="header-label">Planta de Personal • Abril 2026</div>
        <h1 className="header-title">Orquesta Sinfónica Nacional</h1>
        <p className="header-subtitle">Mapa Interactivo de Cargos y Personal Artístico</p>
      </header>

      <section className="search-container glass">
        <div className="search-input-wrapper">
          <span className="search-icon">⌕</span>
          <input
            type="text" 
            className="search-input"
            value={search} 
            onChange={e => { setSearch(e.target.value); setShowList(true); }}
            placeholder="Buscar por músico, cargo o instrumento..."
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
              zIndex:10, padding:'28px 36px', borderRadius:28, width:'min(500px, 95%)',
              background: 'rgba(10, 10, 10, 0.98)', // Mucho más opaco
              backdropFilter: 'blur(20px)', // Más desenfoque
              borderTop:`6px solid ${selectedCargo.estado === "V" ? "#C62828" : ROL[selectedCargo.rol].c}`,
              borderLeft: '1px solid rgba(255,255,255,0.1)',
              borderRight: '1px solid rgba(255,255,255,0.1)',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              animation: 'fadeIn 0.3s ease-out',
              boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.8)' // Sombra más profunda
            }}>
              <button onClick={() => setSelectedId(null)} style={{ position:'absolute', top:12, right:12, background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer', fontSize:22 }}>×</button>
              
              <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:12 }}>
                 <span style={{ 
                   fontSize:10, fontWeight:700, padding:'4px 10px', borderRadius:10, 
                   background: selectedCargo.estado === "V" ? 'rgba(198, 40, 40, 0.2)' : 'rgba(46, 125, 50, 0.2)',
                   color: selectedCargo.estado === "V" ? '#FF5252' : '#81C784',
                   border: `1px solid ${selectedCargo.estado === "V" ? '#C62828' : '#2E7D32'}`
                 }}>
                   {selectedCargo.estado === "V" ? "🔴 VACANTE" : "🟢 CUBIERTO"}
                 </span>
                 <span style={{ fontSize:10, color:'var(--text-dim)', fontWeight:600 }}>{ROL[selectedCargo.rol].full}</span>
              </div>

              <div style={{ fontSize:22, fontWeight:700, color: selectedCargo.estado === "V" ? '#FF5252' : '#fff', lineHeight:1.2, marginBottom:4 }}>
                {selectedCargo.estado === "V" ? "CARGO VACANTE" : selectedCargo.nombre}
              </div>
              
              <div style={{ fontSize:14, fontWeight:500, color:'var(--text-dim)', marginBottom:16 }}>
                {selectedCargo.cargo}
              </div>

              {selectedCargo.estado === "C" && (
                <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:12, padding:16, marginBottom:16 }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    <div style={{ fontSize:11 }}>
                       <div style={{ color:'var(--text-muted)', marginBottom:2 }}>CUIL</div>
                       <div style={{ color:'#fff', fontWeight:500 }}>{selectedCargo.cuil}</div>
                    </div>
                    <div style={{ fontSize:11 }}>
                       <div style={{ color:'var(--text-muted)', marginBottom:2 }}>Grado</div>
                       <div style={{ color:'#fff', fontWeight:500 }}>{selectedCargo.rolGrado}</div>
                    </div>
                    <div style={{ fontSize:11, gridColumn:'span 2' }}>
                       <div style={{ color:'var(--text-muted)', marginBottom:2 }}>Tipo de Contrato</div>
                       <div style={{ 
                         display:'inline-block',
                         padding:'3px 8px', borderRadius:6,
                         background: (CONTRATO_COLORS[selectedCargo.tipoContrato] || CONTRATO_COLORS.default).bg,
                         color: (CONTRATO_COLORS[selectedCargo.tipoContrato] || CONTRATO_COLORS.default).color,
                         fontWeight: 600, fontSize:10
                       }}>
                         {selectedCargo.tipoContrato}
                       </div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display:'flex', gap:10, fontSize:12, color:'var(--text-dim)', fontWeight:500 }}>
                <span>{FAMILIAS[selectedCargo.familia].icon} {selectedCargo.familia}</span>
                <span>•</span>
                <span>{selectedCargo.grupo}</span>
              </div>
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
            {PLANTA.map(c => {
              const p = positions[c.id];
              if (!p) return null;
              const isSelected = selectedId === c.id;
              const inFilter = filteredIds.has(c.id);
              const isVacant = c.estado === "V";
              const r = ROL[c.rol];
              const baseR = c.rol === 1 ? 12 : c.rol === 2 ? 10 : c.rol === 3 ? 8 : 7.5;
              
              return (
                <g key={c.id} className="seat-node" onClick={() => handleSelect(c.id)}>
                  {isSelected && (
                    <circle cx={p.x} cy={p.y} r={baseR + 12} fill="none" stroke={isVacant ? "#C62828" : r.c} strokeWidth="2" opacity="0.6">
                      <animate attributeName="r" from={baseR} to={baseR+18} dur="1.2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.8" to="0" dur="1.2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    cx={p.x} cy={p.y}
                    r={isSelected ? baseR + 4 : baseR}
                    fill={!inFilter ? "rgba(255,255,255,0.05)" : isVacant ? "transparent" : r.c}
                    stroke={isVacant && inFilter ? "#C62828" : "none"}
                    strokeWidth={isVacant ? 2 : 0}
                    strokeDasharray={isVacant ? "3 2" : "none"}
                    filter={isSelected ? `drop-shadow(0 0 12px ${isVacant ? '#C62828' : r.c})` : 'none'}
                    opacity={inFilter ? 1 : 0.25}
                    style={{ transition:'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />
                  {isVacant && inFilter && (
                    <text x={p.x} y={p.y + 3} textAnchor="middle" fontSize="10" fill="#C62828" fontWeight="bold" style={{ pointerEvents:'none' }}>!</text>
                  )}
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
          <aside className="glass animate-fade-in" style={{ padding:20, borderRadius:24, maxHeight:'75vh', overflowY:'auto', scrollbarWidth:'thin' }}>
            <div style={{ fontSize:12, color:'var(--text-dim)', marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span>{filtered.length} CARGOS FILTRADOS</span>
              <button onClick={() => {setRolFilter(null); setFamiliaFilter(null); setSearch("");}} style={{ background:'none', border:'none', color: '#2979FF', fontSize:11, cursor:'pointer' }}>Limpiar</button>
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
        <div className="stat-item">
          <div className="stat-value" style={{ color: '#81C784' }}>{stats.cubiertos}</div>
          <div className="stat-label">Cubiertos</div>
        </div>
        <div className="stat-item">
          <div className="stat-value" style={{ color: '#FF5252' }}>{stats.vacantes}</div>
          <div className="stat-label">Vacantes</div>
        </div>
        <div className="stat-item">
          <div className="stat-value" style={{ color: '#2979FF' }}>{stats.cobertura}%</div>
          <div className="stat-label">Cobertura</div>
        </div>
        <div style={{ width:1, height:40, background:'var(--glass-border)', margin:'0 10px' }} />
        <div className="stat-item">
          <div className="stat-value" style={{ color: '#fff' }}>{stats.total}</div>
          <div className="stat-label">Total Cargos</div>
        </div>
      </footer>
      
      <div style={{ textAlign:'center', padding:'40px 0', fontSize:11, color:'var(--text-muted)', letterSpacing:1 }}>
        SISTEMA DE GESTIÓN DE PLANTEL ARTÍSTICO • OSN ARGENTINA • ACTUALIZADO ABRIL 2026
      </div>
    </div>
  );
}
