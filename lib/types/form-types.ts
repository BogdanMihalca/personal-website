export interface BaseFormState {
    errors?: {
        _form?: string[];
        [key: string]: string[] | undefined;
    };
    success: boolean; // Always defined as boolean, not boolean | undefined
    message: string;
}

export interface TagFormState extends BaseFormState {
    errors?: {
        _form?: string[];
        name?: string[];
        slug?: string[];
    };
}

export interface CategoryFormState extends BaseFormState {
    errors?: {
        _form?: string[];
        name?: string[];
        slug?: string[];
        description?: string[];
        image?: string[];
    };
}

export interface BaseEntity {
    id: number;
    _count?: Record<string, number>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}
