import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Typography,
} from "antd";
import {
  CloseOutlined,
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
} from "@ant-design/icons";
import styles from "./styles.module.css";
import { monthList } from "../../common/constants/arrays-list/months";
import { ITransactionCard } from "../../common/interfaces/for-components/transaction-card.interface";
import { formatCurrencyString } from "../../common/helpers/formatter-currency-string.helper";
import { ITransactionResponse } from "../../common/interfaces/api-responses/transaction.responses.interfaces";
import { UpdateTransactionDto } from "../../common/interfaces/api-requests-dtos/update-transaction.dto";
import { useAsyncModal } from "../../hooks/async-modal/useAsyncModal";
import { formCreateTransaction } from "../../common/interfaces/for-components/form-create-transaction.interface";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { formatterPickerDate } from "../../common/helpers/formatter-picker-date.helper";
import { dayjsDateFormat } from "../../common/constants/variables/dayjs-date-format";
import { formatInputCurrencyString } from "../../common/helpers/formatter-input-currency-string.helper";

dayjs.extend(customParseFormat);
// set so that set the dates in UTC format
dayjs.extend(utc);

type transactionFormKeys = keyof formCreateTransaction;
const { Item } = Form;
const { Title, Text } = Typography;

export const TransactionCard = ({
  budget,
  transaction,
  transactionUpdateFunction,
  transactionDeleteFunction,
}: ITransactionCard) => {
  // variables ----------------------------------------------------------------
  const day = transaction.date.getUTCDate();
  const indexMonth = transaction.date.getUTCMonth();
  const month_name = monthList[indexMonth].label;
  const formattedDate = `${day}/${month_name}`;
  const amount = formatCurrencyString(transaction.amount);
  const hiddenAndDisabledElement = budget.status === "active" ? false : true;

  const datePeakerMaxDate = () => {
    const currentDate = new Date();

    if (currentDate.getTime() < budget.end_date.getTime()) {
      return formatterPickerDate(currentDate);
    }

    return formatterPickerDate(budget.end_date);
  };

  // form ----------------------------------------------------------------
  const [form] = Form.useForm();

  // transaction ----------------------------------------------------------------
  const handleUpdateTransaction = async (key: transactionFormKeys) => {
    let value = form.getFieldValue(key);

    // convert date form day js to Date in UTC
    if (key === "date") {
      value = dayjs.utc(value).toDate();
      value.setUTCHours(0, 0, 0);
      console.log(value.getTime() === transaction.date.getTime());
      if (value.getTime() === transaction.date.getTime()) return;
    }

    if (value === transaction[key]) return;

    const updateTransactionDto: UpdateTransactionDto = {
      budget_id: transaction.budget_id,
      [key]: value,
    };

    await transactionUpdateFunction(
      transaction,
      updateTransactionDto,
      form,
      handleRequestUpdateTransaction
    );
  };

  const handleRequestUpdateTransaction = async (
    request: () => Promise<ITransactionResponse | null>
  ): Promise<ITransactionResponse | null> => {
    setModalLoading(true);
    const result = await request();
    setModalLoading(false);
    return result;
  };

  // modal
  const {
    openModal,
    modalLoading,
    handleShowModal,
    handleHiddenModal,
    setModalLoading,
  } = useAsyncModal();

  return (
    <>
      <div className={styles.transactionCardContainer}>
        <Card
          className={styles.transactionCard}
          title={transaction.description}
          bordered={false}
          style={{ width: "100%" }}
          onClick={handleShowModal}
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
      {/*Transaction update form Modal*/}
      <Modal
        open={openModal}
        title="Edit Expense"
        closeIcon={false}
        style={{ top: 50 }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              handleHiddenModal();
            }}
            icon={<CloseOutlined />}
            loading={modalLoading}
            danger
          >
            {modalLoading ? "Updating" : "Close"}
          </Button>,
        ]}
      >
        {/*Transaction update form*/}
        <Form
          form={form}
          name={`form-update-transaction:${transaction.id}`}
          layout="vertical"
          initialValues={{
            description: transaction.description,
            amount: transaction.amount,
            date: dayjs(formatterPickerDate(transaction.date), dayjsDateFormat),
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
              onBlur={async () => {
                try {
                  // validate if the new value of the field is valid
                  // before continuing with the request so as not to
                  // perform innecesary request
                  await form.validateFields(["description"]);

                  // try update budget if the validate field is ok
                  handleUpdateTransaction("description");
                } catch (error) {
                  console.log("Field validation failed:", error);
                }
              }}
              disabled={hiddenAndDisabledElement}
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
              parser={(value) => value?.replace(/,/g, "") as unknown as number}
              precision={2}
              addonBefore={<DollarOutlined />}
              onBlur={async () => {
                try {
                  await form.validateFields(["amount"]);
                  handleUpdateTransaction("amount");
                } catch (error) {
                  console.log("Field validation failed:", error);
                }
              }}
              disabled={hiddenAndDisabledElement}
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
              minDate={dayjs(
                formatterPickerDate(budget.start_date),
                dayjsDateFormat
              )}
              maxDate={dayjs(datePeakerMaxDate(), dayjsDateFormat)}
              placement="bottomRight"
              onChange={() => handleUpdateTransaction("date")}
              disabled={hiddenAndDisabledElement}
            />
          </Item>
        </Form>
      </Modal>
    </>
  );
};
