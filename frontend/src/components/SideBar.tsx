import styles from './SideBar.module.css';
import { Link } from 'react-router-dom';

interface SideBarProps {
  isSidebarOpen?: boolean;
}

const SideBar: React.FC<SideBarProps> = ({ isSidebarOpen }) => {
  return (
    /* Sidebar */
    <aside
      className={`${styles.sidebar} relative z-50 w-[250px] flex-shrink-0 transform transition-transform duration-250 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <nav className="space-y-4">
        <Link to="/main">Dashboard</Link>
        <Link to="/mappings">Mappings</Link>
        <Link to="/routines">Routines</Link>
        <Link to="/TBA">TBA</Link>
      </nav>
    </aside>
  );
};

export default SideBar;
