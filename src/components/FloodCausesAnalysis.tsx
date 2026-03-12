import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Zap, Droplets, Mountain, Wind, TreePine, AlertTriangle, Brain, Shield, Database, Radio } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Cause {
    id: string;
    label: string;
    icon: React.ReactNode;
    color: string;
    frequency: number; // % of events
    severity: 'EXTREME' | 'CRITICAL' | 'HIGH' | 'MODERATE';
    mechanism: string;
    aiDetection: string;
    zones: string[];
    govSources: { name: string; url: string }[];
}

interface Solution {
    id: string;
    title: string;
    type: 'TECHNOLOGY' | 'POLICY' | 'NATURE' | 'COMMUNITY';
    color: string;
    desc: string;
    implementation: string[];
    refs: { name: string; url: string }[];
    status: 'OPERATIONAL' | 'PILOT' | 'PROPOSED';
    coverage: string;
}

// ─── Causes data ─────────────────────────────────────────────────────────────
const CAUSES: Cause[] = [
    {
        id: 'glof',
        label: 'Glacial Lake Outburst Flood (GLOF)',
        icon: <Mountain size={14} />,
        color: '#60a5fa',
        frequency: 34,
        severity: 'EXTREME',
        mechanism: 'Rapid thermal or seismic destabilisation of moraine/ice dams holding proglacial lakes. A single lake breach can release 50–200 million m³ of water in minutes, generating floods 10–20× larger than the largest monsoon peak discharge.',
        aiDetection: 'Mausam-IR monitors lake surface area via ISRO RISAT-1B SAR imagery (6m resolution). A >2% area decrease triggers a pre-GLOF alert at T−72h. PINN physics loss ensures the velocity field respects Navier-Stokes under rapid pressure release.',
        zones: ['Kedarnath', 'Chamoli', 'Teesta Basin', 'Lahaul Spiti'],
        govSources: [
            { name: 'ISRO GLOF Monitor (Bhuvan)', url: 'https://bhuvan.nrsc.gov.in' },
            { name: 'CWC Glacier Lake Inventory', url: 'https://cwc.gov.in' },
            { name: 'NDMA Glacier Risk Atlas', url: 'https://ndma.gov.in' },
        ],
    },
    {
        id: 'cloudburst',
        label: 'Cloudburst (>100 mm/hr)',
        icon: <Droplets size={14} />,
        color: '#22c55e',
        frequency: 41,
        severity: 'CRITICAL',
        mechanism: 'Orographic lifting of moisture-laden Arabian Sea air masses over steep Himalayan terrain creates convective cells that dump >100mm of rainfall in under 1 hour over a 5–10 km² area — overwhelming any natural drainage capacity.',
        aiDetection: 'ISRO INSAT-3DR cloud-top brightness temperature <−65°C + Doppler radar echo >55 dBZ triggers a cloudburst probability model. RAG pipeline retrieves analogous historical cells from Qdrant using spatial-temporal cosine similarity.',
        zones: ['Uttarkashi', 'Beas River', 'Tons Valley', 'Pindar Valley', 'Kosi Basin'],
        govSources: [
            { name: 'IMD Cloudburst Nowcast', url: 'https://mausam.imd.gov.in' },
            { name: 'MOSDAC INSAT-3DR Viewer', url: 'https://mosdac.gov.in' },
            { name: 'SACAD Doppler Portal', url: 'https://dwr.imd.gov.in' },
        ],
    },
    {
        id: 'landslide',
        label: 'Landslide Dam Outburst',
        icon: <Mountain size={14} />,
        color: '#f97316',
        frequency: 15,
        severity: 'CRITICAL',
        mechanism: 'Heavy rainfall on steep colluvial slopes saturates regolith, causing mass movement that blocks river channels. The temporary reservoir behind the debris dam can impound water for hours to weeks before catastrophic breach, releasing a dam-break wave.',
        aiDetection: 'Multi-temporal Sentinel-1 SAR coherence change detection identifies active slope failures. CWC stage gauge anomalies (rapid river level drop) signal a blocking event. Breach timing predicted using empirical dam-break regression + PINN simulation.',
        zones: ['Alaknanda Valley', 'Sutlej (Kinnaur)', 'Subansiri Basin'],
        govSources: [
            { name: 'NIDM Landslide Atlas', url: 'https://nidm.gov.in' },
            { name: 'GSI Landslide Zonation', url: 'https://www.gsi.gov.in' },
            { name: 'CBRI Slope Stability', url: 'https://cbri.res.in' },
        ],
    },
    {
        id: 'snowmelt',
        label: 'Rapid Snowmelt / Rain-on-Snow',
        icon: <Wind size={14} />,
        color: '#a78bfa',
        frequency: 18,
        severity: 'HIGH',
        mechanism: 'Post-winter warm spells compound with rainfall to rapidly melt snowpack across river basins, generating runoff surges that exceed bankfull capacity. Rain-on-snow events produce higher peak flows than either process alone.',
        aiDetection: 'NASA MODIS/VIIRS daily snow cover + ERA5 reanalysis temperature anomalies feed a snowmelt routing model. Mausam-IR detects SWE (Snow Water Equivalent) drawdown rates and flags rapid melt corridors using the Navier-Stokes diffusion term.',
        zones: ['Jhelum Basin', 'Beas River', 'Sutlej Basin', 'Teesta Basin'],
        govSources: [
            { name: 'CWC Snow Hydrology Division', url: 'https://cwc.gov.in' },
            { name: 'SASE Manali (Snow Science)', url: 'https://sase.gov.in' },
            { name: 'NASA MODIS SnowPack', url: 'https://modis.gsfc.nasa.gov' },
        ],
    },
    {
        id: 'deforestation',
        label: 'Deforestation & Land Degradation',
        icon: <TreePine size={14} />,
        color: '#84cc16',
        frequency: 22,
        severity: 'HIGH',
        mechanism: 'Forest cover loss eliminates the hydrological "sponge" effect — infiltration rates drop by 60–80%, surface runoff velocity doubles. Combined with road construction exposing bare slopes, the lag time between rainfall peak and flood peak decreases by 3–4 hours.',
        aiDetection: 'Hansen Global Forest Change + ISRO LISS-IV imagery quantify deforestation rates per watershed. The RAG pipeline weights historical events by deforestation exposure to adjust flood frequency-magnitude curves in the PINN training loss.',
        zones: ['Brahmaputra Basin', 'Kosi Basin', 'Arunachal zones', 'Tons Valley'],
        govSources: [
            { name: 'FSI State Forest Report', url: 'https://fsi.nic.in' },
            { name: 'MoEFCC Forest Survey', url: 'https://moef.gov.in' },
            { name: 'NASA GEDI LiDAR Forest', url: 'https://gedi.umd.edu' },
        ],
    },
    {
        id: 'infrastructure',
        label: 'Hydropower & Infrastructure Failure',
        icon: <Zap size={14} />,
        color: '#fb923c',
        frequency: 12,
        severity: 'CRITICAL',
        mechanism: 'Uncoordinated emergency releases from upstream hydropower dams during monsoon can create artificial flash floods downstream. Sedimentation reduces reservoir capacity, and rapid gate opening during heavy inflow can double natural peak discharge.',
        aiDetection: 'SCADA telemetry from CWC-monitored dams streams into Mausam-IR. Unusual discharge rate changes (>500 m³/s·hr) trigger downstream alert propagation using the multi-agent swarm to notify each LoRaWAN node cluster in sequence.',
        zones: ['Alaknanda Valley', 'Subansiri Basin', 'Sutlej Basin', 'Beas River'],
        govSources: [
            { name: 'CWC HYCOS Flood Forecast', url: 'https://riverdata.india-water.gov.in' },
            { name: 'CEA Hydro Project Portal', url: 'https://cea.nic.in' },
            { name: 'NHPC Operations Bulletin', url: 'https://nhpcindia.com' },
        ],
    },
    {
        id: 'climate',
        label: 'Climate Change Amplification',
        icon: <AlertTriangle size={14} />,
        color: '#ef4444',
        frequency: 38,
        severity: 'EXTREME',
        mechanism: 'Indian Himalayan glaciers are retreating at 0.6m/year water equivalent. Rising temperatures intensify the monsoon water cycle (+7% precipitation per °C), increase the frequency of extreme rainfall events, and expand the size and number of glacial lakes simultaneously.',
        aiDetection: 'CMIP6 climate model ensemble outputs feed Mausam-IR\'s RAG conditioning. Long-term ERA5 temperature trends adjust the physics loss λ coefficient dynamically — the PINN is tuned to increasingly non-stationary extremes.',
        zones: ['All 14 zones — systemic amplifier'],
        govSources: [
            { name: 'IMD Climate Change Outlook', url: 'https://mausam.imd.gov.in' },
            { name: 'MoES Climate Science Division', url: 'https://moes.gov.in' },
            { name: 'NATCOM India GHG Report', url: 'https://moef.gov.in' },
        ],
    },
];

