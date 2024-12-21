import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Typography,
} from "antd";
import { LoadingSpinner } from "../../../components/share/loading";
import { useBudgetDetail } from "../../../hooks/budget-detail/useBudgetDetail";
import styles from "./style.module.css";
import {
  CalendarOutlined,
  CloseOutlined,
  DollarOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  capitalizeFirstLetter,
  capitalizeFull,
} from "../../../common/helpers/capitalize.methods.helper";
import { monthList } from "../../../common/constants/arrays-list/months";
import { formatCurrencyString } from "../../../common/helpers/formatter-currency-string.helper";
import { formatInputCurrencyString } from "../../../common/helpers/formatter-input-currency-string.helper";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { formatterPickerDate } from "../../../common/helpers/formatter-picker-date.helper";
import { TransactionList } from "../../../components/Transactions/Transaction-list";
import { monthDays } from "../../../common/constants/arrays-list/month-days";
import { amountRange } from "../../../common/constants/arrays-list/amount-range";

dayjs.extend(customParseFormat);

const dateFormat = "YYYY-MM-DD";

const { Title, Text } = Typography;
const { Item } = Form;

const BudgetDetail = () => {
  const [form] = Form.useForm(); // Instancia del formulario

  // budget details
  const {
    //Properties
    budget,
    transactions,
    requesting,
    openModal,
    modalLoading,

    //Context
    NotificationContextHolder,

    //Methods
    handleCreateTransactions,
    handleDeleteTransaction,
    handleTransactionFilters,
    handleShowModal,
    handleHiddenModal,
  } = useBudgetDetail();

  // variables ----------------------------------------------------------------
  const year = budget.start_date.getUTCFullYear();
  const indexMonth = budget.start_date.getUTCMonth();
  const month_name = monthList[indexMonth].label;
  const formatedDate = `${month_name}/${year}`;
  const formattedAmount = formatCurrencyString(budget.amount);
  const daysForSelect = monthDays.filter(
    (day) => (day.value as number) <= budget.end_date.getUTCDate()
  );

  const datePeakerMinDate = () => {
    return formatterPickerDate(budget.start_date);
  };

  const datePeakerMaxDate = () => {
    const currentDate = new Date();

    if (currentDate.getTime() < budget.end_date.getTime()) {
      return formatterPickerDate(currentDate);
    }

    return formatterPickerDate(budget.end_date);
  };

  return (
    <>
      {/*Assign the context where notifications will be rendered*/}
      {NotificationContextHolder}

      {requesting ? (
        <LoadingSpinner />
      ) : (
        budget.id && (
          <>
            <div className={styles.budgetDetailContainer}>
              {/*Budget details*/}
              <div className={styles.budgetContainer}>
                <div className={styles.budgetDetails}>
                  <div className={styles.budgetTitle}>
                    <Title level={4}>{`${
                      budget.name
                    } - $${formattedAmount} - ${capitalizeFirstLetter(
                      budget.status
                    )}`}</Title>
                    <Button
                      className={styles.createBudgetButton}
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleShowModal}
                      disabled={budget.status !== "active" ? true : false}
                    >
                      Add expense
                    </Button>
                  </div>
                  <Title level={5} style={{ marginTop: 0, marginBottom: 0 }}>
                    {capitalizeFull(budget.category.name)}
                  </Title>
                  <Title level={5} style={{ marginTop: 0 }}>
                    {formatedDate}
                  </Title>
                  <Text
                    style={{ fontSize: 12, color: "gray" }}
                    hidden={budget.status !== "active" ? false : true}
                  >
                    You can't create, update, or delete expenses in Budget that
                    your status is pending or completed
                  </Text>
                </div>
                <div className={styles.budgetExpensesContainer}>
                  <Title level={4}>Expenses</Title>
                </div>
              </div>
              {/*Budget charts*/}
              <div className={styles.budgetChartContainer}>
                <Title level={4}>Charts</Title>
              </div>
            </div>
            {/*Transaction creation form Modal*/}
            <Modal
              open={openModal}
              title="Add a new expense"
              closeIcon={false}
              style={{ top: 50 }}
              footer={[
                <Button
                  key="back"
                  onClick={() => {
                    handleHiddenModal();
                    form.resetFields();
                  }}
                  icon={<CloseOutlined />}
                  danger
                >
                  Cancel
                </Button>,
                <Button
                  className={styles.createBudgetButton}
                  key="submit"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={modalLoading}
                  form="form-create-transaction"
                  type="primary"
                >
                  Add
                </Button>,
              ]}
            >
              {/*Transaction creation form*/}
              <Form
                form={form}
                name="form-create-transaction"
                layout="vertical"
                onFinish={(data) => {
                  handleCreateTransactions(data, form);
                }}
              >
                <Item
                  name="description"
                  label="Description"
                  rules={[
                    {
                      min: 3,
                      message: "Name should be at least 3 characters long!",
                    },
                    {
                      max: 25,
                      message: "Name should have maximun 25 characters long!",
                    },
                  ]}
                >
                  <Input
                    placeholder="description..."
                    addonBefore={<EditOutlined />}
                  />
                </Item>
                <Item
                  name="amount"
                  label="Amount"
                  rules={[
                    {
                      required: true,
                      message: "the amount is required!",
                    },
                    {
                      type: "number",
                      min: 0.1,
                      message: "Minimum amount must be at least 0.1",
                    },
                  ]}
                >
                  <InputNumber<number>
                    style={{ width: 200 }}
                    max={99999999.99}
                    step={1}
                    onChange={() => {}}
                    formatter={formatInputCurrencyString}
                    parser={(value) =>
                      value?.replace(/,/g, "") as unknown as number
                    }
                    precision={2}
                    addonBefore={<DollarOutlined />}
                  />
                </Item>
                <Item
                  label="date"
                  className={styles.input}
                  name="date"
                  rules={[
                    {
                      required: true,
                      message: "Please assign a date!",
                    },
                  ]}
                >
                  <DatePicker
                    minDate={dayjs(datePeakerMinDate(), dateFormat)}
                    maxDate={dayjs(datePeakerMaxDate(), dateFormat)}
                    placement="bottomRight"
                  />
                </Item>
              </Form>
            </Modal>
            {/*Filters fields*/}
            <Space wrap>
              <Space direction="vertical" size="small">
                <Text>
                  <CalendarOutlined style={{ marginRight: 3 }} />
                  min day
                </Text>
                <Select
                  style={{ width: 120 }}
                  options={[{ value: 0, label: "..." }, ...daysForSelect]}
                  onChange={(value: number) => {
                    handleTransactionFilters("min_day", value);
                  }}
                />
              </Space>
              <Space direction="vertical" size="small">
                <Text>
                  <CalendarOutlined style={{ marginRight: 3 }} />
                  max day
                </Text>
                <Select
                  style={{ width: 120 }}
                  options={[{ value: 0, label: "..." }, ...daysForSelect]}
                  onChange={(value: number) => {
                    handleTransactionFilters("max_day", value);
                  }}
                />
              </Space>
              <Space direction="vertical" size="small">
                <Text>
                  <DollarOutlined style={{ marginRight: 3 }} />
                  min amount
                </Text>
                <Select
                  style={{ width: 120 }}
                  options={[{ value: 0, label: "..." }, ...amountRange]}
                  onChange={(value: number) => {
                    handleTransactionFilters("min_amount", value);
                  }}
                />
              </Space>
              <Space direction="vertical" size="small">
                <Text>
                  <DollarOutlined style={{ marginRight: 3 }} />
                  max amount
                </Text>
                <Select
                  style={{ width: 120 }}
                  options={[{ value: 0, label: "..." }, ...amountRange]}
                  onChange={(value: number) => {
                    handleTransactionFilters("max_amount", value);
                  }}
                />
              </Space>
            </Space>
            {/*Budgets list*/}
            {transactions.length > 0 && (
              <div className={styles.budgetExpensesContainer}>
                <TransactionList
                  // set a new list instead of give the references in memory
                  budget={budget}
                  transactions={transactions}
                  transactionDeleteFunction={handleDeleteTransaction}
                />
              </div>
            )}
          </>
        )
      )}
    </>
  );
};

export default BudgetDetail;
