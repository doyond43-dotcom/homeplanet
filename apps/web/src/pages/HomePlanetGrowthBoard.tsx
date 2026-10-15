import React, { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/AuthProvider";

type Person = { id: string; owner_id: string; name: string; lane: string; source: string; status: string; notes: string; phone: string | null; email: string | null; created_at: string };
type Opportunity = { id: string; person_id: string; title: string; description: string; status: string; outcome: string | null; created_at: string };
type Action = { id: string; person_id: string; opportunity_id: string | null; title: string; status: string; due_at: string | null; created_at: string; completed_at?: string | null };
type Interaction = { id: string; person_id: string; kind: string; summary: string; source_type: string; occurred_at: string | null; created_at: string };
type Tab = "people" | "actions" | "opportunities";
const base: React.CSSProperties = { background: "#0b1019", minHeight: "100vh", color: "#eff3f9", fontFamily: "system-ui, sans-serif", padding: "22px 14px" };
const panel: React.CSSProperties = { border: "1px solid #2b3648", background: "#151c29", padding: 16, borderRadius: 14 };
const field: React.CSSProperties = { width: "100%", boxSizing: "border-box", background: "#0e1521", border: "1px solid #39475c", borderRadius: 10, padding: 12, color: "#fff", font: "inherit" };
const btn: React.CSSProperties = { border: "1px solid #40516a", borderRadius: 10, background: "#222f40", color: "white", padding: "10px 13px", font: "inherit", cursor: "pointer" };
const green: React.CSSProperties = { ...btn, background: "#23604c", borderColor: "#348062" };
const small: React.CSSProperties = { color: "#a7b7cc", fontSize: 13 };
const starter = [
  { key: "randy", name: "Randy Roberts", lane: "Business Development", source: "Longtime friendship", status: "active", notes: "Longtime friend. Interested in helping HomePlanet grow. Tagged social contacts. Mentioned Byron, restaurants, ranch/agriculture, Cheney Brothers, wildlife management contracts, and securing digital accounts.", next: "Confirm call and lunch outcomes; identify first introduction.", opp: ["Restaurant introductions", "Ranch and agriculture contacts", "Cheney Brothers connection", "Byron introduction", "Wildlife management contracts"], summary: "Interested in helping HomePlanet grow; discussed connections and business development directions.", source_type: "memory" },
  { key: "michelle", name: "Michelle Watson", lane: "Funding and Partnerships", source: "Okeechobee Together", status: "active", notes: "Okeechobee Together helped move piles and level her yard. Works for Okeechobee County Board of County Commissioners as Grants Manager and oversees Affordable Housing. She reached out about fundraising and grant-writing support; no partnership or funding is confirmed.", next: "Arrange meeting to learn about potential collaboration.", opp: ["Grant research", "Fundraising strategy", "Community partnerships", "Program development"], summary: "Reached out expressing interest in helping HomePlanet grow and proposed meeting to discuss her fundraising and grant-writing skills.", source_type: "direct" },
  { key: "lorenzi", name: "Lorenzi R Marcos", lane: "Human Behavior and Guidance", source: "Local HomePlanet conversation", status: "active", notes: "The Digital Habitat; near Okeechobee airport. Background discussed: nutrition, personal training, counseling/therapy, and books. Phone +1 (754) 256-7911. He connected HomePlanet's next-action problem to his experiences helping people navigate decisions; not offering a formal branding role.", next: "Document call insights and consider a focused HomePlanet walkthrough.", opp: ["User comprehension", "Next-action guidance", "Trust and communication", "Workflow feedback"], summary: "October 9, 2026 phone call: discussed business owners juggling fragmented apps and not knowing the next step. Lorenzi recognized analogous coaching challenges. Reconstructed from memory; call not recorded.", source_type: "memory" },
];
const errorText = (e: unknown) => e instanceof Error ? e.message : String(e);

export default function HomePlanetGrowthBoard() {
  const { user, loading: authLoading } = useAuth();
  const [people, setPeople] = useState<Person[]>([]);
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("people");
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [form, setForm] = useState<"person" | "interaction" | "opportunity" | "action" | "edit" | null>(null);
  const [personName, setPersonName] = useState("");
  const [personLane, setPersonLane] = useState("");
  const [personSource, setPersonSource] = useState("");
  const [personNotes, setPersonNotes] = useState("");
  const [personPhone, setPersonPhone] = useState("");
  const [personEmail, setPersonEmail] = useState("");
  const [entryText, setEntryText] = useState("");
  const [entryType, setEntryType] = useState("note");
  const [sourceType, setSourceType] = useState("memory");
  const [dueDate, setDueDate] = useState("");
  const [opportunityId, setOpportunityId] = useState("");

  const refresh = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true); setError("");
    try {
      const [p, o, a, i] = await Promise.all([
        supabase.from("hp_growth_people").select("*").order("created_at", { ascending: true }),
        supabase.from("hp_growth_opportunities").select("*").order("created_at", { ascending: false }),
        supabase.from("hp_growth_actions").select("*").order("created_at", { ascending: false }),
        supabase.from("hp_growth_interactions").select("*").order("created_at", { ascending: false }),
      ]);
      for (const result of [p,o,a,i]) if (result.error) throw result.error;
      setPeople((p.data || []) as Person[]); setOpps((o.data || []) as Opportunity[]);
      setActions((a.data || []) as Action[]); setInteractions((i.data || []) as Interaction[]);
    } catch(e) { setError("Could not load Growth Board: " + errorText(e)); }
    finally { setLoading(false); }
  }, [user]);
  useEffect(() => { void refresh(); }, [refresh]);
  const person = people.find(p => p.id === activeId) || null;
  const shown = useMemo(() => people.filter(p => `${p.name} ${p.lane} ${p.source} ${p.notes}`.toLowerCase().includes(search.toLowerCase())), [people,search]);
  const nameOf = (id: string) => people.find(p => p.id === id)?.name || "Unknown person";
  const openActions = useMemo(() => actions.filter(a => a.status === "open").sort((a,b) => (a.due_at ? new Date(a.due_at).getTime() : Number.MAX_SAFE_INTEGER) - (b.due_at ? new Date(b.due_at).getTime() : Number.MAX_SAFE_INTEGER)),[actions]);
  const actionTiming = (a: Action) => {
    if (!a.due_at) return "No date set";
    const day = new Date(a.due_at).toLocaleDateString();
    const d = new Date(a.due_at); const now = new Date();
    const today = new Date(now.getFullYear(),now.getMonth(),now.getDate());
    const dueDay = new Date(d.getFullYear(),d.getMonth(),d.getDate());
    return dueDay < today ? `Overdue · ${day}` : dueDay.getTime() === today.getTime() ? `Today · ${day}` : `Due ${day}`;
  };
  function startForm(type: typeof form, p: Person | null = null) {
    if (p) setActiveId(p.id);
    setForm(type); setEntryText(""); setEntryType(type === "interaction" ? "note" : "");
    setSourceType("memory"); setDueDate(""); setOpportunityId("");
    setPersonName(p?.name || ""); setPersonLane(p?.lane || ""); setPersonSource(p?.source || "");
    setPersonNotes(p?.notes || ""); setPersonPhone(p?.phone || ""); setPersonEmail(p?.email || "");
  }
  async function work(run: () => Promise<void>, success: string) {
    setBusy(true); setError(""); setMessage("");
    try { await run(); await refresh(); setForm(null); setMessage(success); }
    catch (e) { setError(errorText(e)); }
    finally { setBusy(false); }
  }
  async function savePerson() {
    if (!personName.trim()) return setError("Person name is required.");
    await work(async () => {
      const record = { name: personName.trim(), lane: personLane.trim(), source: personSource.trim(), notes: personNotes.trim(), phone: personPhone.trim() || null, email: personEmail.trim() || null };
      const result = form === "edit" && person
        ? await supabase.from("hp_growth_people").update(record).eq("id",person.id)
        : await supabase.from("hp_growth_people").insert({ ...record, owner_id: user!.id });
      if (result.error) throw result.error;
    }, "Person saved.");
  }
  async function saveEntry() {
    if (!activeId || !entryText.trim()) return setError("Choose a person and enter details.");
    await work(async () => {
      let result;
      if (form === "interaction") result = await supabase.from("hp_growth_interactions").insert({ owner_id: user!.id, person_id: activeId, summary: entryText.trim(), kind: entryType, source_type: sourceType });
      else if (form === "opportunity") result = await supabase.from("hp_growth_opportunities").insert({ owner_id: user!.id, person_id: activeId, title: entryText.trim(), status: "exploring" });
      else result = await supabase.from("hp_growth_actions").insert({ owner_id: user!.id, person_id: activeId, opportunity_id: opportunityId || null, title: entryText.trim(), due_at: dueDate ? new Date(`${dueDate}T12:00:00`).toISOString() : null });
      if (result.error) throw result.error;
    }, "Record saved to Supabase.");
  }
  async function completeAction(action: Action) {
    await work(async () => {
      const { error: e } = await supabase.from("hp_growth_actions").update({ status: "done", completed_at: new Date().toISOString() }).eq("id", action.id);
      if (e) throw e;
      const { error: logError } = await supabase.from("hp_growth_interactions").insert({ owner_id: user!.id, person_id: action.person_id, kind: "outcome", summary: `Completed next action: ${action.title}`, source_type: "direct" });
      if (logError) throw logError;
    }, "Action completed and logged.");
  }
  async function changeOpp(opp: Opportunity, status: string) {
    if (opp.status === status) return;
    await work(async () => {
      const { error: e } = await supabase.from("hp_growth_opportunities").update({status}).eq("id",opp.id);
      if (e) throw e;
      const { error: logError } = await supabase.from("hp_growth_interactions").insert({ owner_id: user!.id, person_id: opp.person_id, kind: "observation", source_type: "direct", summary: `Opportunity status changed: ${opp.title} (${opp.status} → ${status}).` });
      if (logError) throw logError;
    }, "Opportunity updated and logged.");
  }
  async function importStarter() {
    if (!user || people.length) return setError("Starter import is available only when the People table is empty.");
    if (!window.confirm("Import Randy, Michelle and Lorenzi into your private Growth Board?")) return;
    await work(async () => {
      for (const s of starter) {
        const { data: p, error: e } = await supabase.from("hp_growth_people").insert({ owner_id:user.id, name:s.name, lane:s.lane, source:s.source, status:s.status, notes:s.notes, phone:s.key === "lorenzi" ? "+1 (754) 256-7911" : null }).select("id").single();
        if (e) throw e;
        const [o,a,i] = await Promise.all([
          supabase.from("hp_growth_opportunities").insert(s.opp.map(title => ({ owner_id:user.id, person_id:p.id, title }))),
          supabase.from("hp_growth_actions").insert({ owner_id:user.id, person_id:p.id, title:s.next }),
          supabase.from("hp_growth_interactions").insert({ owner_id:user.id, person_id:p.id, summary:s.summary, kind:s.key === "lorenzi" ? "call" : "message", source_type:s.source_type, occurred_at:s.key === "lorenzi" ? "2026-10-09T12:00:00-04:00" : null }),
        ]);
        for (const r of [o,a,i]) if(r.error) throw r.error;
      }
    }, "Three starter relationships imported into Supabase.");
  }
  if (authLoading) return <main style={base}>Checking HomePlanet sign-in...</main>;
  if (!user) return <main style={base}>Sign in to HomePlanet to view the Growth Board.</main>;
  return <main style={base}>
    <div style={{maxWidth:1050, margin:"0 auto"}}>
      <div style={{...small,letterSpacing:2}}>HOMEPLANET / INTERNAL</div>
      <h1 style={{margin:"8px 0",fontSize:30}}>Growth & Relationships</h1>
      <div style={small}>Person → Connection → Opportunity → Next Action → Outcome</div>
      {error && <div role="alert" style={{...panel,borderColor:"#ba5151",marginTop:14,color:"#ffbaba"}}>{error}</div>}
      {message && <div role="status" style={{...panel,borderColor:"#388766",marginTop:14}}>{message}</div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:9,margin:"20px 0"}}>
        {[["People",people.length],["Opportunities",opps.length],["Completed Actions",actions.filter(x=>x.status==="done").length]].map(([label,value])=><div key={String(label)} style={{...panel,padding:12}}><b style={{fontSize:26}}>{value}</b><div style={{...small,fontSize:11}}>{label}</div></div>)}
      </div>
      <div style={{...panel,marginTop:14,marginBottom:15,borderColor:"#376450"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,flexWrap:"wrap"}}>
          <div><b style={{fontSize:17}}>Needs your attention</b><div style={small}>Your next moves, sorted by due date</div></div>
          <button style={btn} onClick={()=>setTab("actions")}>View all actions ({openActions.length})</button>
        </div>
        {openActions.length === 0 ? <p style={small}>Nothing waiting for follow-up. Add an action to any relationship.</p> :
        <div style={{display:"grid",gap:9,marginTop:13}}>{openActions.slice(0,4).map(a=><div key={a.id} style={{borderTop:"1px solid #324257",paddingTop:10,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}><div><b>{a.title}</b><div style={small}>{nameOf(a.person_id)} · {actionTiming(a)}</div></div><button style={btn} onClick={()=>{setActiveId(a.person_id);setForm(null)}}>Open</button></div>)}</div>}
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
        <button style={green} onClick={()=>startForm("person")}>+ Add Person</button>
        <button style={btn} onClick={()=>void refresh()} disabled={loading}>Refresh</button>
        {people.length===0 && !loading && <button style={btn} disabled={busy} onClick={()=>void importStarter()}>Import 3 Starter Records</button>}
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>{(["people","actions","opportunities"] as Tab[]).map(t=><button key={t} style={tab===t?green:btn} onClick={()=>setTab(t)}>{t === "people" ? "People" : t === "actions" ? "Next Actions" : "Opportunities"}</button>)}</div>
      <input style={{...field,marginBottom:14}} aria-label="Search relationships" placeholder="Search people, relationships, notes..." value={search} onChange={e=>setSearch(e.target.value)}/>
      {loading ? <p>Loading saved Growth Board...</p> : <div style={{display:"grid",gap:10}}>
        {tab==="people" && shown.map(p=><section key={p.id} style={panel}><div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center"}}><div><b style={{fontSize:18}}>{p.name}</b><div style={small}>{p.lane} · {p.source}</div><div style={small}>{actions.filter(x=>x.person_id===p.id&&x.status==="open").length} open actions · {opps.filter(x=>x.person_id===p.id).length} opportunities</div></div><button style={btn} onClick={()=>setActiveId(p.id)}>Open</button></div></section>)}
        {tab==="actions" && actions.filter(a=>shown.some(p=>p.id===a.person_id)).map(a=><section key={a.id} style={panel}><b>{a.title}</b><div style={small}>{nameOf(a.person_id)} · {a.status === "open" ? actionTiming(a) : a.status}</div><div style={{display:"flex",gap:8,marginTop:10}}><button style={btn} onClick={()=>setActiveId(a.person_id)}>Person</button>{a.status==="open" && <button style={green} disabled={busy} onClick={()=>void completeAction(a)}>Mark Done</button>}</div></section>)}
        {tab==="opportunities" && opps.filter(o=>shown.some(p=>p.id===o.person_id)).map(o=><section key={o.id} style={panel}><b>{o.title}</b><div style={small}>{nameOf(o.person_id)} · {o.status}</div><div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}><button style={btn} onClick={()=>setActiveId(o.person_id)}>Person</button><select aria-label={`Status for ${o.title}`} style={{...field,width:"auto"}} disabled={busy} value={o.status} onChange={e=>void changeOpp(o,e.target.value)}>{["exploring","contacted","meeting","active","won","lost","on_hold"].map(s=><option key={s} value={s}>{s}</option>)}</select></div></section>)}
        {tab==="people" && !shown.length && <p style={small}>No people match your search.</p>}
      </div>}
      <p style={{...small,marginTop:20}}>Live Supabase records · Signed-in account only · Build 3. A status of “won” is entered manually, not independent proof of revenue.</p>
    </div>
    {person && <div style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,.8)",display:"flex",justifyContent:"flex-end"}} onClick={()=>{setActiveId(null);setForm(null)}}>
      <section role="dialog" aria-modal="true" aria-label={`${person.name} relationship`} onClick={e=>e.stopPropagation()} style={{background:"#101826",width:"min(100%,520px)",overflowY:"auto",padding:18,boxSizing:"border-box"}}>
        <button style={btn} onClick={()=>{setActiveId(null);setForm(null)}}>← Close</button>
        <h2>{person.name}</h2><p style={small}>{person.lane} · {person.source}</p>
        <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:18}}><button style={btn} onClick={()=>startForm("edit",person)}>Edit</button><button style={green} onClick={()=>startForm("interaction",person)}>+ Interaction</button><button style={btn} onClick={()=>startForm("opportunity",person)}>+ Opportunity</button><button style={btn} onClick={()=>startForm("action",person)}>+ Action</button></div>
        {form && form!=="person" && <div style={{...panel,marginBottom:14}}><h3 style={{marginTop:0}}>{form==="edit"?"Edit Person":form==="interaction"?"Log what happened":form==="action"?"Set next action":"Add opportunity"}</h3><p style={small}>{form==="interaction"?"Capture the conversation or observation. This becomes a timestamped Truth Chain entry.":form==="action"?"What should happen next? Add a date if one is known.":form==="opportunity"?"What door might this relationship open? Keep possibilities separate from confirmed results.":"Update their contact and relationship details."}</p>{form==="edit" ? <div style={{display:"grid",gap:9}}>
          <input style={field} placeholder="Name" aria-label="Name" value={personName} onChange={e=>setPersonName(e.target.value)}/><input style={field} placeholder="Growth lane" aria-label="Growth lane" value={personLane} onChange={e=>setPersonLane(e.target.value)}/><input style={field} placeholder="Relationship origin" aria-label="Relationship origin" value={personSource} onChange={e=>setPersonSource(e.target.value)}/><input style={field} placeholder="Phone" aria-label="Phone" value={personPhone} onChange={e=>setPersonPhone(e.target.value)}/><input style={field} placeholder="Email" aria-label="Email" value={personEmail} onChange={e=>setPersonEmail(e.target.value)}/><textarea style={field} rows={3} placeholder="Notes" aria-label="Notes" value={personNotes} onChange={e=>setPersonNotes(e.target.value)}/>
        </div> : <div style={{display:"grid",gap:9}}>
          <label htmlFor="growth-entry-text" style={{...small,fontWeight:700,color:"#e8f1fc"}}>{form==="interaction"?"What happened?":form==="opportunity"?"What is the opportunity?":"What needs to happen next?"}</label>
          <textarea id="growth-entry-text" style={field} rows={4} placeholder={form==="interaction"?"Summarize the call, message, meeting, or observation...":form==="opportunity"?"e.g. Restaurant owner introduction":"e.g. Call to confirm Thursday lunch"} value={entryText} onChange={e=>setEntryText(e.target.value)}/>
          {form==="interaction" && <><label style={small}>Interaction type</label><select style={field} value={entryType} onChange={e=>setEntryType(e.target.value)}>{["note","call","meeting","message","introduction","observation","outcome"].map(x=><option key={x} value={x}>{x[0].toUpperCase()+x.slice(1)}</option>)}</select><label style={small}>How do you know this? (Evidence source)</label><select style={field} value={sourceType} onChange={e=>setSourceType(e.target.value)}>{[["memory","Reconstructed from memory"],["direct","Direct observation"],["document","Saved message or document"],["recording","Recorded with consent"]].map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></>}
          {form==="action" && <><label style={small}>Due date (optional)</label><input type="date" style={field} value={dueDate} onChange={e=>setDueDate(e.target.value)}/><label style={small}>Related opportunity (optional)</label><select style={field} value={opportunityId} onChange={e=>setOpportunityId(e.target.value)}><option value="">None</option>{opps.filter(o=>o.person_id===person.id).map(o=><option key={o.id} value={o.id}>{o.title}</option>)}</select></>}
        </div>}
        <div style={{display:"flex",gap:8,marginTop:10}}><button style={green} disabled={busy} onClick={()=>void (form==="edit"?savePerson():saveEntry())}>{busy?"Saving...":"Save to Supabase"}</button><button style={btn} onClick={()=>setForm(null)}>Cancel</button></div></div>}
        <h3>Relationship</h3><p style={small}>{person.notes || "No notes yet."}</p>{person.phone && <p style={small}>Phone: {person.phone}</p>}{person.email && <p style={small}>Email: {person.email}</p>}
        <h3>Next Actions</h3><p style={small}>Open actions appear first. Use “Mark Done” only after the work actually happened.</p>{actions.filter(x=>x.person_id===person.id).sort((a,b)=>Number(a.status!=="open")-Number(b.status!=="open")).map(a=><div key={a.id} style={{...panel,marginBottom:8}}><b>{a.title}</b><div style={small}>{a.status === "open" ? actionTiming(a) : a.status}</div>{a.status==="open"&&<button style={{...green,marginTop:8}} disabled={busy} onClick={()=>void completeAction(a)}>Mark Done</button>}</div>)}
        <h3>Opportunities</h3>{opps.filter(x=>x.person_id===person.id).map(o=><div key={o.id} style={{...panel,marginBottom:8}}><b>{o.title}</b><div style={small}>Current stage: {o.status}</div><label style={{...small,display:"block",marginTop:8}}>Update opportunity stage</label><select aria-label={`Stage for ${o.title}`} style={{...field,marginTop:4}} disabled={busy} value={o.status} onChange={e=>void changeOpp(o,e.target.value)}>{["exploring","contacted","meeting","active","won","lost","on_hold"].map(stage=><option key={stage} value={stage}>{stage}</option>)}</select></div>)}
        <h3>Truth Chain — Interaction History</h3>{interactions.filter(x=>x.person_id===person.id).map(i=><div key={i.id} style={{borderLeft:"2px solid #438f6b",paddingLeft:12,marginBottom:15}}><div style={small}>{i.kind} · {i.source_type} · {new Date(i.created_at).toLocaleString()}</div><div>{i.summary}</div></div>)}
      </section></div>}
    {form==="person" && <div style={{position:"fixed",inset:0,zIndex:1200,background:"rgba(0,0,0,.85)",display:"flex",justifyContent:"center",alignItems:"flex-start",overflowY:"auto",padding:18}}><section role="dialog" aria-modal="true" aria-label="Add person" style={{...panel,width:"min(100%,520px)",marginTop:30}}><h2>New Relationship</h2><div style={{display:"grid",gap:10}}><input style={field} value={personName} onChange={e=>setPersonName(e.target.value)} placeholder="Full name *" aria-label="Full name"/><input style={field} value={personLane} onChange={e=>setPersonLane(e.target.value)} placeholder="Growth lane" aria-label="Growth lane"/><input style={field} value={personSource} onChange={e=>setPersonSource(e.target.value)} placeholder="How we connected" aria-label="How we connected"/><input style={field} value={personPhone} onChange={e=>setPersonPhone(e.target.value)} placeholder="Phone" aria-label="Phone"/><input style={field} value={personEmail} onChange={e=>setPersonEmail(e.target.value)} placeholder="Email" aria-label="Email"/><textarea style={field} value={personNotes} onChange={e=>setPersonNotes(e.target.value)} rows={4} placeholder="Relationship notes" aria-label="Relationship notes"/></div><div style={{display:"flex",gap:8,marginTop:12}}><button style={green} disabled={busy} onClick={()=>void savePerson()}>{busy?"Saving...":"Save Person"}</button><button style={btn} onClick={()=>setForm(null)}>Cancel</button></div>{error && <p style={{color:"#ffaaaa"}} role="alert">{error}</p>}</section></div>}
  </main>;
}
