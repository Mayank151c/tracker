import './ErrorSection.css';

export default function ErrorSection({ error }) {
  return (
    <>
      {error && (
        <>
          <div id="error" style={{ whiteSpace: 'pre-wrap' }}>
            {error}
          </div>
          <div id="progress" />
        </>
      )}
    </>
  );
}
