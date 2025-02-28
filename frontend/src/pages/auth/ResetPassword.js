import styles from './Auth.module.css';
import { ReactComponent as PasswordSVG } from '../../assets/images/password.svg';
import useFormFields from '../../hooks/useFormFields';
import TextInput from '../../components/inputFields/TextInput';
import MainButton from '../../components/button/MainButton';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validateEmail, resetPassword } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {

   const navigate = useNavigate();
   const dispatch = useDispatch();
   const initialValues = {
      email: '',
      password: '',
      password_confirmation: '',
   }
   const { fields, handleChange } = useFormFields(initialValues);
   const [isEmailValid, setIsEmailValid] = useState(false);
   const { validationErrors } = useSelector((state) => state.auth);

   // ----------------- Handle Submission -----------------
   const handleSubmission = async (e) => {
      e.preventDefault();
      if (!isEmailValid) {
         // Validate email
         try {
            await dispatch(validateEmail({ "email": fields.email })).unwrap();
            setIsEmailValid(true);
         } catch (err) {
            toast.error(err.error);
         }

      } else {
         // Reset password
         try {
            await dispatch(resetPassword(fields)).unwrap();
            toast.success("Your password has been successfully reset");
            setTimeout(() => {
               navigate('/login');
            }, 2000);
         } catch (err) {
            toast.error(err.error);
         }
      }
   };

   return (
      <div className='container'>
         <div className={styles.content_wrap}>

            {/* ------------- Left Section ------------- */}
            <div className={styles.section}>
               <h2> Reset Password </h2>
               {/* Text input fields */}
               <form>
                  {!isEmailValid ? (
                     <TextInput
                        label="Email"
                        value={fields['email']}
                        error={validationErrors['email'] ? validationErrors['email'][0] : ""}
                        onChange={(value) => handleChange('email', value)}
                     />
                  ) : (
                     <>
                        <TextInput
                           label="New Password"
                           value={fields['password']}
                           isPassword={true}
                           error={validationErrors['password'] ? validationErrors['password'][0] : ""}
                           onChange={(value) => handleChange('password', value)}
                        />
                        <TextInput
                           label="Password Confirmation"
                           value={fields['password_confirmation']}
                           isPassword={true}
                           error={validationErrors['password_confirmation'] ? validationErrors['password_confirmation'][0] : ""}
                           onChange={(value) => handleChange('password_confirmation', value)}
                        />
                     </>
                  )}
               </form>

               {/* Submit Button */}
               <div className={styles.btn_container}>
                  <MainButton
                     label={isEmailValid ? 'Reset Password' : 'Send'}
                     onClick={handleSubmission}
                  />
               </div>
            </div>

            {/* ------------- Right Section ------------- */}
            <div className={styles.section}>
               <div className={styles.rectangle} />
               <PasswordSVG className={styles.img} />
            </div>

         </div>
      </div>
   );
}

export default ResetPassword;