// ─── Solutions data ───────────────────────────────────────────────────────────
const SOLUTIONS: Solution[] = [
    {
        id: 'ews',
        title: 'AI-Powered Early Warning System (Mausam-IR)',
        type: 'TECHNOLOGY',
        color: '#22c55e',
        desc: 'Deploy the full Mausam-IR pipeline: satellite → RAG → PINN → MLIR → ESP32 LoRaWAN node network providing 6-hour advance warning to village-level communities at $2.40/node.',
        implementation: [
            'Phase 1: 50-node LoRaWAN sensor mesh across Kedarnath & Chamoli valleys',
            'Phase 2: ISRO INSAT-3DR real-time ingestion (15-min refresh)',
            'Phase 3: PINN ensemble for uncertainty quantification',
            'Phase 4: SMS/siren auto-trigger at P(flood)>0.75 threshold',
        ],
        refs: [
            { name: 'NDRF EWS Framework', url: 'https://ndrf.gov.in' },
            { name: 'ITU DRR Guidelines', url: 'https://itu.int' },
        ],
        status: 'PILOT',
        coverage: 'Kedarnath + Chamoli (2 districts)',
    },
    {
        id: 'lake_drain',
        title: 'GLOF Mitigation — Controlled Lake Drainage',
        type: 'TECHNOLOGY',
        color: '#60a5fa',
        desc: 'Mechanically drain high-risk glacial lakes via siphons or pumped outlets to maintain a minimum freeboard buffer. ISRO monitors 676 potentially dangerous glacial lakes in the Indian Himalayas.',
        implementation: [
            'ISRO/GSI identify top-50 GLOF threat lakes via Sentinel-2 SAR',
            'Install self-regulating siphon systems at each lake outlet',
            'Integrate lake level telemetry into Mausam-IR RAG vector DB',
            'Annual mechanical inspection with rotary-wing UAVs',
        ],
        refs: [
            { name: 'GSI GLOF Study', url: 'https://www.gsi.gov.in' },
            { name: 'NDMA GLOF Guidelines 2020', url: 'https://ndma.gov.in' },
        ],
        status: 'OPERATIONAL',
        coverage: 'Uttarakhand, Sikkim (18 lakes)',
    },
    {
        id: 'afforestation',
        title: 'Watershed Afforestation & Slope Stabilisation',
        type: 'NATURE',
        color: '#84cc16',
        desc: 'Restore native forest cover in critical watersheds to increase infiltration rates, reduce surface runoff, and improve slope stability. Target: 25% increase in vegetation cover within 10 years across all NDMA-identified flood-prone catchments.',
        implementation: [
            'Priority native species: Banj Oak, Buransh, Himalayan Alder',
            'Check dam construction to reduce gully erosion and trap sediment',
            'Geo-textile slope protection on road cuts above flood-prone villages',
            'PayTM-style community carbon credit for afforestation motivation',
        ],
        refs: [
            { name: 'MoEFCC Green India Mission', url: 'https://greenmission.nic.in' },
            { name: 'CAMPA Afforestation Portal', url: 'https://campa.nic.in' },
        ],
        status: 'OPERATIONAL',
        coverage: '12 Himalayan districts',
    },
    {
        id: 'forecast_integration',
        title: 'Government Forecast API Integration',
        type: 'TECHNOLOGY',
        color: '#f97316',
        desc: 'Directly ingest IMD NWP outputs, CWC river stage forecasts, and ISRO satellite data into the Mausam-IR RAG pipeline for operationally consistent, multi-source ensemble forecasting.',
        implementation: [
            'IMD API: WRF-GFS 3km mesoscale rainfall forecast (24h, 48h, 72h)',
            'CWC API: Real-time stage/discharge from 878 gauging stations',
            'MOSDAC API: INSAT-3DR cloud-top temperature every 15 minutes',
            'NASA FIRMS API: Active fire alerts (deforestation early proxy)',
        ],
        refs: [
            { name: 'IMD Open Data Portal', url: 'https://mausam.imd.gov.in' },
            { name: 'CWC Flood Forecast Portal', url: 'https://rwportal.india-water.gov.in' },
            { name: 'MOSDAC Data Services', url: 'https://mosdac.gov.in' },
            { name: 'NASA FIRMS (Fire Info)', url: 'https://firms.modaps.eosdis.nasa.gov' },
        ],
        status: 'PILOT',
        coverage: 'National (5 data streams)',
    },
    {
        id: 'community_drr',
        title: 'Community-Based Disaster Risk Reduction',
        type: 'COMMUNITY',
        color: '#a855f7',
        desc: 'Train village-level disaster management committees to interpret Mausam-IR alerts and execute pre-defined evacuation protocols. Co-design with local knowledge holders to integrate traditional early warning indicators.',
        implementation: [
            'VillageAlert App: Mausam-IR alert push notification in Garhwali/Kumaoni/Hindi',
            'Quarterly mock evacuation drills with SDRF & NDRF',
            'School curriculum integration for sustained community awareness',
            'Panchayat-level CERT (Community Emergency Response Team) training',
        ],
        refs: [
            { name: 'NDMA DRR Policy 2019', url: 'https://ndma.gov.in' },
            { name: 'SDMA Uttarakhand', url: 'https://sdma.uk.gov.in' },
        ],
        status: 'PROPOSED',
        coverage: 'Pilot in 5 Kedarnath villages',
    },
    {
        id: 'land_use',
        title: 'Land Use Regulation & Floodplain Zoning',
        type: 'POLICY',
        color: '#fb923c',
        desc: 'Enforce science-based floodplain setback regulations using the 100-year flood inundation maps generated by Mausam-IR PINN simulations. Relocate high-risk settlements with GoI compensation packages.',
        implementation: [
            'Mausam-IR generates official 50/100/500-year flood inundation maps',
            'Integrate into RERA development approval process',
            'NGT order enforcement for construction in protected riverbeds',
            'Satellite-monitored encroachment detection (ISRO LISS-3, 3-monthly)',
        ],
        refs: [
            { name: 'MoHUA Model Building Bylaws', url: 'https://mohua.gov.in' },
            { name: 'NGT Floodplain Orders', url: 'https://greentribunal.gov.in' },
        ],
        status: 'PROPOSED',
        coverage: '14 high-risk zones',
    },
];

