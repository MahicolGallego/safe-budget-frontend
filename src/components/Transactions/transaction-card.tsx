import { Button, Card, Form, Popconfirm, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";
import { monthList } from "../../common/constants/arrays-list/months";
import { ITransactionCard } from "../../common/interfaces/for-components/transaction-card.interface";
import { formatCurrencyString } from "../../common/helpers/formatter-currency-string.helper";

const { Item } = Form;
const { Title, Text } = Typography;

export const TransactionCard = ({
  budget,
  transaction,
  transactionDeleteFunction,
}: ITransactionCard) => {
  // variables ----------------------------------------------------------------
  const day = transaction.date.getUTCDate();
  const indexMonth = transaction.date.getUTCMonth();
  const month_name = monthList[indexMonth].label;
  const formattedDate = `${day}/${month_name}`;
  const amount = formatCurrencyString(transaction.amount);

  const hiddenAndDisabledElement = budget.status === "active" ? false : true;

  return (
    <>
      <div className={styles.transactionCardContainer}>
        <Card
          className={styles.transactionCard}
          title={transaction.description}
          bordered={false}
          style={{ width: "100%" }}
        >
          <Title level={4}>{amount}</Title>

          <Text>{formattedDate}</Text>
        </Card>
        <div
          className={styles.transactionCardContainerButtons}
          hidden={hiddenAndDisabledElement}
        >
          <Popconfirm
            title={`Delete transaction`}
            description="Are you sure to delete this transaction?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => {
              transactionDeleteFunction(transaction.id);
            }}
            placement="bottom"
            disabled={hiddenAndDisabledElement}
          >
            <Button
              className={styles.deleteButton}
              type="primary"
              icon={<DeleteOutlined />}
              iconPosition="end"
              disabled={hiddenAndDisabledElement}
            ></Button>
          </Popconfirm>
        </div>
      </div>
    </>
  );
};
