import { useEffect, useState } from "react";
import { monthList } from "../../common/constants/arrays-list/months";
import { IForSelect } from "../../common/interfaces/for-components/select.interface";
import { ICategoryResponse } from "../../common/interfaces/api-responses/categories.responses.interfaces";
import { findAllCategories } from "../../actions/categories.actions";
import { capitalizeFirstLetter } from "../../common/helpers/capitalize.methods.helper";
import { FormInstance } from "antd";
import { useNotification } from "../notifications/useNotification";
import {
  IBudgetResponse,
  IBudgetResponseWithDates,
} from "../../common/interfaces/api-responses/budget.responses.interfaces";
import {
  createBudget,
  deleteBudget,
  findAllBudgets,
  updateBudget,
} from "../../actions/budgets.actions";
import { FilterBudgetDto } from "../../common/interfaces/api-requests-dtos/filter-budget.dto";
import { formCreateBudget } from "../../common/interfaces/for-components/form-create-budget.interface";
import { useAsyncModal } from "../async-modal/useAsyncModal";
import { UpdateBudgetDto } from "../../common/interfaces/api-requests-dtos/update-budget.dto";
import { parseISO } from "date-fns";

export const useBudgets = () => {
  // budgets ----------------------------------------------------------------

  const [budgetFilters, setBudgetFilters] = useState<FilterBudgetDto>({});

  const [budgets, setBudgets] = useState<IBudgetResponseWithDates[]>([]);

  const handleCreateBudget = async (
    data: formCreateBudget,
    form: FormInstance
  ): Promise<void> => {
    let category: string;

    if (data.category === "other" && data.other_category)
      category = data.other_category.toLowerCase().trim();
    else category = data.category.toLowerCase().trim();

    const newBudgetRegistered = await handleBudgetFormModalOk(() =>
      createBudget({
        name: data.name,
        category_name: category,
        month: data.month,
        amount: data.amount,
      })
    );

    handleHiddenModal();

    form.resetFields();

    if (newBudgetRegistered === null) {
      openNotification(
        "error",
        "Error creating budget",
        "Possible causes\nA Budget with this name already exists.\nCheck your connection.\nPlease try again."
      );
      return;
    }

    // transform Dates from strings to Date in UTC
    const start_date = parseISO(newBudgetRegistered.start_date);
    const end_date = parseISO(newBudgetRegistered.end_date);
    const newBudgetRegisteredWithDate = {
      ...newBudgetRegistered,
      start_date,
      end_date,
    };
    setBudgets([newBudgetRegisteredWithDate, ...budgets]);
    openNotification("success", "Success", "Budget created successfully");
  };

  const handleFindAllBudgets = async (
    filterOptions: FilterBudgetDto
  ): Promise<void> => {
    const data = await findAllBudgets(filterOptions);
    if (data === null) {
      openNotification(
        "error",
        "Error",
        "Error retrieving data or filtered data\nCheck the filters applied.\nCheck your connection.\nPlease try again later"
      );
      return;
    }

    // transform Dates from strings to Date in UTC
    let dataWithDates: IBudgetResponseWithDates[] = [];
    if (data.length) {
      dataWithDates = data.map((budget) => {
        const start_date = parseISO(budget.start_date);
        const end_date = parseISO(budget.end_date);
        return { ...budget, start_date, end_date };
      });
    }

    setBudgets(dataWithDates);
  };

  const handleUpdateBudget = async (
    budgetToUpdate: IBudgetResponseWithDates,
    updateBudgetDto: UpdateBudgetDto,
    form: FormInstance,
    handleRequestUpdateBudget: (
      request: () => Promise<IBudgetResponse | null>
    ) => Promise<IBudgetResponse | null>
  ) => {
    const BudgetToUpdate = { ...budgetToUpdate };
    const updatedBudget = await handleRequestUpdateBudget(() =>
      updateBudget(budgetToUpdate.id, updateBudgetDto)
    );
    if (updatedBudget === null) {
      openNotification(
        "error",
        "Error updating budget",
        "Possible causes\nA Budget with this name already exists.\nCheck your connection.\nPlease try again."
      );
      // Return the fields to their previous value Why they weren't updated
      form.setFieldsValue({
        name: BudgetToUpdate.name,
        category: categories.find(
          (category) =>
            category.label.toLowerCase() === BudgetToUpdate.category.name
        )?.value,
        amount: BudgetToUpdate.amount,
        month: BudgetToUpdate.start_date.getUTCMonth(),
        other_category: undefined,
      });
      return;
    }

    // transform Dates from strings to Date
    const start_date = parseISO(updatedBudget.start_date as string);
    const end_date = parseISO(updatedBudget.end_date as string);

    const updatedBudgetWithDates: IBudgetResponseWithDates = {
      ...updatedBudget,
      start_date,
      end_date,
    };

    const updateBudgets = budgets.map((budget) => {
      if (budget.id !== BudgetToUpdate.id) return budget;
      return updatedBudgetWithDates;
    });

    if (updateBudgetDto.month)
      updateBudgets.sort((a, b) => {
        return a.start_date > b.start_date
          ? 1
          : a.start_date < b.start_date
          ? -1
          : 0;
      });
    setBudgets(updateBudgets);
    openNotification("success", "Success", "Budget data updated successfully");
  };

  const handleDeleteBudget = async (budget_id: string): Promise<void> => {
    const result = await deleteBudget(budget_id);

    if (result === null) {
      openNotification(
        "error",
        "Error deleting budget",
        "Check your connection.\nPlease try again."
      );
      return;
    }

    const updateBudgets = budgets.filter((budget) => budget.id !== budget_id);
    setBudgets(updateBudgets);
    openNotification("success", "Success", "Budget deleted successfully");
  };

  const handleBudgetFilters = (
    filter: keyof FilterBudgetDto,
    value: string | number
  ) => {
    setBudgetFilters({ ...budgetFilters, [filter]: value });
  };

  // Months -----------------------------------------------------------------
  const [monthListForSelect, setMonthListForSelect] = useState<IForSelect[]>(
    []
  );

  const monthForSelection = (): IForSelect[] => {
    const currentMonth = new Date().getUTCMonth();
    return monthList.filter((month) => (month.value as number) >= currentMonth);
  };

  // Categories ----------------------------------------------------------------

  const [categories, setCategories] = useState<IForSelect[]>([]);

  const getAndFormatCategories = async () => {
    try {
      const data = await findAllCategories();
      if (!data || !data.length) return;

      const formattedDataForSelect = data.map(
        (category: ICategoryResponse) => ({
          value: category.name,
          label: capitalizeFirstLetter(category.name),
        })
      );
      setCategories(formattedDataForSelect);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
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

  const [hiddenOtherCategory, setHiddenOtherCategory] = useState(true);

  const handleOtherCategory = (
    category_selected: string,
    form: FormInstance
  ) => {
    if (category_selected === "other") {
      setHiddenOtherCategory(false);
    } else {
      if (hiddenOtherCategory === false) {
        setHiddenOtherCategory(true);

        // clean other_category value - field
        // so that it "forgets" that field in its internal state.
        // to prevent you from validating it erroneously even if
        // another category is selected
        form.setFieldsValue({ other_category: undefined });
      }
    }
  };

  const handleBudgetFormModalOk = async (
    request: () => Promise<IBudgetResponse | null>
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
    setMonthListForSelect(monthForSelection());
  }, []);

  useEffect(() => {
    getAndFormatCategories();
  }, [budgets]);

  useEffect(() => {
    handleFindAllBudgets(budgetFilters);
  }, [budgetFilters]);

  return {
    // properties
    budgets,
    monthListForSelect,
    categories,
    openModal,
    modalLoading,
    hiddenOtherCategory,

    // context
    NotificationContextHolder,

    // methods
    handleCreateBudget,
    handleFindAllBudgets,
    handleUpdateBudget,
    handleDeleteBudget,
    handleBudgetFilters,
    handleShowModal,
    handleHiddenModal,
    handleOtherCategory,
  };
};
