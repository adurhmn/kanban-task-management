import { useColumns } from "@/libs/hooks/kanban";

export default function Dashboard() {
  const { columns, isLoading } = useColumns();

  console.log({ columns, isLoading });

  return <div>Dashboard</div>;
}
