import styles from './Auth.module.css';
import { ReactComponent as LoginSVG } from '../../assets/images/login.svg';
import TextInput from '../../components/inputFields/TextInput';
import MainButton from '../../components/button/MainButton';
import { Link } from 'react-router-dom';
import useFormFields from '../../hooks/useFormFields';

function Login() {

   const initialValues = {
      email: '',
      password: ''
   }
   const { fields, handleChange } = useFormFields(initialValues);

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
                     onChange={(value) => handleChange('email', value)}
                  />
                  <TextInput
                     label="Password"
                     value={fields['password']}
                     isPassword={true}
                     onChange={(value) => handleChange('password', value)}
                  />
               </form>

               {/* Forgot Password link */}
               <Link to="/" className={`${styles.text_link} ${styles.forgot_pass}`}> Forgot Password? </Link>

               {/* Submit Button */}
               <div className={styles.btn_container}>
                  <MainButton
                     label="Log in"
                     onClick={() => console.log("Button Clicked!")}
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