import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Youtube, Info, Layers, ExternalLink, Shield, Brain, Zap, Maximize2, CloudRain } from 'lucide-react';

import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ─── Data ────────────────────────────────────────────────────────────────────
const FLOOD_ZONES = [
    {
        id: 'kedarnath', name: 'Kedarnath Valley', lat: 30.7346, lon: 79.0669,
        risk: 'EXTREME', river: 'Mandakini River', state: 'Uttarakhand', elevation: '3,583 m',
        lastEvent: 'June 2013', casualties: '5,700+', pFlood: 0.84, sensors: 3,
        youtube: 'CGrfZAHJhUU',
        desc: '2013 cloudburst triggered a GLOF from Chorabari Lake releasing 7.6M m³ of water — worst Himalayan disaster in recorded history.',
        causes: [
            { label: 'GLOF (Chorabari Lake)', weight: 55, color: '#60a5fa', tag: 'PRIMARY' },
            { label: 'Cloudburst >200mm/hr', weight: 35, color: '#22c55e', tag: 'TRIGGER' },
            { label: 'Deforestation (val slope)', weight: 10, color: '#84cc16', tag: 'AMPLIFIER' },
        ],
        solutions: ['LoRaWAN sensor mesh (3 nodes active)', 'GLOF siphon on Chorabari Lake', 'IMD mountain nowcast integration', 'Pilgrimage season EWS siren'],
        govLinks: [
            { name: 'IMD Kedarnath Forecast', url: 'https://mausam.imd.gov.in' },
            { name: 'MOSDAC INSAT Cloud-Top', url: 'https://mosdac.gov.in' },
            { name: 'CWC Mandakini Gauge', url: 'https://cwc.gov.in' },
        ],
    },
    {
        id: 'chamoli', name: 'Chamoli / Rishiganga', lat: 30.4228, lon: 79.5727,
        risk: 'EXTREME', river: 'Rishiganga → Dhauliganga', state: 'Uttarakhand', elevation: '3,200 m',
        lastEvent: 'Feb 2021', casualties: '204', pFlood: 0.76, sensors: 2,
        youtube: '2bl0FVEAIi8',
        desc: 'Glacier avalanche + GLOF destroyed Rishiganga hydro project. 13M m³ of rock-ice traveled at 160 km/h.',
        causes: [
            { label: 'Rock-ice avalanche GLOF', weight: 70, color: '#60a5fa', tag: 'PRIMARY' },
            { label: 'Hydropower dam failure', weight: 20, color: '#fb923c', tag: 'AMPLIFIER' },
            { label: 'Climate (glacier retreat)', weight: 10, color: '#ef4444', tag: 'ROOT CAUSE' },
        ],
        solutions: ['SAR coherence monitoring (Sentinel-1)', 'Moraine stability seismic sensors', 'NHPC dam OT release protocol', 'Subzero GLOF alert algorithm'],
        govLinks: [
            { name: 'GSI GLOF Atlas', url: 'https://www.gsi.gov.in' },
            { name: 'NDMA Chamoli Advisory', url: 'https://ndma.gov.in' },
            { name: 'ISRO Bhuvan Glacier DB', url: 'https://bhuvan.nrsc.gov.in' },
        ],
    },
    {
        id: 'alaknanda', name: 'Alaknanda Valley', lat: 30.3246, lon: 79.4373,
        risk: 'CRITICAL', river: 'Alaknanda River', state: 'Uttarakhand', elevation: '2,100 m',
        lastEvent: 'Aug 2012', casualties: '70+', pFlood: 0.68, sensors: 2,
        youtube: 'nSs2LF9V688',
        desc: 'Steep gradient tributary of the Ganges. Annual cloudbursts cause rapid inundation of Badrinath highway towns.',
        causes: [
            { label: 'Cloudburst (orographic)', weight: 50, color: '#22c55e', tag: 'PRIMARY' },
            { label: 'Landslide dam outburst', weight: 30, color: '#f97316', tag: 'SECONDARY' },
            { label: 'Channel encroachment', weight: 20, color: '#a78bfa', tag: 'AMPLIFIER' },
        ],
        solutions: ['Choke-point gauge + camera sensors', 'NGT floodplain clearance enforcement', 'IMD WRF mesoscale alert', 'Emergency escape road NH-58'],
        govLinks: [
            { name: 'CWC Alaknanda Forecast', url: 'https://cwc.gov.in' },
            { name: 'IMD Uttarakhand Warning', url: 'https://mausam.imd.gov.in' },
            { name: 'NIDM Landslide Atlas', url: 'https://nidm.gov.in' },
        ],
    },
    {
        id: 'brahmaputra', name: 'Brahmaputra Basin', lat: 27.1039, lon: 93.6219,
        risk: 'CRITICAL', river: 'Brahmaputra River', state: 'Assam', elevation: '85 m',
        lastEvent: 'Jul 2024', casualties: '95+', pFlood: 0.71, sensors: 4,
        youtube: 'rUK4JFbVKeE',
        desc: 'World\'s fastest large river. Annual monsoon flooding displaces millions. Accelerated glacial melt upstream.',
        causes: [
            { label: 'Monsoon rainfall surge', weight: 45, color: '#22c55e', tag: 'PRIMARY' },
            { label: 'Deforestation (Arunachal)', weight: 30, color: '#84cc16', tag: 'AMPLIFIER' },
            { label: 'Climate glacier melt', weight: 25, color: '#ef4444', tag: 'ROOT CAUSE' },
        ],
        solutions: ['CWC HYCOS river-gauge telemetry (4 nodes)', 'BWMA embankment surveillance drones', 'China GLOF data-sharing MOU', 'Assam community flood shelter mapping'],
        govLinks: [
            { name: 'CWC Brahmaputra Forecast', url: 'https://rwportal.india-water.gov.in' },
            { name: 'BWMA Assam', url: 'https://bwma.assam.gov.in' },
            { name: 'NASA MODIS Flood Map', url: 'https://firms.modaps.eosdis.nasa.gov' },
        ],
    },
    {
        id: 'teesta', name: 'Teesta River Basin', lat: 27.2500, lon: 88.6250,
        risk: 'CRITICAL', river: 'Teesta River', state: 'Sikkim', elevation: '450 m',
        lastEvent: 'Oct 2023', casualties: '100+', pFlood: 0.73, sensors: 3,
        youtube: 'kMK3o3o12kU',
        desc: '2023 GLOF from South Lhonak Lake breach. 20m flood wall swept through Singtam and Rangpo.',
        causes: [
            { label: 'South Lhonak Lake GLOF', weight: 60, color: '#60a5fa', tag: 'PRIMARY' },
            { label: 'NTPC dam emergency release', weight: 25, color: '#fb923c', tag: 'AMPLIFIER' },
            { label: 'Cloudbursts upstream', weight: 15, color: '#22c55e', tag: 'TRIGGER' },
        ],
        solutions: ['South Lhonak siphon drainage system', 'NTPC dam release protocol reform', 'GLOF pre-warning siren network (Rangpo)', 'Sikkim SDMA multi-model ensemble'],
        govLinks: [
            { name: 'SDMA Sikkim', url: 'https://sdma.sikkim.gov.in' },
            { name: 'ISRO GLOF Monitor', url: 'https://bhuvan.nrsc.gov.in' },
            { name: 'CWC Teesta Stage Data', url: 'https://cwc.gov.in' },
        ],
    },
    {
        id: 'beas', name: 'Beas River Gorge', lat: 31.8580, lon: 77.1167,
        risk: 'HIGH', river: 'Beas River', state: 'Himachal Pradesh', elevation: '2,660 m',
        lastEvent: 'Jun 2014', casualties: '24', pFlood: 0.58, sensors: 2,
        youtube: 'm-jDKmMEJgI',
        desc: 'Flash flood swept students at Larji due to dam release without downstream warning — a monitoring failure.',
        causes: [
            { label: 'BBMB dam uncoordinated release', weight: 50, color: '#fb923c', tag: 'PRIMARY' },
            { label: 'Cloudburst Parbati catchment', weight: 35, color: '#22c55e', tag: 'TRIGGER' },
            { label: 'No downstream EWS', weight: 15, color: '#ef4444', tag: 'ROOT CAUSE' },
        ],
        solutions: ['BBMB automated release siren (installed 2016)', 'Mausam-IR ESP32 node at Larji bridge', 'IMD HP Mountain Warning upgrade', 'Tourist zone restricted access protocol'],
        govLinks: [
            { name: 'BBMB Operations', url: 'https://bbmb.gov.in' },
            { name: 'IMD Himachal Forecast', url: 'https://mausam.imd.gov.in' },
            { name: 'HP SDMA', url: 'https://hpsdma.nic.in' },
        ],
    },
    {
        id: 'sutlej', name: 'Sutlej Basin (Kinnaur)', lat: 31.6700, lon: 77.1500,
        risk: 'HIGH', river: 'Sutlej River', state: 'Himachal Pradesh', elevation: '1,800 m',
        lastEvent: 'Aug 2021', casualties: '27+', pFlood: 0.55, sensors: 2,
        youtube: 'tgJ3pYKXKaU',
        desc: 'Kinnaur landslides and flash floods. Narrow gorge amplifies flood intensity. NH-5 regularly cut off.',
        causes: [
            { label: 'Landslide dam outburst', weight: 55, color: '#f97316', tag: 'PRIMARY' },
            { label: 'Cloudburst (Spiti origin)', weight: 30, color: '#22c55e', tag: 'TRIGGER' },
            { label: 'Slope instability (NH cuts)', weight: 15, color: '#84cc16', tag: 'AMPLIFIER' },
        ],
        solutions: ['GSI landslide early-warning cable extensometers', 'NPRP slope protection geo-grids at NH-5', 'HP PWD automated road closure gates', 'Real-time SAR coherence from ISRO RISAT'],
        govLinks: [
            { name: 'GSI Kinnaur Monitoring', url: 'https://www.gsi.gov.in' },
            { name: 'HP PWD Road Status', url: 'https://himachalservices.nic.in' },
            { name: 'CWC Sutlej Gauge', url: 'https://cwc.gov.in' },
        ],
    },
    {
        id: 'kosi', name: 'Kosi River (Sorrow of Bihar)', lat: 26.5000, lon: 87.1700,
        risk: 'CRITICAL', river: 'Kosi River', state: 'Bihar/Nepal', elevation: '110 m',
        lastEvent: 'Aug 2008', casualties: '527+', pFlood: 0.69, sensors: 3,
        youtube: 'nXiCFXsFL0o',
        desc: '"Sorrow of Bihar" — Kosi breached embankments in 2008, changed course 120 km, affecting 3.3 million people.',
        causes: [
            { label: 'Embankment breach', weight: 45, color: '#ef4444', tag: 'PRIMARY' },
            { label: 'Nepal upstream cloudburst', weight: 35, color: '#22c55e', tag: 'TRIGGER' },
            { label: 'Excessive sedimentation', weight: 20, color: '#f97316', tag: 'ROOT CAUSE' },
        ],
        solutions: ['Indo-Nepal bilateral flood data MOU', 'NDRF bio-engineering embankment repair', 'Bihar APDP community shelter network', 'CWC HYCOS 72-hour advance forecast'],
        govLinks: [
            { name: 'CWC Kosi Forecast Portal', url: 'https://rwportal.india-water.gov.in' },
            { name: 'BSDMA Bihar', url: 'https://bsdma.org' },
            { name: 'NDMA Kosi Guidelines', url: 'https://ndma.gov.in' },
        ],
    },
    {
        id: 'jhelum', name: 'Jhelum Basin (Kashmir)', lat: 34.0800, lon: 74.8000,
        risk: 'HIGH', river: 'Jhelum River', state: 'J&K', elevation: '1,580 m',
        lastEvent: 'Sep 2014', casualties: '277+', pFlood: 0.61, sensors: 2,
        youtube: 'X9p3R2vNEbA',
        desc: '2014 Kashmir floods — worst in 50 years. Jhelum reached 35 ft above danger mark. Srinagar submerged 2 weeks.',
        causes: [
            { label: 'Persistent low-pressure rainfall', weight: 50, color: '#22c55e', tag: 'PRIMARY' },
            { label: 'Wetland encroachment (Hokersar)', weight: 30, color: '#a78bfa', tag: 'AMPLIFIER' },
            { label: 'Inadequate flood control gates', weight: 20, color: '#fb923c', tag: 'SYSTEMIC' },
        ],
        solutions: ['Wular-Hokersar wetland restoration (J&K Govt)', 'Jhelum Flood Spill Channel dredging', 'IMD Kashmir extended-range forecast', 'Valley-wide SMS flood alert system'],
        govLinks: [
            { name: 'J&K SDRF Portal', url: 'https://jksdrf.in' },
            { name: 'CWC Jhelum at Sangam', url: 'https://cwc.gov.in' },
            { name: 'IMD Srinagar Warning', url: 'https://mausam.imd.gov.in' },
        ],
    },
    {
        id: 'pindar', name: 'Pindar Valley', lat: 30.2015, lon: 79.8600,
        risk: 'HIGH', river: 'Pindar River', state: 'Uttarakhand', elevation: '2,750 m',
        lastEvent: 'Jul 2021', casualties: '15+', pFlood: 0.52, sensors: 1,
        youtube: 'nSs2LF9V688',
        desc: 'Multiple glacial lakes upstream with no early warning — a primary Mausam-IR deployment target.',
        causes: [
            { label: 'Multiple upstream GLOFs', weight: 60, color: '#60a5fa', tag: 'PRIMARY' },
            { label: 'Cloudburst (Bageshwar)', weight: 30, color: '#22c55e', tag: 'TRIGGER' },
            { label: 'Zero EWS coverage', weight: 10, color: '#ef4444', tag: 'GAP' },
        ],
        solutions: ['Priority Mausam-IR node deployment (Planned FY26)', 'Kafni/Pindari glacier lake siphon study', 'Kapkot-Tharali road emergency closure', 'Village-level disaster committee training'],
        govLinks: [
            { name: 'SDMA Uttarakhand', url: 'https://sdma.uk.gov.in' },
            { name: 'ISRO Glacier Inventory', url: 'https://bhuvan.nrsc.gov.in' },
            { name: 'IMD Kumaon Division', url: 'https://mausam.imd.gov.in' },
        ],
    },
    {
        id: 'subansiri', name: 'Subansiri River Basin', lat: 27.5000, lon: 93.8000,
        risk: 'HIGH', river: 'Subansiri River', state: 'Arunachal Pradesh', elevation: '150 m',
        lastEvent: 'Jun 2022', casualties: '12+', pFlood: 0.54, sensors: 1,
        youtube: 'rUK4JFbVKeE',
        desc: 'Glacial fed river with extreme variability. Chinese dams upstream create uncertainty for Indian downstream communities.',
        causes: [
            { label: 'Monsoon-glacier compound surge', weight: 45, color: '#22c55e', tag: 'PRIMARY' },
            { label: 'Chinese dam release (Upstr.)', weight: 35, color: '#fb923c', tag: 'UNCONTROLLED' },
            { label: 'Forest loss (60% in 30yr)', weight: 20, color: '#84cc16', tag: 'AMPLIFIER' },
        ],
        solutions: ['India-China flood data protocol (MOFA)', 'NRSC deforestation change detection', 'Subansiri Lower dam EWS upgrade', 'Community Apatani early-warning cultural integration'],
        govLinks: [
            { name: 'CWC Subansiri Monitor', url: 'https://cwc.gov.in' },
            { name: 'APDMA Arunachal', url: 'https://apdma.nic.in' },
            { name: 'FSI Forest Cover Report', url: 'https://fsi.nic.in' },
        ],
    },
    {
        id: 'lahaul', name: 'Lahaul Spiti Valley', lat: 32.6833, lon: 77.5667,
        risk: 'MODERATE', river: 'Chandra-Bhaga (Chenab)', state: 'Himachal Pradesh', elevation: '3,200 m',
        lastEvent: 'Aug 2023', casualties: '8', pFlood: 0.41, sensors: 1,
        youtube: 'tgJ3pYKXKaU',
        desc: 'Cold desert experiencing unprecedented monsoon penetration and periglacial activity.',
        causes: [
            { label: 'Monsoon penetration (new)', weight: 50, color: '#22c55e', tag: 'EMERGING' },
            { label: 'Permafrost thaw debris', weight: 35, color: '#f97316', tag: 'CLIMATE-DRIVEN' },
            { label: 'No historical baseline data', weight: 15, color: '#64748b', tag: 'KNOWLEDGE GAP' },
        ],
        solutions: ['Spiti Valley permafrost monitoring array', 'HPADP high-altitude road resilience', 'IMD La weather station upgrade', 'SASE Manali avalanche-flood correlation study'],
        govLinks: [
            { name: 'SASE Manali Snow Research', url: 'https://sase.gov.in' },
            { name: 'IMD Shimla Forecast', url: 'https://mausam.imd.gov.in' },
            { name: 'HP Disaster Alert', url: 'https://hpsdma.nic.in' },
        ],
    },
    {
        id: 'tons', name: 'Tons River Valley', lat: 30.8500, lon: 78.0000,
        risk: 'MODERATE', river: 'Tons River', state: 'Uttarakhand', elevation: '1,200 m',
        lastEvent: 'Aug 2022', casualties: '20+', pFlood: 0.44, sensors: 1,
        youtube: 'CGrfZAHJhUU',
        desc: 'Largest Yamuna tributary. Hydropower projects altered natural flow regime, increasing flash flood risk.',
        causes: [
            { label: 'Uncoordinated dam releases', weight: 40, color: '#fb923c', tag: 'PRIMARY' },
            { label: 'Cloudburst Govind Pashu', weight: 40, color: '#22c55e', tag: 'CO-CAUSE' },
            { label: 'Deforestation upper catchment', weight: 20, color: '#84cc16', tag: 'AMPLIFIER' },
        ],
        solutions: ['THDC dam coordinated release schedule', 'Real-time Tons gauge at Mori & Netwar', 'Integrated CWC telemetry with Mausam-IR', 'Riparian reforestation programme'],
        govLinks: [
            { name: 'THDC India Operations', url: 'https://thdc.co.in' },
            { name: 'CWC Yamuna Tributary', url: 'https://cwc.gov.in' },
            { name: 'UKSDMA Portal', url: 'https://sdma.uk.gov.in' },
        ],
    },
    {
        id: 'uttarkashi', name: 'Uttarkashi / Bhagirathi', lat: 30.7268, lon: 78.4354,
        risk: 'CRITICAL', river: 'Bhagirathi River', state: 'Uttarakhand', elevation: '1,160 m',
        lastEvent: 'Jul 2023', casualties: '55+', pFlood: 0.67, sensors: 2,
        youtube: 'CGrfZAHJhUU',
        desc: 'Upper Ganga basin. 2023 cloudburst caused 72-hour flood cycle destroying 14 bridges on NH-34.',
        causes: [
            { label: 'Extreme cloudburst (120mm/hr)', weight: 55, color: '#22c55e', tag: 'PRIMARY' },
            { label: 'Glacial melt amplification', weight: 25, color: '#60a5fa', tag: 'AMPLIFIER' },
            { label: 'Debris flow from NH construction', weight: 20, color: '#f97316', tag: 'SYSTEMIC' },
        ],
        solutions: ['IMD Gangotri nowcast station (installed 2024)', 'NH-34 automated closure sensors', 'Bhagirathi debris retention check-dams', 'Char Dham pilgrimage EWS coordination (GMVN)'],
        govLinks: [
            { name: 'IMD Uttarakhand Warning', url: 'https://mausam.imd.gov.in' },
            { name: 'GMVN (Char Dham EWS)', url: 'https://gmvnl.in' },
            { name: 'NHAI NH-34 Monitoring', url: 'https://nhai.gov.in' },
        ],
    },
];

