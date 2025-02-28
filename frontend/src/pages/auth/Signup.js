import styles from './Auth.module.css';
import { ReactComponent as SignupSVG } from '../../assets/images/signup.svg';
import useFormFields from '../../hooks/useFormFields';
import TextInput from '../../components/inputFields/TextInput';
import MainButton from '../../components/button/MainButton';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register } from '../../redux/slices/authSlice';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const textFields = ['Username', 'Email', 'Password', 'Password Confirmation'];

function Signup() {

   const initialValues = {
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
   }
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { fields, handleChange } = useFormFields(initialValues);
   const { validationErrors, isAuthenticated } = useSelector((state) => state.auth);

   // --------------- Handle submit register form ---------------
   const handleSubmission = async (e) => {
      e.preventDefault();
      
      try {
         await dispatch(register(fields)).unwrap();
      } catch (error) {
         // Show error toast
         toast.error(error.error);
      }
   };

   // --------- Redirect to homepage after registration ---------
   useEffect(() => {
      if (isAuthenticated) {
         toast.success("Successful Registration!");
         setTimeout(() => {
            navigate('/');
         }, 2000);
      }
   }, [isAuthenticated, navigate]);


   return (
      <div className='container'>
         <div className={styles.content_wrap}>

            {/* ------------- Left Section ------------- */}
            <div className={styles.section}>
               <h2> Create Account </h2>
               <form>
                  {/* Text input fields */}
                  {textFields.map((item, index) => {
                     const labelkey = item.toLowerCase().replace(' ', '_');
                     return (
                        <TextInput
                           key={index}
                           label={item}
                           value={fields[labelkey]}
                           isPassword={labelkey === 'password' || labelkey === 'password_confirmation'}
                           error={validationErrors[labelkey] ? validationErrors[labelkey][0] : ""}
                           onChange={(value) => handleChange(labelkey, value)}
                        />
                     )
                  })}
               </form>

               {/* Submit Button */}
               <div className={styles.btn_container}>
                  <MainButton
                     label="Sign up"
                     onClick={handleSubmission}
                  />
               </div>

               {/* Log in link */}
               <p> Already have an account?
                  <Link to="/login" className={styles.text_link}> Log in </Link>
               </p>
            </div>

            {/* ------------- Right Section ------------- */}
            <div className={styles.section}>
               <div className={styles.rectangle} />
               <SignupSVG className={styles.img} />
            </div>

         </div>
      </div>
   );
}

export default Signup;