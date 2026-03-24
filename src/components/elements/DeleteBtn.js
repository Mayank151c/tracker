import { useConfig } from '../../utils';

const style = {
  background: '#f34a',
  boxShadow: 'inset 0px 0px 10px red',
  border: '1px solid red',
  borderRadius: '8px',
  color: 'white',
  padding: '8px 10px 4px 10px',
  fontSize: '14px',
};

export default function DeleteBtn({ deleteOnClick, loading = false }) {
  const { deleteIcon } = useConfig();
  return (
    <button onClick={deleteOnClick} style={style} disabled={loading}>
      <img src={deleteIcon} alt="delete" width={20} height={24.5} />
    </button>
  );
}
