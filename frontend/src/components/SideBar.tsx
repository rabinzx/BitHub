import styles from './SideBar.module.css';

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
        <a href="#" >
          Home
        </a>
        <a href="#" >
          About
        </a>
        <a href="#" >
          Services
        </a>
        <a href="#" >
          Contact
        </a>
      </nav>
    </aside>
  );
};

export default SideBar;