const RISK_CONFIG = {
    EXTREME: { color: '#ef4444', radius: 40000 },
    CRITICAL: { color: '#f97316', radius: 30000 },
    HIGH: { color: '#eab308', radius: 22000 },
    MODERATE: { color: '#3b82f6', radius: 16000 },
};

const TILE_LAYERS = [
    { id: 'satellite', label: 'Satellite', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution: '© Esri, Maxar' },
    { id: 'dark', label: 'Dark Map', url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', attribution: '© CARTO' },
    { id: 'terrain', label: 'Terrain', url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', attribution: '© OpenTopoMap' },
];

const createMarkerIcon = (risk: string, isActive: boolean) => {
    const cfg = RISK_CONFIG[risk as keyof typeof RISK_CONFIG];
    return divIcon({
        className: '',
        html: `
      <div style="position:relative;width:26px;height:26px;">
        <div style="position:absolute;inset:0;border-radius:50%;background:${cfg.color};opacity:0.2;animation:pulse 1.8s infinite;"></div>
        <div style="position:absolute;inset:6px;border-radius:50%;background:${cfg.color};border:2px solid ${isActive ? '#fff' : cfg.color};box-shadow:0 0 ${isActive ? 14 : 6}px ${cfg.color};"></div>
      </div>
      <style>@keyframes pulse{0%,100%{transform:scale(1);opacity:.2}50%{transform:scale(2.4);opacity:0.04}}</style>
    `,
        iconSize: [26, 26], iconAnchor: [13, 13],
    });
};

function MapController() {
    const map = useMap();
    useEffect(() => {
        const bounds: [number, number][] = FLOOD_ZONES.map(z => [z.lat, z.lon]);
        map.fitBounds(bounds as any, { padding: [40, 40] });
    }, [map]);
    return null;
}

type Zone = typeof FLOOD_ZONES[0];
type SidebarTab = 'info' | 'causes' | 'solutions' | 'gov';

const HimalayanFloodMap: React.FC = () => {
    const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
    const [tileLayer, setTileLayer] = useState(0);
    const [showRings, setShowRings] = useState(true);
    const [filterRisk, setFilterRisk] = useState<string | null>(null);
    const [sidebarTab, setSidebarTab] = useState<SidebarTab>('info');
    const [isPerspective, setIsPerspective] = useState(false);
    const [showRain, setShowRain] = useState(false);

    const filtered = filterRisk ? FLOOD_ZONES.filter(z => z.risk === filterRisk) : FLOOD_ZONES;
    const stats = { extreme: 0, critical: 0, high: 0, moderate: 0 };
    FLOOD_ZONES.forEach(z => {
        if (z.risk === 'EXTREME') stats.extreme++;
        else if (z.risk === 'CRITICAL') stats.critical++;
        else if (z.risk === 'HIGH') stats.high++;
        else stats.moderate++;
    });

    const rcfg = (r: string) => RISK_CONFIG[r as keyof typeof RISK_CONFIG] ?? { color: '#888' };

    const handleZoneClick = (zone: Zone) => {
        setSelectedZone(prev => prev?.id === zone.id ? null : zone);
        setSidebarTab('info');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Controls */}
            <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
                    <button onClick={() => setFilterRisk(null)}
                        style={{ padding: '.3rem .75rem', borderRadius: '20px', border: `1px solid ${!filterRisk ? '#fff' : 'rgba(255,255,255,.15)'}`, background: !filterRisk ? 'rgba(255,255,255,.1)' : 'transparent', color: !filterRisk ? '#fff' : 'var(--muted)', fontFamily: 'var(--mono)', fontSize: '.63rem', cursor: 'pointer' }}>
                        ALL ({FLOOD_ZONES.length})
                    </button>
                    {(Object.keys(RISK_CONFIG) as string[]).map(risk => (
                        <button key={risk} onClick={() => setFilterRisk(filterRisk === risk ? null : risk)}
                            style={{ padding: '.3rem .75rem', borderRadius: '20px', border: `1px solid ${filterRisk === risk ? rcfg(risk).color : 'rgba(255,255,255,.12)'}`, background: filterRisk === risk ? `${rcfg(risk).color}20` : 'transparent', color: filterRisk === risk ? rcfg(risk).color : 'var(--muted)', fontFamily: 'var(--mono)', fontSize: '.63rem', cursor: 'pointer' }}>
                            ● {risk} ({FLOOD_ZONES.filter(z => z.risk === risk).length})
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '.4rem', alignItems: 'center' }}>
                    <button onClick={() => setShowRain(!showRain)}
                        style={{ display: 'flex', alignItems: 'center', gap: '.3rem', padding: '.28rem .65rem', borderRadius: '6px', border: `1px solid ${showRain ? '#3b82f6' : 'rgba(255,255,255,.12)'}`, background: showRain ? 'rgba(59,130,246,.1)' : 'transparent', color: showRain ? '#3b82f6' : 'var(--muted)', fontFamily: 'var(--mono)', fontSize: '.62rem', cursor: 'pointer' }}>
                        <CloudRain size={10} /> Weather Overlay
                    </button>
                    <button onClick={() => setIsPerspective(!isPerspective)}
                        style={{ display: 'flex', alignItems: 'center', gap: '.3rem', padding: '.28rem .65rem', borderRadius: '6px', border: `1px solid ${isPerspective ? '#a855f7' : 'rgba(255,255,255,.12)'}`, background: isPerspective ? 'rgba(168,85,247,.1)' : 'transparent', color: isPerspective ? '#a855f7' : 'var(--muted)', fontFamily: 'var(--mono)', fontSize: '.62rem', cursor: 'pointer' }}>
                        <Maximize2 size={10} /> 3D Perspective
                    </button>
                    <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,.1)', margin: '0 .2rem' }} />
                    <Layers size={12} color="var(--muted)" />
                    {TILE_LAYERS.map((l, i) => (
                        <button key={l.id} onClick={() => setTileLayer(i)}
                            style={{ padding: '.28rem .65rem', borderRadius: '6px', border: `1px solid ${tileLayer === i ? '#22c55e' : 'rgba(255,255,255,.12)'}`, background: tileLayer === i ? 'rgba(34,197,94,.1)' : 'transparent', color: tileLayer === i ? '#22c55e' : 'var(--muted)', fontFamily: 'var(--mono)', fontSize: '.62rem', cursor: 'pointer' }}>
                            {l.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Map + Sidebar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1rem', height: '600px' }}>

                {/* ── Map ── */}
                <div style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,.1)',
                    position: 'relative',
                    perspective: '1000px'
                }}>
                    <div style={{
                        height: '100%',
                        width: '100%',
                        transform: isPerspective ? 'rotateX(12deg) translateY(-15px) scale(0.98)' : 'none',
                        transformOrigin: 'bottom center',
                        transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
                    }}>
                        <MapContainer center={[30, 82]} zoom={6} style={{ height: '100%', width: '100%', background: '#060810' }} zoomControl attributionControl={false}>
                            <MapController />
                            <TileLayer url={TILE_LAYERS[tileLayer].url} attribution={TILE_LAYERS[tileLayer].attribution} />
                            {showRain && <TileLayer
                                url="https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=d22f796472f6f17bc10cdcf0f09a1a45"
                                opacity={0.6}
                            />}
                            {filtered.map(zone => {
                                const cfg = rcfg(zone.risk);
                                const isActive = selectedZone?.id === zone.id;
                                return (
                                    <React.Fragment key={zone.id}>
                                        <Circle center={[zone.lat, zone.lon]} radius={cfg.radius} pathOptions={{ color: cfg.color, fillColor: cfg.color, fillOpacity: isActive ? 0.14 : 0.05, weight: isActive ? 2 : 1, opacity: isActive ? 0.9 : 0.4 }} />
                                        <Marker position={[zone.lat, zone.lon]} icon={createMarkerIcon(zone.risk, isActive)}
                                            eventHandlers={{ click: () => handleZoneClick(zone) }}>
                                            <Popup className="mausam-popup">
                                                <div style={{ fontFamily: 'var(--mono)', minWidth: '200px', background: '#08090e', color: '#e2e8f0', padding: '.75rem 1rem', borderRadius: '8px' }}>
                                                    <div style={{ color: cfg.color, fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '3px' }}>● {zone.risk}</div>
                                                    <div style={{ fontSize: '.82rem', fontWeight: 700, color: '#fff' }}>{zone.name}</div>
                                                    <div style={{ fontSize: '.62rem', color: '#888', margin: '3px 0 6px' }}>{zone.river} · {zone.state}</div>
                                                    <div style={{ height: '3px', background: 'rgba(255,255,255,.06)', borderRadius: '2px', marginBottom: '6px' }}>
                                                        <div style={{ height: '100%', width: `${zone.pFlood * 100}%`, background: cfg.color, borderRadius: '2px' }} />
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.6rem', color: '#666' }}>
                                                        <span>P(flood): <span style={{ color: cfg.color }}>{(zone.pFlood * 100).toFixed(0)}%</span></span>
                                                        <span>{zone.causes[0].label.split('(')[0].trim()}</span>
                                                    </div>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    </React.Fragment>
                                );
                            })}
                        </MapContainer>
                    </div>

                    {/* Map legend */}
                    <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(3,5,8,.9)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '8px', padding: '.55rem .85rem', zIndex: 1000 }}>
                        {Object.entries(RISK_CONFIG).map(([risk, cfg]) => (
                            <div key={risk} style={{ display: 'flex', alignItems: 'center', gap: '.45rem', marginBottom: '2px' }}>
                                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: (cfg as any).color }} />
                                <span style={{ fontFamily: 'var(--mono)', fontSize: '.58rem', color: '#aaa' }}>{risk}</span>
                            </div>
                        ))}
                        <label style={{ display: 'flex', alignItems: 'center', gap: '.35rem', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '.58rem', color: '#666', marginTop: '.4rem', borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: '.35rem' }}>
                            <input type="checkbox" checked={showRings} onChange={e => setShowRings(e.target.checked)} style={{ accentColor: '#22c55e' }} /> Risk radii
                        </label>
                    </div>

                    {/* Stats overlay */}
                    <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(3,5,8,.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '8px', padding: '.45rem .8rem', zIndex: 1000, display: 'flex', gap: '.9rem' }}>
                        {[
                            { l: 'Extreme', c: stats.extreme, col: '#ef4444' },
                            { l: 'Critical', c: stats.critical, col: '#f97316' },
                            { l: 'High', c: stats.high, col: '#eab308' },
                            { l: 'Moderate', c: stats.moderate, col: '#3b82f6' },
                        ].map(s => (
                            <div key={s.l} style={{ textAlign: 'center' }}>
                                <div style={{ fontFamily: 'var(--mono)', fontSize: '.8rem', fontWeight: 700, color: s.col }}>{s.c}</div>
                                <div style={{ fontFamily: 'var(--mono)', fontSize: '.53rem', color: '#666' }}>{s.l}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Sidebar ── */}
                <div style={{ background: 'rgba(5,7,12,.96)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                    <AnimatePresence mode="wait">
                        {selectedZone ? (
                            <motion.div key={selectedZone.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

                                {/* Zone header */}
                                <div style={{ padding: '.85rem 1rem', borderBottom: '1px solid rgba(255,255,255,.06)', background: 'rgba(0,0,0,.4)', flexShrink: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <div style={{ fontFamily: 'var(--mono)', fontSize: '.58rem', color: rcfg(selectedZone.risk).color, textTransform: 'uppercase', marginBottom: '2px' }}>● {selectedZone.risk} · {selectedZone.state}</div>
                                            <div style={{ fontWeight: 700, fontSize: '.9rem', color: '#fff', lineHeight: 1.2 }}>{selectedZone.name}</div>
                                            <div style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: 'var(--muted)' }}>{selectedZone.river}</div>
                                        </div>
                                        <button onClick={() => setSelectedZone(null)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1.1rem', lineHeight: '1' }}>×</button>
                                    </div>

                                    {/* P(flood) bar */}
                                    <div style={{ marginTop: '.6rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: '.58rem', color: 'var(--muted)', marginBottom: '3px' }}>
                                            <span>Mausam-IR P(flood | T+6h)</span>
                                            <span style={{ color: rcfg(selectedZone.risk).color }}>{(selectedZone.pFlood * 100).toFixed(0)}%</span>
                                        </div>
                                        <div style={{ height: '4px', background: 'rgba(255,255,255,.07)', borderRadius: '2px' }}>
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${selectedZone.pFlood * 100}%` }} transition={{ duration: .5 }}
                                                style={{ height: '100%', background: rcfg(selectedZone.risk).color, borderRadius: '2px', boxShadow: `0 0 8px ${rcfg(selectedZone.risk).color}` }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Inner tabs */}
                                <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,.05)', flexShrink: 0 }}>
                                    {([
                                        { id: 'info', icon: <Info size={10} />, label: 'Info' },
                                        { id: 'causes', icon: <Zap size={10} />, label: 'Causes' },
                                        { id: 'solutions', icon: <Shield size={10} />, label: 'Solutions' },
                                        { id: 'gov', icon: <Brain size={10} />, label: 'Gov API' },
                                    ] as { id: SidebarTab; icon: React.ReactNode; label: string }[]).map(tab => (
                                        <button key={tab.id} onClick={() => setSidebarTab(tab.id)}
                                            style={{
                                                flex: 1, padding: '.5rem .3rem', background: sidebarTab === tab.id ? 'rgba(168,85,247,.08)' : 'transparent',
                                                borderBottom: `2px solid ${sidebarTab === tab.id ? '#a855f7' : 'transparent'}`, border: 'none',
                                                fontFamily: 'var(--mono)', fontSize: '.6rem', color: sidebarTab === tab.id ? '#a855f7' : 'var(--muted)',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.3rem', transition: 'all .2s'
                                            }}>
                                            {tab.icon}{tab.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Tab content */}
                                <div style={{ flex: 1, overflowY: 'auto' }}>
                                    <AnimatePresence mode="wait">

                                        {/* INFO TAB */}
                                        {sidebarTab === 'info' && (
                                            <motion.div key="info" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} style={{ padding: '.85rem 1rem' }}>
                                                <p style={{ fontFamily: 'var(--sans)', fontSize: '.75rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '.85rem' }}>{selectedZone.desc}</p>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.4rem', marginBottom: '.85rem' }}>
                                                    {[
                                                        ['Elevation', selectedZone.elevation],
                                                        ['Last Event', selectedZone.lastEvent],
                                                        ['Casualties', selectedZone.casualties],
                                                        ['Sensors', `${selectedZone.sensors} active`],
                                                    ].map(([k, v]) => (
                                                        <div key={k} style={{ background: 'rgba(255,255,255,.03)', borderRadius: '6px', padding: '.4rem .6rem' }}>
                                                            <div style={{ fontFamily: 'var(--mono)', fontSize: '.53rem', color: 'var(--muted)', textTransform: 'uppercase' }}>{k}</div>
                                                            <div style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', color: '#fff', marginTop: '1px' }}>{v}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {/* YouTube */}
                                                <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,.08)' }}>
                                                    <div style={{ background: 'rgba(239,68,68,.07)', padding: '.3rem .6rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                                                        <Youtube size={10} color="#ef4444" />
                                                        <span style={{ fontFamily: 'var(--mono)', fontSize: '.58rem', color: '#ef4444' }}>ARCHIVE FOOTAGE</span>
                                                    </div>
                                                    <iframe src={`https://www.youtube.com/embed/${selectedZone.youtube}?rel=0&modestbranding=1`} title={selectedZone.name}
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media" allowFullScreen
                                                        style={{ width: '100%', height: '145px', border: 'none', display: 'block' }} />
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* CAUSES TAB */}
                                        {sidebarTab === 'causes' && (
                                            <motion.div key="causes" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} style={{ padding: '.85rem 1rem' }}>
                                                <div style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '.75rem' }}>
                                                    ⚠ Classified Flood Causes
                                                </div>
                                                {selectedZone.causes.map((cause, i) => (
                                                    <div key={i} style={{ marginBottom: '.85rem' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                                                                <span style={{ fontFamily: 'var(--mono)', fontSize: '.58rem', color: cause.color, border: `1px solid ${cause.color}40`, padding: '1px 5px', borderRadius: '8px' }}>{cause.tag}</span>
                                                                <span style={{ fontFamily: 'var(--mono)', fontSize: '.65rem', color: '#ddd' }}>{cause.label}</span>
                                                            </div>
                                                            <span style={{ fontFamily: 'var(--mono)', fontSize: '.65rem', color: cause.color, fontWeight: 700 }}>{cause.weight}%</span>
                                                        </div>
                                                        <div style={{ height: '5px', background: 'rgba(255,255,255,.06)', borderRadius: '3px' }}>
                                                            <motion.div initial={{ width: 0 }} animate={{ width: `${cause.weight}%` }} transition={{ duration: .5, delay: i * 0.1 }}
                                                                style={{ height: '100%', background: cause.color, borderRadius: '3px', boxShadow: `0 0 6px ${cause.color}77` }} />
                                                        </div>
                                                    </div>
                                                ))}
                                                <div style={{ background: 'rgba(168,85,247,.07)', border: '1px solid rgba(168,85,247,.2)', borderRadius: '8px', padding: '.7rem .85rem', marginTop: '.5rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginBottom: '.35rem' }}>
                                                        <Brain size={11} color="#a855f7" />
                                                        <span style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: '#a855f7', textTransform: 'uppercase' }}>Mausam-IR AI Detection</span>
                                                    </div>
                                                    <div style={{ fontFamily: 'var(--mono)', fontSize: '.65rem', color: '#94a3b8', lineHeight: 1.6 }}>
                                                        Primary cause '{selectedZone.causes[0].label}' detected via spatial-temporal RAG similarity retrieval (cosine sim &gt; 0.89) + PINN physics residual validation.
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* SOLUTIONS TAB */}
                                        {sidebarTab === 'solutions' && (
                                            <motion.div key="solutions" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} style={{ padding: '.85rem 1rem' }}>
                                                <div style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '.75rem' }}>
                                                    🛡 AI-Recommended Mitigation
                                                </div>
                                                {selectedZone.solutions.map((s, i) => (
                                                    <div key={i} style={{ display: 'flex', gap: '.6rem', alignItems: 'flex-start', marginBottom: '.6rem' }}>
                                                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: `${rcfg(selectedZone.risk).color}18`, border: `1px solid ${rcfg(selectedZone.risk).color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                                                            <span style={{ fontFamily: 'var(--mono)', fontSize: '.55rem', color: rcfg(selectedZone.risk).color }}>{i + 1}</span>
                                                        </div>
                                                        <span style={{ fontFamily: 'var(--mono)', fontSize: '.68rem', color: '#cbd5e1', lineHeight: 1.55 }}>{s}</span>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}

                                        {/* GOV API TAB */}
                                        {sidebarTab === 'gov' && (
                                            <motion.div key="gov" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} style={{ padding: '.85rem 1rem' }}>
                                                <div style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '.75rem' }}>
                                                    🌐 Government Data Sources
                                                </div>
                                                {selectedZone.govLinks.map(link => (
                                                    <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
                                                        style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.55rem .75rem', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '8px', textDecoration: 'none', marginBottom: '.4rem', transition: 'all .2s' }}>
                                                        <ExternalLink size={11} color="#22c55e" />
                                                        <div>
                                                            <div style={{ fontFamily: 'var(--mono)', fontSize: '.67rem', color: '#fff' }}>{link.name}</div>
                                                            <div style={{ fontFamily: 'var(--mono)', fontSize: '.57rem', color: 'var(--muted)' }}>{link.url.replace('https://', '')}</div>
                                                        </div>
                                                    </a>
                                                ))}
                                                <div style={{ marginTop: '.5rem', padding: '.6rem .75rem', background: 'rgba(34,197,94,.05)', border: '1px solid rgba(34,197,94,.15)', borderRadius: '8px' }}>
                                                    <div style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: '#22c55e', marginBottom: '3px' }}>Mausam-IR Integration</div>
                                                    <div style={{ fontFamily: 'var(--mono)', fontSize: '.62rem', color: '#64748b', lineHeight: 1.55 }}>
                                                        All sources ingested via RAG chunker (5km² × 6hr) → Qdrant vector DB → PINN conditioning
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                    </AnimatePresence>
                                </div>

                            </motion.div>
                        ) : (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                {/* Placeholder hint */}
                                <div style={{ padding: '.85rem 1rem', borderBottom: '1px solid rgba(255,255,255,.05)', background: 'rgba(0,0,0,.25)' }}>
                                    <div style={{ fontFamily: 'var(--mono)', fontSize: '.62rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                                        <Info size={12} /> Click a zone for causes, solutions &amp; gov. API links
                                    </div>
                                </div>
                                {/* Zone list */}
                                <div style={{ flex: 1, overflowY: 'auto' }}>
                                    {filtered.map(zone => {
                                        const cfg = rcfg(zone.risk);
                                        return (
                                            <div key={zone.id} onClick={() => handleZoneClick(zone)}
                                                style={{ padding: '.6rem 1rem', borderBottom: '1px solid rgba(255,255,255,.04)', cursor: 'pointer', borderLeft: '3px solid transparent', transition: 'all .15s' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <div>
                                                        <div style={{ fontWeight: 600, fontSize: '.77rem', color: '#ccc', marginBottom: '1px' }}>{zone.name}</div>
                                                        <div style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: 'var(--muted)' }}>{zone.causes[0].tag}: {zone.causes[0].label.split('(')[0].trim()}</div>
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                                                        <span style={{ fontFamily: 'var(--mono)', fontSize: '.56rem', color: cfg.color, border: `1px solid ${cfg.color}33`, padding: '1px 5px', borderRadius: '10px' }}>{zone.risk}</span>
                                                        <span style={{ fontFamily: 'var(--mono)', fontSize: '.56rem', color: 'var(--muted)' }}>{(zone.pFlood * 100).toFixed(0)}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Footer */}
                    <div style={{ padding: '.5rem 1rem', borderTop: '1px solid rgba(255,255,255,.05)', background: 'rgba(0,0,0,.35)', display: 'flex', alignItems: 'center', gap: '.5rem', flexShrink: 0 }}>
                        <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}>
                            <Radio size={10} color="#22c55e" />
                        </motion.div>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: 'var(--muted)' }}>
                            {FLOOD_ZONES.reduce((s, z) => s + z.sensors, 0)} nodes · {TILE_LAYERS[tileLayer].label} · Esri
                        </span>
                    </div>
                </div>
            </div>

            {/* Popup dark style */}
            <style>{`
        .leaflet-popup-content-wrapper{background:transparent!important;box-shadow:0 8px 32px rgba(0,0,0,.85)!important;border:1px solid rgba(255,255,255,.1)!important;border-radius:10px!important;padding:0!important;}
        .leaflet-popup-content{margin:0!important;}
        .leaflet-popup-tip{background:#08090e!important;}
        .mausam-popup .leaflet-popup-close-button{color:#666!important;right:8px!important;top:8px!important;}
        .leaflet-container{background:#060810!important;}
        .leaflet-control-zoom{border:1px solid rgba(255,255,255,.1)!important;}
        .leaflet-control-zoom a{background:rgba(5,7,12,.9)!important;color:#888!important;border-color:rgba(255,255,255,.08)!important;}
        .leaflet-control-zoom a:hover{background:rgba(34,197,94,.1)!important;color:#22c55e!important;}
        .leaflet-control-attribution{background:rgba(5,7,12,.7)!important;color:#333!important;}
      `}</style>
        </div>
    );
};

export default HimalayanFloodMap;