// ─── Gov Data Sources ─────────────────────────────────────────────────────────
const GOV_PORTALS = [
    { name: 'IMD Weather Portal', url: 'https://mausam.imd.gov.in', desc: 'NWP rainfall forecasts, cyclone tracks, thunder-storm warnings', color: '#3b82f6', tag: 'LIVE' },
    { name: 'MOSDAC (ISRO)', url: 'https://mosdac.gov.in', desc: 'INSAT-3DR cloud-top temperatures, OLR, SST, rainfall estimation', color: '#22c55e', tag: 'LIVE' },
    { name: 'CWC Flood Forecast', url: 'https://rwportal.india-water.gov.in', desc: '878 hydro stations, river stage forecasts, dam reservoir levels', color: '#f97316', tag: 'LIVE' },
    { name: 'ISRO Bhuvan', url: 'https://bhuvan.nrsc.gov.in', desc: 'Flood inundation maps, LISS-3 disaster monitoring, landslide zones', color: '#a855f7', tag: 'LIVE' },
    { name: 'NDMA Alert Portal', url: 'https://ndma.gov.in', desc: 'National disaster alerts, flash flood advisories, evacuation notices', color: '#ef4444', tag: 'LIVE' },
    { name: 'NASA FIRMS', url: 'https://firms.modaps.eosdis.nasa.gov', desc: 'Real-time fire maps, deforestation proxy alerts for Himalayan watersheds', color: '#fb923c', tag: 'LIVE' },
    { name: 'ECMWF ERA5', url: 'https://cds.climate.copernicus.eu', desc: 'Hourly atmospheric reanalysis — ground truth for PINN training data', color: '#6366f1', tag: 'API' },
    { name: 'OpenWeather API', url: 'https://openweathermap.org/api', desc: 'Hyperlocal weather forecasting, free tier for prototype integration', color: '#0ea5e9', tag: 'API' },
];

