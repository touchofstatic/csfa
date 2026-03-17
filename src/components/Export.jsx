import { useContext } from 'react';
import { ManagerContext } from './Contexts';

export default function Export() {
  const { lists, items } = useContext(ManagerContext);

  function exportData() {
    // file object
    const file = new Blob(
      [JSON.stringify({ lists: lists, items: items })],
      {
        type: 'application/json',
      },
    );
    // anchor link
    const element = document.createElement('a');
    element.href = URL.createObjectURL(file);
    element.download = 'csfa-' + Date.now() + '.json';
    // simulate link click
    document.body.appendChild(element);
    // Required for this to work in FireFox
    element.click();
  }

  return (
    <button
      size-="small"
      value="export"
      onClick={exportData}
      className={`active:bg-[var(--color1)]`}
    >
      Export
    </button>
  );
}
