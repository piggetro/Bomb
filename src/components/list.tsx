import { FormList } from "~/types/forms.types";
import { useRouter } from "next/router";

export default function List({ formId, formName, dateCreated }: FormList) {
  const router = useRouter();
  return (
    <li
      key={formId}
      className="cursor-pointer overflow-hidden rounded-md bg-white px-6 py-4 shadow transition duration-300 ease-in-out hover:shadow-lg"
      onClick={() => {
        router.push(`/${formId}`);
      }}
    >
      <div className="flex">
        <h5 className="basis-1/4 opacity-50">#{formId}</h5>
        <h5 className="basis-1/4">{formName}</h5>
        <h5 className="basis-1/2 text-end">Date Created: {dateCreated}</h5>
      </div>
    </li>
  );
}
