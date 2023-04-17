import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";

export type NextPageWithAuthAndLayout<Props = object, InitialProps = Props> = NextPage<Props> & {
  auth?: boolean;
  getLayout?: (page: ReactElement) => ReactNode;
};

export const defaultValue = `Es sei $\\Omega = \\sum_{n \\in \\N} A_{n}$ eine Zerlegung des Grundraums $\\Omega$ in paarweise disjunkte Mengen $A_{1}, A_{2},\\dotsc\\,$. Zeigen Sie, dass das System
$$
\\mathcal{A} = \\left\\{B \\subseteq \\Omega \\vert \\exists T \\subseteq \\N \\,\\text{mit}\\, B = \\sum_{n \\in T} A_{n} \\right\\}
$$
eine $\\sigma$-Algebra ist.

_Beweis_. Um zu zeigen, dass $\\mathcal{A}$ eine $\\sigma$-Algebra ist, müssen wir zeigen, dass die leere Menge $\\emptyset$ in $\\mathcal{A}$ enthalten ist und dass $\\mathcal{A}$ die Eigenschaften des Komplements und der Vereinigung abzählbarer Mengen besitzt.

1. Die leere Menge ist in $\\mathcal{A}$ enthalten, da sie sich als Vereinigung leerer Mengen darstellen lässt. Denn $\\emptyset = \\sum_{n \\in \\emptyset} A_n$, also gehört $\\emptyset$ zu $\\mathcal{A}$.
1. Für jedes $B \\in \\mathcal{A}$ gibt es eine Menge $T \\subseteq \\N$ mit $B = \\sum_{n \\in T} A_n$. Dann ist das Komplement von $B$ gegeben durch $B^c = \\Omega \\setminus B = \\sum_{n \\in \\N \\setminus T} A_n$, also gehört auch das Komplement von $B$ zu $\\mathcal{A}$.
1. Schließlich betrachten wir eine abzählbare Familie $(B_i){i \\in I}$ von Mengen in $\\mathcal{A}$. Für jedes $i \\in I$ gibt es eine Menge $T_i \\subseteq \\N$ mit $B_i = \\sum_{n \\in T_i} A_n$. Dann ist die Vereinigung der Mengen $B_i$ gegeben durch
   $$
   \\bigcup_{i \\in I} B_i = \\sum_{i \\in I} \\sum_{n \\in T_i} A_n = \\sum_{n \\in \\bigcup_{i \\in I} T_i} A_n,
   $$
   also gehört auch die Vereinigung der Mengen $B_i$ zu $\\mathcal{A}$.

Da $\\mathcal{A}$ die Eigenschaften der leeren Menge, des Komplements und der Vereinigung abzählbarer Mengen besitzt, ist es eine $\\sigma$-Algebra.

$\\blacksquare$`;
