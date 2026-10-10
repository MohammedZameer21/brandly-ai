import { useEffect, useMemo, useState } from 'react';
import { ArrowDownWideNarrow, ArrowRight, Bookmark, BriefcaseBusiness, Check, ChevronDown, CircleHelp, ExternalLink, Filter, Heart, Instagram, Linkedin, Mail, Plus, Search, Share2, Sparkles, Trash2, Users, Video, X, Youtube } from 'lucide-react';
import type { Pillar, Post, Profile } from './App';
import { currency, demoInfluencers, formatFollowers, isCampaign, isSharedPackage, makeId, matchInfluencer, safeArray, type CollaborationDeliverable, type InfluencerCollaborationRequest, type InfluencerPlatform, type InfluencerPreferences, type InfluencerProfile, type SharedCalendarPackage } from './influencerData';
import './influencer.css';

const platformOptions: InfluencerPlatform[] = ['Instagram', 'YouTube', 'LinkedIn', 'TikTok', 'Other'];
const regions = ['Global', 'South Asia', 'North America', 'Europe', 'East Asia'];
const tiers = ['Any', 'Nano', 'Micro', 'Mid-tier', 'Macro'];
const objectives = ['Reach', 'Engagement', 'Leads', 'Brand awareness', 'Conversions'];
const deliverableOptions: CollaborationDeliverable[] = ['Feed post', 'Short video', 'Story', 'Video mention'];
const creatorStorage = 'bp_saved_creators';
const selectedStorage = 'bp_selected_creators';
const campaignStorage = 'bp_collaboration_requests';
const sharedStorage = 'bp_shared_calendar_packages';
const isString = (value: unknown): value is string => typeof value === 'string';

type Props = { profile: Profile; prefs: InfluencerPreferences; setPrefs: (value: InfluencerPreferences) => void; pillars: Pillar[]; posts: Post[] };
type Filters = { platform: string; niche: string; tier: string; region: string; maxBudget: string; minMatch: string; minEngagement: string; maxEngagement: string };
const blankFilters: Filters = { platform: 'All', niche: 'All', tier: 'Any', region: 'All', maxBudget: '', minMatch: '0', minEngagement: '0', maxEngagement: '' };
const emptyCampaign = (prefs: InfluencerPreferences, profile: Profile) => ({ campaignName: '', objective: prefs.objective, promotion: '', audience: prefs.audience || profile.audience, platform: prefs.platform, date: '', budget: prefs.budget ?? 0, deliverables: [] as CollaborationDeliverable[], instructions: '' });

export function InfluencerSettings({ prefs, setPrefs, profile }: Pick<Props, 'prefs' | 'setPrefs' | 'profile'>) {
  const update = (patch: Partial<InfluencerPreferences>) => setPrefs({ ...prefs, ...patch });
  return <section className="influencer-settings card">
    <div className="hub-settings-head"><span className="hub-icon"><Users size={18}/></span><div><h2>Influencer promotion</h2><p>Choose whether BrandPilot includes creator collaborations in your plan.</p></div></div>
    <div className="choice-row" role="group" aria-label="Influencer promotion preference">
      <button type="button" aria-pressed={prefs.enabled} className={`choice-card ${prefs.enabled ? 'active' : ''}`} onClick={() => update({ enabled: true, audience: prefs.audience || profile.audience })}><span className="choice-check">{prefs.enabled && <Check size={14}/>}</span><span><b>Yes, help me find influencers</b><small>See sample creator matches and plan possible collaborations.</small></span></button>
      <button type="button" aria-pressed={!prefs.enabled} className={`choice-card ${!prefs.enabled ? 'active' : ''}`} onClick={() => update({ enabled: false })}><span className="choice-check">{!prefs.enabled && <Check size={14}/>}</span><span><b>No, I’ll grow organically</b><small>Keep your current content strategy and calendar focused on organic growth.</small></span></button>
    </div>
    {prefs.enabled && <PreferenceFields prefs={prefs} update={update} profile={profile}/>}
    <div className="settings-footnote"><CircleHelp size={14}/> You can change this preference any time. Your existing profile, content, and calendar stay intact.</div>
  </section>;
}

