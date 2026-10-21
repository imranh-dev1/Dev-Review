import type { Varchar, Numeric } from "@prisma/orm-postgres/target/codec-types";

export const asVarchar = <N extends number>(value: string): Varchar<N> =>
    value as Varchar<N>;

export const asNumeric = <P extends number, S extends number | undefined = undefined>(
    value: string | number,
): Numeric<P, S> => String(value) as Numeric<P, S>;
