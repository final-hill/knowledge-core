/*!
 * @license
 * Copyright (C) 2023 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

/* eslint-disable require-jsdoc */

// Reference: https://dodisturb.me/posts/2018-12-25-The-Essence-of-Datalog.html

import { zip } from './lib/zip.mjs';

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
    evalAtom = (kb: KnowledgeBase, atom: Atom, substitutions: Substitution[]): Substitution[] =>
        substitutions.flatMap<Substitution>(substitution => {
            const downToEarthAtom = substitute(atom, substitution),
                extensions = kb.flatMap(kbAtom => unify(downToEarthAtom, kbAtom))
                    .filter(Boolean) as unknown as Substitution[];

            return extensions.map(extension => [...substitution, ...extension]);
        }),
    walk = (kb: KnowledgeBase, atoms: Atom[]): Substitution[] =>
        atoms.reduceRight((subs, atom) => evalAtom(kb, atom, subs), [emptySubstitution]),
    evalRule = (kb: KnowledgeBase, { head, body }: Rule): KnowledgeBase =>
        walk(kb, body).map(sub => substitute(head, sub)),
    immediateConsequence = (rules: Program, kb: KnowledgeBase): KnowledgeBase =>
        [...new Set([...kb, ...rules.flatMap(rule => evalRule(kb, rule))])],
    solve = (rules: Program): KnowledgeBase => {
        const step = (f: (kb: KnowledgeBase) => KnowledgeBase, currentKB: KnowledgeBase): KnowledgeBase => {
            const nextKB = immediateConsequence(rules, currentKB);

            return nextKB === currentKB ? currentKB : f(nextKB);
        };

        if (rules.every(isRangeRestricted))
            return fix(step, [] as KnowledgeBase);
        else
            throw new Error('The input program is not range-restricted.');
    },
    isRangeRestricted = ({ head, body }: Rule): boolean => {
        const vars = (atom: Atom): Var[] => [...new Set(atom.terms.filter(term => term instanceof Var) as Var[])],
            isSubsetOf = (as: Var[], bs: Var[]): boolean => as.every(a => bs.includes(a));

        return isSubsetOf(vars(head), body.flatMap(vars));
    };