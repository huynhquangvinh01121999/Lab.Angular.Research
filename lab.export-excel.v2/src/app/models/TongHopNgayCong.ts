export interface TongHopNgayCong {
    ngay: Date,
    ngayCong?: number,
    gioVao?: string,
    gioRa?: string,
    nc_nghiphep_hl?: number,
    nc_nghiphep_khl?: number,
    nc_nghile?: number,
    ltg_ngaythuong_bd?: string,
    ltg_ngaythuong_kt?: string,
    ltg_ngaythuong_sogio?: number,
    ltg_ngaythuong_noidung?: string,
    ltg_ngayle_bd?: string,
    ltg_ngayle_kt?: string,
    ltg_ngayle_sogio?: number,
    ltg_ngayle_noidung?: string,
    ltg_ngaynghi_bd?: string,
    ltg_ngaynghi_kt?: string,
    ltg_ngaynghi_sogio?: number,
    ltg_ngaynghi_noidung?: string,
    viecBenNgoais?: ViecBenNgoai[],
    diTre?: number,
    veSom?: number,
    vcn_sophut?: number,
    vcn_mota?: string
}

export interface ViecBenNgoai {
    thoiGianBatDau?: Date,
    thoiGianKetThuc?: Date,
    tgbD_Display?: string,
    tgkT_Display?: string,
    moTa?: string,
    diaDiem?: string
}

export const viecbenngoai: ViecBenNgoai = {
    tgbD_Display: "",
    tgkT_Display: "",
    moTa: "",
    diaDiem: ""
}