// import React from 'react'   contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
import { toast } from "react-hot-toast"
import { apiConnector } from '../apiconnector';
import { catalogData } from '../apis';

export const getCatalogaPageData = async (categoryId) => {
    const toastId = toast.loading("Loading...");
    let result = [];
    try {
        const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API,
            { categoryId: categoryId, });

        if (!response?.data?.success)
            throw new Error("Could not Fetch Category page data");

        result = response?.data;

        console.log("Catalog page data api respose ", result)

    }
    catch (error) {
        console.log("CATALOG PAGE DATA API ERROR....", error);
        toast.error(error.message);
        result = error.response?.data;
    }
    toast.dismiss(toastId);
    return result;
}

