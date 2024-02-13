import { type NextPageWithAuthAndLayout } from "~/lib/types";
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
import { BlockEditor } from "~/components/editor/BlockEditor";
import React, { useRef } from "react";
import { Tag } from "~/components/tag";
import api from "~/utils/api";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import CreateTagDialog from "~/components/create-tag-dialog";

const Create: NextPageWithAuthAndLayout = () => {
  const queryClient = useQueryClient();
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const session = useSession().data;
  const deleteTagByIdMutation = api.tags.deleteTagById.useMutation();

  const handleDeleteTag = async (id: string) => {
    await deleteTagByIdMutation.mutateAsync(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ stale: true });
      },
    });
  };

  if (!session || !session.user) {
    return null;
  }

  const { data: tags } = api.tags.getTagListByAuthorId.useQuery(session?.user.id);

  return (
    <div className="flex w-full flex-col gap-y-10 sm:max-w-[70ch] md:max-w-[75ch] lg:max-w-[95ch]">
      <Fieldset
        ref={editorContainerRef}
        className="m-auto w-full max-w-screen-sm opacity-0 md:max-w-[75ch] lg:max-w-[95ch]"
      >
        <FieldsetContent className="min-h-[30ch] px-0">
          <BlockEditor containerRef={editorContainerRef} isHeaderVisible={false} />
        </FieldsetContent>
        <Fieldset className="rounded-none border-x-0 border-b-0">
          <FieldsetContent>
            <h4 className="mb-1 text-xl font-[600]">Save Page</h4>
            <p className="mb-2 text-sm text-gray-900 dark:text-gray-200">
              In order to save your page, please tell us more about it.
            </p>
            <div className="flex flex-col gap-y-4">
              <Input placeholder="Title" minLength={1} maxLength={48} required />
              <Textarea placeholder="Description" rows={5} maxLength={300} />
              <ul className="flex select-none flex-wrap items-center gap-4">
                {tags &&
                  tags.map((tag) => (
                    <Tag onDelete={() => handleDeleteTag(tag.id)} key={tag.id} {...tag} />
                  ))}
                <li className="inline-flex h-10 rounded-md border border-gray-200 dark:border-gray-800">
                  <CreateTagDialog />
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
      </Fieldset>
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
      <main className="flex min-h-screen flex-col items-center justify-start py-8">{page}</main>
      <Footer />
    </div>
  );
};
export default Create;
