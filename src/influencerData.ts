import type { Post, Profile } from './App';

export type InfluencerPlatform = 'Instagram' | 'YouTube' | 'LinkedIn' | 'TikTok' | 'Other';
export type InfluencerTier = 'Nano' | 'Micro' | 'Mid-tier' | 'Macro';
export type InfluencerPreferences = {
  enabled: boolean;
  niche: string;
  audience: string;
  region: string;
  platform: InfluencerPlatform;
  tier: InfluencerTier | 'Any';
  budget: number | null;
  objective: 'Reach' | 'Engagement' | 'Leads' | 'Brand awareness' | 'Conversions';
};
export type CreatorPackage = { name: string; price: number; deliverables: string[] };
export type InfluencerProfile = {
  id: string;
  name: string;
  username: string;
  initials: string;
  platform: InfluencerPlatform;
  niche: string;
  tags: string[];
  bio: string;
  region: string;
  followers: number;
  engagement: number;
  tier: InfluencerTier;
  price: number;
  style: string;
  packages: CreatorPackage[];
};
export type CollaborationDeliverable = 'Feed post' | 'Short video' | 'Story' | 'Video mention';
export type InfluencerCollaborationRequest = {
  id: string;
  creatorIds: string[];
  campaignName: string;
  objective: string;
  promotion: string;
  audience: string;
  platform: InfluencerPlatform;
  date: string;
  budget: number;
  deliverables: CollaborationDeliverable[];
  instructions: string;
  status: 'Draft' | 'Request Prepared' | 'Awaiting Response';
  createdAt: string;
};
export type CreatorSnapshot = Pick<InfluencerProfile, 'id' | 'name' | 'username' | 'platform' | 'niche'>;
export type SharedCalendarPackage = {
  id: string;
  campaignName: string;
  objective: string;
  creators: CreatorSnapshot[];
  posts: Post[];
  message: string;
  createdAt: string;
  shareMethod: 'Prepared' | 'Copied' | 'Downloaded' | 'Email Draft Opened';
  contactEmail?: string;
};

export const defaultInfluencerPreferences = (profile?: Profile): InfluencerPreferences => ({
  enabled: false,
  niche: profile?.skills?.split(',')[0]?.trim() || profile?.role || '',
  audience: profile?.audience || '',
  region: 'Global',
  platform: profile?.platform === 'LinkedIn' ? 'LinkedIn' : 'Instagram',
  tier: 'Any',
  budget: null,
  objective: 'Brand awareness',
});

