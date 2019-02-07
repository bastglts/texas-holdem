import { Validator } from 'vee-validate';
import Api from './Api';


/**
 * Checks that `model` does not already exists.
 *
 * Custom Vee-Validate rule that performs async backend validation of the `input`.
 *
 * @param model Model that needs to be checked (user or table).
 */
export default (model) => {
  Validator.extend('unique', {
    // Async validation, returns a Promise that resolves to a Boolean
    validate: input => Api()
      .post(`${model}/isunique`, { value: input })
      .then(response => ({
        valid: response.data.valid,
        data: {
          msg: response.data.msg,
        },
      })),

    // Error message to display if validate is false
    getMessage: (field, params, data) => data.msg,
  });
};
