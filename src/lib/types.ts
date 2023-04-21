import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";

export type NextPageWithAuthAndLayout<Props = object, InitialProps = Props> = NextPage<Props> & {
  auth?: boolean;
  getLayout?: (page: ReactElement) => ReactNode;
};

export const themeColors = ["#fb7185", "#fdba74", "#d9f99d", "#a7f3d0", "#a5f3fc", "#a5b4fc"];

export const defaultValue = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      attrs: {
        class: null,
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "Es sei $\\Omega = \\sum_{n \\in \\N} A_{n}$ eine Zerlegung des Grundraums $\\Omega$ in paarweise disjunkte Mengen $A_{1}, A_{2},\\dotsc\\,$. Zeigen Sie, dass das System",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        class: null,
        textAlign: "center",
      },
      content: [
        {
          type: "text",
          text: "$\\mathcal{A} = \\left\\{B \\subseteq \\Omega \\vert \\exists T \\subseteq \\N \\,\\text{mit}\\, B = \\sum_{n \\in T} A_{n} \\right\\}$",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        class: null,
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "eine $\\sigma$-Algebra ist.",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        class: null,
        textAlign: "left",
      },
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
          text: ". Um zu zeigen, dass $\\mathcal{A}$ eine $\\sigma$-Algebra ist, müssen wir zeigen, dass die leere Menge $\\emptyset$ in $\\mathcal{A}$ enthalten ist und dass $\\mathcal{A}$ die Eigenschaften des Komplements und der Vereinigung abzählbarer Mengen besitzt.",
        },
      ],
    },
    {
      type: "orderedList",
      attrs: {
        start: 1,
      },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "Die leere Menge ist in $\\mathcal{A}$ enthalten, da sie sich als Vereinigung leerer Mengen darstellen lässt. Denn $\\emptyset = \\sum_{n \\in \\emptyset} A_n$, also gehört $\\emptyset$ zu $\\mathcal{A}$.",
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
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "Für jedes $B \\in \\mathcal{A}$ gibt es eine Menge $T \\subseteq \\N$ mit $B = \\sum_{n \\in T} A_n$. Dann ist das Komplement von $B$ gegeben durch $B^c = \\Omega \\setminus B = \\sum_{n \\in \\N \\setminus T} A_n$, also gehört auch das Komplement von $B$ zu $\\mathcal{A}$.",
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
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "Schließlich betrachten wir eine abzählbare Familie $(B_i){i \\in I}$ von Mengen in $\\mathcal{A}$. Für jedes $i \\in I$ gibt es eine Menge $T_i \\subseteq \\N$ mit $B_i = \\sum_{n \\in T_i} A_n$. Dann ist die Vereinigung der Mengen $B_i$ gegeben durch",
                },
              ],
            },
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "center",
              },
              content: [
                {
                  type: "hardBreak",
                },
                {
                  type: "text",
                  text: "$\\bigcup_{i \\in I} B_i = \\sum_{i \\in I} \\sum_{n \\in T_i} A_n = \\sum_{n \\in \\bigcup_{i \\in I} T_i} A_n,$",
                },
                {
                  type: "hardBreak",
                },
              ],
            },
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "also gehört auch die Vereinigung der Mengen $B_i$ zu $\\mathcal{A}$.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        class: null,
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "Da $\\mathcal{A}$ die Eigenschaften der leeren Menge, des Komplements und der Vereinigung abzählbarer Mengen besitzt, ist es eine $\\sigma$-Algebra. ",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        class: null,
        textAlign: "right",
      },
      content: [
        {
          type: "text",
          text: "$\\blacksquare$ ",
        },
      ],
    },
  ],
};
