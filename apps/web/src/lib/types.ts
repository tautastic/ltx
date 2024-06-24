import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";

export type NextPageWithAuthAndLayout<Props = object, _InitialProps = Props> = NextPage<Props> & {
  auth?: boolean;
  getLayout?: (page: ReactElement) => ReactNode;
};

export const exampleLatex = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(176, 176, 176)",
              },
            },
          ],
          text: "Stochastik",
        },
      ],
    },
    {
      type: "heading",
      attrs: {
        level: 1,
      },
      content: [
        {
          type: "text",
          text: "Sigma-Algebra",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Es sei",
        },
        {
          type: "MathInline",
          attrs: {
            latex: "\\Omega = \\sum_{n \\in \\mathbb{N}} A_{n}",
          },
        },
        {
          type: "text",
          text: "eine Zerlegung des Grundraums",
        },
        {
          type: "MathInline",
          attrs: {
            latex: "\\Omega",
          },
        },
        {
          type: "text",
          text: "in paarweise disjunkte Mengen",
        },
        {
          type: "MathInline",
          attrs: {
            latex: "A_{1}, A_{2},\\dotsc\\,",
          },
        },
        {
          type: "text",
          text: ". Zeigen Sie, dass das System",
        },
        {
          type: "MathInline",
          attrs: {
            latex:
              "\\mathcal{A} = \\left\\{B \\subseteq \\Omega \\vert \\exists T \\subseteq \\mathbb{N} \\,\\text{mit}\\, B = \\sum_{n \\in T} A_{n} \\right\\}",
          },
        },
        {
          type: "text",
          text: "eine",
        },
        {
          type: "MathInline",
          attrs: {
            latex: "\\sigma",
          },
        },
        {
          type: "text",
          text: "-Algebra ist.",
        },
      ],
    },
    {
      type: "horizontalRule",
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "italic",
            },
          ],
          text: "Beweis",
        },
        {
          type: "text",
          text: ". Um zu zeigen, dass",
        },
        {
          type: "MathInline",
          attrs: {
            latex: "\\mathcal{A}",
          },
        },
        {
          type: "text",
          text: "eine",
        },
        {
          type: "MathInline",
          attrs: {
            latex: "\\sigma",
          },
        },
        {
          type: "text",
          text: "-Algebra ist, müssen wir zeigen, dass die leere Menge",
        },
        {
          type: "MathInline",
          attrs: {
            latex: "\\emptyset",
          },
        },
        {
          type: "text",
          text: "in",
        },
        {
          type: "MathInline",
          attrs: {
            latex: "\\mathcal{A}",
          },
        },
        {
          type: "text",
          text: "enthalten ist und dass",
        },
        {
          type: "MathInline",
          attrs: {
            latex: "\\mathcal{A}",
          },
        },
        {
          type: "text",
          text: "die Eigenschaften des Komplements und der Vereinigung abzählbarer Mengen besitzt.",
        },
      ],
    },
    {
      type: "orderedList",
      attrs: {
        tight: false,
        start: 1,
      },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Die leere Menge ist in",
                },
                {
                  type: "MathInline",
                  attrs: {
                    latex: "\\mathcal{A}",
                  },
                },
                {
                  type: "text",
                  text: "enthalten, da sie sich als Vereinigung leerer Mengen darstellen lässt. Denn",
                },
                {
                  type: "MathInline",
                  attrs: {
                    latex: "\\emptyset = \\sum_{n \\in \\emptyset} A_n",
                  },
                },
                {
                  type: "text",
                  text: ", also gehört",
                },
                {
                  type: "MathInline",
                  attrs: {
                    latex: "\\emptyset",
                  },
                },
                {
                  type: "text",
                  text: "zu ",
                },
                {
                  type: "MathInline",
                  attrs: {
                    latex: "\\emptyset",
                  },
                },
                {
                  type: "text",
                  text: ".",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Für jedes",
                },
                {
                  type: "MathInline",
                  attrs: {
                    latex: "B \\in \\mathcal{A}",
                  },
                },
                {
                  type: "text",
                  text: "gibt es eine Menge",
                },
                {
                  type: "MathInline",
                  attrs: {
                    latex: "T \\subseteq \\mathbb{N}",
                  },
                },
                {
                  type: "text",
                  text: "mit",
                },
                {
                  type: "MathInline",
                  attrs: {
                    latex: "B = \\sum_{n \\in T} A_n",
                  },
                },
                {
                  type: "text",
                  text: ". Dann ist das Komplement von",
                },
                {
                  type: "MathInline",
                  attrs: {
                    latex: "B",
                  },
                },
                {
                  type: "text",
                  text: "gegeben durch",
                },
                {
                  type: "MathInline",
                  attrs: {
                    latex: "B^c = \\Omega \\setminus B = \\sum_{n \\in \\mathbb{N} \\setminus T} A_n",
                  },
                },
                {
                  type: "text",
                  text: ", also gehört auch das Komplement von",
                },
                {
                  type: "MathInline",
                  attrs: {
                    latex: "B",
                  },
                },
                {
                  type: "text",
                  text: "zu",
                },
                {
                  type: "MathInline",
                  attrs: {
                    latex: "\\mathcal{A}",
                  },
                },
                {
                  type: "text",
                  text: ".",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Schließlich betrachten wir eine abzählbare Familie",
                },
                {
                  type: "MathInline",
                  attrs: {
                    latex: "(B_i){i \\in I}",
                  },
                },
                {
                  type: "text",
                  text: "von Mengen in",
                },
                {
                  type: "MathInline",
                  attrs: {
                    latex: "\\mathcal{A}",
                  },
                },
                {
                  type: "text",
                  text: ". Für jedes",
                },
                {
                  type: "MathInline",
                  attrs: {
                    latex: "i \\in I",
                  },
                },
                {
                  type: "text",
                  text: "gibt es eine Menge",
                },
                {
                  type: "MathInline",
                  attrs: {
                    latex: "T_i \\subseteq \\mathbb{N}",
                  },
                },
                {
                  type: "text",
                  text: "mit",
                },
                {
                  type: "MathInline",
                  attrs: {
                    latex: "B_i = \\sum_{n \\in T_i} A_n",
                  },
                },
                {
                  type: "text",
                  text: ". Dann ist die Vereinigung der Mengen",
                },
                {
                  type: "MathInline",
                  attrs: {
                    latex: "B_i",
                  },
                },
                {
                  type: "text",
                  text: "gegeben durch",
                },
                {
                  type: "MathInline",
                  attrs: {
                    latex:
                      "\\bigcup_{i \\in I} B_i = \\sum_{i \\in I} \\sum_{n \\in T_i} A_n = \\sum_{n \\in \\bigcup_{i \\in I} T_i} A_n,",
                  },
                },
                {
                  type: "text",
                  text: "also gehört auch die Vereinigung der Mengen",
                },
                {
                  type: "MathInline",
                  attrs: {
                    latex: "B_i",
                  },
                },
                {
                  type: "text",
                  text: "zu",
                },
                {
                  type: "MathInline",
                  attrs: {
                    latex: "\\mathcal{A}",
                  },
                },
                {
                  type: "text",
                  text: ".",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Da",
        },
        {
          type: "MathInline",
          attrs: {
            latex: "\\mathcal{A}",
          },
        },
        {
          type: "text",
          text: "die Eigenschaften der leeren Menge, des Komplements und der Vereinigung abzählbarer Mengen besitzt, ist es eine",
        },
        {
          type: "MathInline",
          attrs: {
            latex: "\\sigma",
          },
        },
        {
          type: "text",
          text: "-Algebra.",
        },
      ],
    },
  ],
};
