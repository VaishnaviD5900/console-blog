export default function Blobs() {
  return (
    <>
      <div style={{
        position: 'fixed', borderRadius: '50%',
        filter: 'blur(120px)', pointerEvents: 'none', zIndex: 0,
        width: 500, height: 500,
        background: 'rgba(124,106,247,0.12)',
        top: -150, right: -100,
      }} />
      <div style={{
        position: 'fixed', borderRadius: '50%',
        filter: 'blur(120px)', pointerEvents: 'none', zIndex: 0,
        width: 400, height: 400,
        background: 'rgba(45,212,191,0.08)',
        bottom: 100, left: -100,
      }} />
    </>
  )
}
