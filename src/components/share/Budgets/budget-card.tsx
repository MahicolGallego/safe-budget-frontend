import React from "react";
import { IBudgetResponse } from "../../../constants/interfaces/api-responses/budget.responses.interfaces";
import { Button } from "antd";
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";

export const BudgetCard = () => {
  return (
    <div className={styles.budgetCardContainer}>
      <div className={styles.budgetCardContainerInfo}>
        <h4>budget 1</h4>
        <h5>Food</h5>
        <h5>May/2025</h5>
      </div>
      <div className={styles.budgetCardContainerStatus}>
        <h4>active</h4>
      </div>
      <div className={styles.budgetCardContainerButtons}>
        <Button
          className={styles.editButton}
          type="primary"
          icon={<FormOutlined />}
          iconPosition="end"
        >
          edit
        </Button>

        <Button
          className={styles.deleteButton}
          type="primary"
          icon={<DeleteOutlined />}
          iconPosition="end"
        >
          delete
        </Button>
      </div>
    </div>
  );
};
