const style = {
  fontSize: '12px',
  padding: '6px',
  borderRadius: '8px',
  color: '#3c5367',
  background: '#e9ecef',
};

export default function TextUI({ text }) {
  return <div style={style}>{text}</div>;
}
