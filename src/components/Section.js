import './Section.css';

export default function Section(props) {
  return <div className={props.horizontal ? 'horizontal-section' : 'vertical-section'}>{props.children}</div>;
}
