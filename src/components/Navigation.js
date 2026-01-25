import './Navigation.css';
import { PAGES } from '../config/constants';
import { useConfig } from '../utils';

const NAV_ITEMS = Object.values(PAGES).filter(({ path }) => {
  if (['health-check'].includes(path)) {
    return false;
  }
  return true;
});

export default function Navigation() {
  const { navigate } = useConfig();
  return (
    <nav id="nav">
      {NAV_ITEMS.map(({ path, title }) => (
        <button key={path} onClick={() => navigate(path)}>
          {title}
        </button>
      ))}
    </nav>
  );
}
