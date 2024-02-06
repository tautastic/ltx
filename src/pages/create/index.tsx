import { type NextPageWithAuthAndLayout } from "~/lib/types";
import { PlusIcon, TagIcon, XIcon } from "lucide-react";
import AuthDropdown from "~/components/auth-dropdown";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import Header from "~/components/header";
import Footer from "~/components/footer";
import {
  Fieldset,
  FieldsetAction,
  FieldsetContent,
  FieldsetFooter,
} from "~/components/ui/fieldset";

type TagProps = {
  color: string;
  id: string;
  name: string;
};

const Create: NextPageWithAuthAndLayout = () => {
  const tags: TagProps[] = [
    {
      color: "#1e9de7",
      id: "tag-1",
      name: "Mathematics",
    },
    {
      color: "#27b648",
      id: "tag-2",
      name: "Biology",
    },
    {
      color: "#dcaa24",
      id: "tag-3",
      name: "English",
    },
  ];
  return (
    <div className="flex w-full flex-col gap-y-10 sm:max-w-[70ch] md:max-w-[75ch] lg:max-w-[95ch]">
      <Fieldset>
        <FieldsetContent>
          <h4 className="mb-1 text-xl font-[600]">Save Page</h4>
          <p className="mb-2 text-sm text-gray-900 dark:text-gray-200">
            In order to save your page, please tell us more about it.
          </p>
          <div className="flex flex-col gap-y-4">
            <Input placeholder="Title" minLength={1} maxLength={48} required />
            <Textarea placeholder="Description" rows={5} maxLength={300} />
            <ul className="flex select-none flex-wrap items-center gap-4">
              {tags.map((tag) => (
                <Tag key={tag.id} {...tag} />
              ))}
              <li className="inline-flex h-10 rounded-md border border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  title="Create tag"
                  className="inline-flex w-full items-center justify-center px-2"
                >
                  <PlusIcon
                    textRendering={"geometricPrecision"}
                    className="text-gray-700 dark:text-gray-400"
                  />
                </button>
              </li>
            </ul>
          </div>
        </FieldsetContent>
        <FieldsetFooter>
          <FieldsetAction>
            <Button Size="sm">Save</Button>
          </FieldsetAction>
        </FieldsetFooter>
      </Fieldset>
    </div>
  );
};

const Tag = ({ color, id, name }: TagProps) => {
  return (
    <li className="h-10 flex-1 text-sm font-medium">
      <input type="checkbox" id={id} value={id} className="peer hidden" />
      <div className="flex justify-between gap-x-6 rounded border border-gray-200 opacity-60 peer-checked:border-blue-600 peer-checked:opacity-100 dark:border-gray-800">
        <label htmlFor={id} className="flex flex-1 cursor-pointer items-center gap-x-1.5 py-2 pl-3">
          <TagIcon textRendering={"geometricPrecision"} className="h-4 w-4" color={color} />
          <p className="break-keep">{name}</p>
        </label>
        <button type="button" title="Delete tag" className="m-1 h-min">
          <XIcon textRendering={"geometricPrecision"} className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
};

Create.auth = true;
Create.getLayout = (page) => {
  return (
    <div>
      <Header>
        <AuthDropdown />
      </Header>
      <main className="flex min-h-screen flex-col items-center justify-start py-8">{page}</main>
      <Footer />
    </div>
  );
};
export default Create;
