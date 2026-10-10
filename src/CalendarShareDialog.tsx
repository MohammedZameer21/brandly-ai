import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Copy, Download, Mail, Share2, X } from 'lucide-react';
import type { Post } from './App';
import { currency, demoInfluencers, makeId, safeArray, isSharedPackage, type InfluencerPreferences, type InfluencerProfile, type SharedCalendarPackage } from './influencerData';

const historyKey = 'bp_shared_calendar_packages';
const csvCell = (value?: string) => `"${(value || '').replace(/"/g, '""')}"`;
const dateName = (value?: string) => value ? new Date(`${value}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : 'Date to be agreed';

export default function CalendarShareDialog({ posts, prefs, savedIds, selectedIds, onClose, openHub, onSaved, campaignDefaults }: { posts: Post[]; prefs: InfluencerPreferences; savedIds: string[]; selectedIds: string[]; onClose: () => void; openHub: () => void; onSaved: (item: SharedCalendarPackage) => void; campaignDefaults?: { name: string; objective: string } }) {
  const eligibleIds = [...new Set([...savedIds, ...selectedIds])];
  const eligible = demoInfluencers.filter(x => eligibleIds.includes(x.id));
  const [step, setStep] = useState(0);
  const [creators, setCreators] = useState<string[]>(eligible.filter(x => selectedIds.includes(x.id)).map(x => x.id));
  const [postIndexes, setPostIndexes] = useState<number[]>(posts.map((_, i) => i));
  const [dateFilter, setDateFilter] = useState('All');
  const [pillarFilter, setPillarFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [campaignName, setCampaignName] = useState(campaignDefaults?.name || 'Content collaboration proposal');
  const [objective, setObjective] = useState<InfluencerPreferences['objective']>(campaignDefaults?.objective as InfluencerPreferences['objective'] || prefs.objective);
  const [contactEmail, setContactEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [savedPackages, setSavedPackages] = useState<SharedCalendarPackage[]>(() => safeArray(historyKey, isSharedPackage));
  const chosenPosts = useMemo(() => postIndexes.map(i => posts[i]).filter((x): x is Post => !!x), [postIndexes, posts]);
  const shownPosts = posts.map((post, index) => ({ post, index })).filter(({ post }) => (dateFilter === 'All' || post.date === dateFilter) && (pillarFilter === 'All' || post.pillar === pillarFilter) && (statusFilter === 'All' || post.status === statusFilter));
  const selectedCreators = demoInfluencers.filter(x => creators.includes(x.id));
  const emailValid = !contactEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail);
  const toggleCreator = (id: string) => setCreators(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);
  const togglePost = (index: number) => setPostIndexes(old => old.includes(index) ? old.filter(x => x !== index) : [...old, index]);
  const setAllShown = (checked: boolean) => setPostIndexes(old => {
    const visible = shownPosts.map(x => x.index);
    return checked ? [...new Set([...old, ...visible])] : old.filter(i => !visible.includes(i));
  });
  const prepareMessage = () => {
    const names = selectedCreators.map(x => x.name);
    setMessage(`Hi ${names.length === 1 ? names[0] : names.length ? names.join(' and ') : 'there'},\n\nI'd like to explore a potential collaboration with you. I've prepared a content calendar that outlines the topics, planned dates, and campaign objectives.\n\nPlease review the shared plan and let me know which ideas interest you. The calendar is a proposal, and dates or deliverables can be adjusted together.\n\nLooking forward to discussing a possible collaboration.`);
  };
  const snapshot = (method: SharedCalendarPackage['shareMethod']): SharedCalendarPackage => ({
    id: makeId('share'), campaignName: campaignName.trim(), objective,
    creators: selectedCreators.map(({ id, name, username, platform, niche }) => ({ id, name, username, platform, niche })),
    posts: chosenPosts.map(p => ({ ...p })), message, createdAt: new Date().toISOString(), shareMethod: method,
    ...(contactEmail ? { contactEmail } : {}),
  });
  const saveSnapshot = (item: SharedCalendarPackage) => {
    const next = [item, ...savedPackages]; setSavedPackages(next); localStorage.setItem(historyKey, JSON.stringify(next)); onSaved(item);
  };
  const textPackage = (item: SharedCalendarPackage) => `${item.campaignName}\nObjective: ${item.objective}\nCreators: ${item.creators.map(x => `${x.name} (${x.platform}, ${x.niche})`).join(', ')}\n\n${item.message}\n\nPROPOSED CONTENT CALENDAR\n${item.posts.map(p => `${dateName(p.date)} · ${p.topic}\n${p.hook}\n${p.format} · ${p.objective}\nCTA: ${p.cta || 'Not specified'}`).join('\n\n')}\n\nProposal only. No creator has been contacted.`;
  const downloadCsv = (item: SharedCalendarPackage) => {
    const headings = ['Date', 'Topic', 'Hook', 'Format', 'Pillar', 'Objective', 'CTA', 'Status'];
    const csv = [headings, ...item.posts.map(p => [dateName(p.date), p.topic, p.hook, p.format, p.pillar, p.objective, p.cta || '', p.status])].map(row => row.map(csvCell).join(',')).join('\r\n');
    download(csv, 'brandly-influencer-calendar.csv', 'text/csv;charset=utf-8');
  };
  const downloadBrief = (item: SharedCalendarPackage) => {
    const escape = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c));
    const postRows = item.posts.map(p => `<tr><td>${escape(dateName(p.date))}</td><td>${escape(p.topic)}</td><td>${escape(p.hook)}</td><td>${escape(p.format)}</td><td>${escape(p.objective)}</td><td>${escape(p.cta || '')}</td></tr>`).join('');
    const html = `<!doctype html><html><meta charset="utf-8"><title>${escape(item.campaignName)}</title><body style="font:15px Arial;color:#24342b;max-width:900px;margin:40px auto;line-height:1.6"><h1>${escape(item.campaignName)}</h1><p><b>Demo collaboration brief · prepared ${new Date(item.createdAt).toLocaleDateString()}</b></p><p><b>Creators:</b> ${item.creators.map(x => escape(x.name)).join(', ')}</p><p><b>Campaign objective:</b> ${escape(item.objective)}</p><h2>Proposed deliverables</h2><p>${item.posts.map(p => escape(p.format)).filter((v, i, all) => all.indexOf(v) === i).join(', ') || 'To be discussed'} · ${item.posts.length} calendar post(s)</p><h2>Collaboration message</h2><p>${escape(item.message).replace(/\n/g, '<br>')}</p><h2>Proposed calendar</h2><table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%"><thead><tr><th>Date</th><th>Topic</th><th>Opening hook</th><th>Format</th><th>Objective</th><th>CTA</th></tr></thead><tbody>${postRows}</tbody></table><p>Planning proposal only. No contact, booking, payment, or publishing has occurred.</p></body></html>`;
    download(html, `${slug(item.campaignName)}-collaboration-brief.html`, 'text/html;charset=utf-8');
  };
  const doCopy = async () => { try { await navigator.clipboard.writeText(textPackage(snapshot('Prepared'))); const item = snapshot('Copied'); saveSnapshot(item); setFeedback('Share package copied and saved to history.'); } catch { setError('Clipboard access is unavailable. You can download the collaboration brief instead.'); } };
  const doCsv = () => { const item = snapshot('Downloaded'); downloadCsv(item); saveSnapshot(item); setFeedback('Calendar CSV downloaded and package saved to history.'); };
  const doBrief = () => { const item = snapshot('Downloaded'); downloadBrief(item); saveSnapshot(item); setFeedback('Collaboration brief downloaded and package saved to history.'); };
  const emailHref = `mailto:${encodeURIComponent(contactEmail)}?subject=${encodeURIComponent(campaignName)}&body=${encodeURIComponent(textPackage(snapshot('Prepared')))}`;
  const launchEmail = () => { if (!emailValid || !contactEmail) { setError('Enter a valid contact email to prepare an email draft.'); return; } const item = snapshot('Email Draft Opened'); saveSnapshot(item); };
  const next = () => {
    setError('');
    if (step === 0 && !creators.length) { setError('Select at least one creator, or discover creators first.'); return; }
    if (step === 1 && !postIndexes.length) { setError('Choose at least one calendar post to include.'); return; }
    if (step === 2) {
      if (!campaignName.trim()) { setError('Add a campaign name before reviewing.'); return; }
      if (!message.trim()) { setError('Add a short collaboration message before reviewing.'); return; }
      if (!emailValid) { setError('Enter a valid email address or leave the email field blank.'); return; }
    }
    if (step === 1) prepareMessage();
    setStep(step + 1);
  };

  return <div className="hub-modal-backdrop"><section className="hub-modal share-modal" role="dialog" aria-modal="true" aria-labelledby="calendar-share-title"><button className="close" onClick={onClose} aria-label="Close calendar sharing"><X/></button>
    <span className="eyebrow">CALENDAR COLLABORATION · STEP {step + 1} OF 4</span><h2 id="calendar-share-title">Share your calendar proposal</h2><div className="share-stepper">{['Creator', 'Calendar', 'Message', 'Review'].map((x, i) => <span key={x} className={i <= step ? 'current' : ''}><i>{i < step ? <Check size={11}/> : i + 1}</i>{x}</span>)}</div>
    {step === 0 && <div className="share-stage"><div className="share-stage-heading"><h3>Choose who can review your plan</h3><p>Select saved creators or creators selected in your campaign plan.</p></div>{eligible.length ? <div className="share-creator-list">{eligible.map(x => <label className={`share-creator-option ${creators.includes(x.id) ? 'checked' : ''}`} key={x.id}><input type="checkbox" checked={creators.includes(x.id)} onChange={() => toggleCreator(x.id)}/><span className="creator-avatar small">{x.initials}</span><span><b>{x.name}</b><small>{x.platform} · {x.niche}</small></span><CheckCircle2 size={16}/></label>)}</div> : <div className="share-empty"><b>No saved or selected creators yet</b><p>Save a creator or select one for a campaign in Influencer Hub. You can discover creators without losing this calendar.</p><button className="btn outline" onClick={openHub}>Find influencers <ArrowRight size={13}/></button></div>}</div>}
    {step === 1 && <div className="share-stage"><div className="share-stage-heading"><h3>Choose calendar content</h3><p>{posts.length} current post{posts.length === 1 ? '' : 's'} · selection is a snapshot and will not sync later edits.</p></div><div className="share-filter-row"><label>Date<select value={dateFilter} onChange={e => setDateFilter(e.target.value)}><option>All</option>{[...new Set(posts.map(p => p.date).filter((x): x is string => !!x))].map(x => <option key={x} value={x}>{dateName(x)}</option>)}</select></label><label>Content pillar<select value={pillarFilter} onChange={e => setPillarFilter(e.target.value)}><option>All</option>{[...new Set(posts.map(p => p.pillar))].map(x => <option key={x}>{x}</option>)}</select></label><label>Status<select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option>All</option>{[...new Set(posts.map(p => p.status))].map(x => <option key={x}>{x}</option>)}</select></label><button className="text-btn" onClick={() => setAllShown(shownPosts.some(x => !postIndexes.includes(x.index)))}>Toggle visible</button></div><div className="share-post-list">{shownPosts.map(({ post, index }) => <label className={`share-post-option ${postIndexes.includes(index) ? 'checked' : ''}`} key={`${post.date || post.day}-${index}`}><input type="checkbox" checked={postIndexes.includes(index)} onChange={() => togglePost(index)}/><span><b>{dateName(post.date)} · {post.topic}</b><small>{post.hook}</small><em>{post.format} · {post.pillar} · {post.objective} · CTA: {post.cta || 'Not specified'}</em></span></label>)}{shownPosts.length === 0 && <p className="muted">No posts match those content filters.</p>}</div><p className="privacy-note"><CheckCircle2 size={14}/> Only selected post details are included. Internal notes and profile data are never added.</p></div>}
    {step === 2 && <div className="share-stage"><div className="share-stage-heading"><h3>Personalize your message</h3><p>This text is a proposal for you to copy or prepare in your email app.</p></div><div className="campaign-form-grid share-message-fields"><label>Campaign name *<input value={campaignName} onChange={e => setCampaignName(e.target.value)} placeholder="Campaign name"/></label><label>Campaign objective<select value={objective} onChange={e => setObjective(e.target.value as InfluencerPreferences['objective'])}>{['Reach', 'Engagement', 'Leads', 'Brand awareness', 'Conversions', prefs.objective].filter((x, i, all) => all.indexOf(x) === i).map(x => <option key={x}>{x}</option>)}</select></label><label className="form-wide">Contact email <span className="optional-label">Optional · never invented</span><input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="Enter a creator contact email you already have"/><small>Email preparation opens your mail application. It does not send or guarantee delivery.</small></label><label className="form-wide">Editable collaboration message<textarea rows={9} value={message} onChange={e => setMessage(e.target.value)}/></label></div></div>}
    {step === 3 && <div className="share-stage share-review"><h3>Review before preparing</h3><div className="review-grid"><div><span>Creators</span><b>{selectedCreators.map(x => `${x.name} · ${x.platform}`).join(', ')}</b></div><div><span>Campaign</span><b>{campaignName}</b></div><div><span>Objective</span><b>{objective}</b></div><div><span>Selected calendar posts</span><b>{chosenPosts.length} proposal(s)</b></div></div><div className="review-posts">{chosenPosts.map((p, i) => <div key={`${p.date || p.day}-${i}`}><b>{dateName(p.date)} · {p.topic}</b><span>{p.hook} · {p.format} · {p.objective} · CTA: {p.cta || 'Not specified'}</span></div>)}</div><blockquote className="review-message">{message}</blockquote><p className="privacy-note"><CheckCircle2 size={14}/> This remains a proposal. No influencer is contacted, booked, or paid automatically.</p>
      {feedback && <div className="share-success" role="status"><CheckCircle2 size={16}/>{feedback}</div>}
      <div className="share-methods"><button className="btn outline" onClick={doCopy}><Copy size={14}/> Copy share package</button><button className="btn outline" onClick={doCsv}><Download size={14}/> Download calendar CSV</button><button className="btn outline" onClick={doBrief}><Download size={14}/> Download collaboration brief</button>{contactEmail && <a className={`btn primary ${!emailValid ? 'disabled-link' : ''}`} href={emailValid ? emailHref : undefined} onClick={e => { if (!emailValid) { e.preventDefault(); setError('Enter a valid contact email.'); } else launchEmail(); }}><Mail size={14}/> Prepare email draft</a>}</div>
    </div>}
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="modal-actions"><button className="btn plain" onClick={() => step ? (setError(''), setStep(step - 1)) : onClose()}>{step ? <><ArrowLeft size={14}/> Back</> : 'Cancel'}</button>{step < 3 ? <button className="btn primary" onClick={next}>Continue <ArrowRight size={14}/></button> : <button className="btn primary" onClick={onClose}>Done <Check size={14}/></button>}</div>
  </section></div>;
}

function download(content: string, filename: string, type: string) { const url = URL.createObjectURL(new Blob([content], { type })); const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); }
function slug(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'brandly'; }
