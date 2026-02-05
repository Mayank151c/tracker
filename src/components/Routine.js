import RoutineList from './RoutineList';

const routines = {
  hydrate: true,
};
const allRoutinesDisabled = Object.values(routines).filter((item) => item).length === 0;

export default function Routine() {
  return (
    <div className="tasks-section">
      <h2>Routine</h2>
      {routines.hydrate && <RoutineList />}
      {allRoutinesDisabled && <div id="empty-list">No routine tasks setup</div>}
    </div>
  );
}
