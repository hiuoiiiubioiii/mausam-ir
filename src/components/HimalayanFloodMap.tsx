import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Youtube, Info, Layers } from 'lucide-react';

// Fix leaflet default marker icons
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ─── Flood zones data ────────────────────────────────────────────────────────
const FLOOD_ZONES = [
    {
        id: 'kedarnath',
        name: 'Kedarnath Valley',
        lat: 30.7346, lon: 79.0669,
        risk: 'EXTREME',
        river: 'Mandakini River',
        state: 'Uttarakhand',
        elevation: '3,583 m',
        lastEvent: 'June 2013',
        casualties: '5,700+',
        desc: 'The 2013 cloudburst triggered a GLOF from Chorabari Lake, releasing 7.6M m³ of water. The highest flash flood risk zone in the Indian Himalayas.',
        youtube: 'CGrfZAHJhUU',
        pFlood: 0.84,
        sensors: 3,
    },
    {
        id: 'chamoli',
        name: 'Chamoli / Rishiganga',
        lat: 30.4228, lon: 79.5727,
        risk: 'EXTREME',
        river: 'Rishiganga → Dhauliganga',
        state: 'Uttarakhand',
        elevation: '3,200 m',
        lastEvent: 'Feb 2021',
        casualties: '204',
        desc: 'Glacier avalanche and resultant GLOF destroyed the Rishiganga hydropower project. 13 million m³ of rock-ice mix traveled at 160 km/h.',
        youtube: '2bl0FVEAIi8',
        pFlood: 0.76,
        sensors: 2,
    },
    {
        id: 'alaknanda',
        name: 'Alaknanda Valley',
        lat: 30.3246, lon: 79.4373,
        risk: 'CRITICAL',
        river: 'Alaknanda River',
        state: 'Uttarakhand',
        elevation: '2,100 m',
        lastEvent: 'Aug 2012',
        casualties: '70+',
        desc: 'Major tributary of the Ganges with steep gradient and high sediment load. Cloudbursts cause rapid inundation of downstream towns.',
        youtube: 'nSs2LF9V688',
        pFlood: 0.68,
        sensors: 2,
    },
    {
        id: 'brahmaputra',
        name: 'Brahmaputra Basin',
        lat: 27.1039, lon: 93.6219,
        risk: 'CRITICAL',
        river: 'Brahmaputra River',
        state: 'Assam',
        elevation: '85 m',
        lastEvent: 'Jul 2024',
        casualties: '95+',
        desc: 'World\'s fastest-flowing large river. Annual monsoon flooding displaces millions. Climate change is accelerating glacial melt upstream.',
        youtube: 'rUK4JFbVKeE',
        pFlood: 0.71,
        sensors: 4,
    },
    {
        id: 'teesta',
        name: 'Teesta River Basin',
        lat: 27.2500, lon: 88.6250,
        risk: 'CRITICAL',
        river: 'Teesta River',
        state: 'Sikkim',
        elevation: '450 m',
        lastEvent: 'Oct 2023',
        casualties: '100+',
        desc: '2023 GLOF caused by South Lhonak Lake breach. A wall of water 20m high swept downstream destroying Singtam and Rangpo towns.',
        youtube: 'kMK3o3o12kU',
        pFlood: 0.73,
        sensors: 3,
    },
    {
        id: 'beas',
        name: 'Beas River Gorge',
        lat: 31.8580, lon: 77.1167,
        risk: 'HIGH',
        river: 'Beas River',
        state: 'Himachal Pradesh',
        elevation: '2,660 m',
        lastEvent: 'Jun 2014',
        casualties: '24',
        desc: 'Flash flood swept away students picnicking at Larji despite dam release warnings. A monitoring failure that Mausam-IR is designed to prevent.',
        youtube: 'm-jDKmMEJgI',
        pFlood: 0.58,
        sensors: 2,
    },
    {
        id: 'sutlej',
        name: 'Sutlej Basin (Kinnaur)',
        lat: 31.6700, lon: 77.1500,
        risk: 'HIGH',
        river: 'Sutlej River',
        state: 'Himachal Pradesh',
        elevation: '1,800 m',
        lastEvent: 'Aug 2021',
        casualties: '27+',
        desc: 'Kinnaur landslides and flash floods in 2021. Narrow gorge amplifies flood intensity. NH-5 regularly disrupted cutting off Spiti valley.',
        youtube: 'tgJ3pYKXKaU',
        pFlood: 0.55,
        sensors: 2,
    },
    {
        id: 'kosi',
        name: 'Kosi River (Sorrow of Bihar)',
        lat: 26.5000, lon: 87.1700,
        risk: 'CRITICAL',
        river: 'Kosi River',
        state: 'Bihar/Nepal',
        elevation: '110 m',
        lastEvent: 'Aug 2008',
        casualties: '527+',
        desc: 'Known as the "Sorrow of Bihar" — Kosi breached embankments in 2008 and changed course by 120 km, affecting 3.3 million people.',
        youtube: 'nXiCFXsFL0o',
        pFlood: 0.69,
        sensors: 3,
    },
    {
        id: 'jhelum',
        name: 'Jhelum Basin (Kashmir)',
        lat: 34.0800, lon: 74.8000,
        risk: 'HIGH',
        river: 'Jhelum River',
        state: 'Jammu & Kashmir',
        elevation: '1,580 m',
        lastEvent: 'Sep 2014',
        casualties: '277+',
        desc: '2014 Kashmir floods — worst in 50 years. Jhelum reached 35 feet above danger mark. Srinagar remained submerged for 2 weeks.',
        youtube: 'X9p3R2vNEbA',
        pFlood: 0.61,
        sensors: 2,
    },
    {
        id: 'pindar',
        name: 'Pindar Valley',
        lat: 30.2015, lon: 79.8600,
        risk: 'HIGH',
        river: 'Pindar River',
        state: 'Uttarakhand',
        elevation: '2,750 m',
        lastEvent: 'Jul 2021',
        casualties: '15+',
        desc: 'Tributary of Alaknanda with multiple glacial lakes upstream. Exposed villages with no early warning system — a primary Mausam-IR target.',
        youtube: 'nSs2LF9V688',
        pFlood: 0.52,
        sensors: 1,
    },
    {
        id: 'subansiri',
        name: 'Subansiri River Basin',
        lat: 27.5000, lon: 93.8000,
        risk: 'HIGH',
        river: 'Subansiri River',
        state: 'Arunachal Pradesh',
        elevation: '150 m',
        lastEvent: 'Jun 2022',
        casualties: '12+',
        desc: 'Glacial fed river with extreme seasonal variability. Chinese dams upstream create additional uncertainty for downstream Indian communities.',
        youtube: 'rUK4JFbVKeE',
        pFlood: 0.54,
        sensors: 1,
    },
    {
        id: 'lahaul',
        name: 'Lahaul Spiti Valley',
        lat: 32.6833, lon: 77.5667,
        risk: 'MODERATE',
        river: 'Chandra-Bhaga (Chenab)',
        state: 'Himachal Pradesh',
        elevation: '3,200 m',
        lastEvent: 'Aug 2023',
        casualties: '8',
        desc: 'Cold desert with intense periglacial activity. Unprecedented monsoon penetration causing debris flows and flash floods in a region previously considered safe.',
        youtube: 'tgJ3pYKXKaU',
        pFlood: 0.41,
        sensors: 1,
    },
    {
        id: 'tons',
        name: 'Tons River Valley',
        lat: 30.8500, lon: 78.0000,
        risk: 'MODERATE',
        river: 'Tons River',
        state: 'Uttarakhand',
        elevation: '1,200 m',
        lastEvent: 'Aug 2022',
        casualties: '20+',
        desc: 'Largest tributary of the Yamuna. Multiple hydropower projects have altered natural flow regime, increasing flash flood risk for riverside communities.',
        youtube: 'CGrfZAHJhUU',
        pFlood: 0.44,
        sensors: 1,
    },
    {
        id: 'uttarkashi',
        name: 'Uttarkashi / Bhagirathi',
        lat: 30.7268, lon: 78.4354,
        risk: 'CRITICAL',
        river: 'Bhagirathi River',
        state: 'Uttarakhand',
        elevation: '1,160 m',
        lastEvent: 'Jul 2023',
        casualties: '55+',
        desc: 'Upper Ganga basin experiencing accelerated glacial retreat. 2023 cloudburst caused 72-hour flash flood cycle destroying 14 bridges on NH-34.',
        youtube: 'CGrfZAHJhUU',
        pFlood: 0.67,
        sensors: 2,
    },
];

