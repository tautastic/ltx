import type { FC, ReactNode } from "react";
import twcx from "~/utils/twcx";

const Fieldset: FC<{ children?: ReactNode; className?: string }> = (props) => {
  return (
    <div
      className={twcx(
        "relative rounded border border-gray-200 bg-white dark:border-gray-800 dark:bg-black",
        props.className
      )}
    >
      {props.children}
    </div>
  );
};

const FieldsetContent: FC<{ children?: ReactNode; className?: string }> = (props) => {
  return (
    <div className={twcx("relative rounded-t bg-white p-6 dark:bg-black", props.className)}>
      {props.children}
    </div>
  );
};

const FieldsetFooter: FC<{ children?: ReactNode; className?: string }> = (props) => {
  return (
    <div
      className={twcx(
        "relative flex min-h-[57px] items-center rounded-b border-t border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-800 dark:bg-gray-900",
        props.className
      )}
    >
      {props.children}
    </div>
  );
};

const FieldsetStatus: FC<{ children?: ReactNode; className?: string }> = (props) => {
  return (
    <div className={twcx("flex max-w-full items-center", props.className)}>{props.children}</div>
  );
};

const FieldsetAction: FC<{ children?: ReactNode; className?: string }> = (props) => {
  return (
    <div className={twcx("ml-auto flex items-center justify-end", props.className)}>
      {props.children}
    </div>
  );
};

export { Fieldset, FieldsetContent, FieldsetFooter, FieldsetStatus, FieldsetAction };
