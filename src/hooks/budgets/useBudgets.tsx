import React, { useEffect, useState } from "react";
import { monthList } from "../../constants/arrays-list/months";
import { IForSelect } from "../../constants/interfaces/for-components/select.interface";
import { ICategoryResponse } from "../../constants/interfaces/api-responses/categories.responses.interfaces";
import { findAllCategories } from "../../actions/categories.actions";
import { capitalizeFirstLetter } from "../../constants/helpers/capitalize.methods";

export const useBudgets = () => {
  const [monthListForSelect, setMonthListForSelect] = useState<IForSelect[]>(
    []
  );
  const [categories, setCategories] = useState<IForSelect[]>([]);

  useEffect(() => {
    setMonthListForSelect(monthForSelection());
    getAndFormatCategories();
  }, []);

  const monthForSelection = (): IForSelect[] => {
    const currentMonth = new Date().getMonth();
    return monthList.filter((month) => (month.value as number) >= currentMonth);
  };

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

  return {
    monthListForSelect,
    categories,
  };
};
