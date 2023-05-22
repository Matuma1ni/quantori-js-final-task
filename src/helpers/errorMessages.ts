interface ErrorMessages {
    [key: string]: {field: string, message: string}
}

export const firebaseErrorMessages: ErrorMessages = {
    'auth/invalid-email': {
                            field: 'email',
                             message: 'Invalid email address'
                            },
    'auth/user-not-found': {
                            field: 'email',
                            message: 'User with the email not found'
                            },
    'auth/wrong-password': {
                            field: 'password',
                            message: 'Incorrect password'
                            },
    'auth/email-already-in-use' : {
                            field: 'email',
                            message: 'There is already an account with this email'
                            },
    'default': {
        field: 'email',
        message: 'Something went wrong. Please, try again'
    }
}