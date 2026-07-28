import SummaryCards from "./SummaryCards";

const transactions = [
  {
    name: "Groceries",
    category: "Food",
    amount: "-$128.40",
  },
  {
    name: "Salary",
    category: "Income",
    amount: "+$3,200.00",
  },
  {
    name: "Streaming",
    category: "Entertainment",
    amount: "-$14.99",
  },
  {
    name: "Electric Bill",
    category: "Utilities",
    amount: "-$86.25",
  },
];

const budgets = [
  {
    name: "Food",
    spent: 72,
  },
  {
    name: "Transport",
    spent: 45,
  },
  {
    name: "Entertainment",
    spent: 58,
  },
];

const categories = [
  {
    name: "Housing",
    value: "$1,200",
  },
  {
    name: "Food",
    value: "$540",
  },
  {
    name: "Bills",
    value: "$290",
  },
  {
    name: "Savings",
    value: "$800",
  },
];

function Transactions() {
  return (
    <section className="panel">
      <h3>Recent Transactions</h3>

      {transactions.map((transaction) => (
        <div className="transaction" key={transaction.name}>
          <div>
            <strong>{transaction.name}</strong>
            <p>{transaction.category}</p>
          </div>

          <span>{transaction.amount}</span>
        </div>
      ))}
    </section>
  );
}

function BudgetProgress() {
  return (
    <section className="panel">
      <h3>Budget Progress</h3>

      {budgets.map((budget) => (
        <div className="progress" key={budget.name}>
          <label>
            <span>{budget.name}</span>
            <span>{budget.spent}%</span>
          </label>

          <div className="bar">
            <div className="fill" style={{ width: `${budget.spent}%` }} />
          </div>
        </div>
      ))}
    </section>
  );
}

function CategoryBreakdown() {
  return (
    <section className="panel" style={{ marginTop: "25px" }}>
      <h3>Category Breakdown</h3>

      {categories.map((category) => (
        <div className="transaction" key={category.name}>
          <span>{category.name}</span>
          <strong>{category.value}</strong>
        </div>
      ))}
    </section>
  );
}

function Dashboard() {
  return (
    <main className="dashboard">
      <h1>Welcome Back 👋</h1>

      <p>
        Here's an overview of your personal finances for this month.
      </p>

      <SummaryCards />

      <div className="content-grid">
        <Transactions />

        <div>
          <BudgetProgress />
          <CategoryBreakdown />
        </div>
      </div>
    </main>
  );
}

export default Dashboard;