import { Button, Select, Space } from "antd";
import styles from "./style.module.css";
import { PlusOutlined } from "@ant-design/icons";
import { useBudgets } from "../../../hooks/budgets/useBudgets";
import { budgetStatus } from "../../../constants/arrays-list/budget-status";
import { BudgetList } from "../../../components/share/Budgets/budget-list";
import { BudgetCard } from "../../../components/share/Budgets/budget-card";

const Budgets = () => {
  const { monthListForSelect, categories } = useBudgets();

  return (
    <div className={styles.budgetsContainer}>
      <div className={styles.titleContainer}>
        <h2>Budgets</h2>
        <Button
          className={styles.createBudgetButton}
          type="primary"
          icon={<PlusOutlined />}
        >
          Create
        </Button>
      </div>
      <div>
        <Space wrap>
          <Select
            defaultValue={""}
            style={{ width: 120 }}
            onChange={() => {}}
            options={monthListForSelect}
          />

          <Select
            className="s"
            defaultValue={""}
            style={{ width: 120 }}
            onChange={() => {}}
            options={budgetStatus}
          />

          <Select
            defaultValue={""}
            style={{ width: 120 }}
            onChange={() => {}}
            options={categories}
          />
        </Space>
      </div>
      <div className={styles.BudgetsContainer}>
        <BudgetCard />
        <BudgetCard />
        <BudgetCard />
        <BudgetCard />
        <BudgetCard />
        <BudgetCard />
      </div>
    </div>
  );
};

export default Budgets;