export function InfluencerPreferencesForm({ prefs, setPrefs, profile }: Pick<Props, 'prefs' | 'setPrefs' | 'profile'>) {
  const update = (patch: Partial<InfluencerPreferences>) => setPrefs({ ...prefs, ...patch });
  return <div className="onboarding-promotion">
    <div className="onboarding-promotion-title"><Sparkles size={15}/><span><b>Would you like influencers to promote your content?</b><small>This is optional. You can change it later in Settings.</small></span></div>
    <div className="choice-row compact" role="group" aria-label="Influencer promotion preference">
      <button type="button" aria-pressed={prefs.enabled} className={`choice-card ${prefs.enabled ? 'active' : ''}`} onClick={() => update({ enabled: true, audience: prefs.audience || profile.audience })}><span className="choice-check">{prefs.enabled && <Check size={14}/>}</span><span><b>Yes, find influencers</b><small>Explore creators and collaboration ideas.</small></span></button>
      <button type="button" aria-pressed={!prefs.enabled} className={`choice-card ${!prefs.enabled ? 'active' : ''}`} onClick={() => update({ enabled: false })}><span className="choice-check">{!prefs.enabled && <Check size={14}/>}</span><span><b>No, organic growth</b><small>Use content pillars and your weekly plan.</small></span></button>
    </div>
    {prefs.enabled && <PreferenceFields prefs={prefs} update={update} profile={profile}/>}
  </div>;
}

function PreferenceFields({ prefs, update, profile }: { prefs: InfluencerPreferences; update: (patch: Partial<InfluencerPreferences>) => void; profile: Profile }) {
  return <div className="preference-fields">
    <label>Niche or industry<input value={prefs.niche} onChange={e => update({ niche: e.target.value })} placeholder="e.g. AI education"/></label>
    <label>Target audience<input value={prefs.audience} onChange={e => update({ audience: e.target.value })} placeholder={profile.audience || 'Who should this reach?'}/></label>
    <label>Region<select value={prefs.region} onChange={e => update({ region: e.target.value })}>{regions.map(x => <option key={x}>{x}</option>)}</select></label>
    <label>Preferred platform<select value={prefs.platform} onChange={e => update({ platform: e.target.value as InfluencerPlatform })}>{platformOptions.map(x => <option key={x}>{x}</option>)}</select></label>
    <label>Creator category<select value={prefs.tier} onChange={e => update({ tier: e.target.value as InfluencerPreferences['tier'] })}>{tiers.map(x => <option key={x}>{x}</option>)}</select></label>
    <label>Approx. budget <span className="optional-label">Optional · USD</span><input type="number" min="0" step="50" value={prefs.budget ?? ''} onChange={e => update({ budget: e.target.value === '' ? null : Math.max(0, Number(e.target.value)) })} placeholder="No limit set"/></label>
    <label>Promotion objective<select value={prefs.objective} onChange={e => update({ objective: e.target.value as InfluencerPreferences['objective'] })}>{objectives.map(x => <option key={x}>{x}</option>)}</select></label>
  </div>;
}

