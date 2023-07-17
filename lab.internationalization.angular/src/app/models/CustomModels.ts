import { en_US, ja_JP, NzCronExpressionI18nInterface, NzDatePickerI18nInterface, NzEmptyI18nInterface, NzGlobalI18nInterface, NzModalI18nInterface, NzPaginationI18nInterface, NzPopconfirmI18nInterface, NzTableI18nInterface, NzTextI18nInterface, NzTimePickerI18nInterface, NzTransferI18nInterface, NzUploadI18nInterface } from "ng-zorro-antd/i18n"
import data from "../file/data.json"

export interface LanguageInterface {
    // core: NzI18nInterface,
    locale: string,
    Pagination: NzPaginationI18nInterface,
    DatePicker: NzDatePickerI18nInterface,
    TimePicker: NzTimePickerI18nInterface,
    Calendar: NzDatePickerI18nInterface,
    global?: NzGlobalI18nInterface,
    Table: NzTableI18nInterface,
    Modal: NzModalI18nInterface,
    Popconfirm: NzPopconfirmI18nInterface,
    Transfer: NzTransferI18nInterface,
    Upload: NzUploadI18nInterface,
    Empty: NzEmptyI18nInterface,
    Text?: NzTextI18nInterface,
    CronExpression?: NzCronExpressionI18nInterface,
    models: any
}

export const en_USCustom: any = {
    ...en_US,
    ...{
        Dashboard: {
            menu: "menu",
            data: data
        }
    }
}

export const ja_JPCustom: any = {
    ...ja_JP,
    ...{
        Dashboard: {
            menu: "メニュー",
            data: data
        }
    }
}

export const en_USCustom_v2: LanguageInterface = {
    ...en_US,
    models: {
        menu: "menu",
        data: data
    }
}

export const ja_JPCustom_v2: LanguageInterface = {
    ...en_US,
    models: {
        menu: "メニュー",
        data: data
    }
}

