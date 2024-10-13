import styles from './Auth.module.css';
import { ReactComponent as PasswordSVG } from '../../assets/images/password.svg';
import useFormFields from '../../hooks/useFormFields';
import TextInput from '../../components/inputFields/TextInput';
import MainButton from '../../components/button/MainButton';
import { useState } from 'react';

function ResetPassword() {

   const initialValues = {
      email: '',
      password: '',
      re_password: '',
   }
   const { fields, handleChange } = useFormFields(initialValues);
   const [isEmailValid, setIsEmailValid] = useState(false);

   // ----------------- Handle Submission -----------------
   // It will be modified later with the required logic from backend
   const handleSubmission = () => {
      if (!isEmailValid) {
         // Logic to validate email
         setIsEmailValid(true);
      } else {
         // Logic to reset password
      }
   }

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
                        onChange={(value) => handleChange('email', value)}
                     />
                  ) : (
                     <>
                        <TextInput
                           label="New Password"
                           value={fields['password']}
                           isPassword={true}
                           onChange={(value) => handleChange('password', value)}
                        />
                        <TextInput
                           label="Re New Password"
                           value={fields['re_password']}
                           isPassword={true}
                           onChange={(value) => handleChange('re_password', value)}
                        />
                     </>
                  )}
               </form>

               {/* Submit Button */}
               <div className={styles.btn_container}>
                  <MainButton
                     label={isEmailValid? 'Reset Password' : 'Send'}
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