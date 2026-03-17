import Export from './Export';
import Import from './Import';
import Themes from './Themes';

export default function Navbar() {
  return (
    <nav className="w-full bg-[var(--foreground0)]">
      <Export />
      <Import />
      <Themes />
    </nav>
  );
}