const RISK_CONFIG = {
    EXTREME: { color: '#ef4444', pulse: '#ff0000', radius: 40000. },
    CRITICAL: { color: '#f97316', pulse: '#ff6600', radius: 30000 },
    HIGH: { color: '#eab308', pulse: '#ffcc00', radius: 22000 },
    MODERATE: { color: '#3b82f6', pulse: '#0088ff', radius: 16000 },
};

const TILE_LAYERS = [
    { id: 'satellite', label: 'Satellite', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution: '© Esri, Maxar, Earthstar Geographics' },
    { id: 'dark', label: 'Dark Map', url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', attribution: '© CARTO' },
    { id: 'terrain', label: 'Terrain', url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', attribution: '© OpenTopoMap' },
];

// Custom pulsing marker
const createMarkerIcon = (risk: string, isActive: boolean) => {
    const cfg = RISK_CONFIG[risk as keyof typeof RISK_CONFIG];
    return divIcon({
        className: '',
        html: `
      <div style="position:relative;width:24px;height:24px;">
        <div style="position:absolute;inset:0;border-radius:50%;background:${cfg.color};opacity:0.25;animation:pulse 1.8s infinite;"></div>
        <div style="position:absolute;inset:5px;border-radius:50%;background:${cfg.color};border:2px solid ${isActive ? '#fff' : cfg.color};box-shadow:0 0 ${isActive ? 12 : 6}px ${cfg.color};"></div>
      </div>
      <style>@keyframes pulse{0%,100%{transform:scale(1);opacity:.25}50%{transform:scale(2.2);opacity:0.05}}</style>
    `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

// Auto-fit map to bounds
function MapController() {
    const map = useMap();
    useEffect(() => {
        const bounds: [number, number][] = FLOOD_ZONES.map(z => [z.lat, z.lon]);
        map.fitBounds(bounds as any, { padding: [40, 40] });
    }, [map]);
    return null;
}

const HimalayanFloodMap: React.FC = () => {
    const [selectedZone, setSelectedZone] = useState<typeof FLOOD_ZONES[0] | null>(null);
    const [tileLayer, setTileLayer] = useState(0);
    const [showAllRings, setShowAllRings] = useState(true);
    const [filterRisk, setFilterRisk] = useState<string | null>(null);

    const filtered = filterRisk ? FLOOD_ZONES.filter(z => z.risk === filterRisk) : FLOOD_ZONES;
    const stats = {
        extreme: FLOOD_ZONES.filter(z => z.risk === 'EXTREME').length,
        critical: FLOOD_ZONES.filter(z => z.risk === 'CRITICAL').length,
        high: FLOOD_ZONES.filter(z => z.risk === 'HIGH').length,
        moderate: FLOOD_ZONES.filter(z => z.risk === 'MODERATE').length,
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Control row */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Risk filter chips */}
                <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                    <button onClick={() => setFilterRisk(null)}
                        style={{ padding: '.3rem .8rem', borderRadius: '20px', border: `1px solid ${!filterRisk ? '#fff' : 'rgba(255,255,255,.15)'}`, background: !filterRisk ? 'rgba(255,255,255,.1)' : 'transparent', color: !filterRisk ? '#fff' : 'var(--muted)', fontFamily: 'var(--mono)', fontSize: '.65rem', cursor: 'pointer' }}>
                        ALL ({FLOOD_ZONES.length})
                    </button>
                    {(Object.keys(RISK_CONFIG) as string[]).map(risk => (
                        <button key={risk} onClick={() => setFilterRisk(filterRisk === risk ? null : risk)}
                            style={{ padding: '.3rem .8rem', borderRadius: '20px', border: `1px solid ${filterRisk === risk ? RISK_CONFIG[risk as keyof typeof RISK_CONFIG].color : 'rgba(255,255,255,.12)'}`, background: filterRisk === risk ? `${RISK_CONFIG[risk as keyof typeof RISK_CONFIG].color}22` : 'transparent', color: filterRisk === risk ? RISK_CONFIG[risk as keyof typeof RISK_CONFIG].color : 'var(--muted)', fontFamily: 'var(--mono)', fontSize: '.65rem', cursor: 'pointer' }}>
                            ● {risk} ({FLOOD_ZONES.filter(z => z.risk === risk).length})
                        </button>
                    ))}
                </div>
                {/* Layer switcher */}
                <div style={{ display: 'flex', gap: '.4rem' }}>
                    <Layers size={13} color="var(--muted)" style={{ marginTop: '2px' }} />
                    {TILE_LAYERS.map((l, i) => (
                        <button key={l.id} onClick={() => setTileLayer(i)}
                            style={{ padding: '.3rem .7rem', borderRadius: '6px', border: `1px solid ${tileLayer === i ? '#22c55e' : 'rgba(255,255,255,.12)'}`, background: tileLayer === i ? 'rgba(34,197,94,.12)' : 'transparent', color: tileLayer === i ? '#22c55e' : 'var(--muted)', fontFamily: 'var(--mono)', fontSize: '.63rem', cursor: 'pointer' }}>
                            {l.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Map + Sidebar layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1rem', height: '580px' }}>

                {/* Map */}
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,.1)', position: 'relative' }}>
                    <MapContainer center={[30, 82]} zoom={6} style={{ height: '100%', width: '100%', background: '#0a0c10' }} zoomControl={true} attributionControl={false}>
                        <MapController />
                        <TileLayer url={TILE_LAYERS[tileLayer].url} attribution={TILE_LAYERS[tileLayer].attribution} />

                        {filtered.map(zone => {
                            const cfg = RISK_CONFIG[zone.risk as keyof typeof RISK_CONFIG];
                            const isActive = selectedZone?.id === zone.id;
                            return (
                                <React.Fragment key={zone.id}>
                                    {showAllRings && (
                                        <Circle center={[zone.lat, zone.lon]} radius={cfg.radius}
                                            pathOptions={{ color: cfg.color, fillColor: cfg.color, fillOpacity: isActive ? 0.15 : 0.06, weight: isActive ? 2 : 1, opacity: isActive ? 0.9 : 0.4 }} />
                                    )}
                                    <Marker position={[zone.lat, zone.lon]} icon={createMarkerIcon(zone.risk, isActive)}
                                        eventHandlers={{ click: () => setSelectedZone(isActive ? null : zone) }}>
                                        <Popup className="mausam-popup">
                                            <div style={{ fontFamily: 'var(--mono)', minWidth: '220px', background: '#0a0c10', color: '#e2e8f0', padding: '.75rem 1rem', borderRadius: '8px' }}>
                                                <div style={{ color: cfg.color, fontSize: '.68rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '.4rem' }}>
                                                    ● {zone.risk} RISK
                                                </div>
                                                <div style={{ fontSize: '.85rem', fontWeight: 700, color: '#fff', marginBottom: '.3rem' }}>{zone.name}</div>
                                                <div style={{ fontSize: '.65rem', color: '#888', marginBottom: '.5rem' }}>{zone.river} · {zone.state}</div>
                                                <div style={{ fontSize: '.65rem', color: '#aaa', lineHeight: 1.5 }}>{zone.desc.slice(0, 120)}...</div>
                                                <div style={{ marginTop: '.6rem', display: 'flex', justifyContent: 'space-between', fontSize: '.62rem', color: '#666' }}>
                                                    <span>P(flood): <span style={{ color: cfg.color }}>{(zone.pFlood * 100).toFixed(0)}%</span></span>
                                                    <span>Nodes: {zone.sensors}</span>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                </React.Fragment>
                            );
                        })}
                    </MapContainer>

                    {/* Map legend overlay */}
                    <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(3,5,8,.88)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.09)', borderRadius: '8px', padding: '.6rem .9rem', zIndex: 1000 }}>
                        {Object.entries(RISK_CONFIG).map(([risk, cfg]) => (
                            <div key={risk} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '3px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cfg.color }} />
                                <span style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: '#aaa' }}>{risk}</span>
                            </div>
                        ))}
                        <div style={{ marginTop: '.5rem', borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: '.4rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '.4rem', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '.6rem', color: '#888' }}>
                                <input type="checkbox" checked={showAllRings} onChange={e => setShowAllRings(e.target.checked)} style={{ accentColor: '#22c55e' }} />
                                Risk Radii
                            </label>
                        </div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: '.58rem', color: '#555', marginTop: '.3rem' }}>
                            {TILE_LAYERS[tileLayer].attribution.slice(0, 30)}
                        </div>
                    </div>

                    {/* Stats overlay */}
                    <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(3,5,8,.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '8px', padding: '.5rem .85rem', zIndex: 1000, display: 'flex', gap: '1rem' }}>
                        {[
                            { label: 'Extreme', count: stats.extreme, color: '#ef4444' },
                            { label: 'Critical', count: stats.critical, color: '#f97316' },
                            { label: 'High', count: stats.high, color: '#eab308' },
                            { label: 'Moderate', count: stats.moderate, color: '#3b82f6' },
                        ].map(s => (
                            <div key={s.label} style={{ textAlign: 'center' }}>
                                <div style={{ fontFamily: 'var(--mono)', fontSize: '.85rem', fontWeight: 700, color: s.color }}>{s.count}</div>
                                <div style={{ fontFamily: 'var(--mono)', fontSize: '.55rem', color: '#666' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar zone list */}
                <div style={{ background: 'rgba(5,7,12,.95)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                    {/* Selected zone detail */}
                    <AnimatePresence mode="wait">
                        {selectedZone ? (
                            <motion.div key={selectedZone.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,.06)', background: 'rgba(0,0,0,.4)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.5rem' }}>
                                    <div>
                                        <div style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: RISK_CONFIG[selectedZone.risk as keyof typeof RISK_CONFIG].color, textTransform: 'uppercase', marginBottom: '2px' }}>
                                            ● {selectedZone.risk} RISK
                                        </div>
                                        <div style={{ fontWeight: 700, fontSize: '.9rem', color: '#fff', lineHeight: 1.2 }}>{selectedZone.name}</div>
                                        <div style={{ fontFamily: 'var(--mono)', fontSize: '.62rem', color: 'var(--muted)', marginTop: '2px' }}>{selectedZone.river} · {selectedZone.state}</div>
                                    </div>
                                    <button onClick={() => setSelectedZone(null)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1rem' }}>×</button>
                                </div>

                                {/* Metrics */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.4rem', marginBottom: '.75rem' }}>
                                    {[
                                        ['Elevation', selectedZone.elevation],
                                        ['Last Event', selectedZone.lastEvent],
                                        ['Casualties', selectedZone.casualties],
                                        ['Sensors', `${selectedZone.sensors} nodes`],
                                    ].map(([k, v]) => (
                                        <div key={k} style={{ background: 'rgba(255,255,255,.03)', borderRadius: '6px', padding: '.4rem .6rem' }}>
                                            <div style={{ fontFamily: 'var(--mono)', fontSize: '.55rem', color: 'var(--muted)', textTransform: 'uppercase' }}>{k}</div>
                                            <div style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', color: '#fff', marginTop: '1px' }}>{v}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* P(flood) bar */}
                                <div style={{ marginBottom: '.75rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: '.6rem', color: 'var(--muted)', marginBottom: '4px' }}>
                                        <span>Mausam-IR P(flood | T+6h)</span>
                                        <span style={{ color: RISK_CONFIG[selectedZone.risk as keyof typeof RISK_CONFIG].color }}>{(selectedZone.pFlood * 100).toFixed(0)}%</span>
                                    </div>
                                    <div style={{ height: '5px', background: 'rgba(255,255,255,.08)', borderRadius: '3px' }}>
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${selectedZone.pFlood * 100}%` }} transition={{ duration: .6 }}
                                            style={{ height: '100%', background: RISK_CONFIG[selectedZone.risk as keyof typeof RISK_CONFIG].color, borderRadius: '3px', boxShadow: `0 0 8px ${RISK_CONFIG[selectedZone.risk as keyof typeof RISK_CONFIG].color}` }} />
                                    </div>
                                </div>

                                {/* YouTube embed */}
                                <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,.08)' }}>
                                    <div style={{ background: 'rgba(239,68,68,.08)', padding: '.35rem .6rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                                        <Youtube size={11} color="#ef4444" />
                                        <span style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: '#ef4444' }}>ARCHIVE FOOTAGE</span>
                                    </div>
                                    <iframe
                                        src={`https://www.youtube.com/embed/${selectedZone.youtube}?rel=0&modestbranding=1`}
                                        title={selectedZone.name}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media"
                                        allowFullScreen
                                        style={{ width: '100%', height: '140px', border: 'none', display: 'block' }}
                                    />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,.06)', background: 'rgba(0,0,0,.3)' }}>
                                <div style={{ fontFamily: 'var(--mono)', fontSize: '.62rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                                    <Info size={12} /> Click a zone on the map for details &amp; footage
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Zone list */}
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {filtered.map(zone => {
                            const cfg = RISK_CONFIG[zone.risk as keyof typeof RISK_CONFIG];
                            const isActive = selectedZone?.id === zone.id;
                            return (
                                <div key={zone.id} onClick={() => setSelectedZone(isActive ? null : zone)}
                                    style={{
                                        padding: '.7rem 1rem', borderBottom: '1px solid rgba(255,255,255,.04)', cursor: 'pointer',
                                        background: isActive ? `${cfg.color}0d` : 'transparent',
                                        borderLeft: `3px solid ${isActive ? cfg.color : 'transparent'}`,
                                        transition: 'all .15s'
                                    }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '.78rem', color: isActive ? '#fff' : '#ccc', marginBottom: '1px' }}>{zone.name}</div>
                                            <div style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: 'var(--muted)' }}>{zone.state}</div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                                            <span style={{ fontFamily: 'var(--mono)', fontSize: '.58rem', color: cfg.color, background: `${cfg.color}18`, border: `1px solid ${cfg.color}33`, padding: '1px 6px', borderRadius: '10px' }}>
                                                {zone.risk}
                                            </span>
                                            <span style={{ fontFamily: 'var(--mono)', fontSize: '.58rem', color: 'var(--muted)' }}>
                                                {(zone.pFlood * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div style={{ padding: '.6rem 1rem', borderTop: '1px solid rgba(255,255,255,.06)', background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                        <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}>
                            <Radio size={11} color="#22c55e" />
                        </motion.div>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: '.62rem', color: 'var(--muted)' }}>
                            {FLOOD_ZONES.reduce((s, z) => s + z.sensors, 0)} nodes online · Esri Satellite Imagery
                        </span>
                    </div>
                </div>
            </div>

            {/* Popup dark style injection */}
            <style>{`
        .leaflet-popup-content-wrapper { background: transparent !important; box-shadow: 0 8px 32px rgba(0,0,0,.8) !important; border: 1px solid rgba(255,255,255,.1) !important; border-radius: 10px !important; padding: 0 !important; }
        .leaflet-popup-content { margin: 0 !important; }
        .leaflet-popup-tip { background: rgba(10,12,16,1) !important; }
        .mausam-popup .leaflet-popup-close-button { color: #888 !important; right: 8px !important; top: 8px !important; }
        .leaflet-container { background: #060810 !important; }
        .leaflet-control-zoom { border: 1px solid rgba(255,255,255,.1) !important; }
        .leaflet-control-zoom a { background: rgba(5,7,12,.9) !important; color: #888 !important; border-color: rgba(255,255,255,.08) !important; }
        .leaflet-control-zoom a:hover { background: rgba(34,197,94,.1) !important; color: #22c55e !important; }
        .leaflet-control-attribution { background: rgba(5,7,12,.7) !important; color: #444 !important; }
      `}</style>
        </div>
    );
};

export default HimalayanFloodMap;
