export const formatDate = (isoString:string) =>
  new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
  }).format(new Date(isoString));