import styles from './Signup.module.css';
import { ReactComponent as SignupSVG } from '../../assets/images/signup.svg';
import useFormFields from '../../hooks/useFormFields';
import TextInput from '../../components/inputFields/TextInput';
import SelectInput from '../../components/inputFields/SelectInput';
import MainButton from '../../components/button/MainButton';

const textFields = [
   { label: 'Name' },
   { label: 'Email' },
   { label: 'Password' },
   { label: 'Re Password' },
   { label: 'Speciality', placeholder: 'e.g. Web developer' },
]

function Signup() {

   const initialValues = {
      name: '',
      email: '',
      password: '',
      re_password: '',
      speciality: '',
      gender: '',
   }
   const { fields, handleChange } = useFormFields(initialValues);

   return (
      <div className='container'>
         <div className={styles.content_wrap}>

            {/* ------------- Left Section ------------- */}
            <div className={styles.section}>
               <h2>Create Account</h2>
               <form>
                  {/* Text input fields */}
                  {textFields.map((item, index) => {
                     const labelkey = item.label.toLowerCase().replace(' ', '_');
                     return (
                        <TextInput
                           key={index}
                           label={item.label}
                           value={fields[labelkey]}
                           placeholder={item.placeholder}
                           isPassword={labelkey === 'password' || labelkey === 're_password'}
                           onChange={(value) => handleChange(labelkey, value)}
                        />
                     )
                  })}
                  {/* Selection input fields */}
                  <SelectInput
                     label={'Gender'}
                     value={fields['gender']}
                     options={['Male', 'Female']}
                     onChange={(value) => handleChange('gender', value)}
                  />
               </form>

               {/* Submit Button */}
               <div className={styles.btn_container}>
                  <MainButton
                     label="Submit"
                     onClick={() => console.log("Button Clicked!")}
                  />
               </div>
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