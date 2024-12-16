import { Button, Popconfirm } from "antd";
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";
import { IBudgetCard } from "../../../constants/interfaces/for-components/budget-card.interface";
import { capitalizeFull } from "../../../constants/helpers/capitalize.methods";
import { monthList } from "../../../constants/arrays-list/months";

export const BudgetCard = ({
  budget,
  updateFunction,
  deleteFunction,
}: IBudgetCard) => {
  const year = (budget.start_date as Date).getUTCFullYear();
  const category_name = budget.category.name;
  const indexMonth = (budget.start_date as Date).getUTCMonth();
  const month_name = monthList[indexMonth].label;
  const formatedDate = `${month_name}/${year}`;

  return (
    <div className={styles.budgetCardContainer}>
      <div className={styles.budgetCardContainerInfo}>
        <h4>{budget.name}</h4>
        <h5>{capitalizeFull(category_name)}</h5>
        <h5>{formatedDate}</h5>
      </div>
      <div className={styles.budgetCardContainerStatus}>
        <h4>{budget.status}</h4>
      </div>
      <div className={styles.budgetCardContainerButtons}>
        <Button
          className={styles.editButton}
          type="primary"
          icon={<FormOutlined />}
          iconPosition="end"
          onClick={() => {}}
        ></Button>
        <Popconfirm
          title={`Delete budget: ${budget.name}`}
          description="Are you sure to delete this budget?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => {
            deleteFunction(budget.id);
          }}
          placement="bottom"
        >
          <Button
            className={styles.deleteButton}
            type="primary"
            icon={<DeleteOutlined />}
            iconPosition="end"
            onClick={() => {}}
          ></Button>
        </Popconfirm>
      </div>
    </div>
  );
};
