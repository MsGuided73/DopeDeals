export default function PopularSetupsSection() {
  return (
    <section style={{ background: '#ffffff', padding: '60px 0 0px', position: 'relative' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '44px', padding: '0 16px' }}>
        <div style={{ height: '4px', width: '48px', background: 'transparent', borderTop: '1px solid #1B7A4D', borderBottom: '1px solid #1B7A4D', margin: '0 auto 14px' }} />
        <h2 style={{ fontFamily: "'BebasNeue','Bebas Neue',sans-serif", color: '#1c1208', fontSize: 'clamp(32px,5vw,64px)', lineHeight: 1, letterSpacing: '0.02em', margin: 0 }}>
          POPULAR SETUPS
        </h2>
        <p style={{ fontSize: '15px', color: '#6B7280', margin: '10px 0 0', maxWidth: '500px', marginInline: 'auto', lineHeight: 1.5 }}>
          Curated for Convenience
        </p>
        <div style={{ borderTop: '1px dashed rgba(20,92,60,0.4)', margin: '20px auto 0', maxWidth: '360px' }} />
      </div>

      <div className="w-full">
        <img 
          src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Bundles/Popular%20Setups%20for%20Home%20Page.png" 
          alt="Popular Setups - Curated for Convenience" 
          className="w-full h-auto object-cover block"
        />
      </div>
    </section>
  );
}