export default function InfluencerHub({ profile, prefs, setPrefs, pillars, posts }: Props) {
  const [tab, setTab] = useState<'discover' | 'campaigns' | 'history'>('discover');
  const [savedIds, setSavedIds] = useState<string[]>(() => safeArray(creatorStorage, isString));
  const [selectedIds, setSelectedIds] = useState<string[]>(() => safeArray(selectedStorage, isString));
  const [campaigns, setCampaigns] = useState<InfluencerCollaborationRequest[]>(() => safeArray(campaignStorage, isCampaign));
  const [packages, setPackages] = useState<SharedCalendarPackage[]>(() => safeArray(sharedStorage, isSharedPackage));
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Filters>(blankFilters);
  const [sort, setSort] = useState('match');
  const [showFilters, setShowFilters] = useState(false);
  const [creator, setCreator] = useState<InfluencerProfile | null>(null);
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [campaignStep, setCampaignStep] = useState(0);
  const [campaignDraft, setCampaignDraft] = useState(() => emptyCampaign(prefs, profile));
  const [campaignCreatorIds, setCampaignCreatorIds] = useState<string[]>([]);
  const [expandedPackage, setExpandedPackage] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => { localStorage.setItem(creatorStorage, JSON.stringify(savedIds)); }, [savedIds]);
  useEffect(() => { localStorage.setItem(selectedStorage, JSON.stringify(selectedIds)); }, [selectedIds]);
  useEffect(() => { localStorage.setItem(campaignStorage, JSON.stringify(campaigns)); }, [campaigns]);
  useEffect(() => { localStorage.setItem(sharedStorage, JSON.stringify(packages)); }, [packages]);
  const notify = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 2800); };
  const matches = useMemo(() => demoInfluencers.map(item => ({ creator: item, ...matchInfluencer(item, prefs, profile) })), [prefs, profile]);
  const results = useMemo(() => matches.filter(({ creator: item, score }) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${item.name} ${item.username} ${item.niche} ${item.tags.join(' ')}`.toLowerCase().includes(query);
    return matchesSearch && (filters.platform === 'All' || item.platform === filters.platform) && (filters.niche === 'All' || item.niche === filters.niche) && (filters.tier === 'Any' || item.tier === filters.tier) && (filters.region === 'All' || item.region === filters.region) && (!filters.maxBudget || item.price <= Number(filters.maxBudget)) && score >= Number(filters.minMatch || 0) && item.engagement >= Number(filters.minEngagement || 0) && (!filters.maxEngagement || item.engagement <= Number(filters.maxEngagement));
  }).sort((a, b) => sort === 'price' ? a.creator.price - b.creator.price : sort === 'engagement' ? b.creator.engagement - a.creator.engagement : sort === 'audience' ? b.creator.followers - a.creator.followers : b.score - a.score), [matches, search, filters, sort]);
  const selectedCreators = demoInfluencers.filter(item => selectedIds.includes(item.id));
  const setFilter = (key: keyof Filters, value: string) => setFilters(old => ({ ...old, [key]: value }));
  const toggleId = (ids: string[], setIds: (next: string[]) => void, id: string) => setIds(ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]);
  const launchCampaign = (ids: string[]) => { if (!ids.length) { notify('Select at least one creator first.'); return; } setCampaignCreatorIds(ids); setCampaignDraft(emptyCampaign(prefs, profile)); setCampaignStep(0); setCampaignOpen(true); setCreator(null); };
  const saveCampaign = () => {
    const request: InfluencerCollaborationRequest = { id: makeId('campaign'), creatorIds: campaignCreatorIds, ...campaignDraft, status: 'Request Prepared', createdAt: new Date().toISOString() };
    setCampaigns(old => [request, ...old]);
    setSelectedIds(old => [...new Set([...old, ...campaignCreatorIds])]);
    setCampaignOpen(false); setTab('campaigns'); notify('Demo collaboration request saved. No creator was contacted.');
  };
  const creatorsFor = (ids: string[]) => ids.map(id => demoInfluencers.find(x => x.id === id)).filter((x): x is InfluencerProfile => !!x);
  const downloadBrief = (item: SharedCalendarPackage) => {
    const rows = item.posts.map(p => `<tr><td>${escapeHtml(p.date || p.day)}</td><td>${escapeHtml(p.topic)}</td><td>${escapeHtml(p.hook)}</td><td>${escapeHtml(p.format)}</td><td>${escapeHtml(p.objective)}</td><td>${escapeHtml(p.cta || '')}</td></tr>`).join('');
    const html = `<!doctype html><html><meta charset="utf-8"><title>${escapeHtml(item.campaignName)} · BrandPilot</title><body style="font:15px Arial;color:#24342b;max-width:900px;margin:40px auto;line-height:1.6"><h1>${escapeHtml(item.campaignName)}</h1><p><b>Demo collaboration brief · prepared ${new Date(item.createdAt).toLocaleDateString()}</b></p><p><b>Creators:</b> ${item.creators.map(c => escapeHtml(c.name)).join(', ')}</p><p><b>Objective:</b> ${escapeHtml(item.objective)}</p><h2>Message</h2><p>${escapeHtml(item.message).replace(/\n/g, '<br>')}</p><h2>Proposed calendar</h2><table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%"><thead><tr><th>Date</th><th>Topic</th><th>Opening hook</th><th>Format</th><th>Objective</th><th>CTA</th></tr></thead><tbody>${rows}</tbody></table><p>Proposal only. No contact, booking, payment, or publishing has occurred.</p></body></html>`;
    downloadFile(html, `${slug(item.campaignName)}-collaboration-brief.html`, 'text/html');
  };

  return <div className="influencer-hub">
    <div className="hub-title-row"><div><span className="eyebrow">CREATOR COLLABORATIONS · DEMO MARKETPLACE</span><h1>Find Your Perfect Influencer</h1><p>Explore fictional creators and prepare a collaboration plan that fits your brand.</p></div><span className="demo-pill"><i/> SAMPLE CREATOR DATA</span></div>
    <div className="hub-disclosure"><Sparkles size={16}/><span>All creators, audience figures, engagement rates, and prices are fictional sample data. No creator is verified or confirmed available.</span></div>
    <div className="hub-tabs" role="tablist" aria-label="Influencer Hub sections">
      <button role="tab" aria-selected={tab === 'discover'} className={tab === 'discover' ? 'active' : ''} onClick={() => setTab('discover')}><Search size={14}/> Discover</button>
      <button role="tab" aria-selected={tab === 'campaigns'} className={tab === 'campaigns' ? 'active' : ''} onClick={() => setTab('campaigns')}><BriefcaseBusiness size={14}/> My campaigns <span>{campaigns.length}</span></button>
      <button role="tab" aria-selected={tab === 'history'} className={tab === 'history' ? 'active' : ''} onClick={() => setTab('history')}><Share2 size={14}/> Calendar packages <span>{packages.length}</span></button>
    </div>
    {tab === 'discover' && <>
      {!prefs.enabled ? <div className="card hub-optin"><span className="hub-icon"><Users size={20}/></span><div><h2>Keep building organically—or explore collaborations</h2><p>Influencer recommendations are off. Turn them on in Settings to see sample creators matched to your niche, audience, region, budget, and goals.</p><button className="btn primary" onClick={() => setPrefs({ ...prefs, enabled: true, audience: prefs.audience || profile.audience })}>Enable creator discovery <ArrowRight size={14}/></button></div></div> : <>
        <div className="hub-intro card"><div><b>Built around your direction</b><p>{prefs.niche || profile.skills} · {prefs.audience || profile.audience} · {prefs.region} · {prefs.platform}</p></div><span>{results.length} sample creators</span></div>
        <section className="hub-search-row"><label className="market-search"><Search size={16}/><input aria-label="Search creators" placeholder="Search by creator or niche" value={search} onChange={e => setSearch(e.target.value)}/></label><button className={`btn outline filter-toggle ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}><Filter size={14}/> Filters</button><label className="sort-select"><ArrowDownWideNarrow size={14}/><select aria-label="Sort creators" value={sort} onChange={e => setSort(e.target.value)}><option value="match">Best match</option><option value="price">Lowest estimated price</option><option value="engagement">Highest sample engagement</option><option value="audience">Largest sample audience</option></select></label></section>
        <div className="hub-market-layout">
          {showFilters && <aside className="hub-filters card"><div className="filter-head"><b>Refine creators</b><button className="text-btn" onClick={() => { setFilters(blankFilters); setSearch(''); }}>Clear filters</button></div>
            <label>Platform<select value={filters.platform} onChange={e => setFilter('platform', e.target.value)}><option>All</option>{platformOptions.map(x => <option key={x}>{x}</option>)}</select></label>
            <label>Niche<select value={filters.niche} onChange={e => setFilter('niche', e.target.value)}><option>All</option>{[...new Set(demoInfluencers.map(x => x.niche))].map(x => <option key={x}>{x}</option>)}</select></label>
            <label>Creator tier<select value={filters.tier} onChange={e => setFilter('tier', e.target.value)}>{tiers.map(x => <option key={x}>{x}</option>)}</select></label>
            <label>Audience region<select value={filters.region} onChange={e => setFilter('region', e.target.value)}><option>All</option>{regions.filter(x => x !== 'Global').map(x => <option key={x}>{x}</option>)}</select></label>
            <label>Maximum estimate (USD)<input type="number" min="0" value={filters.maxBudget} onChange={e => setFilter('maxBudget', e.target.value)} placeholder="Any budget"/></label>
            <label>Minimum relevance · {filters.minMatch}<input type="range" min="0" max="100" step="5" value={filters.minMatch} onChange={e => setFilter('minMatch', e.target.value)}/></label>
            <label>Engagement range · sample %<div className="range-pair"><input aria-label="Minimum sample engagement" type="number" min="0" max="20" step="0.1" value={filters.minEngagement} onChange={e => setFilter('minEngagement', e.target.value)}/><input aria-label="Maximum sample engagement" type="number" min="0" max="20" step="0.1" value={filters.maxEngagement} onChange={e => setFilter('maxEngagement', e.target.value)} placeholder="Max"/></div></label>
          </aside>}
          <div className="hub-results">
            <div className="hub-section-heading"><div><h2>{search || filters.platform !== 'All' || filters.niche !== 'All' ? 'Creator matches' : 'Featured creators'}</h2><p>Sorted by a transparent profile-fit estimate.</p></div>{selectedIds.length > 0 && <button className="btn primary" onClick={() => launchCampaign(selectedIds)}>Create collaboration request <ArrowRight size={14}/></button>}</div>
            {selectedCreators.length > 0 && <section className="selected-creators card"><div><b>Selected for a campaign</b><span>{selectedCreators.length} creator{selectedCreators.length === 1 ? '' : 's'} selected</span></div><div className="selected-chip-row">{selectedCreators.map(x => <button key={x.id} className="creator-chip" onClick={() => toggleId(selectedIds, setSelectedIds, x.id)} title="Remove selection">{x.initials} {x.name}<X size={12}/></button>)}</div></section>}
            {results.length ? <div className="creator-grid">{results.map(({ creator: item, score, reason }, index) => <CreatorCard key={item.id} creator={item} score={score} reason={reason} featured={index < 2 && sort === 'match'} saved={savedIds.includes(item.id)} selected={selectedIds.includes(item.id)} onSave={() => toggleId(savedIds, setSavedIds, item.id)} onSelect={() => toggleId(selectedIds, setSelectedIds, item.id)} onOpen={() => setCreator(item)}/>)}</div> : <div className="card hub-empty"><Search size={22}/><b>No creators fit those filters</b><p>Try broadening your search, budget, or match score.</p><button className="btn outline" onClick={() => { setFilters(blankFilters); setSearch(''); }}>Clear filters</button></div>}
          </div>
        </div>
      </>}
    </>}
    {tab === 'campaigns' && <section className="hub-section"><div className="hub-section-heading"><div><h2>My campaigns</h2><p>Locally saved plans. Request Prepared does not mean anyone was contacted.</p></div><button className="btn primary" onClick={() => launchCampaign(selectedIds)}><Plus size={14}/> New request</button></div>
      {campaigns.length ? <div className="campaign-list">{campaigns.map(item => <article className="card campaign-card" key={item.id}><div className="campaign-card-top"><span className="campaign-icon"><BriefcaseBusiness size={17}/></span><span className="status-chip status-draft">{item.status}</span></div><h3>{item.campaignName}</h3><p>{item.objective} · {item.platform} · {new Date(item.createdAt).toLocaleDateString()}</p><div className="campaign-creators">{creatorsFor(item.creatorIds).map(c => <span key={c.id}>{c.initials} {c.name}</span>)}</div><div className="campaign-detail-grid"><span><small>Promotion</small><b>{item.promotion}</b></span><span><small>Proposed budget</small><b>{currency(item.budget)}</b></span><span><small>Proposed date</small><b>{item.date || 'Flexible'}</b></span><span><small>Deliverables</small><b>{item.deliverables.join(', ') || 'To discuss'}</b></span></div><button className="text-btn danger-text" onClick={() => { if (window.confirm('Delete this locally saved demo request?')) setCampaigns(old => old.filter(x => x.id !== item.id)); }}>Delete request <Trash2 size={13}/></button></article>)}</div> : <div className="card hub-empty"><BriefcaseBusiness size={22}/><b>No collaboration requests yet</b><p>Select a creator and prepare a demo request to see it here.</p><button className="btn outline" onClick={() => setTab('discover')}>Find creators <ArrowRight size={14}/></button></div>}
    </section>}
    {tab === 'history' && <section className="hub-section"><div className="hub-section-heading"><div><h2>Shared calendar packages</h2><p>Saved snapshots stay unchanged when your calendar changes.</p></div></div>
      {packages.length ? <div className="package-history">{packages.map(item => <article className="card history-card" key={item.id}><div className="history-row"><div><span className="status-chip status-published">{item.shareMethod}</span><h3>{item.campaignName}</h3><p>Prepared {new Date(item.createdAt).toLocaleString()} · {item.posts.length} post{item.posts.length === 1 ? '' : 's'} · {item.creators.map(c => c.name).join(', ')}</p></div><button className="icon" aria-label="Toggle package details" aria-expanded={expandedPackage === item.id} onClick={() => setExpandedPackage(expandedPackage === item.id ? null : item.id)}><ChevronDown size={17}/></button></div>
        {expandedPackage === item.id && <div className="history-details"><p><b>Objective:</b> {item.objective}</p><blockquote>{item.message}</blockquote><ul>{item.posts.map((p, i) => <li key={`${item.id}-${i}`}><b>{p.date || p.day} · {p.topic}</b><span>{p.hook} · {p.format} · {p.objective}</span></li>)}</ul><div className="history-actions"><button className="btn outline" onClick={() => copyText(item.message + '\n\n' + item.posts.map(p => `${p.date || p.day}: ${p.topic}\n${p.hook}\n${p.format}\n${p.objective}\nCTA: ${p.cta || ''}`).join('\n\n')).then(ok => notify(ok ? 'Package copied.' : 'Could not access the clipboard.'))}>Copy again</button><button className="btn outline" onClick={() => downloadBrief(item)}>Download brief</button><button className="text-btn danger-text" onClick={() => { if (window.confirm('Delete this saved calendar package?')) setPackages(old => old.filter(x => x.id !== item.id)); }}>Delete package <Trash2 size={13}/></button></div></div>}
      </article>)}</div> : <div className="card hub-empty"><Share2 size={22}/><b>No packages prepared</b><p>Share a customized calendar from the Weekly Calendar page to create a saved snapshot.</p></div>}
    </section>}

    {creator && <CreatorDialog creator={creator} score={matchInfluencer(creator, prefs, profile).score} reason={matchInfluencer(creator, prefs, profile).reason} profile={profile} pillars={pillars} saved={savedIds.includes(creator.id)} selected={selectedIds.includes(creator.id)} onClose={() => setCreator(null)} onSave={() => toggleId(savedIds, setSavedIds, creator.id)} onSelect={() => toggleId(selectedIds, setSelectedIds, creator.id)} onCampaign={() => launchCampaign([...new Set([...selectedIds, creator.id])])}/>}
    {campaignOpen && <CampaignDialog step={campaignStep} setStep={setCampaignStep} draft={campaignDraft} setDraft={setCampaignDraft} creatorIds={campaignCreatorIds} creators={creatorsFor(campaignCreatorIds)} onClose={() => setCampaignOpen(false)} onSave={saveCampaign}/>}
    {notice && <div className="toast" role="status"><Check size={15}/>{notice}<button onClick={() => setNotice('')} aria-label="Dismiss notification"><X size={14}/></button></div>}
  </div>;
}

function CreatorCard({ creator, score, reason, featured, saved, selected, onSave, onSelect, onOpen }: { creator: InfluencerProfile; score: number; reason: string; featured: boolean; saved: boolean; selected: boolean; onSave: () => void; onSelect: () => void; onOpen: () => void }) {
  return <article className="creator-card card"><div className="creator-card-head"><div className={`creator-avatar avatar-${creator.platform.toLowerCase()}`}>{creator.initials}</div><div className="creator-ident"><b>{creator.name}</b><span>{creator.username}</span></div><button className={`save-creator ${saved ? 'saved' : ''}`} aria-label={saved ? `Unsave ${creator.name}` : `Save ${creator.name}`} aria-pressed={saved} onClick={onSave}><Bookmark size={15}/></button></div>
    <div className="creator-badges"><span>{platformIcon(creator.platform)} {creator.platform}</span><span>{creator.tier}</span>{featured && <span className="match-featured"><Sparkles size={11}/> Featured match</span>}</div>
    <h3>{creator.niche}</h3><p className="creator-bio">{creator.bio}</p><div className="creator-metrics"><span><b>{formatFollowers(creator.followers)}</b><small>sample followers</small></span><span><b>{creator.engagement.toFixed(1)}%</b><small>sample engagement</small></span><span><b>{currency(creator.price)}+</b><small>estimated package</small></span></div>
    <div className="creator-region"><span>Audience region</span><b>{creator.region}</b></div><div className="relevance-row"><div><span>Brand relevance</span><b>{score}/100</b></div><div className="relevance-track"><span style={{ width: `${score}%` }}/></div><p>{reason}</p></div>
    <div className="creator-card-actions"><button className="text-btn" onClick={onOpen}>View profile <ArrowRight size={13}/></button><button className={`btn ${selected ? 'outline' : 'primary'}`} onClick={onSelect}>{selected ? <><Check size={13}/> Selected</> : 'Select creator'}</button></div>
  </article>;
}

function CreatorDialog({ creator, score, reason, profile, pillars, saved, selected, onClose, onSave, onSelect, onCampaign }: { creator: InfluencerProfile; score: number; reason: string; profile: Profile; pillars: Pillar[]; saved: boolean; selected: boolean; onClose: () => void; onSave: () => void; onSelect: () => void; onCampaign: () => void }) {
  return <div className="hub-modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}><section className="hub-modal creator-modal" role="dialog" aria-modal="true" aria-labelledby="creator-dialog-title"><button className="close" onClick={onClose} aria-label="Close creator profile"><X/></button><div className="profile-modal-heading"><div className={`creator-avatar large avatar-${creator.platform.toLowerCase()}`}>{creator.initials}</div><div><span className="eyebrow">SAMPLE CREATOR PROFILE</span><h2 id="creator-dialog-title">{creator.name}</h2><p>{creator.username} · {creator.platform} · {creator.tier}</p></div></div><div className="hub-disclosure compact-disclosure"><Sparkles size={14}/> Fictional profile and sample metrics. Availability is not confirmed.</div><div className="profile-modal-grid"><div><h3>Creator overview</h3><p>{creator.bio}</p><p><b>Content style:</b> {creator.style}</p><p><b>Niche:</b> {creator.niche}</p><p><b>Tags:</b> {creator.tags.join(' · ')}</p></div><div className="profile-stats"><span><b>{formatFollowers(creator.followers)}</b><small>Sample audience</small></span><span><b>{creator.engagement.toFixed(1)}%</b><small>Sample engagement</small></span><span><b>{creator.region}</b><small>Sample audience region</small></span></div></div><section className="creator-match-box"><div><span>Profile fit estimate</span><b>{score}/100</b></div><p>{reason} This is a transparent demo heuristic, not live audience analytics.</p><p><b>Suggested objective:</b> {profile.goal || 'Brand awareness'} · Suggested theme: {pillars[0]?.name || creator.niche}</p></section><h3>Sample collaboration packages</h3><div className="package-options">{creator.packages.map(item => <article key={item.name}><b>{item.name}</b><strong>{currency(item.price)}</strong><small>{item.deliverables.join(' · ')}</small></article>)}</div><div className="profile-modal-actions"><button className="btn outline" onClick={onSave}>{saved ? <Check size={14}/> : <Bookmark size={14}/>} {saved ? 'Saved creator' : 'Save creator'}</button><button className="btn outline" onClick={onSelect}>{selected ? <Check size={14}/> : <Plus size={14}/>} {selected ? 'Selected for campaign' : 'Select for campaign'}</button><button className="btn primary" onClick={onCampaign}>Prepare collaboration request <ArrowRight size={14}/></button></div></section></div>;
}

function CampaignDialog({ step, setStep, draft, setDraft, creatorIds, creators, onClose, onSave }: { step: number; setStep: (step: number) => void; draft: ReturnType<typeof emptyCampaign>; setDraft: (value: ReturnType<typeof emptyCampaign>) => void; creatorIds: string[]; creators: InfluencerProfile[]; onClose: () => void; onSave: () => void }) {
  const [error, setError] = useState('');
  const update = (patch: Partial<typeof draft>) => setDraft({ ...draft, ...patch });
  const valid = draft.campaignName.trim() && draft.promotion.trim() && draft.audience.trim() && draft.date && draft.budget >= 0 && draft.deliverables.length > 0;
  const toggleDeliverable = (value: CollaborationDeliverable) => update({ deliverables: draft.deliverables.includes(value) ? draft.deliverables.filter(x => x !== value) : [...draft.deliverables, value] });
  return <div className="hub-modal-backdrop"><section className="hub-modal campaign-modal" role="dialog" aria-modal="true" aria-labelledby="campaign-dialog-title"><button className="close" onClick={onClose} aria-label="Close collaboration request"><X/></button><span className="eyebrow">DEMO WORKFLOW · STEP {step + 1} OF 2</span><h2 id="campaign-dialog-title">Prepare a collaboration request</h2><p className="muted">This creates a local draft only. No creator is contacted and no payment is collected.</p><div className="campaign-selected-creators"><b>Selected creators</b>{creators.map(c => <span key={c.id}>{c.initials} {c.name} · {c.platform}</span>)}{creatorIds.length > creators.length && <span>{creatorIds.length - creators.length} creator(s) unavailable in this demo catalog</span>}</div>
    {step === 0 ? <div className="campaign-form-grid"><label>Campaign name *<input value={draft.campaignName} onChange={e => update({ campaignName: e.target.value })} placeholder="e.g. Practical AI project series"/></label><label>Objective *<select value={draft.objective} onChange={e => update({ objective: e.target.value as InfluencerPreferences['objective'] })}>{objectives.map(x => <option key={x}>{x}</option>)}</select></label><label className="form-wide">Product, service, or content to promote *<textarea rows={3} value={draft.promotion} onChange={e => update({ promotion: e.target.value })} placeholder="What would the creator introduce?"/></label><label>Target audience *<input value={draft.audience} onChange={e => update({ audience: e.target.value })}/></label><label>Preferred platform<select value={draft.platform} onChange={e => update({ platform: e.target.value as InfluencerPlatform })}>{platformOptions.map(x => <option key={x}>{x}</option>)}</select></label><label>Proposed campaign date *<input type="date" value={draft.date} onChange={e => update({ date: e.target.value })}/></label><label>Proposed budget · USD *<input type="number" min="0" value={draft.budget} onChange={e => update({ budget: Math.max(0, Number(e.target.value)) })}/></label><fieldset className="form-wide deliverables-field"><legend>Deliverables · choose at least one *</legend>{deliverableOptions.map(x => <label key={x}><input type="checkbox" checked={draft.deliverables.includes(x)} onChange={() => toggleDeliverable(x)}/>{x}</label>)}</fieldset><label className="form-wide">Additional instructions<textarea rows={3} value={draft.instructions} onChange={e => update({ instructions: e.target.value })} placeholder="Optional details to discuss"/></label></div> : <div className="campaign-review"><div><span>Campaign</span><b>{draft.campaignName}</b></div><div><span>Objective</span><b>{draft.objective}</b></div><div><span>Promotion</span><b>{draft.promotion}</b></div><div><span>Audience · platform</span><b>{draft.audience} · {draft.platform}</b></div><div><span>Proposed date · budget</span><b>{draft.date} · {currency(draft.budget)}</b></div><div><span>Deliverables</span><b>{draft.deliverables.join(' · ')}</b></div><div><span>Creators</span><b>{creators.map(c => c.name).join(', ')}</b></div><p className="hub-disclosure"><CircleHelp size={14}/> Saving prepares a demo request for your records. It does not send a message or confirm availability.</p></div>}
    {error && <p className="form-error" role="alert">{error}</p>}<div className="modal-actions"><button className="btn plain" onClick={() => step ? setStep(0) : onClose()}>{step ? 'Back to details' : 'Cancel'}</button>{step === 0 ? <button className="btn primary" onClick={() => { if (!valid) { setError('Complete the required fields and choose at least one deliverable.'); return; } setError(''); setStep(1); }}>Review request <ArrowRight size={14}/></button> : <button className="btn primary" onClick={onSave}><Check size={14}/> Save demo request</button>}</div>
  </section></div>;
}

function platformIcon(platform: InfluencerPlatform) { return platform === 'Instagram' || platform === 'TikTok' ? <Instagram size={12}/> : platform === 'YouTube' ? <Youtube size={12}/> : platform === 'LinkedIn' ? <Linkedin size={12}/> : <Video size={12}/>; }
function escapeHtml(value: string) { return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] || char)); }
function slug(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'brandpilot'; }
function downloadFile(content: string, filename: string, type: string) { const url = URL.createObjectURL(new Blob([content], { type })); const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); }
async function copyText(value: string) { try { if (!navigator.clipboard?.writeText) return false; await navigator.clipboard.writeText(value); return true; } catch { return false; } }
