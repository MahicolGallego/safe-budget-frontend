import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { findOneBudget } from "../../actions/budgets.actions";
import { IBudgetResponseWithDates } from "../../common/interfaces/api-responses/budget.responses.interfaces";
import { useNotification } from "../notifications/useNotification";
import { parseISO } from "date-fns";
import { budgetStatus } from "../../common/constants/enums/budget-status.enum";
import { formCreateTransaction } from "../../common/interfaces/for-components/form-create-transaction.interface";
import { FormInstance } from "antd";
import {
  createTransaction,
  deleteTransaction,
  findAllTransactions,
  updateTransaction,
} from "../../actions/transactions.actions";
import { useAsyncModal } from "../async-modal/useAsyncModal";
import {
  ITransactionResponse,
  ITransactionResponseWithDate,
} from "../../common/interfaces/api-responses/transaction.responses.interfaces";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import { FilterTransactionDto } from "../../common/interfaces/api-requests-dtos/filter-transaction.dto";
import { UpdateTransactionDto } from "../../common/interfaces/api-requests-dtos/update-transaction.dto";
import { formatterPickerDate } from "../../common/helpers/formatter-picker-date.helper";
import { dayjsDateFormat } from "../../common/constants/variables/dayjs-date-format";

dayjs.extend(customParseFormat);
// set so that set the dates in UTC format
dayjs.extend(utc);

const initialValues = {
  id: "",
  name: "",
  category: { id: "", name: "", user_id: "" },
  amount: 0,
  end_date: new Date(),
  start_date: new Date(),
  status: budgetStatus.PENDING,
};

