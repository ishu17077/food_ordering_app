import { NextFunction, Request, Response } from "express"
import { body, validationResult } from "express-validator"

export const signUpValidationRules = () => {
    return [
        body("name", "Name is required!").notEmpty(),
        body("email", "Invalid Email").notEmpty().isEmail().normalizeEmail(),
        body("password", "Password is required (min 6 characters)")
            .if(body("auth_type").equals("email"))
            .notEmpty()
            .isLength({ min: 6 })
    ]
}

export const signInValidationRules = () => {
    return [
        body("name", "Name is required")
            .if(body("auth_type").not().equals("email")).notEmpty(),
        body("email", "Invalid Email").notEmpty().isEmail().normalizeEmail(),
        body("auth_type", "Auth Type is required").notEmpty(),
        body("password", "Password is required(min 6 characters)")
            .if(body("auth_type").equals("email"))
            .notEmpty()
            .isLength({ min: 6 }),

    ]
}

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors: any[] = []
    errors.array({ onlyFirstError: true })
        /**
         *? err.type is a variable containing a string (like "field" or "param").
           *? { [err.type]: err.msg } creates an object where the key is the value of err.type and the value is err.msg.
           *?  Example: If err.type is "email" and err.msg is "Invalid Email",
           *? then { [err.type]: err.msg } becomes { email: "Invalid Email" }.
         */
        .map((err) => extractedErrors.push({ [err.type]: err.msg }))

    return res.status(422).json({ errors: extractedErrors })
}