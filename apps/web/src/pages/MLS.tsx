const MLS = () => {
  return (
    <div style={{minHeight:"100vh", background:"#060916", color:"#EAF0FF", padding:"28px", fontFamily:"system-ui, -apple-system, Segoe UI, Roboto, sans-serif"}}>
      <div style={{maxWidth:720, margin:"0 auto"}}>
        <div style={{opacity:0.8, fontSize:14, marginBottom:10}}>Invention Planet • Origin Concept: Chelsea Rule</div>
        <h1 style={{fontSize:42, lineHeight:1.05, margin:"0 0 12px 0"}}>MLS</h1>
        <h2 style={{fontSize:22, fontWeight:600, margin:"0 0 18px 0", opacity:0.9}}>Parenting Signal Infrastructure</h2>

        <div style={{fontSize:16, opacity:0.85, lineHeight:1.5, marginBottom:22}}>
          A wearable-linked concept for behavioral awareness + calm guidance — pattern visibility, not control.
          This is a concept page to preserve origin and show the vision.
        </div>

        <div style={{display:"flex", gap:12, flexWrap:"wrap", marginBottom:18}}>
          <a href="/planets" style={{padding:"12px 16px", borderRadius:14, background:"#1E2A5E", color:"#fff", textDecoration:"none", fontWeight:700}}>
            Go to Planets Registry →
          </a>
          <a href="/" style={{padding:"12px 16px", borderRadius:14, border:"1px solid rgba(255,255,255,.18)", color:"#EAF0FF", textDecoration:"none", fontWeight:700}}>
            Home →
          </a>
        </div>

        <div style={{opacity:0.55, fontSize:13}}>
          Note: This page is intentionally minimal to guarantee stability on mobile while we polish the full MLS layout.
        </div>
      </div>
    </div>
  );
};

export default MLS;
