import dayjs from "dayjs";

export function sortDatesByDate(dates: string[]) {
  return dates.sort((date1, date2) => {
    const dateA = dayjs(date1);
    const dateB = dayjs(date2);

    if (dateA.isBefore(dateB)) {
      return -1;
    } else if (dateA.isAfter(dateB)) {
      return 1;
    } else {
      return 0;
    }
  });
}

export function formatDate(date: string) {
  const differenceOfDateAndTodayInDays = calculateDiffOfDateAndTodayInDays(date);

  switch (differenceOfDateAndTodayInDays) {
    case 1:
      return "Amanhã";
    case 0:
      return "Hoje";
    case -1:
      return "Ontem";
    default:
      return dayjs(date).format("DD/MM");
  }
}

export function calculateDiffOfDateAndTodayInDays(date: string) {
  const startOfTodayDate = dayjs().startOf("day");
  return dayjs(date).diff(startOfTodayDate, "day");
}