// ─── Component ────────────────────────────────────────────────────────────────
const FloodCausesAnalysis: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'causes' | 'solutions' | 'sources'>('causes');
    const [selectedCause, setSelectedCause] = useState<Cause | null>(CAUSES[0]);
    const [selectedSolution, setSelectedSolution] = useState<Solution | null>(SOLUTIONS[0]);

    const severityColor = (s: string) => ({ EXTREME: '#ef4444', CRITICAL: '#f97316', HIGH: '#eab308', MODERATE: '#3b82f6' }[s] || '#888');
    const typeColor = (t: string) => ({ TECHNOLOGY: '#22c55e', POLICY: '#f97316', NATURE: '#84cc16', COMMUNITY: '#a855f7' }[t] || '#888');
    const statusColor = (s: string) => ({ OPERATIONAL: '#22c55e', PILOT: '#eab308', PROPOSED: '#64748b' }[s] || '#888');

    return (
        <div style={{ background: 'rgba(5,7,12,.96)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '16px', overflow: 'hidden' }}>

            {/* Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,.07)', background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                    <Brain size={16} color="#a855f7" />
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '.78rem', color: '#a855f7', fontWeight: 700 }}>GENAI CAUSAL ANALYSIS ENGINE</span>
                    <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}
                        style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }} />
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '.62rem', color: 'var(--muted)' }}>
                    Sources: IMD · MOSDAC · CWC · ISRO · NDMA · NASA · ECMWF
                </div>
            </div>

            {/* Tab bar */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                {([
                    { id: 'causes', label: '⚠ Key Causes', count: CAUSES.length },
                    { id: 'solutions', label: '🛡 AI Solutions', count: SOLUTIONS.length },
                    { id: 'sources', label: '🌐 Gov. Data Portals', count: GOV_PORTALS.length },
                ] as { id: 'causes' | 'solutions' | 'sources'; label: string; count: number }[]).map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        style={{
                            flex: 1, padding: '.85rem 1rem', background: activeTab === tab.id ? 'rgba(168,85,247,.08)' : 'transparent',
                            borderBottom: `2px solid ${activeTab === tab.id ? '#a855f7' : 'transparent'}`, border: 'none',
                            fontFamily: 'var(--mono)', fontSize: '.72rem', color: activeTab === tab.id ? '#a855f7' : 'var(--muted)', cursor: 'pointer', transition: 'all .2s'
                        }}>
                        {tab.label} <span style={{ opacity: .5 }}>({tab.count})</span>
                    </button>
                ))}
            </div>

            {/* Content area */}
            <AnimatePresence mode="wait">

                {/* ─── CAUSES TAB ────────────────────────────────────────────────── */}
                {activeTab === 'causes' && (
                    <motion.div key="causes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '520px' }}>

                        {/* Cause list */}
                        <div style={{ borderRight: '1px solid rgba(255,255,255,.06)', overflowY: 'auto' }}>
                            {/* Causes breakdown stats */}
                            <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,.05)', background: 'rgba(0,0,0,.2)' }}>
                                <div style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: 'var(--muted)', marginBottom: '.6rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Cause Distribution</div>
                                {CAUSES.slice(0, 4).map(c => (
                                    <div key={c.id} style={{ marginBottom: '.45rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                            <span style={{ fontFamily: 'var(--mono)', fontSize: '.58rem', color: '#aaa' }}>{c.label.split(' ')[0]}</span>
                                            <span style={{ fontFamily: 'var(--mono)', fontSize: '.58rem', color: c.color }}>{c.frequency}%</span>
                                        </div>
                                        <div style={{ height: '3px', background: 'rgba(255,255,255,.06)', borderRadius: '2px' }}>
                                            <div style={{ height: '100%', width: `${c.frequency}%`, background: c.color, borderRadius: '2px' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Cause items */}
                            {CAUSES.map(cause => (
                                <div key={cause.id} onClick={() => setSelectedCause(cause)}
                                    style={{
                                        padding: '.7rem 1rem', borderBottom: '1px solid rgba(255,255,255,.04)', cursor: 'pointer',
                                        background: selectedCause?.id === cause.id ? `${cause.color}0d` : 'transparent',
                                        borderLeft: `3px solid ${selectedCause?.id === cause.id ? cause.color : 'transparent'}`, transition: 'all .15s'
                                    }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', color: cause.color }}>
                                            {cause.icon}
                                            <span style={{ fontFamily: 'var(--mono)', fontSize: '.68rem', color: selectedCause?.id === cause.id ? '#fff' : '#ccc', fontWeight: 600 }}>
                                                {cause.label.split('(')[0].trim()}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '.4rem', alignItems: 'center' }}>
                                        <span style={{ fontFamily: 'var(--mono)', fontSize: '.57rem', color: severityColor(cause.severity), border: `1px solid ${severityColor(cause.severity)}33`, padding: '1px 5px', borderRadius: '8px' }}>{cause.severity}</span>
                                        <span style={{ fontFamily: 'var(--mono)', fontSize: '.57rem', color: 'var(--muted)' }}>{cause.frequency}% of events</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Cause detail */}
                        <AnimatePresence mode="wait">
                            {selectedCause && (
                                <motion.div key={selectedCause.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                    style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '.4rem' }}>
                                            <div style={{ color: selectedCause.color }}>{selectedCause.icon}</div>
                                            <div style={{ fontFamily: 'var(--mono)', fontSize: '.62rem', color: severityColor(selectedCause.severity), textTransform: 'uppercase' }}>
                                                {selectedCause.severity} RISK &nbsp;·&nbsp; {selectedCause.frequency}% of Himalayan flash flood events
                                            </div>
                                        </div>
                                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '.5rem' }}>{selectedCause.label}</h3>
                                        <p style={{ fontFamily: 'var(--sans)', fontSize: '.82rem', color: '#94a3b8', lineHeight: 1.7 }}>{selectedCause.mechanism}</p>
                                    </div>

                                    <div style={{ background: `${selectedCause.color}0a`, border: `1px solid ${selectedCause.color}28`, borderRadius: '10px', padding: '1rem 1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.6rem' }}>
                                            <Brain size={12} color={selectedCause.color} />
                                            <span style={{ fontFamily: 'var(--mono)', fontSize: '.62rem', color: selectedCause.color, textTransform: 'uppercase', letterSpacing: '1px' }}>Mausam-IR AI Detection Strategy</span>
                                        </div>
                                        <p style={{ fontFamily: 'var(--mono)', fontSize: '.72rem', color: '#cbd5e1', lineHeight: 1.7 }}>{selectedCause.aiDetection}</p>
                                    </div>

                                    <div>
                                        <div style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '.6rem' }}>Affected Zones</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
                                            {selectedCause.zones.map(z => (
                                                <span key={z} style={{ fontFamily: 'var(--mono)', fontSize: '.65rem', color: selectedCause.color, background: `${selectedCause.color}12`, border: `1px solid ${selectedCause.color}30`, padding: '.2rem .6rem', borderRadius: '20px' }}>{z}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '.6rem' }}>
                                            <Database size={10} style={{ display: 'inline', marginRight: '.3rem' }} />Government Data Sources
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                                            {selectedCause.govSources.map(s => (
                                                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.5rem .75rem',
                                                        background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '8px',
                                                        textDecoration: 'none', transition: 'all .2s'
                                                    }}>
                                                    <ExternalLink size={11} color="var(--muted)" />
                                                    <span style={{ fontFamily: 'var(--mono)', fontSize: '.68rem', color: '#cbd5e1' }}>{s.name}</span>
                                                    <span style={{ fontFamily: 'var(--mono)', fontSize: '.58rem', color: 'var(--muted)', marginLeft: 'auto' }}>{s.url.replace('https://', '')}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>

                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* ─── SOLUTIONS TAB ─────────────────────────────────────────────── */}
                {activeTab === 'solutions' && (
                    <motion.div key="solutions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '520px' }}>

                        <div style={{ borderRight: '1px solid rgba(255,255,255,.06)', overflowY: 'auto' }}>
                            {/* Solution type legend */}
                            <div style={{ padding: '.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,.05)', background: 'rgba(0,0,0,.2)', display: 'flex', flexWrap: 'wrap', gap: '.35rem' }}>
                                {['TECHNOLOGY', 'NATURE', 'COMMUNITY', 'POLICY'].map(t => (
                                    <span key={t} style={{ fontFamily: 'var(--mono)', fontSize: '.55rem', color: typeColor(t), border: `1px solid ${typeColor(t)}33`, padding: '1px 6px', borderRadius: '10px' }}>{t}</span>
                                ))}
                            </div>
                            {SOLUTIONS.map(sol => (
                                <div key={sol.id} onClick={() => setSelectedSolution(sol)}
                                    style={{
                                        padding: '.7rem 1rem', borderBottom: '1px solid rgba(255,255,255,.04)', cursor: 'pointer',
                                        background: selectedSolution?.id === sol.id ? `${sol.color}0d` : 'transparent',
                                        borderLeft: `3px solid ${selectedSolution?.id === sol.id ? sol.color : 'transparent'}`, transition: 'all .15s'
                                    }}>
                                    <div style={{ fontFamily: 'var(--mono)', fontSize: '.68rem', color: selectedSolution?.id === sol.id ? '#fff' : '#ccc', fontWeight: 600, marginBottom: '4px', lineHeight: 1.3 }}>{sol.title.split('—')[0].trim()}</div>
                                    <div style={{ display: 'flex', gap: '.35rem', flexWrap: 'wrap' }}>
                                        <span style={{ fontFamily: 'var(--mono)', fontSize: '.55rem', color: typeColor(sol.type), border: `1px solid ${typeColor(sol.type)}33`, padding: '1px 5px', borderRadius: '8px' }}>{sol.type}</span>
                                        <span style={{ fontFamily: 'var(--mono)', fontSize: '.55rem', color: statusColor(sol.status), border: `1px solid ${statusColor(sol.status)}33`, padding: '1px 5px', borderRadius: '8px' }}>{sol.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {selectedSolution && (
                                <motion.div key={selectedSolution.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                    style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div>
                                        <div style={{ display: 'flex', gap: '.5rem', marginBottom: '.6rem', flexWrap: 'wrap' }}>
                                            <span style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: typeColor(selectedSolution.type), background: `${typeColor(selectedSolution.type)}15`, border: `1px solid ${typeColor(selectedSolution.type)}35`, padding: '.2rem .6rem', borderRadius: '20px' }}>{selectedSolution.type}</span>
                                            <span style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: statusColor(selectedSolution.status), background: `${statusColor(selectedSolution.status)}15`, border: `1px solid ${statusColor(selectedSolution.status)}35`, padding: '.2rem .6rem', borderRadius: '20px' }}>{selectedSolution.status}</span>
                                            <span style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: 'var(--muted)', padding: '.2rem .6rem' }}>Coverage: {selectedSolution.coverage}</span>
                                        </div>
                                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '.5rem', lineHeight: 1.3 }}>{selectedSolution.title}</h3>
                                        <p style={{ fontFamily: 'var(--sans)', fontSize: '.82rem', color: '#94a3b8', lineHeight: 1.7 }}>{selectedSolution.desc}</p>
                                    </div>

                                    <div style={{ background: `${selectedSolution.color}0a`, border: `1px solid ${selectedSolution.color}28`, borderRadius: '10px', padding: '1rem 1.25rem' }}>
                                        <div style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: selectedSolution.color, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '.7rem' }}>
                                            <Shield size={11} style={{ display: 'inline', marginRight: '.4rem' }} />Implementation Roadmap
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                                            {selectedSolution.implementation.map((step, i) => (
                                                <div key={i} style={{ display: 'flex', gap: '.75rem', alignItems: 'flex-start' }}>
                                                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: `${selectedSolution.color}22`, border: `1px solid ${selectedSolution.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                                                        <span style={{ fontFamily: 'var(--mono)', fontSize: '.55rem', color: selectedSolution.color }}>{i + 1}</span>
                                                    </div>
                                                    <span style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', color: '#cbd5e1', lineHeight: 1.5 }}>{step}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '.6rem' }}>
                                            <ExternalLink size={10} style={{ display: 'inline', marginRight: '.3rem' }} />Policy References
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
                                            {selectedSolution.refs.map(r => (
                                                <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.45rem .75rem',
                                                        background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '7px', textDecoration: 'none'
                                                    }}>
                                                    <ExternalLink size={10} color={selectedSolution.color} />
                                                    <span style={{ fontFamily: 'var(--mono)', fontSize: '.67rem', color: '#cbd5e1' }}>{r.name}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* ─── GOV SOURCES TAB ───────────────────────────────────────────── */}
                {activeTab === 'sources' && (
                    <motion.div key="sources" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                            {GOV_PORTALS.map(portal => (
                                <a key={portal.name} href={portal.url} target="_blank" rel="noopener noreferrer"
                                    style={{ display: 'block', background: 'rgba(255,255,255,.02)', border: `1px solid ${portal.color}22`, borderRadius: '10px', padding: '1rem 1.25rem', textDecoration: 'none', transition: 'all .2s' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                                            <Radio size={12} color={portal.color} />
                                            <span style={{ fontFamily: 'var(--mono)', fontSize: '.72rem', color: '#fff', fontWeight: 700 }}>{portal.name}</span>
                                        </div>
                                        <span style={{ fontFamily: 'var(--mono)', fontSize: '.58rem', color: portal.color, border: `1px solid ${portal.color}40`, padding: '1px 6px', borderRadius: '10px', flexShrink: 0 }}>{portal.tag}</span>
                                    </div>
                                    <p style={{ fontFamily: 'var(--mono)', fontSize: '.65rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '.5rem' }}>{portal.desc}</p>
                                    <div style={{ fontFamily: 'var(--mono)', fontSize: '.58rem', color: portal.color, display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                                        <ExternalLink size={9} />
                                        {portal.url.replace('https://', '')}
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Mausam-IR integration note */}
                        <div style={{ marginTop: '1.5rem', background: 'rgba(168,85,247,.06)', border: '1px solid rgba(168,85,247,.2)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.5rem' }}>
                                <Brain size={13} color="#a855f7" />
                                <span style={{ fontFamily: 'var(--mono)', fontSize: '.68rem', color: '#a855f7', fontWeight: 700, textTransform: 'uppercase' }}>How Mausam-IR Ingests These Sources</span>
                            </div>
                            <p style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', color: '#94a3b8', lineHeight: 1.7 }}>
                                All government APIs are chunked spatially (5km² grid) and temporally (6hr windows) and embedded into
                                768-dimensional vectors by the RAG pipeline. The PINN is conditioned on retrieved historical
                                analog events. The multi-agent swarm validates prediction quality against IMD/CWC ground truth
                                using BLEU/ROUGE metrics, and the compiled GGUF model is flashed OTA to the ESP32-S3 edge node
                                which then broadcasts LoRa alerts autonomously.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FloodCausesAnalysis;