export const demoInfluencers: InfluencerProfile[] = [
  { id: 'creator-aya', name: 'Aya Rahman', username: '@aya.learns', initials: 'AR', platform: 'Instagram', niche: 'AI education', tags: ['Machine learning', 'Student life', 'Career growth'], bio: 'Makes approachable explainers about AI concepts, small experiments, and learning in public.', region: 'South Asia', followers: 18400, engagement: 4.8, tier: 'Micro', price: 280, style: 'Warm, visual explainers and short tutorials', packages: [{ name: 'Quick intro', price: 180, deliverables: ['Story'] }, { name: 'Learning bundle', price: 280, deliverables: ['Short video', 'Story'] }] },
  { id: 'creator-devon', name: 'Devon Park', username: '@devonbuilds', initials: 'DP', platform: 'YouTube', niche: 'Developer tools', tags: ['React', 'Python', 'Project demos'], bio: 'Builds small apps on camera and explains the decisions behind each project.', region: 'North America', followers: 42600, engagement: 5.1, tier: 'Mid-tier', price: 950, style: 'Detailed project walkthroughs and honest tool demos', packages: [{ name: 'Short spotlight', price: 420, deliverables: ['Short video'] }, { name: 'Build walkthrough', price: 950, deliverables: ['Video mention'] }] },
  { id: 'creator-lina', name: 'Lina Costa', username: '@linacreates', initials: 'LC', platform: 'TikTok', niche: 'Creator education', tags: ['Content planning', 'Creative workflow', 'Students'], bio: 'Shares practical routines for making useful content without a full-time creator schedule.', region: 'Europe', followers: 96500, engagement: 6.4, tier: 'Macro', price: 1400, style: 'Fast, candid videos with a clear takeaway', packages: [{ name: 'One idea', price: 600, deliverables: ['Short video'] }, { name: 'Launch week', price: 1400, deliverables: ['Short video', 'Story'] }] },
  { id: 'creator-omar', name: 'Omar Nasser', username: '@omar.codes', initials: 'ON', platform: 'LinkedIn', niche: 'Career development', tags: ['Internships', 'Software careers', 'Portfolio'], bio: 'Helps early-career technologists present projects clearly and prepare for their next role.', region: 'South Asia', followers: 12800, engagement: 3.9, tier: 'Micro', price: 240, style: 'Practical career posts and portfolio reviews', packages: [{ name: 'Feed feature', price: 240, deliverables: ['Feed post'] }, { name: 'Career bundle', price: 340, deliverables: ['Feed post', 'Story'] }] },
  { id: 'creator-maya', name: 'Maya Chen', username: '@mayamakes', initials: 'MC', platform: 'Instagram', niche: 'Data storytelling', tags: ['Data analysis', 'Visualization', 'Learning'], bio: 'Turns data concepts into simple visual stories and beginner-friendly project prompts.', region: 'East Asia', followers: 7200, engagement: 7.2, tier: 'Nano', price: 120, style: 'Clean visual carousels and bite-sized lessons', packages: [{ name: 'Carousel feature', price: 120, deliverables: ['Feed post'] }, { name: 'Visual set', price: 180, deliverables: ['Feed post', 'Story'] }] },
  { id: 'creator-sam', name: 'Sam Rivera', username: '@samstarts', initials: 'SR', platform: 'YouTube', niche: 'Founder stories', tags: ['Small business', 'Product building', 'Customer lessons'], bio: 'Documents the messy middle of building small digital products and finding first customers.', region: 'North America', followers: 31500, engagement: 4.4, tier: 'Mid-tier', price: 720, style: 'Thoughtful founder diaries and product case studies', packages: [{ name: 'Short story', price: 320, deliverables: ['Short video'] }, { name: 'Product feature', price: 720, deliverables: ['Video mention'] }] },
  { id: 'creator-nia', name: 'Nia Brooks', username: '@niastudies', initials: 'NB', platform: 'TikTok', niche: 'Student productivity', tags: ['Study routines', 'Internships', 'Tech learning'], bio: 'Shares realistic study systems, project progress, and early-career lessons for students.', region: 'North America', followers: 22300, engagement: 5.8, tier: 'Micro', price: 310, style: 'Relatable study clips and progress updates', packages: [{ name: 'Story clip', price: 190, deliverables: ['Story'] }, { name: 'Project feature', price: 310, deliverables: ['Short video'] }] },
  { id: 'creator-eli', name: 'Eli Morgan', username: '@eliexplains', initials: 'EM', platform: 'LinkedIn', niche: 'AI education', tags: ['Responsible AI', 'Machine learning', 'Professional learning'], bio: 'Writes accessible notes on applied AI and how teams can use it thoughtfully.', region: 'Europe', followers: 5800, engagement: 6.1, tier: 'Nano', price: 145, style: 'Clear, thoughtful professional explainers', packages: [{ name: 'Sponsored post', price: 145, deliverables: ['Feed post'] }, { name: 'Post plus mention', price: 210, deliverables: ['Feed post', 'Video mention'] }] },
];

