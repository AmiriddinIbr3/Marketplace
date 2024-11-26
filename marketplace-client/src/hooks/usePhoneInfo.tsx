import { useState } from "react";

export interface IPhoneInfo {
    phone: string;
    cleanPhone: string;
    countryCode: string;
    dialCode: string;
}

export interface IRegionInfo {
    countryCode: string;
    dialCode: string;
}

const usePhoneInfo = () => {
    const [phoneInfo, setPhoneInfo] = useState<IPhoneInfo>({
        phone: "",
        cleanPhone: "",
        countryCode: "us",
        dialCode: "+1",
    });

    const getPhoneNumberWithoutCountryCode = (phone: string, dialCode: string) => {
        return phone.replace(new RegExp(`^${dialCode}`), '');
    }

    const handlePhoneChange = (phone: string, region: IRegionInfo) => {
        const cleanPhone = getPhoneNumberWithoutCountryCode(phone, region.dialCode);
        const countryCode = region.countryCode.toUpperCase();

        setPhoneInfo({
            phone,
            cleanPhone,
            countryCode,
            dialCode: region.dialCode,
        });
    };

    return { phoneInfo, handlePhoneChange };
};

export default usePhoneInfo;