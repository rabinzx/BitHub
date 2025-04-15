import dayjs from "dayjs";

const formRuleInteger = {
    required: "This field is required",
    pattern: {
        value: /^-?\d+$/, // matches positive or negative integers
        message: "Must be a valid integer",
    },
}

const formRuleDecimal = {
    required: "This field is required",
    validate: (value: string) => {
        const parsed = parseFloat(value);
        if (isNaN(parsed)) {
            return "Must be a valid number";
        }
    }
}

const formRulePhone = {
    required: "Phone number is required",
    pattern: {
        value: /^\(\d{3}\)\s\d{3}-\d{4}$/,
        message: "Invalid phone format",
    },
}

const formRuleDate = {
    required: "Date is required",
    validate: (value: string) => {
        const format = "MM/DD/YYYY";
        const parsed = dayjs(value, format, true); // strict parsing

        if (!parsed.isValid()) {
            return "Invalid date format or value";
        }

        const minDate = dayjs("01/01/1900", format);
        const maxDate = dayjs("12/31/2200", format);

        if (!parsed.isBetween(minDate, maxDate, null, '[]')) {
            return "Date must be between 01/01/1900 and 12/31/2200";
        }

        return true;
    }
};

const formRulePassword = {
    required: "This field is required",
    validate: (value: string) => {
        if (value.length < 12 || 
            value.length > 32 || 
            !/[a-z]/.test(value) || 
            !/[A-Z]/.test(value) || 
            !/\d/.test(value) || 
            !/[!@#$%^&*]/.test(value)
        ) {
            return "Password must be 12-32 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character";
        }
        return true;
    }
};

const formRulePasswordMatch = (matchValue: string) => ({
    required: "This field is required",
    validate: (value: string) => {
        if (value !== matchValue) {
            return "Password does not match";
        }
    }
});

const formRuleFile = (maxSizeMB: number) => ({
    validate: (value: FileList) => {
        const file = value[0];
        if (file) {
            const sizeInMB = getFileSizeMB(file.size);
            if (sizeInMB > maxSizeMB) {
                return `File size exceeds ${maxSizeMB} MB`;
            }
        }
        return true;
    }
});

const formRuleRadio = {
    required: "This field is required",
};

// helers
const getFileSizeMB = (file_size: number) => {
    return file_size / 1024 / 1024;
}
export { getFileSizeMB };

const rules = {
    integer: formRuleInteger,
    decimal: formRuleDecimal,
    phone: formRulePhone,
    date: formRuleDate,
    password: formRulePassword,
    passwordMatch: formRulePasswordMatch,
    radio: formRuleRadio,
    file: formRuleFile,
}

export default rules;
