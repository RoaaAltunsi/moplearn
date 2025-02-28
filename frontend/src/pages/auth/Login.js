import styles from './Auth.module.css';
import { ReactComponent as LoginSVG } from '../../assets/images/login.svg';
import TextInput from '../../components/inputFields/TextInput';
import MainButton from '../../components/button/MainButton';
import { Link, useNavigate } from 'react-router-dom';
import useFormFields from '../../hooks/useFormFields';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { login } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';

function Login() {

   const initialValues = {
      email: '',
      password: ''
   };
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const { fields, handleChange } = useFormFields(initialValues);
   const { validationErrors, isAuthenticated } = useSelector((state) => state.auth);

   const handleSubmission = async (e) => {
      e.preventDefault();
      try {
         await dispatch(login(fields)).unwrap();
      } catch (err) {
         // Show error toast
         toast.error(err.error);
      }
   };

   // --------- Redirect to homepage after login ---------
   useEffect(() => {
      if (isAuthenticated) {
         navigate('/');
      }
   }, [isAuthenticated, navigate]);


   return (
      <div className='container'>
         <div className={styles.content_wrap}>

            {/* ------------- Left Section ------------- */}
            <div className={styles.section}>
               <h2> Log in </h2>
               {/* Text input fields */}
               <form>
                  <TextInput
                     label="Email"
                     value={fields['email']}
                     error={validationErrors['email'] ? validationErrors['email'][0] : ""}
                     onChange={(value) => handleChange('email', value)}
                  />
                  <TextInput
                     label="Password"
                     value={fields['password']}
                     isPassword={true}
                     error={validationErrors['password'] ? validationErrors['password'][0] : ""}
                     onChange={(value) => handleChange('password', value)}
                  />
               </form>

               {/* Forgot Password link */}
               <Link
                  to="/reset-password"
                  className={`${styles.text_link} ${styles.forgot_pass}`}
               >
                  Forgot Password?
               </Link>

               {/* Submit Button */}
               <div className={styles.btn_container}>
                  <MainButton
                     label="Log in"
                     onClick={handleSubmission}
                  />
               </div>

               {/* Sign up link */}
               <p> Don’t have an account?
                  <Link to="/signup" className={styles.text_link}> Sign up </Link>
               </p>
            </div>

            {/* ------------- Right Section ------------- */}
            <div className={styles.section}>
               <div className={styles.rectangle} />
               <LoginSVG className={styles.img} />
            </div>

         </div>
      </div>
   );
}

export default Login;