/*!
 * @license
 * Copyright (C) 2023 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

/* eslint-disable require-jsdoc */

const zip = <T, U>(t: T[], u: U[]): [T, U][] => t.map((v, i) => [v, u[i]]);

class Equatable {
    equals(other: any): boolean {
        if (this === other) return true;
        if (other == null) return false;
        for (const key in this)
            if (this[key] !== other[key]) return false;

        return true;
    }
}

abstract class Term extends Equatable { }

class Var extends Term {
    constructor(public name: string) { super(); }
}

class Sym extends Term {
    constructor(public name: string) { super(); }
}

class Atom extends Equatable {
    constructor(public predSym: string, public terms: Term[]) { super(); }
}

class Rule {
    constructor(public head: Atom, public body: Atom[]) { }
}

type Program = Rule[];

type KnowledgeBase = Atom[];

type Substitution = [Term, Term][];

const emptySubstitution: Substitution = [],
    substitute = (atom: Atom, substitution: Substitution): Atom => new Atom(
        atom.predSym,
        atom.terms.map((term: Term): Term =>
            term instanceof Sym ? term :
                substitution.find(([t]) => t.equals(term))?.[1] ?? term
        )
    ),
    unifyTerms = (sub: Substitution): Substitution | undefined => {
        if (sub.length === 0) return sub;
        const [[t1, t2], ...rest] = sub;
        if (t2 instanceof Var)
            throw new Error('The second atom is assumed to be ground');
        if (t1 instanceof Sym)
            return t1 !== t2 ? undefined : unifyTerms(rest);
        const [v, s] = [t1 as Var, t2 as Sym],
            incompleteSub = unifyTerms(rest) ?? emptySubstitution,
            s2 = incompleteSub.find(([t]) => t.equals(v))?.[1];

        return s2 && s !== s2 ? undefined : [[v, s], ...incompleteSub];
    },
    unify = ({ predSym, terms }: Atom, { predSym: predSym2, terms: terms2 }: Atom): Substitution | undefined =>
        predSym !== predSym2 ? undefined : unifyTerms(zip(terms, terms2)),
    evalAtom = (kb: KnowledgeBase, atom: Atom, subs: Substitution[]): boolean => {
        const downToEarthAtom = substitute(atom, unknown),
            extension = kb.map(kbAtom => unify);
    },
    walk = (kb: KnowledgeBase, atom: Atom): unknown => void 0,
    evalRule = (kb: KnowledgeBase, { head, body }: Rule): KnowledgeBase =>
        substitute();