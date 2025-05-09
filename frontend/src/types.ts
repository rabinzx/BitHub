import { Dayjs } from "dayjs";

export type Primitive = string | number | boolean | null;

export type CustomObject = Dayjs | Record<string, any>; 

export type AllowedCellValue = Primitive | CustomObject | Array<Primitive | CustomObject>;

export type SortOrder = 'asc' | 'desc' | '';

export type SortOrderDict = { [idx: number]: SortOrder };