export function safeLoad<T>(key: string, fallback: T, valid: (value: unknown) => value is T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return valid(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function isPreference(value: unknown): value is InfluencerPreferences {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<InfluencerPreferences>;
  return typeof item.enabled === 'boolean' && typeof item.niche === 'string' && typeof item.audience === 'string' && typeof item.region === 'string' && ['Instagram', 'YouTube', 'LinkedIn', 'TikTok', 'Other'].includes(item.platform || '') && ['Nano', 'Micro', 'Mid-tier', 'Macro', 'Any'].includes(item.tier || '') && (item.budget === null || (typeof item.budget === 'number' && Number.isFinite(item.budget) && item.budget >= 0)) && ['Reach', 'Engagement', 'Leads', 'Brand awareness', 'Conversions'].includes(item.objective || '');
}

export function safeArray<T>(key: string, validItem: (value: unknown) => value is T): T[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed.filter(validItem) : [];
  } catch {
    return [];
  }
}

export function isCampaign(value: unknown): value is InfluencerCollaborationRequest {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<InfluencerCollaborationRequest>;
  return typeof item.id === 'string' && Array.isArray(item.creatorIds) && item.creatorIds.every(x => typeof x === 'string') && typeof item.campaignName === 'string' && typeof item.objective === 'string' && typeof item.promotion === 'string' && typeof item.audience === 'string' && ['Instagram', 'YouTube', 'LinkedIn', 'TikTok', 'Other'].includes(item.platform || '') && typeof item.date === 'string' && typeof item.budget === 'number' && Number.isFinite(item.budget) && Array.isArray(item.deliverables) && item.deliverables.every(x => ['Feed post', 'Short video', 'Story', 'Video mention'].includes(String(x))) && ['Draft', 'Request Prepared', 'Awaiting Response'].includes(item.status || '') && typeof item.createdAt === 'string';
}

export function isSharedPackage(value: unknown): value is SharedCalendarPackage {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<SharedCalendarPackage>;
  const validCreator = (creator: unknown) => !!creator && typeof creator === 'object' && typeof (creator as CreatorSnapshot).id === 'string' && typeof (creator as CreatorSnapshot).name === 'string' && typeof (creator as CreatorSnapshot).username === 'string' && typeof (creator as CreatorSnapshot).platform === 'string' && typeof (creator as CreatorSnapshot).niche === 'string';
  const validPost = (post: unknown) => !!post && typeof post === 'object' && ['day', 'pillar', 'topic', 'hook', 'format', 'objective', 'status'].every(key => typeof (post as Record<string, unknown>)[key] === 'string') && typeof (post as Record<string, unknown>).time === 'number';
  return typeof item.id === 'string' && typeof item.campaignName === 'string' && typeof item.objective === 'string' && Array.isArray(item.creators) && item.creators.every(validCreator) && Array.isArray(item.posts) && item.posts.every(validPost) && typeof item.message === 'string' && typeof item.createdAt === 'string' && ['Prepared', 'Copied', 'Downloaded', 'Email Draft Opened'].includes(item.shareMethod || '');
}

export function makeId(prefix: string) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`}`;
}

const norm = (value: string) => value.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').trim();
const overlap = (a: string, b: string) => {
  const left = norm(a).split(/\s+/).filter(x => x.length > 2);
  const right = norm(b);
  return left.length ? left.filter(token => right.includes(token)).length / left.length : 0;
};

export function matchInfluencer(creator: InfluencerProfile, prefs: InfluencerPreferences, profile: Profile) {
  const nicheText = `${creator.niche} ${creator.tags.join(' ')}`;
  const nicheFit = Math.max(overlap(prefs.niche || profile.skills || profile.role, nicheText), overlap(profile.skills, nicheText));
  const audienceFit = Math.max(overlap(prefs.audience || profile.audience, creator.tags.join(' ')), overlap(prefs.audience || profile.audience, creator.bio));
  const platformFit = prefs.platform === creator.platform ? 1 : 0;
  const regionFit = !prefs.region || prefs.region === 'Global' || prefs.region === creator.region ? 1 : 0;
  const tierFit = prefs.tier === 'Any' || prefs.tier === creator.tier ? 1 : 0;
  const budgetFit = prefs.budget == null ? 0.5 : creator.price <= prefs.budget ? 1 : Math.max(0, 1 - (creator.price - prefs.budget) / Math.max(creator.price, 1));
  const goalFit = overlap(`${prefs.objective} ${profile.goal}`, `${creator.niche} ${creator.tags.join(' ')} ${creator.style}`);
  const score = Math.round(nicheFit * 25 + audienceFit * 20 + platformFit * 20 + regionFit * 15 + tierFit * 8 + budgetFit * 7 + goalFit * 5);
  const reasons = [nicheFit > 0.25 && `covers ${creator.niche.toLowerCase()}`, audienceFit > 0.2 && `speaks to ${prefs.audience || profile.audience || 'your intended audience'}`, platformFit && `uses ${creator.platform}`, regionFit && prefs.region !== 'Global' && `reaches ${creator.region}`, budgetFit > 0.7 && prefs.budget != null && `fits your budget`].filter(Boolean);
  return { score: Math.min(100, score), reason: reasons.length ? `Recommended because this creator ${reasons.slice(0, 3).join(', ')}.` : `A possible discovery based on ${creator.niche.toLowerCase()} content; adjust your preferences to refine the match.` };
}

export const currency = (amount: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
export const formatFollowers = (amount: number) => amount >= 1_000_000 ? `${(amount / 1_000_000).toFixed(1)}M` : amount >= 10_000 ? `${Math.round(amount / 1000)}K` : amount >= 1_000 ? `${(amount / 1000).toFixed(1)}K` : `${amount}`;
