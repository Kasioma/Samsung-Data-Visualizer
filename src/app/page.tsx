import Chart from "./_components/chart";
import FileUpload from "./_components/fileUpload";

export default function HomePage() {
  const properties = {
    type: "bar",
    structure: {
      labels: ["Rent", "Pay"],
      datasets: [
        {
          label: "Expenses",
          data: [1200, 1300, 1400],
        },
      ],
    },
  };
  return (
    <>
      <Chart {...properties} />
      <FileUpload />
    </>
  );
}
