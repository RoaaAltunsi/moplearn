import styles from './Auth.module.css';
import { ReactComponent as SignupSVG } from '../../assets/images/signup.svg';
import useFormFields from '../../hooks/useFormFields';
import TextInput from '../../components/inputFields/TextInput';
import SelectInput from '../../components/inputFields/SelectInput';
import MainButton from '../../components/button/MainButton';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addUser } from '../../redux/slices/authSlice';

const textFields = [ 'Username', 'Email', 'Password', 'Password Confirmation' ];

function Signup() {

   const initialValues = {
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
      gender: '',
   }
   const dispatch = useDispatch();
   const { fields, handleChange } = useFormFields(initialValues);
   const { validationErrors, error } = useSelector((state) => state.auth);

   // --------------- Handle submit register form ---------------
   const handleSubmission = () => {
      dispatch(addUser(fields));
   };

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
                  {/* Selection input fields */}
                  <SelectInput
                     label={'Gender'}
                     value={fields['gender']}
                     options={['Male', 'Female']}
                     error={validationErrors['gender'] ? validationErrors['gender'][0] : ""}
                     onChange={(value) => handleChange('gender', value)}
                  />
               </form>

               {/* Display general error msg if it exist */}
               {!!error && (
                  <span className='error'> {error} </span>
               )}

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