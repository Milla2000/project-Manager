const joi = require ('joi')

const loginSchema = joi.object({
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: joi.string().required()
})

const registerSchema = joi.object({
    full_name : joi.string().required().min(5).max(20).messages({
        'string.min': "name must have atleast 5 characters"
    }),
    email :joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    profile: joi.string(),
    password: joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
})

module.exports = {
    loginSchema,
    registerSchema
}   