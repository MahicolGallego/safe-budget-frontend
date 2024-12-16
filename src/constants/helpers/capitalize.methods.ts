export const capitalizeFirstLetter = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const capitalizeFull = (value: string) => {
  return value.split(" ").map(capitalizeFirstLetter).join(" ");
};
