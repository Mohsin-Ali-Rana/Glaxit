function Sidebar() {
  const menuItems = [
    "Dashboard",
    "Transactions",
    "Budgets",
    "Analytics",
    "Goals",
    "Reports",
    "Settings",
  ];

  return (
    <aside className="sidebar">
      <h2 className="logo">💰 FinTrack</h2>

      <div className="menu">
        {menuItems.map((item, index) => (
          <button key={index}>{item}</button>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;