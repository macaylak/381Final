function FormattedDate({ date }) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(date).toLocaleDateString(undefined, options);
  return <span>{formattedDate}</span>;
}

  
  export default FormattedDate;