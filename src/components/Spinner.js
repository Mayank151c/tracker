import './Spinner.css';

export default function Spinner(props) {
  return (
    <>
      {props.loading ? (
        <span className="button-content">
          <span className="spinner" />
          Loading...
        </span>
      ) : (
        props.children
      )}
    </>
  );
}
