export type FormMode = "edit" | "add" | "delete"

export interface FormProps<T> {
    submitAction: (fields: T) => unknown
    formId: string
    initialValues?: Partial<T> | T
    mode?: FormMode
}
