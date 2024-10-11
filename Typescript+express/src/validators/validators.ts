import { checkSchema } from "express-validator";
export const productValidator = checkSchema({
    name: {
        isLength: {
            errorMessage: "company name should be at least 5 characters long",
            options: { min: 5 }
        },
        isAlpha: true,
        errorMessage: "company name should contain only alphabetic characters"
    },
    location: {
        isLength: {
            errorMessage: "location should be at least 5 characters long",
            options: { min: 5 }
        },
        isAlpha: true,
        errorMessage: "location should contain only alphabetic characters"
    },
    imageUrl: {
        isURL: true,
        errorMessage: "Invalid URL"
    },
    price: {
        isNumeric: true,
        errorMessage: "Invalid price"
    },
    date:{
        isDate: true,
        errorMessage: "Invalid date"
    }
})