export const useBudgetDetail = () => {
  const navigate = useNavigate();

  // request state ---------------------------------------------------
  const [requesting, setRequesting] = useState(false);

  // params ----------------------------------------------------------
  const { budget_id } = useParams();

  // budget
  const [budget, setBudget] = useState<IBudgetResponseWithDates>(initialValues);

  const getBudget = async (budget_id: string) => {
    setRequesting(true);
    const budget = await findOneBudget(budget_id);
    setRequesting(false);
    if (!budget) {
      openNotification("error", "Budget not found", "Budget data not found");
      return setTimeout(() => {
        navigate("/app/budgets");
      }, 5000);
    }
    // transform Dates from strings to Date in UTC
    const start_date = parseISO(budget.start_date);
    const end_date = parseISO(budget.end_date);

    const budgetWithDates = { ...budget, start_date, end_date };

    setBudget(budgetWithDates);
  };

  // transactions --------------------------------------------------------

  const [transactions, setTransactions] = useState<
    ITransactionResponseWithDate[]
  >([]);

  const [transactionFilters, setTransactionFilters] =
    useState<FilterTransactionDto>({});

  const handleCreateTransactions = async (
    data: formCreateTransaction,
    form: FormInstance
  ): Promise<void> => {
    // convert date form day js to Date in UTC
    const dateUTC = dayjs.utc(data.date).toDate();
    dateUTC.setUTCHours(0, 0, 0);
    const newTransactionRegistered = await handleTransactionFormModalOk(() =>
      createTransaction({
        ...data,
        date: dateUTC,
        budget_id: budget.id,
      })
    );

    handleHiddenModal();

    form.resetFields();

    if (newTransactionRegistered === null) {
      openNotification(
        "error",
        "Error recording expense",
        "Check your connection.\nPlease try again later."
      );
      return;
    }

    const dateWithDate = parseISO(newTransactionRegistered.date);
    const newTransactionRegisteredWithDate = {
      ...newTransactionRegistered,
      date: dateWithDate,
    };
    const UpdateTransactions = [
      newTransactionRegisteredWithDate,
      ...transactions,
    ];

    // sort the list
    if (UpdateTransactions.length > 1)
      UpdateTransactions.sort((a, b) => b.date.getTime() - a.date.getTime());

    setTransactions(UpdateTransactions);
    openNotification("success", "Success", "Budget created successfully");
  };

  const handleFindAllTransactions = async (): Promise<void> => {
    const data = await findAllTransactions(budget.id, transactionFilters);
    if (data === null) {
      openNotification(
        "error",
        "Error",
        "Error retrieving data or filtered data.\nCheck the filters applied.\nCheck your connection.\nPlease try again later"
      );
      return;
    }

    // transform Dates from strings to Date in UTC
    let dataWithDates: ITransactionResponseWithDate[] = [];
    if (data.length) {
      dataWithDates = data.map((transaction) => {
        const date = parseISO(transaction.date);
        return { ...transaction, date };
      });

      //sort transactions
      if (dataWithDates.length > 1) {
        dataWithDates.sort((a, b) => b.date.getTime() - a.date.getTime());
      }
    }

    setTransactions(dataWithDates);
  };

  const handleUpdateTransaction = async (
    transactionToUpdate: ITransactionResponseWithDate,
    updateTransactionDto: UpdateTransactionDto,
    form: FormInstance,
    handleRequestUpdateTransaction: (
      request: () => Promise<ITransactionResponse | null>
    ) => Promise<ITransactionResponse | null>
  ) => {
    const updatedTransaction = await handleRequestUpdateTransaction(() =>
      updateTransaction(transactionToUpdate.id, updateTransactionDto)
    );

    if (updatedTransaction === null) {
      openNotification(
        "error",
        "Error updating transaction",
        "Check your connection.\nPlease try again."
      );
      // Return the fields to their previous value Why they weren't updated
      form.setFieldsValue({
        date: dayjs(
          formatterPickerDate(transactionToUpdate.date),
          dayjsDateFormat
        ),
        amount: transactionToUpdate.amount,
        description: transactionToUpdate.description,
      });
      return;
    }

    // transform Dates from strings to Date
    const dateWithDate = parseISO(updatedTransaction.date);

    const updatedTransactionWithDate = {
      ...updatedTransaction,
      date: dateWithDate,
    };

    const updateTransactions = transactions.map((transaction) => {
      if (transaction.id === transactionToUpdate.id) {
        return updatedTransactionWithDate;
      }
      return transaction;
    });

    //sort transactions
    if (updateTransactionDto.date && updateTransactions.length > 1)
      updateTransactions.sort((a, b) => b.date.getTime() - a.date.getTime());

    setTransactions(updateTransactions);
    openNotification("success", "Success", "Transaction updated successfully");
  };

  const handleDeleteTransaction = async (
    transaction_id: string
  ): Promise<void> => {
    const result = await deleteTransaction(transaction_id, budget.id);

    if (result === null) {
      openNotification(
        "error",
        "Error deleting transaction",
        "Check your connection.\nPlease try again."
      );
      return;
    }

    const updateTransactions = transactions.filter(
      (transaction) => transaction.id !== transaction_id
    );
    setTransactions(updateTransactions);
    openNotification("success", "Success", "transaction deleted successfully");
  };

  const handleTransactionFilters = (
    filter: keyof FilterTransactionDto,
    value: number
  ) => {
    setTransactionFilters({ ...transactionFilters, [filter]: value });
  };
  // modal ----------------------------------------------------------------

  const {
    openModal,
    modalLoading,
    handleShowModal,
    handleHiddenModal,
    setModalLoading,
  } = useAsyncModal();

  // form ----------------------------------------------------------------

  const handleTransactionFormModalOk = async (
    request: () => Promise<ITransactionResponse | null>
  ) => {
    setModalLoading(true);
    const result = await request();
    setModalLoading(false);
    return result;
  };

  // notifications ----------------------------------------------------------------

  const { NotificationContextHolder, openNotification } = useNotification();

  // useEffect ----------------------------------------------------------------

  useEffect(() => {
    if (budget_id) getBudget(budget_id);
    else {
      openNotification("error", "Data error", "Budget ID not provided");
      setTimeout(() => {
        navigate("/app/budgets");
      }, 5000);
    }
  }, []);

  useEffect(() => {
    if (budget.id) handleFindAllTransactions();
  }, [budget, transactionFilters]);

  return {
    //properties
    budget,
    transactions,
    requesting,
    openModal,
    modalLoading,

    // context
    NotificationContextHolder,

    //methods
    handleCreateTransactions,
    handleUpdateTransaction,
    handleDeleteTransaction,
    handleTransactionFilters,
    handleShowModal,
    handleHiddenModal,
  };
};
