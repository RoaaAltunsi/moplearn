import styles from './ContributeForm.module.css';
import useFormFields from '../../hooks/useFormFields';
import { ReactComponent as MailboxSVG } from '../../assets/images/mailbox.svg';
import TextInput from '../../components/inputFields/TextInput';
import MainButton from '../../components/button/MainButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { submitForm } from '../../redux/slices/contributionFormSlice';
import { toast } from 'react-toastify';


function ContributeForm() {

   const dispatch = useDispatch();
   const initialValues = {
      logo: null,
      platform_name: '',
      phone_number: '',
      email: '',
      content: '',
   }
   const { fields, handleChange, resetFields } = useFormFields(initialValues);
   const { validationErrors } = useSelector((state) => state.contributionForm);

   // --------------- Handle upload logo image ---------------
   const handleUploadImage = (e) => {
      const file = e.target.files[0];
      if (file) {
         handleChange('logo', file);
      }
   };


   // ------------------ Handle submit form ------------------
   const handleSubmission = async (e) => {
      e.preventDefault();
      try {
         const formData = new FormData();
         for (const key in fields) {
            formData.append(key, fields[key]);
         }
         await dispatch(submitForm(formData)).unwrap();
         resetFields();
         toast.success("Contribution form created successfully");

      } catch (err) {
         toast.error(err.error);
      }
   }

   return (
      <div className='container'>
         <div className={styles.content_wrap}>

            {/* ---------------- Description ---------------- */}
            <div>
               <h2> Contribute with us </h2>
               <p> Spread your educational platform content, send us and we will contact you </p>
            </div>

            {/* ------------------ Content ------------------ */}
            <div className={styles.content}>
               <form className={styles.input_form}>
                  {/* Upload Platform Logo */}
                  <div className={styles.upload_container}>
                     <label
                        htmlFor="file-upload"
                        className={`${styles.upload_box} ${fields['logo'] ? styles.filled : ''}`}
                     >
                        <FontAwesomeIcon icon="fa-solid fa-image" />
                        <span>
                           {fields['logo'] ? fields['logo'].name : 'Click to Upload Platfrom Logo'}
                        </span>
                     </label>
                     
                     {validationErrors['logo'] && (
                        <span className='error'> {validationErrors['logo'][0]} </span>
                     )}

                     <input
                        type="file"
                        id="file-upload"
                        accept=".jpg, .jpeg, .png"
                        style={{ display: 'none' }}
                        onChange={handleUploadImage}
                     />
                  </div>

                  {/* Input Fields */}
                  <div className={styles.input_row}>
                     <TextInput
                        label="Platform Name"
                        value={fields['platform_name']}
                        error={validationErrors['platform_name'] ? validationErrors['platform_name'][0] : ""}
                        onChange={(value) => handleChange('platform_name', value)}
                     />
                     <TextInput
                        label="Phone Number"
                        value={fields['phone_number']}
                        placeholder="e.g. 966 xxx xxx xxx"
                        error={validationErrors['phone_number'] ? validationErrors['phone_number'][0] : ""}
                        onChange={(value) => handleChange('phone_number', value)}
                     />
                  </div>
                  <TextInput
                     label="Email"
                     value={fields['email']}
                     error={validationErrors['email'] ? validationErrors['email'][0] : ""}
                     onChange={(value) => handleChange('email', value)}
                  />
                  <div className={styles.textarea_container}>
                     <TextInput
                        label="Content"
                        value={fields['content']}
                        isMulitLine={true}
                        error={validationErrors['content'] ? validationErrors['content'][0] : ""}
                        onChange={(value) => handleChange('content', value)}
                     />
                  </div>

                  {/* Send Button */}
                  <div className={styles.btn_container}>
                     <MainButton
                        label="Submit"
                        onClick={handleSubmission}
                     />
                  </div>
               </form>

               {/* Image */}
               <div className={styles.img_container}>
                  <MailboxSVG className={styles.img} />
               </div>
            </div>

         </div>
      </div>
   );
}

export default ContributeForm;