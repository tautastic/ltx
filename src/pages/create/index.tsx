import { type NextPageWithAuthAndLayout } from "~/lib/types";
import AuthDropdown from "~/components/auth-dropdown";
import Header from "~/components/header";
import Footer from "~/components/footer";
import dynamic from "next/dynamic";
import { Button } from "~/components/ui/button";
import {
  Fieldset,
  FieldsetAction,
  FieldsetContent,
  FieldsetFooter,
} from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { TagIcon, XIcon } from "lucide-react";
import { Checkbox } from "~/components/ui/checkbox";

const Provider = dynamic(() => import("~/components/editor/provider"), {
  ssr: false,
});

const Editor = dynamic(() => import("~/components/editor"), {
  ssr: false,
});

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
      <Editor placeholder="Start typing here..." />
      <Fieldset>
        <FieldsetContent className="flex flex-col gap-y-2">
          <h4 className="text-xl font-[600]">Save Page</h4>
          <p className="mb-2 text-sm text-gray-900 dark:text-gray-200">
            In order to save your page, please tell us more about it.
          </p>
          <Input required placeholder="Title" />
          <Textarea rows={5} placeholder="Description" />
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <Tag key={tag.id} {...tag} />
            ))}
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
    <div className="flex h-8 items-center justify-center rounded border px-2 text-sm font-medium dark:border-gray-800">
      <Checkbox aria-labelledby={`label-${id}`} />
      <div className="flex items-center justify-center px-2" id={`label-${id}`}>
        <TagIcon
          strokeWidth={2}
          textRendering={"geometricPrecision"}
          className="mr-1 h-4 w-4"
          style={{ color: color }}
        />
        {name}
        <button>
          <XIcon
            textRendering={"sharpEdges"}
            className="relative bottom-1.5 left-2.5 ml-0.5 h-3 w-3 text-gray-600 dark:text-gray-400"
          />
        </button>
      </div>
    </div>
  );
};

Create.auth = true;
Create.getLayout = (page) => {
  return (
    <div>
      <Header>
        <AuthDropdown />
      </Header>
      <main className="flex min-h-screen flex-col items-center justify-start py-8">
        <Provider>{page}</Provider>
      </main>
      <Footer />
    </div>
  );
};
export default Create;
