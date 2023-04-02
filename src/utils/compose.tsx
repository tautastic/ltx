import type { ComponentType, FC, ReactNode } from "react";

const compose = (
  ...providers: ComponentType<{ children: ReactNode }>[]
): ComponentType<{ children: ReactNode }> =>
  providers.reduce((Prev, Curr) => {
    const Component: FC<{ children: ReactNode }> = ({ children }) => (
      <Prev>
        <Curr>{children}</Curr>
      </Prev>
    );
    Component.displayName = Prev.displayName;
    return Component;
  });

export default compose;
