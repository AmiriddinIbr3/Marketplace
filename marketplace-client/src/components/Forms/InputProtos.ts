export const emailProto = {
    required: 'The field is required!',
    pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address"
    }
}

export const passwordProto = {
    required: 'The field is required!',
    maxLength: {
        value: 20,
        message: 'Maximum number of letters 20'
    },
    minLength: {
        value: 8,
        message: 'Minimum number of letters 8'
    },
}

export const surnameProto = {
    pattern: {
        value: /^[A-Za-zА-Яа-яЁё\s]+$/,
        message: "String can only contain Latin, Cyrillic and spaces"
    },
    maxLength: {
        value: 18,
        message: 'Maximum number of letters 18'
    },
    minLength: {
        value: 2,
        message: 'Minimum number of letters 2'
    },
}

export const usernameProto = {
    required: 'The field is required!',
    pattern: {
        value: /^[A-Za-zА-Яа-яЁё\s]+$/,
        message: "String can only contain Latin, Cyrillic and spaces"
    },
    maxLength: {
        value: 18,
        message: 'Maximum number of letters 18'
    },
    minLength: {
        value: 2,
        message: 'Minimum number of letters 2'
    },
}

export const nameProto = {
    required: 'The field is required!',
    pattern: {
        value: /^[A-Za-zА-Яа-яЁё\s]+$/,
        message: "String can only contain Latin, Cyrillic and spaces"
    },
    maxLength: {
        value: 12,
        message: "Maximum number of letters 12"
    },
    minLength: {
        value: 2,
        message: "Minimum number of letters 2"
    },
}

export const imageProto = {
    validate: {
        size: (files: FileList | File | null | undefined) => {
            if (!files) return true;

            if (files instanceof FileList) {
                if (files.length === 0) return true;

                for (const file of Array.from(files)) {
                    if (file.size >= 2 * 1024 * 1024) {
                        return 'File size must be less than 2MB';
                    }
                }

                return true;
            }
            else if (files instanceof File) {
                if (files.size >= 2 * 1024 * 1024) {
                    return 'File size must be less than 2MB';
                }

                return true;
            }

            return 'Invalid file input';
        },
        type: (files: FileList | File | null | undefined) => {
            if (!files) return true;

            if (files instanceof FileList) {
                if (files.length === 0) return true;

                for (const file of Array.from(files)) {
                    if (!['image/jpeg', 'image/png'].includes(file.type)) {
                        return 'Only JPEG and PNG files are allowed';
                    }
                }

                return true;
            }
            else if (files instanceof File) {
                if (!['image/jpeg', 'image/png'].includes(files.type)) {
                    return 'Only JPEG and PNG files are allowed';
                }

                return true;
            }
            
            return 'Invalid file input';
        }
    }
}

export const titleProto = {
    required: 'The field is required!',
    pattern: {
        value: /^[A-Za-zА-Яа-яЁё\s]+$/,
        message: "String can only contain Latin, Cyrillic and spaces"
    },
    maxLength: {
        value: 20,
        message: 'Maximum number of letters 20'
    },
    minLength: {
        value: 8,
        message: 'Minimum number of letters 8'
    },
}

export const priceProto = {
    required: 'The field is required!',
    valueAsNumber: true,
    max: {
        value: 50_000_000,
        message: 'Maximum numbers 50 000 000'
    },
    min: {
        value: 2_000,
        message: 'Minimum numbers 2 000'
    },
}

export const descriptionProto = {
    maxLength: {
        value: 300,
        message: 'Maximum number of letters 300'
    },
    minLength: {
        value: 20,
        message: 'Minimum number of letters 20'
    },
    pattern: {
        value: /^[A-Za-zА-Яа-яЁё\s]+$/,
        message: "String can only contain Latin, Cyrillic and spaces"
    },
}