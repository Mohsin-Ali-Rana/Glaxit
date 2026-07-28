const summary = [
  {
    title: "Total Balance",
    value: "$24,850",
  },
  {
    title: "Income",
    value: "$8,200",
  },
  {
    title: "Expenses",
    value: "$3,450",
  },
  {
    title: "Savings",
    value: "$4,750",
  },
];

function SummaryCards() {
  return (
    <section className="summary-grid">
      {summary.map((card, index) => (
        <div className="card" key={index}>
          <h4>{card.title}</h4>

          <h2>{card.value}</h2>
        </div>
      ))}
    </section>
  );
}

export default SummaryCards;