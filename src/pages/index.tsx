import List from "~/components/list";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const { data: forms, isLoading } = api.form.getForms.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="my-5 flex w-full justify-center">
      <ul role="list" className="w-3/5 space-y-3">
        {forms?.map(({ formId, formName, dateCreated }) => (
          <List
            key={formId}
            formId={formId}
            formName={formName}
            dateCreated={dateCreated}
          />
        ))}
        <li
          className="cursor-pointer overflow-hidden rounded-md bg-white px-6 py-4 text-center text-3xl shadow transition duration-300 ease-in-out hover:shadow-lg"
          onClick={() => {
            router.push(`/form`);
          }}
        >
          +
        </li>
      </ul>
    </div>
  );
}
