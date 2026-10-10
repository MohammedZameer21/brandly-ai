import { useEffect, useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, Clock3, LifeBuoy, MessageSquareText, Send, TicketCheck, X } from 'lucide-react';

type Ticket = {
  id: string;
  category: string;
  subject: string;
  details: string;
  createdAt: string;
  status: 'Open';
};

const storageKey = 'bp_support_tickets';
const categories = ['Profile & account', 'Content strategy', 'Weekly calendar', 'Influencer Hub', 'Other'];

function loadTickets(): Ticket[] {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(saved) ? saved.filter((ticket): ticket is Ticket => Boolean(ticket?.id && ticket?.subject && ticket?.createdAt)) : [];
  } catch {
    return [];
  }
}

export default function HelpDesk({ onClose }: { onClose?: () => void }) {
  const [tickets, setTickets] = useState<Ticket[]>(loadTickets);
  const [category, setCategory] = useState(categories[0]);
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(tickets));
    } catch {
      setMessage('This browser could not save your ticket.');
    }
  }, [tickets]);

  function submitTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const ticket: Ticket = {
      id: `BP-${Date.now().toString().slice(-6)}`,
      category,
      subject: subject.trim(),
      details: details.trim(),
      createdAt: new Date().toISOString(),
      status: 'Open',
    };
    setTickets(current => [ticket, ...current]);
    setSubject('');
    setDetails('');
    setMessage(`Ticket ${ticket.id} saved on this device.`);
  }

  return <>
    <div className="title helpdesk-title">
      <div><span className="eyebrow">BRANDPILOT SUPPORT</span><h1>How can we help?</h1><p>Send a support request and keep track of it here.</p></div>
      {onClose&&<button className="support-close" type="button" onClick={onClose} aria-label="Close support panel"><X size={18}/></button>}
    </div>
    <div className="notice helpdesk-notice"><LifeBuoy size={16}/><span><b>Demo mode.</b> Tickets are saved in this browser only and are not sent to a support team.</span></div>
    <section className="helpdesk-layout" aria-label="Support desk">
      <article className="card helpdesk-form-card">
        <div className="helpdesk-card-heading"><span className="helpdesk-icon"><MessageSquareText size={18}/></span><div><h2>Open a support ticket</h2><p>Tell us what you need help with.</p></div></div>
        <form className="helpdesk-form" onSubmit={submitTicket}>
          <label>Topic<select value={category} onChange={event => setCategory(event.target.value)}>{categories.map(item => <option key={item}>{item}</option>)}</select></label>
          <label>Subject<input required maxLength={90} value={subject} onChange={event => setSubject(event.target.value)} placeholder="A short summary of the issue"/></label>
          <label>How can we help?<textarea required maxLength={1200} rows={6} value={details} onChange={event => setDetails(event.target.value)} placeholder="Share a few details so we can understand the issue."/><small>{details.length}/1200 characters</small></label>
          <div className="helpdesk-form-footer"><span><Clock3 size={13}/> Your ticket stays in this browser</span><button className="btn primary" type="submit"><Send size={14}/> Save ticket</button></div>
          <span className="sr-only" role="status" aria-live="polite">{message}</span>
        </form>
      </article>
      <aside className="card helpdesk-side-card">
        <div className="helpdesk-card-heading"><span className="helpdesk-icon"><TicketCheck size={18}/></span><div><h2>Your tickets</h2><p>{tickets.length ? `${tickets.length} saved on this device` : 'Your requests will appear here.'}</p></div></div>
        {tickets.length ? <div className="helpdesk-ticket-list">{tickets.map(ticket => <article className="helpdesk-ticket" key={ticket.id}>
          <div className="helpdesk-ticket-top"><span>{ticket.id}</span><span><i/>{ticket.status}</span></div>
          <h3>{ticket.subject}</h3>
          <p>{ticket.category} · {new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(ticket.createdAt))}</p>
          <details><summary>View your message <ArrowUpRight size={13}/></summary><p>{ticket.details}</p></details>
        </article>)}</div> : <div className="helpdesk-empty"><span><Check size={18}/></span><b>No tickets yet</b><p>When you save a request, you’ll find it here.</p></div>}
        <div className="helpdesk-side-note"><LifeBuoy size={15}/><p>Need help choosing a topic? Pick the closest match and describe what happened.</p></div>
      </aside>
    </section>
  </>;
}
